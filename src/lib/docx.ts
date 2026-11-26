import { GapCell, DecodeResult } from './stegoTypes';
import { decodeBitStream } from './kerningStego';

export const DOCX_MIME =
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

/**
 * Word задаёт межбуквенный интервал в twips (1/20 пункта).
 * При 14pt один em = 280 twips, поэтому уровни 0.02/0.04/0.06em
 * округляются до 6/11/17 twips.
 */
const TWP_BY_LEVEL = [0, 6, 11, 17];
const FONT_SIZE_HALF_POINTS = 28; // 14pt

const W_NS = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
const CT_NS = 'http://schemas.openxmlformats.org/package/2006/content-types';
const REL_NS = 'http://schemas.openxmlformats.org/package/2006/relationships';
const OFFICE_DOC_REL =
  'http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument';
const DOCX_MAIN_TYPE =
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml';

const encoder = new TextEncoder();
const decoder = new TextDecoder('utf-8');

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function unescapeXml(value: string): string {
  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');
}

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(data: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    crc = CRC_TABLE[(crc ^ data[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

interface ZipEntry {
  name: string;
  data: Uint8Array;
}

/** ZIP без сжатия: docx небольшой, а STORE убирает зависимость от компрессора. */
function zipStore(entries: ZipEntry[]): Uint8Array {
  const chunks: Uint8Array[] = [];
  const central: Uint8Array[] = [];
  let offset = 0;

  const pushU16 = (target: number[], value: number) => {
    target.push(value & 0xff, (value >>> 8) & 0xff);
  };
  const pushU32 = (target: number[], value: number) => {
    target.push(value & 0xff, (value >>> 8) & 0xff, (value >>> 16) & 0xff, (value >>> 24) & 0xff);
  };

  for (const entry of entries) {
    const nameBytes = encoder.encode(entry.name);
    const crc = crc32(entry.data);

    const local: number[] = [];
    pushU32(local, 0x04034b50);
    pushU16(local, 20);
    pushU16(local, 0x0800);
    pushU16(local, 0);
    pushU16(local, 0);
    pushU16(local, 0);
    pushU32(local, crc);
    pushU32(local, entry.data.length);
    pushU32(local, entry.data.length);
    pushU16(local, nameBytes.length);
    pushU16(local, 0);
    const localHeader = new Uint8Array(local);
    chunks.push(localHeader, nameBytes, entry.data);

    const cd: number[] = [];
    pushU32(cd, 0x02014b50);
    pushU16(cd, 20);
    pushU16(cd, 20);
    pushU16(cd, 0x0800);
    pushU16(cd, 0);
    pushU16(cd, 0);
    pushU16(cd, 0);
    pushU32(cd, crc);
    pushU32(cd, entry.data.length);
    pushU32(cd, entry.data.length);
    pushU16(cd, nameBytes.length);
    pushU16(cd, 0);
    pushU16(cd, 0);
    pushU16(cd, 0);
    pushU16(cd, 0);
    pushU32(cd, 0);
    pushU32(cd, offset);
    const cdHeader = new Uint8Array(cd);
    central.push(cdHeader, nameBytes);

    offset += localHeader.length + nameBytes.length + entry.data.length;
  }

  const centralSize = central.reduce((sum, part) => sum + part.length, 0);
  const eocd: number[] = [];
  pushU32(eocd, 0x06054b50);
  pushU16(eocd, 0);
  pushU16(eocd, 0);
  pushU16(eocd, entries.length);
  pushU16(eocd, entries.length);
  pushU32(eocd, centralSize);
  pushU32(eocd, offset);
  pushU16(eocd, 0);
  const eocdBytes = new Uint8Array(eocd);

  const total = offset + centralSize + eocdBytes.length;
  const out = new Uint8Array(total);
  let cursor = 0;
  for (const part of [...chunks, ...central, eocdBytes]) {
    out.set(part, cursor);
    cursor += part.length;
  }
  return out;
}

function runXml(gap: GapCell): string {
  return (
    '<w:r><w:rPr>' +
    '<w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>' +
    `<w:spacing w:val="${TWP_BY_LEVEL[gap.level]}"/>` +
    `<w:sz w:val="${FONT_SIZE_HALF_POINTS}"/><w:szCs w:val="${FONT_SIZE_HALF_POINTS}"/>` +
    '</w:rPr>' +
    `<w:t xml:space="preserve">${escapeXml(gap.char)}</w:t>` +
    '</w:r>'
  );
}

function paragraphsXml(gaps: GapCell[]): string {
  const paragraphs: string[] = [];
  let current: string[] = [];

  for (const gap of gaps) {
    if (gap.char === '\n') {
      paragraphs.push(current.length ? `<w:p>${current.join('')}</w:p>` : '<w:p/>');
      current = [];
    } else {
      current.push(runXml(gap));
    }
  }

  paragraphs.push(current.length ? `<w:p>${current.join('')}</w:p>` : '<w:p/>');
  return paragraphs.join('');
}

export function buildDocxBytes(gaps: GapCell[]): Uint8Array {
  const documentXml =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    `<w:document xmlns:w="${W_NS}"><w:body>` +
    paragraphsXml(gaps) +
    '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/>' +
    '<w:pgMar w:top="1134" w:right="850" w:bottom="1134" w:left="1701" w:header="708" w:footer="708" w:gutter="0"/>' +
    '</w:sectPr></w:body></w:document>';

  const contentTypes =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    `<Types xmlns="${CT_NS}">` +
    '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
    '<Default Extension="xml" ContentType="application/xml"/>' +
    `<Override PartName="/word/document.xml" ContentType="${DOCX_MAIN_TYPE}"/>` +
    '</Types>';

  const rels =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    `<Relationships xmlns="${REL_NS}">` +
    `<Relationship Id="rId1" Type="${OFFICE_DOC_REL}" Target="word/document.xml"/>` +
    '</Relationships>';

  return zipStore([
    { name: '[Content_Types].xml', data: encoder.encode(contentTypes) },
    { name: '_rels/.rels', data: encoder.encode(rels) },
    { name: 'word/document.xml', data: encoder.encode(documentXml) },
  ]);
}

function findEndOfCentralDirectory(view: DataView): number {
  const min = Math.max(0, view.byteLength - 66000);
  for (let i = view.byteLength - 22; i >= min; i--) {
    if (view.getUint32(i, true) === 0x06054b50) return i;
  }
  return -1;
}

async function inflateRaw(data: Uint8Array): Promise<Uint8Array> {
  if (typeof DecompressionStream === 'undefined') {
    throw new Error('Браузер не поддерживает распаковку DOCX.');
  }
  const copy = new Uint8Array(data.byteLength);
  copy.set(data);
  const stream = new Blob([copy]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

async function extractDocumentXml(input: ArrayBuffer | Uint8Array): Promise<string> {
  const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const eocd = findEndOfCentralDirectory(view);
  if (eocd < 0) throw new Error('Это не DOCX: не найден ZIP-каталог.');

  const count = view.getUint16(eocd + 10, true);
  const cdOffset = view.getUint32(eocd + 16, true);
  let pointer = cdOffset;

  for (let i = 0; i < count; i++) {
    if (view.getUint32(pointer, true) !== 0x02014b50) break;
    const method = view.getUint16(pointer + 10, true);
    const compressedSize = view.getUint32(pointer + 20, true);
    const nameLength = view.getUint16(pointer + 28, true);
    const extraLength = view.getUint16(pointer + 30, true);
    const commentLength = view.getUint16(pointer + 32, true);
    const localOffset = view.getUint32(pointer + 42, true);
    const name = decoder.decode(bytes.subarray(pointer + 46, pointer + 46 + nameLength));

    if (name === 'word/document.xml') {
      const localNameLength = view.getUint16(localOffset + 26, true);
      const localExtraLength = view.getUint16(localOffset + 28, true);
      const start = localOffset + 30 + localNameLength + localExtraLength;
      const raw = bytes.subarray(start, start + compressedSize);
      const xmlBytes = method === 8 ? await inflateRaw(raw) : raw;
      return decoder.decode(xmlBytes);
    }

    pointer += 46 + nameLength + extraLength + commentLength;
  }

  throw new Error('В DOCX не найден word/document.xml.');
}

function levelFromTwips(value: number): number {
  let best = 0;
  for (let i = 1; i < TWP_BY_LEVEL.length; i++) {
    if (Math.abs(value - TWP_BY_LEVEL[i]) < Math.abs(value - TWP_BY_LEVEL[best])) best = i;
  }
  return best;
}

export async function decodeDocx(input: ArrayBuffer | Uint8Array): Promise<DecodeResult> {
  const fail = (error: string): DecodeResult => ({
    success: false,
    message: '',
    binaryBits: '',
    extractedBitsCount: 0,
    checksumValid: false,
    detectionMethod: 'docx-kerning',
    error,
  });

  try {
    const xml = await extractDocumentXml(input);
    const levels: number[] = [];
    const runRe = /<w:r(?:\s[^>]*)?>([\s\S]*?)<\/w:r>/g;
    let match: RegExpExecArray | null;

    while ((match = runRe.exec(xml)) !== null) {
      const block = match[1];
      const spacing = /<w:spacing[^>]*w:val="(-?\d+)"/.exec(block);
      if (!spacing) continue;

      const level = levelFromTwips(parseInt(spacing[1], 10));
      const text = /<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>/.exec(block);
      const chars = text ? Array.from(unescapeXml(text[1])).length : 1;
      for (let i = 0; i < Math.max(1, chars); i++) levels.push(level);
    }

    if (levels.length === 0) {
      return fail('В документе не найдены межбуквенные интервалы-носители.');
    }

    let bits = '';
    for (const level of levels) bits += level.toString(2).padStart(2, '0');

    return decodeBitStream(bits, levels.length, 'docx-kerning');
  } catch (error) {
    return fail(error instanceof Error ? error.message : 'Не удалось прочитать DOCX.');
  }
}

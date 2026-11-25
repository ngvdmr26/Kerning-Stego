import { StegoResult, DecodeResult, GapCell, TextStegoResult } from './stegoTypes';

/**
 * Каждый промежуток между двумя соседними символами несёт 2 бита.
 * Битовая пара задаёт один из четырёх уровней letter-spacing:
 * 00 -> 0em, 01 -> 0.02em, 10 -> 0.04em, 11 -> 0.06em.
 * Скрытое сообщение живёт именно в этих расстояниях — отдельного
 * хранилища (истории генераций, data-атрибутов) нет.
 */
export const GAP_STEP_EM = 0.02;
export const GAP_LEVELS = [0, 0.02, 0.04, 0.06];
export const BITS_PER_GAP = 2;
export const FONT_SIZE_PX = 16;

export const HEADER_BITS = 48;
const MAGIC_HEADER_NUM = 0x4b53; // 'KS'

const CHAR_LEGACY_BIT_0 = '\u200C';
const CHAR_LEGACY_BIT_1 = '\u200B';
const LEGACY_HEADER_MARKER = '\uFEFF\u200D';
const LEGACY_FOOTER_MARKER = '\u200D\uFEFF';

export function calculateCRC16(data: Uint8Array): number {
  let crc = 0xffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data[i] << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  return crc & 0xffff;
}

export function capacityBits(coverLength: number): number {
  return Math.max(0, coverLength - 1) * BITS_PER_GAP;
}

const EMPTY_RESULT = (error: string, coverLength = 0): StegoResult => ({
  success: false,
  containerHtml: '',
  documentHtml: '',
  plainText: '',
  gaps: [],
  binaryBits: '',
  charCount: 0,
  secretLength: 0,
  coverLength,
  bitsUsed: 0,
  maxCapacityBits: capacityBits(coverLength),
  payloadBytes: 0,
  checksum: 0,
  error,
});

export function encodeKerning(coverText: string, secretText: string): StegoResult {
  const cover = coverText.replace(/^\s+|\s+$/g, '');
  const secret = secretText.replace(/^\s+|\s+$/g, '');

  if (!cover) return EMPTY_RESULT('Введите исходный текст, в котором будет спрятано сообщение.');
  if (!secret) return EMPTY_RESULT('Введите секретное сообщение для скрытия.', Array.from(cover).length);

  const bytes = new TextEncoder().encode(secret);
  const checksum = calculateCRC16(bytes);

  const header =
    MAGIC_HEADER_NUM.toString(2).padStart(16, '0') +
    bytes.length.toString(2).padStart(16, '0') +
    checksum.toString(2).padStart(16, '0');
  let payload = '';
  for (let i = 0; i < bytes.length; i++) payload += bytes[i].toString(2).padStart(8, '0');

  const bits = header + payload;
  const chars = Array.from(cover);
  const limit = capacityBits(chars.length);

  if (bits.length > limit) {
    const freeBytes = Math.max(0, Math.floor((limit - HEADER_BITS) / 8));
    return EMPTY_RESULT(
      `Не хватает ёмкости: сообщение занимает ${Math.ceil(bits.length / 8)} байт (${bits.length} бит), а текст вмещает ${Math.max(0, freeBytes)} байт (${limit} бит). Увеличьте исходный текст или сократите сообщение.`,
      chars.length
    );
  }

  // Дополняем до целого числа битовых пар, чтобы последний зазор читался однозначно.
  const padded = bits.length % BITS_PER_GAP === 0 ? bits : bits + '0';

  const gaps: GapCell[] = [];
  let html = '';

  for (let i = 0; i < chars.length; i++) {
    let level = 0;

    if (i < chars.length - 1) {
      const start = i * BITS_PER_GAP;
      const bitsForGap = start + BITS_PER_GAP <= padded.length ? padded.slice(start, start + BITS_PER_GAP) : '';
      level = bitsForGap ? parseInt(bitsForGap, 2) : 0;
      gaps.push({
        char: chars[i],
        spacingEm: GAP_LEVELS[level],
        spacingPx: Number((GAP_LEVELS[level] * FONT_SIZE_PX).toFixed(2)),
        level,
        bits: bitsForGap,
      });
    } else {
      gaps.push({ char: chars[i], spacingEm: 0, spacingPx: 0, level: 0, bits: '' });
    }

    html += `<span style="letter-spacing:${GAP_LEVELS[level].toFixed(2)}em">${escapeHtml(chars[i])}</span>`;
  }

  return {
    success: true,
    containerHtml: html,
    documentHtml: buildDocument(html),
    plainText: cover,
    gaps,
    binaryBits: bits,
    charCount: cover.length,
    secretLength: Array.from(secret).length,
    coverLength: chars.length,
    bitsUsed: bits.length,
    maxCapacityBits: limit,
    payloadBytes: bytes.length,
    checksum,
  };
}

export const TEXT_BITS_PER_CHAR = 8;

export function textCapacityBits(coverLength: number): number {
  return Math.max(0, coverLength) * TEXT_BITS_PER_CHAR;
}

/**
 * Текстовый носитель: биты живут в невидимых символах нулевой ширины,
 * которые остаются частью строки при копировании в мессенджер или файл.
 * Кёрнинг так не умеет — он существует только в форматировании.
 */
export function encodeTextCarrier(coverText: string, secretText: string): TextStegoResult {
  const cover = coverText.replace(/^\s+|\s+$/g, '');
  const secret = secretText.replace(/^\s+|\s+$/g, '');
  const chars = Array.from(cover);
  const limit = textCapacityBits(chars.length);

  const fail = (error: string): TextStegoResult => ({
    success: false,
    text: '',
    binaryBits: '',
    bitsUsed: 0,
    maxCapacityBits: limit,
    payloadBytes: 0,
    checksum: 0,
    error,
  });

  if (!cover) return fail('Введите исходный текст, в котором будет спрятано сообщение.');
  if (!secret) return fail('Введите секретное сообщение для скрытия.');

  const bytes = new TextEncoder().encode(secret);
  const checksum = calculateCRC16(bytes);
  const header =
    MAGIC_HEADER_NUM.toString(2).padStart(16, '0') +
    bytes.length.toString(2).padStart(16, '0') +
    checksum.toString(2).padStart(16, '0');
  let payload = '';
  for (let i = 0; i < bytes.length; i++) payload += bytes[i].toString(2).padStart(8, '0');

  const bits = header + payload;
  if (bits.length > limit) {
    const freeBytes = Math.max(0, Math.floor((limit - HEADER_BITS) / 8));
    return fail(
      `Не хватает ёмкости: сообщение занимает ${Math.ceil(bits.length / 8)} байт (${bits.length} бит), а текст вмещает ${freeBytes} байт (${limit} бит). Увеличьте текст или сократите сообщение.`
    );
  }

  const perChar = Math.ceil(bits.length / chars.length);
  let out = LEGACY_HEADER_MARKER;
  let idx = 0;

  for (const ch of chars) {
    out += ch;
    for (let k = 0; k < perChar && idx < bits.length; k++) {
      out += bits[idx++] === '1' ? CHAR_LEGACY_BIT_1 : CHAR_LEGACY_BIT_0;
    }
  }

  out += LEGACY_FOOTER_MARKER;

  return {
    success: true,
    text: out,
    binaryBits: bits,
    bitsUsed: bits.length,
    maxCapacityBits: limit,
    payloadBytes: bytes.length,
    checksum,
  };
}

export function decodeKerning(input: string): DecodeResult {
  if (!input.trim()) {
    return {
      success: false,
      message: '',
      binaryBits: '',
      extractedBitsCount: 0,
      checksumValid: false,
      detectionMethod: 'none',
      error: 'Вставьте контейнер (HTML с letter-spacing) для извлечения сообщения.',
    };
  }

  const levels = extractGapLevels(input);
    if (levels.length > 0) {
      let bits = '';
      for (const level of levels) bits += level.toString(2).padStart(BITS_PER_GAP, '0');
      return decodeBits(bits, input.length, 'kerning-html');
    }

    const legacyBits = extractLegacyBits(input);
    if (legacyBits.length >= HEADER_BITS) {
      return decodeBits(legacyBits, input.length, 'text-unicode');
    }

  return {
    success: false,
    message: '',
    binaryBits: '',
    extractedBitsCount: 0,
    checksumValid: false,
    detectionMethod: 'none',
    error:
      'В тексте нет межбуквенных интервалов-носителей. При копировании обычным текстом кёрнинг теряется — вставляйте HTML-контейнер целиком или откройте сохранённый .html-файл.',
  };
}

/**
 * Читает пары "символ + letter-spacing" из разметки контейнера.
 * Именно эти расстояния и являются носителем битов.
 */
function extractGapLevels(html: string): number[] {
  const levels: number[] = [];
  const spanRe = /<span\b[^>]*style\s*=\s*"([^"]*)"[^>]*>/gi;
  let match: RegExpExecArray | null;

  while ((match = spanRe.exec(html)) !== null) {
    const spacing = /(?:^|;)\s*letter-spacing\s*:\s*(-?\d+(?:\.\d+)?)\s*em/i.exec(match[1]);
    if (!spacing) continue;
    const em = parseFloat(spacing[1]);
    const level = Math.round(em / GAP_STEP_EM);
    if (level < 0 || level >= GAP_LEVELS.length) continue;
    if (Math.abs(em - level * GAP_STEP_EM) > 0.004) continue;
    levels.push(level);
  }

  return levels;
}

function extractLegacyBits(raw: string): string {
  let content = raw;
  const start = raw.indexOf(LEGACY_HEADER_MARKER);
  if (start !== -1) {
    const from = start + LEGACY_HEADER_MARKER.length;
    const end = raw.indexOf(LEGACY_FOOTER_MARKER, from);
    content = end !== -1 ? raw.slice(from, end) : raw.slice(from);
  }

  let bits = '';
  for (const ch of content) {
    if (ch === CHAR_LEGACY_BIT_1) bits += '1';
    else if (ch === CHAR_LEGACY_BIT_0) bits += '0';
  }
  return bits;
}

function decodeBits(
  bits: string,
  rawLength: number,
  method: DecodeResult['detectionMethod'] = 'kerning-html'
): DecodeResult {
  if (bits.length < HEADER_BITS) {
    return {
      success: false,
      message: '',
      binaryBits: bits,
      extractedBitsCount: bits.length,
      checksumValid: false,
      detectionMethod: method,
      error: 'Недостаточно данных для извлечения (заголовок повреждён).',
    };
  }

  const magic = parseInt(bits.slice(0, 16), 2);
  const byteLength = parseInt(bits.slice(16, 32), 2);
  const expectedCrc = parseInt(bits.slice(32, 48), 2);

  if (magic !== MAGIC_HEADER_NUM) {
    return {
      success: false,
      message: '',
      binaryBits: bits,
      extractedBitsCount: bits.length,
      checksumValid: false,
      detectionMethod: method,
      error: 'Сигнатура Kerning Stego не распознана. Эти интервалы не содержат валидного контейнера.',
      diagnostics: { coverCharacters: rawLength, markersFound: bits.length },
    };
  }

  const payloadBits = bits.slice(HEADER_BITS, HEADER_BITS + byteLength * 8);
  if (payloadBits.length < byteLength * 8) {
    return {
      success: false,
      message: '',
      binaryBits: bits,
      extractedBitsCount: bits.length,
      checksumValid: false,
      detectionMethod: method,
      error: `Сообщение повреждено: ожидалось ${byteLength} байт, найдено ${Math.floor(payloadBits.length / 8)} байт.`,
    };
  }

  const bytes = new Uint8Array(byteLength);
  for (let i = 0; i < byteLength; i++) {
    bytes[i] = parseInt(payloadBits.slice(i * 8, (i + 1) * 8), 2);
  }

  const calculatedCrc = calculateCRC16(bytes);
  const checksumValid = calculatedCrc === expectedCrc;

  try {
    const message = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    return {
      success: true,
      message,
      binaryBits: bits,
      extractedBitsCount: bits.length,
      checksumValid,
      detectionMethod: method,
      diagnostics: {
        coverCharacters: rawLength,
        markersFound: bits.length,
        payloadLengthFound: byteLength,
        calculatedChecksum: calculatedCrc,
        expectedChecksum: expectedCrc,
      },
    };
  } catch {
    return {
      success: false,
      message: '',
      binaryBits: bits,
      extractedBitsCount: bits.length,
      checksumValid: false,
      detectionMethod: method,
      error: 'Ошибка декодирования UTF-8: интервалы были изменены после создания контейнера.',
    };
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function buildDocument(spans: string): string {
  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Документ</title>
  <style>
    body {
      max-width: 760px;
      margin: 48px auto;
      padding: 0 20px;
      background: #ffffff;
      color: #1b1b1b;
      font: 16px/1.9 Georgia, 'Times New Roman', serif;
    }
    p { margin: 0; white-space: pre-wrap; }
  </style>
</head>
<body>
  <p>${spans}</p>
</body>
</html>`;
}

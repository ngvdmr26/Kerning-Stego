import { StegoResult, DecodeResult, TextSpanAnalysis } from './stegoTypes';

// Special Unicode zero-width characters representing kerning shifts
export const CHAR_BIT_0 = '\u200C'; // Zero Width Non-Joiner (narrow / standard kerning)
export const CHAR_BIT_1 = '\u200B'; // Zero Width Space (expanded / wide kerning)
export const HEADER_MARKER = '\uFEFF\u200D'; // Magic prefix: BOM + ZWJ
export const FOOTER_MARKER = '\u200D\uFEFF'; // Magic suffix: ZWJ + BOM
const MAGIC_HEADER_NUM = 0x4B53; // 'KS' in ASCII (Kerning Stego)

/**
 * Computes a standard 16-bit CRC checksum for payload verification
 */
export function calculateCRC16(data: Uint8Array): number {
  let crc = 0xFFFF;
  for (let i = 0; i < data.length; i++) {
    crc ^= data[i] << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xFFFF;
      } else {
        crc = (crc << 1) & 0xFFFF;
      }
    }
  }
  return crc & 0xFFFF;
}

/**
 * Encodes string to UTF-8 bits string ('0101...')
 */
export function stringToBits(str: string): { bits: string; bytes: Uint8Array; checksum: number } {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);
  const checksum = calculateCRC16(bytes);

  // Header: 16-bit Magic (0x4B53) + 16-bit length (number of bytes) + 16-bit CRC
  const magicBits = MAGIC_HEADER_NUM.toString(2).padStart(16, '0');
  const lengthBits = bytes.length.toString(2).padStart(16, '0');
  const crcBits = checksum.toString(2).padStart(16, '0');

  let payloadBits = '';
  for (let i = 0; i < bytes.length; i++) {
    payloadBits += bytes[i].toString(2).padStart(8, '0');
  }

  const fullBits = magicBits + lengthBits + crcBits + payloadBits;
  return { bits: fullBits, bytes, checksum };
}

/**
 * Embeds secret message into cover text using Kerning Steganography
 */
export function encodeKerning(coverText: string, secretText: string): StegoResult {
  const cleanCover = coverText.trim();
  const cleanSecret = secretText.trim();

  if (!cleanCover) {
    return {
      success: false,
      encodedText: '',
      htmlOutput: '',
      binaryBits: '',
      charCount: 0,
      secretLength: 0,
      coverLength: 0,
      bitsUsed: 0,
      maxCapacityBits: 0,
      checksum: 0,
      error: 'Введите исходный текст-обёртку.',
    };
  }

  if (!cleanSecret) {
    return {
      success: false,
      encodedText: '',
      htmlOutput: '',
      binaryBits: '',
      charCount: 0,
      secretLength: 0,
      coverLength: cleanCover.length,
      bitsUsed: 0,
      maxCapacityBits: cleanCover.length,
      checksum: 0,
      error: 'Введите секретное сообщение для скрытия.',
    };
  }

  const { bits: fullBits, bytes, checksum } = stringToBits(cleanSecret);
  const totalBitsNeeded = fullBits.length;
  const coverChars = Array.from(cleanCover);
  const maxCapacityBits = coverChars.length;

  if (totalBitsNeeded > maxCapacityBits) {
    const bytesNeeded = bytes.length;
    const minCoverChars = totalBitsNeeded;
    return {
      success: false,
      encodedText: '',
      htmlOutput: '',
      binaryBits: fullBits,
      charCount: 0,
      secretLength: cleanSecret.length,
      coverLength: coverChars.length,
      bitsUsed: 0,
      maxCapacityBits,
      checksum,
      error: `Исходный текст слишком короткий. Для сообщения (${bytesNeeded} байт + заголовок = ${totalBitsNeeded} бит) требуется не менее ${minCoverChars} символов в исходном тексте. Сейчас в тексте: ${coverChars.length}.`,
    };
  }

  // Interleave bits into cover text
  let encodedText = HEADER_MARKER;
  let htmlSpans = '';

  for (let i = 0; i < coverChars.length; i++) {
    const char = coverChars[i];
    encodedText += char;

    if (i < totalBitsNeeded) {
      const bit = fullBits[i];
      if (bit === '1') {
        encodedText += CHAR_BIT_1; // Wide kerning indicator
        htmlSpans += `<span class="k-bit-1" data-k="1" style="letter-spacing: 0.12em;">${escapeHtml(char)}</span>`;
      } else {
        encodedText += CHAR_BIT_0; // Narrow kerning indicator
        htmlSpans += `<span class="k-bit-0" data-k="0" style="letter-spacing: -0.015em;">${escapeHtml(char)}</span>`;
      }
    } else {
      // Remaining chars without hidden bits
      htmlSpans += `<span>${escapeHtml(char)}</span>`;
    }
  }

  encodedText += FOOTER_MARKER;

  // Generate full standalone styled HTML file template
  const fullHtmlDocument = generateStandaloneHtml(htmlSpans, cleanCover.length, cleanSecret.length, totalBitsNeeded);

  return {
    success: true,
    encodedText,
    htmlOutput: fullHtmlDocument,
    binaryBits: fullBits,
    charCount: encodedText.length,
    secretLength: cleanSecret.length,
    coverLength: coverChars.length,
    bitsUsed: totalBitsNeeded,
    maxCapacityBits,
    checksum,
  };
}

/**
 * Extracts secret message from an encoded text or HTML snippet
 */
export function decodeKerning(input: string): DecodeResult {
  const raw = input.trim();
  if (!raw) {
    return {
      success: false,
      message: '',
      binaryBits: '',
      extractedBitsCount: 0,
      checksumValid: false,
      detectionMethod: 'none',
      error: 'Вставьте текст или HTML для извлечения сообщения.',
    };
  }

  // Method A: Check for HTML Kerning spans with data-k attributes or kerning classes
  if (raw.includes('data-k="') || raw.includes('k-bit-')) {
    const htmlBits = extractBitsFromHtml(raw);
    if (htmlBits.length >= 48) {
      const decoded = decodeBits(htmlBits, 'html-kerning', raw.length);
      if (decoded.success) return decoded;
    }
  }

  // Method B: Check for Unicode zero-width kerning markers
  const unicodeBits: string[] = [];
  let foundStart = false;
  let foundEnd = false;

  // Check if markers exist
  const hasSentinels = raw.includes(HEADER_MARKER);

  if (hasSentinels) {
    const startIndex = raw.indexOf(HEADER_MARKER) + HEADER_MARKER.length;
    const endIndex = raw.indexOf(FOOTER_MARKER, startIndex);
    const content = endIndex !== -1 ? raw.slice(startIndex, endIndex) : raw.slice(startIndex);

    for (const ch of content) {
      if (ch === CHAR_BIT_1) unicodeBits.push('1');
      else if (ch === CHAR_BIT_0) unicodeBits.push('0');
    }
    foundStart = true;
    foundEnd = endIndex !== -1;
  } else {
    // Fallback: search for any sequence of bit chars
    for (const ch of raw) {
      if (ch === CHAR_BIT_1) unicodeBits.push('1');
      else if (ch === CHAR_BIT_0) unicodeBits.push('0');
    }
  }

  if (unicodeBits.length < 48) {
    return {
      success: false,
      message: '',
      binaryBits: unicodeBits.join(''),
      extractedBitsCount: unicodeBits.length,
      checksumValid: false,
      detectionMethod: 'none',
      error: 'Скрытое сообщение не обнаружено. В тексте отсутствуют маркеры кёрнинга метода Kerning Stego.',
      diagnostics: {
        coverCharacters: raw.length,
        markersFound: unicodeBits.length,
      },
    };
  }

  return decodeBits(unicodeBits.join(''), 'unicode-kerning', raw.length, foundStart && foundEnd);
}

/**
 * Parses raw bits: reads Magic, Length, CRC, and Payload
 */
function decodeBits(
  bits: string,
  method: 'unicode-kerning' | 'html-kerning',
  rawLength: number,
  _hasBoundaryMarkers: boolean = true
): DecodeResult {
  if (bits.length < 48) {
    return {
      success: false,
      message: '',
      binaryBits: bits,
      extractedBitsCount: bits.length,
      checksumValid: false,
      detectionMethod: method,
      error: 'Недостаточно служебных данных (заголовок повреждён).',
    };
  }

  // Parse header
  const magicBits = bits.slice(0, 16);
  const lengthBits = bits.slice(16, 32);
  const crcBits = bits.slice(32, 48);

  const magic = parseInt(magicBits, 2);
  const byteLength = parseInt(lengthBits, 2);
  const expectedCrc = parseInt(crcBits, 2);

  if (magic !== MAGIC_HEADER_NUM) {
    return {
      success: false,
      message: '',
      binaryBits: bits,
      extractedBitsCount: bits.length,
      checksumValid: false,
      detectionMethod: method,
      error: 'Сигнатура Kerning Stego не совпадает. Возможно, текст повреждён или закодирован другой версией.',
      diagnostics: {
        coverCharacters: rawLength,
        markersFound: bits.length,
      },
    };
  }

  const payloadBitsNeeded = byteLength * 8;
  const payloadBits = bits.slice(48, 48 + payloadBitsNeeded);

  if (payloadBits.length < payloadBitsNeeded) {
    return {
      success: false,
      message: '',
      binaryBits: bits,
      extractedBitsCount: bits.length,
      checksumValid: false,
      detectionMethod: method,
      error: `Сообщение неполное: ожидалось ${byteLength} байт (${payloadBitsNeeded} бит), но найдено только ${payloadBits.length} бит.`,
    };
  }

  // Convert payload bits to byte array
  const bytes = new Uint8Array(byteLength);
  for (let i = 0; i < byteLength; i++) {
    const byteStr = payloadBits.slice(i * 8, (i + 1) * 8);
    bytes[i] = parseInt(byteStr, 2);
  }

  // Calculate actual CRC
  const calculatedCrc = calculateCRC16(bytes);
  const checksumValid = calculatedCrc === expectedCrc;

  try {
    const decoder = new TextDecoder('utf-8', { fatal: true });
    const decodedMessage = decoder.decode(bytes);

    return {
      success: true,
      message: decodedMessage,
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
      error: 'Ошибка декодирования UTF-8. Символы были повреждены при передаче.',
    };
  }
}

/**
 * Extracts binary bits from HTML markup containing data-k="0" or data-k="1"
 */
function extractBitsFromHtml(html: string): string {
  const regex = /data-k=["']([01])["']/g;
  let match;
  let bits = '';
  while ((match = regex.exec(html)) !== null) {
    bits += match[1];
  }
  return bits;
}

/**
 * Escapes HTML characters for safe rendering
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Generates standalone HTML document preserving exact kerning
 */
function generateStandaloneHtml(
  spansContent: string,
  coverLen: number,
  _secretLen: number,
  bitsCount: number
): string {
  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Kerning Stego Document</title>
  <style>
    body {
      background: #080B0D;
      color: #F5F7F5;
      font-family: 'Inter', system-ui, sans-serif;
      padding: 40px 24px;
      line-height: 1.8;
      max-width: 800px;
      margin: 0 auto;
    }
    .card {
      background: #171C22;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 16px;
      padding: 28px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }
    .header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
      color: #8BF58D;
      font-weight: 700;
    }
    .content {
      font-size: 1.15rem;
      letter-spacing: normal;
    }
    .k-bit-0 { letter-spacing: -0.015em; }
    .k-bit-1 { letter-spacing: 0.12em; }
    .badge {
      display: inline-block;
      font-size: 0.8rem;
      color: #92999F;
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid rgba(255,255,255,0.08);
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <span>🔏 Kerning Stego Container</span>
    </div>
    <div class="content">
      ${spansContent}
    </div>
    <div class="badge">
      Защищено методом Кёрнинга · Бит внедрено: ${bitsCount} · Длина текста: ${coverLen}
    </div>
  </div>
</body>
</html>`;
}

/**
 * Breaks down text into individual spans for interactive UI Kerning Inspector
 */
export function analyzeKerningSpans(encodedText: string): TextSpanAnalysis[] {
  const result: TextSpanAnalysis[] = [];
  const chars = Array.from(encodedText);

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    // Skip sentinels
    if (ch === '\uFEFF' || ch === '\u200D') continue;

    // Check next char for bit
    const nextChar = chars[i + 1];
    if (nextChar === CHAR_BIT_1) {
      result.push({ char: ch, bit: 1, spacing: '+0.12em (Wide)' });
      i++; // skip bit char
    } else if (nextChar === CHAR_BIT_0) {
      result.push({ char: ch, bit: 0, spacing: '-0.015em (Narrow)' });
      i++; // skip bit char
    } else if (ch !== CHAR_BIT_1 && ch !== CHAR_BIT_0) {
      result.push({ char: ch, bit: null, spacing: 'normal' });
    }
  }

  return result;
}

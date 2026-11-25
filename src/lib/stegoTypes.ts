export interface GapCell {
  char: string;
  spacingEm: number;
  spacingPx: number;
  level: number;
  bits: string;
}

export interface StegoResult {
  success: boolean;
  containerHtml: string;
  documentHtml: string;
  plainText: string;
  gaps: GapCell[];
  binaryBits: string;
  charCount: number;
  secretLength: number;
  coverLength: number;
  bitsUsed: number;
  maxCapacityBits: number;
  payloadBytes: number;
  checksum: number;
  error?: string;
}

export interface TextStegoResult {
  success: boolean;
  text: string;
  binaryBits: string;
  bitsUsed: number;
  maxCapacityBits: number;
  payloadBytes: number;
  checksum: number;
  error?: string;
}

export interface DecodeResult {
  success: boolean;
  message: string;
  binaryBits: string;
  extractedBitsCount: number;
  checksumValid: boolean;
  detectionMethod: 'kerning-html' | 'text-unicode' | 'none';
  error?: string;
  diagnostics?: {
    coverCharacters: number;
    markersFound: number;
    payloadLengthFound?: number;
    calculatedChecksum?: number;
    expectedChecksum?: number;
  };
}

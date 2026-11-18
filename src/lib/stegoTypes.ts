export interface StegoResult {
  success: boolean;
  encodedText: string;
  htmlOutput: string;
  binaryBits: string;
  charCount: number;
  secretLength: number;
  coverLength: number;
  bitsUsed: number;
  maxCapacityBits: number;
  checksum: number;
  error?: string;
}

export interface DecodeResult {
  success: boolean;
  message: string;
  binaryBits: string;
  extractedBitsCount: number;
  checksumValid: boolean;
  detectionMethod: 'unicode-kerning' | 'html-kerning' | 'none';
  error?: string;
  diagnostics?: {
    coverCharacters: number;
    markersFound: number;
    payloadLengthFound?: number;
    calculatedChecksum?: number;
    expectedChecksum?: number;
  };
}

export interface TextSpanAnalysis {
  char: string;
  bit: 0 | 1 | null; // null if not carrying a bit
  spacing: string;
}

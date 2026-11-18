import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Eye, 
  ArrowRight, 
  Copy, 
  Check, 
  Download, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  FileCode, 
  Binary,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { encodeKerning, decodeKerning, analyzeKerningSpans } from '../lib/kerningStego';
import { StegoResult, DecodeResult, TextSpanAnalysis } from '../lib/stegoTypes';

export const ToolPage: React.FC = () => {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  // Encode state
  const [coverText, setCoverText] = useState(
    'Информационная безопасность — это процесс защиты информации от несанкционированного доступа, использования, раскрытия, уничтожения, модификации или нарушения целостности данных в современных компьютерных сетях.'
  );
  const [secretText, setSecretText] = useState('Секретная операция K-26');
  const [encodeResult, setEncodeResult] = useState<StegoResult | null>(null);
  const [copiedEncode, setCopiedEncode] = useState(false);
  const [showInspector, setShowInspector] = useState(false);
  const [inspectedSpans, setInspectedSpans] = useState<TextSpanAnalysis[]>([]);

  // Decode state
  const [cipherInput, setCipherInput] = useState('');
  const [decodeResult, setDecodeResult] = useState<DecodeResult | null>(null);
  const [copiedDecode, setCopiedDecode] = useState(false);
  const [isDecoding, setIsDecoding] = useState(false);

  // Auto calculate capacity
  const coverCharCount = Array.from(coverText).length;
  const secretCharCount = Array.from(secretText).length;
  // Each secret char is UTF-8 (1-2 bytes). In Russian, 1 char = 2 bytes = 16 bits. Header is 48 bits.
  const estimatedBits = 48 + secretCharCount * 16;
  const capacityPercent = Math.min(100, Math.round((estimatedBits / Math.max(1, coverCharCount)) * 100));

  // Run initial encode on mount
  useEffect(() => {
    if (coverText && secretText) {
      handleEncode();
    }
  }, []);

  const handleEncode = () => {
    const res = encodeKerning(coverText, secretText);
    setEncodeResult(res);
    if (res.success) {
      setInspectedSpans(analyzeKerningSpans(res.encodedText));
      // Pre-fill decode input for seamless testing
      setCipherInput(res.encodedText);
    }
  };

  const handleDecode = () => {
    setIsDecoding(true);
    setTimeout(() => {
      const res = decodeKerning(cipherInput);
      setDecodeResult(res);
      setIsDecoding(false);
      if (res.success) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#8BF58D', '#B4FFB4', '#5FE7C8'],
        });
      }
    }, 200);
  };

  const copyToClipboard = (text: string, type: 'encode' | 'decode') => {
    navigator.clipboard.writeText(text);
    if (type === 'encode') {
      setCopiedEncode(true);
      setTimeout(() => setCopiedEncode(false), 2000);
    } else {
      setCopiedDecode(true);
      setTimeout(() => setCopiedDecode(false), 2000);
    }
  };

  const downloadFile = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header & 3D Floating Lock Tile */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F5F7F5] tracking-tight mb-3">
              Инструмент <br className="hidden sm:inline" />
              для скрытых сообщений
            </h1>
            <p className="text-[#92999F] text-sm sm:text-base max-w-xl">
              Введите текст и получите сообщение, которое невозможно заметить при обычном чтении.
            </p>
          </div>

          {/* Right Floating 3D Lock Element matching Reference */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative group">
              <div className="absolute inset-0 rounded-2xl bg-[#8BF58D]/20 blur-xl opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="relative w-28 h-28 rounded-3xl bg-[#171C22]/90 border border-white/[0.14] shadow-2xl backdrop-blur-xl flex items-center justify-center overflow-hidden">
                <img 
                  src="/assets/tool-lock-tile.jpg" 
                  alt="3D Lock Tile" 
                  className="w-full h-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback to stylized SVG icon if image not yet loaded
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Lock className="w-10 h-10 text-[#8BF58D] drop-shadow-[0_0_12px_rgba(139,245,141,0.6)]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center gap-2 mb-8 bg-[#12161B] p-1.5 rounded-2xl border border-white/[0.08] w-fit">
          <button
            onClick={() => setMode('encode')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              mode === 'encode'
                ? 'bg-[#171C22] text-[#8BF58D] shadow-glow-sm border border-white/[0.08]'
                : 'text-[#92999F] hover:text-[#F5F7F5]'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Скрыть сообщение</span>
          </button>

          <button
            onClick={() => setMode('decode')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              mode === 'decode'
                ? 'bg-[#171C22] text-[#8BF58D] shadow-glow-sm border border-white/[0.08]'
                : 'text-[#92999F] hover:text-[#F5F7F5]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Извлечь сообщение</span>
          </button>
        </div>

        {/* ================= MODE: ENCODE ================= */}
        {mode === 'encode' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            
            {/* Left Card: Input Form */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col gap-6">
              
              {/* Field 1: Исходный текст */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="flex items-center gap-2 text-sm font-semibold text-[#F5F7F5]">
                    <Lock className="w-4 h-4 text-[#8BF58D]" />
                    <span>Исходный текст</span>
                  </label>
                  <span className="text-xs text-[#92999F] font-mono">
                    {coverCharCount} / 1000
                  </span>
                </div>
                <textarea
                  value={coverText}
                  onChange={(e) => setCoverText(e.target.value)}
                  placeholder="Введите текст..."
                  maxLength={1000}
                  rows={4}
                  className="w-full rounded-2xl bg-[#101418] border border-white/[0.1] px-4 py-3.5 text-sm text-[#F5F7F5] placeholder-[#62686F] focus:outline-none focus:border-[#8BF58D]/60 focus:ring-1 focus:ring-[#8BF58D]/30 transition-all resize-y"
                />
              </div>

              {/* Field 2: Скрытое сообщение */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="flex items-center gap-2 text-sm font-semibold text-[#F5F7F5]">
                    <Eye className="w-4 h-4 text-[#8BF58D]" />
                    <span>Скрытое сообщение</span>
                  </label>
                  <span className="text-xs text-[#92999F] font-mono">
                    {secretCharCount} / 500
                  </span>
                </div>
                <textarea
                  value={secretText}
                  onChange={(e) => setSecretText(e.target.value)}
                  placeholder="Введите сообщение..."
                  maxLength={500}
                  rows={3}
                  className="w-full rounded-2xl bg-[#101418] border border-white/[0.1] px-4 py-3.5 text-sm text-[#F5F7F5] placeholder-[#62686F] focus:outline-none focus:border-[#8BF58D]/60 focus:ring-1 focus:ring-[#8BF58D]/30 transition-all resize-y"
                />
              </div>

              {/* Capacity Progress Bar */}
              <div className="bg-[#101418] p-3.5 rounded-xl border border-white/[0.06] flex flex-col gap-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#92999F]">Ёмкость текста для скрытия:</span>
                  <span className={`font-mono font-medium ${capacityPercent > 100 ? 'text-red-400' : 'text-[#8BF58D]'}`}>
                    ~{estimatedBits} бит / {coverCharCount} символов ({capacityPercent}%)
                  </span>
                </div>
                <div className="w-full bg-[#171C22] h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      capacityPercent > 100 ? 'bg-red-500' : 'bg-[#8BF58D]'
                    }`}
                    style={{ width: `${Math.min(100, capacityPercent)}%` }}
                  />
                </div>
              </div>

              {/* Error display if any */}
              {encodeResult && !encodeResult.success && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 flex items-start gap-2.5 text-xs text-red-300">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <span>{encodeResult.error}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleEncode}
                className="w-full py-4 rounded-2xl font-bold text-sm sm:text-base bg-[#8BF58D] text-[#080B0D] hover:bg-[#A4FBA6] transition-all duration-200 hover:shadow-[0_0_25px_rgba(139,245,141,0.4)] flex items-center justify-center gap-2 transform active:scale-[0.99]"
              >
                <span>Скрыть сообщение</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Right Card: Result Box matching Reference */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between min-h-[480px]">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#F5F7F5]">
                    <Eye className="w-4 h-4 text-[#8BF58D]" />
                    <span>Результат</span>
                  </div>

                  {encodeResult?.success && (
                    <div className="flex items-center gap-1 text-[11px] text-[#8BF58D] bg-[#8BF58D]/10 px-2.5 py-1 rounded-full border border-[#8BF58D]/20">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Успешно зашифровано</span>
                    </div>
                  )}
                </div>

                {/* Display Output Box */}
                <div className="rounded-2xl bg-[#101418] border border-white/[0.1] p-5 min-h-[220px] text-sm leading-relaxed relative text-[#F5F7F5]">
                  {encodeResult?.success ? (
                    <div>
                      {showInspector ? (
                        <div className="space-y-3">
                          <div className="text-xs text-[#8BF58D] font-mono mb-2 flex items-center gap-1.5">
                            <Binary className="w-3.5 h-3.5" />
                            <span>Инспектор кёрнинга (подсвечены скрытые биты):</span>
                          </div>
                          <div className="font-mono text-xs leading-loose bg-[#080B0D] p-3 rounded-xl border border-white/10 max-h-[180px] overflow-y-auto">
                            {inspectedSpans.map((span, idx) => (
                              <span 
                                key={idx}
                                title={span.bit !== null ? `Символ: '${span.char}' | Бит: ${span.bit} (${span.spacing})` : undefined}
                                className={`transition-colors ${
                                  span.bit === 1 
                                    ? 'bg-[#8BF58D]/25 text-[#8BF58D] px-0.5 rounded font-bold' 
                                    : span.bit === 0 
                                      ? 'bg-blue-500/20 text-blue-300 px-0.5 rounded' 
                                      : 'text-[#92999F]'
                                }`}
                              >
                                {span.char}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap select-all">
                          {encodeResult.encodedText}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-[#62686F] italic">
                      Здесь появится текст с внедрённым сообщением...
                    </p>
                  )}
                </div>

                {/* Stego Specs & Toggles */}
                {encodeResult?.success && (
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-[#92999F]">
                    <div className="flex items-center gap-3">
                      <span>Использовано бит: <strong className="text-[#F5F7F5]">{encodeResult.bitsUsed}</strong></span>
                      <span>CRC16: <strong className="text-[#8BF58D] font-mono">0x{encodeResult.checksum.toString(16).toUpperCase()}</strong></span>
                    </div>

                    <button
                      onClick={() => setShowInspector(!showInspector)}
                      className="text-xs text-[#8BF58D] hover:underline flex items-center gap-1"
                    >
                      <Layers className="w-3 h-3" />
                      <span>{showInspector ? 'Скрыть инспектор' : 'Показать инспектор кёрнинга'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Action Buttons Row */}
              <div className="mt-8 pt-6 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {/* Download HTML with CSS kerning */}
                  <button
                    disabled={!encodeResult?.success}
                    onClick={() => encodeResult && downloadFile(encodeResult.htmlOutput, 'kerning-stego-doc.html', 'text/html')}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-[#92999F] hover:text-[#F5F7F5] bg-[#101418] border border-white/[0.1] hover:border-white/20 transition-all disabled:opacity-40"
                    title="Скачать автономный HTML-документ с визуальным кёрнингом"
                  >
                    <FileCode className="w-3.5 h-3.5 text-[#8BF58D]" />
                    <span>Скачать HTML</span>
                  </button>

                  {/* Download TXT with Unicode kerning */}
                  <button
                    disabled={!encodeResult?.success}
                    onClick={() => encodeResult && downloadFile(encodeResult.encodedText, 'kerning-stego-text.txt', 'text/plain')}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-[#92999F] hover:text-[#F5F7F5] bg-[#101418] border border-white/[0.1] hover:border-white/20 transition-all disabled:opacity-40"
                    title="Скачать TXT файл со скрытыми символами"
                  >
                    <Download className="w-3.5 h-3.5 text-[#8BF58D]" />
                    <span>Скачать TXT</span>
                  </button>
                </div>

                {/* Copy Button matching Reference */}
                <button
                  disabled={!encodeResult?.success}
                  onClick={() => encodeResult && copyToClipboard(encodeResult.encodedText, 'encode')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#F5F7F5] bg-[#101418] border border-white/[0.14] hover:bg-white/[0.06] hover:border-white/30 transition-all active:scale-95 disabled:opacity-40"
                >
                  {copiedEncode ? (
                    <>
                      <Check className="w-4 h-4 text-[#8BF58D]" />
                      <span className="text-[#8BF58D]">Скопировано!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-[#92999F]" />
                      <span>Копировать</span>
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>
        )}

        {/* ================= MODE: DECODE ================= */}
        {mode === 'decode' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            
            {/* Left Card: Cipher Input */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-[#F5F7F5] mb-2.5">
                  <Lock className="w-4 h-4 text-[#8BF58D]" />
                  <span>Текст со скрытым сообщением</span>
                </label>
                <textarea
                  value={cipherInput}
                  onChange={(e) => setCipherInput(e.target.value)}
                  placeholder="Вставьте сюда текст или HTML со скрытым сообщением..."
                  rows={8}
                  className="w-full rounded-2xl bg-[#101418] border border-white/[0.1] px-4 py-3.5 text-sm text-[#F5F7F5] placeholder-[#62686F] focus:outline-none focus:border-[#8BF58D]/60 focus:ring-1 focus:ring-[#8BF58D]/30 transition-all resize-y"
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={() => {
                    setCipherInput('');
                    setDecodeResult(null);
                  }}
                  className="px-4 py-2 text-xs text-[#92999F] hover:text-[#F5F7F5] transition-colors"
                >
                  Очистить поле
                </button>

                <button
                  onClick={handleDecode}
                  disabled={isDecoding || !cipherInput.trim()}
                  className="px-8 py-3.5 rounded-2xl font-bold text-sm bg-[#8BF58D] text-[#080B0D] hover:bg-[#A4FBA6] transition-all hover:shadow-[0_0_20px_rgba(139,245,141,0.4)] flex items-center gap-2 disabled:opacity-40"
                >
                  {isDecoding ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Анализ текста...</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
                      <span>Извлечь сообщение</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Card: Decoded Output */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between min-h-[420px]">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#F5F7F5]">
                    <CheckCircle2 className="w-4 h-4 text-[#8BF58D]" />
                    <span>Извлечённое послание</span>
                  </div>

                  {decodeResult && (
                    <span className={`text-xs px-2.5 py-1 rounded-full border ${
                      decodeResult.success 
                        ? 'bg-[#8BF58D]/10 text-[#8BF58D] border-[#8BF58D]/20' 
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {decodeResult.success ? 'Целостность подтверждена' : 'Ошибка анализа'}
                    </span>
                  )}
                </div>

                <div className="rounded-2xl bg-[#101418] border border-white/[0.1] p-5 min-h-[200px] text-sm leading-relaxed text-[#F5F7F5]">
                  {decodeResult ? (
                    decodeResult.success ? (
                      <div className="space-y-4">
                        <div className="text-lg font-semibold text-[#8BF58D] bg-[#8BF58D]/5 p-4 rounded-xl border border-[#8BF58D]/20">
                          «{decodeResult.message}»
                        </div>
                        <div className="text-xs text-[#92999F] space-y-1.5 pt-2">
                          <div>Метод обнаружения: <span className="text-[#F5F7F5] font-mono">{decodeResult.detectionMethod}</span></div>
                          <div>Длина извлечённого текста: <span className="text-[#F5F7F5]">{decodeResult.message.length} символов</span></div>
                          <div>Контрольная сумма CRC16: <span className="text-[#8BF58D] font-mono">{decodeResult.checksumValid ? 'ВАЛИДНА (совпала)' : 'НЕ СОВПАЛА'}</span></div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-red-400 text-sm flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold mb-1">Сообщение не найдено или повреждено:</p>
                          <p className="text-xs text-red-300/90">{decodeResult.error}</p>
                        </div>
                      </div>
                    )
                  ) : (
                    <p className="text-[#62686F] italic">
                      Вставьте зашифрованный текст слева и нажмите «Извлечь сообщение»...
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-white/[0.08] flex items-center justify-end">
                <button
                  disabled={!decodeResult?.success}
                  onClick={() => decodeResult?.message && copyToClipboard(decodeResult.message, 'decode')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#F5F7F5] bg-[#101418] border border-white/[0.14] hover:bg-white/[0.06] hover:border-white/30 transition-all active:scale-95 disabled:opacity-40"
                >
                  {copiedDecode ? (
                    <>
                      <Check className="w-4 h-4 text-[#8BF58D]" />
                      <span className="text-[#8BF58D]">Скопировано!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-[#92999F]" />
                      <span>Копировать результат</span>
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

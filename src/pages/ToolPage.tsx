import React, { useState, useEffect, useRef } from 'react';
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
  Layers,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { encodeKerning, decodeKerning, analyzeKerningSpans } from '../lib/kerningStego';
import { StegoResult, DecodeResult, TextSpanAnalysis } from '../lib/stegoTypes';

export const ToolPage: React.FC = () => {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  // Encode state
  const [coverText, setCoverText] = useState(
    'Информационная безопасность — это процесс защиты информации от несанкционированного доступа.'
  );
  const [secretText, setSecretText] = useState('Секретная операция K-26');
  const [encodeResult, setEncodeResult] = useState<StegoResult | null>(null);
  const [copiedEncode, setCopiedEncode] = useState(false);
  const [showInspector, setShowInspector] = useState(false);
  const [inspectedSpans, setInspectedSpans] = useState<TextSpanAnalysis[]>([]);
  const [justEncoded, setJustEncoded] = useState(false);

  // Decode state
  const [cipherInput, setCipherInput] = useState('');
  const [decodeResult, setDecodeResult] = useState<DecodeResult | null>(null);
  const [copiedDecode, setCopiedDecode] = useState(false);
  const [isDecoding, setIsDecoding] = useState(false);

  // Refs for scrolling on mobile
  const resultCardRef = useRef<HTMLDivElement>(null);
  const decodeResultRef = useRef<HTMLDivElement>(null);

  // Counts
  const coverCharCount = Array.from(coverText).length;
  const secretCharCount = Array.from(secretText).length;
  const estimatedBits = 48 + secretCharCount * 16;
  const bitsPerChar = coverCharCount > 0 ? (estimatedBits / coverCharCount).toFixed(1) : '0';

  // Run initial encode on mount
  useEffect(() => {
    if (coverText.trim() && secretText.trim()) {
      const res = encodeKerning(coverText, secretText);
      setEncodeResult(res);
      if (res.success) {
        setInspectedSpans(analyzeKerningSpans(res.encodedText));
        setCipherInput(res.encodedText);
      }
    }
  }, []);

  const handleEncode = () => {
    if (!coverText.trim()) {
      alert('Пожалуйста, введите исходный открытый текст.');
      return;
    }
    if (!secretText.trim()) {
      alert('Пожалуйста, введите секретное сообщение для скрытия.');
      return;
    }

    const res = encodeKerning(coverText, secretText);
    setEncodeResult(res);

    if (res.success) {
      setInspectedSpans(analyzeKerningSpans(res.encodedText));
      setCipherInput(res.encodedText);
      setJustEncoded(true);
      setTimeout(() => setJustEncoded(false), 2000);

      // Trigger confetti
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#8BF58D', '#B4FFB4', '#5FE7C8'],
      });

      // Scroll to result on mobile if stacked
      if (window.innerWidth < 1024 && resultCardRef.current) {
        setTimeout(() => {
          resultCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  };

  const handleDecode = () => {
    if (!cipherInput.trim()) {
      alert('Пожалуйста, вставьте зашифрованный текст или HTML в поле.');
      return;
    }

    setIsDecoding(true);
    setTimeout(() => {
      const res = decodeKerning(cipherInput);
      setDecodeResult(res);
      setIsDecoding(false);

      if (res.success) {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.65 },
          colors: ['#8BF58D', '#B4FFB4', '#5FE7C8'],
        });
      }

      // Scroll to decoded result on mobile
      if (window.innerWidth < 1024 && decodeResultRef.current) {
        setTimeout(() => {
          decodeResultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }, 250);
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
    <div className="min-h-[calc(100vh-80px)] py-6 sm:py-10 lg:py-12">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        
        {/* Top Header & 3D Floating Lock Tile */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-6 sm:mb-10">
          <div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#F5F7F5] tracking-tight mb-2 sm:mb-3">
              Инструмент <br className="hidden sm:inline" />
              для скрытых сообщений
            </h1>
            <p className="text-[#92999F] text-xs sm:text-base max-w-xl leading-relaxed">
              Введите текст и получите сообщение, которое невозможно заметить при обычном чтении.
            </p>
          </div>

          {/* Right Floating 3D Lock Element */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative group">
              <div className="absolute inset-0 rounded-2xl bg-[#8BF58D]/20 blur-xl opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="relative w-24 h-24 lg:w-28 lg:h-28 rounded-3xl bg-[#171C22]/90 border border-white/[0.14] shadow-2xl backdrop-blur-xl flex items-center justify-center overflow-hidden">
                <img 
                  src="/assets/tool-lock-tile.jpg" 
                  alt="3D Lock Tile" 
                  className="w-full h-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Lock className="w-8 h-8 lg:w-10 lg:h-10 text-[#8BF58D] drop-shadow-[0_0_12px_rgba(139,245,141,0.6)]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mode Switcher Tabs - full width on mobile */}
        <div className="w-full sm:w-fit mb-6 sm:mb-8 bg-[#12161B] p-1 rounded-2xl border border-white/[0.08] grid grid-cols-2 sm:flex sm:items-center gap-1">
          <button
            onClick={() => setMode('encode')}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              mode === 'encode'
                ? 'bg-[#171C22] text-[#8BF58D] shadow-glow-sm border border-white/[0.08]'
                : 'text-[#92999F] hover:text-[#F5F7F5]'
            }`}
          >
            <Lock className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">Скрыть сообщение</span>
          </button>

          <button
            onClick={() => setMode('decode')}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              mode === 'decode'
                ? 'bg-[#171C22] text-[#8BF58D] shadow-glow-sm border border-white/[0.08]'
                : 'text-[#92999F] hover:text-[#F5F7F5]'
            }`}
          >
            <Eye className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">Извлечь сообщение</span>
          </button>
        </div>

        {/* ================= MODE: ENCODE ================= */}
        {mode === 'encode' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8 items-start">
            
            {/* Left Card: Input Form */}
            <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-7 flex flex-col gap-5">
              
              {/* Field 1: Исходный текст */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#F5F7F5]">
                    <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8BF58D]" />
                    <span>Исходный текст</span>
                  </label>
                  <span className="text-[11px] sm:text-xs text-[#92999F] font-mono">
                    {coverCharCount} символов
                  </span>
                </div>
                <textarea
                  value={coverText}
                  onChange={(e) => setCoverText(e.target.value)}
                  placeholder="Введите открытый текст, в котором будет скрыто сообщение..."
                  maxLength={4000}
                  rows={4}
                  className="w-full rounded-xl sm:rounded-2xl bg-[#101418] border border-white/[0.1] p-3 sm:p-4 text-base sm:text-sm text-[#F5F7F5] placeholder-[#62686F] focus:outline-none focus:border-[#8BF58D]/60 focus:ring-1 focus:ring-[#8BF58D]/30 transition-all resize-y min-h-[95px] leading-relaxed"
                />
              </div>

              {/* Field 2: Скрытое сообщение */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#F5F7F5]">
                    <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8BF58D]" />
                    <span>Скрытое сообщение</span>
                  </label>
                  <span className="text-[11px] sm:text-xs text-[#92999F] font-mono">
                    {secretCharCount} символов
                  </span>
                </div>
                <textarea
                  value={secretText}
                  onChange={(e) => setSecretText(e.target.value)}
                  placeholder="Введите секретное сообщение..."
                  maxLength={1000}
                  rows={3}
                  className="w-full rounded-xl sm:rounded-2xl bg-[#101418] border border-white/[0.1] p-3 sm:p-4 text-base sm:text-sm text-[#F5F7F5] placeholder-[#62686F] focus:outline-none focus:border-[#8BF58D]/60 focus:ring-1 focus:ring-[#8BF58D]/30 transition-all resize-y min-h-[85px] leading-relaxed"
                />
              </div>

              {/* Dynamic Capacity Info Pill */}
              <div className="bg-[#101418] p-3 sm:p-3.5 rounded-xl border border-white/[0.06] flex items-center justify-between text-xs">
                <span className="text-[#92999F] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#8BF58D]" />
                  <span>Плотность стеганографии:</span>
                </span>
                <span className="font-mono text-[#8BF58D] font-medium">
                  {bitsPerChar} бит / символ
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleEncode}
                className="w-full py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base bg-[#8BF58D] text-[#080B0D] hover:bg-[#A4FBA6] transition-all duration-200 hover:shadow-[0_0_25px_rgba(139,245,141,0.4)] flex items-center justify-center gap-2 transform active:scale-[0.98] cursor-pointer"
              >
                <span>Скрыть сообщение</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Right Card: Result Box */}
            <div 
              ref={resultCardRef}
              className={`glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-7 flex flex-col justify-between min-h-[420px] transition-all duration-300 ${
                justEncoded ? 'border-[#8BF58D] shadow-[0_0_30px_rgba(139,245,141,0.25)]' : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#F5F7F5]">
                    <Eye className="w-4 h-4 text-[#8BF58D]" />
                    <span>Результат</span>
                  </div>

                  {encodeResult?.success && (
                    <div className="flex items-center gap-1 text-[11px] text-[#8BF58D] bg-[#8BF58D]/10 px-2.5 py-1 rounded-full border border-[#8BF58D]/20 animate-fade-in">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Готово к копированию</span>
                    </div>
                  )}
                </div>

                {/* Display Output Box */}
                <div className="rounded-xl sm:rounded-2xl bg-[#101418] border border-white/[0.1] p-3.5 sm:p-5 min-h-[180px] sm:min-h-[220px] text-xs sm:text-sm leading-relaxed relative text-[#F5F7F5]">
                  {encodeResult?.success ? (
                    <div>
                      {showInspector ? (
                        <div className="space-y-3">
                          <div className="text-[11px] sm:text-xs text-[#8BF58D] font-mono flex items-center gap-1.5">
                            <Binary className="w-3.5 h-3.5" />
                            <span>Инспектор кёрнинга (подсвечены биты):</span>
                          </div>
                          <div className="font-mono text-[11px] sm:text-xs leading-loose bg-[#080B0D] p-3 rounded-xl border border-white/10 max-h-[170px] overflow-y-auto break-words">
                            {inspectedSpans.map((span, idx) => (
                              <span 
                                key={idx}
                                title={span.spacing}
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
                        <p className="whitespace-pre-wrap select-all break-words">
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
                  <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] sm:text-xs text-[#92999F]">
                    <div className="flex items-center gap-3">
                      <span>Внедрено: <strong className="text-[#F5F7F5]">{encodeResult.bitsUsed} бит</strong></span>
                      <span>CRC16: <strong className="text-[#8BF58D] font-mono">0x{encodeResult.checksum.toString(16).toUpperCase()}</strong></span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowInspector(!showInspector)}
                      className="text-left text-[#8BF58D] hover:underline flex items-center gap-1 py-1"
                    >
                      <Layers className="w-3 h-3" />
                      <span>{showInspector ? 'Скрыть инспектор' : 'Показать инспектор кёрнинга'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Action Buttons Row - full responsive wrap on mobile */}
              <div className="mt-5 sm:mt-8 pt-4 sm:pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
                <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
                  {/* Download HTML with CSS kerning */}
                  <button
                    disabled={!encodeResult?.success}
                    onClick={() => encodeResult && downloadFile(encodeResult.htmlOutput, 'kerning-stego-doc.html', 'text/html')}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium text-[#92999F] hover:text-[#F5F7F5] bg-[#101418] border border-white/[0.1] hover:border-white/20 transition-all disabled:opacity-40"
                    title="Скачать автономный HTML-документ с визуальным кёрнингом"
                  >
                    <FileCode className="w-3.5 h-3.5 text-[#8BF58D]" />
                    <span>HTML</span>
                  </button>

                  {/* Download TXT with Unicode kerning */}
                  <button
                    disabled={!encodeResult?.success}
                    onClick={() => encodeResult && downloadFile(encodeResult.encodedText, 'kerning-stego-text.txt', 'text/plain')}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium text-[#92999F] hover:text-[#F5F7F5] bg-[#101418] border border-white/[0.1] hover:border-white/20 transition-all disabled:opacity-40"
                    title="Скачать TXT файл со скрытыми символами"
                  >
                    <Download className="w-3.5 h-3.5 text-[#8BF58D]" />
                    <span>TXT</span>
                  </button>
                </div>

                {/* Copy Button */}
                <button
                  disabled={!encodeResult?.success}
                  onClick={() => encodeResult && copyToClipboard(encodeResult.encodedText, 'encode')}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#F5F7F5] bg-[#101418] border border-white/[0.14] hover:bg-white/[0.06] hover:border-white/30 transition-all active:scale-95 disabled:opacity-40 cursor-pointer"
                >
                  {copiedEncode ? (
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

        {/* ================= MODE: DECODE ================= */}
        {mode === 'decode' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8 items-start">
            
            {/* Left Card: Cipher Input */}
            <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-7 flex flex-col gap-5">
              <div>
                <label className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#F5F7F5] mb-2">
                  <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8BF58D]" />
                  <span>Текст со скрытым сообщением</span>
                </label>
                <textarea
                  value={cipherInput}
                  onChange={(e) => setCipherInput(e.target.value)}
                  placeholder="Вставьте сюда текст или HTML со скрытым сообщением..."
                  rows={7}
                  className="w-full rounded-xl sm:rounded-2xl bg-[#101418] border border-white/[0.1] p-3 sm:p-4 text-base sm:text-sm text-[#F5F7F5] placeholder-[#62686F] focus:outline-none focus:border-[#8BF58D]/60 focus:ring-1 focus:ring-[#8BF58D]/30 transition-all resize-y min-h-[140px] leading-relaxed"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setCipherInput('');
                    setDecodeResult(null);
                  }}
                  className="py-2.5 sm:py-2 px-3 text-xs text-[#92999F] hover:text-[#F5F7F5] transition-colors text-center"
                >
                  Очистить поле
                </button>

                <button
                  type="button"
                  onClick={handleDecode}
                  disabled={isDecoding || !cipherInput.trim()}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl sm:rounded-2xl font-bold text-sm bg-[#8BF58D] text-[#080B0D] hover:bg-[#A4FBA6] transition-all hover:shadow-[0_0_20px_rgba(139,245,141,0.4)] flex items-center justify-center gap-2 disabled:opacity-40 cursor-pointer"
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
            <div 
              ref={decodeResultRef}
              className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-7 flex flex-col justify-between min-h-[380px]"
            >
              <div>
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#F5F7F5]">
                    <CheckCircle2 className="w-4 h-4 text-[#8BF58D]" />
                    <span>Извлечённое послание</span>
                  </div>

                  {decodeResult && (
                    <span className={`text-[11px] px-2.5 py-0.5 rounded-full border ${
                      decodeResult.success 
                        ? 'bg-[#8BF58D]/10 text-[#8BF58D] border-[#8BF58D]/20' 
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {decodeResult.success ? 'Целостность подтверждена' : 'Ошибка'}
                    </span>
                  )}
                </div>

                <div className="rounded-xl sm:rounded-2xl bg-[#101418] border border-white/[0.1] p-3.5 sm:p-5 min-h-[180px] sm:min-h-[200px] text-xs sm:text-sm leading-relaxed text-[#F5F7F5]">
                  {decodeResult ? (
                    decodeResult.success ? (
                      <div className="space-y-3 sm:space-y-4">
                        <div className="text-base sm:text-lg font-semibold text-[#8BF58D] bg-[#8BF58D]/5 p-3.5 sm:p-4 rounded-xl border border-[#8BF58D]/20 break-words">
                          «{decodeResult.message}»
                        </div>
                        <div className="text-[11px] sm:text-xs text-[#92999F] space-y-1 pt-1">
                          <div>Метод: <span className="text-[#F5F7F5] font-mono">{decodeResult.detectionMethod}</span></div>
                          <div>Длина: <span className="text-[#F5F7F5]">{decodeResult.message.length} символов</span></div>
                          <div>CRC16: <span className="text-[#8BF58D] font-mono">{decodeResult.checksumValid ? 'ВАЛИДНА (совпала)' : 'НЕ СОВПАЛА'}</span></div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-red-400 text-xs sm:text-sm flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold mb-1">Сообщение не найдено:</p>
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
              <div className="mt-5 sm:mt-8 pt-4 sm:pt-6 border-t border-white/[0.08] flex items-center justify-end">
                <button
                  disabled={!decodeResult?.success}
                  onClick={() => decodeResult?.message && copyToClipboard(decodeResult.message, 'decode')}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#F5F7F5] bg-[#101418] border border-white/[0.14] hover:bg-white/[0.06] hover:border-white/30 transition-all active:scale-95 disabled:opacity-40 cursor-pointer"
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

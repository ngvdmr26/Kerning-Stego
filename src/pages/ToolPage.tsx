import React, { useRef, useState } from 'react';
import {
  Lock,
  Eye,
  ArrowRight,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  FileCode,
  Binary,
  Layers,
  RotateCcw,
  MessageSquareText,
  Download,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import {
  encodeKerning,
  decodeKerning,
  encodeTextCarrier,
  BITS_PER_GAP,
  TEXT_BITS_PER_CHAR,
  HEADER_BITS,
} from '../lib/kerningStego';
import { StegoResult, TextStegoResult, DecodeResult } from '../lib/stegoTypes';

type Carrier = 'text' | 'html';

type EncodeOutput =
  | { carrier: 'text'; res: TextStegoResult }
  | { carrier: 'html'; res: StegoResult };

const copyText = (value: string) => navigator.clipboard.writeText(value);

export const ToolPage: React.FC = () => {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [carrier, setCarrier] = useState<Carrier>('text');

  const [coverText, setCoverText] = useState(
    'Информационная безопасность — это состояние защищённости информации, при котором обеспечиваются её конфиденциальность, целостность и доступность. Защита данных требует комплексного подхода: организационных мер, контроля доступа и внимания к деталям, которые на первый взгляд кажутся незначительными.'
  );
  const [secretText, setSecretText] = useState('Секретная операция K-26');
  const [output, setOutput] = useState<EncodeOutput | null>(null);
  const [copied, setCopied] = useState(false);
  const [showGaps, setShowGaps] = useState(false);
  const [justEncoded, setJustEncoded] = useState(false);

  const [cipherInput, setCipherInput] = useState('');
  const [decodeResult, setDecodeResult] = useState<DecodeResult | null>(null);
  const [copiedDecode, setCopiedDecode] = useState(false);
  const [isDecoding, setIsDecoding] = useState(false);

  const resultCardRef = useRef<HTMLDivElement>(null);
  const decodeResultRef = useRef<HTMLDivElement>(null);

  const coverChars = Array.from(coverText).length;
  const secretBytes = new TextEncoder().encode(secretText.trim()).length;
  const requiredBits = HEADER_BITS + Math.max(0, secretBytes) * 8;
  const requiredChars =
    carrier === 'html'
      ? Math.max(2, Math.ceil(requiredBits / BITS_PER_GAP) + 1)
      : Math.max(1, Math.ceil(requiredBits / TEXT_BITS_PER_CHAR));
  const charsMissing = Math.max(0, requiredChars - coverChars);

  const outputPayload =
    output && output.res.success
      ? output.carrier === 'text'
        ? output.res.text
        : output.res.containerHtml
      : '';

  const handleEncode = () => {
    if (!coverText.trim()) {
      alert('Введите текст, в котором будет спрятано сообщение.');
      return;
    }
    if (!secretText.trim()) {
      alert('Введите секретное сообщение.');
      return;
    }

    if (carrier === 'text') {
      setOutput({ carrier: 'text', res: encodeTextCarrier(coverText, secretText) });
    } else {
      setOutput({ carrier: 'html', res: encodeKerning(coverText, secretText) });
    }

    setShowGaps(false);
    setJustEncoded(true);
    setTimeout(() => setJustEncoded(false), 2000);

    confetti({
      particleCount: 36,
      spread: 55,
      origin: { y: 0.7 },
      colors: ['#8BF58D', '#B4FFB4', '#5FE7C8'],
    });

    if (window.innerWidth < 1024 && resultCardRef.current) {
      setTimeout(() => {
        resultCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const runDecode = (text: string) => {
    setCipherInput(text);
    setMode('decode');
    setIsDecoding(true);
    setTimeout(() => {
      const res = decodeKerning(text);
      setDecodeResult(res);
      setIsDecoding(false);

      if (res.success) {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.65 },
          colors: ['#8BF58D', '#B4FFB4', '#5FE7C8'],
        });
      }

      if (window.innerWidth < 1024 && decodeResultRef.current) {
        setTimeout(() => {
          decodeResultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }, 250);
  };

  const handleDecode = () => {
    if (!cipherInput.trim()) {
      alert('Вставьте сообщение или контейнер в поле.');
      return;
    }
    runDecode(cipherInput);
  };

  const handleTestInDecoder = () => {
    if (outputPayload) runDecode(outputPayload);
  };

  const handleCopy = (value: string, type: 'encode' | 'decode') => {
    copyText(value);
    if (type === 'encode') {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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

  const carrierOptions: { id: Carrier; title: string; hint: string; icon: typeof FileCode }[] = [
    {
      id: 'text',
      title: 'Обычный текст',
      hint: 'Невидимые маркеры. Копируется в мессенджер и файл.',
      icon: MessageSquareText,
    },
    {
      id: 'html',
      title: 'Кёрнинг (HTML)',
      hint: 'Биты в интервалах. Живёт только в разметке.',
      icon: FileCode,
    },
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] py-6 sm:py-10 lg:py-14">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        {/* ================= HEADER ================= */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-6 sm:mb-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.2em] text-[#8BF58D] mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8BF58D] animate-pulse" />
              инструмент
            </div>
            <h1 className="font-display text-[28px] sm:text-4xl lg:text-[52px] font-semibold text-[#F5F7F5] leading-[1.08] mb-2 sm:mb-3">
              Спрячьте сообщение
              <br />
              <span className="text-gradient">в обычном тексте</span>
            </h1>
            <p className="text-[#92999F] text-xs sm:text-base leading-relaxed">
              Буквы остаются буквами. Меняется только то, что замечает машина.
            </p>
          </div>

          <div className="hidden lg:flex flex-col gap-2 text-[10px] font-mono text-[#62686F] border-l border-white/[0.08] pl-6">
            <span>2 бита · зазор кёрнинга</span>
            <span>8 бит · символ открытого текста</span>
            <span className="text-[#8BF58D]">CRC16 · проверка целостности</span>
          </div>
        </div>

        {/* ================= MODE SWITCH ================= */}
        <div className="w-full sm:w-fit mb-6 sm:mb-8 bg-[#12161B] p-1 rounded-2xl border border-white/[0.08] grid grid-cols-2 sm:flex sm:items-center gap-1">
          <button
            onClick={() => setMode('encode')}
            className={`relative flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
              mode === 'encode' ? 'text-[#8BF58D]' : 'text-[#92999F] hover:text-[#F5F7F5]'
            }`}
          >
            {mode === 'encode' && (
              <motion.span
                layoutId="mode-pill"
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                className="absolute inset-0 rounded-xl bg-[#171C22] border border-white/[0.08] shadow-glow-sm"
              />
            )}
            <Lock className="relative w-3.5 h-3.5 flex-shrink-0" />
            <span className="relative truncate">Скрыть сообщение</span>
          </button>

          <button
            onClick={() => setMode('decode')}
            className={`relative flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
              mode === 'decode' ? 'text-[#8BF58D]' : 'text-[#92999F] hover:text-[#F5F7F5]'
            }`}
          >
            {mode === 'decode' && (
              <motion.span
                layoutId="mode-pill"
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                className="absolute inset-0 rounded-xl bg-[#171C22] border border-white/[0.08] shadow-glow-sm"
              />
            )}
            <Eye className="relative w-3.5 h-3.5 flex-shrink-0" />
            <span className="relative truncate">Извлечь сообщение</span>
          </button>
        </div>

        {/* ================= ENCODE ================= */}
        {mode === 'encode' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8 items-start">
            <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-7 flex flex-col gap-5">
              {/* Cover text */}
              <div>
                <div className="flex items-center justify-between mb-2 gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono text-[10px] text-[#8BF58D]/70">01</span>
                    <span className="font-display text-[11px] sm:text-sm text-[#F5F7F5] truncate">
                      Открытый текст
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        setCoverText(
                          'Информационная безопасность — это состояние защищённости информации, при котором обеспечиваются её конфиденциальность, целостность и доступность. Защита данных требует комплексного подхода: организационных мер, контроля доступа и внимания к деталям, которые на первый взгляд кажутся незначительными.'
                        )
                      }
                      className="text-[10px] sm:text-xs text-[#8BF58D] hover:underline cursor-pointer"
                    >
                      Пример
                    </button>
                    <button
                      type="button"
                      onClick={() => setCoverText('')}
                      className="text-[10px] sm:text-xs text-[#92999F] hover:text-[#F5F7F5] cursor-pointer"
                    >
                      Сброс
                    </button>
                  </div>
                </div>

                <textarea
                  value={coverText}
                  onChange={(e) => setCoverText(e.target.value)}
                  placeholder="Введите текст, в котором будет скрыто сообщение..."
                  maxLength={4000}
                  rows={4}
                  className="w-full rounded-xl sm:rounded-2xl bg-[#101418] border border-white/[0.1] p-3 sm:p-4 text-base sm:text-sm text-[#F5F7F5] placeholder-[#62686F] focus:outline-none focus:border-[#8BF58D]/60 focus:ring-1 focus:ring-[#8BF58D]/30 transition-all resize-y min-h-[95px] leading-relaxed"
                />

                <div className="mt-2.5 space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5 text-[10px] sm:text-[11px]">
                    <span className={charsMissing > 0 ? 'text-amber-400' : 'text-[#8BF58D]'}>
                      {charsMissing > 0
                        ? `Нужно ещё ${charsMissing} симв. для текущего сообщения`
                        : 'Объёма текста достаточно'}
                    </span>
                    <span className="font-mono text-[#92999F]">
                      {coverChars} / {requiredChars} симв.
                    </span>
                  </div>
                  <div className="h-1 rounded-full bg-white/[0.07] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        charsMissing > 0 ? 'bg-amber-400' : 'bg-[#8BF58D]'
                      }`}
                      style={{ width: `${Math.min(100, (coverChars / requiredChars) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Secret */}
              <div>
                <div className="flex items-center justify-between mb-2 gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono text-[10px] text-[#8BF58D]/70">02</span>
                    <span className="font-display text-[11px] sm:text-sm text-[#F5F7F5] truncate">
                      Скрытое сообщение
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => setSecretText('Секретная операция K-26')}
                      className="text-[10px] sm:text-xs text-[#8BF58D] hover:underline cursor-pointer"
                    >
                      Пример
                    </button>
                    <button
                      type="button"
                      onClick={() => setSecretText('')}
                      className="text-[10px] sm:text-xs text-[#92999F] hover:text-[#F5F7F5] cursor-pointer"
                    >
                      Сброс
                    </button>
                  </div>
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

              {/* Carrier */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-[10px] text-[#8BF58D]/70">03</span>
                  <span className="font-display text-[11px] sm:text-sm text-[#F5F7F5]">Носитель</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {carrierOptions.map((option) => {
                    const Icon = option.icon;
                    const active = carrier === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setCarrier(option.id)}
                        className={`relative text-left rounded-xl border p-3 transition-all cursor-pointer ${
                          active
                            ? 'border-[#8BF58D]/50 bg-[#8BF58D]/[0.07] shadow-[0_0_20px_rgba(139,245,141,0.12)]'
                            : 'border-white/[0.08] bg-[#101418] hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className={`w-3.5 h-3.5 ${active ? 'text-[#8BF58D]' : 'text-[#62686F]'}`} />
                          <span className={`text-[11px] sm:text-xs font-semibold ${active ? 'text-[#F5F7F5]' : 'text-[#92999F]'}`}>
                            {option.title}
                          </span>
                        </div>
                        <p className="text-[10px] leading-snug text-[#62686F]">{option.hint}</p>
                        {active && (
                          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#8BF58D] shadow-[0_0_6px_#8BF58D]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={handleEncode}
                className="btn-shine w-full py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base bg-[#8BF58D] text-[#080B0D] hover:bg-[#A4FBA6] transition-all duration-200 hover:shadow-[0_0_30px_rgba(139,245,141,0.4)] flex items-center justify-center gap-2 transform active:scale-[0.98] cursor-pointer"
              >
                <span>Скрыть сообщение</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Result */}
            <div
              ref={resultCardRef}
              className={`glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-7 flex flex-col justify-between min-h-[420px] transition-all duration-300 ${
                justEncoded ? 'border-[#8BF58D] shadow-[0_0_30px_rgba(139,245,141,0.2)]' : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#F5F7F5]">
                    <Eye className="w-4 h-4 text-[#8BF58D]" />
                    <span className="font-display">Результат</span>
                  </div>

                  {output?.res.success && (
                    <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-[#8BF58D] bg-[#8BF58D]/10 px-2.5 py-1 rounded-full border border-[#8BF58D]/20">
                      <CheckCircle2 className="w-3 h-3" />
                      <span className="whitespace-nowrap">Готово</span>
                    </div>
                  )}
                </div>

                <div className="rounded-xl sm:rounded-2xl bg-[#101418] border border-white/[0.1] p-3.5 sm:p-5 min-h-[190px] sm:min-h-[230px] text-xs sm:text-sm leading-relaxed relative text-[#F5F7F5]">
                  {output ? (
                    output.res.success ? (
                      <div>
                        {showGaps && output.carrier === 'html' ? (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between gap-2">
                              <div className="text-[11px] sm:text-xs text-[#8BF58D] font-mono flex items-center gap-1.5">
                                <Binary className="w-3.5 h-3.5" />
                                <span>Разметка зазоров</span>
                              </div>
                              <span className="text-[10px] font-mono text-[#62686F]">em</span>
                            </div>

                            <div className="bg-[#080B0D] p-3 rounded-xl border border-white/10 max-h-[240px] overflow-auto">
                              <div className="flex flex-wrap items-end gap-y-3">
                                {output.res.gaps.map((gap, idx) => (
                                  <span key={idx} className="inline-flex items-end">
                                    <span className="font-serif text-base sm:text-lg leading-none text-[#F5F7F5] whitespace-pre">
                                      {gap.char === ' ' ? '\u00A0' : gap.char === '\n' ? '↵' : gap.char}
                                    </span>
                                    {idx < output.res.gaps.length - 1 && (
                                      <span className="flex flex-col items-center mx-0.5 sm:mx-1">
                                        <span
                                          className={`w-px h-3.5 sm:h-4 ${
                                            gap.level > 0
                                              ? 'bg-[#8BF58D] shadow-[0_0_6px_rgba(139,245,141,0.7)]'
                                              : 'bg-white/20'
                                          }`}
                                        />
                                        <span
                                          className={`mt-1 text-[8px] sm:text-[9px] leading-none tabular-nums ${
                                            gap.level > 0 ? 'text-[#8BF58D]' : 'text-[#62686F]'
                                          }`}
                                        >
                                          {gap.spacingEm.toFixed(2)}
                                        </span>
                                      </span>
                                    )}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <p className="text-[10px] sm:text-[11px] text-[#92999F] leading-relaxed">
                              Чёрточка — между буквами, число под ней — зазор в em. Расширенные
                              зазоры несут биты.
                            </p>
                          </div>
                        ) : output.carrier === 'html' ? (
                          <div
                            className="whitespace-pre-wrap select-all break-words"
                            dangerouslySetInnerHTML={{ __html: output.res.containerHtml }}
                          />
                        ) : (
                          <div className="whitespace-pre-wrap select-all break-words">
                            {output.res.text}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-red-400 text-xs sm:text-sm flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <p>{output.res.error}</p>
                      </div>
                    )
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center gap-3 text-center py-8">
                      <div className="font-display text-3xl text-[#8BF58D]/25">Aa</div>
                      <p className="text-[#62686F] italic max-w-[240px] text-[11px] sm:text-xs">
                        Здесь появится носитель: обычный текст или HTML с интервалами.
                      </p>
                    </div>
                  )}
                </div>

                {output?.res.success && (
                  <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] sm:text-xs text-[#92999F]">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span>
                        Биты: <strong className="text-[#F5F7F5] font-mono">{output.res.bitsUsed}</strong>
                      </span>
                      <span>
                        CRC16:{' '}
                        <strong className="text-[#8BF58D] font-mono">
                          0x{output.res.checksum.toString(16).toUpperCase()}
                        </strong>
                      </span>
                      <span className="text-[#62686F]">
                        {output.carrier === 'text' ? 'невидимые маркеры' : 'интервалы'}
                      </span>
                    </div>

                    {output.carrier === 'html' && (
                      <button
                        type="button"
                        onClick={() => setShowGaps(!showGaps)}
                        className="text-left text-[#8BF58D] hover:underline flex items-center gap-1 py-1 cursor-pointer"
                      >
                        <Layers className="w-3 h-3" />
                        <span>{showGaps ? 'Скрыть зазоры' : 'Показать зазоры'}</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-5 sm:mt-8 pt-4 sm:pt-6 border-t border-white/[0.08]">
                <p className="text-[10px] sm:text-[11px] text-[#62686F] leading-relaxed mb-3">
                  {carrier === 'text'
                    ? 'Текст с невидимыми маркерами можно копировать в мессенджер — сообщение останется внутри.'
                    : 'Кёрнинг существует только в разметке. Копируйте HTML-контейнер целиком или скачивайте файл.'}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
                  <button
                    disabled={!output?.res.success}
                    onClick={handleTestInDecoder}
                    className="order-1 sm:order-3 sm:ml-auto w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-[#080B0D] bg-[#8BF58D] hover:bg-[#A4FBA6] transition-all hover:shadow-[0_0_20px_rgba(139,245,141,0.35)] active:scale-95 disabled:opacity-40 cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Проверить в декодере</span>
                  </button>

                  <button
                    disabled={!output?.res.success}
                    onClick={() => outputPayload && handleCopy(outputPayload, 'encode')}
                    className="order-2 w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#F5F7F5] bg-[#101418] border border-white/[0.14] hover:bg-white/[0.06] hover:border-white/30 transition-all active:scale-95 disabled:opacity-40 cursor-pointer shadow-sm"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-[#8BF58D]" />
                        <span className="text-[#8BF58D]">Скопировано!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-[#92999F]" />
                        <span>{carrier === 'text' ? 'Копировать текст' : 'Копировать HTML'}</span>
                      </>
                    )}
                  </button>

                  <button
                    disabled={!output?.res.success}
                    onClick={() =>
                      output &&
                      output.res.success &&
                      downloadFile(
                        outputPayload,
                        carrier === 'text' ? 'stego-message.txt' : 'kerning-stego.html',
                        carrier === 'text' ? 'text/plain' : 'text/html'
                      )
                    }
                    className="order-3 sm:order-1 w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium text-[#92999F] hover:text-[#F5F7F5] bg-[#101418] border border-white/[0.1] hover:border-white/20 transition-all disabled:opacity-40 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-[#8BF58D]" />
                    <span>{carrier === 'text' ? 'Скачать TXT' : 'Скачать HTML'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= DECODE ================= */}
        {mode === 'decode' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8 items-start">
            <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-7 flex flex-col gap-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-[#8BF58D]/70">01</span>
                    <span className="font-display text-[11px] sm:text-sm text-[#F5F7F5]">
                      Что читаем
                    </span>
                  </div>
                  {cipherInput && (
                    <button
                      type="button"
                      onClick={() => {
                        setCipherInput('');
                        setDecodeResult(null);
                      }}
                      className="text-[10px] sm:text-xs text-[#92999F] hover:text-[#F5F7F5] flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Сброс</span>
                    </button>
                  )}
                </div>
                <textarea
                  value={cipherInput}
                  onChange={(e) => setCipherInput(e.target.value)}
                  placeholder="Вставьте текст с невидимыми маркерами или HTML-контейнер с интервалами..."
                  rows={8}
                  className="w-full rounded-xl sm:rounded-2xl bg-[#101418] border border-white/[0.1] p-3 sm:p-4 text-base sm:text-sm text-[#F5F7F5] placeholder-[#62686F] focus:outline-none focus:border-[#8BF58D]/60 focus:ring-1 focus:ring-[#8BF58D]/30 transition-all resize-y min-h-[150px] leading-relaxed"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setCipherInput('');
                    setDecodeResult(null);
                  }}
                  className="py-2.5 sm:py-2 px-3 text-xs text-[#92999F] hover:text-[#F5F7F5] transition-colors text-center cursor-pointer"
                >
                  Очистить поле
                </button>

                <button
                  type="button"
                  onClick={handleDecode}
                  disabled={isDecoding || !cipherInput.trim()}
                  className="btn-shine w-full sm:w-auto px-6 py-3.5 rounded-xl sm:rounded-2xl font-bold text-sm bg-[#8BF58D] text-[#080B0D] hover:bg-[#A4FBA6] transition-all hover:shadow-[0_0_20px_rgba(139,245,141,0.4)] flex items-center justify-center gap-2 disabled:opacity-40 cursor-pointer"
                >
                  {isDecoding ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Анализ...</span>
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

            <div
              ref={decodeResultRef}
              className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-7 flex flex-col justify-between min-h-[380px]"
            >
              <div>
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#F5F7F5]">
                    <CheckCircle2 className="w-4 h-4 text-[#8BF58D]" />
                    <span className="font-display">Послание</span>
                  </div>

                  {decodeResult && (
                    <span
                      className={`text-[11px] px-2.5 py-0.5 rounded-full border ${
                        decodeResult.success
                          ? 'bg-[#8BF58D]/10 text-[#8BF58D] border-[#8BF58D]/20'
                          : 'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}
                    >
                      {decodeResult.success ? 'Целостность подтверждена' : 'Ошибка'}
                    </span>
                  )}
                </div>

                <div className="rounded-xl sm:rounded-2xl bg-[#101418] border border-white/[0.1] p-3.5 sm:p-5 min-h-[180px] sm:min-h-[200px] text-xs sm:text-sm leading-relaxed text-[#F5F7F5]">
                  {decodeResult ? (
                    decodeResult.success ? (
                      <div className="space-y-3 sm:space-y-4">
                        <div className="font-display text-base sm:text-lg font-medium text-[#8BF58D] bg-[#8BF58D]/5 p-3.5 sm:p-4 rounded-xl border border-[#8BF58D]/20 break-words">
                          «{decodeResult.message}»
                        </div>
                        <div className="text-[11px] sm:text-xs text-[#92999F] space-y-1 pt-1">
                          <div>
                            Носитель:{' '}
                            <span className="text-[#F5F7F5] font-mono">
                              {decodeResult.detectionMethod === 'text-unicode'
                                ? 'текст · невидимые маркеры'
                                : 'кёрнинг · letter-spacing'}
                            </span>
                          </div>
                          <div>
                            Длина:{' '}
                            <span className="text-[#F5F7F5]">
                              {decodeResult.message.length} символов
                            </span>
                          </div>
                          <div>
                            CRC16:{' '}
                            <span className="text-[#8BF58D] font-mono">
                              {decodeResult.checksumValid ? 'ВАЛИДНА' : 'НЕ СОВПАЛА'}
                            </span>
                          </div>
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
                    <div className="h-full flex flex-col items-center justify-center gap-3 text-center py-8">
                      <div className="font-display text-3xl text-[#8BF58D]/25">01</div>
                      <p className="text-[#62686F] italic max-w-[260px] text-[11px] sm:text-xs">
                        Вставьте носитель слева — декодер сам определит, где спрятаны биты.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 sm:mt-8 pt-4 sm:pt-6 border-t border-white/[0.08] flex items-center justify-end">
                <button
                  disabled={!decodeResult?.success}
                  onClick={() => decodeResult?.message && handleCopy(decodeResult.message, 'decode')}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#F5F7F5] bg-[#101418] border border-white/[0.14] hover:bg-white/[0.06] hover:border-white/30 transition-all active:scale-95 disabled:opacity-40 cursor-pointer shadow-sm"
                >
                  {copiedDecode ? (
                    <>
                      <Check className="w-4 h-4 text-[#8BF58D]" />
                      <span className="text-[#8BF58D]">Скопировано!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-[#92999F]" />
                      <span>Копировать сообщение</span>
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

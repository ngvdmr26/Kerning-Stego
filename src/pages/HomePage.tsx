import React from 'react';
import { ArrowRight, BookOpen, Binary, ShieldCheck, MessageSquareText } from 'lucide-react';
import { motion } from 'framer-motion';
import { KerningDemo } from '../components/KerningDemo';
import { SecretCard } from '../components/SecretCard';

interface HomePageProps {
  setActiveTab: (tab: string) => void;
}

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

const steps = [
  {
    n: '01',
    title: 'Текст-носитель',
    text: 'Берём обычный текст. Каждый его символ может нести до восьми бит сообщения.',
    foot: 'без вложений и файлов',
    icon: MessageSquareText,
  },
  {
    n: '02',
    title: 'Два способа спрятать',
    text: 'Невидимые маркеры для мессенджеров или кёрнинг для HTML-документов.',
    foot: 'выбор носителя в инструменте',
    icon: Binary,
  },
  {
    n: '03',
    title: 'Передача и проверка',
    text: 'Получатель вставляет текст или контейнер в декодер. CRC16 подтверждает целостность.',
    foot: 'декодер определяет носитель сам',
    icon: ShieldCheck,
  },
];

export const HomePage: React.FC<HomePageProps> = ({ setActiveTab }) => {
  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col justify-between py-6 sm:py-12 lg:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* ================= HERO ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-center pt-1 sm:pt-4">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="lg:col-span-7 flex flex-col items-start z-10 text-left"
          >
            <motion.div
              variants={item}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#8BF58D]/25 bg-[#8BF58D]/[0.07] text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.18em] text-[#8BF58D] mb-4 sm:mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#8BF58D] animate-pulse" />
              стеганография в тексте
            </motion.div>

            <motion.h1
              variants={item}
              className="font-display text-[32px] xs:text-4xl sm:text-5xl lg:text-[58px] font-semibold text-[#F5F7F5] leading-[1.08] mb-4 sm:mb-6 text-balance"
            >
              Сообщение,
              <br />
              которого
              <br />
              <span className="text-gradient">не видно</span>
            </motion.h1>

            <motion.p
              variants={item}
              className="text-[#92999F] text-sm sm:text-lg max-w-xl leading-relaxed mb-6 sm:mb-9"
            >
              <span className="hidden sm:inline">
                Текст остаётся обычным текстом. Внутри — невидимые маркеры или микросдвиги
                межбуквенных интервалов. Прочитать их может только декодер.
              </span>
              <span className="sm:hidden">
                Обычный текст, внутри которого спрятано послание. Видно только декодеру.
              </span>
            </motion.p>

            <motion.div
              variants={item}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-4 w-full sm:w-auto mb-8 sm:mb-10"
            >
              <button
                type="button"
                onClick={() => setActiveTab('tool')}
                className="btn-shine w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full text-sm sm:text-base font-semibold bg-[#8BF58D] text-[#080B0D] hover:bg-[#A4FBA6] transition-all duration-200 hover:shadow-[0_0_36px_rgba(139,245,141,0.45)] transform active:scale-95 cursor-pointer"
              >
                <span>Спрятать сообщение</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('docs')}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full text-sm sm:text-base font-medium text-[#F5F7F5] bg-[#171C22]/80 backdrop-blur-md border border-white/[0.12] hover:bg-white/[0.08] hover:border-white/25 transition-all duration-200 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-[#8BF58D]" />
                <span>Как это работает</span>
              </button>
            </motion.div>

            <motion.dl variants={item} className="grid grid-cols-3 gap-3 sm:gap-8 w-full max-w-xl">
              {[
                { value: '2 бита', label: 'на зазор кёрнинга' },
                { value: '8 бит', label: 'на символ текста' },
                { value: 'CRC16', label: 'проверка целостности' },
              ].map((stat) => (
                <div key={stat.value} className="border-l border-white/[0.1] pl-3 sm:pl-4">
                  <dt className="font-display text-sm sm:text-lg text-[#F5F7F5]">{stat.value}</dt>
                  <dd className="text-[10px] sm:text-xs text-[#62686F] leading-snug mt-0.5">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </motion.dl>
          </motion.div>

          <motion.div
            variants={item}
            initial="hidden"
            animate="show"
            className="lg:col-span-5 relative flex items-center justify-center w-full"
          >
            <SecretCard />
          </motion.div>
        </div>

        {/* ================= STEPS ================= */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mt-14 sm:mt-20"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5 sm:mb-7">
            <h2 className="font-display text-xl sm:text-3xl text-[#F5F7F5] leading-tight">
              Как это работает
            </h2>
            <p className="text-[11px] sm:text-sm text-[#62686F] max-w-sm">
              Никакой магии: геометрия текста, биты и контрольная сумма.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.n}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="glass-card rounded-2xl p-4 sm:p-5 group flex flex-col"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[10px] text-[#8BF58D]/80">{step.n}</span>
                    <div className="w-7 h-7 rounded-lg bg-[#12161B] border border-white/[0.08] flex items-center justify-center group-hover:border-[#8BF58D]/30 transition-colors">
                      <Icon className="w-3.5 h-3.5 text-[#8BF58D]" />
                    </div>
                  </div>
                  <div className="font-semibold text-sm sm:text-[15px] text-[#F5F7F5] mb-1.5">
                    {step.title}
                  </div>
                  <p className="text-[11px] sm:text-xs text-[#92999F] leading-relaxed flex-1">
                    {step.text}
                  </p>
                  <div className="mt-3 pt-3 border-t border-white/[0.06] text-[9px] sm:text-[10px] font-mono text-[#62686F]">
                    {step.foot}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* ================= DEMO ================= */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mt-14 sm:mt-20 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-center"
        >
          <div className="lg:col-span-5">
            <div className="text-[10px] uppercase tracking-[0.18em] text-[#8BF58D] font-mono mb-2">
              демонстрация
            </div>
            <h2 className="font-display text-xl sm:text-3xl text-[#F5F7F5] leading-tight mb-3 sm:mb-4">
              Сдвиг, который не видно
            </h2>
            <p className="text-xs sm:text-sm text-[#92999F] leading-relaxed mb-4">
              Один зазор несёт пару бит: 00, 01, 10 или 11. Разница между ними — доли пикселя,
              поэтому текст читается как обычный. Измеряется она точно: инспектор показывает
              каждое значение.
            </p>
            <ul className="space-y-2 text-[11px] sm:text-xs text-[#92999F]">
              {[
                '4 уровня зазора: 0 / 0.02 / 0.04 / 0.06em',
                'Шаг 0.02em — это 0.32px при кегле 16px',
                'Кёрнинг требует HTML, маркеры — обычного текста',
              ].map((line) => (
                <li key={line} className="flex items-start gap-2">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-[#8BF58D] flex-shrink-0" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-7">
            <KerningDemo />
          </div>
        </motion.section>

        {/* ================= CONTAINER ================= */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mt-14 sm:mt-20 mb-4"
        >
          <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-7 grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8 items-center">
            <div>
              <h2 className="font-display text-lg sm:text-2xl text-[#F5F7F5] mb-2">
                Один метод — два носителя
              </h2>
              <p className="text-[11px] sm:text-sm text-[#92999F] leading-relaxed">
                Для мессенджера подходит текст с невидимыми маркерами: он копируется как обычное
                сообщение. Для документа — HTML с интервалами кёрнинга: сообщение живёт в
                разметке и видно только измерением.
              </p>
            </div>

            <div className="rounded-2xl bg-[#080B0D]/70 border border-white/[0.08] p-4 sm:p-5 overflow-x-auto">
              <pre className="font-mono text-[9px] sm:text-[11px] leading-relaxed text-[#92999F]">
{`<span style="letter-spacing:0.04em">И</span>
<span style="letter-spacing:0.00em">н</span>
<span style="letter-spacing:0.06em">ф</span>
<span style="letter-spacing:0.02em">о</span>`}
              </pre>
              <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono">
                <span className="text-[#62686F]">10 = 0.04em · 11 = 0.06em</span>
                <span className="text-[#8BF58D]">CRC16 ✓</span>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

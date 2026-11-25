import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQS = [
  {
    q: 'Что именно прячется в тексте?',
    a: 'Биты сообщения. В текстовом носителе они живут в невидимых символах нулевой ширины, в HTML-носителе — в межбуквенных интервалах. Снаружи это обычное сообщение: те же буквы, те же слова.',
  },
  {
    q: 'Можно ли отправить такое сообщение в мессенджере?',
    a: 'Да, если выбран текстовый носитель. Скопируйте результат и вставьте в чат: невидимые маркеры сохраняются вместе с текстом. Получатель вставит сообщение в декодер и прочитает послание.',
  },
  {
    q: 'А зачем тогда кёрнинг?',
    a: 'Кёрнинг — более тонкий носитель для документов и вёрстки: сообщение живёт в реальных расстояниях между буквами. Он существует только там, где сохраняется форматирование, — в HTML-файле или на странице.',
  },
  {
    q: 'Насколько надёжно скрыто сообщение?',
    a: 'Стеганография скрывает сам факт наличия сообщения. Визуально текст выглядит обычным. Но специализированный анализ может обнаружить невидимые символы или измерить интервалы — это не заменяет шифрование.',
  },
  {
    q: 'Что произойдёт при копировании?',
    a: 'Текстовый носитель переживает копирование и вставку. HTML-контейнер нужно передавать целиком — при вставке обычным текстом интервалы исчезнут вместе с сообщением.',
  },
  {
    q: 'Поддерживаются ли другие языки?',
    a: 'Да. Сообщение кодируется в UTF-8, поэтому подходят русский, английский, другие языки, эмодзи и спецсимволы.',
  },
  {
    q: 'Какой объём сообщения помещается?',
    a: 'В текстовом носителе — примерно один байт на символ открытого текста. В кёрнинге — два бита на промежуток, то есть около байта на четыре символа. Точный минимум показывает счётчик в инструменте.',
  },
];

export const FaqPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] py-6 sm:py-10 lg:py-14">
      <div className="max-w-4xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-10">
          <div className="inline-flex items-center gap-2 text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.2em] text-[#8BF58D] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8BF58D]" />
            вопросы
          </div>
          <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl text-[#F5F7F5] leading-[1.1] mb-2 sm:mb-3">
            Частые вопросы
          </h1>
          <p className="text-[#92999F] text-xs sm:text-base leading-relaxed max-w-2xl">
            Коротко о том, как сообщение живёт в тексте и что с ним происходит при передаче.
          </p>
        </div>

        <div className="space-y-2 sm:space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.q}
                className="glass-card rounded-xl sm:rounded-2xl overflow-hidden border border-white/[0.08]"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full p-3.5 sm:p-5 text-left flex items-center justify-between gap-3 sm:gap-4 transition-colors hover:bg-white/[0.03] cursor-pointer"
                >
                  <span className="flex items-center gap-3 min-w-0">
                    <span className="font-mono text-[10px] text-[#8BF58D]/60 flex-shrink-0">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-xs sm:text-base font-semibold text-[#F5F7F5] leading-snug">
                      {faq.q}
                    </span>
                  </span>
                  <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#12161B] border border-white/10 flex items-center justify-center flex-shrink-0 text-[#92999F]">
                    {isOpen ? (
                      <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8BF58D]" />
                    ) : (
                      <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    )}
                  </span>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-3.5 pb-3.5 sm:px-5 sm:pb-5 sm:pl-14 text-xs sm:text-sm text-[#92999F] leading-relaxed border-t border-white/[0.04] pt-3 sm:pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <div className="mt-6 sm:mt-8 text-center text-[10px] sm:text-xs text-[#62686F]">
          Не нашли ответ? Принцип работы описан в{' '}
          <span className="text-[#8BF58D]">документации</span>.
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Plus, Minus, HelpCircle, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeImage } from '../components/ThemeImage';

interface FaqPageProps {
  isDarkTheme?: boolean;
}

export const FaqPage: React.FC<FaqPageProps> = ({ isDarkTheme = true }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Насколько надёжно скрытое сообщение?',
      a: 'Стеганография скрывает сам факт наличия сообщения. Визуально текст выглядит абсолютно нормально и естественно. Для максимальной безопасности критически важных данных рекомендуется предварительно зашифровать текст (например, AES), а затем встроить его с помощью метода Кёрнинга.',
    },
    {
      q: 'Можно ли обнаружить скрытый текст?',
      a: 'Обычный читатель не заметит присутствия сообщения: интервалы меняются на доли пикселя. Но это не невидимые символы — расстояния реально записаны в letter-spacing, поэтому их можно измерить и увидеть в инспекторе или в коде страницы.',
    },
    {
      q: 'Поддерживаются ли другие языки?',
      a: 'Да! Алгоритм использует полноценную таблицу кодировки UTF-8. Вы можете передавать сообщения на русском, английском, китайском, использовать спецсимволы и даже эмодзи.',
    },
    {
      q: 'Можно ли передавать большие сообщения?',
      a: 'Размер ограничен длиной открытого текста: 2 бита на каждый промежуток, то есть около 1 байта на 4 символа. Для длинного сообщения нужен длинный текст-контейнер или несколько контейнеров.',
    },
    {
      q: 'Что произойдёт при копировании текста?',
      a: 'При копировании обычным текстом интервалы теряются — останутся только буквы. Чтобы сообщение выжило, передавайте HTML-контейнер (кнопка «Копировать контейнер») или сохранённый HTML-файл.',
    },
    {
      q: 'Какие форматы поддерживаются?',
      a: 'На вход — обычный текст, на выходе — HTML-контейнер: разметка со span и letter-spacing. Её можно вставить обратно в декодер или сохранить как .html-файл.',
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] py-4 sm:py-10 lg:py-14">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        
        {/* Main Grid: Left Accordion + Right 3D Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
          
          {/* Left Column: Title + FAQ Accordion */}
          <div className="lg:col-span-8 text-left">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#F5F7F5] tracking-tight mb-2 sm:mb-3">
              Часто задаваемые <br className="hidden sm:inline" />
              вопросы
            </h1>
            <p className="text-[#92999F] text-xs sm:text-base max-w-xl mb-4 sm:mb-10 leading-relaxed">
              <span className="hidden sm:inline">Ответы на популярные вопросы о методе Кёрнинга и нашем инструменте.</span>
              <span className="sm:hidden">Популярные вопросы о стеганографии и работе сервиса.</span>
            </p>

            {/* Accordion list matching Reference */}
            <div className="space-y-2 sm:space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <div
                    key={index}
                    className="glass-card rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-200 border border-white/[0.08]"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      className="w-full p-3.5 sm:p-6 text-left flex items-center justify-between gap-3 sm:gap-4 transition-colors hover:bg-white/[0.03] cursor-pointer"
                    >
                      <span className="text-xs sm:text-base font-semibold text-[#F5F7F5] leading-snug">
                        {faq.q}
                      </span>
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#12161B] border border-white/10 flex items-center justify-center flex-shrink-0 text-[#92999F] transition-all">
                        {isOpen ? (
                          <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8BF58D]" />
                        ) : (
                          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#92999F]" />
                        )}
                      </div>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="px-3.5 pb-3.5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-[#92999F] leading-relaxed border-t border-white/[0.04] pt-3 sm:pt-4">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: 3D Speech Bubble with Question Mark */}
          <div className="lg:col-span-4 relative flex items-center justify-center pt-2 sm:pt-8 lg:pt-16 w-full">
            <div className="absolute w-44 h-44 sm:w-64 sm:h-64 rounded-full bg-[#8BF58D]/15 blur-[80px] pointer-events-none" />

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative w-full max-w-[200px] sm:max-w-[320px] group"
            >
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/[0.14] bg-[#12161B]/80 shadow-2xl backdrop-blur-2xl">
                <ThemeImage
                  dark="/assets/faq-bubble.jpg"
                  light="/assets/faq-bubble-light.jpg"
                  alt="3D Speech Bubble with question mark"
                  isDarkTheme={isDarkTheme}
                  imageClassName="transition-transform duration-700 group-hover:scale-105"
                />

                {/* Question mark badge */}
                <div className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-2xl bg-[#080B0D]/80 backdrop-blur-md border border-white/10 flex items-center justify-center">
                  <HelpCircle className="w-4 h-4 sm:w-6 sm:h-6 text-[#8BF58D] drop-shadow-[0_0_8px_rgba(139,245,141,0.5)]" />
                </div>

                <div className={`p-3 sm:p-5 bg-gradient-to-t ${isDarkTheme ? 'from-[#080B0D] via-[#101418]/90' : 'from-white via-white/85'} to-transparent`}>
                  <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-[#8BF58D] mb-0.5 sm:mb-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Центр помощи</span>
                  </div>
                  <p className="text-[10px] sm:text-xs text-[#92999F]">
                    Ознакомьтесь с подробной документацией по протоколу.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

        </div>

      </div>
    </div>
  );
};

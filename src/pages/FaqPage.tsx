import React, { useState } from 'react';
import { Plus, Minus, HelpCircle, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const FaqPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const faqs = [
    {
      q: 'Насколько надёжно скрытое сообщение?',
      a: 'Стеганография скрывает сам факт наличия сообщения. Визуально текст выглядит абсолютно нормально и естественно. Для максимальной безопасности критически важных данных рекомендуется предварительно зашифровать текст (например, AES), а затем встроить его с помощью метода Кёрнинга.',
    },
    {
      q: 'Можно ли обнаружить скрытый текст?',
      a: 'Обычный читатель не заметит присутствия сообщения, так как межбуквенные интервалы меняются на доли пикселей или кодируются невидимыми символами нулевой ширины. Однако специализированный стегоанализ или проверка исходного кода страницы могут выявить наличие меток.',
    },
    {
      q: 'Поддерживаются ли другие языки?',
      a: 'Да! Алгоритм использует полноценную таблицу кодировки UTF-8. Вы можете передавать сообщения на русском, английском, китайском, использовать спецсимволы и даже эмодзи.',
    },
    {
      q: 'Можно ли передавать большие сообщения?',
      a: 'Размер скрываемого сообщения ограничен длиной текста-обёртки. На каждый байт секрета требуется 8 символов исходного текста (плюс 48 бит служебного заголовка CRC16 и длины). Для больших сообщений используйте длинные статьи или книги в качестве контейнера.',
    },
    {
      q: 'Что произойдёт при копировании текста?',
      a: 'При копировании текста через буфер обмена невидимые Unicode-символы сохраняются во всех современных мессенджерах (Telegram, WhatsApp), текстовых редакторах и браузерах. Для гарантированного сохранения визуального кёрнинга доступна выгрузка в автономный HTML-документ.',
    },
    {
      q: 'Какие форматы поддерживаются?',
      a: 'Инструмент поддерживает работу с обычным текстом (Plain Text), форматированным HTML-кодом, а также экспорт в файлы .txt и .html.',
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] py-8 lg:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid: Left Accordion + Right 3D Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Title + FAQ Accordion */}
          <div className="lg:col-span-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F5F7F5] tracking-tight mb-3">
              Часто задаваемые <br className="hidden sm:inline" />
              вопросы
            </h1>
            <p className="text-[#92999F] text-sm sm:text-base max-w-xl mb-10">
              Ответы на популярные вопросы о методе Кёрнинга и нашем инструменте.
            </p>

            {/* Accordion list matching Reference */}
            <div className="space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <div
                    key={index}
                    className="glass-card rounded-2xl overflow-hidden transition-all duration-200 border border-white/[0.08]"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 transition-colors hover:bg-white/[0.03]"
                    >
                      <span className="text-sm sm:text-base font-semibold text-[#F5F7F5]">
                        {faq.q}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-[#12161B] border border-white/10 flex items-center justify-center flex-shrink-0 text-[#92999F] transition-all">
                        {isOpen ? (
                          <Minus className="w-4 h-4 text-[#8BF58D]" />
                        ) : (
                          <Plus className="w-4 h-4 text-[#92999F]" />
                        )}
                      </div>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <div className="px-5 pb-6 sm:px-6 sm:pb-6 text-xs sm:text-sm text-[#92999F] leading-relaxed border-t border-white/[0.04] pt-4">
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

          {/* Right Column: 3D Speech Bubble with Question Mark matching Reference */}
          <div className="lg:col-span-4 relative flex items-center justify-center pt-8 lg:pt-16">
            <div className="absolute w-64 h-64 rounded-full bg-[#8BF58D]/15 blur-[90px] pointer-events-none" />

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="relative w-full max-w-[320px] group"
            >
              <div className="relative rounded-3xl overflow-hidden border border-white/[0.14] bg-[#12161B]/80 shadow-2xl backdrop-blur-2xl">
                <img 
                  src="/assets/faq-bubble.jpg" 
                  alt="3D Speech Bubble with question mark" 
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />

                {/* Question mark badge */}
                <div className="absolute top-4 right-4 w-12 h-12 rounded-2xl bg-[#080B0D]/80 backdrop-blur-md border border-white/10 flex items-center justify-center">
                  <HelpCircle className="w-6 h-6 text-[#8BF58D] drop-shadow-[0_0_8px_rgba(139,245,141,0.5)]" />
                </div>

                <div className="p-5 bg-gradient-to-t from-[#080B0D] via-[#101418]/90 to-transparent">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#8BF58D] mb-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Центр помощи</span>
                  </div>
                  <p className="text-xs text-[#92999F]">
                    Остались вопросы? Ознакомьтесь с подробной документацией по протоколу.
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

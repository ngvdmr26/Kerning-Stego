import React, { useState } from 'react';
import { 
  BookOpen, 
  Code2, 
  Binary, 
  AlertTriangle, 
  Lightbulb, 
  ArrowRight, 
  Check, 
  Layers, 
  FileCheck2,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const DocsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'how' | 'encoding' | 'decoding' | 'examples' | 'limits' | 'tips'>('how');

  const navItems = [
    { id: 'how', label: 'Как это работает?', icon: BookOpen },
    { id: 'encoding', label: 'Кодирование информации', icon: Binary },
    { id: 'decoding', label: 'Декодирование', icon: Cpu },
    { id: 'examples', label: 'Примеры', icon: Code2 },
    { id: 'limits', label: 'Ограничения', icon: AlertTriangle },
    { id: 'tips', label: 'Советы', icon: Lightbulb },
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] py-8 lg:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F5F7F5] tracking-tight mb-3">
            Документация
          </h1>
          <p className="text-[#92999F] text-sm sm:text-base max-w-2xl">
            Подробное руководство по использованию и принципам работы метода.
          </p>
        </div>

        {/* Documentation Layout: Left Sidebar + Right Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sidebar Menu matching Reference */}
          <div className="lg:col-span-4 glass-card rounded-3xl p-3 sm:p-4 flex flex-col gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as any)}
                  className={`flex items-center justify-between px-4 py-3.5 rounded-2xl text-xs sm:text-sm font-medium transition-all text-left ${
                    isActive
                      ? 'bg-[#12161B] text-[#8BF58D] border border-[#8BF58D]/30 shadow-glow-sm font-semibold'
                      : 'text-[#92999F] hover:text-[#F5F7F5] hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#8BF58D]' : 'text-[#62686F]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive ? (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#8BF58D] shadow-[0_0_8px_#8BF58D]" />
                  ) : (
                    <span className="text-[#62686F] text-xs">+</span>
                  )}
                </button>
              );
            })}

            {/* Quick Stat Pill at bottom of sidebar */}
            <div className="mt-4 p-4 rounded-2xl bg-[#101418] border border-white/[0.06] text-xs text-[#92999F]">
              <div className="text-[#F5F7F5] font-semibold mb-1 flex items-center gap-1.5">
                <FileCheck2 className="w-3.5 h-3.5 text-[#8BF58D]" />
                <span>Спецификация v1.4</span>
              </div>
              <p className="text-[11px] text-[#62686F] leading-relaxed">
                Соответствует стандартам Unicode 15.0 и CSS Fonts Module Level 3.
              </p>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-8 glass-card rounded-3xl p-6 sm:p-10 min-h-[500px]">
            <AnimatePresence mode="wait">
              
              {/* SECTION 1: КАК ЭТО РАБОТАЕТ? (Matching Reference Exactly) */}
              {activeSection === 'how' && (
                <motion.div
                  key="how"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-[#F5F7F5] mb-4">
                      Как это работает?
                    </h2>
                    <p className="text-[#92999F] text-sm sm:text-base leading-relaxed">
                      Метод Кёрнинга основан на изменении расстояний между символами в тексте.
                      Эти изменения практически незаметны для человека, но могут быть использованы
                      для передачи скрытой информации.
                    </p>
                  </div>

                  {/* Visual Comparison Box matching Reference */}
                  <div className="p-6 rounded-2xl bg-[#101418] border border-white/[0.1] shadow-inner">
                    <div className="text-xs uppercase font-mono tracking-wider text-[#62686F] mb-4">
                      Визуальное сравнение:
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
                      {/* Left: Ordinary text */}
                      <div className="md:col-span-5 bg-[#171C22] p-4 rounded-xl border border-white/[0.06]">
                        <span className="text-xs text-[#92999F] block mb-2 font-medium">Обычный текст</span>
                        <div className="text-lg font-serif text-[#F5F7F5] tracking-normal">
                          Пример текста
                        </div>
                      </div>

                      {/* Middle: Arrow */}
                      <div className="md:col-span-1 flex justify-center text-[#8BF58D]">
                        <ArrowRight className="w-5 h-5" />
                      </div>

                      {/* Right: Text with hidden kerning shift */}
                      <div className="md:col-span-5 bg-[#171C22] p-4 rounded-xl border border-[#8BF58D]/30 relative overflow-hidden">
                        <span className="text-xs text-[#8BF58D] block mb-2 font-medium">Текст с скрытым сообщением</span>
                        <div className="text-lg font-serif text-[#F5F7F5]">
                          П<span className="tracking-[0.14em] text-[#8BF58D]">р</span>и<span className="tracking-[0.12em] text-[#8BF58D]">м</span> е р текста
                        </div>
                        <div className="absolute top-2 right-2 text-[10px] bg-[#8BF58D]/20 text-[#8BF58D] px-2 py-0.5 rounded-full font-mono">
                          Δ +0.12em
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Core Steps Breakdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                    <div className="p-4 rounded-2xl bg-[#12161B] border border-white/[0.06]">
                      <div className="text-[#8BF58D] font-bold text-sm mb-1.5">1. Преобразование</div>
                      <p className="text-xs text-[#92999F] leading-relaxed">
                        Текст переводится в биты UTF-8, вычисляется контрольная сумма CRC16.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#12161B] border border-white/[0.06]">
                      <div className="text-[#8BF58D] font-bold text-sm mb-1.5">2. Внедрение</div>
                      <p className="text-xs text-[#92999F] leading-relaxed">
                        Биты встраиваются как микромодуляции интервалов между буквами.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#12161B] border border-white/[0.06]">
                      <div className="text-[#8BF58D] font-bold text-sm mb-1.5">3. Извлечение</div>
                      <p className="text-xs text-[#92999F] leading-relaxed">
                        Декодер считывает последовательность и проверяет целостность сообщения.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* SECTION 2: КОДИРОВАНИЕ ИНФОРМАЦИИ */}
              {activeSection === 'encoding' && (
                <motion.div
                  key="encoding"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl sm:text-2xl font-bold text-[#F5F7F5]">
                    Кодирование информации
                  </h2>
                  <p className="text-[#92999F] text-sm leading-relaxed">
                    Алгоритм использует строгий формат пакета полезной нагрузки, обеспечивающий безошибочное распознавание стегоконтейнера.
                  </p>

                  <div className="bg-[#101418] p-5 rounded-2xl border border-white/10 font-mono text-xs text-[#F5F7F5] space-y-3">
                    <div className="text-[#8BF58D] font-bold">[Структура пакета данных]:</div>
                    <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                      <div className="bg-[#171C22] p-2.5 rounded-lg border border-white/10">
                        <span className="text-[#8BF58D] block font-bold">16 бит</span>
                        <span className="text-[#92999F]">Magic (0x4B53)</span>
                      </div>
                      <div className="bg-[#171C22] p-2.5 rounded-lg border border-white/10">
                        <span className="text-[#8BF58D] block font-bold">16 бит</span>
                        <span className="text-[#92999F]">Длина (байт)</span>
                      </div>
                      <div className="bg-[#171C22] p-2.5 rounded-lg border border-white/10">
                        <span className="text-[#8BF58D] block font-bold">16 бит</span>
                        <span className="text-[#92999F]">CRC16 Checksum</span>
                      </div>
                      <div className="bg-[#171C22] p-2.5 rounded-lg border border-[#8BF58D]/40">
                        <span className="text-[#8BF58D] block font-bold">N × 8 бит</span>
                        <span className="text-[#92999F]">Полезная нагрузка</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs sm:text-sm text-[#92999F]">
                    <div className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#8BF58D] flex-shrink-0 mt-0.5" />
                      <span><strong>Бит «1»:</strong> отображается расширенным межбуквенным интервалом (+0.12em) или невидимым символом U+200B.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#8BF58D] flex-shrink-0 mt-0.5" />
                      <span><strong>Бит «0»:</strong> отображается стандартным суженным интервалом (-0.015em) или символом U+200C.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#8BF58D] flex-shrink-0 mt-0.5" />
                      <span><strong>Маркеры границ:</strong> специальные Unicode последовательности для мгновенной локализации стегоконтейнера.</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* SECTION 3: ДЕКОДИРОВАНИЕ */}
              {activeSection === 'decoding' && (
                <motion.div
                  key="decoding"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl sm:text-2xl font-bold text-[#F5F7F5]">
                    Декодирование и валидация
                  </h2>
                  <p className="text-[#92999F] text-sm leading-relaxed">
                    Процедура извлечения информации полностью автономна и не требует исходного оригинального текста (Blind Steganalysis).
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-[#101418] border border-white/10">
                      <h4 className="text-sm font-semibold text-[#F5F7F5] mb-2 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-[#8BF58D]" />
                        <span>Автоматический детектор</span>
                      </h4>
                      <p className="text-xs text-[#92999F] leading-relaxed">
                        Декодер поддерживает как обычные текстовые строки с незаметными Unicode-интервалами, так и сырой HTML-код со стилевыми spans.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#101418] border border-white/10">
                      <h4 className="text-sm font-semibold text-[#F5F7F5] mb-2 flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-[#8BF58D]" />
                        <span>Проверка CRC16</span>
                      </h4>
                      <p className="text-xs text-[#92999F] leading-relaxed">
                        Полином CRC-CCITT (0x1021) проверяет целостность каждого байта, исключая случайный шум и неполные сообщения.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* SECTION 4: ПРИМЕРЫ */}
              {activeSection === 'examples' && (
                <motion.div
                  key="examples"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl sm:text-2xl font-bold text-[#F5F7F5]">
                    Практические примеры
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-[#101418] border border-white/10">
                      <div className="text-xs text-[#8BF58D] font-mono mb-2">Пример 1: Водяные знаки для документов</div>
                      <p className="text-xs text-[#92999F] leading-relaxed">
                        Внедрение идентификатора автора или метки времени в текст контракта или статьи. При копировании текста метка сохраняется.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#101418] border border-white/10">
                      <div className="text-xs text-[#8BF58D] font-mono mb-2">Пример 2: Скрытая передача ключей или паролей</div>
                      <p className="text-xs text-[#92999F] leading-relaxed">
                        Передача секретных токенов доступа внутри обычных новостных или рабочих сообщений без привлечения внимания сетевых фильтров.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* SECTION 5: ОГРАНИЧЕНИЯ */}
              {activeSection === 'limits' && (
                <motion.div
                  key="limits"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl sm:text-2xl font-bold text-[#F5F7F5]">
                    Ограничения метода
                  </h2>
                  
                  <div className="space-y-3 text-xs sm:text-sm text-[#92999F]">
                    <div className="p-4 rounded-2xl bg-[#171C22] border border-amber-500/20 flex items-start gap-3">
                      <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[#F5F7F5] block mb-1">Ёмкость контейнера:</strong>
                        <span>Для скрытия каждого символа секретного сообщения требуется в среднем 8-16 символов в исходном тексте-обёртке.</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#171C22] border border-amber-500/20 flex items-start gap-3">
                      <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[#F5F7F5] block mb-1">Очистка Unicode:</strong>
                        <span>Некоторые системы с анти-спам фильтрами могут удалять управляющие символы нулевой ширины при санитайзинге текста.</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* SECTION 6: СОВЕТЫ */}
              {activeSection === 'tips' && (
                <motion.div
                  key="tips"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl sm:text-2xl font-bold text-[#F5F7F5]">
                    Советы по использованию
                  </h2>
                  
                  <div className="space-y-3 text-xs sm:text-sm text-[#92999F]">
                    <div className="p-4 rounded-2xl bg-[#101418] border border-white/10 flex items-start gap-3">
                      <Lightbulb className="w-4 h-4 text-[#8BF58D] flex-shrink-0 mt-0.5" />
                      <span>Используйте достаточно длинные тексты с естественным содержанием (статьи, заметки), чтобы скрыть секрет с запасом ёмкости.</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#101418] border border-white/10 flex items-start gap-3">
                      <Lightbulb className="w-4 h-4 text-[#8BF58D] flex-shrink-0 mt-0.5" />
                      <span>Для сохранения межбуквенных интервалов при пересылке верстки используйте кнопку <strong>«Скачать HTML»</strong>.</span>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>

      </div>
    </div>
  );
};

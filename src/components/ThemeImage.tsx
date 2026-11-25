import React from 'react';

interface ThemeImageProps {
  dark: string;
  light: string;
  alt: string;
  isDarkTheme: boolean;
  className?: string;
  imageClassName?: string;
}

/**
 * Обе картинки загружаются сразу и лежат друг на друге: при смене темы
 * меняется только opacity через inline-стиль, поэтому нет запроса и мигания.
 * Opacity задаётся стилем, а не классами — иначе декоративные классы
 * (например opacity-90) конфликтуют с переключением темы.
 */
export const ThemeImage: React.FC<ThemeImageProps> = ({
  dark,
  light,
  alt,
  isDarkTheme,
  className = '',
  imageClassName = '',
}) => (
  <div className={`grid ${className}`}>
    <img
      src={dark}
      alt={alt}
      loading="eager"
      decoding="async"
      onError={(e) => {
        (e.target as HTMLElement).style.display = 'none';
      }}
      style={{ opacity: isDarkTheme ? 1 : 0 }}
      className={`col-start-1 row-start-1 w-full h-full object-cover transition-opacity duration-300 will-change-[opacity] ${imageClassName}`}
    />
    <img
      src={light}
      alt=""
      aria-hidden="true"
      loading="eager"
      decoding="async"
      onError={(e) => {
        (e.target as HTMLElement).style.display = 'none';
      }}
      style={{ opacity: isDarkTheme ? 0 : 1 }}
      className={`col-start-1 row-start-1 w-full h-full object-cover transition-opacity duration-300 will-change-[opacity] ${imageClassName}`}
    />
  </div>
);

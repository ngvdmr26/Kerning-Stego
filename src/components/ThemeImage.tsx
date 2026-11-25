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
 * меняется только opacity, поэтому нет запроса и мигания белым.
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
      className={`col-start-1 row-start-1 w-full h-full object-cover transition-opacity duration-200 ${
        isDarkTheme ? 'opacity-100' : 'opacity-0'
      } ${imageClassName}`}
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
      className={`col-start-1 row-start-1 w-full h-full object-cover transition-opacity duration-200 ${
        isDarkTheme ? 'opacity-0' : 'opacity-100'
      } ${imageClassName}`}
    />
  </div>
);

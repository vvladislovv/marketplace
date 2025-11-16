'use client';

import React, { useState, useEffect } from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
}

const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2U1ZTdlYiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';

export function ImageWithFallback({
  src,
  alt,
  fill,
  width,
  height,
  className = '',
  sizes,
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    // Используем setTimeout чтобы избежать обновления во время рендера
    setTimeout(() => {
      if (!hasError) {
        setHasError(true);
        setImgSrc(PLACEHOLDER_IMAGE);
      }
    }, 0);
  };

  // Используем обычный img тег для всех случаев, чтобы избежать проблем с hydration
  // и обновлениями во время рендера, которые возникают с Next.js Image
  if (fill) {
    return (
      <img
        src={hasError ? PLACEHOLDER_IMAGE : imgSrc}
        alt={alt}
        className={className}
        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
        onError={handleError}
        loading="lazy"
      />
    );
  }

  return (
    <img
      src={hasError ? PLACEHOLDER_IMAGE : imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={{ objectFit: 'cover' }}
      onError={handleError}
      loading="lazy"
    />
  );
}


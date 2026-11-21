'use client';

import { useEffect, useState } from 'react';

// Caché global en memoria mientras la pestaña esté abierta
const blobCache = new Map<string, string>();

export function SecureImage({
  src,
  alt,
  className,
  thumb = false,
}: {
  src: string;
  alt: string;
  className?: string;
  thumb?: boolean;
  loading?: 'lazy' | 'eager';
}) {
  const thumbUrl = src.startsWith('/api/drive-image/') ? `${src}?size=thumb` : src;
  const fullUrl = src;

  // Si es vista ampliada (!thumb), intentamos usar la miniatura ya cacheada como vista previa inmediata
  const initialCached = thumb
    ? blobCache.get(thumbUrl) || ''
    : blobCache.get(fullUrl) || blobCache.get(thumbUrl) || '';

  const [blobUrl, setBlobUrl] = useState<string>(initialCached);

  useEffect(() => {
    let active = true;
    const targetUrl = thumb ? thumbUrl : fullUrl;

    if (blobCache.has(targetUrl)) {
      setBlobUrl(blobCache.get(targetUrl)!);
      return;
    }

    fetch(targetUrl)
      .then((res) => {
        if (!res.ok) throw new Error('Error');
        return res.blob();
      })
      .then((blob) => {
        if (!active) return;
        const objectUrl = URL.createObjectURL(blob);
        blobCache.set(targetUrl, objectUrl);
        setBlobUrl(objectUrl);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [src, thumb, thumbUrl, fullUrl]);

  if (!blobUrl) {
    return (
      <div className={`animate-pulse bg-slate-200 flex items-center justify-center ${className || ''}`}>
        <span className="text-[10px] text-slate-400">Cargando...</span>
      </div>
    );
  }

  return <img src={blobUrl} alt={alt} className={className} />;
}

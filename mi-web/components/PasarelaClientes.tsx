'use client';

import { useEffect, useState } from 'react';

interface LogoItem {
  filename: string;
  nombre: string;
  url: string;
}

export function PasarelaClientes() {
  const [logos, setLogos] = useState<LogoItem[]>([]);
  const [cargado, setCargado] = useState(false);

  useEffect(() => {
    fetch('/api/logos-clientes', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.logos)) setLogos(data.logos);
      })
      .catch(() => {})
      .finally(() => setCargado(true));
  }, []);

  // Si no hay logos en public/logos, no se muestra la franja
  if (cargado && logos.length === 0) return null;

  // Con pocos logos se repiten más veces para que el bucle no deje huecos
  const repeticiones = logos.length > 0 && logos.length < 5 ? 4 : 2;
  const listaInfinita = Array.from({ length: repeticiones }, () => logos).flat();
  // Velocidad constante sin importar cuántos logos haya
  const duracion = Math.max(20, logos.length * 3);

  return (
    <div className="bg-white border-b border-slate-200 py-5 overflow-hidden relative select-none">
      <div className="w-full">
        <div className="min-h-[56px] overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div
            className="animacion-pasarela gap-14 items-center"
            style={{ animationDuration: `${duracion}s` }}
          >
            {listaInfinita.map((logo, idx) => (
              <div
                key={`${logo.filename}-${idx}`}
                title={logo.nombre}
                className="flex items-center justify-center px-2 py-1 group"
              >
                <img
                  src={logo.url}
                  alt={logo.nombre}
                  className="h-12 w-auto max-w-[175px] object-contain opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
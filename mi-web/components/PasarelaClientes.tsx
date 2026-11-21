'use client';

import { useEffect, useState } from 'react';
import { Building2, Factory, Warehouse, Anchor, Cpu, Shield } from 'lucide-react';

interface LogoItem {
  filename: string;
  nombre: string;
  url: string;
}

const RESPALDO_EMPRESAS = [
  { nombre: 'TERMOTASAJERO S.A.', icon: Factory },
  { nombre: 'ZONA FRANCA BARRANQUILLA', icon: Warehouse },
  { nombre: 'PUERTO DE BARRANQUILLA', icon: Anchor },
  { nombre: 'ACERÍAS DEL CARIBE', icon: Building2 },
  { nombre: 'QUÍMICOS DEL ATLÁNTICO', icon: Cpu },
  { nombre: 'LOGÍSTICA VÍA 40', icon: Shield },
];

export function PasarelaClientes() {
  const [logosReales, setLogosReales] = useState<LogoItem[]>([]);

  useEffect(() => {
    fetch('/api/logos-clientes', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.logos) && data.logos.length > 0) {
          setLogosReales(data.logos);
        }
      })
      .catch(() => {});
  }, []);

  const repeticiones = logosReales.length > 0 && logosReales.length < 5 ? 4 : 2;
  const listaLogosInfinita = Array.from({ length: repeticiones }, () => logosReales).flat();
  const listaRespaldoInfinita = [...RESPALDO_EMPRESAS, ...RESPALDO_EMPRESAS];

  return (
    <div className="bg-slate-100 border-b border-slate-200 py-5 overflow-hidden relative select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-6">
        <div className="hidden sm:flex items-center gap-2 shrink-0 pr-5 border-r border-slate-300">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-600">
            Confían en nosotros
          </span>
        </div>

        <div className="flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="animacion-pasarela gap-14 items-center">
            {logosReales.length > 0
              ? listaLogosInfinita.map((logo, idx) => (
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
                ))
              : listaRespaldoInfinita.map((empresa, idx) => {
                  const Icon = empresa.icon;
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 px-2 py-1 opacity-80 hover:opacity-100 transition-opacity"
                    >
                      <Icon className="w-5 h-5 text-red-600 shrink-0" />
                      <span className="text-xs font-extrabold tracking-wider text-slate-700 whitespace-nowrap">
                        {empresa.nombre}
                      </span>
                    </div>
                  );
                })}
          </div>
        </div>
      </div>
    </div>
  );
}

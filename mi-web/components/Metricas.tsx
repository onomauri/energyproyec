"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { FileCheck2, Zap, Container, Factory, type LucideIcon } from "lucide-react";

interface Metrica {
  icono: LucideIcon;
  valor: number;
  unidad?: string;
  /** Las palabras clave van dentro de <strong> para que resalten en negrita */
  titulo: ReactNode;
}

// ✏️ Cifras de la empresa: cambia aquí los valores o los textos
const metricas: Metrica[] = [
  {
    icono: FileCheck2,
    valor: 40,
    titulo: (
      <>
        <strong>Diseños aprobados</strong> ante operador de red
      </>
    ),
  },
  {
    icono: Zap,
    valor: 30,
    unidad: "MVA",
    titulo: (
      <>
        Potencia instalada en <strong>subestaciones</strong>
      </>
    ),
  },
  {
    icono: Container,
    valor: 50,
    titulo: (
      <>
        <strong>Transformadores instalados</strong> en media y baja tensión
      </>
    ),
  },
  {
    icono: Factory,
    valor: 20,
    titulo: (
      <>
        Instalaciones eléctricas en <strong>plantas industriales</strong>
      </>
    ),
  },
];

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Contador que va y vuelve:
 *  - activo = true  → sube hasta `objetivo` (rápido al inicio, frena al llegar)
 *  - activo = false → baja otra vez hacia 0
 * Siempre parte del número que se esté mostrando, así que si cambias de
 * dirección a mitad de camino no da saltos.
 */
function useContador(objetivo: number, activo: boolean, retraso: number) {
  const [valor, setValor] = useState(0);
  const actual = useRef(0);

  useEffect(() => {
    const destino = activo ? objetivo : 0;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      actual.current = destino;
      setValor(destino);
      return;
    }

    const desde = actual.current;
    if (desde === destino) return;

    // Dura según la distancia que falte por recorrer
    const recorrido = Math.abs(destino - desde) / objetivo;
    const duracion = Math.max(450, (activo ? 1900 : 1000) * recorrido);
    const ease = activo ? easeOutCubic : easeInOutCubic;

    let raf = 0;
    let inicio = 0;
    const paso = (ahora: number) => {
      if (!inicio) inicio = ahora;
      const t = Math.min((ahora - inicio) / duracion, 1);
      actual.current = desde + (destino - desde) * ease(t);
      setValor(Math.round(actual.current));
      if (t < 1) raf = requestAnimationFrame(paso);
    };

    // Un pequeño retraso escalonado entre una cifra y la siguiente (solo al subir)
    const espera = setTimeout(() => {
      raf = requestAnimationFrame(paso);
    }, activo ? retraso : 0);

    return () => {
      clearTimeout(espera);
      cancelAnimationFrame(raf);
    };
  }, [activo, objetivo, retraso]);

  return valor;
}

function Item({ m, activo, indice, ultimo }: { m: Metrica; activo: boolean; indice: number; ultimo: boolean }) {
  const retraso = indice * 140;
  const numero = useContador(m.valor, activo, retraso);
  const Icono = m.icono;

  return (
    <div
      style={{ transitionDelay: activo ? `${retraso}ms` : "0ms" }}
      className={`flex flex-col items-center text-center px-4 transition-all duration-700 ease-out motion-reduce:transition-none ${
        ultimo ? "" : "lg:border-r lg:border-white/20"
      } ${activo ? "opacity-100 translate-y-0" : "opacity-30 translate-y-6"}`}
    >
      {/* Círculo blanco que sobresale por encima de la franja (en pantallas grandes) */}
      <div
        style={{ transitionDelay: activo ? `${retraso}ms` : "0ms" }}
        className={`w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-white text-red-600 flex items-center justify-center shadow-xl ring-4 ring-white/30 lg:-mt-12 transition-transform duration-700 ease-out motion-reduce:transition-none ${
          activo ? "scale-100" : "scale-75"
        }`}
      >
        <Icono className="w-9 h-9 lg:w-11 lg:h-11" strokeWidth={1.75} />
      </div>

      <p className="mt-5 text-4xl lg:text-5xl font-extrabold tracking-tight tabular-nums">
        +{numero}
        {m.unidad && <span className="ml-1.5 text-2xl lg:text-3xl font-bold">{m.unidad}</span>}
      </p>
      <p className="mt-3 max-w-[15rem] text-[11px] sm:text-xs font-normal uppercase tracking-wider leading-relaxed text-white/85 [&_strong]:font-extrabold [&_strong]:text-white">
        {m.titulo}
      </p>
    </div>
  );
}

export default function Metricas() {
  const ref = useRef<HTMLElement>(null);
  const [activo, setActivo] = useState(false);

  // Se activa al entrar en pantalla y se desactiva al salir, en ambos sentidos del scroll:
  // al bajar suben los números; al subir bajan; al volver a bajar suben de nuevo.
  // Dos umbrales (35 % para entrar, 10 % para salir) evitan parpadeos en el borde.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.35) setActivo(true);
        else if (entry.intersectionRatio < 0.1) setActivo(false);
      },
      { threshold: [0, 0.1, 0.35] }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} aria-label="Cifras de la empresa" className="relative w-full bg-red-600 text-white">
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-12 lg:pt-0 lg:pb-14 grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12">
        {metricas.map((m, i) => (
          <Item key={i} m={m} activo={activo} indice={i} ultimo={i === metricas.length - 1} />
        ))}
      </div>
    </section>
  );
}
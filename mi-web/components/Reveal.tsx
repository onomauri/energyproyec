"use client";

import { useEffect, useRef, useState } from "react";

type Direccion = "up" | "down" | "left" | "right";

interface RevealProps {
  children: React.ReactNode;
  /** Desde dónde entra el elemento */
  from?: Direccion;
  /** Retraso en milisegundos (sirve para escalonar tarjetas) */
  delay?: number;
  className?: string;
}

// Estado inicial (antes de entrar a la pantalla)
const ocultoPor: Record<Direccion, string> = {
  up: "translate-y-12",
  down: "-translate-y-12",
  left: "translate-x-12",
  right: "-translate-x-12",
};

/**
 * Anima su contenido cuando la sección entra en pantalla al hacer scroll
 * (aparece con fundido + desplazamiento). Respeta "reducir movimiento".
 */
export default function Reveal({ children, from = "up", delay = 0, className = "" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
      className={`transition-all duration-1000 ease-out motion-reduce:transition-none motion-reduce:transform-none motion-reduce:opacity-100 ${
        visible ? "opacity-100 translate-x-0 translate-y-0" : `opacity-0 ${ocultoPor[from]}`
      } ${className}`}
    >
      {children}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { ModalCotizacion } from "@/app/ModalCotizacion";

// ⚠️ Datos de contacto: ajusta los que aún sean de ejemplo
const TELEFONO_MOSTRAR = "+57 (605) 300 0000"; // ← de ejemplo, reemplazar por el fijo real
const TELEFONO_LINK = "tel:+576053000000";
const WHATSAPP_MOSTRAR = "+57 300 606 0276";
const WHATSAPP_NUMERO = "573006060276"; // sin "+" ni espacios
const WHATSAPP_MENSAJE = "Hola Energy Proyec, quiero solicitar información sobre un proyecto eléctrico.";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(WHATSAPP_MENSAJE)}`;

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.04 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.9 6.99c0 5.45-4.44 9.88-9.9 9.88zm8.41-18.3A11.8 11.8 0 0 0 12.04 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.17-3.49-8.41z" />
    </svg>
  );
}

export default function Hero({ children }: { children?: React.ReactNode }) {
  // Entrada en dos tiempos (como en complemento): primero la foto se "enfoca",
  // después aparecen los textos y la tarjeta de contacto uno tras otro.
  const [listo, setListo] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setListo(true), 150);
    const t2 = setTimeout(() => setVisible(true), 750);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const entrada = (retraso: number) => ({
    style: { transitionDelay: visible ? `${retraso}ms` : "0ms" },
    className: `transition-all duration-700 ease-out motion-reduce:transition-none ${
      visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    }`,
  });

  return (
    <section
      id="inicio"
      className="relative min-h-svh flex flex-col overflow-hidden bg-[#0B192C] text-white"
    >
      {/* Imagen de fondo del hero (public/images/hero.jpeg) */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-[1400ms] ease-out motion-reduce:transition-none ${
          listo ? "scale-100 blur-0 brightness-110" : "scale-125 blur-[14px] brightness-50"
        }`}
        style={{ backgroundImage: "url('/images/hero.jpeg')" }}
      />
      {/* Capas para que el texto se lea sin oscurecer demasiado la foto */}
      <div className="absolute inset-0 bg-linear-to-r from-[#0B192C]/62 via-[#0B192C]/32 to-[#0B192C]/5 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-[#0B192C]/45 to-transparent pointer-events-none" />

      {/* Espacio que ocupa el nav (fijo), para que la franja de logos quede justo debajo */}
      <div aria-hidden="true" className="relative shrink-0 h-[125px] sm:h-[141px] lg:h-24" />

      {/* Franja de logos de clientes, sobre la foto del hero */}
      {children && <div className="relative shrink-0">{children}</div>}

      <div className="relative w-full max-w-7xl mx-auto px-6 py-14 lg:py-16 grow grid lg:grid-cols-12 gap-12 items-center content-center">
        <div className="lg:col-span-7 space-y-6">
          <h1
            {...entrada(0)}
            className={`${entrada(0).className} text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight [text-shadow:0_2px_16px_rgba(0,0,0,0.45)]`}
          >
            Que tu negocio
            <span className="block text-[#E83038]">NUNCA pare!</span>
          </h1>

          <p {...entrada(150)} className={`${entrada(150).className} text-white/95 text-lg leading-relaxed max-w-2xl [text-shadow:0_1px_10px_rgba(0,0,0,0.5)]`}>
            Ejecutamos proyectos y mantenimientos eléctricos con eficiencia y reacción inmediata ante emergencias.
          </p>

          <div {...entrada(300)} className={`${entrada(300).className} flex flex-wrap items-center gap-4 pt-2`}>
            <ModalCotizacion textoBoton="Solicitar Cotización Técnica" />
            <Link
              href="/clientes"
              className="bg-slate-900/70 hover:bg-slate-800 backdrop-blur-sm text-slate-100 font-semibold px-6 py-3 rounded-xl border border-slate-600 transition flex items-center gap-2 text-sm sm:text-base"
            >
              Seguimiento de Obra <ArrowRight className="w-4 h-4 text-red-500" />
            </Link>
          </div>

          {/* Indicadores rápidos */}
          <div
            {...entrada(450)}
            className={`${entrada(450).className} grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-8 pt-6 border-t border-white/15 max-w-2xl`}
          >
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold leading-tight">34.5 kV</p>
              <p className="text-xs text-slate-200">Capacidad Media Tensión</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold leading-tight">100%</p>
              <p className="text-xs text-slate-200">Normativa RETIE / NTC</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold leading-tight">24/7</p>
              <p className="text-xs text-slate-200">Soporte Industrial Caribe</p>
            </div>
          </div>
        </div>

        {/* Tarjeta lateral de contacto directo */}
        <div
          {...entrada(300)}
          className={`${entrada(300).className} lg:col-span-5 bg-slate-900/70 backdrop-blur-md border border-white/10 p-6 xl:p-10 rounded-3xl shadow-2xl space-y-7 xl:space-y-8`}
        >
          <a href={TELEFONO_LINK} className="flex items-center gap-4 xl:gap-5 group">
            <div className="bg-red-600/20 text-red-400 group-hover:bg-red-600 group-hover:text-white transition-colors p-3 xl:p-4 rounded-2xl shrink-0">
              <Phone className="w-7 h-7 xl:w-9 xl:h-9" />
            </div>
            <span className="text-xl sm:text-2xl xl:text-3xl font-extrabold tracking-tight whitespace-nowrap">
              {TELEFONO_MOSTRAR}
            </span>
          </a>

          <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 xl:gap-5 group">
            <div className="bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors p-3 xl:p-4 rounded-2xl shrink-0">
              <WhatsAppIcon className="w-7 h-7 xl:w-9 xl:h-9" />
            </div>
            <span className="text-xl sm:text-2xl xl:text-3xl font-extrabold tracking-tight whitespace-nowrap">
              {WHATSAPP_MOSTRAR}
            </span>
          </a>

          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-red-600/25 text-base active:scale-95 transform"
          >
            Enviar mensaje <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
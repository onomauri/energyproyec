"use client";

import { useActionState, useState } from "react";
import {
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Send,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Reveal from "./Reveal";
import { enviarCotizacion } from "@/app/cotizacion-actions";

// ⚠️ Datos de contacto: ajústalos si cambian
const TELEFONO = "+57 300 606 0276";
const EMAIL = "ingenieria@energyproyec.com";
const UBICACION = "Barranquilla, Región Caribe, Colombia";

const ventajas = [
  { titulo: "Trámites ágiles", desc: "Gestión ante Air-e, Afinia y operadores" },
  { titulo: "100% RETIE", desc: "Cumplimiento normativo garantizado" },
  { titulo: "Tiempos cortos", desc: "Aprobaciones en tiempo récord" },
  { titulo: "Llave en mano", desc: "Desde diseño hasta energización" },
];

const datos = [
  { icono: Phone, etiqueta: "Teléfono", valor: TELEFONO, href: "tel:+573006060276" },
  { icono: Mail, etiqueta: "Email", valor: EMAIL, href: `mailto:${EMAIL}` },
  { icono: MapPin, etiqueta: "Ubicación", valor: UBICACION, href: undefined as string | undefined },
];

const claseCampo =
  "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-[15px] text-[#0B192C] placeholder:text-slate-400 outline-none transition focus:bg-white focus:border-red-500 disabled:opacity-60 disabled:cursor-not-allowed";
const claseEtiqueta = "block text-[11px] font-extrabold tracking-wider text-slate-500 uppercase mb-2";

// Formulario aparte: al cambiar su `key` se reinicia el estado ("Enviar otra solicitud")
function Formulario({ onNuevaSolicitud }: { onNuevaSolicitud: () => void }) {
  // Se guarda en la misma base de datos que el modal "Solicitar Cotización" (panel /admin)
  const [state, formAction, enviando] = useActionState(enviarCotizacion, null);

  if (state?.ok) {
    return (
      <div className="text-center py-10 px-2">
        <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto mb-4" />
        <h4 className="text-2xl font-bold text-[#0B192C] mb-3">¡Solicitud enviada!</h4>
        <p className="text-slate-600 leading-relaxed mb-6">
          Hemos recibido tu información. Nuestro equipo te contactará en menos de 24 horas hábiles.
        </p>
        <button
          type="button"
          onClick={onNuevaSolicitud}
          className="text-sm font-semibold text-red-600 hover:text-red-700 underline underline-offset-4"
        >
          Enviar otra solicitud
        </button>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="c-nombre" className={claseEtiqueta}>Nombre completo</label>
        <input id="c-nombre" type="text" name="nombre" required disabled={enviando} placeholder="Ej: Carlos Martínez" className={claseCampo} />
      </div>

      <div>
        <label htmlFor="c-empresa" className={claseEtiqueta}>Empresa (opcional)</label>
        <input id="c-empresa" type="text" name="empresa" disabled={enviando} placeholder="Industrias S.A.S." className={claseCampo} />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="c-email" className={claseEtiqueta}>Email</label>
          <input id="c-email" type="email" name="email" required disabled={enviando} placeholder="correo@empresa.com" className={claseCampo} />
        </div>
        <div>
          <label htmlFor="c-telefono" className={claseEtiqueta}>Teléfono</label>
          <input id="c-telefono" type="tel" name="telefono" required disabled={enviando} placeholder="+57 300..." className={claseCampo} />
        </div>
      </div>

      <div>
        <label htmlFor="c-servicio" className={claseEtiqueta}>Servicio de interés</label>
        <select id="c-servicio" name="servicio" defaultValue="Subestaciones Eléctricas" disabled={enviando} className={claseCampo}>
          <option value="Subestaciones Eléctricas">Subestaciones Eléctricas (34.5 kV / 13.8 kV)</option>
          <option value="Redes de Media y Baja Tensión">Redes de Media y Baja Tensión</option>
          <option value="Diagnóstico y Termografía">Diagnóstico, Pruebas y Termografía</option>
          <option value="Mantenimiento Industrial / Emergencia">Mantenimiento Preventivo / Emergencia</option>
        </select>
      </div>

      <div>
        <label htmlFor="c-descripcion" className={claseEtiqueta}>Descripción del proyecto</label>
        <textarea
          id="c-descripcion"
          name="descripcion"
          rows={4}
          required
          disabled={enviando}
          placeholder="Cuéntanos sobre tu proyecto: ubicación, capacidad requerida, plazos..."
          className={claseCampo}
        />
      </div>

      {state?.error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={enviando}
        className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold text-base py-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-red-600/25 active:scale-[0.98]"
      >
        {enviando ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" /> Enviando...
          </>
        ) : (
          <>
            Enviar Solicitud <Send className="w-4 h-4" />
          </>
        )}
      </button>

      <p className="text-xs text-center text-slate-500">
        Al enviar, aceptas nuestra{" "}
        <a href="/terminos-y-condiciones" target="_blank" rel="noopener noreferrer" className="text-red-600 underline">
          política de tratamiento de datos personales
        </a>
      </p>
    </form>
  );
}

export default function Contacto() {
  const [intento, setIntento] = useState(0);

  return (
    <section id="contacto" className="relative overflow-hidden bg-slate-50 text-[#0B192C] py-20 md:py-24 px-6">
      <div className="relative max-w-7xl mx-auto grid lg:grid-cols-[1fr_500px] gap-12 lg:gap-16 items-start">
        <Reveal from="left">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.1] mb-6">
            Agiliza tus procesos <span className="text-red-600">regulatorios</span> en la Región Caribe
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-10">
            Nuestro equipo de ingenieros especializados gestiona todos los trámites ante operadores de red,
            garantizando aprobaciones rápidas y cumplimiento normativo total.
          </p>

          {/* Contactos: cuadro azul vibrante, grande y en el centro de la columna */}
          <div className="relative overflow-hidden rounded-2xl bg-[#3C4094] p-5 sm:p-6 mb-6">
            <p className="relative text-xs font-bold uppercase tracking-[0.2em] text-blue-100/80 mb-4">
              Contáctanos directamente
            </p>

            <div className="relative space-y-4">
              {datos.map(({ icono: Icono, etiqueta, valor, href }) => {
                const contenido = (
                  <>
                    <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full bg-white text-[#3C4094] flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
                      <Icono className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-xs sm:text-sm text-blue-100/80">{etiqueta}</span>
                      <strong className="block text-lg sm:text-xl font-extrabold text-white leading-snug break-words">
                        {valor}
                      </strong>
                    </div>
                  </>
                );
                return href ? (
                  <a key={etiqueta} href={href} className="flex items-center gap-4 group">
                    {contenido}
                  </a>
                ) : (
                  <div key={etiqueta} className="flex items-center gap-4 group">
                    {contenido}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ventajas: solo texto, una debajo de otra */}
          <div className="space-y-2.5">
            {ventajas.map(({ titulo, desc }) => (
              <p key={titulo} className="text-base leading-relaxed text-slate-600">
                <strong className="font-bold text-[#0B192C]">{titulo}</strong>
                <span className="mx-2 text-slate-400">–</span>
                {desc}
              </p>
            ))}
          </div>
        </Reveal>

        <Reveal from="right" delay={150}>
          <div className="bg-white text-[#0B192C] rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-[0_10px_40px_-12px_rgba(15,23,42,0.15)]">
            <h3 className="text-2xl sm:text-3xl font-bold text-center mb-2">Solicita tu cotización</h3>
            <p className="text-sm font-medium text-green-600 text-center mb-8">
              ✔ Respuesta en menos de 24 horas hábiles
            </p>
            <Formulario key={intento} onNuevaSolicitud={() => setIntento((n) => n + 1)} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
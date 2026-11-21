"use client";

import { useState, useEffect, useActionState } from "react";
import { createPortal } from "react-dom";
import { enviarCotizacion } from "./cotizacion-actions";
import { X, Send, CheckCircle2, AlertCircle } from "lucide-react";

export function ModalCotizacion({ textoBoton = "Solicitar Cotización" }: { textoBoton?: string }) {
  const [abierto, setAbierto] = useState(false);
  const [montado, setMontado] = useState(false);
  const [state, formAction, isPending] = useActionState(enviarCotizacion, null);

  useEffect(() => {
    setMontado(true);
  }, []);

  // Permitir cerrar con la tecla Escape y bloquear scroll de fondo cuando está abierto
  useEffect(() => {
    if (!abierto) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAbierto(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [abierto]);

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto(true)}
        className="bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 sm:px-5 sm:py-2.5 rounded-xl transition transform shadow-lg shadow-red-600/25 cursor-pointer"
      >
        {textoBoton}
      </button>

      {abierto &&
        montado &&
        createPortal(
          <div
            onMouseDown={() => setAbierto(false)}
            className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 text-slate-900 overflow-y-auto"
          >
            <div
              onMouseDown={(e) => e.stopPropagation()}
              className="animacion-modal bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto"
            >
              <div className="bg-[#0B192C] text-white px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">Solicitar Cotización Técnica</h3>
                  <p className="text-xs text-slate-400">Un ingeniero de ElectroCaribe te contactará pronto</p>
                </div>
                <button
                  type="button"
                  onClick={() => setAbierto(false)}
                  className="text-slate-400 hover:text-white p-1.5 rounded-lg transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                {state?.ok ? (
                  <div className="text-center py-6 space-y-4">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                    <h4 className="text-xl font-bold text-slate-900">¡Solicitud Recibida!</h4>
                    <p className="text-sm text-slate-600">
                      Hemos registrado tu requerimiento. Nuestro equipo comercial y de ingeniería se comunicará contigo a la brevedad.
                    </p>
                    <button
                      type="button"
                      onClick={() => setAbierto(false)}
                      className="bg-[#0B192C] text-white text-sm font-semibold px-6 py-2.5 rounded-lg cursor-pointer"
                    >
                      Cerrar
                    </button>
                  </div>
                ) : (
                  <form action={formAction} className="space-y-4 text-sm">
                    {state?.error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg flex items-center gap-2 text-xs">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{state.error}</span>
                      </div>
                    )}

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Nombre Completo *</label>
                        <input type="text" name="nombre" required placeholder="Carlos Mendoza" className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-red-600" />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Empresa (Opcional)</label>
                        <input type="text" name="empresa" placeholder="Industrias S.A.S." className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-red-600" />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Teléfono / WhatsApp *</label>
                        <input type="tel" name="telefono" required placeholder="+57 300 000 0000" className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-red-600" />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Correo Electrónico *</label>
                        <input type="email" name="email" required placeholder="correo@empresa.com" className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-red-600" />
                      </div>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Tipo de Servicio</label>
                      <select name="servicio" className="w-full border border-slate-300 bg-white rounded-lg px-3 py-2 outline-none focus:border-red-600">
                        <option value="Subestaciones Eléctricas">Subestaciones Eléctricas (34.5 kV / 13.8 kV)</option>
                        <option value="Redes de Media y Baja Tensión">Redes de Media y Baja Tensión</option>
                        <option value="Diagnóstico y Termografía">Diagnóstico, Pruebas y Termografía</option>
                        <option value="Mantenimiento Industrial / Emergencia">Mantenimiento Preventivo / Emergencia</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Descripción del Proyecto *</label>
                      <textarea name="descripcion" rows={3} required placeholder="Cuéntanos qué necesitas (capacidad en kVA, ubicación de la planta, alcance)..." className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-red-600" />
                    </div>

                    <button
                      type="submit"
                      disabled={isPending}
                      className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      {isPending ? "Enviando solicitud..." : "Enviar Solicitud de Cotización"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

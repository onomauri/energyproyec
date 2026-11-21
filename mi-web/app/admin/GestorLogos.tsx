"use client";

import { useState, useEffect, useRef } from "react";
import { subirLogoPasarela, eliminarLogoPasarela } from "./actions";
import { Upload, Trash2, Building2, CheckCircle2 } from "lucide-react";

interface LogoItem {
  filename: string;
  nombre: string;
  url: string;
}

export function GestorLogos() {
  const [logos, setLogos] = useState<LogoItem[]>([]);
  const [subiendo, setSubiendo] = useState(false);
  const [alerta, setAlerta] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const cargarLogos = async () => {
    try {
      const res = await fetch("/api/logos-clientes", { cache: "no-store" });
      const data = await res.json();
      setLogos(data.logos || []);
    } catch {
      // Ignorar error temporal
    }
  };

  useEffect(() => {
    cargarLogos();
  }, []);

  const mostrarAlerta = (msg: string) => {
    setAlerta(msg);
    setTimeout(() => setAlerta(null), 3500);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
        <div className="bg-slate-900 text-red-500 p-2 rounded-lg">
          <Building2 className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">Logos de Clientes (Inicio)</h3>
          <p className="text-[11px] text-slate-500">Aparecen en la pasarela principal</p>
        </div>
      </div>

      {alerta && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-2 rounded-xl text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{alerta}</span>
        </div>
      )}

      <form
        ref={formRef}
        action={async (fd) => {
          setSubiendo(true);
          try {
            await subirLogoPasarela(fd);
            formRef.current?.reset();
            await cargarLogos();
            mostrarAlerta("Logo añadido a la pasarela");
          } finally {
            setSubiendo(false);
          }
        }}
        className="space-y-3"
      >
        <input
          type="file"
          name="logo"
          required
          accept="image/png,image/jpeg,image/svg+xml,image/webp"
          className="w-full text-xs text-slate-600 file:mr-2.5 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-slate-800 file:text-white file:font-semibold hover:file:bg-slate-700 cursor-pointer"
        />
        <button
          type="submit"
          disabled={subiendo}
          className="w-full bg-[#0B192C] hover:bg-red-600 disabled:opacity-50 text-white text-xs font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5" />
          {subiendo ? "Subiendo logo..." : "Subir Logo a Pasarela"}
        </button>
      </form>

      {logos.length > 0 && (
        <div className="pt-3 border-t border-slate-100 space-y-2 max-h-60 overflow-y-auto">
          <p className="text-[11px] font-semibold text-slate-400 uppercase">
            Logos activos ({logos.length})
          </p>
          {logos.map((logo) => (
            <div
              key={logo.filename}
              className="flex items-center justify-between gap-2 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200"
            >
              <img
                src={logo.url}
                alt={logo.nombre}
                className="h-7 w-auto max-w-[110px] object-contain"
              />
              <button
                type="button"
                onClick={async () => {
                  if (!confirm("¿Eliminar este logo de la pasarela?")) return;
                  await eliminarLogoPasarela(logo.filename);
                  await cargarLogos();
                  mostrarAlerta("Logo eliminado");
                }}
                className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg transition cursor-pointer"
                title="Eliminar logo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

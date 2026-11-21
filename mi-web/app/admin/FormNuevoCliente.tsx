"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { crearClienteConProyecto } from "./actions";
import { UserPlus, CheckCircle2, Sparkles } from "lucide-react";

export interface DatosPrecargadosCliente {
  nombre: string;
  email: string;
  titulo: string;
  alcance: string;
}

export function FormNuevoCliente({
  precarga,
  onLimpiarPrecarga,
}: {
  precarga?: DatosPrecargadosCliente | null;
  onLimpiarPrecarga?: () => void;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [creando, setCreando] = useState(false);
  const [exito, setExito] = useState(false);

  return (
    <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <UserPlus className="w-5 h-5 text-red-600" />
          <h2 className="font-bold text-lg">Registrar Nuevo Cliente</h2>
        </div>
        {precarga && onLimpiarPrecarga && (
          <button
            type="button"
            onClick={onLimpiarPrecarga}
            className="text-[11px] text-slate-500 hover:text-red-600 underline cursor-pointer"
          >
            Limpiar
          </button>
        )}
      </div>

      {precarga && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Datos importados de cotización. Asigna una contraseña y crea el proyecto.</span>
        </div>
      )}

      {exito && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Cliente y carpeta de Google Drive creados con éxito</span>
        </div>
      )}

      <form
        key={precarga ? `${precarga.email}-${precarga.nombre}` : "form-vacio"}
        ref={formRef}
        action={async (fd) => {
          setCreando(true);
          try {
            await crearClienteConProyecto(fd);
            formRef.current?.reset();
            if (onLimpiarPrecarga) onLimpiarPrecarga();
            router.refresh();
            setExito(true);
            setTimeout(() => setExito(false), 4500);
          } finally {
            setCreando(false);
          }
        }}
        className="space-y-4 text-sm"
      >
        <div>
          <label className="font-medium text-slate-700 block mb-1">Empresa / Cliente</label>
          <input
            type="text"
            name="nombre"
            required
            defaultValue={precarga?.nombre || ""}
            placeholder="Ej: Acerías del Norte S.A."
            className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-red-600"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-medium text-slate-700 block mb-1">Correo Acceso</label>
            <input
              type="email"
              name="email"
              required
              defaultValue={precarga?.email || ""}
              placeholder="contacto@empresa.com"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-red-600"
            />
          </div>
          <div>
            <label className="font-medium text-slate-700 block mb-1">Contraseña</label>
            <input
              type="text"
              name="password"
              required
              placeholder="Clave123*"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-red-600"
            />
          </div>
        </div>

        <hr className="border-slate-100" />

        <div>
          <label className="font-medium text-slate-700 block mb-1">Nombre del Proyecto</label>
          <input
            type="text"
            name="titulo"
            required
            defaultValue={precarga?.titulo || ""}
            placeholder="Ej: Montaje Subestación 13.8 kV"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-red-600"
          />
        </div>

        <div>
          <label className="font-medium text-slate-700 block mb-1">Ubicación</label>
          <input
            type="text"
            name="ubicacion"
            defaultValue="Barranquilla, Atlántico"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-red-600"
          />
        </div>

        <div>
          <label className="font-medium text-slate-700 block mb-1">Alcance Técnico</label>
          <textarea
            name="alcance"
            rows={2}
            defaultValue={precarga?.alcance || ""}
            placeholder="Descripción breve de la obra..."
            className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-red-600"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-medium text-slate-700 block mb-1">Fecha Inicio</label>
            <input type="date" name="fechaInicio" className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-red-600" />
          </div>
          <div>
            <label className="font-medium text-slate-700 block mb-1">Entrega Estimada</label>
            <input type="date" name="fechaEstimadaFin" className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-red-600" />
          </div>
        </div>

        <button
          type="submit"
          disabled={creando}
          className="w-full bg-[#0B192C] hover:bg-slate-800 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition cursor-pointer"
        >
          {creando ? "Creando cliente y carpeta Drive..." : "Crear Cliente y Proyecto"}
        </button>
      </form>
    </section>
  );
}

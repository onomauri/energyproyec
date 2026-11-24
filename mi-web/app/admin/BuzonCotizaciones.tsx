"use client";

import { useState, useEffect } from "react";
import { actualizarEstadoCotizacion, eliminarCotizacion } from "./actions";
import { DatosPrecargadosCliente } from "./FormNuevoCliente";
import {
  Mail,
  Phone,
  Building2,
  Trash2,
  UserPlus,
  MessageCircle,
  Inbox,
  ArrowUpDown,
} from "lucide-react";

export interface CotizacionItem {
  id: number;
  nombre: string;
  empresa: string | null;
  telefono: string;
  email: string;
  servicio: string;
  descripcion: string;
  estado: string;
  creadoEn: string;
}

function obtenerPrioridad(servicio: string, descripcion: string) {
  const texto = `${servicio} ${descripcion}`.toLowerCase();
  if (texto.includes("emergencia") || texto.includes("falla") || texto.includes("apag") || texto.includes("corto") || texto.includes("urgente")) {
    return { key: "critica" as const, etiqueta: "Urgencia Crítica", score: 3, dot: "bg-red-600", pill: "bg-red-50 text-red-700 border-red-200" };
  }
  if (texto.includes("subestacion") || texto.includes("34.5") || texto.includes("13.8") || texto.includes("media y baja")) {
    return { key: "alta" as const, etiqueta: "Alta Prioridad", score: 2, dot: "bg-amber-500", pill: "bg-amber-50 text-amber-800 border-amber-200" };
  }
  return { key: "programada" as const, etiqueta: "Programada", score: 1, dot: "bg-slate-400", pill: "bg-slate-100 text-slate-700 border-slate-200" };
}
export function BuzonCotizaciones({
  cotizaciones,
  onConvertirACliente,
}: {
  cotizaciones: CotizacionItem[];
  onConvertirACliente: (datos: DatosPrecargadosCliente) => void;
}) {
  const [listaLocal, setListaLocal] = useState<CotizacionItem[]>(cotizaciones);
  const [filtroEstado, setFiltroEstado] = useState<string>("Todas");
  const [filtroPrioridad, setFiltroPrioridad] = useState<"todas" | "critica" | "alta" | "programada">("todas");
  const [ordenDescendente, setOrdenDescendente] = useState<boolean>(true);

  useEffect(() => { setListaLocal(cotizaciones); }, [cotizaciones]);

  const handleCambioEstado = async (id: number, nuevoEstado: string) => {
    setListaLocal((prev) => prev.map((item) => (item.id === id ? { ...item, estado: nuevoEstado } : item)));
    await actualizarEstadoCotizacion(id, nuevoEstado);
  };

  const handleEliminar = async (id: number, nombre: string) => {
    if (!confirm(`¿Eliminar la solicitud de ${nombre}?`)) return;
    setListaLocal((prev) => prev.filter((item) => item.id !== id));
    await eliminarCotizacion(id);
  };

  const conteo = listaLocal.reduce(
    (acc, c) => {
      acc[obtenerPrioridad(c.servicio, c.descripcion).key]++;
      return acc;
    },
    { critica: 0, alta: 0, programada: 0 }
  );

  const total = Math.max(1, listaLocal.length);

  const filtradas = listaLocal
    .filter((c) => {
      const pasaEstado = filtroEstado === "Todas" || c.estado === filtroEstado;
      const p = obtenerPrioridad(c.servicio, c.descripcion);
      const pasaPrioridad = filtroPrioridad === "todas" || p.key === filtroPrioridad;
      return pasaEstado && pasaPrioridad;
    })
    .sort((a, b) => {
      const scoreA = obtenerPrioridad(a.servicio, a.descripcion).score;
      const scoreB = obtenerPrioridad(b.servicio, b.descripcion).score;
      return ordenDescendente ? scoreB - scoreA : scoreA - scoreB;
    });
  return (
    <div className="space-y-4">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px] mr-1">Prioridad:</span>
            {[
              { id: "todas", label: "Todas", count: listaLocal.length, dot: "bg-slate-800" },
              { id: "critica", label: "Crítica", count: conteo.critica, dot: "bg-red-600" },
              { id: "alta", label: "Alta", count: conteo.alta, dot: "bg-amber-500" },
              { id: "programada", label: "Programada", count: conteo.programada, dot: "bg-slate-400" },
            ].map((item) => {
              const activo = filtroPrioridad === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFiltroPrioridad(item.id as typeof filtroPrioridad)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold border transition cursor-pointer tabular-nums ${
                    activo ? "bg-slate-900 text-white border-slate-900" : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${activo && item.id === "todas" ? "bg-white" : item.dot}`} />
                  <span>{item.label} ({item.count})</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setOrdenDescendente(!ordenDescendente)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg transition cursor-pointer"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            {ordenDescendente ? "Mayor urgencia" : "Menor urgencia"}
          </button>
        </div>

        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex gap-0.5">
          <div style={{ width: `${(conteo.critica / total) * 100}%` }} className="bg-red-600 transition-all duration-500" />
          <div style={{ width: `${(conteo.alta / total) * 100}%` }} className="bg-amber-500 transition-all duration-500" />
          <div style={{ width: `${(conteo.programada / total) * 100}%` }} className="bg-slate-400 transition-all duration-500" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100">
          <div className="flex flex-wrap gap-1 text-xs font-medium">
            {["Todas", "Pendiente", "Contactado", "Cotizado", "Descartado"].map((est) => (
              <button
                key={est}
                type="button"
                onClick={() => setFiltroEstado(est)}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  filtroEstado === est ? "bg-red-600 text-white font-semibold" : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                {est}
              </button>
            ))}
          </div>
          <span className="text-xs text-slate-400 tabular-nums">Mostrando {filtradas.length} de {listaLocal.length}</span>
        </div>
      </div>
      {filtradas.length === 0 ? (
        <div className="bg-white p-14 rounded-2xl border border-slate-200/90 text-center space-y-2">
          <Inbox className="w-7 h-7 text-slate-300 mx-auto" />
          <p className="text-sm font-medium text-slate-600">No hay solicitudes con esos filtros</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-200/80 bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          {filtradas.map((cot) => {
            const prioridad = obtenerPrioridad(cot.servicio, cot.descripcion);
            const telLimpio = cot.telefono.replace(/\D/g, "");
            const whatsappUrl = "https://" + "wa.me/" + `${telLimpio.startsWith("57") ? telLimpio : `57${telLimpio}`}?text=${encodeURIComponent(`Hola ${cot.nombre}, te saludamos de EnergyProyec respecto a ${cot.servicio}.`)}`;

            return (
              <div key={cot.id} className="p-5 hover:bg-slate-50/70 transition space-y-3">
                <div className="flex flex-wrap justify-between items-start gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {cot.nombre.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">{cot.nombre}</h3>
                        {cot.empresa && (
                          <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                            <Building2 className="w-3.5 h-3.5 text-slate-400" /> {cot.empresa}
                          </span>
                        )}
                        <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-md border ${prioridad.pill}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${prioridad.dot}`} />
                          {prioridad.etiqueta}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-red-600">{cot.servicio}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={cot.estado}
                      onChange={(e) => handleCambioEstado(cot.id, e.target.value)}
                      className="text-xs border border-slate-200 bg-white rounded-lg px-2.5 py-1.5 font-semibold text-slate-700 cursor-pointer"
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="Contactado">Contactado</option>
                      <option value="Cotizado">Cotizado</option>
                      <option value="Descartado">Descartado</option>
                    </select>
                    <button type="button" onClick={() => handleEliminar(cot.id, cot.nombre)} className="text-slate-400 hover:text-red-600 p-1.5 cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed pl-13">{cot.descripcion}</p>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1 pl-13 text-xs">
                  <div className="flex flex-wrap items-center gap-4 text-slate-500">
                    <a href={`mailto:${cot.email}`} className="flex items-center gap-1.5 hover:text-slate-900">
                      <Mail className="w-3.5 h-3.5 text-slate-400" /> {cot.email}
                    </a>
                    <span className="flex items-center gap-1.5 tabular-nums">
                      <Phone className="w-3.5 h-3.5 text-slate-400" /> {cot.telefono}
                    </span>
                    <span className="text-slate-400">{cot.creadoEn}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold px-3 py-1.5 rounded-lg transition">
                      <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                    </a>
                    <button
                      type="button"
                      onClick={() => onConvertirACliente({ nombre: cot.empresa ? `${cot.empresa} (${cot.nombre})` : cot.nombre, email: cot.email, titulo: cot.servicio, alcance: cot.descripcion })}
                      className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-red-600 text-white font-semibold px-3 py-1.5 rounded-lg transition cursor-pointer"
                    >
                      <UserPlus className="w-3.5 h-3.5" /> Crear Proyecto
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

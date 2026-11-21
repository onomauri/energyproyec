"use client";

import { ProyectoData } from "./TabSecundarios";
import { SecureImage } from "@/components/SecureImage";
import {
  MapPin,
  Calendar,
  Flag,
  Layers,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Image as ImageIcon,
  Maximize2,
} from "lucide-react";

export function TabMisProyectos({
  proyecto,
  onCambiarTab,
  onAmpliarFoto,
}: {
  proyecto: ProyectoData;
  onCambiarTab: (tab: "documentos" | "reportes") => void;
  onAmpliarFoto: (f: { url: string; titulo: string | null }) => void;
}) {
  const ultimas3Fotos = proyecto.fotos.slice(0, 3);
  const ultimoDocumento = proyecto.documentos.length > 0 ? proyecto.documentos[0] : null;

  return (
    <>
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 text-xs font-semibold bg-amber-100 text-amber-800 rounded-full flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> {proyecto.estado}
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-red-600" /> {proyecto.ubicacion}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{proyecto.titulo}</h1>
          <p className="text-slate-600 text-sm max-w-3xl">{proyecto.alcance}</p>
        </div>

        <div className="space-y-2 pt-2">
          <div className="flex justify-between text-sm font-semibold">
            <span className="text-slate-700 flex items-center gap-2">
              Avance General de Obra
              <span className="inline-block w-2 h-2 rounded-full bg-red-600 animate-ping" />
            </span>
            <span className="text-red-600 text-base font-bold">{proyecto.porcentajeAvance}%</span>
          </div>
          <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden p-0.5 shadow-inner">
            <div
              className="relative h-full bg-gradient-to-r from-[#0B192C] via-red-700 to-red-500 rounded-full transition-all duration-700 overflow-hidden"
              style={{ width: `${proyecto.porcentajeAvance}%` }}
            >
              {/* Destello luminoso continuo */}
              <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/35 to-transparent animacion-brillo" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex items-center gap-3.5">
            <div className="p-2.5 bg-blue-100 text-blue-700 rounded-lg"><Calendar className="w-5 h-5" /></div>
            <div>
              <p className="text-xs text-slate-500">Fecha de Inicio</p>
              <p className="font-bold text-sm">{proyecto.fechaInicio}</p>
            </div>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex items-center gap-3.5">
            <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-lg"><Flag className="w-5 h-5" /></div>
            <div>
              <p className="text-xs text-slate-500">Entrega Estimada</p>
              <p className="font-bold text-sm">{proyecto.fechaEstimadaFin}</p>
            </div>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex items-center gap-3.5">
            <div className="p-2.5 bg-red-100 text-red-700 rounded-lg"><Layers className="w-5 h-5" /></div>
            <div>
              <p className="text-xs text-slate-500">Fases Completadas</p>
              <p className="font-bold text-sm">{proyecto.fasesCompletadas} de {proyecto.totalFases} etapas</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h2 className="text-base font-bold text-slate-900">Último Documento</h2>
              <button onClick={() => onCambiarTab("documentos")} className="text-xs text-red-600 font-semibold hover:underline">
                Ver todos ({proyecto.documentos.length})
              </button>
            </div>
            {!ultimoDocumento ? (
              <p className="text-sm text-slate-400">No hay documentos cargados aún.</p>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-red-100 text-red-600 rounded-lg"><FileText className="w-6 h-6" /></div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-slate-800 truncate">{ultimoDocumento.nombre}</p>
                    <p className="text-xs text-slate-400">{ultimoDocumento.creadoEn}</p>
                  </div>
                </div>
                <a href={ultimoDocumento.url} download={ultimoDocumento.nombre} target="_blank" rel="noopener noreferrer" className="w-full bg-[#0B192C] hover:bg-red-600 text-white text-xs font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition">
                  <Download className="w-4 h-4" /> Descargar Documento
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-red-600" /> Últimas Evidencias Fotográficas
            </h2>
            <button onClick={() => onCambiarTab("reportes")} className="text-xs text-red-600 font-semibold hover:underline">
              Ver todas ({proyecto.fotos.length})
            </button>
          </div>
          {ultimas3Fotos.length === 0 ? (
            <p className="text-sm text-slate-400">Aún no se han cargado fotografías de obra.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {ultimas3Fotos.map((foto) => (
                <div key={foto.id} onClick={() => onAmpliarFoto(foto)} className="group relative cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                  <SecureImage src={foto.url} alt={foto.titulo || "Evidencia"} thumb className="w-full h-36 object-cover group-hover:scale-105 transition duration-300" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <span className="bg-white/90 text-slate-900 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1">
                      <Maximize2 className="w-3.5 h-3.5" /> Ampliar
                    </span>
                  </div>
                  {foto.titulo && <p className="p-2 text-xs font-medium text-slate-700 truncate bg-white">{foto.titulo}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Bitácora de Avances e Ingeniería</h2>
        <div className="space-y-4">
          {proyecto.actualizaciones.map((act) => (
            <div key={act.id} className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-800">{act.titulo}</p>
                <span className="text-xs text-slate-400">{act.fecha}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

"use client";

import { FileText, Download, Maximize2, PhoneCall, Mail } from "lucide-react";

export type ProyectoData = {
  id: number;
  titulo: string;
  estado: string;
  ubicacion: string;
  alcance: string;
  porcentajeAvance: number;
  fasesCompletadas: number;
  totalFases: number;
  fechaInicio: string;
  fechaEstimadaFin: string;
  actualizaciones: { id: number; titulo: string; fecha: string }[];
  fotos: { id: number; url: string; titulo: string | null }[];
  documentos: { id: number; url: string; nombre: string; creadoEn: string }[];
};

export function TabDocumentos({ documentos }: { documentos: ProyectoData["documentos"] }) {
  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Documentos y Planos Técnicos</h1>
        <p className="text-sm text-slate-500">Descarga informes, protocolos de prueba y planos del proyecto.</p>
      </div>
      {documentos.length === 0 ? (
        <p className="text-sm text-slate-400">No hay documentos cargados en este proyecto.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {documentos.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-red-500 transition">
              <div className="flex items-center gap-3 overflow-hidden">
                <FileText className="w-6 h-6 text-red-600 shrink-0" />
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-slate-800 truncate">{doc.nombre}</p>
                  <p className="text-xs text-slate-400">{doc.creadoEn}</p>
                </div>
              </div>
              <a href={doc.url} download={doc.nombre} target="_blank" rel="noopener noreferrer" className="bg-slate-900 hover:bg-red-600 text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 shrink-0 transition">
                <Download className="w-3.5 h-3.5" /> Descargar
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function TabReportes({
  fotos,
  onAmpliar,
}: {
  fotos: ProyectoData["fotos"];
  onAmpliar: (f: { url: string; titulo: string | null }) => void;
}) {
  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
      <h1 className="text-2xl font-bold text-slate-900">Registro Fotográfico Completo</h1>
      {fotos.length === 0 ? (
        <p className="text-sm text-slate-400">No hay fotografías registradas.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {fotos.map((foto) => (
            <div key={foto.id} onClick={() => onAmpliar(foto)} className="group relative cursor-pointer overflow-hidden rounded-xl border border-slate-200">
              <img src={foto.url} alt={foto.titulo || "Foto"} className="w-full h-48 object-cover group-hover:scale-105 transition" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <span className="bg-white text-slate-900 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1">
                  <Maximize2 className="w-3.5 h-3.5" /> Ampliar Foto
                </span>
              </div>
              {foto.titulo && <p className="p-3 text-xs font-medium text-slate-700 bg-white">{foto.titulo}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function TabSoporte() {
  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Soporte Técnico e Ingeniería 24/7</h1>
        <p className="text-sm text-slate-500 mt-1">Atención prioritaria para emergencias eléctricas y consultas de obra.</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center"><PhoneCall className="w-5 h-5" /></div>
          <h3 className="font-bold text-base">Línea Directa de Emergencias</h3>
          <p className="text-sm text-slate-600">Disponible 24 horas en Barranquilla y toda la Región Caribe.</p>
          <p className="text-lg font-bold text-[#0B192C]">+57 (605) 300 0000</p>
        </div>
        <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center"><Mail className="w-5 h-5" /></div>
          <h3 className="font-bold text-base">Mesa de Ingeniería y Proyectos</h3>
          <p className="text-sm text-slate-600">Envío de solicitudes técnicas, planos o mantenimientos.</p>
          <p className="text-sm font-bold text-[#0B192C]">ingenieria@energyproyec.com</p>
        </div>
      </div>
    </div>
  );
}

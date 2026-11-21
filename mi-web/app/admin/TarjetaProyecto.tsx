"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  editarDatosProyecto,
  actualizarAvanceProyecto,
  cambiarPasswordCliente,
  publicarNovedad,
  subirArchivoProyecto,
  eliminarFotoProyecto,
  eliminarDocumentoProyecto,
  eliminarFotoDrive,
  eliminarNovedad,
  eliminarCliente,
} from "./actions";
import {
  Sliders,
  MessageSquarePlus,
  CheckCircle2,
  Pencil,
  KeyRound,
  Upload,
  FileText,
  Image as ImageIcon,
  Trash2,
  UserX,
  ChevronDown,
} from "lucide-react";

export type ProyectoItem = {
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
  actualizaciones: { id: number; titulo: string }[];
  fotos: { id: number; url: string; titulo: string | null }[];
  documentos: { id: number; url: string; nombre: string }[];
};

export type ClienteItem = {
  id: number;
  nombre: string;
  email: string;
  ultimaConexion?: string | null;
  fotosDrive?: { id: string; nombre: string; fecha: string }[];
  proyectos: ProyectoItem[];
};

export function TarjetaProyecto({ cliente, serverNow }: { cliente: ClienteItem; serverNow?: number }) {
  const router = useRouter();
  const formArchivoRef = useRef<HTMLFormElement>(null);
  const [abierto, setAbierto] = useState(false);
  const [editando, setEditando] = useState(false);
  const [verArchivos, setVerArchivos] = useState(false);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [subiendo, setSubiendo] = useState(false);

  const proyecto = cliente.proyectos.at(0);
  const fotosDrive = cliente.fotosDrive || [];
  if (!proyecto) return null;

  const calcularEstadoConexion = () => {
    if (!cliente.ultimaConexion) {
      return { enLinea: false, texto: "Sin conexiones" };
    }
    const diffSegundos = ((serverNow ?? Date.now()) - new Date(cliente.ultimaConexion).getTime()) / 1000;
    if (diffSegundos <= 25) {
      return { enLinea: true, texto: "En línea ahora" };
    }
    const fechaFormateada = new Date(cliente.ultimaConexion).toLocaleString("es-CO", {
      timeZone: "America/Bogota",
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
    return { enLinea: false, texto: `Últ. vez: ${fechaFormateada}` };
  };
  const estadoConexion = calcularEstadoConexion();

  const mostrarAlerta = (texto: string) => {
    setMensajeExito(texto);
    setTimeout(() => setMensajeExito(null), 4000);
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      {mensajeExito && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs font-semibold shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{mensajeExito}</span>
        </div>
      )}

      {/* Cabecera comprimida clickeable */}
      <div
        onClick={() => setAbierto(!abierto)}
        className="flex flex-wrap justify-between items-center gap-3 cursor-pointer select-none group"
      >
        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-red-600 uppercase">{cliente.nombre}</span>
            <span className="text-xs text-slate-400">• {cliente.email}</span>
            {estadoConexion.enLinea ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                {estadoConexion.texto}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-500">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                {estadoConexion.texto}
              </span>
            )}
          </div>
          <h3 className="text-base font-bold text-slate-900 truncate group-hover:text-red-600 transition">
            {proyecto.titulo}
          </h3>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right hidden sm:block">
            <span className="text-xs font-bold text-slate-800 block">{proyecto.porcentajeAvance}% avance</span>
            <span className="text-[11px] text-slate-400">{proyecto.estado}</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-100 group-hover:bg-red-50 group-hover:text-red-600 transition">
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${abierto ? "rotate-180" : ""}`} />
          </div>
        </div>
      </div>
      {abierto && (
        <div className="pt-4 border-t border-slate-100 space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200/70">
            <span className="text-xs text-slate-500">📍 {proyecto.ubicacion}</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setEditando(!editando)}
                className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5" />
                {editando ? "Cerrar Edición" : "Editar Proyecto y Clave"}
              </button>

              <button
                type="button"
                onClick={async () => {
                  if (!confirm(`¿Seguro que deseas eliminar al cliente "${cliente.nombre}" y todo su proyecto?`)) return;
                  await eliminarCliente(cliente.id);
                  router.refresh();
                }}
                className="px-3 py-1.5 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
              >
                <UserX className="w-3.5 h-3.5" />
                Eliminar Cliente
              </button>
            </div>
          </div>

          {editando && (
            <div className="bg-amber-50/70 border border-amber-200 p-5 rounded-xl space-y-5 text-sm">
              <form
                action={async (fd) => {
                  await editarDatosProyecto(fd);
                  setEditando(false);
                  router.refresh();
                  mostrarAlerta("Datos del proyecto actualizados correctamente");
                }}
                className="space-y-3"
              >
                <p className="font-bold text-slate-800 text-xs uppercase">Editar Datos del Proyecto</p>
                <input type="hidden" name="proyectoId" value={proyecto.id} />
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">Título</label>
                    <input type="text" name="titulo" defaultValue={proyecto.titulo} required className="w-full border border-slate-300 bg-white rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">Ubicación</label>
                    <input type="text" name="ubicacion" defaultValue={proyecto.ubicacion} className="w-full border border-slate-300 bg-white rounded-lg px-3 py-2" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Alcance</label>
                  <textarea name="alcance" rows={2} defaultValue={proyecto.alcance} className="w-full border border-slate-300 bg-white rounded-lg px-3 py-2" />
                </div>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">Inicio</label>
                    <input type="date" name="fechaInicio" defaultValue={proyecto.fechaInicio} className="w-full border border-slate-300 bg-white rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">Entrega</label>
                    <input type="date" name="fechaEstimadaFin" defaultValue={proyecto.fechaEstimadaFin} className="w-full border border-slate-300 bg-white rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">Total Fases</label>
                    <input type="number" name="totalFases" min={1} defaultValue={proyecto.totalFases} className="w-full border border-slate-300 bg-white rounded-lg px-3 py-2" />
                  </div>
                </div>
                <button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-4 py-2 rounded-lg text-xs transition">
                  Guardar Datos
                </button>
              </form>

              <form
                action={async (fd) => {
                  await cambiarPasswordCliente(fd);
                  mostrarAlerta("Contraseña del cliente actualizada");
                }}
                className="flex flex-wrap items-end gap-3 pt-3 border-t border-amber-200"
              >
                <input type="hidden" name="clienteId" value={cliente.id} />
                <div className="flex-1 min-w-[200px]">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1 mb-1">
                    <KeyRound className="w-3.5 h-3.5 text-red-600" /> Nueva Contraseña para {cliente.email}
                  </label>
                  <input type="text" name="nuevaPassword" required minLength={4} placeholder="Nueva clave..." className="w-full border border-slate-300 bg-white rounded-lg px-3 py-2" />
                </div>
                <button type="submit" className="bg-slate-800 hover:bg-slate-900 text-white font-semibold px-4 py-2 rounded-lg text-xs transition">
                  Cambiar Clave
                </button>
              </form>
            </div>
          )}

          <form
            action={async (fd) => {
              await actualizarAvanceProyecto(fd);
              router.refresh();
              mostrarAlerta("Avance del proyecto guardado con éxito");
            }}
            className="grid sm:grid-cols-4 gap-3 items-end bg-slate-50 p-4 rounded-xl border border-slate-200/70 text-sm"
          >
            <input type="hidden" name="proyectoId" value={proyecto.id} />
            <div>
              <label className="text-xs font-semibold text-slate-600 flex items-center gap-1 mb-1">
                <Sliders className="w-3.5 h-3.5" /> Avance (%)
              </label>
              <input type="number" name="porcentajeAvance" min={0} max={100} defaultValue={proyecto.porcentajeAvance} className="w-full border border-slate-300 bg-white rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Fases (de {proyecto.totalFases})</label>
              <input type="number" name="fasesCompletadas" min={0} max={proyecto.totalFases} defaultValue={proyecto.fasesCompletadas} className="w-full border border-slate-300 bg-white rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Estado</label>
              <select name="estado" defaultValue={proyecto.estado} className="w-full border border-slate-300 bg-white rounded-lg px-3 py-2">
                <option value="En ejecución">En ejecución</option>
                <option value="En pruebas">En pruebas</option>
                <option value="Finalizado">Finalizado</option>
              </select>
            </div>
            <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition cursor-pointer">
              Guardar Avance
            </button>
          </form>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70 space-y-3 text-sm">
            <form
              ref={formArchivoRef}
              action={async (fd) => {
                setSubiendo(true);
                try {
                  await subirArchivoProyecto(fd);
                  formArchivoRef.current?.reset();
                  router.refresh();
                  mostrarAlerta("Archivo subido con éxito");
                } finally {
                  setSubiendo(false);
                }
              }}
              className="space-y-3"
            >
              <p className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-red-600" /> Adjuntar Foto o Documento
              </p>
              <input type="hidden" name="proyectoId" value={proyecto.id} />
              <div className="grid sm:grid-cols-3 gap-3">
                <select name="tipo" className="border border-slate-300 bg-white rounded-lg px-3 py-2 text-xs">
                  <option value="foto">Fotografía (JPG/PNG)</option>
                  <option value="documento">Documento / PDF</option>
                </select>
                <input type="text" name="etiqueta" placeholder="Título del archivo..." className="border border-slate-300 bg-white rounded-lg px-3 py-2 text-xs" />
                <input type="file" name="archivo" required accept="image/*,.pdf,.doc,.docx,.xls,.xlsx" className="text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-slate-800 file:text-white" />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><ImageIcon className="w-3.5 h-3.5" /> {proyecto.fotos.length + fotosDrive.length} fotos</span>
                  <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> {proyecto.documentos.length} docs</span>
                  {(proyecto.fotos.length > 0 || fotosDrive.length > 0 || proyecto.documentos.length > 0) && (
                    <button
                      type="button"
                      onClick={() => setVerArchivos(!verArchivos)}
                      className="text-red-600 font-semibold hover:underline cursor-pointer"
                    >
                      {verArchivos ? "Ocultar lista" : "Gestionar / Eliminar"}
                    </button>
                  )}
                </div>
                <button type="submit" disabled={subiendo} className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold px-4 py-1.5 rounded-lg text-xs transition cursor-pointer">
                  {subiendo ? "Subiendo..." : "Subir Archivo"}
                </button>
              </div>
            </form>

            {verArchivos && (
              <div className="pt-3 border-t border-slate-200 space-y-2">
                {fotosDrive.map((fd) => (
                  <div key={`drive-${fd.id}`} className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-slate-200 text-xs">
                    <span className="flex items-center gap-2 truncate text-slate-700">
                      <ImageIcon className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">[Drive • {fd.fecha}] {fd.nombre}</span>
                    </span>
                    <button
                      type="button"
                      onClick={async () => {
                        if (!confirm("¿Eliminar esta fotografía de Google Drive?")) return;
                        await eliminarFotoDrive(fd.id);
                        router.refresh();
                        mostrarAlerta("Fotografía eliminada de Google Drive");
                      }}
                      className="text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {proyecto.fotos.map((f) => (
                  <div key={`foto-${f.id}`} className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-slate-200 text-xs">
                    <span className="flex items-center gap-2 truncate text-slate-700">
                      <ImageIcon className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="truncate">{f.titulo || "Fotografía"}</span>
                    </span>
                    <button
                      type="button"
                      onClick={async () => {
                        if (!confirm("¿Eliminar esta fotografía?")) return;
                        await eliminarFotoProyecto(f.id);
                        router.refresh();
                        mostrarAlerta("Fotografía eliminada correctamente");
                      }}
                      className="text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {proyecto.documentos.map((d) => (
                  <div key={`doc-${d.id}`} className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-slate-200 text-xs">
                    <span className="flex items-center gap-2 truncate text-slate-700">
                      <FileText className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      <span className="truncate">{d.nombre}</span>
                    </span>
                    <button
                      type="button"
                      onClick={async () => {
                        if (!confirm("¿Eliminar este documento?")) return;
                        await eliminarDocumentoProyecto(d.id);
                        router.refresh();
                        mostrarAlerta("Documento eliminado correctamente");
                      }}
                      className="text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <form
            action={async (fd) => {
              await publicarNovedad(fd);
              router.refresh();
              mostrarAlerta("Novedad publicada en la bitácora");
            }}
            className="flex gap-3 text-sm"
          >
            <input type="hidden" name="proyectoId" value={proyecto.id} />
            <input type="text" name="titulo" required placeholder="Escribir novedad en bitácora..." className="flex-1 border border-slate-300 rounded-lg px-4 py-2 outline-none focus:border-red-600" />
            <button type="submit" className="bg-[#0B192C] hover:bg-slate-800 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2 shrink-0 transition cursor-pointer">
              <MessageSquarePlus className="w-4 h-4" /> Publicar
            </button>
          </form>

          <div className="space-y-2 pt-1">
            <p className="text-xs font-semibold text-slate-500 uppercase">Últimas novedades:</p>
            {proyecto.actualizaciones.map((act) => (
              <div key={act.id} className="flex items-center justify-between gap-2 text-xs text-slate-600 bg-slate-50/70 px-3 py-1.5 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{act.titulo}</span>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    if (!confirm("¿Eliminar esta novedad de la bitácora?")) return;
                    await eliminarNovedad(act.id);
                    router.refresh();
                    mostrarAlerta("Novedad eliminada");
                  }}
                  className="text-slate-400 hover:text-red-600 p-1 rounded transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

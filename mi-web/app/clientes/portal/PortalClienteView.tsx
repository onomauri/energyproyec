"use client";

import { useState } from "react";
import { logoutCliente } from "../actions";
import { ProyectoData, TabDocumentos, TabSoporte } from "./TabSecundarios";
import { TabMisProyectos } from "./TabMisProyectos";
import DriveGallery from "@/components/DriveGallery";
import { PortalLiveSync } from "@/components/PortalLiveSync";
import { IdleLogout } from "@/components/IdleLogout";
import { SecureImage } from "@/components/SecureImage";
import { FolderKanban, FileText, BarChart3, LifeBuoy, LogOut, X, Maximize2 } from "lucide-react";
import Isotipo from "@/components/Isotipo";

export function PortalClienteView({
  nombreCliente,
  emailCliente,
  proyecto,
}: {
  nombreCliente: string;
  emailCliente: string;
  proyecto: ProyectoData | null;
}) {
  const [pestana, setPestana] = useState<"proyectos" | "documentos" | "reportes" | "soporte">("proyectos");
  const [fotoAmpliada, setFotoAmpliada] = useState<{ url: string; titulo: string | null } | null>(null);

  // Filtramos las fotos subidas directamente por el admin (/api/fotos-locales/)
  const fotosAdmin = (proyecto?.fotos || []).filter((f) => f.url.startsWith("/api/fotos-locales/"));

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-900">
      <PortalLiveSync />
      <IdleLogout logoutAction={logoutCliente} />
      <form action={logoutCliente} className="fixed top-4 right-5 z-40">
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-full shadow-lg shadow-red-600/30 transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar Sesión</span>
        </button>
      </form>

      {fotoAmpliada && (
        <div
          onClick={() => setFotoAmpliada(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="animacion-modal relative max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl"
          >
            <button
              onClick={() => setFotoAmpliada(null)}
              className="absolute top-3 right-3 z-10 bg-black/70 hover:bg-red-600 text-white p-2 rounded-full transition duration-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <SecureImage src={fotoAmpliada.url}
              alt={fotoAmpliada.titulo || "Vista ampliada"}
              className="w-full max-h-[80vh] object-contain bg-black" />
            {fotoAmpliada.titulo && (
              <div className="p-4 text-white text-sm font-medium bg-slate-900 border-t border-slate-800">
                {fotoAmpliada.titulo}
              </div>
            )}
          </div>
        </div>
      )}
      <aside className="w-full md:w-64 bg-[#0B192C] text-white flex flex-col justify-between shrink-0 sticky top-0 z-30 md:h-screen">
        <div>
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <Isotipo className="h-12 w-auto" />
            <div>
              <span className="font-bold tracking-tight block leading-none">ENERGY<span className="text-red-500">PROYEC</span></span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Portal Clientes</span>
            </div>
          </div>

          <nav className="p-3 md:p-4 flex md:flex-col gap-1.5 overflow-x-auto text-sm">
            <button onClick={() => setPestana("proyectos")} className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium whitespace-nowrap transition ${pestana === "proyectos" ? "bg-red-600 text-white" : "text-slate-400 hover:bg-slate-800/60 hover:text-white"}`}>
              <FolderKanban className="w-4 h-4 shrink-0" /><span>Mis Proyectos</span>
            </button>
            <button onClick={() => setPestana("documentos")} className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium whitespace-nowrap transition ${pestana === "documentos" ? "bg-red-600 text-white" : "text-slate-400 hover:bg-slate-800/60 hover:text-white"}`}>
              <FileText className="w-4 h-4 shrink-0" /><span>Documentos y Planos</span>
            </button>
            <button onClick={() => setPestana("reportes")} className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium whitespace-nowrap transition ${pestana === "reportes" ? "bg-red-600 text-white" : "text-slate-400 hover:bg-slate-800/60 hover:text-white"}`}>
              <BarChart3 className="w-4 h-4 shrink-0" /><span>Registro Fotográfico</span>
            </button>
            <button onClick={() => setPestana("soporte")} className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium whitespace-nowrap transition ${pestana === "soporte" ? "bg-red-600 text-white" : "text-slate-400 hover:bg-slate-800/60 hover:text-white"}`}>
              <LifeBuoy className="w-4 h-4 shrink-0" /><span>Soporte 24/7</span>
            </button>
          </nav>
        </div>

        <div className="hidden md:block p-5 border-t border-slate-800">
          <p className="text-xs text-slate-400">Empresa conectada</p>
          <p className="text-sm font-semibold truncate">{nombreCliente}</p>
        </div>
      </aside>

      <main className="flex-1 p-6 pt-16 md:p-10 md:pt-16 max-w-6xl mx-auto w-full space-y-8">
        {pestana === "reportes" ? (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Registro Fotográfico de Obra</h2>
              <p className="text-sm text-slate-500">Evidencias cargadas por ingeniería y registros sincronizados por fecha.</p>
            </div>

            {fotosAdmin.length > 0 && (
              <div className="border rounded-xl p-5 bg-white shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="text-lg font-semibold text-gray-800">📸 Reportes Directos de Ingeniería</h3>
                  <span className="text-xs bg-red-50 text-red-700 px-2.5 py-1 rounded-full font-medium">
                    {fotosAdmin.length} {fotosAdmin.length === 1 ? "foto" : "fotos"}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {fotosAdmin.map((foto) => (
                    <div
                      key={foto.id}
                      onClick={() => setFotoAmpliada(foto)}
                      className="group relative aspect-square overflow-hidden rounded-lg border bg-gray-100 cursor-pointer"
                    >
                      <SecureImage thumb src={foto.url}
                        alt={foto.titulo || "Evidencia"}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <span className="bg-white text-slate-900 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1">
                          <Maximize2 className="w-3.5 h-3.5" /> Ampliar
                        </span>
                      </div>
                      {foto.titulo && (
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                          <p className="text-xs text-white truncate">{foto.titulo}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <DriveGallery key={proyecto?.fotos.length || 0} clientEmail={emailCliente} />
          </div>
        ) : pestana === "soporte" ? (
          <TabSoporte />
        ) : !proyecto ? (
          <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center">
            <h2 className="text-xl font-bold">Aún no tienes proyectos activos asignados</h2>
            <p className="text-slate-500 mt-2">Puedes revisar tus avances fotográficos en la pestaña "Registro Fotográfico".</p>
          </div>
        ) : (
          <>
            {pestana === "proyectos" && (
              <TabMisProyectos proyecto={proyecto} onCambiarTab={setPestana} onAmpliarFoto={setFotoAmpliada} />
            )}
            {pestana === "documentos" && <TabDocumentos documentos={proyecto.documentos} />}
          </>
        )}
      </main>
    </div>
  );
}
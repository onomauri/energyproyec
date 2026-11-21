"use client";

import { useState, useEffect } from "react";
import { FormNuevoCliente, DatosPrecargadosCliente } from "./FormNuevoCliente";
import { GestorLogos } from "./GestorLogos";
import { TarjetaProyecto, ClienteItem } from "./TarjetaProyecto";
import { BuzonCotizaciones, CotizacionItem } from "./BuzonCotizaciones";
import { logoutAdmin } from "./actions";
import { IdleLogout } from "@/components/IdleLogout";
import { Search, Plus, X } from "lucide-react";

export function AdminDashboard({
  clientes,
  cotizaciones = [],
}: {
  clientes: ClienteItem[];
  cotizaciones?: CotizacionItem[];
}) {
  const [pestana, setPestana] = useState<"clientes" | "cotizaciones" | "logos">("clientes");
  const [modalNuevoAbierto, setModalNuevoAbierto] = useState(false);
  const [datosPrecargados, setDatosPrecargados] = useState<DatosPrecargadosCliente | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [soloEnLinea, setSoloEnLinea] = useState(false);

  const [statusMap, setStatusMap] = useState<Record<number, string | null>>(() => {
    const initial: Record<number, string | null> = {};
    clientes.forEach((c) => {
      initial[c.id] = c.ultimaConexion || null;
    });
    return initial;
  });
  const [ahora, setAhora] = useState<number>(() => Date.now());

  useEffect(() => {
    const actualizarConexiones = async () => {
      try {
        const res = await fetch("/api/admin/status", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        setStatusMap(data.statusMap);
        setAhora(data.serverNow || Date.now());
      } catch {}
    };

    actualizarConexiones();
    const interval = setInterval(actualizarConexiones, 10000);
    return () => clearInterval(interval);
  }, []);

  const clientesActualizados = clientes.map((c) => ({
    ...c,
    ultimaConexion: statusMap[c.id] !== undefined ? statusMap[c.id] : c.ultimaConexion,
  }));

  const totalEnLinea = clientesActualizados.filter((c) => {
    if (!c.ultimaConexion) return false;
    return (ahora - new Date(c.ultimaConexion).getTime()) / 1000 <= 25;
  }).length;

  const promedioAvance =
    clientes.length > 0
      ? Math.round(
          clientes.reduce((acc, c) => acc + (c.proyectos.at(0)?.porcentajeAvance || 0), 0) /
            clientes.length
        )
      : 0;

  const pendientesCount = cotizaciones.filter((c) => c.estado === "Pendiente").length;

  const clientesFiltrados = clientesActualizados.filter((c) => {
    const texto = busqueda.toLowerCase().trim();
    const proyectoTitulo = c.proyectos.at(0)?.titulo.toLowerCase() || "";
    const coincideTexto =
      !texto ||
      c.nombre.toLowerCase().includes(texto) ||
      c.email.toLowerCase().includes(texto) ||
      proyectoTitulo.includes(texto);

    if (!coincideTexto) return false;

    if (soloEnLinea) {
      if (!c.ultimaConexion) return false;
      const diffSeg = (ahora - new Date(c.ultimaConexion).getTime()) / 1000;
      return diffSeg <= 25;
    }

    return true;
  });

  return (
    <>
      <IdleLogout logoutAction={logoutAdmin} />

      {/* Sub-barra de navegación y métricas discretas */}
      <div className="bg-white border-b border-slate-200/90 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4">
          <nav className="flex items-center gap-6 text-sm font-medium">
            <button
              type="button"
              onClick={() => setPestana("clientes")}
              className={`py-4 border-b-2 transition cursor-pointer flex items-center gap-2 ${
                pestana === "clientes"
                  ? "border-red-600 text-slate-900 font-semibold"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <span>Proyectos</span>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full tabular-nums">
                {clientes.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setPestana("cotizaciones")}
              className={`py-4 border-b-2 transition cursor-pointer flex items-center gap-2 ${
                pestana === "cotizaciones"
                  ? "border-red-600 text-slate-900 font-semibold"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <span>Cotizaciones</span>
              {pendientesCount > 0 && (
                <span className="text-[11px] font-bold bg-red-600 text-white px-2 py-0.5 rounded-full tabular-nums">
                  {pendientesCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setPestana("logos")}
              className={`py-4 border-b-2 transition cursor-pointer ${
                pestana === "logos"
                  ? "border-red-600 text-slate-900 font-semibold"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Marcas Aliadas
            </button>
          </nav>

          <div className="flex items-center gap-5 py-2.5">
            <div className="hidden md:flex items-center gap-4 text-xs text-slate-500 border-r border-slate-200 pr-5 tabular-nums">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <strong className="text-slate-800">{totalEnLinea}</strong> en línea
              </span>
              <span>
                Avance global: <strong className="text-slate-800">{promedioAvance}%</strong>
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                setDatosPrecargados(null);
                setModalNuevoAbierto(true);
              }}
              className="bg-slate-900 hover:bg-red-600 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Nuevo Cliente
            </button>
          </div>
        </div>
      </div>
      <main className="max-w-6xl mx-auto p-6 md:py-8 space-y-6">
        {pestana === "cotizaciones" ? (
          <BuzonCotizaciones
            cotizaciones={cotizaciones}
            onConvertirACliente={(datos) => {
              setDatosPrecargados(datos);
              setModalNuevoAbierto(true);
            }}
          />
        ) : pestana === "logos" ? (
          <div className="max-w-xl">
            <GestorLogos />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Barra de búsqueda y filtro minimalista */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="relative flex-1 min-w-[260px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Filtrar por cliente, correo o nombre de obra..."
                  className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-slate-200/90 rounded-xl outline-none focus:border-slate-900 transition"
                />
              </div>

              <button
                type="button"
                onClick={() => setSoloEnLinea(!soloEnLinea)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center gap-2 ${
                  soloEnLinea
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-600 border-slate-200/90 hover:bg-slate-50"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${soloEnLinea ? "bg-emerald-400" : "bg-emerald-500"}`} />
                Conectados ahora ({totalEnLinea})
              </button>
            </div>

            {clientesFiltrados.length === 0 ? (
              <div className="bg-white p-12 rounded-xl border border-slate-200/90 text-center text-sm text-slate-500">
                No se encontraron proyectos con ese filtro.
              </div>
            ) : (
              <div className="space-y-2.5">
                {clientesFiltrados.map((cliente) => (
                  <TarjetaProyecto key={cliente.id} cliente={cliente} serverNow={ahora} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal limpio para registrar nuevo cliente (o convertir desde cotización) */}
      {modalNuevoAbierto && (
        <div
          onMouseDown={() => setModalNuevoAbierto(false)}
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            onMouseDown={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg my-auto"
          >
            <button
              type="button"
              onClick={() => setModalNuevoAbierto(false)}
              className="absolute top-5 right-5 z-10 text-slate-400 hover:text-slate-800 p-1 rounded-lg transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <FormNuevoCliente
              precarga={datosPrecargados}
              onLimpiarPrecarga={() => setDatosPrecargados(null)}
            />
          </div>
        </div>
      )}
    </>
  );
}

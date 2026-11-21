import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getClientPhotosByDate } from "@/lib/googleDrive";
import { loginAdmin, logoutAdmin } from "./actions";
import { AdminDashboard } from "./AdminDashboard";
import { Zap, Shield, LogOut } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin_sesion")?.value === "autenticado";

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0B192C] flex items-center justify-center px-6 text-white">
        <form
          action={async (formData) => {
            "use server";
            await loginAdmin(null, formData);
          }}
          className="w-full max-w-sm bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl space-y-6"
        >
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center mx-auto">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold">Administración ElectroCaribe</h1>
            <p className="text-xs text-slate-400">Ingresa la clave maestra de ingeniería</p>
          </div>

          <input
            type="password"
            name="clave"
            required
            placeholder="Clave maestra"
            className="w-full bg-slate-950 border border-slate-800 focus:border-red-500 rounded-lg px-4 py-2.5 text-sm outline-none"
          />

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 font-semibold py-2.5 rounded-lg text-sm transition"
          >
            Entrar al Panel
          </button>
        </form>
      </div>
    );
  }

  const clientesRaw = await prisma.cliente.findMany({
    orderBy: { creadoEn: "desc" },
    include: {
      proyectos: {
        include: {
          actualizaciones: { orderBy: { fecha: "desc" }, take: 3 },
          fotos: true,
          documentos: true,
        },
      },
    },
  });

  const clientes = await Promise.all(
    clientesRaw.map(async (c: any) => {
      let fotosDrive: { id: string; nombre: string; fecha: string }[] = [];
      if (c.driveFolderId) {
        try {
          const carpetas = await getClientPhotosByDate(c.driveFolderId);
          fotosDrive = carpetas.flatMap((carpeta) =>
            carpeta.photos.map((f) => ({
              id: f.id,
              nombre: f.name,
              fecha: carpeta.date,
            }))
          );
        } catch {
          // Ignorar error temporal
        }
      }

      return {
        ultimaConexion: c.ultimaConexion ? c.ultimaConexion.toISOString() : null,
        ...c,
        fotosDrive,
        proyectos: c.proyectos.map((p: any) => ({
          ...p,
          fechaInicio: p.fechaInicio.toISOString().split("T").at(0),
          fechaEstimadaFin: p.fechaEstimadaFin.toISOString().split("T").at(0),
        })),
      };
    })
  );

  const cotizacionesRaw = await prisma.cotizacion.findMany({
    orderBy: { creadoEn: "desc" },
  });

  const cotizaciones = cotizacionesRaw.map((cot: any) => ({
    ...cot,
    creadoEn: new Date(cot.creadoEn).toLocaleString("es-CO", {
      timeZone: "America/Bogota",
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="bg-[#0B192C] text-white px-6 py-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 p-2 rounded-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold tracking-tight block leading-none">
                ELECTRO<span className="text-red-500">CARIBE</span> • ADMIN
              </span>
              <span className="text-[11px] text-slate-400">Control de Obras y Clientes</span>
            </div>
          </div>

          <form action={logoutAdmin}>
            <button
              type="submit"
              className="flex items-center gap-2 text-xs bg-slate-800 hover:bg-red-600 px-4 py-2 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" /> Salir
            </button>
          </form>
        </div>
      </header>

      <AdminDashboard clientes={clientes} cotizaciones={cotizaciones} />
    </div>
  );
}

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getClientPhotosByDate } from "@/lib/googleDrive";
import { PortalClienteView } from "./PortalClienteView";

export const dynamic = "force-dynamic";

export default async function PortalClientePage() {
  const cookieStore = await cookies();
  const clienteId = cookieStore.get("cliente_sesion")?.value;

  if (!clienteId) {
    redirect("/clientes");
  }

  const cliente = await prisma.cliente.update({
    where: { id: Number(clienteId) },
    data: { ultimaConexion: new Date() },
    include: {
      proyectos: {
        include: {
          actualizaciones: { orderBy: { fecha: "desc" } },
          fotos: { orderBy: { id: "desc" } },
          documentos: { orderBy: { id: "desc" } },
        },
      },
    },
  });

  if (!cliente) {
    redirect("/clientes");
  }

  // 1. Leer fotos reales desde Google Drive (ordenadas por fecha descendente)
  let fotosDrive: { id: number; url: string; titulo: string | null }[] = [];

  if (cliente.driveFolderId) {
    try {
      const carpetasPorFecha = await getClientPhotosByDate(cliente.driveFolderId);
      const todasLasFotos = carpetasPorFecha.flatMap((carpeta) =>
        carpeta.photos.map((foto) => ({
          url: foto.url,
          titulo: `${carpeta.date} • ${foto.name}`,
        }))
      );

      fotosDrive = todasLasFotos.map((f, index) => ({
        id: index + 1,
        url: f.url,
        titulo: f.titulo,
      }));
    } catch (error) {
      console.error("Error leyendo fotos de Drive en el portal:", error);
    }
  }

  const raw = cliente.proyectos.at(0);

  // 2. Filtrar solo las fotos válidas subidas por el admin (/api/fotos-locales/)
  const fotosAdminValidas = (raw?.fotos || [])
    .filter((f: any) => f.url.startsWith("/api/fotos-locales/"))
    .map((f: any, i: number) => ({
      id: fotosDrive.length + i + 1,
      url: f.url,
      titulo: f.titulo,
    }));

  // 3. Combinar fotos del Admin (más recientes primero) + fotos de Google Drive
  const fotosCombinadas = [...fotosAdminValidas, ...fotosDrive];

  const proyecto = raw
    ? {
        id: raw.id,
        titulo: raw.titulo,
        estado: raw.estado,
        ubicacion: raw.ubicacion,
        alcance: raw.alcance,
        porcentajeAvance: raw.porcentajeAvance,
        fasesCompletadas: raw.fasesCompletadas,
        totalFases: raw.totalFases,
        fechaInicio: new Date(raw.fechaInicio).toLocaleDateString("es-CO", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        fechaEstimadaFin: new Date(raw.fechaEstimadaFin).toLocaleDateString("es-CO", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        actualizaciones: raw.actualizaciones.map((a: any) => ({
          id: a.id,
          titulo: a.titulo,
          fecha: new Date(a.fecha).toLocaleDateString("es-CO", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }),
        })),
        fotos: fotosCombinadas,
        documentos: raw.documentos.map((d: any) => ({
          id: d.id,
          url: d.url,
          nombre: d.nombre,
          creadoEn: new Date(d.creadoEn).toLocaleDateString("es-CO", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
        })),
      }
    : null;

  return (
    <PortalClienteView
      nombreCliente={cliente.nombre}
      emailCliente={cliente.email}
      proyecto={proyecto}
    />
  );
}

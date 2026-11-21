"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createClientDriveStructure, deleteDriveFile } from "@/lib/googleDrive";
import { decryptId } from "@/lib/cryptoToken";
import { limpiarYReescalarLogo } from "@/lib/procesarLogo";

export async function loginAdmin(prevState: { error?: string } | null, formData: FormData) {
  const clave = String(formData.get("clave") || "");
  const claveReal = process.env.ADMIN_PASSWORD || "AdminElectro2026*";

  if (clave !== claveReal) {
    return { error: "Clave de administrador incorrecta." };
  }

  const cookieStore = await cookies();
  cookieStore.set("admin_sesion", "autenticado", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  redirect("/admin");
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_sesion");
  redirect("/admin");
}

export async function crearClienteConProyecto(formData: FormData) {
  const nombre = String(formData.get("nombre") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const titulo = String(formData.get("titulo") || "").trim();
  const ubicacion = String(formData.get("ubicacion") || "").trim();
  const alcance = String(formData.get("alcance") || "").trim();
  const fechaInicio = String(formData.get("fechaInicio") || "");
  const fechaEstimadaFin = String(formData.get("fechaEstimadaFin") || "");

  if (!nombre || !email || !password || !titulo) return;

  const passwordHash = await bcrypt.hash(password, 10);
  const driveFolderId = await createClientDriveStructure(nombre);

  await prisma.cliente.create({
    data: {
      nombre,
      email,
      password: passwordHash,
      driveFolderId,
      proyectos: {
        create: {
          titulo,
          ubicacion: ubicacion || "Barranquilla, Atlántico",
          alcance: alcance || "Ejecución de proyecto eléctrico industrial.",
          porcentajeAvance: 0,
          fasesCompletadas: 0,
          totalFases: 5,
          fechaInicio: fechaInicio ? new Date(fechaInicio) : new Date(),
          fechaEstimadaFin: fechaEstimadaFin
            ? new Date(fechaEstimadaFin)
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          actualizaciones: {
            create: {
              titulo: "Inicio formal del proyecto y asignación de equipo de ingeniería.",
            },
          },
        },
      },
    },
  });

  revalidatePath("/admin");
}

export async function editarDatosProyecto(formData: FormData) {
  const proyectoId = Number(formData.get("proyectoId"));
  const titulo = String(formData.get("titulo") || "").trim();
  const ubicacion = String(formData.get("ubicacion") || "").trim();
  const alcance = String(formData.get("alcance") || "").trim();
  const totalFases = Number(formData.get("totalFases") || 5);
  const fechaInicio = String(formData.get("fechaInicio") || "");
  const fechaEstimadaFin = String(formData.get("fechaEstimadaFin") || "");

  if (!proyectoId || !titulo) return;

  await prisma.proyecto.update({
    where: { id: proyectoId },
    data: {
      titulo,
      ubicacion,
      alcance,
      totalFases,
      ...(fechaInicio ? { fechaInicio: new Date(fechaInicio) } : {}),
      ...(fechaEstimadaFin ? { fechaEstimadaFin: new Date(fechaEstimadaFin) } : {}),
    },
  });

  revalidatePath("/admin");
  revalidatePath("/clientes/portal");
}

export async function actualizarAvanceProyecto(formData: FormData) {
  const proyectoId = Number(formData.get("proyectoId"));
  const porcentajeAvance = Math.min(100, Math.max(0, Number(formData.get("porcentajeAvance"))));
  const fasesCompletadas = Number(formData.get("fasesCompletadas"));
  const estado = String(formData.get("estado") || "En ejecución");

  await prisma.proyecto.update({
    where: { id: proyectoId },
    data: {
      porcentajeAvance,
      fasesCompletadas,
      estado,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/clientes/portal");
}

export async function cambiarPasswordCliente(formData: FormData) {
  const clienteId = Number(formData.get("clienteId"));
  const nuevaPassword = String(formData.get("nuevaPassword") || "").trim();

  if (!clienteId || nuevaPassword.length < 4) return;

  const passwordHash = await bcrypt.hash(nuevaPassword, 10);

  await prisma.cliente.update({
    where: { id: clienteId },
    data: { password: passwordHash },
  });

  revalidatePath("/admin");
}

export async function publicarNovedad(formData: FormData) {
  const proyectoId = Number(formData.get("proyectoId"));
  const titulo = String(formData.get("titulo") || "").trim();

  if (!titulo || !proyectoId) return;

  await prisma.actualizacion.create({
    data: {
      proyectoId,
      titulo,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/clientes/portal");
}

export async function subirArchivoProyecto(formData: FormData) {
  const proyectoId = Number(formData.get("proyectoId"));
  const tipo = String(formData.get("tipo") || "documento");
  const etiqueta = String(formData.get("etiqueta") || "").trim();
  const archivo = formData.get("archivo") as File | null;

  if (!proyectoId || !archivo || archivo.size === 0) return;

  const bytes = await archivo.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const nombreLimpio = `${Date.now()}-${archivo.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

  if (tipo === "foto") {
    const fotosDir = path.join(process.cwd(), "private_uploads", "fotos");
    await mkdir(fotosDir, { recursive: true });
    await writeFile(path.join(fotosDir, nombreLimpio), buffer);

    await prisma.fotoProyecto.create({
      data: {
        proyectoId,
        url: `/api/fotos-locales/${nombreLimpio}`,
        titulo: etiqueta || archivo.name,
      },
    });
  } else {
    const privateDir = path.join(process.cwd(), "private_uploads", "documentos");
    await mkdir(privateDir, { recursive: true });
    await writeFile(path.join(privateDir, nombreLimpio), buffer);

    const doc = await prisma.documentoProyecto.create({
      data: {
        proyectoId,
        url: nombreLimpio,
        nombre: etiqueta || archivo.name,
      },
    });

    await prisma.documentoProyecto.update({
      where: { id: doc.id },
      data: { url: `/api/documentos/${doc.id}` },
    });
  }

  revalidatePath("/admin");
  revalidatePath("/clientes/portal");
}

export async function eliminarFotoProyecto(fotoId: number) {
  if (!fotoId) return;

  const foto = await prisma.fotoProyecto.findUnique({
    where: { id: fotoId },
  });

  if (foto) {
    const nombreArchivo = path.basename(foto.url);
    const rutaFisica = path.join(process.cwd(), "private_uploads", "fotos", nombreArchivo);
    await unlink(rutaFisica).catch(() => {});
    await prisma.fotoProyecto.delete({ where: { id: fotoId } });
  }

  revalidatePath("/admin");
  revalidatePath("/clientes/portal");
}

export async function eliminarDocumentoProyecto(docId: number) {
  if (!docId) return;

  const doc = await prisma.documentoProyecto.findUnique({
    where: { id: docId },
  });

  if (doc) {
    // Buscamos cualquier archivo en private_uploads/documentos o borramos el registro
    await prisma.documentoProyecto.delete({ where: { id: docId } });
  }

  revalidatePath("/admin");
  revalidatePath("/clientes/portal");
}

export async function eliminarNovedad(actualizacionId: number) {
  if (!actualizacionId) return;

  await prisma.actualizacion.delete({
    where: { id: actualizacionId },
  });

  revalidatePath("/admin");
  revalidatePath("/clientes/portal");
}

export async function eliminarCliente(clienteId: number) {
  if (!clienteId) return;

  // 1. Buscar proyectos del cliente para limpiar sus registros hijos
  const proyectos = await prisma.proyecto.findMany({
    where: { clienteId },
    select: { id: true },
  });

  const proyectoIds = proyectos.map((p) => p.id);

  if (proyectoIds.length > 0) {
    await prisma.actualizacion.deleteMany({
      where: { proyectoId: { in: proyectoIds } },
    });
    await prisma.fotoProyecto.deleteMany({
      where: { proyectoId: { in: proyectoIds } },
    });
    await prisma.documentoProyecto.deleteMany({
      where: { proyectoId: { in: proyectoIds } },
    });
    await prisma.proyecto.deleteMany({
      where: { id: { in: proyectoIds } },
    });
  }

  // 2. Eliminar el cliente
  await prisma.cliente.delete({
    where: { id: clienteId },
  });

  revalidatePath("/admin");
  revalidatePath("/clientes/portal");
}

export async function eliminarFotoDrive(encryptedToken: string) {
  if (!encryptedToken) return;

  const realFileId = decryptId(encryptedToken);
  if (!realFileId) return;

  await deleteDriveFile(realFileId);

  revalidatePath("/admin");
  revalidatePath("/clientes/portal");
}

export async function subirLogoPasarela(formData: FormData) {
  const archivo = formData.get("logo") as File | null;
  if (!archivo || archivo.size === 0) return;

  const bytes = await archivo.arrayBuffer();
  const bufferOriginal = Buffer.from(bytes);

  // Limpiar fondo blanco, recortar márgenes y reescalar a PNG HD
  let bufferFinal: Buffer;
  try {
    bufferFinal = await limpiarYReescalarLogo(bufferOriginal);
  } catch {
    bufferFinal = bufferOriginal;
  }

  const logosDir = path.join(process.cwd(), "public", "logos-clientes");
  await mkdir(logosDir, { recursive: true });

  const baseName = archivo.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9._-]/g, "_");
  const nombreSeguro = `${Date.now()}-${baseName}.png`;
  await writeFile(path.join(logosDir, nombreSeguro), bufferFinal);

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function eliminarLogoPasarela(filename: string) {
  if (!filename) return;
  const nombreSeguro = path.basename(filename);
  const rutaArchivo = path.join(process.cwd(), "public", "logos-clientes", nombreSeguro);

  await unlink(rutaArchivo).catch(() => {});

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function actualizarEstadoCotizacion(cotizacionId: number, estado: string) {
  if (!cotizacionId || !estado) return;

  await prisma.cotizacion.update({
    where: { id: cotizacionId },
    data: { estado },
  });

  revalidatePath("/admin");
}

export async function eliminarCotizacion(cotizacionId: number) {
  if (!cotizacionId) return;

  await prisma.cotizacion.delete({
    where: { id: cotizacionId },
  });

  revalidatePath("/admin");
}

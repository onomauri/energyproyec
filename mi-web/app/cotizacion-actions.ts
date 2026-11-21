"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function enviarCotizacion(prevState: { ok?: boolean; error?: string } | null, formData: FormData) {
  const nombre = String(formData.get("nombre") || "").trim();
  const empresa = String(formData.get("empresa") || "").trim();
  const telefono = String(formData.get("telefono") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const servicio = String(formData.get("servicio") || "Subestaciones Eléctricas").trim();
  const descripcion = String(formData.get("descripcion") || "").trim();

  if (!nombre || !telefono || !email || !descripcion) {
    return { error: "Por favor completa todos los campos obligatorios." };
  }

  await prisma.cotizacion.create({
    data: {
      nombre,
      empresa: empresa || null,
      telefono,
      email,
      servicio,
      descripcion,
    },
  });

  revalidatePath("/admin");
  return { ok: true };
}

export async function marcarCotizacionAtendida(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!id) return;

  await prisma.cotizacion.update({
    where: { id },
    data: { estado: "Contactado" },
  });

  revalidatePath("/admin");
}

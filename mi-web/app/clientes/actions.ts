"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function loginCliente(prevState: { error?: string } | null, formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Por favor ingresa tu correo y contraseña." };
  }

  const cliente = await prisma.cliente.findUnique({
    where: { email },
  });

  if (!cliente) {
    return { error: "Credenciales incorrectas." };
  }

  const passwordValida = await bcrypt.compare(password, cliente.password);
  if (!passwordValida) {
    return { error: "Credenciales incorrectas." };
  }

  const cookieStore = await cookies();
  cookieStore.set("cliente_sesion", String(cliente.id), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" && false, // Cambiar a true cuando actives HTTPS
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 días
  });

  redirect("/clientes/portal");
}

export async function logoutCliente() {
  const cookieStore = await cookies();
  const cId = cookieStore.get("cliente_sesion")?.value;
  if (cId) {
    await prisma.cliente.update({ where: { id: Number(cId) }, data: { ultimaConexion: new Date(Date.now() - 120000) } }).catch(() => {});
  }
  cookieStore.delete("cliente_sesion");
  redirect("/clientes");
}

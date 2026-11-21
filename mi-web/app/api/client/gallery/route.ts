import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { getClientPhotosByDate } from '@/lib/googleDrive';

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const isAdmin = cookieStore.get('admin_sesion')?.value === 'autenticado';
    const clienteId = cookieStore.get('cliente_sesion')?.value;

    if (!isAdmin && !clienteId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Se requiere el parámetro email' }, { status: 400 });
    }

    const cliente = await prisma.cliente.findUnique({
      where: { email },
      select: { id: true, nombre: true, driveFolderId: true },
    });

    if (!cliente || !cliente.driveFolderId) {
      return NextResponse.json({ error: 'Cliente sin carpeta vinculada' }, { status: 404 });
    }

    // Evitar que un cliente consulte la galería de otro correo distinto al suyo
    if (!isAdmin && cliente.id !== Number(clienteId)) {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const gallery = await getClientPhotosByDate(cliente.driveFolderId);

    return NextResponse.json({
      client: cliente.nombre,
      gallery,
    });
  } catch (error) {
    console.error('Error obteniendo galería:', error);
    return NextResponse.json({ error: 'Error al leer las fotos de Google Drive' }, { status: 500 });
  }
}

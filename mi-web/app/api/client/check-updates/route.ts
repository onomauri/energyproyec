import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { getClientPhotosByDate } from '@/lib/googleDrive';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const clienteId = cookieStore.get('cliente_sesion')?.value;

    if (!clienteId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Actualiza la hora de última conexión en PostgreSQL y obtiene los datos del cliente
    const cliente = await prisma.cliente.update({
      where: { id: Number(clienteId) },
      data: { ultimaConexion: new Date() },
      include: {
        proyectos: {
          include: {
            fotos: {
              where: { url: { startsWith: '/api/fotos-locales/' } },
              select: { id: true },
            },
            documentos: { select: { id: true } },
            actualizaciones: { select: { id: true } },
          },
        },
      },
    });

    let totalDrivePhotos = 0;
    if (cliente.driveFolderId) {
      try {
        const carpetas = await getClientPhotosByDate(cliente.driveFolderId);
        totalDrivePhotos = carpetas.reduce((acc, c) => acc + c.photos.length, 0);
      } catch {
        // Ignorar si Drive tarda momentáneamente
      }
    }

    const proyecto = cliente.proyectos.at(0);
    const fotosAdmin = (proyecto?.fotos || []).length;
    const docs = (proyecto?.documentos || []).length;
    const novedades = (proyecto?.actualizaciones || []).length;
    const avance = proyecto?.porcentajeAvance ?? 0;

    const signature = `d:${totalDrivePhotos}-fa:${fotosAdmin}-doc:${docs}-nov:${novedades}-av:${avance}`;

    return NextResponse.json({
      signature,
      counts: {
        fotos: totalDrivePhotos + fotosAdmin,
        documentos: docs,
        novedades,
        avance,
      },
    });
  } catch (error) {
    console.error('Error en check-updates:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

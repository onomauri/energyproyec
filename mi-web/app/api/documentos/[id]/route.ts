import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { readFile } from 'fs/promises';
import path from 'path';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const docId = Number(id);

    if (!docId || isNaN(docId)) {
      return new NextResponse('ID de documento inválido', { status: 400 });
    }

    const cookieStore = await cookies();
    const isAdmin = cookieStore.get('admin_sesion')?.value === 'autenticado';
    const clienteId = cookieStore.get('cliente_sesion')?.value;

    // 1. Verificar que exista alguna sesión activa
    if (!isAdmin && !clienteId) {
      return new NextResponse('No autorizado', { status: 401 });
    }

    // 2. Buscar el documento y el dueño del proyecto en PostgreSQL
    const documento = await prisma.documentoProyecto.findUnique({
      where: { id: docId },
      include: {
        proyecto: {
          select: { clienteId: true },
        },
      },
    });

    if (!documento) {
      return new NextResponse('Documento no encontrado', { status: 404 });
    }

    // 3. Si es cliente (no admin), verificar que sea dueño del proyecto
    if (!isAdmin && documento.proyecto.clienteId !== Number(clienteId)) {
      return new NextResponse('Acceso denegado a este documento', { status: 403 });
    }

    // 4. Leer el archivo desde la carpeta privada (fuera de public/)
    const nombreArchivoFisico = path.basename(documento.url);
    const rutaPrivada = path.join(process.cwd(), 'private_uploads', 'documentos', nombreArchivoFisico);
    const fileBuffer = await readFile(rutaPrivada);

    // Determinar extensión para el nombre de descarga
    const ext = path.extname(nombreArchivoFisico);
    const nombreDescarga = documento.nombre.endsWith(ext)
      ? documento.nombre
      : `${documento.nombre}${ext}`;

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(nombreDescarga)}"`,
      },
    });
  } catch (error) {
    console.error('Error descargando documento privado:', error);
    return new NextResponse('Error interno o archivo no encontrado en disco', { status: 500 });
  }
}

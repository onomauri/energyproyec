import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const cookieStore = await cookies();
    const isAdmin = cookieStore.get('admin_sesion')?.value === 'autenticado';
    const clienteId = cookieStore.get('cliente_sesion')?.value;

    if (!isAdmin && !clienteId) {
      return new NextResponse('No autorizado', { status: 401 });
    }

    const { filename } = await params;
    const nombreSeguro = path.basename(filename);
    const rutaFoto = path.join(process.cwd(), 'private_uploads', 'fotos', nombreSeguro);
    const buffer = await readFile(rutaFoto);

    const ext = path.extname(nombreSeguro).toLowerCase();
    const mimeType =
      ext === '.png' ? 'image/png' :
      ext === '.webp' ? 'image/webp' :
      ext === '.gif' ? 'image/gif' : 'image/jpeg';

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch {
    return new NextResponse('Imagen no encontrada', { status: 404 });
  }
}

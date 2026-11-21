import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    const nombreSeguro = path.basename(decodeURIComponent(filename));
    const rutaArchivo = path.join(process.cwd(), 'public', 'logos-clientes', nombreSeguro);
    const buffer = await readFile(rutaArchivo);

    const ext = path.extname(nombreSeguro).toLowerCase();
    const mimeType =
      ext === '.svg' ? 'image/svg+xml' :
      ext === '.png' ? 'image/png' :
      ext === '.webp' ? 'image/webp' : 'image/jpeg';

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch {
    return new NextResponse('Logo no encontrado', { status: 404 });
  }
}

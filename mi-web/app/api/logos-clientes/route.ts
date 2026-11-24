import { NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const logosDir = path.join(process.cwd(), 'public', 'logos-clientes');
    const files = await readdir(logosDir);

    const logos = files
      .filter((f) => /\.(png|jpe?g|svg|webp)$/i.test(f))
      // Ignorar duplicados ("- copia") y el logo propio de la empresa
      .filter((f) => !/copia/i.test(f) && f.toLowerCase() !== 'logo.png')
      .sort((a, b) => a.localeCompare(b))
      .map((filename) => ({
        filename,
        nombre: filename
          .replace(/\.[^/.]+$/, '') // Quitar extensión
          .replace(/[-_]/g, ' ')    // Cambiar guiones por espacios
          .toUpperCase(),
        url: `/api/logos-clientes/${encodeURIComponent(filename)}`,
      }));

    return NextResponse.json({ logos });
  } catch {
    return NextResponse.json({ logos: [] });
  }
}
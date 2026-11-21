import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get('admin_sesion')?.value === 'autenticado';

  if (!isAdmin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const clientes = await prisma.cliente.findMany({
    select: {
      id: true,
      ultimaConexion: true,
    },
  });

  const statusMap: Record<number, string | null> = {};
  for (const c of clientes) {
    statusMap[c.id] = c.ultimaConexion ? c.ultimaConexion.toISOString() : null;
  }

  return NextResponse.json({ statusMap, serverNow: Date.now() });
}

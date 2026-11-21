import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { drive } from '@/lib/googleDrive';
import { prisma } from '@/lib/prisma';
import { decryptId } from '@/lib/cryptoToken';
import { Readable } from 'stream';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    const { fileId: encryptedToken } = await params;
    const { searchParams } = new URL(request.url);
    const isThumb = searchParams.get('size') === 'thumb';

    const cookieStore = await cookies();
    const isAdmin = cookieStore.get('admin_sesion')?.value === 'autenticado';
    const clienteId = cookieStore.get('cliente_sesion')?.value;

    if (!isAdmin && !clienteId) {
      return new NextResponse('No autorizado', { status: 401 });
    }

    const realFileId = decryptId(encryptedToken);
    if (!realFileId) {
      return new NextResponse('Enlace inválido', { status: 400 });
    }

    // Pedimos thumbnailLink además de parents para acelerar la carga
    const metadata = await drive.files.get({
      fileId: realFileId,
      fields: 'mimeType, parents, thumbnailLink',
    });

    if (!isAdmin && clienteId) {
      const cliente = await prisma.cliente.findUnique({
        where: { id: Number(clienteId) },
        select: { driveFolderId: true },
      });

      const dateFolderId = metadata.data.parents?.at(0);
      if (!cliente?.driveFolderId || !dateFolderId) {
        return new NextResponse('Acceso denegado', { status: 403 });
      }

      const dateFolderMeta = await drive.files.get({
        fileId: dateFolderId,
        fields: 'parents',
      });

      if (dateFolderMeta.data.parents?.at(0) !== cliente.driveFolderId) {
        return new NextResponse('Acceso denegado', { status: 403 });
      }
    }

    // Si existe thumbnailLink, usamos =s600 para miniaturas o =s1200 para vista ampliada (carga 10x más rápido)
    const thumbUrl = metadata.data.thumbnailLink;
    if (thumbUrl) {
      const targetSize = isThumb ? '=s600' : '=s1200';
      const fastUrl = thumbUrl.replace(/=s\d+$/, targetSize);
      const imgRes = await fetch(fastUrl);

      if (imgRes.ok) {
        const buffer = await imgRes.arrayBuffer();
        return new NextResponse(buffer, {
          status: 200,
          headers: {
            'Content-Type': imgRes.headers.get('content-type') || 'image/jpeg',
            'Cache-Control': 'private, max-age=86400',
          },
        });
      }
    }

    // Fallback al archivo original si no hay miniatura generada aún
    const driveResponse = await drive.files.get(
      { fileId: realFileId, alt: 'media' },
      { responseType: 'stream' }
    );

    const webStream = Readable.toWeb(driveResponse.data as Readable) as ReadableStream;
    return new NextResponse(webStream, {
      status: 200,
      headers: {
        'Content-Type': metadata.data.mimeType || 'image/jpeg',
        'Cache-Control': 'private, max-age=86400',
      },
    });
  } catch (error) {
    console.error('Error cargando imagen:', error);
    return new NextResponse('No se pudo cargar la imagen', { status: 404 });
  }
}

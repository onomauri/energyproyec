import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClientDriveStructure } from '@/lib/googleDrive';
import bcrypt from 'bcryptjs';

// GET: Obtener la lista de todos los clientes (útil para tu tabla de Admin)
export async function GET() {
  try {
    const clients = await prisma.user.findMany({
      where: { role: 'CLIENT' },
      select: {
        id: true,
        name: true,
        email: true,
        driveFolderId: true,
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ clients }, { status: 200 });
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    return NextResponse.json(
      { error: 'Error al obtener la lista de clientes' },
      { status: 500 }
    );
  }
}

// POST: Crear un nuevo cliente en PostgreSQL y su carpeta en Google Drive
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // 1. Validar que lleguen todos los datos
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Nombre, correo y contraseña son obligatorios' },
        { status: 400 }
      );
    }

    // 2. Verificar que el correo no esté repetido
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Ya existe un cliente registrado con este correo' },
        { status: 400 }
      );
    }

    // 3. Crear carpeta en Google Drive (Cliente > Fecha de hoy)
    const driveFolderId = await createClientDriveStructure(name);

    // 4. Encriptar la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Guardar el cliente en PostgreSQL vinculado a su carpeta de Drive
    const newClient = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'CLIENT',
        driveFolderId,
      },
    });

    return NextResponse.json(
      {
        message: 'Cliente y carpeta de Drive creados con éxito',
        client: {
          id: newClient.id,
          name: newClient.name,
          email: newClient.email,
          driveFolderId: newClient.driveFolderId,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error en POST /api/admin/clients:', error);
    return NextResponse.json(
      { error: 'Error interno al crear el cliente o su carpeta en Drive' },
      { status: 500 }
    );
  }
}

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Electro2026*", 10);

  const cliente = await prisma.cliente.upsert({
    where: { email: "cliente@industriascaribe.com" },
    update: {},
    create: {
      nombre: "Industrias del Caribe S.A.S.",
      email: "cliente@industriascaribe.com",
      password: passwordHash,
      proyectos: {
        create: {
          titulo: "Mantenimiento Subestación 34.5 kV - Planta Norte",
          estado: "En ejecución",
          ubicacion: "Barranquilla, Atlántico",
          alcance:
            "Mantenimiento preventivo y pruebas dieléctricas a transformadores de potencia, celdas de media tensión y sistema de puesta a tierra.",
          porcentajeAvance: 72,
          fasesCompletadas: 3,
          totalFases: 5,
          fechaInicio: new Date("2026-09-15"),
          fechaEstimadaFin: new Date("2026-12-10"),
          actualizaciones: {
            create: [
              {
                titulo:
                  "Instalación de protecciones y pruebas de funcionamiento.",
                fecha: new Date("2026-11-12"),
              },
              {
                titulo:
                  "Termografía infrarroja y análisis físico-químico de aceite.",
                fecha: new Date("2026-11-04"),
              },
              {
                titulo:
                  "Inspección inicial y desenergización controlada de celdas.",
                fecha: new Date("2026-10-20"),
              },
            ],
          },
        },
      },
    },
  });

  console.log("Cliente creado:", cliente.email);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());

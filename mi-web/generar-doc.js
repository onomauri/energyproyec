const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const doc = new PDFDocument({ size: "LETTER", margin: 50 });
const outputPath = path.join(process.cwd(), "Documentacion_Tecnica_EnergyProyec.pdf");
doc.pipe(fs.createWriteStream(outputPath));

const NAVY = "#0B192C";
const RED = "#DC2626";
const SLATE = "#334155";
const LIGHT = "#F8FAFC";

function headerBanner(titulo, subtitulo) {
  doc.rect(0, 0, doc.page.width, 95).fill(NAVY);
  doc.rect(0, 95, doc.page.width, 4).fill(RED);
  doc.fillColor("#FFFFFF").font("Helvetica-Bold").fontSize(20).text(titulo, 50, 28);
  doc.fillColor("#CBD5E1").font("Helvetica").fontSize(10).text(subtitulo, 50, 56);
  doc.moveDown(3);
  doc.y = 120;
}

function sectionTitle(num, title) {
  doc.moveDown(0.8);
  doc.fillColor(RED).font("Helvetica-Bold").fontSize(11).text(`${num}. ${title.toUpperCase()}`);
  doc.moveTo(50, doc.y + 2).lineTo(562, doc.y + 2).strokeColor("#E2E8F0").lineWidth(1).stroke();
  doc.moveDown(0.5);
}

function bullet(label, text) {
  doc.fillColor(NAVY).font("Helvetica-Bold").fontSize(10).text(`• ${label}: `, { continued: true });
  doc.fillColor(SLATE).font("Helvetica").text(text);
  doc.moveDown(0.25);
}

// PÁGINA 1: ARQUITECTURA Y MAPA DEL PROYECTO
headerBanner(
  "ENERGYPROYEC INGENIERÍA ELÉCTRICA",
  "Documento Técnico de Arquitectura, Operación y Guía de Demostración • Noviembre 2026"
);

sectionTitle("1", "Resumen Ejecutivo y Stack Tecnológico");
doc.fillColor(SLATE).font("Helvetica").fontSize(10).text(
  "Plataforma web corporativa y portal de seguimiento de obras eléctricas en tiempo real desplegada sobre Oracle Cloud Infrastructure (Ubuntu Server) con cifrado SSL/TLS (HTTPS)."
);
doc.moveDown(0.5);
bullet("Frontend & Backend", "Next.js 16 (App Router, Server Actions, Turbopack), React 19 y Tailwind CSS.");
bullet("Base de Datos & ORM", "PostgreSQL local en Ubuntu Server gestionado mediante Prisma ORM.");
bullet("Almacenamiento Híbrido", "Google Drive API v3 (evidencias fotográficas) y almacenamiento privado en disco (documentos RETIE/planos).");
bullet("Servidor Web & Procesos", "Nginx como Proxy Inverso con certificado Let's Encrypt + PM2 (demonio persistente).");

sectionTitle("2", "Estructura de Directorios en el Servidor (~/mi-web)");
bullet("app/page.tsx", "Landing page pública, pasarela infinita de marcas aliadas y modal de cotización técnica.");
bullet("app/clientes/", "Portal privado de clientes: inicio de sesión, progreso de obra, galería y descargas.");
bullet("app/admin/", "Centro de mando CRM: gestión de proyectos, buzón de leads con mapa de calor y gestor de logos.");
bullet("app/terminos-y-condiciones/", "Marco legal colombiano de tratamiento de datos (Ley 1581 de 2012) y disclaimers.");
bullet("app/api/", "Endpoints protegidos: proxy cifrado de Drive, descargas privadas, estado en vivo y sincronización.");
bullet("lib/", "Módulos centrales: prisma.ts, googleDrive.ts, cryptoToken.ts (AES-256-GCM), mailer.ts y procesarLogo.ts.");
bullet("private_uploads/", "Carpeta fuera de public/ donde se almacenan documentos técnicos y fotos locales protegidas.");
// PÁGINA 2: SEGURIDAD, USUARIOS Y GUION DE DEMO
doc.addPage();
headerBanner(
  "SEGURIDAD, ACCESOS Y GUION DE DEMOSTRACIÓN",
  "Controles de Privacidad, Gestión de Usuarios y Flujo de Prueba en Vivo"
);

sectionTitle("3", "Arquitectura de Seguridad y Privacidad");
bullet("Cifrado de Enlaces (AES-256-GCM)", "Los IDs de Google Drive se encriptan en el servidor y se sirven mediante URLs temporales blob: en el navegador.");
bullet("Control de Acceso por Sesión", "Cookies HttpOnly (admin_sesion y cliente_sesion) validan que cada cliente solo acceda a sus propios archivos.");
bullet("Cierre por Inactividad", "Desconexión automática tras 10 minutos sin interacción del usuario (con alerta preventiva al minuto 9).");
bullet("Sincronización en Tiempo Real", "Actualización automática sin recargar (F5) cada 10s con notificaciones animadas, timbre sonoro y presencia en vivo.");

sectionTitle("4", "Roles, Rutas de Acceso y Credenciales");
bullet("Página Pública", "https://duckdns.org (Acceso abierto a visitantes y cotizador web).");
bullet("Portal de Clientes", "https://duckdns.orgclientes (Autenticación con correo corporativo y contraseña).");
bullet("Panel Administrador (CRM)", "https://duckdns.orgadmin (Acceso mediante clave maestra ADMIN_PASSWORD en .env).");
bullet("Base de Datos & Variables", "Configuradas en ~/mi-web/.env (DATABASE_URL, GOOGLE_DRIVE_ROOT_FOLDER_ID, DRIVE_TOKEN_SECRET, SMTP).");

doc.moveDown(0.4);
doc.rect(50, doc.y, 512, 58).fill(LIGHT).stroke("#CBD5E1");
doc.fillColor(NAVY).font("Helvetica-Bold").fontSize(9.5).text("CREDENCIALES PARA LA DEMOSTRACIÓN EN VIVO:", 62, doc.y + 10);
doc.fillColor(SLATE).font("Helvetica").fontSize(9).text(
  "• Clave Admin: Definida en ADMIN_PASSWORD (.env)   |   • Cliente Demo: Crear desde /admin o usar cuenta registrada\n• Nota: Al crear un cliente en /admin, el sistema genera su carpeta en Drive y envía credenciales por correo automáticamente.",
  62,
  doc.y + 4
);
doc.y += 28;

sectionTitle("5", "Guion Recomendado para la Muestra (5 Pasos)");
bullet("1. Vista Pública y Cotización", "Mostrar la pasarela de logos sin bordes, servicios y enviar una cotización desde el modal centrado.");
bullet("2. CRM y Mapa de Calor (/admin)", "Ingresar al panel admin, revisar la alerta en el Buzón de Cotizaciones y convertir el lead en cliente.");
bullet("3. Automatización Google Drive", "Verificar que se creó la carpeta del cliente en Drive y subir una fotografía de prueba.");
bullet("4. Portal del Cliente en Vivo", "Abrir /clientes en otra ventana y observar cómo llega la foto en tiempo real con sonido y sin hacer F5.");
bullet("5. Seguridad y Documentos", "Subir un PDF técnico desde /admin, descargarlo como cliente y comprobar el bloqueo 401 en incógnito.");

sectionTitle("6", "Comandos de Mantenimiento en Servidor Ubuntu");
doc.font("Courier").fontSize(9).fillColor("#0F172A").text(
  "pm2 status                          # Verificar estado del proceso\npm2 restart mi-web --update-env     # Reiniciar tras cambios en .env\ncd ~/mi-web && npm run build        # Compilar nueva versión en producción",
  55,
  doc.y
);

doc.end();
console.log("PDF generado con éxito en:", outputPath);

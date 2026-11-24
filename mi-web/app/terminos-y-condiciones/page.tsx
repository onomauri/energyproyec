import Link from "next/link";
import { ShieldCheck, ArrowLeft, FileText, Lock, Scale } from "lucide-react";
import Isotipo from "@/components/Isotipo";

export default function TerminosYCondicionesPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Barra superior */}
      <header className="bg-[#0B192C] text-white border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Isotipo className="h-10 w-auto" />
            <span className="font-extrabold tracking-tight text-sm sm:text-base">
              ENERGY<span className="text-red-500">PROYEC</span>
            </span>
          </Link>

          <Link
            href="/clientes"
            className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al Portal
          </Link>
        </div>
      </header>

      {/* Contenido Legal */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 space-y-8">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-6 space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600">
              <Scale className="w-3.5 h-3.5" /> Marco Legal Colombia • Ley 1581 de 2012
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Términos y Condiciones de Uso y Política de Tratamiento de Datos Personales
            </h1>
            <p className="text-xs text-slate-500">
              Última actualización: Noviembre de 2026 • Barranquilla, Atlántico — República de Colombia
            </p>
          </div>

          <section className="space-y-2.5 text-sm leading-relaxed text-slate-600">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-red-600" /> 1. Aceptación y Objeto del Portal
            </h2>
            <p>
              El acceso y uso del Portal de Clientes de <strong>ENERGYPROYEC</strong> (en adelante, &ldquo;EnergyProyec&rdquo;) atribuye la condición de Usuario Autorizado e implica la aceptación plena y sin reservas de los presentes Términos y Condiciones. Este portal está destinado exclusivamente a clientes corporativos, contratistas e interventores autorizados para el seguimiento técnico, documental y fotográfico de proyectos eléctricos en ejecución.
            </p>
          </section>

          <section className="space-y-2.5 text-sm leading-relaxed text-slate-600">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-red-600" /> 2. Política de Tratamiento de Datos Personales (Ley 1581 de 2012)
            </h2>
            <p>
              En cumplimiento de la <strong>Ley Estatutaria 1581 de 2012</strong>, el <strong>Decreto Reglamentario 1377 de 2013</strong> y demás normas concordantes de la República de Colombia sobre protección de datos personales (Habeas Data), EnergyProyec actúa como Responsable del Tratamiento de los datos suministrados por los titulares (nombres, correos corporativos, teléfonos de contacto y registros técnicos de acceso).
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Finalidades:</strong> Gestionar la relación contractual y comercial, habilitar credenciales de acceso seguro, informar avances de obra, entregar documentación técnica y prestar soporte de ingeniería.
              </li>
              <li>
                <strong>Derechos del Titular (Art. 8, Ley 1581 de 2012):</strong> El titular tiene derecho a conocer, actualizar, rectificar y solicitar la supresión de sus datos personales, así como a revocar la autorización otorgada cuando no exista un deber legal o contractual que lo impida, escribiendo al correo <strong>ingenieria@energyproyec.com</strong>.
              </li>
            </ul>
          </section>
          <section className="space-y-2.5 text-sm leading-relaxed text-slate-600">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-red-600" /> 3. Confidencialidad, Propiedad Intelectual y Seguridad
            </h2>
            <p>
              Todos los planos eléctricos, memorias de cálculo, protocolos de pruebas dieléctricas, certificados RETIE, informes termográficos y evidencias fotográficas alojados en este portal constituyen información técnica confidencial y propiedad intelectual protegida por la legislación colombiana.
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Custodia de Credenciales:</strong> El usuario es responsable de mantener la confidencialidad de su contraseña y de toda actividad realizada bajo su cuenta. Queda prohibido compartir credenciales con terceros no autorizados.
              </li>
              <li>
                <strong>Auditoría Técnica:</strong> Por razones de seguridad informática y trazabilidad, el sistema registra marcas de tiempo de conexión y actividad dentro del portal.
              </li>
            </ul>
          </section>

          <section className="space-y-2.5 text-sm leading-relaxed text-slate-600">
            <h2 className="text-base font-bold text-slate-900">
              4. Limitación de Responsabilidad (Disclaimers)
            </h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Carácter Informativo del Avance:</strong> Los indicadores porcentuales, cronogramas estimados y registros fotográficos mostrados en el portal tienen carácter informativo y de seguimiento operativo. Para efectos legales, financieros o de liquidación contractual prevalecerán las actas físicas o digitales debidamente suscritas por las partes.
              </li>
              <li>
                <strong>Disponibilidad del Servicio:</strong> EnergyProyec implementa medidas técnicas de cifrado y control de acceso para proteger la integridad de los archivos; no obstante, no garantiza la disponibilidad ininterrumpida del portal ante mantenimientos programados, fallas de telecomunicaciones o eventos de fuerza mayor atribuibles a terceros proveedores de infraestructura en la nube.
              </li>
            </ul>
          </section>

          <section className="space-y-2.5 text-sm leading-relaxed text-slate-600 pt-2 border-t border-slate-100">
            <h2 className="text-base font-bold text-slate-900">5. Legislación Aplicable y Contacto</h2>
            <p>
              Estos términos se rigen íntegramente por las leyes de la República de Colombia. Para consultas, peticiones o reclamos relacionados con el portal o el tratamiento de datos personales, puede comunicarse con nuestra área de ingeniería y cumplimiento en <strong>Barranquilla, Atlántico</strong>, al correo <strong>ingenieria@energyproyec.com</strong>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
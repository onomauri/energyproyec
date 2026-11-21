import Link from "next/link";
import {
  Zap,
  ShieldCheck,
  Wrench,
  Activity,
  ArrowRight,
  Phone,
  MapPin,
  Mail,
  Gauge,
  Cpu,
  Radio,
  FileCheck2,
  Camera,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { ModalCotizacion } from "./ModalCotizacion";
import { PasarelaClientes } from "@/components/PasarelaClientes";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-red-600 selection:text-white">
      {/* Barra de Navegación Corporativa */}
      <header className="bg-[#0B192C]/95 backdrop-blur-md text-white sticky top-0 z-40 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-3">
          <a href="#inicio" className="flex items-center gap-2.5 sm:gap-3 group active:scale-95 transition-transform">
            <div className="bg-red-600 group-hover:bg-red-500 p-2 rounded-xl shrink-0 transition shadow-lg shadow-red-600/25">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-extrabold tracking-tight block leading-none">
                ELECTRO<span className="text-red-500">CARIBE</span>
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-400 tracking-widest uppercase">
                Ingeniería Eléctrica
              </span>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
            <a href="#inicio" className="relative py-1 hover:text-white transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-red-500 after:transition-all after:duration-300 hover:after:w-full active:scale-95">Inicio</a>
            <a href="#servicios" className="relative py-1 hover:text-white transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-red-500 after:transition-all after:duration-300 hover:after:w-full active:scale-95">Servicios</a>
            <a href="#portal-tech" className="relative py-1 hover:text-white transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-red-500 after:transition-all after:duration-300 hover:after:w-full active:scale-95">Tecnología y Obra</a>
            <a href="#contacto" className="relative py-1 hover:text-white transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-red-500 after:transition-all after:duration-300 hover:after:w-full active:scale-95">Contáctanos</a>
            <ModalCotizacion />
          </nav>

          <Link
            href="/clientes"
            className="bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2.5 rounded-xl transition flex items-center gap-1.5 sm:gap-2 shadow-lg shadow-red-600/25 shrink-0 active:scale-95 transform"
          >
            <span>Portal Clientes</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </Link>
        </div>

        {/* Sub-barra móvil */}
        <div className="md:hidden bg-slate-900/95 border-t border-slate-800 px-4 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-xs font-medium text-slate-300">
            <a href="#servicios" className="hover:text-white">Servicios</a>
            <a href="#portal-tech" className="hover:text-white">Seguimiento</a>
            <a href="#contacto" className="hover:text-white">Contacto</a>
          </div>
          <ModalCotizacion textoBoton="Cotizar" />
        </div>
      </header>

      {/* Pasarela infinita de empresas aliadas */}
      <PasarelaClientes />

      {/* Sección Hero con estética industrial */}
      <section
        id="inicio"
        className="relative overflow-hidden bg-[#0B192C] text-white py-20 md:py-28 px-6 border-b border-slate-800"
      >
        {/* Efectos visuales de fondo */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 animar-entrada">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-red-600/15 border border-red-500/30 text-red-400 text-xs font-semibold rounded-full uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              Alta y Media Tensión • Barranquilla y Región Caribe
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight">
              Potencia, seguridad y{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-400">
                ingeniería eléctrica
              </span>{" "}
              para la industria
            </h1>

            <p className="text-slate-300 text-lg leading-relaxed max-w-2xl">
              Diseño, montaje y mantenimiento de subestaciones hasta 34.5 kV, redes industriales y respaldo energético bajo certificación RETIE, con supervisión digital de obra en tiempo real.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <ModalCotizacion textoBoton="Solicitar Cotización Técnica" />
              <Link
                href="/clientes"
                className="bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-semibold px-6 py-3 rounded-xl border border-slate-700 transition flex items-center gap-2 text-sm active:scale-95 transform"
              >
                Seguimiento de Obra <ArrowRight className="w-4 h-4 text-red-500" />
              </Link>
            </div>

            {/* Indicadores rápidos */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 max-w-lg">
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">34.5 kV</p>
                <p className="text-xs text-slate-400">Capacidad Media Tensión</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-red-500">100%</p>
                <p className="text-xs text-slate-400">Normativa RETIE / NTC</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">24/7</p>
                <p className="text-xs text-slate-400">Soporte Industrial Caribe</p>
              </div>
            </div>
          </div>

          {/* Tarjeta lateral de respaldo técnico */}
          <div className="lg:col-span-5 bg-slate-900/85 backdrop-blur-md border border-slate-800 p-7 sm:p-8 rounded-3xl shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Respaldo Técnico Certificado</h3>
                <p className="text-xs text-slate-400">Estándares de calidad e ingeniería</p>
              </div>
              <div className="bg-red-600/20 text-red-400 p-2.5 rounded-xl">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>

            <div className="space-y-4 text-sm text-slate-300">
              <div className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/70">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Cumplimiento Normativo</p>
                  <p className="text-xs text-slate-400 mt-0.5">Ejecución rigurosa bajo RETIE, NTC 2050, IEEE y estándares de operadores de red.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/70">
                <Activity className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Trazabilidad en Tiempo Real</p>
                  <p className="text-xs text-slate-400 mt-0.5">Avance porcentual, bitácora de ingeniería y evidencias fotográficas en vivo.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/70">
                <Wrench className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Respuesta Inmediata</p>
                  <p className="text-xs text-slate-400 mt-0.5">Cuadrillas especializadas en Barranquilla, Cartagena, Santa Marta y corredores industriales.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Sección Servicios Especializados */}
      <section id="servicios" className="py-20 md:py-24 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-red-600 uppercase tracking-widest">Portafolio de Ingeniería</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
            Soluciones Eléctricas de Alta Confiabilidad
          </h2>
          <p className="text-slate-600 mt-3 text-base">
            Acompañamos cada etapa de tu infraestructura energética, desde el diseño conceptual hasta el mantenimiento predictivo.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {[
            {
              icon: Zap,
              titulo: "Subestaciones Eléctricas",
              desc: "Montaje, mantenimiento preventivo, filtrado de aceite y pruebas dieléctricas a transformadores hasta 34.5 kV.",
            },
            {
              icon: Cpu,
              titulo: "Redes de Media y Baja Tensión",
              desc: "Construcción de líneas aéreas y subterráneas, celdas de media tensión, tableros generales y bancos de condensadores.",
            },
            {
              icon: Gauge,
              titulo: "Diagnóstico y Termografía",
              desc: "Inspección termográfica infrarroja, análisis de calidad de energía, estudios de cortocircuito y coordinación de protecciones.",
            },
            {
              icon: Radio,
              titulo: "Puesta a Tierra y Apantallamiento",
              desc: "Diseño, medición telurométrica y construcción de mallas de puesta a tierra y sistemas de protección contra rayos (SIPRA).",
            },
            {
              icon: Clock,
              titulo: "Respaldo Energético y UPS",
              desc: "Instalación y automatización de plantas eléctricas de emergencia, transferencias automáticas (ATS) y sistemas UPS industriales.",
            },
            {
              icon: FileCheck2,
              titulo: "Certificación y Trámites RETIE",
              desc: "Acompañamiento técnico, memorias de cálculo, planos as-built y gestión ante organismos de inspección acreditados.",
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="group bg-white p-8 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-red-500/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 bg-[#0B192C] group-hover:bg-red-600 text-red-500 group-hover:text-white rounded-xl flex items-center justify-center mb-6 transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2.5">{item.titulo}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center text-xs font-semibold text-red-600">
                  <span>Servicio certificado RETIE</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      {/* Sección Diferencial: Portal de Seguimiento en Tiempo Real */}
      <section id="portal-tech" className="bg-slate-900 text-white py-20 px-6 border-y border-slate-800">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="inline-block px-3 py-1 bg-red-600/20 text-red-400 text-xs font-bold rounded-full uppercase tracking-wider">
              Innovación y Transparencia
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
              Supervisa tu proyecto en vivo desde nuestro <span className="text-red-500">Portal de Clientes</span>
            </h2>
            <p className="text-slate-300 text-base leading-relaxed">
              Eliminamos la incertidumbre en la ejecución de obras. Cada cliente de ElectroCaribe recibe credenciales privadas para auditar el progreso de su proyecto desde cualquier lugar.
            </p>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-center gap-3">
                <Camera className="w-5 h-5 text-red-500 shrink-0" />
                <span>Registro fotográfico diario sincronizado automáticamente en la nube.</span>
              </li>
              <li className="flex items-center gap-3">
                <FileCheck2 className="w-5 h-5 text-red-500 shrink-0" />
                <span>Descarga directa y segura de protocolos de prueba, informes y planos.</span>
              </li>
              <li className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-red-500 shrink-0" />
                <span>Indicador porcentual de fases completadas y bitácora de ingeniería.</span>
              </li>
            </ul>
            <div className="pt-2">
              <Link
                href="/clientes"
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3.5 rounded-xl transition shadow-lg shadow-red-600/25 text-sm active:scale-95 transform"
              >
                Ingresar al Portal de Clientes <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="bg-[#0B192C] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>
              <span className="text-xs text-slate-400 font-mono">electrocaribe.duckdns.org/clientes</span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full">
                  En ejecución • Subestación 13.8 kV
                </span>
                <span className="text-sm font-bold text-red-500">78% Avance</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                <div className="w-[78%] h-full bg-gradient-to-r from-red-700 to-red-500 rounded-full" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
                <p className="text-slate-400">Evidencias en Vivo</p>
                <p className="text-base font-bold text-white mt-1">Galería por Fecha</p>
              </div>
              <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
                <p className="text-slate-400">Documentación</p>
                <p className="text-base font-bold text-white mt-1">Planos y RETIE</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Banner de Contacto y Emergencias */}
      <section className="py-16 px-6 max-w-7xl mx-auto w-full">
        <div className="bg-gradient-to-r from-[#0B192C] to-slate-900 rounded-3xl p-8 sm:p-12 text-white flex flex-col lg:flex-row items-center justify-between gap-8 border border-slate-800 shadow-xl">
          <div className="space-y-2 text-center lg:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold">¿Tienes un proyecto eléctrico o emergencia industrial?</h3>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl">
              Nuestro equipo de ingenieros está listo para realizar visitas técnicas y estructurar propuestas a la medida de tu operación.
            </p>
          </div>
          <div className="shrink-0">
            <ModalCotizacion textoBoton="Cotizar Proyecto Ahora" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contacto" className="bg-[#0B192C] text-slate-400 py-14 px-6 mt-auto border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 text-sm">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-white font-extrabold text-base">
              <div className="bg-red-600 p-1.5 rounded-lg">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span>ELECTROCARIBE INGENIERÍA ELÉCTRICA S.A.S.</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Soluciones integrales en alta, media y baja tensión para el sector industrial, comercial y energético en toda la Región Caribe.
            </p>
          </div>

          <div className="space-y-2.5">
            <p className="text-white font-bold text-xs uppercase tracking-wider">Contacto Directo</p>
            <p className="flex items-center gap-2 text-xs">
              <MapPin className="w-4 h-4 text-red-500 shrink-0" /> Barranquilla, Atlántico — Colombia
            </p>
            <p className="flex items-center gap-2 text-xs">
              <Phone className="w-4 h-4 text-red-500 shrink-0" /> +57 (605) 300 0000 • Línea 24/7
            </p>
            <p className="flex items-center gap-2 text-xs">
              <Mail className="w-4 h-4 text-red-500 shrink-0" /> ingenieria@electrocaribe.com
            </p>
          </div>

          <div className="space-y-2.5 md:text-right">
            <p className="text-white font-bold text-xs uppercase tracking-wider">Accesos Rápidos</p>
            <div className="flex flex-col md:items-end gap-1.5 text-xs">
              <a href="#servicios" className="relative py-1 hover:text-white transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-red-500 after:transition-all after:duration-300 hover:after:w-full active:scale-95">Portafolio de Servicios</a>
              <a href="#portal-tech" className="relative py-1 hover:text-white transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-red-500 after:transition-all after:duration-300 hover:after:w-full active:scale-95">Tecnología de Seguimiento</a>
              <Link href="/clientes" className="text-red-400 hover:text-red-300 font-semibold transition">
                Ingreso Portal de Clientes →</Link>
              <Link href="/terminos-y-condiciones" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Términos y Tratamiento de Datos
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Phone,
  MapPin,
  Mail,
  FileCheck2,
  Camera,
} from "lucide-react";
import { PasarelaClientes } from "@/components/PasarelaClientes";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import { EfectosHeader } from "@/components/EfectosHeader";
import Servicios from "@/components/Servicios";
import Metricas from "@/components/Metricas";
import Proyectos from "@/components/Proyectos";
import Contacto from "@/components/Contacto";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-red-600 selection:text-white">
      {/* Header: transparente sobre el hero, blanco al hacer scroll */}
      <EfectosHeader />
      <Header />

      {/* Hero (el nav se funde con él) con la pasarela de empresas aliadas justo debajo del nav */}
      <Hero>
        <PasarelaClientes />
      </Hero>

      {/* Servicios (con imágenes) */}
      <Servicios />

      {/* Cifras de la empresa (franja roja con contadores) */}
      <Metricas />

      {/* Proyectos ejecutados */}
      <Proyectos />
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
              Eliminamos la incertidumbre en la ejecución de obras. Cada cliente de EnergyProyec recibe credenciales privadas para auditar el progreso de su proyecto desde cualquier lugar.
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
              <span className="text-xs text-slate-400 font-mono">energyproyec.com/clientes</span>
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

      {/* Contacto y solicitud de cotización */}
      <Contacto />

      {/* Footer */}
      <footer id="footer" className="bg-white text-slate-600 py-14 px-6 mt-auto border-t border-slate-200">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 text-sm">
          <div className="space-y-3">
            <a href="#inicio" aria-label="Energy Proyec - Inicio" className="inline-block">
              <img
                src="/images/logo-energyproyec.png"
                alt="Energy Proyec"
                className="h-20 sm:h-24 w-auto"
              />
            </a>
            <p className="text-sm text-slate-600 leading-relaxed max-w-md">
              Soluciones integrales en alta, media y baja tensión para el sector industrial, comercial y energético en toda la Región Caribe.
            </p>
          </div>

          <div className="space-y-2.5">
            <p className="text-slate-900 font-bold text-xs uppercase tracking-wider">Contacto Directo</p>
            <p className="flex items-center gap-2 text-xs">
              <MapPin className="w-4 h-4 text-red-600 shrink-0" /> Barranquilla, Atlántico — Colombia
            </p>
            <p className="flex items-center gap-2 text-xs">
              <Phone className="w-4 h-4 text-red-600 shrink-0" /> +57 300 606 0276 • Línea 24/7
            </p>
            <p className="flex items-center gap-2 text-xs">
              <Mail className="w-4 h-4 text-red-600 shrink-0" /> ingenieria@energyproyec.com
            </p>
          </div>

          <div className="space-y-2.5 md:text-right">
            <p className="text-slate-900 font-bold text-xs uppercase tracking-wider">Accesos Rápidos</p>
            <div className="flex flex-col md:items-end gap-1.5 text-xs">
              <a href="#servicios" className="relative py-1 hover:text-slate-900 transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-red-500 after:transition-all after:duration-300 hover:after:w-full active:scale-95">Portafolio de Servicios</a>
              <a href="#proyectos" className="relative py-1 hover:text-slate-900 transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-red-500 after:transition-all after:duration-300 hover:after:w-full active:scale-95">Proyectos Ejecutados</a>
              <a href="#portal-tech" className="relative py-1 hover:text-slate-900 transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-red-500 after:transition-all after:duration-300 hover:after:w-full active:scale-95">Tecnología de Seguimiento</a>
              <Link href="/clientes" className="text-red-600 hover:text-red-700 font-semibold transition">
                Ingreso Portal de Clientes →</Link>
              <Link href="/terminos-y-condiciones" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition">Términos y Tratamiento de Datos
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
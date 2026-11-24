import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ModalCotizacion } from "@/app/ModalCotizacion";

const enlaces = [
  { href: "#inicio", seccion: "inicio", texto: "Inicio" },
  { href: "#servicios", seccion: "servicios", texto: "Servicios" },
  { href: "#proyectos", seccion: "proyectos", texto: "Proyectos" },
  { href: "#portal-tech", seccion: "portal-tech", texto: "Tecnología y Obra" },
  { href: "#contacto", seccion: "contacto", texto: "Contáctanos" },
];

// Los colores salen de variables (--nav-*) que cambian solas cuando el header
// pasa de transparente (arriba, sobre el hero) a blanco (al hacer scroll).
const claseEnlace =
  "relative py-1 text-(color:--nav-fg) hover:text-(color:--nav-fg-hover) data-[activo=true]:text-(color:--nav-fg-hover) transition-colors " +
  "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-red-500 after:transition-all after:duration-300 " +
  "hover:after:w-full data-[activo=true]:after:w-full active:scale-95";

export default function Header() {
  return (
    <header
      id="site-header"
      className={
        "group fixed top-0 inset-x-0 z-50 " +
        // Arriba: sobre el hero (letras claras)
        "[--nav-fg:rgba(255,255,255,0.88)] [--nav-fg-hover:#ffffff] [--nav-border:rgba(255,255,255,0.45)] [--nav-hover-bg:rgba(255,255,255,0.12)] [--nav-accent:#f87171] " +
        // Al bajar: fondo blanco (letras oscuras)
        "data-[scrolled=true]:[--nav-fg:#475569] data-[scrolled=true]:[--nav-fg-hover:#0f172a] data-[scrolled=true]:[--nav-border:#cbd5e1] data-[scrolled=true]:[--nav-hover-bg:#f1f5f9] data-[scrolled=true]:[--nav-accent:#dc2626]"
      }
    >
      {/* Fondo: degradado suave sobre el hero (arriba) → blanco con sombra (al bajar) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none bg-linear-to-b from-[#0B192C]/75 via-[#0B192C]/35 to-transparent transition-opacity duration-300 group-data-[scrolled=true]:opacity-0"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none bg-white opacity-0 shadow-[0_12px_32px_-6px_rgba(15,23,42,0.22)] transition-opacity duration-300 group-data-[scrolled=true]:opacity-100"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 h-20 sm:h-24 flex items-center justify-between gap-3">
        {/* Logo (PNG con fondo transparente: se funde con el hero y con el nav blanco) */}
        <a
          href="#inicio"
          aria-label="Energy Proyec - Inicio"
          className="shrink-0 block active:scale-95 transition-transform"
        >
          <img
            src="/images/logo-energyproyec.png"
            alt="Energy Proyec"
            className="h-12 sm:h-16 w-auto"
          />
        </a>

        <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-sm font-medium whitespace-nowrap">
          {enlaces.map((e) => (
            <a key={e.seccion} href={e.href} data-seccion={e.seccion} className={claseEnlace}>
              {e.texto}
            </a>
          ))}
          <ModalCotizacion variante="navegacion" />
        </nav>

        <Link
          href="/clientes"
          className="bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2.5 rounded-xl transition flex items-center gap-1.5 sm:gap-2 shadow-lg shadow-red-600/25 shrink-0 whitespace-nowrap"
        >
          <span>Portal Clientes</span>
          <ArrowRight className="w-4 h-4 shrink-0" />
        </Link>
      </div>

      {/* Sub-barra móvil */}
      <div className="relative lg:hidden border-t border-(color:--nav-border) px-4 py-2.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-4 text-xs font-medium text-(color:--nav-fg)">
          {[enlaces[1], enlaces[2], enlaces[4]].map((e) => (
            <a
              key={e.seccion}
              href={e.href}
              data-seccion={e.seccion}
              className="hover:text-(color:--nav-fg-hover) data-[activo=true]:text-(color:--nav-accent) data-[activo=true]:font-semibold"
            >
              {e.texto === "Contáctanos" ? "Contacto" : e.texto}
            </a>
          ))}
        </div>
        <ModalCotizacion textoBoton="Cotizar" variante="navegacion" />
      </div>
    </header>
  );
}
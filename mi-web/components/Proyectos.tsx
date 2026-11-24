"use client";

import { motion } from "framer-motion";
import {
  Building2,
  MapPin,
  Calendar,
  ChevronRight,
  ExternalLink,
  ChevronLeft,
  X,
  Building,
  Info
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";

interface Project {
  id: number;
  title: string;
  location: string;
  date: string;
  description: string;
  image: string;
  category: string;
  gallery: string[];
  longDescription: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "LATAMKS",
    location: "Planta de Producción Metalmecánica",
    date: "2023",
    description: "Subestación 500kVA trafo Aceite 34500/440v, Instalaciones eléctricas planta de producción Metalmecanica.",
    image: "/detalle-proyectos/proyecto1/detalle1.jpg", // Replace with real images if available or keep placeholders
    category: "Subestaciones",
    gallery: ["/detalle-proyectos/proyecto1/detalle1.jpg", "/detalle-proyectos/proyecto1/detalle2.jpg"],
    longDescription: "Diseño integral y montaje electromecánico de subestación de 500kVA. El proyecto incluyó el suministro e instalación de transformador en aceite, celdas de media tensión y toda la infraestructura eléctrica para la planta de producción metalmecánica LATAMKS. Se garantizó el cumplimiento de la normativa RETIE y la aprobación del operador de red local.",
  },
  {
    id: 2,
    title: "ECOALLOYS",
    location: "Fundición Aluminio",
    date: "2023",
    description: "Subestación Padmounted 2000kVA trafo Aceite 34500/440v, Instalaciones eléctricas planta de Fundición aluminio.",
    image: "/detalle-proyectos/proyecto2/detalle1.jpg",
    category: "Industrial",
    gallery: ["/detalle-proyectos/proyecto2/detalle1.jpg", "/detalle-proyectos/proyecto2/detalle2.jpg"],
    longDescription: "Implementación de subestación tipo Padmounted de 2000kVA para la planta de fundición de aluminio ECOALLOYS. El alcance comprendió desde el diseño eléctrico básico y de detalle hasta las pruebas finales de energización. Se instalaron equipos de última tecnología para optimizar el consumo energético de la planta industrial.",
  },
  {
    id: 3,
    title: "FOTOPROMOCION-GARSITE",
    location: "Planta de Producción Metalmecánica",
    date: "2022",
    description: "Subestación Patmounted 1000kVA 34500/440v, Instalaciones eléctricas planta de producción Metalmecanica.",
    image: "/detalle-proyectos/proyecto3/detalle1.jpg",
    category: "Redes MT",
    gallery: ["/detalle-proyectos/proyecto3/detalle1.jpg", "/detalle-proyectos/proyecto3/detalle2.jpg"],
    longDescription: "Diseño y construcción de red de media tensión de 34.5kV para la planta FOTOPROMOCION-GARSITE. El proyecto incluyó la postería, el tendido de conductores y el montaje de un transformador tipo Padmounted de 1000kVA.",
  },
  {
    id: 4,
    title: "FOTOPROMOCION-LOTE 11D",
    location: "Bodega para Alquiler",
    date: "2022",
    description: "Subestación Patmounted 1000kVA 34.5KV BODEGA PARA ALQUILER.",
    image: "/detalle-proyectos/proyecto4/detalle1.jpg",
    category: "Subestaciones",
    gallery: ["/detalle-proyectos/proyecto4/detalle1.jpg", "/detalle-proyectos/proyecto4/detalle2.jpg"],
    longDescription: "Montaje de subestación tipo Padmounted de 1000kVA a 34.5kV para bodegas industriales en el Lote 11D. Se realizaron obras civiles, puesta a tierra y pruebas de aislamiento para garantizar la seguridad de la instalación.",
  },
  {
    id: 5,
    title: "CERAMICAS Y MATERIALES CASTELLON (AMPLIACION)",
    location: "Planta de Productos Cerámicos",
    date: "2021",
    description: "Subestación Patmounted 3500kVA 34.5KV planta de productos cerámica.",
    image: "/detalle-proyectos/proyecto5/detalle1.jpg",
    category: "Industrial",
    gallery: ["/detalle-proyectos/proyecto5/detalle1.jpg", "/detalle-proyectos/proyecto5/detalle2.jpg"],
    longDescription: "Proyecto de ampliación de la capacidad eléctrica para la planta de CERAMICAS Y MATERIALES CASTELLON. Se instaló una subestación Padmounted de 3500kVA para soportar la nueva línea de producción automatizada.",
  },
  {
    id: 6,
    title: "CERAMICAS Y MATERIALES CASTELLON",
    location: "Planta de Productos Cerámicos",
    date: "2020",
    description: "Subestación Patmounted 4500kVA 34.5KV planta de productos cerámica.",
    image: "/detalle-proyectos/proyecto6/detalle1.jpg",
    category: "Industrial",
    gallery: ["/detalle-proyectos/proyecto6/detalle1.jpg", "/detalle-proyectos/proyecto6/detalle2.jpg"],
    longDescription: "Implementación inicial de la infraestructura eléctrica principal para CASTELLON. Instalación de subestación de 4500kVA, una de las más grandes de la zona franca, con sistemas de protección avanzados.",
  },
  {
    id: 7,
    title: "FRUSELVA",
    location: "Planta de Producción de Alimentos",
    date: "2021",
    description: "Subestación 300kVA trafo Aceite 34500/440v, Instalaciones eléctricas planta de producción de alimentos",
    image: "/detalle-proyectos/proyecto7/detalle1.png",
    category: "Subestaciones",
    gallery: ["/detalle-proyectos/proyecto7/detalle1.png", "/detalle-proyectos/proyecto7/detalle2.png", "/detalle-proyectos/proyecto7/detalle3.png"],
    longDescription: "Diseño y montaje de subestación de 300kVA con transformador en aceite para la planta de FRUSELVA. Se optimizaron las instalaciones eléctricas para procesos de procesamiento de alimentos bajo normas sanitarias.",
  },
  {
    id: 8,
    title: "FRUSELVA (AMPLIACION)",
    location: "Planta de Producción de Alimentos",
    date: "2020",
    description: "Subestación 300kVA trafo Aceite 34500/440v , Instalaciones eléctricas planta de producción de alimentos",
    image: "/projects/project8.png",
    category: "Subestaciones",
    gallery: ["/detalle-proyectos/proyecto8/detalle1.png", "/detalle-proyectos/proyecto8/detalle2.png"],
    longDescription: "Segunda fase de expansión eléctrica para FRUSELVA. Se instaló un transformador adicional de 300kVA y se reforzó la red de distribución interna para las nuevas cámaras frigoríficas.",
  },
  {
    id: 9,
    title: "PERALTA PERFILERIA-ZILOG",
    location: "Planta de Producción Industrial Galvanizados",
    date: "2020",
    description: "Subestación tipo poste trafo 112,5kVA aceite 13200/220v , planta producción industrial galvanizados",
    image: "/projects/project9.png",
    category: "Subestaciones",
    gallery: ["/projects/project9.png", "/detalle-proyectos/proyecto9/detalle2.png"],
    longDescription: "Subestación tipo poste de 112.5kVA para la planta ZILOG. Una solución ágil y eficiente para alimentación en baja tensión de maquinaria de galvanizado industrial.",
  },
  {
    id: 10,
    title: "PERALTA PERFILERIA- ZF CAYENA",
    location: "Planta de Producción Industrial Galvanizados",
    date: "2020",
    description: "Subestación Padmounted 1250kVA aceite 13200/220v , planta producción industrial galvanizados",
    image: "/projects/project10.png",
    category: "Subestaciones",
    gallery: ["/projects/project10.png", "/detalle-proyectos/proyecto10/detalle2.png"],
    longDescription: "Montaje de subestación Padmounted de 1250kVA en la Zona Franca Cayena. Incluyó la integración con el sistema de medición del operador de red y protecciones en media tensión.",
  },
  {
    id: 11,
    title: "NATIVOFOODS",
    location: "Planta de Producción de Alimentos",
    date: "2020",
    description: "Subestación 1500kVA trafo seco F 34500/440v Instalaciones eléctricas planta de producción de alimentos",
    image: "/projects/project11.png",
    category: "Subestaciones",
    gallery: ["/projects/project11.png", "/projects/project3.png"],
    longDescription: "Instalación de transformador seco de 1500kVA para NATIVOFOODS. Elección tecnológica basada en seguridad contra incendios para planta de procesamiento de alimentos masivo.",
  },
  {
    id: 12,
    title: "PANAM L&E SAS",
    location: "Planta de Producción Industrial de Cables",
    date: "2020",
    description: "Subestación Patmounted 500kVA trafo aceite 34500/440v , planta producción industrial de cables",
    image: "/projects/project12.png",
    category: "Industrial",
    gallery: ["/projects/project12.png", "/projects/project1.png"],
    longDescription: "Subestación y redes para PANAM L&E. Se diseñó un sistema de distribución para alta demanda de corriente en la fabricación de cables industriales de cobre.",
  },
  {
    id: 13,
    title: "SUN ACE PQ",
    location: "Planta de Productos Químicos",
    date: "2020",
    description: "Subestación 1250kVA trafo seco F 34500/440v , planta de productos Químicos",
    image: "/projects/project13.png",
    category: "Subestaciones",
    gallery: ["/projects/project13.png", "/projects/project4.png"],
    longDescription: "Implementación de transformador seco de 1250kVA para planta química SUN ACE. Diseño enfocado en ambientes corrosivos y alta confiabilidad de suministro.",
  },
  {
    id: 14,
    title: "BANAPOL DEL CARIBE",
    location: "Planta de Producción Industrial de Plásticos",
    date: "2020",
    description: "Subestación Patmounted 225kVA trafo aceite 34500/440v , planta producción industrial plásticos",
    image: "/projects/project14.png",
    category: "Industrial",
    gallery: ["/projects/project14.png", "/projects/project5.png"],
    longDescription: "Montaje eléctrico para BANAPOL. Subestación de 225kVA y redes de distribución para inyectoras de plástico de alta capacidad.",
  },
  {
    id: 15,
    title: "INMED",
    location: "Planta de Producción de Productos Médicos",
    date: "2020",
    description: "Subestación Patmounted 225kVA 34500/440v , planta producción industrial productos medicos",
    image: "/projects/project15.png",
    category: "Industrial",
    gallery: ["/projects/project15.png", "/projects/project8.png"],
    longDescription: "Infraestructura eléctrica para planta INMED. Instalación de subestación certificada para ambientes controlados de producción médica.",
  },
  {
    id: 16,
    title: "BANCO GENERAL",
    location: "Urbanismo lotes en zona franca la cayena",
    date: "2020",
    description: "RED SUBTERRANEAS MEDIA TENSION 34.5KV , Urbanismo lotes en zona franca la cayena",
    image: "/projects/project16.png",
    category: "Redes MT",
    gallery: ["/projects/project16.png", "/projects/project3.png"],
    longDescription: "Construcción de redes subterráneas de media tensión a 34.5kV para la urbanización industrial de Zona Franca La Cayena bajo estándares de Banco General.",
  },
  {
    id: 17,
    title: "S´TORIA D AMORE",
    location: "Restaurante comida italiana",
    date: "2020",
    description: "Subestación trafo Seco H 300kVA restaurante comida italiana",
    image: "/projects/project17.png",
    category: "Subestaciones",
    gallery: ["/projects/project17.png", "/projects/project7.png"],
    longDescription: "Instalación de transformador seco de 300kVA para el reconocido restaurante S´TORIA D AMORE. Diseño estético y funcional integrado a la arquitectura comercial.",
  },
  {
    id: 18,
    title: "Lote 19ª bodega 3 y 4",
    location: "Bodega para alquiler",
    date: "2020",
    description: "Subestación Patmounted 150kVA 34500/440v , bodega para alquiler",
    image: "/projects/project18.png",
    category: "Subestaciones",
    gallery: ["/projects/project18.png", "/projects/project4.png"],
    longDescription: "Abastecimiento eléctrico para bodegas 3 y 4 del Lote 19A. Subestación Padmounted de 150kVA redundante para flexibilidad de inquilinos.",
  },
  {
    id: 19,
    title: "ZONA FRANCA LA CAYENA",
    location: "Parque Industrial",
    date: "2020",
    description: "Cambio de celdas media tensión 34.5KV , redes MT parque industrial",
    image: "/projects/project19.png",
    category: "Industrial",
    gallery: ["/projects/project19.png", "/detalle-proyectos/proyecto19/detalle2.png"],
    longDescription: "Mantenimiento mayor y modernización de celdas de media tensión 34.5kV en el Parque Industrial ZF Cayena para asegurar la continuidad del servicio.",
  },
];

export default function Proyectos() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(3);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleItems(1);
      } else if (window.innerWidth < 1024) {
        setVisibleItems(2);
      } else {
        setVisibleItems(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  useEffect(() => {
    if (selectedProject) {
      setActiveImage(selectedProject.image);
    }
  }, [selectedProject]);

  const nextProject = () => {
    if (currentIndex < projects.length - visibleItems) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const prevProject = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const nextImage = () => {
    if (!selectedProject) return;

    const images = selectedProject.gallery;
    const index = images.indexOf(activeImage || images[0]);
    const nextIndex = (index + 1) % images.length;

    setActiveImage(images[nextIndex]);
  };

  const prevImage = () => {
    if (!selectedProject) return;

    const images = selectedProject.gallery;
    const index = images.indexOf(activeImage || images[0]);
    const prevIndex = (index - 1 + images.length) % images.length;

    setActiveImage(images[prevIndex]);
  };


  return (
    <section id="proyectos" className="relative pt-16 pb-24 sm:pt-24 sm:pb-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-50/50 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-50/50 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-4"
          >
            Proyectos <span className="text-red-500">Ejecutados</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 leading-relaxed"
          >
            Nuestra trayectoria se refleja en cada obra completada. Soluciones robustas y eficientes para el sector industrial.
          </motion.p>
        </div>

        {/* Projects Carousel Container */}
        <div className="relative group/carousel">
          {/* Navigation Arrows */}
          <button
            onClick={prevProject}
            className={`absolute -left-4 sm:-left-12 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white shadow-xl border border-slate-100 text-slate-400 hover:text-red-600 hover:scale-110 transition-all duration-300 hidden sm:flex items-center justify-center ${currentIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-100'}`}
            disabled={currentIndex === 0}
            aria-label="Proyecto anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextProject}
            className={`absolute -right-4 sm:-right-12 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white shadow-xl border-0 border-slate-100 text-slate-400 hover:text-red-600 hover:scale-110 transition-all duration-300 hidden sm:flex items-center justify-center ${currentIndex >= projects.length - visibleItems ? 'opacity-30 cursor-not-allowed' : 'opacity-100'}`}
            disabled={currentIndex >= projects.length - visibleItems}
            aria-label="Siguiente proyecto"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Carousel Viewport */}
          <div className="overflow-hidden px-2 py-4">
            <motion.div
              animate={{ x: `-${currentIndex * (100 / visibleItems)}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex"
            >
              {projects.map((project) => (
                <div
                  key={project.id}
                  className={`flex-none px-4`}
                  style={{ width: `${100 / visibleItems}%` }}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    onClick={() => setSelectedProject(project)}
                    className="group cursor-pointer bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-xl transition-all duration-500 h-full flex flex-col"
                  >
                    {/* Project Image */}
                    <div className="relative h-64 overflow-hidden flex-shrink-0">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        priority
                      />

                      <div className="absolute inset-0 bg-gradient-to-br from-slate-800/40 to-slate-900/60 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white scale-75 group-hover:scale-100 transition-transform duration-500">
                          <ExternalLink className="w-6 h-6" />
                        </div>
                      </div>

                      {/* Project Category Badge */}
                      <div className="absolute top-4 left-4 z-20">
                        <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest text-red-600 shadow-sm">
                          {project.category}
                        </span>
                      </div>
                    </div>

                    {/* Project Details */}
                    <div className="p-8 flex flex-col flex-grow">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-red-600 transition-colors duration-300 leading-tight">
                          {project.title}
                        </h3>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                          <MapPin className="w-4 h-4 text-red-400 flex-shrink-0" />
                          <span className="line-clamp-1">{project.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                          <Calendar className="w-4 h-4 text-red-400 flex-shrink-0" />
                          <span>{project.date}</span>
                        </div>
                      </div>

                      <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 mb-auto">
                        {project.description}
                      </p>

                      <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ver Detalles</span>
                        <div className="p-2 rounded-full bg-slate-50 text-slate-400 group-hover:bg-red-50 group-hover:text-red-600 transition-colors duration-300">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-12">
            {Array.from({ length: projects.length - visibleItems + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${currentIndex === i ? 'bg-red-500 w-8' : 'bg-slate-200 hover:bg-slate-300'}`}
                aria-label={`Ir al slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Bottom Call to Action or Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-20 text-center"
        >
          <p className="text-slate-500 italic">
            Y más de 50 proyectos adicionales completados con éxito...
          </p>
        </motion.div>
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-[95vw] md:w-full max-w-5xl md:h-[600px] lg:h-[650px] max-h-[90vh] bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 p-2 sm:p-3 rounded-full bg-white shadow-md border border-slate-100/50 text-slate-600 hover:text-red-600 hover:bg-slate-50 transition-all duration-300 group"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Left: Project Gallery */}
              <div className="relative w-full md:w-1/2 h-[35vh] sm:h-[40vh] md:h-full bg-slate-900 flex-shrink-0">
                <div className="absolute inset-0 group/gallery pointer-events-auto">
                        <Image
                          src={activeImage || selectedProject.image}
                          alt={selectedProject.title}
                          fill
                          quality={100}
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          priority

                        />

                        {/* Flecha izquierda */}
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-red-500 transition z-20"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>

                        {/* Flecha derecha */}
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-red-500 transition z-20"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

                        <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 flex gap-3 overflow-x-auto pb-2 scrollbar-hide z-20">
                          {selectedProject.gallery.map((img, i) => (
                            <div
                              key={i}
                              onClick={() => setActiveImage(img)}
                              className={`flex-none w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 cursor-pointer transition-all duration-300
                                                        ${activeImage === img ? "border-red-500 scale-105 shadow-md" : "border-white/50 hover:border-white"}
                                                        `}
                            >
                              <div
                                className="w-full h-full bg-cover bg-center"
                                style={{ backgroundImage: `url(${img})` }}
                              />
                            </div>
                          ))}
                        </div>
                </div>
              </div>

              {/* Right: Project Info */}
              <div className="w-full md:w-1/2 p-6 sm:p-8 lg:p-12 flex flex-col overflow-y-auto custom-scrollbar bg-white">
                <div className="mb-6 sm:mb-8">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 rounded-full bg-red-50 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-red-600 border border-red-100">
                          {selectedProject.category}
                        </span>
                      </div>
                      <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight mb-4">
                        {selectedProject.title}
                      </h2>

                      <div className="grid grid-cols-2 gap-6 py-6 border-y border-slate-100">
                        <div className="space-y-1">
                          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Ubicación</p>
                          <div className="flex items-center gap-2 text-slate-700 font-medium">
                            <MapPin className="w-4 h-4 text-red-500" />
                            <span>{selectedProject.location}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Año</p>
                          <div className="flex items-center gap-2 text-slate-700 font-medium">
                            <Calendar className="w-4 h-4 text-red-500" />
                            <span>{selectedProject.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 p-2 rounded-lg bg-sky-50 text-sky-600">
                          <Info className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 mb-2">Descripción del Proyecto</h4>
                          <p className="text-slate-600 text-sm leading-relaxed">
                            {selectedProject.longDescription}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="mt-1 p-2 rounded-lg bg-green-50 text-green-600">
                          <Building className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 mb-2">Aspectos Técnicos</h4>
                          <p className="text-slate-600 text-sm leading-relaxed">
                            {selectedProject.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-4 sm:pt-10 mb-2">
                      <button
                        onClick={() => setSelectedProject(null)}
                        className="w-full py-4 rounded-xl sm:rounded-2xl bg-slate-900 text-white font-bold text-xs sm:text-sm hover:bg-red-600 transition-colors duration-300 shadow-md hover:shadow-lg"
                      >
                        Volver al Portafolio
                      </button>
                    </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
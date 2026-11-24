import Reveal from "./Reveal";

// 📷 Las imágenes van en public/images/ (servicio1.jpg ... servicio5.png)
const servicios = [
  {
    titulo: "Diseño Eléctrico",
    desc: "Diseños eléctricos, mantenimientos y malla de puesta a tierra.",
    img: "/images/servicio1.jpg",
  },
  {
    titulo: "Construcción",
    desc: "Construcción de subestaciones eléctricas y redes de media tensión.",
    img: "/images/servicio2.jpg",
  },
  {
    titulo: "Mantenimiento",
    desc: "Mantenimiento de proyectos y diseños en media tensión.",
    img: "/images/servicio3.jpg",
  },
  {
    titulo: "Instalaciones Industriales",
    desc: "Acometidas, tableros y montajes eléctricos para industria.",
    img: "/images/servicio4.png",
  },
  {
    titulo: "Diseño Especializado",
    desc: "Cálculos de carga, apantallamiento y diseño de redes.",
    img: "/images/servicio5.png",
  },
];

export default function Servicios() {
  return (
    <section id="servicios" className="py-20 md:py-24 px-6 max-w-7xl mx-auto w-full">
      <Reveal>
        <div className="flex items-center justify-center mb-12">
          <div className="hidden sm:block grow h-px bg-slate-300 max-w-[260px]" />
          <h2 className="mx-5 text-2xl sm:text-3xl font-extrabold text-[#0B192C] text-center">
            Nuestros Servicios
          </h2>
          <div className="hidden sm:block grow h-px bg-slate-300 max-w-[260px]" />
        </div>
      </Reveal>

      <div className="flex flex-wrap justify-center gap-6">
        {servicios.map((servicio, i) => (
          <Reveal key={servicio.titulo} delay={i * 100} className="w-full sm:w-[320px] lg:w-[350px] flex">
            <article className="group w-full bg-white rounded-xl overflow-hidden shadow-[0_5px_20px_rgba(0,0,0,0.06)] flex flex-col transition-transform duration-300 hover:-translate-y-1.5">
              <div className="h-52 overflow-hidden bg-slate-200">
                <div
                  className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url('${servicio.img}')` }}
                  role="img"
                  aria-label={servicio.titulo}
                />
              </div>
              <div className="relative bg-[#0B192C] text-white text-center px-5 py-7 grow border-t-2 border-red-600">
                <h3 className="text-lg font-semibold mb-2">{servicio.titulo}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{servicio.desc}</p>
                <div className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 bg-white/10" />
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

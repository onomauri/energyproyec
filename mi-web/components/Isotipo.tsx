/**
 * Isotipo de Energy Proyec dentro de un cuadro blanco estilizado.
 * La altura se controla con `className`; el cuadro siempre queda cuadrado:
 *   <Isotipo className="h-12 w-auto" />
 * Archivo de la imagen: public/images/isotipo-energyproyec.png
 */
export default function Isotipo({ className = "h-12 w-auto" }: { className?: string }) {
  return (
    <div
      className={`shrink-0 aspect-square bg-white rounded-[22%] flex items-center justify-center shadow-lg shadow-black/25 ring-1 ring-black/5 ${className}`}
    >
      {/* El margen se logra con el tamaño de la imagen (72 % del cuadro), no con padding en % */}
      <img
        src="/images/isotipo-energyproyec.png"
        alt="Energy Proyec"
        className="w-[72%] h-[72%] object-contain select-none"
        draggable={false}
      />
    </div>
  );
}
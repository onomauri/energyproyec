/**
 * Cuadro blanco estilizado con el isotipo de Energy Proyec.
 * Reemplaza al antiguo cuadro rojo con el rayito genérico.
 * El tamaño y las esquinas se controlan con `className`, por ejemplo:
 *   <IsotipoCuadro className="w-11 h-11 rounded-lg" />
 */
export default function IsotipoCuadro({
  className = "w-11 h-11 rounded-lg",
}: {
  className?: string;
}) {
  return (
    <div
      className={`shrink-0 bg-white flex items-center justify-center p-[12%] shadow-lg shadow-black/25 ring-1 ring-black/5 ${className}`}
    >
      <img
        src="/images/isotipo-energyproyec.png"
        alt="Energy Proyec"
        className="w-full h-full object-contain"
        draggable={false}
      />
    </div>
  );
}

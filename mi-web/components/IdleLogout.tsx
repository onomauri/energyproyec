"use client";

import { useEffect, useRef, useState } from "react";
import { Clock } from "lucide-react";

const TIEMPO_INACTIVIDAD_MS = 10 * 60 * 1000; // 10 minutos
const AVISO_PREVIO_MS = 9 * 60 * 1000;       // Aviso al minuto 9

export function IdleLogout({
  logoutAction,
}: {
  logoutAction: () => Promise<void>;
}) {
  const [mostrarAviso, setMostrarAviso] = useState(false);
  const logoutTimer = useRef<NodeJS.Timeout | null>(null);
  const warningTimer = useRef<NodeJS.Timeout | null>(null);
  const ejecutandoLogout = useRef(false);

  useEffect(() => {
    const reiniciarTemporizador = () => {
      if (ejecutandoLogout.current) return;

      setMostrarAviso(false);

      if (warningTimer.current) clearTimeout(warningTimer.current);
      if (logoutTimer.current) clearTimeout(logoutTimer.current);

      warningTimer.current = setTimeout(() => {
        setMostrarAviso(true);
      }, AVISO_PREVIO_MS);

      logoutTimer.current = setTimeout(async () => {
        if (ejecutandoLogout.current) return;
        ejecutandoLogout.current = true;
        await logoutAction();
      }, TIEMPO_INACTIVIDAD_MS);
    };

    const eventos = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"];
    eventos.forEach((ev) => window.addEventListener(ev, reiniciarTemporizador, { passive: true }));

    reiniciarTemporizador();

    return () => {
      eventos.forEach((ev) => window.removeEventListener(ev, reiniciarTemporizador));
      if (warningTimer.current) clearTimeout(warningTimer.current);
      if (logoutTimer.current) clearTimeout(logoutTimer.current);
    };
  }, [logoutAction]);

  if (!mostrarAviso) return null;

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z- bg-amber-600 text-white px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-xs font-semibold border border-amber-400">
      <Clock className="w-4 h-4 shrink-0 animate-pulse" />
      <span>Tu sesión se cerrará en 1 minuto por inactividad. Mueve el cursor para continuar.</span>
    </div>
  );
}

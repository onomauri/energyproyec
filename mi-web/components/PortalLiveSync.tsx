'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, X } from 'lucide-react';

function playNotificationSound() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    const playTone = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.15, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    playTone(587.33, now, 0.25);
    playTone(880.0, now + 0.14, 0.45);
  } catch {
    // Ignorar si el navegador bloquea el audio antes de la primera interacción
  }
}

export function PortalLiveSync() {
  const router = useRouter();
  const lastSignature = useRef<string | null>(null);
  const lastCounts = useRef<{ fotos: number; documentos: number; novedades: number; avance: number } | null>(null);
  const [notificacion, setNotificacion] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const cerrarSuavemente = () => {
    setVisible(false);
    setTimeout(() => {
      setNotificacion(null);
    }, 700);
  };

  useEffect(() => {
    let hideTimer: NodeJS.Timeout;
    let removeTimer: NodeJS.Timeout;

    const checkUpdates = async () => {
      

      try {
        const res = await fetch('/api/client/check-updates', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();

        if (!lastSignature.current) {
          lastSignature.current = data.signature;
          lastCounts.current = data.counts;
          return;
        }

        if (data.signature !== lastSignature.current) {
          const prev = lastCounts.current!;
          const curr = data.counts;

          let mensaje = 'Se ha actualizado la información de tu proyecto.';
          let huboEliminacion = false;

          if (curr.fotos > prev.fotos) {
            mensaje = '📸 Se ha subido una nueva evidencia fotográfica a tu proyecto.';
          } else if (curr.fotos < prev.fotos) {
            mensaje = '🗑️ Se ha actualizado el registro fotográfico de tu proyecto.';
            huboEliminacion = true;
          } else if (curr.documentos > prev.documentos) {
            mensaje = '📄 Nuevo documento o plano técnico disponible para descarga.';
          } else if (curr.documentos < prev.documentos) {
            mensaje = '🗑️ Se ha actualizado la lista de documentos técnicos.';
            huboEliminacion = true;
          } else if (curr.novedades > prev.novedades) {
            mensaje = '📋 Nueva actualización publicada en la bitácora de obra.';
          } else if (curr.novedades < prev.novedades) {
            mensaje = '🗑️ Se ha actualizado la bitácora de obra.';
            huboEliminacion = true;
          } else if (curr.avance !== prev.avance) {
            mensaje = `⚡ El avance de tu proyecto se actualizó al ${curr.avance}%.`;
          }

          lastSignature.current = data.signature;
          lastCounts.current = curr;

          // Refresca los Server Components sin F5
          router.refresh();
          setNotificacion(mensaje);

          // Solo sonamos timbre si se agregó contenido nuevo (no al limpiar/eliminar)
          if (!huboEliminacion) {
            playNotificationSound();
          }

          requestAnimationFrame(() => setVisible(true));

          clearTimeout(hideTimer);
          clearTimeout(removeTimer);

          hideTimer = setTimeout(() => {
            setVisible(false);
            removeTimer = setTimeout(() => setNotificacion(null), 700);
          }, 6500);
        }
      } catch {
        // Ignorar errores de red temporales
      }
    };

    checkUpdates();
    const interval = setInterval(checkUpdates, 10000); // Revisión cada 10 segundos
    return () => {
      clearInterval(interval);
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, [router]);

  if (!notificacion) return null;

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 max-w-sm bg-[#0B192C] text-white border border-red-500/40 px-4 py-3.5 rounded-2xl shadow-2xl flex items-start gap-3 transition-all duration-700 ease-in-out ${
        visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
      }`}
    >
      <div className="bg-red-600 p-2 rounded-xl shrink-0 mt-0.5">
        <Bell className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 text-xs leading-relaxed">
        <p className="font-bold text-red-400 uppercase tracking-wider text-[10px] mb-0.5">
          Actualización en vivo
        </p>
        <p className="text-slate-100">{notificacion}</p>
      </div>
      <button
        onClick={cerrarSuavemente}
        className="text-slate-400 hover:text-white p-1 cursor-pointer transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

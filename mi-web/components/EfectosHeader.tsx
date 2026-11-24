'use client';

import { useEffect } from 'react';

const SECCIONES = ['inicio', 'servicios', 'proyectos', 'portal-tech', 'contacto'];

/**
 * Efectos del header al hacer scroll:
 *  - Sombra: aparece solo cuando se baja de la parte superior de la página.
 *  - Sección activa: marca el link del menú según la sección visible.
 * No dibuja nada; actúa sobre #site-header y los links con data-seccion.
 */
export function EfectosHeader() {
  useEffect(() => {
    const header = document.getElementById('site-header');
    if (!header) return;

    const raiz = document.documentElement;
    const scrollPaddingAnterior = raiz.style.scrollPaddingTop;
    const scrollBehaviorAnterior = raiz.style.scrollBehavior;
    // Los anclas (#servicios, etc.) no quedan tapados por el header fijo
    raiz.style.scrollPaddingTop = `${header.offsetHeight}px`;
    raiz.style.scrollBehavior = 'smooth';

    const links = Array.from(document.querySelectorAll<HTMLElement>('[data-seccion]'));
    let pendiente = false;

    const actualizar = () => {
      pendiente = false;
      const y = window.scrollY;

      header.dataset.scrolled = String(y > 40);

      // Línea de referencia: justo debajo del header + un cuarto de pantalla
      const referencia = y + header.offsetHeight + window.innerHeight * 0.25;
      let actual = SECCIONES[0];
      for (const id of SECCIONES) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top + y <= referencia) actual = id;
      }
      // Al llegar al final de la página, la última sección queda activa
      if (window.innerHeight + y >= document.documentElement.scrollHeight - 4) {
        actual = SECCIONES[SECCIONES.length - 1];
      }

      links.forEach((a) => {
        a.dataset.activo = String(a.dataset.seccion === actual);
      });
    };

    const onScroll = () => {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(actualizar);
    };

    actualizar();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      raiz.style.scrollPaddingTop = scrollPaddingAnterior;
      raiz.style.scrollBehavior = scrollBehaviorAnterior;
    };
  }, []);

  return null;
}
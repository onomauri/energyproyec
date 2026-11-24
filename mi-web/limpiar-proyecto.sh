#!/bin/bash
# =====================================================================
#  limpiar-proyecto.sh
#  Quita del código el nombre viejo ("ElectroCaribe"), los datos de
#  ejemplo y los archivos sobrantes, y pone el nombre EnergyProyec.
#
#  Cómo usarlo (desde la carpeta mi-web, la que tiene package.json):
#      bash limpiar-proyecto.sh
#
#  Recomendado: antes de ejecutarlo, deja tu trabajo guardado con un commit
#  (así todo lo que cambie el script se ve aparte y se puede deshacer).
#  Para revisar lo que cambió:  panel "Control de código fuente" de VS Code
#  o en la terminal:            git status
#  Para deshacerlo (solo si hiciste el commit antes):   git restore .
# =====================================================================

if [ ! -f package.json ] || [ ! -d app ]; then
  echo "❌ Ejecuta este script dentro de la carpeta mi-web (donde está package.json)."
  exit 1
fi

echo "1) Cambiando el nombre de la marca a EnergyProyec..."
TEXTOS="
app/layout.tsx
app/page.tsx
app/ModalCotizacion.tsx
app/clientes/page.tsx
app/clientes/portal/PortalClienteView.tsx
app/clientes/portal/TabSecundarios.tsx
app/admin/page.tsx
app/admin/BuzonCotizaciones.tsx
app/terminos-y-condiciones/page.tsx
generar-doc.js
"
for f in $TEXTOS; do
  [ -f "$f" ] || { echo "❌ No encontré $f"; exit 1; }
done

perl -pi -e '
  s{ELECTRO<span className="text-red-500">CARIBE</span>}{ENERGY<span className="text-red-500">PROYEC</span>}g;
  s{ELECTROCARIBE INGENIER\S+ EL\S+ S\.A\.S\.}{ENERGYPROYEC}g;
  s{electrocaribe\.duckdns\.org}{energyproyec.com}g;
  s{electrocaribe\.com}{energyproyec.com}g;
  s{"public", "Documentacion_Tecnica_ElectroCaribe\.pdf"}{"Documentacion_Tecnica_EnergyProyec.pdf"}g;
  s{ElectroCaribe}{EnergyProyec}g;
  s{ELECTROCARIBE}{ENERGYPROYEC}g;
' $TEXTOS

echo "2) Cambiando el correo de ejemplo del formulario de login..."
perl -pi -e 's{cliente\@industriascaribe\.com}{correo\@empresa.com}g' app/clientes/page.tsx

echo "3) Borrando archivos sobrantes de public/ ..."
for f in public/file.svg public/globe.svg public/next.svg public/vercel.svg public/window.svg public/Documentacion_Tecnica_ElectroCaribe.pdf; do
  if [ -f "$f" ]; then rm "$f" && echo "   borrado: $f"; fi
done

echo "4) Quitando contraseñas escritas en el código..."
if [ -f .env ] && grep -q '^ADMIN_PASSWORD=.' .env && grep -q '^DRIVE_TOKEN_SECRET=.' .env; then
  perl -0pi -e 's{const claveReal = process\.env\.ADMIN_PASSWORD \|\| "AdminElectro2026\*";}{const claveReal = process.env.ADMIN_PASSWORD;\n  if (!claveReal) {\n    return { error: "Falta configurar ADMIN_PASSWORD en el servidor." };\n  }}' app/admin/actions.ts
  perl -0pi -e 's{const secret = process\.env\.DRIVE_TOKEN_SECRET \|\| .electrocaribe-default-secret-key-32b!.;}{const secret = process.env.DRIVE_TOKEN_SECRET;\n  if (!secret) {\n    throw new Error("Falta DRIVE_TOKEN_SECRET en el archivo .env");\n  }}' lib/cryptoToken.ts
  echo "   listo (tu .env ya tiene ADMIN_PASSWORD y DRIVE_TOKEN_SECRET)."
else
  echo "   ⚠️  Saltado: tu archivo .env no tiene ADMIN_PASSWORD y/o DRIVE_TOKEN_SECRET."
  echo "      Agrégalas a .env (con valores propios y largos) y vuelve a ejecutar este script."
fi

echo ""
echo "✅ Terminado. Menciones de la marca vieja que aún quedan en el código:"
grep -rn -i "electrocaribe\|AdminElectro\|Electro2026\|industriascaribe" app lib components prisma generar-doc.js 2>/dev/null | cut -c1-110 || true
echo "   (si no apareció ninguna línea arriba, está todo limpio)"

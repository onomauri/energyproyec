import sharp from 'sharp';

export async function limpiarYReescalarLogo(inputBuffer: Buffer): Promise<Buffer> {
  // 1. Convertir a RGBA raw y recortar márgenes blancos uniformes primero
  const { data, info } = await sharp(inputBuffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // 2. Volver transparentes los píxeles blancos / gris muy claro (fondo viejo de JPG/PNG)
  const pixels = new Uint8Array(data);
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];

    // Si el píxel es casi blanco (>238 en los 3 canales), hacerlo transparente
    if (r > 238 && g > 238 && b > 238) {
      pixels[i + 3] = 0;
    } else if (r > 220 && g > 220 && b > 220) {
      // Suavizado progresivo en los bordes para evitar efecto pixelado
      const avg = (r + g + b) / 3;
      const alphaFactor = Math.max(0, Math.min(1, (242 - avg) / 22));
      pixels[i + 3] = Math.round(pixels[i + 3] * alphaFactor);
    }
  }

  // 3. Reconstruir imagen, recortar espacios transparentes vacíos (.trim()),
  //    reescalar a altura uniforme HD (160px) y aplicar nitidez (.sharpen())
  const processedBuffer = await sharp(pixels, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4,
    },
  })
    .trim({ threshold: 10 })
    .resize({
      height: 160,
      width: 480,
      fit: 'inside',
      kernel: sharp.kernel.lanczos3,
    })
    .sharpen({ sigma: 0.8 })
    .png({ quality: 95 })
    .toBuffer();

  return processedBuffer;
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ElectroCaribe Ingeniería Eléctrica | Subestaciones y Media Tensión",
    template: "%s | ElectroCaribe Ingeniería Eléctrica",
  },
  description:
    "Diseño, montaje y mantenimiento de subestaciones eléctricas, redes de media y baja tensión, termografía y soluciones energéticas industriales en Barranquilla y la Región Caribe.",
  openGraph: {
    title: "ElectroCaribe Ingeniería Eléctrica",
    description:
      "Soluciones integrales en ingeniería eléctrica industrial, mantenimiento de subestaciones hasta 34.5 kV y seguimiento de obra en línea.",
    url: "https://duckdns.org",
    siteName: "ElectroCaribe Ingeniería Eléctrica",
    locale: "es_CO",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

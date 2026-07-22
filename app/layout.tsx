import type { Metadata } from "next";
import { APP_NAME } from "@/config";
import "./globals.css";

export const metadata: Metadata = {
  title: `${APP_NAME} · Visibilidad compartida para la exportación de flores`,
  description:
    "Un expediente compartido por pedido, avanzado por escaneos y visible según rol. Fusiona Xpotrack, couriers y Agrocalidad en una sola línea de tiempo.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-EC">
      <body>{children}</body>
    </html>
  );
}

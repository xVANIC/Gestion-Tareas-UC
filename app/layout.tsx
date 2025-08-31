import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Gestión Tareas UC",
  description:
    "Aplicación Web desarrollada para el Producto Académico 1 de Construcción de Software",
  keywords: "listas, tareas, productividad, gestión, Universidad Continental",
  authors: [{ name: "Herrada Cedron Angel Fabian" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}

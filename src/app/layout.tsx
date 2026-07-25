import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SnapRecipe - Escanea tu nevera, obtén recetas",
  description:
    "Fotografía los ingredientes que tienes y obtén recetas personalizadas con IA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 antialiased">
        {children}
      </body>
    </html>
  );
}

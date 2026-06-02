import type { Metadata } from "next";
import { Geist, Playfair_Display } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "./components/I18nProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vinho-Lab — Companheiro de laboratório",
  description:
    "Validação físico-química e sensorial de vinhos contra as legislações do Brasil (MAPA) e Portugal/UE (IVV), com veredicto de exportabilidade. Processamento 100% no navegador.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-PT" className={`${geistSans.variable} ${playfairDisplay.variable} h-full antialiased`}>
      <body className="min-h-full">
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}

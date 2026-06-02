import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "./components/I18nProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Monoespaçada para os números de laboratório (classe `font-mono`): garante
// alinhamento em coluna e leitura coerente dos algarismos. Sem isto, a variável
// --font-geist-mono ficava indefinida e os valores caíam na fonte proporcional.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
    <html lang="pt-PT" className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} h-full antialiased`}>
      <body className="min-h-full">
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}

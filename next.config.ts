import type { NextConfig } from "next";

/**
 * Cabeçalhos de segurança. A aplicação é 100% cliente (sem servidor de dados,
 * sem telemetria), por isso a CSP é restritiva: só permite recursos próprios.
 *
 * Notas:
 *  - 'unsafe-inline' em style-src é necessário para o Tailwind/Next injetarem
 *    estilos; 'unsafe-eval'/'unsafe-inline' em script-src são exigidos pelo
 *    runtime do Next (sobretudo em desenvolvimento com Turbopack).
 *  - blob: em img-src e worker-src cobre a geração do PDF (pdfmake) no browser.
 *  - frame-ancestors 'none' impede o embedding em iframes de terceiros
 *    (clickjacking); reforçado por X-Frame-Options.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;

"use client";
/**
 * Fronteira de erro de último recurso (envolve o próprio layout raiz). Só dispara
 * se o erro ocorrer fora do alcance de app/error.tsx. Tem de trazer o seu próprio
 * <html>/<body> porque substitui o layout raiz.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="pt-PT">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          display: "flex",
          minHeight: "100vh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          padding: "1.5rem",
          textAlign: "center",
        }}
      >
        <h2 style={{ color: "#4a0e0e" }}>Ocorreu um erro inesperado</h2>
        <p style={{ maxWidth: "32rem", color: "#666" }}>
          A aplicação não conseguiu recuperar automaticamente. Recarregue a
          página; os seus dados estão guardados no navegador.
        </p>
        {error?.message && (
          <pre style={{ fontSize: "0.75rem", color: "#b00" }}>{error.message}</pre>
        )}
        <button
          onClick={reset}
          style={{
            background: "#4a0e0e",
            color: "#fff",
            border: "none",
            borderRadius: "0.5rem",
            padding: "0.625rem 1rem",
            cursor: "pointer",
          }}
        >
          Tentar novamente
        </button>
      </body>
    </html>
  );
}

"use client";
/**
 * Fronteira de erro de rota (Next.js App Router). Evita o ecrã branco: se algum
 * componente lançar durante a renderização, mostra-se uma mensagem útil em
 * PT-PT e um botão para tentar de novo, em vez de a aplicação morrer em
 * silêncio. Os dados do utilizador ficam no estado do browser — recarregar não
 * os apaga, mas "Tentar novamente" tenta re-renderizar sem recarregar.
 */
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Sem telemetria externa (coerência RGPD): apenas consola local.
    console.error("Vinho Lab Comp — erro de renderização:", error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="text-4xl">🍷</div>
      <h2 className="text-lg font-semibold text-[var(--primary)]">
        Ocorreu um erro inesperado
      </h2>
      <p className="text-sm text-[var(--muted)]">
        Algo correu mal ao apresentar esta secção. Os seus dados continuam no
        navegador. Pode tentar novamente; se persistir, exporte a sessão
        (.json) e recarregue a página.
      </p>
      {error?.message && (
        <pre className="max-w-full overflow-x-auto rounded-md bg-[var(--input)] px-3 py-2 text-left text-xs text-[var(--bad-fg)]">
          {error.message}
        </pre>
      )}
      <button
        onClick={reset}
        className="rounded-lg bg-[var(--accent)] px-4 py-2.5 font-medium text-white transition-colors hover:bg-[var(--accent-hover)]"
      >
        Tentar novamente
      </button>
    </div>
  );
}

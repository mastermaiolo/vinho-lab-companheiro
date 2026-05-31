"use client";
import { useEffect, useState } from "react";
import { Locale, translate } from "@/lib/i18n";
import { Rich } from "./I18nProvider";

/** Bloco de texto numa língua fixa. O modal aparece antes de o utilizador
 *  poder escolher idioma, por isso mostramos PT + EN lado a lado. */
function IntroBlock({ locale, flag }: { locale: Locale; flag: string }) {
  const tr = (key: string) => translate(locale, key);
  return (
    <div className="space-y-2 text-sm leading-relaxed text-[var(--foreground)]">
      <p className="font-medium">{flag} {tr("modal.title")}</p>
      <p><Rich text={tr("modal.intro")} /></p>
      <ul className="list-disc space-y-1 pl-5">
        <li><Rich text={tr("modal.b1")} /></li>
        <li><Rich text={tr("modal.b2")} /></li>
        <li><Rich text={tr("modal.b3")} /></li>
        <li><Rich text={tr("modal.b4")} /></li>
      </ul>
      <p className="text-[var(--muted)]"><Rich text={tr("modal.support")} /></p>
    </div>
  );
}

export default function PrivacyModal() {
  const [open, setOpen] = useState(false);

  // setState pós-montagem intencional: sessionStorage não existe no SSR, por isso
  // a decisão de abrir o modal só pode ser tomada no cliente, após a hidratação.
  useEffect(() => {
    if (typeof window !== "undefined" && !sessionStorage.getItem("vl_intro_ack")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpen(true);
    }
  }, []);

  if (!open) return null;

  const close = () => {
    sessionStorage.setItem("vl_intro_ack", "1");
    setOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="vl-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md"
    >
      <div className="max-h-[90vh] max-w-xl overflow-y-auto rounded-xl glass p-6 shadow-xl">
        <h2 id="vl-modal-title" className="sr-only">
          {translate("pt", "modal.title")} / {translate("en", "modal.title")}
        </h2>
        <div className="space-y-4">
          <IntroBlock locale="pt" flag="🇵🇹" />
          <hr className="border-[var(--border)]" />
          <IntroBlock locale="en" flag="🇬🇧" />
        </div>
        <button
          onClick={close}
          className="mt-5 w-full rounded-lg bg-[var(--accent)] px-4 py-2.5 font-medium text-white transition-colors hover:bg-[var(--accent-hover)]"
        >
          {translate("pt", "modal.button")} · {translate("en", "modal.button")}
        </button>
      </div>
    </div>
  );
}

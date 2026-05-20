"use client";

import { useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Cookie } from "@deemlol/next-icons";
import {
  readCookieConsent,
  writeCookieConsent,
  DEFAULT_CONSENT,
  type CookieConsent,
} from "@/src/lib/cookie-consent";
import CookieBanner from "@/src/components/ui/cookie/CookieBanner";
import CookiePanel from "@/src/components/ui/cookie/CookiePanel";

const subscribe = () => () => {};

type Internal = { consent: CookieConsent; initialized: boolean };

export default function CookieManager() {
  const isClient = useSyncExternalStore(subscribe, () => true, () => false);

  const [{ consent, initialized }, setInternal] = useState<Internal>({
    consent: DEFAULT_CONSENT,
    initialized: false,
  });
  const [panelOpen, setPanelOpen] = useState(false);

  if (isClient && !initialized) {
    setInternal({ consent: readCookieConsent(), initialized: true });
  }

  if (!isClient) return null;

  const autoSave = (next: CookieConsent) => {
    const final: CookieConsent = { ...next, consented: true };
    writeCookieConsent(final);
    setInternal((s) => ({ ...s, consent: final }));
  };

  const persist = (next: CookieConsent) => {
    autoSave(next);
    setPanelOpen(false);
  };

  return (
    <>
      <AnimatePresence>
        {consent.consented && (
          <motion.button
            key="fab"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            onClick={() => setPanelOpen(true)}
            aria-label="Gérer mes préférences cookies"
            className="fixed left-4 bottom-6 z-40 w-12 h-12 rounded-full bg-lime text-sapin border border-sapin shadow-[4px_4px_0_0_#04251c] flex items-center justify-center"
          >
            <Cookie size={22} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {!consent.consented && !panelOpen && (
          <CookieBanner
            key="banner"
            onAcceptAll={() =>
              persist({ analytiques: true, fonctionnels: true, consented: true })
            }
            onRejectAll={() =>
              persist({ analytiques: false, fonctionnels: false, consented: true })
            }
            onCustomize={() => setPanelOpen(true)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {panelOpen && (
          <CookiePanel
            key="panel"
            draft={consent}
            onDraftChange={autoSave}
            onAcceptAll={() =>
              persist({ analytiques: true, fonctionnels: true, consented: true })
            }
            onRejectAll={() =>
              persist({ analytiques: false, fonctionnels: false, consented: true })
            }
            onClose={() => setPanelOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

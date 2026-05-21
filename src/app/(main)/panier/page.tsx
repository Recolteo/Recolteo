"use client";

import { ShoppingBag } from "@deemlol/next-icons";
import Btn from "@/src/components/ui/primitives/Button";
import CatalogueDecorations from "@/src/components/illustrations/CatalogueDecorations";
import Reveal from "@/src/components/animations/Reveal";
import { useCart } from "@/src/lib/cart-context";
import CartItem from "./_components/CartItem";
import CartSummary from "./_components/CartSummary";

export default function Panier() {
  const { items, removeFromCart } = useCart();
  const totalPrice = items.reduce((sum, item) => sum + item.montant_chiffre, 0);

  if (items.length === 0) {
    return (
      <main>
        <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center px-4 overflow-hidden">
          <CatalogueDecorations />
          <Reveal>
            <div className="relative z-10 text-center max-w-sm mx-auto">
              <div className="w-20 h-20 rounded-3xl bg-lime border border-sapin shadow-[4px_4px_0_0_#06573F] flex items-center justify-center mx-auto mb-8">
                <ShoppingBag size={32} className="text-sapin" />
              </div>
              <h1 className="text-sapin font-black text-3xl mb-3">
                Panier vide
              </h1>
              <p className="text-sapin/60 mb-8 leading-relaxed">
                Vous n'avez encore rien sélectionné. Parcourez les lots
                disponibles et ajoutez ceux dont votre association a besoin.
              </p>
              <Btn
                label="Explorer les lots"
                href="/lots"
                variant="sapin"
                className="justify-center"
              />
            </div>
          </Reveal>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <CatalogueDecorations />

        <div className="relative z-10 max-w-7xl mx-auto">
          <Reveal delay={0.1}>
            <div className="mb-10">
              <h1 className="text-sapin font-black mb-2">
                Mon{" "}
                <span className="relative italic whitespace-nowrap">
                  <span
                    className="absolute inset-0 bg-lime rounded-xl -rotate-1 scale-x-110"
                    aria-hidden="true"
                  />
                  <span className="relative">panier</span>
                </span>
              </h1>
              <p className="text-sapin/60 mt-3">
                Vérifiez vos lots sélectionnés avant de finaliser votre demande.
              </p>
            </div>
          </Reveal>

          <div className="flex flex-col lg:flex-row gap-6">
            <aside className="lg:w-80 shrink-0 lg:order-last">
              <Reveal delay={0.2}>
                <CartSummary itemCount={items.length} totalPrice={totalPrice} />
              </Reveal>
            </aside>

            <div className="flex-1 min-w-0 lg:order-first">
              <Reveal delay={0.3}>
                <div className="flex flex-col gap-3">
                  {items.map((item) => (
                    <CartItem
                      key={item.id_lot}
                      item={item}
                      onRemove={removeFromCart}
                    />
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

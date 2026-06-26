# src/components

Composants partagés entre 2+ routes. Les composants locaux à une route restent dans `_components/`.

## Arborescence

```
components/
├── animations/
│   ├── DraggablePill.tsx
│   ├── FadeOut.tsx
│   ├── Reveal.tsx
│   └── SlideIn.tsx
├── illustrations/
│   ├── CatalogueDecorations.tsx
│   ├── ContactDecorations.tsx
│   └── assetsIllustrations.tsx
├── layout/
│   ├── Footer.tsx
│   └── Header.tsx
├── sections/
│   ├── About.tsx
│   ├── CatalogueGrid.tsx
│   ├── Categories.tsx
│   ├── ContactForm.tsx
│   ├── ContactSection.tsx
│   ├── Faq.tsx
│   ├── GestionLots.tsx
│   ├── Hero.tsx
│   ├── HowItWorks.tsx
│   └── VideoDemo.tsx
└── ui/
    ├── cards/
    │   ├── CguCard.tsx
    │   ├── LotCard.tsx
    │   ├── LotCardGestion.tsx
    │   ├── ProfileCard.tsx
    │   └── ValueCard.tsx
    ├── cookie/
    │   ├── CookieBanner.tsx
    │   ├── CookieCategory.tsx
    │   ├── CookieManager.tsx
    │   └── CookiePanel.tsx
    ├── docs/
    │   └── DocAction.tsx
    ├── media/
    │   └── VideoPlayer.tsx
    ├── modals/
    │   ├── ConfirmDeleteModal.tsx
    │   ├── ConfirmResetCagnotteModal.tsx
    │   ├── Leo.tsx
    │   ├── LotDetailModal.tsx
    │   └── PendingValidationModal.tsx
    ├── parts/
    │   └── FilterPart.tsx
    ├── primitives/
    │   ├── Button.tsx
    │   ├── Checkbox.tsx
    │   ├── EmptyState.tsx
    │   ├── Input.tsx
    │   ├── LoadingSpinner.tsx
    │   ├── Pagination.tsx
    │   ├── RadiusSlider.tsx
    │   ├── Select.tsx
    │   ├── StepDots.tsx
    │   ├── StepSlider.tsx
    │   ├── TabToggle.tsx
    │   └── Toggle.tsx
    └── sections/
        ├── CtaBanner.tsx
        ├── FaqItem.tsx
        └── StepItem.tsx
```

> `ReservationModal` est local à `/panier` : `src/app/(main)/panier/_components/`.

## Règles

- Server Component par défaut, `"use client"` si vraiment nécessaire
- Pas de fetch dans les composants (données via `_utils/fetch*.ts`)
- Pas de `createAdminClient` dans les composants
- Style Tailwind uniquement, `cn()` pour les classes conditionnelles
- Panier via `useCart()` depuis `src/lib/cart-context`

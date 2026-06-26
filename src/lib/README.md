# src/lib

## Arborescence

```
lib/
├── supabase/
│   ├── admin.ts
│   ├── client.ts
│   ├── documents-types.ts
│   ├── documents.ts
│   └── server.ts
├── server/
│   └── doc-crypto.ts
├── data/
│   ├── about.ts
│   ├── association-types.ts
│   ├── categories.ts
│   ├── faq.ts
│   ├── how-it-works.ts
│   └── videoDemo.ts
├── breach-notification.ts
├── cart-context.tsx
├── cerfa.ts
├── cookie-consent.ts
├── email.ts
└── geocode.ts
```

## Clients Supabase

| Fichier | Contexte | RLS |
|---|---|---|
| `supabase/client.ts` | `"use client"` uniquement | Appliqués |
| `supabase/server.ts` | Server Components, Actions, API routes (`await createClient()`) | Appliqués |
| `supabase/admin.ts` | Server Actions, après vérif. droits (`"server-only"`) | **Contournés** |

`supabase/documents.ts` — `getAdminAllDocuments()` (admin)  
`supabase/documents-types.ts` — `DocType = "rib" | "kbis" | "identite"`, constante `BUCKET`

## Autres modules

| Fichier | Export principal |
|---|---|
| `server/doc-crypto.ts` | `encryptBuffer(plain)` / `decryptBuffer(blob)` — AES-256-GCM, format `[IV 12o][Tag 16o][Cipher]` |
| `cart-context.tsx` | `useCart()` — localStorage via `useSyncExternalStore` |
| `email.ts` | `notifyAdminNewProfile()` · `notifyAdminDocumentsReady()` — Resend |
| `breach-notification.ts` | `notifyBreach()` — batch Resend (lots de 100) |
| `cerfa.ts` | `generateCerfa(data: CerfaData): Promise<Buffer>` — pdf-lib, template `src/asset/CERFA.pdf` |
| `geocode.ts` | `geocodeAddress(address): Promise<{lat, lng} \| null>` — API BAN |
| `cookie-consent.ts` | Gestion consentement RGPD |

## data/

Données statiques TypeScript (pas de fetch) : `categories` · `association-types` · `how-it-works` · `faq` · `about` · `videoDemo`

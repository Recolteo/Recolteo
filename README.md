# Récoltéo

Mise en relation commerçants / associations pour les dons alimentaires. Déclaration de lots, réservation, validation des collectes, génération CERFA.

## Stack

| Couche | Techno |
|--------|--------|
| Framework | Next.js 16 App Router + React 19 |
| Langage | TypeScript 5 |
| Styles | Tailwind CSS v4 |
| Backend / Auth | Supabase (Auth · PostgreSQL · Storage) |
| Paiement | Stripe (abonnements + webhooks) |
| Emails | Resend |
| Animations | Motion (Framer Motion v12) |
| PDF | pdf-lib |
| Export Excel | xlsx |
| Géocodage | API BAN (adresses françaises) |
| Icons | @deemlol/next-icons |
| Qualité | ESLint + Husky |

## Install

```bash
npm install
cp .env.example .env.local  # remplir les valeurs (voir VARIABLES.md)
npm run dev
```

## Structure

```
src/
├── app/
│   ├── (main)/       # Routes authentifiées
│   │   ├── lots/         # Déclaration et gestion des lots
│   │   ├── panier/       # Réservation des lots
│   │   ├── profil/       # Profil utilisateur
│   │   ├── historique-export/  # Historique des exports
│   │   ├── admin/        # Backoffice (collectes, structures, validation)
│   │   └── stripe/       # Gestion abonnement
│   ├── (public)/     # Pages publiques (landing, auth)
│   └── api/          # Route handlers (cerfa, export, stripe webhooks…)
├── components/       # Composants UI partagés
├── lib/              # Logique métier
│   ├── supabase/         # Clients Supabase (browser / server / admin)
│   ├── server/           # Helpers server-only (crypto, emails…)
│   └── data/             # Fetchers de données
└── asset/            # Images, SVG, template CERFA.pdf
middleware.ts         # Auth + rate limiting (10 req/15 min/IP)
```

## Règles importantes

**Clients Supabase — lequel utiliser :**
- `createClient()` (server) → Server Components, Actions, API routes — respecte les RLS
- `createClient()` (browser) → `"use client"` uniquement
- `createAdminClient()` → Server Actions uniquement, **toujours après vérification des droits**, contourne les RLS

**Pattern Server Action :**
```
1. createClient() + getUser()
2. vérifier les permissions en base (RLS)
3. createAdminClient() pour l'opération si nécessaire
4. revalidatePath()
```

**Sécurité :**
- Documents chiffrés AES-256-GCM avant stockage (`lib/server/doc-crypto.ts`)
- Headers HTTP sécurisés dans `next.config.ts`
- Husky bloque les commits avec secrets détectés

## Commandes

```bash
npm run dev    # dev
npm run build  # prod build
npm run lint   # ESLint
```

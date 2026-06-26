# src/app

## Routes

```
app/
├── (main)/                                   # authentifié — middleware redirige sinon
│   ├── layout.tsx                            # Header + Footer + CartProvider
│   ├── loading.tsx
│   ├── page.tsx                              # landing connectée
│   ├── decouvrir-recolteo/page.tsx
│   ├── lots/
│   │   ├── page.tsx
│   │   ├── actions.ts                        # supprimerLot
│   │   ├── _components/                      # CatalogueLots, CatalogueLotsFilter
│   │   ├── _utils/fetchLots.ts
│   │   ├── declarer-lot/
│   │   │   ├── page.tsx
│   │   │   ├── actions.ts                    # declarerLot
│   │   │   ├── _components/                  # LotForm, CommercantSection, HorairesSection,
│   │   │   │                                 # LotDetailsSection, ValeurSection, ExcelImportModal
│   │   │   └── _utils/fetchDeclarerLot.ts
│   │   └── [id]/modifier/
│   │       ├── page.tsx
│   │       ├── actions.ts                    # modifierLot
│   │       └── _components/LotEditForm.tsx
│   ├── panier/
│   │   ├── page.tsx
│   │   ├── actions.ts                        # reserverLots
│   │   └── _components/                      # CartItem, CartSection, CartSummary,
│   │                                         # CartEmpty, ReservationModal, SuccessToast
│   ├── profil/
│   │   ├── page.tsx
│   │   ├── actions.ts                        # deleteAccount
│   │   ├── doc-actions.ts                    # notifyDocumentsModified
│   │   ├── utils.ts                          # toLot()
│   │   ├── _components/                      # ProfilHeader, ProfilLayout, ProfilDecorations,
│   │   │   │                                 # DeleteConfirmModal
│   │   │   └── tabs/                         # InfoTab, DocsTab, CollectesTab, DocCard,
│   │   │                                     # HistoriqueCommercantTab, HistoriqueAssociationTab,
│   │   │                                     # HistoriqueAdminTab, BreachTab, AdminDocsView
│   │   ├── _hooks/useDocsTab.ts
│   │   └── _utils/fetchProfil.ts
│   └── admin/
│       ├── page.tsx
│       ├── actions.ts                        # approveDocument, validateProfile, validerCollecte…
│       ├── _components/                      # AdminLanding, AdminFiltre, AdminStatsBar,
│       │                                     # AdminProfileCard, AdminDecorations, AdminEmptyState,
│       │                                     # Pagination, adminNavigate
│       ├── validation/page.tsx
│       ├── structures/
│       │   ├── page.tsx
│       │   ├── _components/                  # StructuresFiltre, structuresNavigate
│       │   └── _utils/                       # fetchStructures, buildDocs
│       └── collectes/
│           ├── page.tsx
│           └── _components/                  # CollecteAdminCard, CollecteAdminList
│
├── (public)/
│   └── contact/
│       ├── page.tsx
│       └── actions.ts                        # sendContactEmail
│
├── api/
│   ├── docs/[type]/route.ts                  # GET / POST / DELETE — chiffré AES-256-GCM
│   ├── docs/admin/route.ts                   # GET tous les documents (admin)
│   ├── docs/status/route.ts                  # GET statut validation
│   ├── cerfa/[idLot]/route.ts                # GET PDF CERFA
│   └── export/route.ts                       # GET export RGPD JSON
│
├── login/
│   ├── page.tsx
│   ├── actions.ts                            # signIn, signUp, signOut
│   └── _components/                          # LoginForm, SignInForm, SignUpForm,
│                                             # Step1Form, Step2Form, StepProgress, useSignUpForm
│
├── mentions-legales/page.tsx
├── politique-de-confidentialite/page.tsx
├── cookies/page.tsx
├── layout.tsx                                # layout racine + CookieBanner
└── not-found.tsx
```

## Conventions

**Co-location par route :**
```
route/
├── page.tsx        # Server Component
├── actions.ts      # "use server" + revalidatePath
├── _components/    # composants locaux (non routables)
└── _utils/         # fetchers (lecture seule)
```

Composant utilisé dans 2+ routes → le déplacer dans `src/components/`.

**Permissions** : le middleware vérifie uniquement la présence du user. Les rôles (commerçant / association / admin) sont vérifiés dans chaque Server Action via `supabase.from("administrateur"|"commercant"|"association")`.

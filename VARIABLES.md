# Variables d'environnement

Créer `.env.local` à la racine :

```bash
NEXT_PUBLIC_SUPABASE_URL=           # Supabase → Project Settings → API → URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=      # Supabase → Project Settings → API → anon key
SUPABASE_SERVICE_ROLE_KEY=          # Supabase → Project Settings → API → service_role key

RESEND_API_KEY=                     # resend.com → API Keys
ADMIN_EMAIL=                        # email qui reçoit les notifications admin

NEXT_PUBLIC_APP_URL=                # http://localhost:3000 en dev

NEXT_PUBLIC_BAN_GEOCODE_URL=https://api-adresse.data.gouv.fr/search/
GEO_API_COMMUNES_URL=https://geo.api.gouv.fr/communes

DOCUMENT_ENCRYPTION_KEY=           # clé AES-256 hex 64 chars
                                   # générer : node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

> `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY` et `DOCUMENT_ENCRYPTION_KEY` ne doivent jamais être committés.

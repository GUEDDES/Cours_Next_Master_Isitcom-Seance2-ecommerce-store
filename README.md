# Projet Final Next.js E-Commerce (Seances 1-5)

Application e-commerce full-stack construite avec Next.js App Router, Prisma et PostgreSQL.

Le projet couvre le fil rouge des seances:
- seance 1-2: structure App Router, pages catalogue
- seance 3: base de donnees PostgreSQL + Prisma + API routes
- seance 4: authentification, RBAC, middleware, panier, dashboard admin
- seance 5: readiness production, headers securite, CI GitHub Actions

## Stack Technique

- Next.js 16 (App Router)
- React 19
- TypeScript
- Prisma ORM
- PostgreSQL
- NextAuth (credentials + OAuth optionnel Google/GitHub)

## Fonctionnalites

- Authentification complete:
  - inscription `/auth/register`
  - connexion `/auth/login`
  - page erreur auth `/auth/error`
- RBAC:
  - role `USER` et `ADMIN`
  - protection `/admin/*`, `/cart`, `/orders`, `/profile` via middleware + checks serveur
- Catalogue:
  - liste produits `/products`
  - detail produit `/products/[slug]`
- Panier:
  - ajout, modification quantite, suppression
  - passage commande via Server Action
- Commandes:
  - historique utilisateur `/orders`
  - listing admin `/admin/orders`
- Administration:
  - dashboard `/admin`
  - produits `/admin/products`
  - categories `/admin/categories`
  - utilisateurs `/admin/users`
- API routes:
  - `/api/products`
  - `/api/products/[id]`
  - `/api/categories`
  - `/api/auth/register`
  - `/api/auth/[...nextauth]`

## Prerequis

- Node.js 20+
- npm 10+
- PostgreSQL local ou Docker

## Installation Locale

1. Installer les dependances:

```bash
npm install
```

2. Copier les variables d'environnement:

```bash
cp .env.example .env
```

3. Demarrer PostgreSQL (exemple Docker):

```bash
docker run --name isitcom-postgres \
  -e POSTGRES_USER=isitcom \
  -e POSTGRES_PASSWORD=isitcom123 \
  -e POSTGRES_DB=isitcom_shop \
  -p 5432:5432 \
  -d postgres:16
```

4. Appliquer les migrations:

```bash
npx prisma migrate dev --name init
```

5. (Optionnel) Seeder:

```bash
node prisma/seed.js
```

6. Lancer le projet:

```bash
npm run dev
```

## Variables d'Environnement

Voir `.env.example`:
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GITHUB_ID`
- `GITHUB_SECRET`

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Deploiement Manuel Vercel (Seance 5)

1. Pousser le projet sur GitHub.
2. Importer le repo dans Vercel.
3. Creer une base Postgres (Vercel Storage) ou connecter une base externe.
4. Ajouter les variables d'environnement Vercel:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL=https://votre-projet.vercel.app`
   - `GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET` si OAuth Google
   - `GITHUB_ID/GITHUB_SECRET` si OAuth GitHub
5. Appliquer les migrations en production:

```bash
npx prisma migrate deploy
```

6. Verifier les callbacks OAuth:
- Google callback:
  `https://votre-projet.vercel.app/api/auth/callback/google`
- GitHub callback:
  `https://votre-projet.vercel.app/api/auth/callback/github`

## CI/CD GitHub Actions

Le workflow est dans `.github/workflows/ci.yml` et execute:
- `npm ci`
- `npm run lint`
- `npm run build`

Sur:
- `push` vers `main`
- `pull_request` vers `main`

## Checklist de Validation

- `npm run lint` sans erreur
- `npm run build` succes
- Auth register/login/logout OK
- RBAC admin OK (`USER` bloque, `ADMIN` autorise)
- Flux panier -> commande -> historique OK
- Pages admin OK (orders/users/products/categories)
- API principales OK

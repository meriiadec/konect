# Konect

Konect est un MVP de marketplace locale pour connecter trois groupes :

- les commerçants qui veulent publier leurs produits ;
- les opérateurs terrain qui veulent recevoir des missions ;
- les clients qui consultent le catalogue et commandent via WhatsApp.

## Stack

- Next.js App Router
- React
- Tailwind CSS
- Supabase Database + Storage
- Déploiement prévu sur Vercel

## Installation

```bash
npm install
npm run dev
```

Ouvre ensuite `http://localhost:3000`.

## Variables d'environnement

Copie `.env.example` vers `.env.local`, puis renseigne :

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`
- `SUPABASE_SERVICE_ROLE_KEY` si tu veux que les routes admin lisent les données côté serveur avec les droits serveur.

Ne partage jamais `.env.local`, `ADMIN_PASSWORD` ou `SUPABASE_SERVICE_ROLE_KEY`.

## Pages principales

- `/` : page d'accueil
- `/commercant` : inscription commerçant
- `/operateur` : inscription opérateur
- `/produits` : catalogue public
- `/produits/ajouter` : ajout produit
- `/admin` : dashboard admin protégé par cookie HTTP-only

## Supabase

Le dossier `supabase/schema.sql` contient une base de départ pour créer les tables, le bucket Storage et des politiques RLS minimales.

Avant une vraie mise en ligne, vérifie les politiques RLS selon le niveau de confidentialité voulu, surtout pour les numéros de téléphone et les produits en attente.

## Scripts

```bash
npm run lint
npm run build
npm run start
```

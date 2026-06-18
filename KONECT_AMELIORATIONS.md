# Konect - Analyse et feuille de route

## Ce qui a été amélioré

- Correction des erreurs ESLint principales.
- Remplacement des liens internes simples par `next/link`.
- Correction des textes français et caractères mal encodés.
- Ajout d'une session admin par cookie HTTP-only signé.
- Ajout de routes API admin pour lire les données côté serveur.
- Validation renforcée des formulaires commerçant, opérateur et produit.
- Validation des images produit : type image, limite à 4 fichiers, taille max 3 Mo.
- Passage des images catalogue vers `next/image`.
- Ajout d'un `.env.example`.
- Remplacement du README généré par une documentation projet.
- Ajout d'un script SQL Supabase de départ.

## À faire dans Supabase

1. Ouvrir Supabase SQL Editor.
2. Exécuter `supabase/schema.sql`.
3. Vérifier que le bucket `produits` existe et est public.
4. Vérifier les politiques RLS.
5. Pour une version production, ajouter une interface admin pour publier/rejeter les produits au lieu de modifier le statut manuellement.

## À faire dans Vercel

1. Ajouter les variables d'environnement :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ADMIN_PASSWORD`
   - `ADMIN_SESSION_SECRET`
   - `SUPABASE_SERVICE_ROLE_KEY` recommandé
2. Lancer un déploiement.
3. Tester les formulaires, le catalogue et `/admin`.

## Notes privées

Adresse de travail mentionnée par l'utilisateur : fassinoumeriadec@gmail.com.
Ne jamais enregistrer ici de mot de passe, clé Supabase, clé Vercel ou contenu Gmail privé.


## Workflow produit finalisé

- Les produits ajoutés depuis `/produits/ajouter` arrivent avec le statut `pending`.
- Le catalogue public lit seulement les produits autorisés par les règles RLS, donc les produits `published`.
- L'admin peut maintenant publier ou refuser chaque produit depuis `/admin`.
- La route `PATCH /api/admin/products/:id` vérifie le cookie admin avant de modifier le statut.

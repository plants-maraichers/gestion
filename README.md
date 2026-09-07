# Catalogue des plants — gestion partagée (Cloudflare)

## Pourquoi ça a changé

Au départ, les données vivaient dans des fichiers JSON locaux (édités puis poussés sur GitHub Pages). Ça marche pour une personne, mais pas pour une équipe : chaque ordinateur avait sa propre copie du fichier.

Maintenant, les données vivent **en ligne**, dans une base Cloudflare KV. Tous les ordinateurs de l'équipe lisent et écrivent la **même** base via une petite API. GitHub Pages ne peut pas faire tourner cette API (site 100% statique) — on héberge donc désormais sur **Cloudflare Pages**, qui sait faire les deux (site + API) et qui peut quand même se déployer automatiquement depuis ton dépôt GitHub.

Ce n'est pas de l'édition simultanée "en live" (deux personnes qui tapent au même endroit à la même seconde) — mais chacun voit toujours la dernière version publiée, depuis n'importe quel poste, ce qui correspond à votre besoin.

## Structure du projet

```
plants-catalogue/
├── index.html              # catalogue public
├── admin.html               # édition du catalogue (catégories/espèces/variétés)
├── admin-gestion.html       # édition stocks / prix / canaux / charges / ventes
├── functions/
│   └── api/data/[key].js    # API : GET/PUT vers KV (clé "catalogue" ou "gestion")
├── data/
│   ├── catalogue.json       # copie de secours locale (plus la source en direct)
│   └── gestion.json         # idem
├── wrangler.toml            # config pour tester en local
└── README.md
```

## Mise en place (une seule fois)

1. **Pousse le dossier sur GitHub** comme avant (`git add . && git commit -m "..." && git push`).

2. **Crée un compte Cloudflare** (gratuit) sur cloudflare.com si tu n'en as pas.

3. **Crée le namespace KV** :
   - Dashboard Cloudflare → **Workers & Pages** → onglet **KV** → **Create namespace**.
   - Nomme-le par exemple `plants-catalogue-data`.

4. **Crée le projet Pages connecté à GitHub** :
   - Dashboard Cloudflare → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
   - Choisis ton dépôt GitHub (`gestion` ou peu importe son nom).
   - Build command : laisse vide. Dossier de sortie (`Build output directory`) : `/` (racine).
   - Déploie.

5. **Relie le namespace KV au projet** :
   - Dans le projet Pages → **Settings** → **Functions** → **KV namespace bindings** → **Add binding**.
   - Variable name : `DATA_KV` (exactement ce nom, c'est celui utilisé dans le code).
   - KV namespace : celui créé à l'étape 3.

6. **Ajoute la clé d'équipe** (le mot de passe partagé pour pouvoir écrire) :
   - Toujours dans **Settings** → **Environment variables** → **Add variable**.
   - Nom : `ADMIN_KEY`. Valeur : un mot de passe que tu choisis (ex : une phrase que toute l'équipe connaîtra). Coche **Encrypt** pour que ce soit un secret.
   - Fais-le pour les deux environnements (Production **et** Preview) si Cloudflare te les propose séparément.

7. **Redéploie** une fois (Settings → Deployments → ... → Retry deployment) pour que les nouvelles liaisons prennent effet.

Ton site est en ligne à une adresse du type `https://plants-catalogue.pages.dev` (ou ton domaine perso si tu en configures un dans Settings → Custom domains).

## Premier remplissage des données

La base KV démarre vide. Pour l'amorcer avec ce qui est déjà dans `data/catalogue.json` et `data/gestion.json` :

1. Ouvre `https://ton-site.pages.dev/admin.html`.
2. Entre la **clé d'équipe** (celle mise dans `ADMIN_KEY`).
3. **Importer un fichier JSON** → sélectionne `data/catalogue.json`.
4. **Enregistrer** → ça publie ces données dans KV.
5. Fais pareil sur `admin-gestion.html` avec `data/gestion.json`.

Ensuite, plus besoin d'importer : `admin.html` et `admin-gestion.html` chargent automatiquement les données en ligne à l'ouverture.

## Utilisation au quotidien (toute l'équipe)

1. Va sur `https://ton-site.pages.dev/admin.html` (catalogue) ou `admin-gestion.html` (stocks/ventes/CA).
2. Entre la clé d'équipe une fois — elle reste mémorisée dans ce navigateur.
3. Édite, clique **Enregistrer**. C'est immédiatement visible par tous les autres postes.
4. **Télécharger (sauvegarde)** reste disponible à tout moment pour garder une copie locale de secours.

Le catalogue public (`index.html`) se met à jour automatiquement, sans rien à faire de plus.

## Tester en local avant de déployer

```
npm install -g wrangler
wrangler pages dev .
```

Remplace d'abord dans `wrangler.toml` le `id` du namespace KV par le vrai identifiant (visible dans le dashboard Cloudflare, ou récupérable avec `wrangler kv namespace create DATA_KV` si tu veux un namespace de test séparé). Sans cette étape, l'API renverra une erreur de configuration en local — normal, `wrangler pages dev` a besoin de savoir à quelle base KV se connecter.

## Sécurité — à savoir

La clé d'équipe protège l'écriture (impossible de modifier les données sans elle), mais la lecture du catalogue est publique par nature (n'importe qui peut voir `index.html`, c'est voulu). Ce n'est pas un système de comptes individuels : tout le monde dans l'équipe utilise la même clé. Si un jour tu veux des comptes nominatifs (savoir qui a modifié quoi), il faudra passer à quelque chose comme Cloudflare Access — dis-le si ça devient un besoin.

## Prochaine brique possible

- Export du catalogue en PDF (préface, 2e de couverture, fiches variétés).
- Historique des modifications (qui a changé quoi, et quand).
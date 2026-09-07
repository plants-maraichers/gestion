# Catalogue des plants

## Comment ça marche

- `data/catalogue.json` : toutes les données (catégories, espèces, variétés, préface, 4e de couverture).
- `admin.html` : outil local pour éditer ces données avec des formulaires, **sans rien installer**.
- `index.html` : le catalogue public, tel qu'il sera vu en ligne.

## Utilisation au quotidien

1. Ouvre `admin.html` en double-cliquant dessus (ça s'ouvre dans ton navigateur).
2. Clique **Ouvrir catalogue.json** et sélectionne `data/catalogue.json`.
   - Sur Chrome ou Edge : le bouton **Enregistrer** réécrit directement le fichier.
   - Sur Firefox/Safari (pas de support de l'édition directe de fichier) : utilise **Télécharger le JSON** puis remplace le fichier `data/catalogue.json` manuellement par celui téléchargé.
3. Ajoute/modifie tes catégories, espèces, variétés, la préface, la 4e de couverture, le contact.
4. Enregistre.
5. Vérifie le rendu : ouvre un terminal dans le dossier et lance
   ```
   python -m http.server
   ```
   puis va sur `http://localhost:8000` dans ton navigateur (nécessaire car `index.html` charge le JSON via `fetch`, ce qui ne marche pas si tu ouvres juste le fichier directement).
6. Si c'est bon, publie (voir plus bas).

## Publier sur GitHub Pages

1. Crée un dépôt GitHub (ex : `catalogue-plants`).
2. Mets-y `index.html`, le dossier `data/`, et si tu veux `admin.html` (il peut rester dans le repo, ça ne gêne pas — mais tu peux aussi le garder seulement sur ton ordi si tu préfères qu'il reste privé).
3. Dans les paramètres du dépôt → **Pages** → Source : branche `main`, dossier `/ (root)`.
4. Ton catalogue sera visible à `https://<ton-compte>.github.io/<nom-du-repo>/`.
5. À chaque mise à jour : édite en local avec `admin.html`, puis commit + push le nouveau `data/catalogue.json`.

Alternative Cloudflare Pages : tu connectes le même dépôt GitHub, build command vide, dossier de sortie = racine. Utile si tu veux un domaine perso facilement ou si tu ajoutes plus tard des fonctions serveur (Cloudflare Workers) pour d'autres briques.

## Structure des données

```
catalogue.json
├── meta (titre, préface, 4e de couverture, contact)
└── categories[]
    ├── id, nom, description, ordre
    └── especes[]
        ├── id, nom, nom_latin, description
        └── varietes[]
            ├── id, nom, description_courte, description_longue, image
            └── caracteristiques (exposition, semis, plantation, cycle, couleur, hauteur, particularités)
```

## Prochaines briques (pas encore construites)

Elles viendront dans des fichiers JSON séparés qui référencent les `id` de variétés ci-dessus, pour ne jamais toucher au catalogue en le construisant :

- `data/stocks.json` — quantités en stock par variété et par lieu de production.
- `data/production.json` — quantités estimées vs réelles, coûts de production, charges.
- `data/canaux.json` — canaux de distribution (marché, magasin, AMAP, vente directe...).
- `data/ventes.json` — ventes par canal, avec décrément automatique du stock et calcul du CA réel.

Un deuxième outil local (`admin-stocks.html` ou onglet dans `admin.html`) permettra de saisir tout ça, avec un tableau de bord CA estimé / réel et coûts de production.
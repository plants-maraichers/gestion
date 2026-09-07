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

## Brique 2 : stocks, prix, canaux, charges, ventes

- `data/gestion.json` : toutes ces données, dans un seul fichier.
- `admin-gestion.html` : l'outil d'édition, à ouvrir comme `admin.html`.

Utilisation :

1. Ouvre `admin-gestion.html` dans le navigateur.
2. Bouton **1. Charger catalogue.json** → sélectionne `data/catalogue.json` (lecture seule, juste pour avoir la liste des variétés dans les menus déroulants).
3. Bouton **2. Ouvrir gestion.json** → sélectionne `data/gestion.json`.
4. Onglets disponibles :
   - **Canaux** : tes points de vente (marché, magasin, AMAP...).
   - **Stock & coûts** : par variété, quantité estimée / réellement produite, coût de production unitaire estimé / réel. Le **disponible** est calculé automatiquement (produit − vendu), jamais à corriger à la main.
   - **Prix par canal** : un prix différent possible par variété × canal.
   - **Charges globales** : les charges de saison non rattachées à une variété précise (eau, structure...), montant estimé et réel.
   - **Ventes** : formulaire de saisie rapide (variété, canal, quantité, prix pré-rempli depuis l'onglet Prix, mais modifiable), historique complet, suppression possible.
   - **Tableau de bord** : CA estimé vs réel, coûts de production estimés vs réels, marge estimée vs réelle, et le disponible par variété d'un coup d'œil.
5. **Enregistrer** réécrit directement `data/gestion.json` (Chrome/Edge) ou propose de le télécharger (Firefox/Safari, comme pour `admin.html`).

Un exemple est déjà rempli dans `data/gestion.json` (2 variétés, 3 canaux, 2 charges) pour que tu voies le format — remplace-le par tes vraies données au fur et à mesure.

## Prochaine brique possible

- Un export du catalogue en PDF (pour impression) réutilisant `data/catalogue.json`.
- Une vue publique du disponible en temps réel sur `index.html`, si tu veux un jour l'afficher aux clients (actuellement le tableau de bord reste un outil interne, pas publié).
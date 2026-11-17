# Juge UX et mobile — Klone (borne, Masks, motel)

Jugement sur captures seules. Mesures en px CSS, relevées sur les captures (portrait et paysage rendus à 3x, ramenés à 390x844 et 844x390).

## 1. Notes

| Format | Note | Raison principale |
|---|---|---|
| Bureau 1440x900 | 5/10 | Objets lisibles et bien cadrés. Commandes trop petites, sans état actif, signifiants absents dans le motel. |
| Téléphone portrait 390x844 | 3/10 | Environ 40 % de l'écran vide. Aucune cible tactile à 44 px. Commandes dispersées loin de l'objet. |
| Téléphone paysage 844x390 | 4/10 | Meilleure composition sur mobile. Cibles toujours sous 44 px, borne réduite à un tiers de la largeur. |

## 2. Les dix défauts les plus graves

1. Cibles tactiles sous 44 px partout. Tous écrans, mobile surtout.
   Relevés : retour « << » environ 25x15 ; « « » » environ 15x12 ; pastilles environ 14 de haut ; fente de la borne environ 20x28 ; touches du panneau environ 40x17 (portrait) et 36x15 (paysage) ; portrait au mur du motel environ 23x27 (face) et 11x15 (iso, portrait).
   Correction : zone active invisible de 44x44 minimum autour de chaque signe (padding ou calque transparent), le dessin garde sa taille. Sur la borne, zones actives calées sur la grille de caractères, débordant du dessin.

2. La fente de la borne se lit comme un pictogramme « pause ». Borne, tous formats, bas de caisse.
   Les deux barres rouges sous la barre bleue évoquent ⏸, pas une fente à pièces. L'appel principal (« INSERT KOIN ») renvoie à une commande méconnaissable.
   Correction : dessiner une porte à monnaie d'époque, fente verticale unique éclairée en phosphore #ffe3a0, pulsation lente synchronisée avec le clignotement de « INSERT KOIN » à l'écran. Le lien écran-fente se voit alors sans un mot.

3. Le motel en vue de face n'a pas de porte. Motel face, tous formats.
   La porte doit ramener à la borne : elle manque à l'image. Commande promise, objet absent.
   Correction : retenir la vue iso (porte, portrait, télé visibles ensemble) ou ouvrir le cadrage de face sur un mur avec porte. Recommandation tranchée : vue iso, zoomée.

4. Points chauds du motel sans signifiant. Motel, tous formats, télé, portrait, porte.
   Rien ne distingue un objet actif d'un objet de décor (lit, fenêtre, appliques). Sur téléphone, sans survol, le visiteur tape au hasard.
   Correction : un seul langage visuel pour « ceci s'ouvre », sans texte : léger halo ambre qui respire sur les trois objets actifs, renforcé au survol ou au premier toucher ; même halo réutilisé sur la borne et les Masks.

5. Portrait téléphone : 40 % de vide et commandes éclatées. Masks, motel, borne en 390x844.
   Masks : image entre 27 % et 69 % de la hauteur, nom à 72 %, pastilles et retour à 96 %. Motel face : scène de 350x234 au milieu de 844. Le rapport objet/commandes change d'un format à l'autre, contraire à la règle des proportions constantes.
   Correction : un gabarit unique « objet + cartouche » : le cartouche (« « nom » », pastilles) colle sous l'objet à distance fixe en unités de grille, l'ensemble centré ; motel iso cadré plus serré en portrait (sol coupé, objets actifs agrandis) pour occuper environ 70 % de la hauteur.

6. Pastilles d'encre sans état actif ni sens. Masks, tous formats, bas à droite.
   Deux rangées de 4 carrés ; aucune marque de l'option choisie (comparer masks-au et masks-au-phos). Sur Honey Buzzard, la rangée « encre » vire au noir sur fond noir : invisible.
   Correction : deux pastilles seulement (encre, ambre), 44x44, l'active cerclée en phosphore et l'inactive à 40 % d'opacité ; pour un portrait sombre, prendre les deux couleurs les plus claires de sa palette (vert du nœud, blanc du plastron).

7. Touches éteintes du panneau confondues avec le décor. Borne, tous formats, panneau.
   Les touches verte et bleue sont presque noires ; le joystick, très visible, ne promet aucune fonction. Les « .... » sous la touche jaune restent illisibles.
   Correction : touches actives allumées avec une lueur qui déborde sur le panneau (HD-2D en texte), touches inactives assumées mortes ; rendre le joystick fonctionnel (sélection des lieux au clavier et au doigt, la touche choisie s'allume) ou le désactiver visuellement ; remplacer « .... » par un pictogramme du lieu ou le supprimer.

8. Compteur « 01/03 » quasi invisible. Masks, tous formats, haut droit.
   Brun sombre sur fond #0b0908 : contraste estimé sous 2:1, et isolé loin du nom.
   Correction : trois points ● ○ ○ sous le nom, dans le cartouche, l'actif en ambre ; supprime du texte et rapproche l'information de la commande.

9. Retour « << » incohérent en couleur et en distance. Masks et motel, tous formats, bas gauche.
   Seul signe rouge ; collé au coin, très loin de l'objet sur bureau ; rien sur la borne pour signaler qu'elle est la racine. Le motel offre deux retours (« << » et la porte) sans lien visible entre eux.
   Correction : garder « << » rouge (identité Baku Boom) mais en 44x44, marge égale en unités de grille sur tous formats ; quand on survole ou touche la porte du motel, « << » s'allume en même temps, ce qui montre que les deux mènent au même endroit.

10. Borne trop petite en paysage et en portrait. Borne, 844x390 et 390x844.
    Paysage : la caisse occupe environ 34 % de la largeur, panneau et fente minuscules. Portrait : caisse sur 37 % de la hauteur, le reste vide. Le fronton se brouille en paysage au point de devenir illisible.
    Correction : sur mobile, cadrer en plongée sur écran, panneau et fente (fronton partiellement hors champ en paysage), objet à environ 90 % de la dimension contrainte ; limiter le glitch du fronton à des bouffées courtes, avec retour à l'état lisible.

## 3. Ce qui fonctionne

- Retour « << » placé de façon identique sur toutes les pages : bon repère.
- « « nom » » : commande comprise sans aide, pictogramme juste.
- Vue iso du motel : la seule qui montre les trois commandes du lieu ensemble.
- Paysage : composition la plus proche du bureau, donc la plus fidèle à la règle des proportions.

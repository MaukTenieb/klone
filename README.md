# Klone

Klone refait Insert Koin en mode texte. Chaque image de la page est du texte : des caractères Unscii, deux encres par case, des quarts de bloc, comme l'art ANSI des BBS et le PETSCII du Commodore 64.

Site : https://mauktenieb.github.io/klone/

## Lieux

- `index.html` : la borne. Le tube de l'enseigne et l'écran éclairent le meuble ; une trame de Bayer dégrade la lumière sur chaque matière. L'enseigne affiche INSERT KOIN, et par moments INTERSEKTION, NOIR INSEKT, SEKTOR INN. Au repos, l'écran montre SkopoRhogo : la chambre des Masks à l'heure du visiteur ; chacun change de place au fil des minutes, dort la nuit, sort le jour. La fente prend une Koin, les touches allumées ouvrent les lieux, la manette se règle aux flèches. La note barrée ouvre le son : ronronnement, Koin, touches, néon, enregistrements réels du domaine public (`snd/SOURCES.md`).
- `masks.html` : les dix-huit Masks de la Korhogo Fauna, en deux encres : les couleurs du Mask, ou le phosphore ambre de la borne. `masks.html#aube` ouvre un Mask donné.

## Fabrication des Masks

`tools/masks/fabrique.sh` part des dessins de Mauk Tenieb (dépôt insertkoin, `mask-*.webp`), réduit chaque dessin en pixels sur une palette fermée de douze encres, garde le trait noir, remplace le fond par la salle, pose le contre-jour du néon, puis encode deux pixels sur deux en une case de texte. Les scripts `retouche_*.py` reprennent à la main les yeux, les sourcils, la bouche et les couleurs propres à chaque Mask. Les cartes `.pix` gardent chaque pixel en lettre : elles se corrigent dans un éditeur de texte.

Les quinze autres Masks passent par `tools/masks18/fabrique18.py` : cadrage automatique sur la figure, même chaîne.

## Lettres

Unscii 8 (domaine public, viznut) pour toute image ; VT323 et Press Start 2P pour les plaques et les commandes.
- `motel.html` : la chambre du Motel Korhogo, une scène 3D rendue en pixels puis en texte, en vraie isométrie 2:1. Les deux appliques et la télé éclairent l'enduit, la moquette, la couverture tissée. La caméra suit le pointeur ou l'inclinaison du téléphone. La télé change de chaîne au toucher, le portrait mène aux Masks, la porte ramène à la borne.
- `motel-face.html` : la même chambre, de face, à hauteur d.yeux (variante écartée par les juges, gardée pour comparaison).

## Haoma

`haoma.js` pose une lentille sur chaque lieu, entre le dessin et l'encodage en texte. Le Haoma de l'Avesta, le Soma védique, l'amanite tue-mouches de Wasson : la perception change, les lieux et les jeux restent les mêmes.

- Une dose : la palette coule vers l'amanite (nuit, ecchymose, vermillon, safran, or vert, os) ; la pièce respire neuf secondes par souffle.
- Deux doses : la pupille s'ouvre et chaque lumière bave ; les verrues de l'amanite poussent sur les surfaces claires ; l'image d'avant traîne ; les yeux des dix mille espions de Mithra s'ouvrent dans le noir et suivent le pointeur.
- Trois doses : la pièce enfle et rétrécit toutes les vingt-trois secondes ; un scarabée longe les murs ; des lettres deviennent H, O, M.
- Quatre doses : tout blanchit, retour à jeun.

La dose suit le kandiKtat d'un lieu à l'autre : montée quinze secondes, plateau sept minutes, descente trois minutes. Avec la note ouverte, deux sinus battent sous le souffle.

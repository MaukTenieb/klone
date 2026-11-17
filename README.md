# Klone

Klone refait Insert Koin en mode texte. Chaque image de la page est du texte : des caractères Unscii, deux encres par case, des quarts de bloc, comme l'art ANSI des BBS et le PETSCII du Commodore 64.

Site : https://mauktenieb.github.io/klone/

## Lieux

- `index.html` : la borne. Le tube de l'enseigne et l'écran éclairent le meuble ; une trame de Bayer dégrade la lumière sur chaque matière. L'enseigne affiche INSERT KOIN, et par moments INTERSEKTION, NOIR INSEKT, SEKTOR INN. La fente prend une Koin, les touches allumées ouvrent les lieux, la manette se règle aux flèches.
- `masks.html` : les Masks de la Korhogo Fauna, en deux encres : les couleurs du Mask, ou le phosphore ambre de la borne.

## Fabrication des Masks

`tools/masks/fabrique.sh` part des dessins de Mauk Tenieb (dépôt insertkoin, `mask-*.webp`), réduit chaque dessin en pixels sur une palette fermée de douze encres, garde le trait noir, remplace le fond par la salle, pose le contre-jour du néon, puis encode deux pixels sur deux en une case de texte. Les scripts `retouche_*.py` reprennent à la main les yeux, les sourcils, la bouche et les couleurs propres à chaque Mask. Les cartes `.pix` gardent chaque pixel en lettre : elles se corrigent dans un éditeur de texte.

## Lettres

Unscii 8 (domaine public, viznut) pour toute image ; VT323 et Press Start 2P pour les plaques et les commandes.

# Site Tiply — version éclatée

Reprise du fichier unique `tiply-site-export/index.html` (7,3 Mo, tout en base64
inline) en un site statique classique. L'original est intact dans
`../tiply-site/tiply-site-export/`.

## Structure

```
index.html          balisage seul (53 Ko)
css/style.css       feuille de styles (49 Ko)
js/app.js           comportement (30 Ko)
assets/             images WebP, vidéo, image de partage, icône Apple
favicon.svg         le « t » du logo
robots.txt          + sitemap.xml
```

## Poids

|                            | avant    | après                    |
|----------------------------|----------|--------------------------|
| Document HTML              | 7,3 Mo   | 53 Ko                    |
| Images                     | 2,6 Mo   | 719 Ko (WebP)            |
| Vidéo du hero              | 1,3 Mo   | 101 Ko                   |
| Chargé avant le 1er pixel  | 7,3 Mo   | 140 Ko                   |
| Site complet               | 7,3 Mo   | 1,03 Mo                  |

Le HTML ne transporte plus les médias : ils sont mis en cache par le navigateur
et ne sont plus retéléchargés à chaque visite.

## Le formulaire de contact

**Il ne fonctionnait pas.** Aucun `action`, aucun gestionnaire de soumission :
le visiteur remplissait, cliquait, la page se rechargeait et la demande était
perdue. C'était le seul point de conversion du site.

Il est maintenant **branché sur Formspree** et vérifié par des envois réels :

```js
const FORM_ENDPOINT = 'https://formspree.io/f/maqdaraz';
```

Le visiteur ne quitte plus la page : le bouton passe à « Envoi… », puis le
message de remerciement s'affiche et le formulaire se vide. Les demandes
arrivent sur `hachahbar@litesoft.fr`.

Le mail reçu porte en objet `Tiply — <nom> (<type d'établissement>)` et
contient cinq lignes : Nom, email, Téléphone, Établissement, Message.

Deux pièges rencontrés en le mettant au point, à ne pas réintroduire :

- **Une seule clé pour l'adresse.** Formspree affiche dans le corps du mail
  toutes les clés reçues. Envoyer à la fois `Email` (pour l'affichage) et
  `email` (pour la réponse) faisait apparaître l'adresse deux fois.
- **`_replyto` n'est pas une directive.** Contrairement à `_subject`, il n'est
  pas interprété : il s'affichait littéralement, sous l'intitulé `_replyto`.
  C'est bien un champ nommé `email`, en minuscules, qui règle le « Répondre à ».

D'où l'intitulé `email` en minuscules dans le mail : c'est le nom exact que
Formspree reconnaît, et le renommer casserait la réponse directe au visiteur.

**Quota du plan gratuit : 50 envois par mois.** Au-delà, Formspree bloque les
soumissions — à surveiller si le site prend du trafic.

### Ce qui se passe en cas de pépin

Aucun scénario ne fait perdre une demande. Tous ont été éprouvés contre un
faux service reproduisant les réponses réelles :

| Situation | Comportement |
|---|---|
| Formspree accepte | Remerciement, formulaire vidé |
| Formspree refuse | Son message d'erreur est affiché tel quel |
| Panne serveur (500) | Message d'erreur + adresse directe, **saisie conservée** |
| Coupure réseau | Idem — le visiteur peut réessayer sans retaper |

Les erreurs techniques ne remontent jamais à l'écran : seuls les messages
renvoyés par le service sont montrés. Un visiteur ne doit pas lire
« Failed to fetch ».

Un champ piège invisible (`_gotcha`, le nom que Formspree reconnaît) rejette
les robots **avant tout appel réseau** — ils reçoivent un faux message de
succès, et le quota mensuel n'est pas entamé.

### Changer de service

`chargeUtile()` dans `js/app.js` produit une charge compatible Formspree,
FormSubmit, Web3Forms ou un endpoint maison, et `estUnSucces()` sait lire les
quatre formes de réponse. Pour basculer, il suffit de remplacer l'URL — et de
renseigner `FORM_ACCESS_KEY` si le service en réclame une (Web3Forms).

Repasser `FORM_ENDPOINT` à `null` rétablit le repli sans serveur : ouverture de
la messagerie du visiteur, avec l'adresse cliquable et un bouton « copier mon
message » affichés **avant** la tentative d'ouverture — de sorte que même sans
client mail configuré (fréquent sur mobile), rien ne se perd.

## Ce qui reste à faire

**Une seule chose : vérifier Matomo côté serveur.** Le suivi est passé en mesure d'audience sans
cookie et respecte Do Not Track, ce qui le rend exempt de bandeau de
consentement — à condition que l'anonymisation d'IP soit active sur le site 8
de `stats.litesoft.fr`. Le pied de page affiche « RGPD conforme », autant que
ce soit vrai.

**Adresse de publication.** Les balises canonical, Open Graph et le sitemap
pointent vers `https://haksxv3.github.io/tiply-site/`. À mettre à jour en cas
de nom de domaine propre.

## Corrections apportées

**Bugs**

- Formulaire de contact sans destination (voir plus haut).
- Le dégradé du titre ne s'affichait jamais : la machine à écrire concaténait
  `'<span class="grad">'` dans `innerHTML`, que le navigateur refermait aussitôt,
  si bien que le texte atterrissait hors du span. Réécrit avec de vrais nœuds DOM.
- `<div class="wrap sec" id="metiers" class="cs-section">` : deuxième attribut
  `class` ignoré par le parseur, `.cs-section` ne s'appliquait pas.
- Second système d'étoiles filantes invisible : sa boucle dessinait sur le même
  canvas que les particules, dont le `clearRect` l'effaçait à chaque image.
  Supprimé (avec son bug de `splice` pendant un `forEach`).
- Balises `</body></html></body>` en fin de document.
- Deux `clipPath id="lcp"` identiques dans la page (nav et pied de page).
- Deux `IntersectionObserver` pour un seul effet de révélation, dont un posant
  une classe `.vis` dont plus aucune règle CSS ne dépendait.
- Deux gestionnaires `mousemove` concurrents sur les cartes chiffrées, écrivant
  tour à tour le même `style.transform`.
- Boucle d'animation permanente qui ne servait qu'à recopier une position ;
  fusionnée dans celle qui la produit.

**Performance**

- Vidéo et images sorties du HTML, PNG convertis en WebP.
- Vidéo du hero réencodée : 1 308 Ko → 101 Ko. Elle était en 1080×1920 pour un
  affichage à 196×425, et transportait une piste audio de 316 kbit/s alors
  qu'elle est muette. Ramenée à 440×782, H.264 CRF 28, sans audio — mesuré à
  40,5 dB de PSNR, soit visuellement identique. Image d'attente (`hero-poster.webp`,
  0,7 Ko) affichée le temps du chargement.
- Vignettes du carrousel en 220 px au lieu de l'image pleine résolution.
- Vidéo chargée après la première peinture, pour ne plus concurrencer
  l'affichage du titre.
- `width`/`height` sur toutes les images (évite les sauts de mise en page).
- Particules et mascotte suspendues hors écran et en arrière-plan ; elles
  tournaient en permanence, y compris en pied de page.

**Accessibilité**

- Focus clavier visible : il n'existait aucun style de focus sur tout le site.
- Étiquettes de formulaire reliées à leur champ (`for`/`id`) — aucune ne l'était.
- FAQ et bascule mensuel/annuel utilisables au clavier, avec `aria-expanded`
  et `aria-checked` tenus à jour.
- `prefers-reduced-motion` respecté : animations coupées, mascotte et
  particules retirées.
- Retour de formulaire annoncé aux lecteurs d'écran (`role="status"`).
- Logos décoratifs masqués aux lecteurs d'écran, mascotte en `alt=""`.

**Référencement et partage**

- Le `<h1>` et les trois chiffres clés étaient absents du HTML (écrits par
  JavaScript). Ils y figurent désormais, et restent lisibles sans JS.
- Image de partage Open Graph (elle manquait alors que `summary_large_image`
  était déclaré), favicon, icône Apple, `theme-color`.
- `robots.txt` et `sitemap.xml`.
- Repli `<noscript>` : sans JavaScript, la page entière serait restée
  invisible, tout le contenu démarrant à `opacity:0`.

## Aperçu local

```bash
python -m http.server 8787 --directory "C:\Users\haks\Downloads\site tiply\tiply-site-v2"
```

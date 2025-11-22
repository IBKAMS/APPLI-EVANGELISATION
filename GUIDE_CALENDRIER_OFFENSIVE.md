# 📅 GUIDE - Calendrier Interactif "Posséder la Terre"

## 📖 Vue d'ensemble

Ce composant affiche un calendrier interactif de 21 jours pour l'offensive spirituelle "Posséder la Terre" (16 novembre - 6 décembre 2025).

---

## 🎯 Fonctionnalités

### 1. **Grille de 21 carrés** (représentant 21 jours)
- Chaque carré affiche :
  - 👣 Une icône de "marche" (symbolise fouler la terre)
  - 📅 Le numéro du jour (16, 17, 18...)
  - 📆 Le mois (nov., déc.)

### 2. **Code couleur automatique**
- 🟢 **VERT** : Jours passés
- 🟢 **VERT + SCINTILLEMENT** : Jour actuel (aujourd'hui)
- 🟫 **TERRE/MARRON** : Jours futurs

### 3. **Interactions**
- **Au survol** : Le carré s'agrandit légèrement
- **Au clic** : Une fenêtre popup s'ouvre avec le détail du sous-thème du jour

---

## 🔧 MODE SIMULATION (pour tester avant 2025)

### Où modifier la date de test ?

Ouvrez le fichier : **`frontend-user/src/pages/Actualites.js`**

Cherchez cette ligne (vers la ligne 151) :

```javascript
const simulatedDate = new Date('2025-11-21'); // ← CHANGEZ ICI POUR TESTER
```

### Exemples de dates à tester :

```javascript
// Pour tester le PREMIER JOUR (16 novembre)
const simulatedDate = new Date('2025-11-16');

// Pour tester le JOUR 6 (21 novembre) - jour actuel dans la démo
const simulatedDate = new Date('2025-11-21');

// Pour tester le DERNIER JOUR (6 décembre)
const simulatedDate = new Date('2025-12-06');

// Pour utiliser la DATE RÉELLE du système (en production)
const simulatedDate = null;
```

---

## 🎨 Personnalisation des couleurs

### Changer la couleur "VERT" (jours passés)

Ligne 278 :
```javascript
backgroundColor: status === 'past' ? '#4caf50' : // ← Changez #4caf50
```

### Changer la couleur "TERRE" (jours futurs)

Ligne 280 :
```javascript
'#8B4513', // ← Changez #8B4513
```

### Changer la couleur du scintillement (jour actuel)

Lignes 304-309 :
```javascript
boxShadow: '0 0 10px #ffd700, 0 0 20px #ffd700', // ← Changez #ffd700 (doré)
```

---

## 📊 Structure des données (21 sous-thèmes)

Les données se trouvent **en haut du fichier** (lignes 36-58) :

```javascript
const sousThemes = [
  {
    jour: 1,
    date: '2025-11-16',
    titre: "Récupère le pouvoir de domination perdu par la chute",
    reference: "Genèse 3:17-19",
    chapitre: "Chapitre 1"
  },
  // ... 20 autres jours
];
```

### Comment ajouter ou modifier un sous-thème ?

```javascript
{
  jour: 22,                          // Numéro du jour (1 à 21+)
  date: '2025-12-07',               // Format AAAA-MM-JJ
  titre: "Votre titre ici",         // Titre du sous-thème
  reference: "Jean 3:16",           // Référence biblique
  chapitre: "Chapitre bonus"        // Nom du chapitre
}
```

---

## 🖼️ Disposition de la grille

### Nombre de carrés par ligne

Actuellement : **4 carrés par ligne**

Pour changer cela, modifiez la ligne 270 :

```javascript
<Grid item xs={3} key={theme.jour}>
```

- `xs={3}` = 4 carrés par ligne (3/12 de largeur chacun)
- `xs={4}` = 3 carrés par ligne
- `xs={2}` = 6 carrés par ligne
- `xs={6}` = 2 carrés par ligne

---

## 🎬 Animation du scintillement

L'animation se répète toutes les **1,5 secondes**.

Pour changer la vitesse, ligne 292 :

```javascript
animation: status === 'current' ? 'sparkle 1.5s infinite' : 'none',
//                                          ^^^^
//                                    Changez 1.5s → 2s (plus lent)
//                                               → 1s (plus rapide)
```

---

## 💬 Fenêtre popup (Modal) du sous-thème

### Structure du modal (lignes 787-816)

Quand on clique sur un carré, le modal affiche :

1. **En-tête bleu** : Date + Chapitre
2. **Icône de marche** : Grande icône centrée
3. **Titre du sous-thème**
4. **Référence biblique** : Dans un encadré orange

### Personnaliser les couleurs du modal

**Fond de l'en-tête** (ligne 795) :
```javascript
sx={{ backgroundColor: '#0047AB', color: 'white' }}
//                      ^^^^^^^^ Bleu Rehoboth
```

**Encadré de la référence biblique** (ligne 825) :
```javascript
backgroundColor: '#FFA500', // Orange Rehoboth
```

---

## 🧩 Où se trouve chaque partie du code ?

| Élément | Ligne(s) | Description |
|---------|----------|-------------|
| **Données des 21 jours** | 36-58 | Tableau `sousThemes` |
| **Mode simulation** | 151 | Variable `simulatedDate` |
| **Fonction de calcul du statut** | 155-166 | `getDayStatus()` |
| **Grille de carrés** | 258-337 | Boucle `.map()` |
| **Animation scintillement** | 302-311 | `@keyframes sparkle` |
| **Modal (popup)** | 787-851 | Composant `<Dialog>` |

---

## 🚀 Comment tester votre calendrier ?

### Étape 1 : Modifier la date simulée
```javascript
const simulatedDate = new Date('2025-11-21'); // Jour 6
```

### Étape 2 : Actualiser votre navigateur
Le carré du **21 novembre** devrait maintenant **scintiller en doré**.

### Étape 3 : Tester les clics
- Cliquez sur n'importe quel carré
- Une fenêtre doit s'ouvrir avec le sous-thème du jour

---

## ❓ Questions fréquentes

### 1. Comment changer l'icône de pieds ?

Remplacez `DirectionsWalk` par une autre icône Material-UI :

```javascript
import { Hiking, DirectionsRun, NordicWalking } from '@mui/icons-material';

// Puis dans le code :
<Hiking sx={{ fontSize: 16, color: 'white' }} />
```

### 2. Comment rendre les carrés plus grands ?

Actuellement, la taille s'adapte automatiquement (`aspectRatio: '1'`).

Pour forcer une taille, ajoutez ligne 275 :
```javascript
sx={{
  width: '80px',  // ← Ajoutez cette ligne
  height: '80px', // ← Et celle-ci
  // ... reste du code
}}
```

### 3. Comment désactiver le scintillement ?

Ligne 292, remplacez par :
```javascript
animation: 'none', // Plus de scintillement
```

### 4. Le calendrier ne s'affiche pas ?

Vérifiez :
1. Que vous êtes sur la page **Actualités** (`/actualites`)
2. Que vous êtes **connecté** (route protégée)
3. Qu'il n'y a pas d'erreurs dans la console du navigateur (F12)

---

## 📝 Récapitulatif pour débutants

### Fichier principal
**`frontend-user/src/pages/Actualites.js`**

### Les 3 éléments clés à personnaliser :

1. **Date de test** (ligne 151) :
   ```javascript
   const simulatedDate = new Date('2025-11-21');
   ```

2. **Couleurs** (lignes 278-280) :
   ```javascript
   backgroundColor: status === 'past' ? '#4caf50' : '#8B4513'
   ```

3. **Données des jours** (lignes 36-58) :
   ```javascript
   const sousThemes = [ ... ]
   ```

---

## 🎉 Vous êtes prêt !

Votre calendrier interactif est maintenant **100% fonctionnel** et **entièrement personnalisable**.

Pour toute question, consultez les commentaires dans le code (marqués par des emojis 🎨 📅 ✨).

---

**Généré pour l'application d'évangélisation - Centre Missionnaire REHOBOTH**

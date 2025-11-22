# 🙏 REHOBOTH - Application d'Évangélisation et de Suivi des Âmes

Application web complète pour le Centre Missionnaire REHOBOTH Côte d'Ivoire, permettant l'évangélisation, le suivi des âmes et la formation des nouveaux convertis.

## 📋 Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Fonctionnalités](#fonctionnalités)
- [Architecture](#architecture)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Technologies utilisées](#technologies-utilisées)
- [Structure du projet](#structure-du-projet)

## 🎯 Vue d'ensemble

REHOBOTH Connect est une plateforme numérique complète qui permet :

- **Aux évangélisateurs** : D'enregistrer et suivre les personnes rencontrées lors des campagnes
- **Aux administrateurs** : De gérer les contacts, suivre les conversions et mesurer l'impact
- **Aux nouveaux convertis** : D'accéder à des ressources bibliques et parcours de formation

## ✨ Fonctionnalités

### Pour les Évangélisateurs
- ✅ Enregistrement rapide des contacts lors des campagnes
- 📱 Interface mobile-first pour une utilisation sur le terrain
- 📚 Accès aux ressources d'évangélisation (versets, guides pratiques)
- 👥 Suivi personnalisé de chaque âme rencontrée
- 📊 Tableau de bord de mes contacts

### Pour les Administrateurs
- 📈 Statistiques et rapports d'évangélisation
- 🔍 Recherche et filtrage avancés
- 📅 Planification de suivis et rappels
- 👨‍👩‍👧‍👦 Gestion des membres et assiduité
- 🎓 Création de parcours de formation

### Ressources Spirituelles
- 📖 Bibliothèque de versets bibliques
- 🎥 Parcours de formation vidéo/audio
- ❓ Réponses aux questions courantes
- 🙌 Témoignages inspirants

## 🏗️ Architecture

Le projet est organisé en 3 parties :

```
APPLI EVANGELISATION/
├── backend/              # API Node.js + MongoDB
├── frontend-user/        # Interface utilisateur (React)
└── frontend-admin/       # Interface administrateur (À développer)
```

### Backend (API)
- **Framework** : Express.js
- **Base de données** : MongoDB avec Mongoose
- **Authentification** : JWT (JSON Web Tokens)
- **Sécurité** : bcryptjs pour le hachage des mots de passe

### Frontend Utilisateur
- **Framework** : React 18
- **UI Library** : Material-UI (MUI)
- **Routing** : React Router v6
- **HTTP Client** : Axios

## 📦 Installation

### Prérequis

- Node.js (version 16 ou supérieure)
- MongoDB (installé localement ou compte MongoDB Atlas)
- npm ou yarn

### Étape 1 : Cloner le projet

```bash
cd Desktop
cd "APPLI EVANGELISATION"
```

### Étape 2 : Installer et démarrer le Backend

```bash
# Aller dans le dossier backend
cd backend

# Installer les dépendances
npm install

# Configurer les variables d'environnement
# Éditez le fichier .env et ajustez si nécessaire

# Démarrer MongoDB localement (dans un nouveau terminal)
mongod

# Démarrer le serveur backend
npm start
```

Le serveur backend sera accessible sur `http://localhost:5000`

### Étape 3 : Installer et démarrer le Frontend

```bash
# Ouvrir un nouveau terminal
cd "APPLI EVANGELISATION/frontend-user"

# Installer les dépendances
npm install

# Démarrer l'application React
npm start
```

L'application frontend s'ouvrira automatiquement sur `http://localhost:3000`

## 🚀 Utilisation

### Première utilisation

1. **Créer un compte**
   - Accédez à `http://localhost:3000/register`
   - Remplissez le formulaire d'inscription
   - Cliquez sur "S'inscrire"

2. **Se connecter**
   - Utilisez vos identifiants pour vous connecter
   - Vous serez redirigé vers le tableau de bord

3. **Enregistrer une âme**
   - Cliquez sur "Enregistrer une Âme"
   - Remplissez le formulaire en 3 étapes
   - Soumettez l'enregistrement

4. **Consulter vos contacts**
   - Allez dans "Mes Contacts"
   - Filtrez par statut spirituel
   - Cliquez sur "Voir" pour les détails

### Utilisation sur mobile

L'application est entièrement responsive et optimisée pour mobile :
- Interface adaptée aux petits écrans
- Navigation par menu hamburger
- Formulaires tactiles optimisés

## 🛠️ Technologies utilisées

### Backend
- **Express.js** - Framework web Node.js
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM pour MongoDB
- **JWT** - Authentification par tokens
- **bcryptjs** - Hachage des mots de passe
- **cors** - Gestion des requêtes cross-origin

### Frontend
- **React 18** - Bibliothèque UI
- **Material-UI (MUI)** - Composants UI modernes
- **React Router** - Navigation
- **Axios** - Client HTTP
- **Context API** - Gestion d'état

## 📁 Structure du projet

### Backend
```
backend/
├── config/
│   └── database.js          # Configuration MongoDB
├── models/
│   ├── User.js              # Modèle Utilisateur
│   ├── Ame.js               # Modèle Âme (contacts)
│   ├── Parcours.js          # Modèle Parcours de formation
│   ├── Ressource.js         # Modèle Ressources bibliques
│   └── Campagne.js          # Modèle Campagnes d'évangélisation
├── controllers/
│   ├── authController.js    # Logique d'authentification
│   ├── ameController.js     # Logique de gestion des âmes
│   ├── parcoursController.js
│   └── ressourceController.js
├── routes/
│   ├── auth.js              # Routes d'authentification
│   ├── ames.js              # Routes de gestion des âmes
│   ├── parcours.js
│   └── ressources.js
├── middleware/
│   └── auth.js              # Middleware de protection des routes
├── server.js                # Point d'entrée du serveur
└── .env                     # Variables d'environnement
```

### Frontend Utilisateur
```
frontend-user/
├── src/
│   ├── components/
│   │   ├── Navbar.js        # Barre de navigation
│   │   └── PrivateRoute.js  # Route protégée
│   ├── pages/
│   │   ├── Login.js         # Page de connexion
│   │   ├── Register.js      # Page d'inscription
│   │   ├── Home.js          # Page d'accueil
│   │   ├── EnregistrerAme.js # Formulaire d'enregistrement
│   │   ├── MesAmes.js       # Liste des contacts
│   │   └── Ressources.js    # Ressources d'évangélisation
│   ├── context/
│   │   └── AuthContext.js   # Context d'authentification
│   ├── services/
│   │   └── api.js           # Configuration API Axios
│   ├── App.js               # Composant principal
│   └── index.js             # Point d'entrée React
└── .env                     # Variables d'environnement
```

## 🔐 Modèles de données

### Utilisateur (User)
- Nom, prénom, email, téléphone
- Mot de passe (haché)
- Rôle : évangélisateur, admin, pasteur
- Statut : actif, inactif, suspendu

### Âme (Contact)
- **Informations personnelles** : nom, prénom, contact, adresse
- **Démographie** : âge, sexe, situation matrimoniale, profession
- **Informations spirituelles** : statut spirituel, besoins de prière
- **Rencontre** : type, lieu, date, campagne
- **Suivi** : historique des contacts, prochaine date de suivi
- **Formation** : parcours suivis, progression
- **Assiduité** : présences aux programmes

### Parcours de Formation
- Titre, description, niveau (Fondation, Croissance, Maturité, Leadership)
- Leçons : contenu, vidéos, quiz, versets bibliques
- Ressources complémentaires
- Statistiques : inscrits, taux de réussite

### Ressource
- Titre, description, catégorie
- Type : Texte, Vidéo, Audio, PDF
- Versets bibliques associés
- Compteurs de vues et partages

## 🎨 Personnalisation

### Couleurs du thème
Modifiez les couleurs dans `frontend-user/src/App.js` :

```javascript
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',  // Bleu principal
    },
    secondary: {
      main: '#9c27b0',  // Violet secondaire
    },
  },
});
```

## 📞 Support

Pour toute question ou assistance :
- **Email** : support@rehoboth.ci
- **Téléphone** : +225 XX XX XX XX XX

## 📝 License

Ce projet est développé pour le Centre Missionnaire REHOBOTH Côte d'Ivoire.

---

## 🙏 Vision

> "Allez, faites de toutes les nations des disciples, les baptisant au nom du Père, du Fils et du Saint-Esprit, et enseignez-leur à observer tout ce que je vous ai prescrit." - Matthieu 28:19-20

Cette application est conçue pour équiper chaque membre du Centre Missionnaire REHOBOTH avec les outils nécessaires pour accomplir la Grande Commission à l'ère numérique.

---

**Développé avec ❤️ pour le Royaume de Dieu**

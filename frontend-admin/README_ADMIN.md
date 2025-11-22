# 🛡️ Frontend Administration - REHOBOTH

Interface d'administration pour le Centre Missionnaire REHOBOTH - Côte d'Ivoire

## 🎯 Description

Application web d'administration permettant aux administrateurs et pasteurs de gérer:
- Les évangélisateurs
- Les âmes enregistrées
- Les ressources bibliques
- Les parcours de formation
- Les campagnes d'évangélisation
- Les statistiques et rapports

## 🚀 Démarrage Rapide

### Prérequis
- Node.js (v16+)
- Backend API en cours d'exécution sur le port 5000

### Installation
```bash
npm install
```

### Lancement
```bash
npm start
```

L'application sera accessible sur **http://localhost:3001**

## 🔐 Connexion

### Identifiants Admin par défaut
- **Email:** admin@rehoboth.ci
- **Mot de passe:** Admin123!

**Important:** Seuls les comptes avec le rôle `admin` ou `pasteur` peuvent accéder à l'interface d'administration.

## 📋 Fonctionnalités

### 1. **Tableau de Bord**
- Vue d'ensemble des statistiques
- Nombre d'évangélisateurs
- Nombre d'âmes enregistrées
- Ressources disponibles
- Taux de conversion
- Liste des âmes récemment enregistrées

### 2. **Gestion des Utilisateurs**
- Liste de tous les évangélisateurs
- Affichage des rôles (Admin, Pasteur, Évangélisateur)
- Actions de modification et suppression

### 3. **Âmes Enregistrées**
- Liste complète de toutes les âmes
- Filtres par statut spirituel et ville
- Vue détaillée des informations
- Suivi de l'évangélisateur associé

### 4. **Ressources Bibliques**
- Catalogue des ressources
- Catégories et types
- Nombre de partages
- Gestion des contenus

### 5. **Parcours de Formation**
- (En développement)

### 6. **Campagnes**
- (En développement)

### 7. **Statistiques**
- (En développement)

## 🎨 Design

### Couleurs REHOBOTH
- **Bleu Principal:** #0047AB
- **Rouge Secondaire:** #E31E24
- **Orange/Jaune:** #FFA500

### Composants
- **Material-UI (MUI) v5:** Framework UI principal
- **Sidebar Navigation:** Menu latéral avec icônes
- **AppBar:** Barre supérieure avec gradient REHOBOTH
- **Tables:** Affichage des données avec filtres
- **Cards:** Cartes statistiques avec icônes

## 📂 Structure du Projet

```
frontend-admin/
├── public/
│   └── logo-rehoboth.png
├── src/
│   ├── assets/
│   │   └── logo-rehoboth.png
│   ├── components/
│   │   ├── AdminLayout.js        # Layout principal avec sidebar
│   │   └── PrivateRoute.js       # Protection des routes
│   ├── context/
│   │   └── AuthContext.js        # Gestion de l'authentification
│   ├── pages/
│   │   ├── Login.js              # Page de connexion
│   │   ├── Dashboard.js          # Tableau de bord
│   │   ├── Utilisateurs.js       # Gestion utilisateurs
│   │   ├── Ames.js               # Gestion des âmes
│   │   ├── Ressources.js         # Gestion ressources
│   │   ├── Parcours.js           # Parcours de formation
│   │   ├── Campagnes.js          # Campagnes
│   │   └── Statistiques.js       # Statistiques
│   ├── services/
│   │   └── api.js                # Configuration Axios
│   ├── App.js                    # Composant principal
│   └── index.js                  # Point d'entrée
├── .env                          # Variables d'environnement
└── package.json
```

## 🔧 Configuration

### Fichier .env
```
REACT_APP_API_URL=http://localhost:5000/api
PORT=3001
```

## 🌐 Routes

| Route | Description | Protection |
|-------|-------------|------------|
| `/login` | Page de connexion | Public |
| `/` | Tableau de bord | Privé (Admin/Pasteur) |
| `/utilisateurs` | Gestion utilisateurs | Privé (Admin/Pasteur) |
| `/ames` | Âmes enregistrées | Privé (Admin/Pasteur) |
| `/ressources` | Ressources | Privé (Admin/Pasteur) |
| `/parcours` | Parcours | Privé (Admin/Pasteur) |
| `/campagnes` | Campagnes | Privé (Admin/Pasteur) |
| `/statistiques` | Statistiques | Privé (Admin/Pasteur) |

## 🛠️ Technologies Utilisées

- **React 18**
- **React Router v6**
- **Material-UI (MUI) v5**
- **Axios**
- **Recharts** (pour les graphiques futurs)
- **date-fns** (manipulation de dates)

## 📱 Responsive Design

L'interface s'adapte automatiquement aux différentes tailles d'écran:
- **Desktop:** Sidebar permanente + contenu large
- **Tablet:** Sidebar rétractable + contenu adapté
- **Mobile:** Menu hamburger + contenu en pleine largeur

## 🔒 Sécurité

- **JWT Authentication:** Tokens stockés dans localStorage
- **Protection des routes:** Redirection automatique si non authentifié
- **Vérification des rôles:** Seuls admin et pasteur peuvent accéder
- **Intercepteurs Axios:** Ajout automatique du token aux requêtes

## 🚧 Fonctionnalités à Venir

- [ ] Création et modification de ressources
- [ ] Gestion complète des parcours de formation
- [ ] Création et suivi de campagnes
- [ ] Graphiques et statistiques avancées
- [ ] Export de données (Excel, PDF)
- [ ] Notifications en temps réel
- [ ] Gestion des permissions granulaires
- [ ] Logs d'activité

## 📞 Support

Pour toute question concernant l'interface d'administration:

**Support Technique:**
- Email: support@rehoboth.ci

**Développement:**
- ALiz Strategy
- Email: dev@alizstrategy.com

---

**Version:** 1.0.0
**Date:** Novembre 2025
**Développé avec ❤️ pour le Royaume de Dieu**
**Powered by ALiz Strategy**

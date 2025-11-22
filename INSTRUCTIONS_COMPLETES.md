# 📖 Instructions Complètes - REHOBOTH Connect

## 🎯 Objectif
Ce document vous guide pas à pas pour mettre en route l'application d'évangélisation REHOBOTH.

---

## 📋 Prérequis à vérifier

Avant de commencer, assurez-vous d'avoir :

### 1. Node.js installé
```bash
node --version
# Devrait afficher v16.x.x ou supérieur
```

Si pas installé : téléchargez depuis [nodejs.org](https://nodejs.org)

### 2. MongoDB installé et accessible

**Option A : MongoDB local (recommandé pour débuter)**
```bash
mongod --version
# Devrait afficher la version de MongoDB
```

Si pas installé :
- Mac : `brew install mongodb-community`
- Windows : téléchargez depuis [mongodb.com](https://www.mongodb.com/try/download/community)

**Option B : MongoDB Atlas (cloud gratuit)**
1. Créez un compte sur [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Créez un cluster gratuit
3. Obtenez votre URL de connexion
4. Remplacez dans `backend/.env` :
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rehoboth
   ```

---

## 🚀 Installation complète (première fois)

### Étape 1 : Ouvrir le projet dans le terminal

```bash
cd Desktop
cd "APPLI EVANGELISATION"
```

### Étape 2 : Installer toutes les dépendances

**Important** : Cette étape peut prendre 5-10 minutes.

```bash
# Option 1 : Installation automatique (recommandé)
npm run install:all

# Option 2 : Installation manuelle
cd backend && npm install && cd ..
cd frontend-user && npm install && cd ..
```

Vous devriez voir des messages indiquant l'installation des packages.

### Étape 3 : Vérifier la configuration

**Backend (.env)** :
```bash
# Vérifiez le fichier backend/.env
cat backend/.env
```

Devrait contenir :
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rehoboth_evangelisation
JWT_SECRET=votre_secret_jwt_tres_securise_a_changer_en_production
JWT_EXPIRE=7d
NODE_ENV=development
```

**Frontend (.env)** :
```bash
# Vérifiez le fichier frontend-user/.env
cat frontend-user/.env
```

Devrait contenir :
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🗄️ Peupler la base de données (IMPORTANT)

Cette étape créé un utilisateur admin et des données de démonstration.

### Option 1 : Avec MongoDB local

```bash
# Dans un terminal, démarrez MongoDB
mongod

# Dans un AUTRE terminal, exécutez :
cd "APPLI EVANGELISATION"
npm run seed
```

Vous devriez voir :
```
MongoDB connecté
Création d'un utilisateur admin...
Utilisateur admin créé: admin@rehoboth.ci
Création de ressources d'évangélisation...
4 ressources créées
Création d'un parcours de formation...
Parcours de formation créé: Fondations de la Foi

✅ Base de données peuplée avec succès !

📝 Informations de connexion :
Email: admin@rehoboth.ci
Mot de passe: Admin123!
```

**IMPORTANT** : Notez ces identifiants !

### Option 2 : Avec MongoDB Atlas

1. Assurez-vous que `MONGODB_URI` dans `backend/.env` pointe vers Atlas
2. Exécutez : `npm run seed`

---

## 🎬 Démarrer l'application

Vous avez besoin de **3 terminaux ouverts** :

### Terminal 1 : MongoDB (si local)
```bash
mongod
```
Laissez ce terminal ouvert.

### Terminal 2 : Backend (API)
```bash
cd "APPLI EVANGELISATION"
npm run start:backend
```

Attendez de voir :
```
╔═══════════════════════════════════════════════════════╗
║   🙏 REHOBOTH - API Évangélisation                   ║
║   Serveur démarré sur le port 5000                   ║
╚═══════════════════════════════════════════════════════╝

MongoDB connecté: localhost
```

✅ Backend prêt !

### Terminal 3 : Frontend (Interface)
```bash
cd "APPLI EVANGELISATION"
npm run start:frontend
```

L'application s'ouvrira automatiquement dans votre navigateur sur `http://localhost:3000`

✅ Frontend prêt !

---

## 🔐 Première connexion

1. Dans le navigateur, vous devriez voir la page de connexion
2. Cliquez sur **"S'inscrire"** pour créer votre compte OU
3. Utilisez le compte admin créé par le seed :
   - **Email** : admin@rehoboth.ci
   - **Mot de passe** : Admin123!

---

## ✅ Vérification que tout fonctionne

### Test 1 : Connexion
- [ ] Je peux me connecter avec mes identifiants
- [ ] Je suis redirigé vers le tableau de bord
- [ ] Je vois mon nom en haut à droite

### Test 2 : Navigation
- [ ] Je peux cliquer sur "Enregistrer une âme"
- [ ] Le formulaire s'affiche correctement
- [ ] Je peux naviguer entre les 3 étapes

### Test 3 : Enregistrement d'une âme
- [ ] Je remplis le formulaire complet
- [ ] Je clique sur "Enregistrer"
- [ ] Je vois le message "Âme enregistrée avec succès"
- [ ] Je suis redirigé vers "Mes contacts"
- [ ] Je vois l'âme que je viens d'enregistrer

### Test 4 : Ressources
- [ ] Je clique sur "Ressources"
- [ ] Je vois les 4 ressources de démonstration
- [ ] Je peux cliquer sur "Voir" pour afficher une ressource
- [ ] Les versets bibliques s'affichent

### Test 5 : Mobile
- [ ] Je réduis la fenêtre du navigateur
- [ ] Le menu hamburger (☰) apparaît
- [ ] Je peux naviguer avec le menu mobile

---

## 📱 Accéder depuis un téléphone

### Sur le même réseau WiFi

1. **Trouver l'IP de votre ordinateur** :

   **Sur Mac** :
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```

   **Sur Windows** :
   ```bash
   ipconfig
   ```

   Notez l'adresse IP (ex: `192.168.1.10`)

2. **Modifier la configuration** :

   Dans `frontend-user/.env` :
   ```
   REACT_APP_API_URL=http://192.168.1.10:5000/api
   ```

   Remplacez `192.168.1.10` par VOTRE IP.

3. **Redémarrer le frontend** :
   ```bash
   # Arrêtez le frontend (Ctrl+C)
   npm run start:frontend
   ```

4. **Sur votre téléphone** :
   - Ouvrez le navigateur
   - Allez à : `http://192.168.1.10:3000`
   - Remplacez par VOTRE IP
   - L'application devrait s'afficher !

---

## 🛠️ Commandes utiles

### Arrêter l'application
Dans chaque terminal, appuyez sur : `Ctrl + C`

### Redémarrer l'application
Suivez à nouveau les étapes de "Démarrer l'application"

### Réinitialiser la base de données
```bash
# Supprimer toutes les données
mongo
> use rehoboth_evangelisation
> db.dropDatabase()
> exit

# Re-peupler
npm run seed
```

### Voir les logs du backend
Les logs s'affichent dans le terminal où tourne le backend.

### Voir les logs du frontend
Ouvrez la console du navigateur (F12)

---

## 🐛 Résolution de problèmes

### Problème : "Cannot connect to MongoDB"

**Solution 1** : MongoDB n'est pas démarré
```bash
mongod
```

**Solution 2** : Mauvaise URL de connexion
Vérifiez `backend/.env` : `MONGODB_URI`

**Solution 3** : Port 27017 occupé
```bash
# Trouver et arrêter le processus
lsof -i :27017
kill -9 [PID]
```

---

### Problème : "Port 5000 already in use"

**Solution** : Changez le port
Dans `backend/.env` :
```
PORT=5001
```

Dans `frontend-user/.env` :
```
REACT_APP_API_URL=http://localhost:5001/api
```

Redémarrez les deux serveurs.

---

### Problème : Page blanche sur le frontend

**Solution 1** : Ouvrez la console (F12)
- Regardez les erreurs en rouge
- Si "Failed to fetch", le backend n'est pas démarré

**Solution 2** : Vérifiez l'URL de l'API
```bash
cat frontend-user/.env
```

**Solution 3** : Nettoyez le cache
```bash
cd frontend-user
rm -rf node_modules package-lock.json
npm install
npm start
```

---

### Problème : Impossible de se connecter

**Cause 1** : Mauvais identifiants
- Vérifiez l'email et le mot de passe
- Utilisez le compte admin : admin@rehoboth.ci / Admin123!

**Cause 2** : Base de données vide
```bash
npm run seed
```

**Cause 3** : Backend non démarré
Vérifiez que le backend tourne sur le port 5000

---

### Problème : "Module not found"

**Solution** :
```bash
# Backend
cd backend
rm -rf node_modules
npm install

# Frontend
cd ../frontend-user
rm -rf node_modules
npm install
```

---

## 📊 Utilisation quotidienne

### Scénario complet d'évangélisation

**1. Préparation avant la campagne**
- Se connecter à l'application
- Aller dans "Ressources"
- Lire et mémoriser les versets clés
- Préparer son témoignage

**2. Sur le terrain**
- Sortir avec son smartphone
- Rencontrer une personne
- Partager l'Évangile
- Utiliser les ressources si besoin

**3. Enregistrement immédiat**
- Ouvrir l'application sur le téléphone
- "Enregistrer une âme"
- Remplir le formulaire (2-3 minutes)
- Enregistrer

**4. Suivi à l'église**
- Se connecter depuis l'ordinateur
- "Mes contacts"
- Filtrer les "Nouveaux convertis"
- Planifier les appels et visites
- Inscrire aux parcours de formation

**5. Formation**
- Inscrire le nouveau converti au parcours "Fondations de la Foi"
- Suivre sa progression
- L'encourager à terminer

**6. Intégration**
- Enregistrer les présences aux cultes
- Noter l'évolution spirituelle
- Proposer le baptême quand prêt

---

## 🎓 Former votre équipe

### Formation de base (1 heure)

**30 min** : Démonstration
- Montrer l'inscription
- Montrer l'enregistrement d'une âme
- Montrer les ressources

**20 min** : Pratique guidée
- Chaque membre crée son compte
- Chaque membre enregistre une âme fictive
- Chaque membre consulte les ressources

**10 min** : Questions/Réponses

### Formation avancée (2 heures)

- Utilisation sur mobile
- Suivi approfondi
- Parcours de formation
- Statistiques et rapports (interface admin à venir)

---

## 📞 Support

Si vous rencontrez un problème non résolu :

1. Consultez ce document
2. Consultez le GUIDE_DEMARRAGE.md
3. Consultez le README.md
4. Contactez le support technique REHOBOTH

---

## 🎯 Prochaines étapes

Une fois l'application maîtrisée :

1. **Personnaliser les ressources**
   - Ajouter vos propres enseignements
   - Créer des parcours adaptés à votre contexte

2. **Former toute l'équipe**
   - Chaque évangélisateur avec son compte
   - Session de formation collective

3. **Planifier une campagne test**
   - Utiliser l'application sur le terrain
   - Collecter les retours
   - Ajuster si nécessaire

4. **Déployer en ligne** (optionnel)
   - Pour accès Internet depuis partout
   - Nécessite hébergement cloud

---

## ✝️ Verset d'encouragement

> "Allez par tout le monde, et prêchez la bonne nouvelle à toute la création."
> Marc 16:15

**Que Dieu bénisse votre ministère d'évangélisation ! 🙏**

---

*Dernière mise à jour : Novembre 2025*
*Version : 1.0.0*
*Centre Missionnaire REHOBOTH - Côte d'Ivoire*

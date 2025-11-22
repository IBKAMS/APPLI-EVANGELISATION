# 🚀 Guide de Démarrage Rapide - REHOBOTH

Ce guide vous aidera à démarrer l'application en quelques minutes.

## ⚡ Démarrage Express (3 étapes)

### 1️⃣ Démarrer MongoDB

Ouvrez un terminal et lancez MongoDB :

```bash
mongod
```

> **Note** : Si MongoDB n'est pas installé, installez-le depuis [mongodb.com](https://www.mongodb.com/try/download/community)

Laissez ce terminal ouvert.

---

### 2️⃣ Démarrer le Backend

Ouvrez un **nouveau terminal** :

```bash
cd Desktop
cd "APPLI EVANGELISATION/backend"
npm start
```

Vous devriez voir :
```
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🙏 REHOBOTH - API Évangélisation                   ║
║                                                       ║
║   Serveur démarré sur le port 5000                   ║
║   Environnement: development                         ║
║                                                       ║
║   Prêt à servir le Royaume de Dieu ! ✝️              ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝

MongoDB connecté: localhost
```

Laissez ce terminal ouvert.

---

### 3️⃣ Démarrer le Frontend

Ouvrez un **troisième terminal** :

```bash
cd Desktop
cd "APPLI EVANGELISATION/frontend-user"
npm start
```

L'application s'ouvrira automatiquement dans votre navigateur sur `http://localhost:3000`

---

## 🎯 Première utilisation

### Créer votre premier compte

1. Cliquez sur **"S'inscrire"**
2. Remplissez le formulaire :
   - **Nom** : Votre nom de famille
   - **Prénom** : Votre prénom
   - **Email** : votre.email@exemple.com
   - **Téléphone** : +225 XX XX XX XX XX
   - **Mot de passe** : minimum 6 caractères
3. Cliquez sur **"S'inscrire"**

Vous serez automatiquement connecté et redirigé vers le tableau de bord.

---

### Enregistrer votre première âme

1. Sur le tableau de bord, cliquez sur **"Enregistrer une Âme"**

2. **Étape 1 - Informations personnelles** :
   - Nom : KOUASSI
   - Prénom : Jean
   - Téléphone : +225 07 XX XX XX XX
   - Email : (optionnel)
   - Adresse, Commune, Ville
   - Âge, Sexe, Situation matrimoniale
   - Profession

3. **Étape 2 - Informations de la rencontre** :
   - Type de rencontre : Porte-à-porte / Rue / Événement
   - Lieu de la rencontre : ex. "Cocody Angré"
   - Date : Aujourd'hui (pré-remplie)

4. **Étape 3 - Informations spirituelles** :
   - Statut spirituel : Non-croyant / Intéressé / Nouveau converti
   - Besoins de prière : ex. "Guérison, Emploi, Famille"
   - Notes et observations

5. Cliquez sur **"Enregistrer"**

---

### Consulter vos contacts

1. Allez dans **"Mes Contacts"**
2. Vous verrez la liste de toutes les âmes que vous avez enregistrées
3. Utilisez le filtre pour trier par statut spirituel
4. Cliquez sur **"Voir"** pour consulter les détails

---

## 🛠️ En cas de problème

### Le backend ne démarre pas

**Erreur : "MongoDB connection error"**
- Vérifiez que MongoDB est bien lancé (`mongod` dans un terminal)
- Vérifiez que le port 27017 n'est pas utilisé par une autre application

**Erreur : "Port 5000 already in use"**
- Un autre programme utilise le port 5000
- Changez le port dans `backend/.env` : `PORT=5001`

### Le frontend ne démarre pas

**Erreur : "npm ERR! missing script: start"**
- Réinstallez les dépendances : `npm install`

**La page reste blanche**
- Ouvrez la console du navigateur (F12)
- Vérifiez que le backend est bien démarré
- Vérifiez l'URL de l'API dans `frontend-user/.env`

---

## 📱 Utiliser sur mobile

### Sur votre téléphone (même réseau WiFi)

1. Sur votre ordinateur, trouvez votre adresse IP locale :
   - **Mac** : `ifconfig | grep inet`
   - **Windows** : `ipconfig`

2. Notez votre IP (ex: `192.168.1.10`)

3. Dans `frontend-user/.env`, remplacez :
   ```
   REACT_APP_API_URL=http://192.168.1.10:5000/api
   ```

4. Redémarrez le frontend

5. Sur votre téléphone, allez à : `http://192.168.1.10:3000`

---

## 🎓 Prochaines étapes

### Ajouter des ressources d'évangélisation

Les ressources doivent être ajoutées via l'interface admin (à développer) ou directement dans MongoDB.

### Créer un parcours de formation

Les parcours peuvent être créés par un administrateur pour guider les nouveaux convertis.

### Organiser une campagne

Les campagnes permettent de regrouper les contacts enregistrés lors d'un événement spécifique.

---

## 📞 Besoin d'aide ?

- Consultez le **README.md** pour plus de détails
- Contactez l'équipe technique de REHOBOTH

---

## ✅ Checklist de démarrage

- [ ] MongoDB installé et démarré
- [ ] Backend démarré (port 5000)
- [ ] Frontend démarré (port 3000)
- [ ] Compte utilisateur créé
- [ ] Première âme enregistrée
- [ ] Navigation testée

**Félicitations ! Vous êtes prêt à évangéliser avec REHOBOTH Connect ! 🙏**

---

*"Que la grâce du Seigneur Jésus-Christ, l'amour de Dieu et la communion du Saint-Esprit soient avec vous tous !" - 2 Corinthiens 13:13*

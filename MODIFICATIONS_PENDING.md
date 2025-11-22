# 🔧 Modifications en Attente - Application REHOBOTH

## ✅ Modifications Déjà Effectuées

### 1. **Visualisation du Mot de Passe - Login User**
- ✅ Fichier: `frontend-user/src/pages/Login.js`
- ✅ Ajout de l'icône œil (Visibility/VisibilityOff)
- ✅ Toggle pour afficher/masquer le mot de passe

## 📝 Modifications Restantes

### 2. **Visualisation du Mot de Passe - Pages Suivantes**

#### **A. Register.js (Frontend User)**
Fichier: `frontend-user/src/pages/Register.js`

**Modifications nécessaires:**

1. Ajouter les imports:
```javascript
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, InputAdornment } from '@mui/material';
```

2. Ajouter les états:
```javascript
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
```

3. Modifier le champ "Mot de passe" (lignes ~230-250):
Remplacer `type="password"` par `type={showPassword ? 'text' : 'password'}`

Ajouter la prop `InputProps`:
```javascript
InputProps={{
  endAdornment: (
    <InputAdornment position="end">
      <IconButton
        onClick={() => setShowPassword(!showPassword)}
        edge="end"
      >
        {showPassword ? <VisibilityOff /> : <Visibility />}
      </IconButton>
    </InputAdornment>
  ),
}}
```

4. Faire la même chose pour le champ "Confirmer le mot de passe" avec `showConfirmPassword`

---

#### **B. Login.js (Frontend Admin)**
Fichier: `frontend-admin/src/pages/Login.js`

**Modifications identiques au Login user:**

1. Ajouter les imports:
```javascript
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, InputAdornment } from '@mui/material';
```

2. Ajouter l'état:
```javascript
const [showPassword, setShowPassword] = useState(false);
```

3. Modifier le champ password avec InputProps comme dans Login user

---

#### **C. AjouterUtilisateur.js (Frontend Admin)**
Fichier: `frontend-admin/src/pages/AjouterUtilisateur.js`

**Modifications nécessaires:**

1. Ajouter les imports:
```javascript
import { Visibility, VisibilityOff } from '@mui/icons-material';
```

2. Ajouter les états:
```javascript
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
```

3. Modifier les deux champs password (lignes ~260-280 et ~290-310)

---

### 3. **Remplacement de la Terminologie**

Remplacer **"évangélisateur"** par **"évangéliste"** dans tous les fichiers.

#### **Fichiers Frontend-User à Modifier:**

**A. `frontend-user/src/context/AuthContext.js`**
- Aucun remplacement nécessaire (pas de terme affiché)

**B. `frontend-user/src/pages/Home.js`**
- Ligne ~66: Remplacer "Votre plateforme d'évangélisation" (OK, conserver)
- Pas de "évangélisateur" trouvé

**C. `frontend-user/src/components/Navbar.js`**
- Pas de modification nécessaire

---

#### **Fichiers Frontend-Admin à Modifier:**

**A. `frontend-admin/src/components/AdminLayout.js`**
- Ligne 161: `Interface Évangélisateur` → `Interface Évangéliste`

**B. `frontend-admin/src/pages/AjouterUtilisateur.js`**
- Ligne 103: `Créer un compte évangélisateur` → `Créer un compte évangéliste`
- Ligne 243: Description du rôle évangélisateur → évangéliste
- Ligne 251: `Évangélisateur` → `Évangéliste`
- Ligne 285: `Évangélisateur` dans le guide → `Évangéliste`

**C. `frontend-admin/src/context/AuthContext.js`**
- Ligne 26: Message d'erreur "Seuls les administrateurs..." (OK, conserver)

**D. `frontend-admin/src/pages/Utilisateurs.js`**
- Ligne 63: Bouton "Ajouter un utilisateur" (OK, conserver)

**E. `frontend-admin/src/pages/Dashboard.js`**
- Ligne 47: `Évangélisateurs` → `Évangélistes`

---

#### **Fichiers Backend à Modifier:**

**A. `backend/models/User.js`**
- Ligne ~20: `role: { type: String, enum: ['evangelisateur', 'pasteur', 'admin'], default: 'evangelisateur' }`

  **Remplacer par:**
  ```javascript
  role: { type: String, enum: ['evangeliste', 'pasteur', 'admin'], default: 'evangeliste' }
  ```

**B. `backend/controllers/authController.js`**
- Ligne 34: `role: role || 'evangelisateur'` → `role: role || 'evangeliste'`

**C. `backend/seedData.js`**
- Vérifier si des utilisateurs de test sont créés avec le rôle "evangelisateur"
- Les remplacer par "evangeliste"

**D. Tous les fichiers de modèles:**
- `backend/models/Ame.js`: Vérifier les commentaires et références
- `backend/models/Campagne.js`: Vérifier les champs `equipe.membre.role`

---

## 🔄 Script de Remplacement Automatique

**Pour remplacer automatiquement "evangelisateur" par "evangeliste" dans tous les fichiers:**

```bash
cd "/Users/kamissokobabaidriss/Desktop/APPLI EVANGELISATION"

# Frontend User
find frontend-user/src -name "*.js" -exec sed -i '' 's/evangelisateur/evangeliste/g' {} \;
find frontend-user/src -name "*.js" -exec sed -i '' 's/Evangelisateur/Evangeliste/g' {} \;
find frontend-user/src -name "*.js" -exec sed -i '' 's/Évangélisateur/Évangéliste/g' {} \;

# Frontend Admin
find frontend-admin/src -name "*.js" -exec sed -i '' 's/evangelisateur/evangeliste/g' {} \;
find frontend-admin/src -name "*.js" -exec sed -i '' 's/Evangelisateur/Evangeliste/g' {} \;
find frontend-admin/src -name "*.js" -exec sed -i '' 's/Évangélisateur/Évangéliste/g' {} \;

# Backend
find backend -name "*.js" -exec sed -i '' 's/evangelisateur/evangeliste/g' {} \;
find backend -name "*.js" -exec sed -i '' 's/Evangelisateur/Evangeliste/g' {} \;
```

⚠️ **IMPORTANT:** Après exécution de ces commandes:
1. Redémarrer le backend
2. Vider la base de données et réexécuter le seedData
3. Les applications frontend se recompileront automatiquement

---

## 📋 Checklist de Vérification

### Visualisation Mot de Passe
- [x] Login User
- [ ] Register User
- [ ] Login Admin
- [ ] AjouterUtilisateur Admin

### Terminologie
- [ ] Frontend User (2 fichiers)
- [ ] Frontend Admin (5 fichiers)
- [ ] Backend (3 fichiers)
- [ ] Base de données mise à jour

---

## 🚀 Prochaines Étapes

1. **Exécuter le script de remplacement automatique** ci-dessus
2. **Modifier manuellement les fichiers** pour ajouter la visualisation des mots de passe
3. **Redémarrer tous les serveurs**
4. **Tester la connexion** avec les nouveaux termes

---

**Date:** Novembre 2025
**Statut:** En cours

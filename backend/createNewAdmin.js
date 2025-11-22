const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function createNewAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connexion à MongoDB réussie\n');

    // Supprimer l'ancien admin si existe avec ce nouvel email
    await User.deleteOne({ email: 'admin@rehoboth.com' });

    // Créer le nouveau compte admin
    console.log('=== CRÉATION DU NOUVEAU COMPTE ADMIN ===');
    const admin = await User.create({
      nom: 'Admin',
      prenom: 'REHOBOTH',
      email: 'admin@rehoboth.com',
      telephone: '+225 0000000000',
      password: 'Admin2025!',
      role: 'admin',
      statut: 'actif'
    });

    console.log('✓ Nouveau compte admin créé avec succès!\n');

    console.log('=== IDENTIFIANTS ADMIN ===');
    console.log('Email:        admin@rehoboth.com');
    console.log('Mot de passe: Admin2025!');
    console.log('\nUtilisez ces identifiants pour vous connecter au frontend admin sur http://localhost:3001\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Erreur:', error.message);
    process.exit(1);
  }
}

createNewAdmin();

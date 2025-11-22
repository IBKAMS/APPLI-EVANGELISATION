const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function checkAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connexion à MongoDB réussie\n');

    // Afficher tous les utilisateurs
    const users = await User.find().select('-password');
    console.log('=== UTILISATEURS EXISTANTS ===');
    users.forEach(u => {
      console.log(`Email: ${u.email}, Rôle: ${u.role}, Nom: ${u.nom} ${u.prenom}`);
    });

    // Chercher ou créer un admin
    let admin = await User.findOne({ role: 'admin' });

    if (!admin) {
      console.log('\n=== CRÉATION DU COMPTE ADMIN ===');
      admin = await User.create({
        nom: 'KOUANDÉ',
        prenom: 'HERMANN',
        email: 'hermann.kouande@rehoboth.com',
        telephone: '0747313492',
        password: 'admin2025',
        role: 'admin',
        statut: 'actif'
      });
      console.log('Admin créé avec succès!');
    } else {
      console.log('\n=== COMPTE ADMIN EXISTANT ===');
      console.log(`Email: ${admin.email}`);
    }

    console.log('\n=== IDENTIFIANTS ADMIN ===');
    console.log('Email: hermann.kouande@rehoboth.com');
    console.log('Téléphone: 07 47 31 34 92');
    console.log('Mot de passe: admin2025');
    console.log('\nUtilisez ces identifiants pour vous connecter au frontend admin.\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Erreur:', error);
    process.exit(1);
  }
}

checkAdmin();

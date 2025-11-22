const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function addKouande() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connexion à MongoDB réussie\n');

    // Vérifier si KOUANDÉ HERMANN existe déjà
    const exists = await User.findOne({
      nom: 'KOUANDÉ',
      prenom: 'HERMANN'
    });

    if (exists) {
      console.log('⚠️  KOUANDÉ HERMANN existe déjà');
      console.log(`   ID: ${exists._id}`);
      console.log(`   Téléphone: ${exists.telephone}`);
    } else {
      // Ajouter KOUANDÉ HERMANN
      const kouande = await User.create({
        nom: 'KOUANDÉ',
        prenom: 'HERMANN',
        telephone: '0747313492',
        password: 'admin2025',
        role: 'admin',
        statut: 'actif'
      });
      console.log('✅ KOUANDÉ HERMANN ajouté avec succès !');
      console.log(`   ID: ${kouande._id}`);
      console.log(`   Téléphone: ${kouande.telephone}`);
      console.log(`   Mot de passe: admin2025`);
    }

    // Afficher le nombre total d'admins
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    console.log(`\n📊 Total d'administrateurs: ${totalAdmins}`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Erreur:', error);
    process.exit(1);
  }
}

addKouande();

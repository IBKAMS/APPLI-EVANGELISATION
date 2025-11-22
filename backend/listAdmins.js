const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function listAdmins() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connexion à MongoDB réussie\n');

    // Afficher tous les administrateurs
    const admins = await User.find({ role: 'admin' }).select('-password');

    console.log('='.repeat(70));
    console.log('LISTE DES ADMINISTRATEURS EXISTANTS');
    console.log('='.repeat(70));

    if (admins.length === 0) {
      console.log('\n⚠️  Aucun administrateur trouvé dans la base de données.\n');
    } else {
      console.log(`\n✅ ${admins.length} administrateur(s) trouvé(s) :\n`);
      admins.forEach((admin, index) => {
        console.log(`${index + 1}. ${admin.prenom} ${admin.nom}`);
        console.log(`   Email: ${admin.email || 'Non défini'}`);
        console.log(`   Téléphone: ${admin.telephone}`);
        console.log(`   Statut: ${admin.statut || 'actif'}`);
        console.log(`   ID: ${admin._id}`);
        console.log('-'.repeat(70));
      });
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Erreur:', error);
    process.exit(1);
  }
}

listAdmins();

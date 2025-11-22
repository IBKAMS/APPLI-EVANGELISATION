const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function promoteKouande() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connexion à MongoDB réussie\n');

    // Mettre à jour le rôle de HERMANN KOUANDÉ
    const updated = await User.findOneAndUpdate(
      {
        nom: 'KOUANDÉ',
        prenom: 'HERMANN'
      },
      { role: 'admin' },
      { new: true }
    );

    if (updated) {
      console.log('✅ HERMANN KOUANDÉ promu administrateur !');
      console.log(`   Nom: ${updated.prenom} ${updated.nom}`);
      console.log(`   Téléphone: ${updated.telephone}`);
      console.log(`   Ancien rôle: evangeliste`);
      console.log(`   Nouveau rôle: ${updated.role}`);
      console.log(`   ID: ${updated._id}`);
    } else {
      console.log('⚠️  HERMANN KOUANDÉ non trouvé');
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

promoteKouande();

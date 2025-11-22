const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function findKouande() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connexion à MongoDB réussie\n');

    // Rechercher KOUANDÉ avec différentes variantes
    const kouandes = await User.find({
      $or: [
        { nom: /KOUANDÉ/i },
        { prenom: /KOUANDÉ/i },
        { nom: /KOUANDE/i },
        { prenom: /KOUANDE/i },
        { nom: /HERMANN/i },
        { prenom: /HERMANN/i }
      ]
    });

    console.log(`Résultats trouvés: ${kouandes.length}\n`);

    kouandes.forEach((user, index) => {
      console.log(`${index + 1}. ${user.prenom} ${user.nom}`);
      console.log(`   Téléphone: ${user.telephone}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Statut: ${user.statut}`);
      console.log(`   ID: ${user._id}`);
      console.log('-'.repeat(70));
    });

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Erreur:', error);
    process.exit(1);
  }
}

findKouande();

const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function fixSoeurPhone() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connexion à MongoDB réussie\n');

    // Remettre le téléphone original de SŒUR N'GUESSAN
    console.log('Restauration du numéro de SŒUR N\'GUESSAN...');
    const soeurUpdate = await User.findOneAndUpdate(
      {
        nom: { $regex: /SŒUR|SOEUR/i },
        prenom: { $regex: /N'GUESSAN|NGUESSAN/i }
      },
      { telephone: '0749743764' },
      { new: true }
    );

    if (soeurUpdate) {
      console.log(`✅ Téléphone restauré: ${soeurUpdate.telephone}`);
      console.log(`   Nom: ${soeurUpdate.prenom} ${soeurUpdate.nom}`);
    } else {
      console.log('⚠️  SŒUR N\'GUESSAN non trouvée');
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Erreur:', error);
    process.exit(1);
  }
}

fixSoeurPhone();

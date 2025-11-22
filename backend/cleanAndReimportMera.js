const mongoose = require('mongoose');
const Ame = require('./models/Ame');
require('dotenv').config();

async function cleanAndReimportMera() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connexion à MongoDB réussie\n');

    // Supprimer toutes les âmes MERA (ANGRÉ 8E TRANCHE du 23-08-2025)
    const deleteResult = await Ame.deleteMany({
      lieuRencontre: 'ANGRÉ 8E TRANCHE',
      dateRencontre: new Date('2025-08-23')
    });

    console.log(`🗑️  ${deleteResult.deletedCount} âmes MERA supprimées\n`);

    await mongoose.connection.close();
    console.log('✅ Nettoyage terminé. Vous pouvez maintenant relancer l\'import.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

cleanAndReimportMera();

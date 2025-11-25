const mongoose = require('mongoose');

const ATLAS_URI = 'mongodb+srv://aidriss01_db_user:Cdv5RAnJmGiry2JG@cluster0.bkwuof5.mongodb.net/rehoboth_evangelisation?retryWrites=true&w=majority';

async function deleteAmesMera1() {
  try {
    console.log('🔄 Connexion à MongoDB Atlas...');
    await mongoose.connect(ATLAS_URI);
    console.log('✅ Connecté!\n');

    const Ame = require('./models/Ame');

    // Date cible: 20-09-2025
    const targetDate = new Date('2025-09-20');
    const nextDay = new Date('2025-09-21');

    console.log('🔍 Recherche des âmes du 20-09-2025...');
    const count = await Ame.countDocuments({
      createdAt: {
        $gte: targetDate,
        $lt: nextDay
      }
    });

    console.log(`📊 ${count} âmes trouvées du 20-09-2025\n`);

    if (count > 0) {
      console.log('🗑️  Suppression en cours...');
      const result = await Ame.deleteMany({
        createdAt: {
          $gte: targetDate,
          $lt: nextDay
        }
      });

      console.log(`✅ ${result.deletedCount} âmes supprimées avec succès`);
    } else {
      console.log('ℹ️  Aucune âme à supprimer');
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

deleteAmesMera1();

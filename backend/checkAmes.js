const mongoose = require('mongoose');

const ATLAS_URI = 'mongodb+srv://aidriss01_db_user:Cdv5RAnJmGiry2JG@cluster0.bkwuof5.mongodb.net/rehoboth_evangelisation?retryWrites=true&w=majority';

async function checkAmes() {
  try {
    console.log('🔄 Connexion à MongoDB Atlas...');
    await mongoose.connect(ATLAS_URI);
    console.log('✅ Connecté!\n');

    const Ame = require('./models/Ame');
    const count = await Ame.countDocuments();
    console.log('📊 Nombre total d\'âmes:', count, '\n');

    const ames = await Ame.find().sort({ createdAt: -1 }).limit(30);
    console.log('📋 30 dernières âmes enregistrées:\n');

    ames.forEach((ame, index) => {
      const date = new Date(ame.createdAt).toLocaleString('fr-FR');
      console.log(`${index + 1}. ${ame.nom || '?'} ${ame.prenom || '?'} (${ame.telephone}) - ${date}`);
    });

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

checkAmes();

const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function updateFlorencePhone() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connexion à MongoDB réussie\n');

    // Trouver FLORENCE N'GUESSAN par son ancien numéro
    console.log('🔍 Recherche de FLORENCE N\'GUESSAN (ancien: 0749743764)...');
    const florence = await User.findOne({ telephone: '0749743764' });

    if (!florence) {
      console.log('❌ FLORENCE N\'GUESSAN non trouvée avec le numéro 0749743764');
      process.exit(1);
    }

    console.log('✅ Trouvé:');
    console.log('   Nom:', florence.prenom, florence.nom);
    console.log('   Ancien téléphone:', florence.telephone);
    console.log('   Rôle:', florence.role);
    console.log('');

    // Mettre à jour le numéro de téléphone
    console.log('📝 Mise à jour du numéro de téléphone...');
    florence.telephone = '0778092269'; // Nouveau numéro sans espaces
    await florence.save();

    console.log('✅ Numéro de téléphone mis à jour avec succès!\n');

    // Vérification
    const florenceUpdated = await User.findById(florence._id);
    console.log('🔍 Vérification:');
    console.log('   Nom:', florenceUpdated.prenom, florenceUpdated.nom);
    console.log('   Nouveau téléphone:', florenceUpdated.telephone);
    console.log('   Rôle:', florenceUpdated.role);

    console.log('\n' + '='.repeat(60));
    console.log('✅ MISE À JOUR TERMINÉE');
    console.log('='.repeat(60));
    console.log('FLORENCE N\'GUESSAN');
    console.log('Ancien numéro: 0749743764');
    console.log('Nouveau numéro: 0778092269 (07 78 09 22 69)');
    console.log('='.repeat(60));

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

updateFlorencePhone();

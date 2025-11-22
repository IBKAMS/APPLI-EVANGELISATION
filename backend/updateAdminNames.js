const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function updateAdminNames() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connexion à MongoDB réussie\n');

    console.log('🔄 MISE À JOUR DES NOMS D\'ADMINISTRATEURS');
    console.log('='.repeat(60));
    console.log('');

    // 1. Mettre à jour ANCIEN N'GUESSAN -> ARNAUD N'GUESSAN
    console.log('📝 Mise à jour 1: ANCIEN N\'GUESSAN -> ARNAUD N\'GUESSAN');
    const nguessan = await User.findOne({ telephone: '0707964939' });

    if (nguessan) {
      console.log('   Ancien nom:', nguessan.prenom, nguessan.nom);
      nguessan.prenom = 'ARNAUD';
      nguessan.nom = 'N\'GUESSAN';
      await nguessan.save();
      console.log('   ✅ Nouveau nom: ARNAUD N\'GUESSAN');
    } else {
      console.log('   ⚠️  Utilisateur non trouvé avec le tél: 0707964939');
    }
    console.log('');

    // 2. Mettre à jour AGNIMEL ANCIEN VAL -> AGNIMEL VALENTIN
    console.log('📝 Mise à jour 2: AGNIMEL ANCIEN VAL -> AGNIMEL VALENTIN');
    const agnimel = await User.findOne({ telephone: '0708226161' });

    if (agnimel) {
      console.log('   Ancien nom:', agnimel.prenom, agnimel.nom);
      agnimel.prenom = 'VALENTIN';
      agnimel.nom = 'AGNIMEL';
      await agnimel.save();
      console.log('   ✅ Nouveau nom: VALENTIN AGNIMEL');
    } else {
      console.log('   ⚠️  Utilisateur non trouvé avec le tél: 0708226161');
    }
    console.log('');

    // Afficher la liste des admins mise à jour
    console.log('='.repeat(60));
    console.log('📋 LISTE COMPLÈTE DES ADMINISTRATEURS MISE À JOUR');
    console.log('='.repeat(60));

    const admins = await User.find({ role: 'admin' }).sort({ nom: 1 });

    for (let i = 0; i < admins.length; i++) {
      const admin = admins[i];
      console.log(`${i + 1}. ${admin.prenom} ${admin.nom} - Tél: ${admin.telephone}`);
    }

    console.log('='.repeat(60));
    console.log(`\n📊 Total: ${admins.length} administrateurs`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

updateAdminNames();

const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function fixAgouaCorrect() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connexion à MongoDB réussie\n');

    // Trouver AGOUA YANNICK avec select pour inclure le champ password
    const agoua = await User.findOne({ telephone: '0564883216' }).select('+password');

    if (!agoua) {
      console.log('❌ AGOUA YANNICK non trouvé');
      process.exit(1);
    }

    console.log('📋 Utilisateur trouvé:');
    console.log('   Nom:', agoua.prenom, agoua.nom);
    console.log('   Téléphone:', agoua.telephone);
    console.log('   Rôle actuel:', agoua.role);
    console.log('   Password actuel:', agoua.password ? 'Existe' : 'Vide');
    console.log('');

    // Vérifier si le mot de passe actuel est "123456"
    if (agoua.password) {
      const is123456 = await bcrypt.compare('123456', agoua.password);
      console.log('   Mot de passe actuel = "123456"?', is123456 ? 'OUI ✅' : 'NON');
    }

    // Définir le nouveau mot de passe "admin"
    console.log('\n🔐 Mise à jour du mot de passe vers "admin"...');
    agoua.password = 'admin'; // Le hook pre-save va automatiquement le hacher
    agoua.role = 'admin';
    await agoua.save();

    console.log('✅ Mot de passe mis à jour!\n');

    // Vérifier que le nouveau mot de passe fonctionne
    const agouaUpdated = await User.findOne({ telephone: '0564883216' }).select('+password');
    const isMatchAdmin = await bcrypt.compare('admin', agouaUpdated.password);

    console.log('🔍 Vérification finale:');
    console.log('   Mot de passe "admin" fonctionne:', isMatchAdmin ? '✅ OUI' : '❌ NON');

    console.log('\n' + '='.repeat(60));
    console.log('📋 IDENTIFIANTS FINAUX DE YANNICK AGOUA:');
    console.log('='.repeat(60));
    console.log('📞 Téléphone: 0564883216');
    console.log('🔑 Mot de passe: admin');
    console.log('👤 Rôle: admin');
    console.log('='.repeat(60));

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

fixAgouaCorrect();

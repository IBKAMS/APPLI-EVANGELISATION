const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function verifyAgoua() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connexion à MongoDB réussie\n');

    // Trouver AGOUA YANNICK
    const agoua = await User.findOne({ telephone: '0564883216' });

    if (!agoua) {
      console.log('❌ AGOUA YANNICK non trouvé');
      process.exit(1);
    }

    console.log('='.repeat(60));
    console.log('📋 INFORMATIONS YANNICK AGOUA');
    console.log('='.repeat(60));
    console.log('👤 Prénom:', agoua.prenom);
    console.log('👤 Nom:', agoua.nom);
    console.log('📞 Téléphone:', agoua.telephone);
    console.log('🔑 Rôle:', agoua.role);
    console.log('');

    // Tester plusieurs mots de passe possibles
    const passwords = ['123456', 'admin', 'admin2025'];

    console.log('🔍 Test des mots de passe:');
    console.log('-'.repeat(60));

    for (const pwd of passwords) {
      if (agoua.motDePasse) {
        const isMatch = await bcrypt.compare(pwd, agoua.motDePasse);
        console.log(`   "${pwd}": ${isMatch ? '✅ CORRESPOND' : '❌ Non'}`);
      } else {
        console.log(`   "${pwd}": ❌ Aucun mot de passe hashé dans la base`);
      }
    }

    console.log('='.repeat(60));

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

verifyAgoua();

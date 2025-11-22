const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function fixAgouaPassword() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connexion à MongoDB réussie\n');

    // Trouver AGOUA YANNICK par son numéro de téléphone
    const agoua = await User.findOne({ telephone: '0564883216' });

    if (!agoua) {
      console.log('❌ AGOUA YANNICK non trouvé');
      process.exit(1);
    }

    console.log('📋 Utilisateur trouvé:');
    console.log('   Nom:', agoua.prenom, agoua.nom);
    console.log('   Téléphone:', agoua.telephone);
    console.log('   Rôle actuel:', agoua.role);
    console.log('');

    // Hacher le mot de passe "admin"
    console.log('🔐 Génération du mot de passe hashé...');
    const hashedPassword = await bcrypt.hash('admin', 10);

    // Mettre à jour le mot de passe et s'assurer qu'il est admin
    agoua.motDePasse = hashedPassword;
    agoua.role = 'admin';
    await agoua.save();

    console.log('✅ Mot de passe défini avec succès!\n');

    // Vérifier que le mot de passe fonctionne
    const isMatch = await bcrypt.compare('admin', agoua.motDePasse);
    console.log('🔍 Vérification du mot de passe "admin":', isMatch ? '✅ FONCTIONNE' : '❌ ÉCHEC');

    console.log('\n' + '='.repeat(60));
    console.log('📋 IDENTIFIANTS DE YANNICK AGOUA:');
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

fixAgouaPassword();

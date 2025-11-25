const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function setAgouaAdmin2025() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connexion à MongoDB réussie\n');

    // Trouver AGOUA YANNICK
    const agoua = await User.findOne({ telephone: '0564883216' }).select('+password');

    if (!agoua) {
      console.log('❌ AGOUA YANNICK non trouvé');
      process.exit(1);
    }

    console.log('📋 Mise à jour de YANNICK AGOUA...');
    console.log('   Nom:', agoua.prenom, agoua.nom);
    console.log('   Téléphone:', agoua.telephone);
    console.log('');

    // Définir le mot de passe "admin2025" comme les autres admins
    console.log('🔐 Définition du mot de passe "admin2025"...');
    agoua.password = 'admin2025'; // Le hook pre-save va automatiquement le hacher
    agoua.role = 'admin';
    await agoua.save();

    console.log('✅ Compte mis à jour avec succès!\n');

    // Vérifier que le mot de passe fonctionne
    const agouaUpdated = await User.findOne({ telephone: '0564883216' }).select('+password');
    const isMatch = await bcrypt.compare('admin2025', agouaUpdated.password);

    console.log('🔍 Vérification:');
    console.log('   Mot de passe "admin2025":', isMatch ? '✅ FONCTIONNE' : '❌ ÉCHEC');

    console.log('\n' + '='.repeat(60));
    console.log('📋 LISTE COMPLÈTE DES ADMINISTRATEURS');
    console.log('='.repeat(60));
    console.log('1. ANCIEN N\'GUESSAN - Tél: 0707964939 - Mot de passe: admin2025');
    console.log('2. AGNIMEL ANCIEN VAL - Tél: 0708226161 - Mot de passe: admin2025');
    console.log('3. SAMPAH PASTEUR - Tél: 0708993543 - Mot de passe: admin2025');
    console.log('4. FLORENCE N\'GUESSAN - Tél: 0778092269 - Mot de passe: admin2025');
    console.log('5. DAGAUD APÔTRE - Tél: 0586898848 - Mot de passe: admin2025');
    console.log('6. KOUANDÉ HERMANN - Tél: 0747313492 - Mot de passe: admin2025');
    console.log('7. KAMISSOKO IDRISS - Tél: 0708676604 - Mot de passe: admin2025');
    console.log('8. YANNICK AGOUA - Tél: 0564883216 - Mot de passe: admin2025 ⭐️ NOUVEAU');
    console.log('='.repeat(60));

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

setAgouaAdmin2025();

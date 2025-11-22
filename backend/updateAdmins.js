const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function updateAdmins() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connexion à MongoDB réussie\n');

    // 1. Mettre à jour SŒUR N'GUESSAN -> N'GUESSAN FLORENCE
    console.log('📝 Mise à jour du compte SŒUR N\'GUESSAN...');
    const nguessan = await User.findOne({ telephone: '0749743764' });

    if (nguessan) {
      nguessan.prenom = 'FLORENCE';
      nguessan.nom = 'N\'GUESSAN';
      await nguessan.save();
      console.log('✅ Compte mis à jour: N\'GUESSAN FLORENCE\n');
    } else {
      console.log('⚠️  Compte SŒUR N\'GUESSAN non trouvé\n');
    }

    // 2. Trouver AGOUA YANNICK
    console.log('🔍 Recherche de AGOUA YANNICK...');
    const agoua = await User.findOne({
      $or: [
        { nom: { $regex: /AGOUA/i } },
        { prenom: { $regex: /YANNICK/i } }
      ]
    });

    if (agoua) {
      console.log('✅ Trouvé: ' + agoua.prenom + ' ' + agoua.nom + ' (' + agoua.telephone + ')');
      console.log('   Rôle actuel: ' + agoua.role);

      // Hacher le mot de passe "admin"
      const hashedPassword = await bcrypt.hash('admin', 10);

      // Mettre à jour en admin
      agoua.role = 'admin';
      agoua.motDePasse = hashedPassword;
      await agoua.save();

      console.log('✅ AGOUA YANNICK promu admin avec mot de passe: admin\n');
    } else {
      console.log('⚠️  AGOUA YANNICK non trouvé dans la base de données\n');
    }

    // 3. Afficher la liste des admins
    console.log('='.repeat(60));
    console.log('📋 LISTE DES ADMINISTRATEURS:');
    console.log('='.repeat(60));

    const admins = await User.find({ role: 'admin' });
    for (let i = 0; i < admins.length; i++) {
      const admin = admins[i];
      console.log((i + 1) + '. ' + admin.prenom + ' ' + admin.nom);
      console.log('   📞 ' + admin.telephone);
      console.log('   👤 Rôle: ' + admin.role);
      console.log('');
    }

    console.log('='.repeat(60));

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

updateAdmins();

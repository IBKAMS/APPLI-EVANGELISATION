const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function checkAgoua() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connexion à MongoDB réussie\n');

    // Rechercher AGOUA YANNICK
    console.log('🔍 Recherche de AGOUA YANNICK...\n');

    const users = await User.find({
      $or: [
        { nom: { $regex: /AGOUA/i } },
        { prenom: { $regex: /YANNICK/i } }
      ]
    });

    console.log(`Trouvé ${users.length} utilisateur(s):\n`);

    for (const user of users) {
      console.log('='.repeat(60));
      console.log('👤 Prénom:', user.prenom);
      console.log('👤 Nom:', user.nom);
      console.log('📞 Téléphone:', user.telephone);
      console.log('🔑 Rôle:', user.role);
      console.log('🆔 ID:', user._id);
      console.log('🔒 Mot de passe hashé:', user.motDePasse ? 'OUI' : 'NON');

      // Tester le mot de passe "admin"
      if (user.motDePasse) {
        const isMatch = await bcrypt.compare('admin', user.motDePasse);
        console.log('✅ Mot de passe "admin" correspond:', isMatch ? 'OUI ✅' : 'NON ❌');
      }
      console.log('='.repeat(60));
      console.log('');
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

checkAgoua();

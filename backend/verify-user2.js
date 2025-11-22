const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function verifyUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('=== RECHERCHE DE L\'UTILISATEUR 0779228559 ===\n');

    const user = await User.findOne({ telephone: '0779228559' }).select('+password');

    if (!user) {
      console.log('❌ Utilisateur NON TROUVÉ avec le téléphone 0779228559');

      // Chercher des numéros similaires
      const similarUsers = await User.find({
        telephone: { $regex: '779228559' }
      }).select('nom prenom telephone role');

      if (similarUsers.length > 0) {
        console.log('\n📋 Utilisateurs avec un numéro similaire:');
        similarUsers.forEach(u => {
          console.log(`  - ${u.nom} ${u.prenom} : ${u.telephone} (${u.role})`);
        });
      }
    } else {
      console.log('✅ Utilisateur trouvé!');
      console.log('Nom:', user.nom);
      console.log('Prénom:', user.prenom);
      console.log('Téléphone:', user.telephone);
      console.log('Email:', user.email || 'Non défini');
      console.log('Rôle:', user.role);
      console.log('Statut:', user.statut);

      // Tester le mot de passe
      console.log('\n🔐 Test des mots de passe:');
      const testPasswords = ['123456', 'admin2025', 'Admin2025', 'Admin2025!'];

      for (const pwd of testPasswords) {
        const isMatch = await bcrypt.compare(pwd, user.password);
        if (isMatch) {
          console.log(`✅ Mot de passe CORRECT: "${pwd}"`);
        } else {
          console.log(`❌ Mot de passe INCORRECT: "${pwd}"`);
        }
      }
    }

    mongoose.connection.close();
  } catch (error) {
    console.error('Erreur:', error);
    mongoose.connection.close();
  }
}

verifyUser();

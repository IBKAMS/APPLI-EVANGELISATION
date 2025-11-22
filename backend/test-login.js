const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

// Simuler le controller de connexion
const bcrypt = require('bcryptjs');

async function testLogin(identifier, password) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Déterminer si c'est un email ou téléphone
    const isEmail = identifier.includes('@');
    const query = isEmail ? { email: identifier } : { telephone: identifier };

    console.log('🔍 Recherche avec:', query);

    // Trouver l'utilisateur
    const user = await User.findOne(query).select('+password');

    if (!user) {
      console.log('❌ Utilisateur non trouvé');
      mongoose.connection.close();
      return;
    }

    console.log('✅ Utilisateur trouvé:', user.nom, user.prenom);
    console.log('   Rôle:', user.role);
    console.log('   Téléphone:', user.telephone);
    console.log('   Email:', user.email || 'Non défini');

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log('❌ Mot de passe incorrect');
      mongoose.connection.close();
      return;
    }

    console.log('✅ Mot de passe correct');

    // Vérifier le rôle
    if (user.role !== 'admin' && user.role !== 'pasteur') {
      console.log('❌ Accès refusé - Rôle:', user.role);
      mongoose.connection.close();
      return;
    }

    console.log('✅ Rôle autorisé pour l\'interface admin');
    console.log('\n🎉 CONNEXION RÉUSSIE!');

    mongoose.connection.close();
  } catch (error) {
    console.error('❌ ERREUR:', error.message);
    mongoose.connection.close();
  }
}

// Test 1: Avec téléphone
console.log('=== TEST 1: Connexion avec téléphone ===\n');
testLogin('0708676604', 'admin2025').then(() => {
  console.log('\n' + '='.repeat(50) + '\n');

  // Test 2: Avec un mauvais mot de passe
  console.log('=== TEST 2: Mot de passe incorrect ===\n');
  testLogin('0708676604', 'mauvais_mdp').then(() => {
    console.log('\n' + '='.repeat(50) + '\n');

    // Test 3: Avec un utilisateur qui n'existe pas
    console.log('=== TEST 3: Utilisateur inexistant ===\n');
    testLogin('9999999999', 'admin2025');
  });
});

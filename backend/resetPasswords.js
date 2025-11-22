const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ATLAS_URI = 'mongodb+srv://aidriss01_db_user:Cdv5RAnJmGiry2JG@cluster0.bkwuof5.mongodb.net/rehoboth_evangelisation?retryWrites=true&w=majority';

// Schéma User
const userSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  email: String,
  telephone: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['admin', 'evangeliste', 'responsable', 'call_center'], default: 'evangeliste' },
  actif: { type: Boolean, default: true },
  statut: { type: String, default: 'actif' }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function resetPasswords() {
  try {
    console.log('🔄 Connexion à MongoDB Atlas...');
    await mongoose.connect(ATLAS_URI);
    console.log('✅ Connecté!\n');

    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin', salt);
    const userPassword = await bcrypt.hash('123456', salt);

    // Mettre à jour les admins
    const adminResult = await User.updateMany(
      { role: 'admin' },
      { $set: { password: adminPassword, actif: true, statut: 'actif' } }
    );
    console.log(`👑 ${adminResult.modifiedCount} administrateurs mis à jour (mot de passe: admin)`);

    // Mettre à jour les évangélistes
    const evangelisteResult = await User.updateMany(
      { role: 'evangeliste' },
      { $set: { password: userPassword, actif: true, statut: 'actif' } }
    );
    console.log(`📖 ${evangelisteResult.modifiedCount} évangélistes mis à jour (mot de passe: 123456)`);

    // Mettre à jour les agents call center
    const callCenterResult = await User.updateMany(
      { role: 'call_center' },
      { $set: { password: userPassword, actif: true, statut: 'actif' } }
    );
    console.log(`📞 ${callCenterResult.modifiedCount} agents call center mis à jour (mot de passe: 123456)`);

    // Mettre à jour les responsables
    const responsableResult = await User.updateMany(
      { role: 'responsable' },
      { $set: { password: userPassword, actif: true, statut: 'actif' } }
    );
    console.log(`🔧 ${responsableResult.modifiedCount} responsables mis à jour (mot de passe: 123456)`);

    console.log('\n═══════════════════════════════════════');
    console.log('📋 RÉCAPITULATIF DES MOTS DE PASSE:');
    console.log('═══════════════════════════════════════');
    console.log('   Administrateurs: admin');
    console.log('   Évangélistes: 123456');
    console.log('   Call Center: 123456');
    console.log('   Responsables: 123456');
    console.log('═══════════════════════════════════════');

    await mongoose.connection.close();
    console.log('\n✅ Tous les mots de passe ont été réinitialisés!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

resetPasswords();

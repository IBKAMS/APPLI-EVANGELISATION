const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ATLAS_URI = 'mongodb+srv://aidriss01_db_user:Cdv5RAnJmGiry2JG@cluster0.bkwuof5.mongodb.net/rehoboth_evangelisation?retryWrites=true&w=majority';

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

async function updateAdminPasswords() {
  try {
    console.log('🔄 Connexion à MongoDB Atlas...');
    await mongoose.connect(ATLAS_URI);
    console.log('✅ Connecté!\n');

    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin2025', salt);

    // Mettre à jour tous les admins avec le mot de passe admin2025
    const result = await User.updateMany(
      { role: 'admin' },
      { $set: { password: adminPassword, actif: true, statut: 'actif' } }
    );

    console.log(`👑 ${result.modifiedCount} administrateurs mis à jour avec le mot de passe: admin2025\n`);

    // Afficher la liste des admins
    const admins = await User.find({ role: 'admin' }).select('prenom nom telephone');
    console.log('📋 Liste des administrateurs:');
    admins.forEach((admin, index) => {
      console.log(`   ${index + 1}. ${admin.prenom} ${admin.nom} - Tél: ${admin.telephone}`);
    });

    console.log('\n═══════════════════════════════════════');
    console.log('   Mot de passe admin: admin2025');
    console.log('═══════════════════════════════════════');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

updateAdminPasswords();

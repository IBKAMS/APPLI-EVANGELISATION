const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ATLAS_URI = 'mongodb+srv://aidriss01_db_user:Cdv5RAnJmGiry2JG@cluster0.bkwuof5.mongodb.net/rehoboth_evangelisation?retryWrites=true&w=majority';

// Schéma User avec les bons rôles
const userSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  email: String,
  telephone: { type: String },
  password: { type: String, select: false },
  role: { type: String, enum: ['evangeliste', 'admin', 'pasteur', 'agent_call_center'], default: 'evangeliste' },
  statut: { type: String, enum: ['actif', 'inactif', 'suspendu'], default: 'actif' }
}, { timestamps: true });

// Hacher le mot de passe avant sauvegarde
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

async function fixLeaRole() {
  try {
    console.log('🔄 Connexion à MongoDB Atlas...');
    await mongoose.connect(ATLAS_URI);
    console.log('✅ Connecté!\n');

    // Supprimer l'ancienne entrée de LÉA avec le mauvais rôle
    await User.deleteMany({ telephone: '0706144383' });
    console.log('🗑️ Ancien compte supprimé');

    // Créer un nouveau compte avec le bon rôle
    const newUser = new User({
      nom: 'CLAHON',
      prenom: 'LÉA',
      telephone: '0706144383',
      password: '123456',
      role: 'agent_call_center',  // Rôle correct !
      statut: 'actif'
    });

    await newUser.save();
    console.log('✅ Nouveau compte créé avec le bon rôle');

    // Vérifier
    const leaUser = await User.findOne({ telephone: '0706144383' }).select('+password');
    console.log('\n📋 Utilisateur vérifié:');
    console.log(`   Nom: ${leaUser.nom}`);
    console.log(`   Prénom: ${leaUser.prenom}`);
    console.log(`   Téléphone: ${leaUser.telephone}`);
    console.log(`   Rôle: ${leaUser.role}`);
    console.log(`   Statut: ${leaUser.statut}`);
    console.log(`   Password hashé: ${leaUser.password ? 'OUI' : 'NON'}`);

    // Test de comparaison de mot de passe
    const isMatch = await bcrypt.compare('123456', leaUser.password);
    console.log(`   Test mot de passe '123456': ${isMatch ? '✅ VALIDE' : '❌ INVALIDE'}`);

    console.log('\n═══════════════════════════════════════');
    console.log('   LÉA CLAHON - 0706144383');
    console.log('   Mot de passe: 123456');
    console.log('   Rôle: agent_call_center');
    console.log('═══════════════════════════════════════');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

fixLeaRole();

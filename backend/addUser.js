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
  actif: { type: Boolean, default: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function addUser() {
  try {
    console.log('🔄 Connexion à MongoDB Atlas...');
    await mongoose.connect(ATLAS_URI);
    console.log('✅ Connecté à MongoDB Atlas!\n');

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('evangeliste2025', salt);

    // Vérifier si l'utilisateur existe déjà
    const exists = await User.findOne({ telephone: '0749141404' });
    if (exists) {
      console.log('⚠️ L\'utilisateur AKA XAVIER existe déjà avec ce numéro');
    } else {
      await User.create({
        prenom: 'XAVIER',
        nom: 'AKA',
        telephone: '0749141404',
        password: password,
        role: 'evangeliste',
        actif: true
      });
      console.log('✅ Utilisateur AKA XAVIER ajouté avec succès!');
      console.log('   Téléphone: 0749141404');
      console.log('   Mot de passe: evangeliste2025');
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

addUser();

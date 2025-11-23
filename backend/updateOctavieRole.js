const mongoose = require('mongoose');

const ATLAS_URI = 'mongodb+srv://aidriss01_db_user:Cdv5RAnJmGiry2JG@cluster0.bkwuof5.mongodb.net/rehoboth_evangelisation?retryWrites=true&w=majority';

const userSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  telephone: String,
  role: String,
  statut: String
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function updateRole() {
  try {
    console.log('🔄 Connexion à MongoDB Atlas...');
    await mongoose.connect(ATLAS_URI);
    console.log('✅ Connecté!\n');

    const result = await User.updateOne(
      { telephone: '0153738145' },
      { $set: { role: 'evangeliste' } }
    );

    if (result.modifiedCount > 0) {
      console.log('✅ SIAGBÉ OCTAVIE: rôle changé de call_center vers evangeliste (user)');
    } else {
      console.log('⚠️ Utilisateur non trouvé ou déjà evangeliste');
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

updateRole();

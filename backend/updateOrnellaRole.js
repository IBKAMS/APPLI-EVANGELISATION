const mongoose = require('mongoose');

const ATLAS_URI = 'mongodb+srv://aidriss01_db_user:Cdv5RAnJmGiry2JG@cluster0.bkwuof5.mongodb.net/rehoboth_evangelisation?retryWrites=true&w=majority';

const userSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  telephone: String,
  email: String,
  password: String,
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
      { telephone: '0768127233' },
      { $set: { role: 'evangeliste' } }
    );

    if (result.modifiedCount > 0) {
      console.log('✅ Rôle mis à jour avec succès!');
      console.log('   Utilisateur: KOFFI ORNELLA');
      console.log('   Téléphone: 0768127233');
      console.log('   Ancien rôle: agent_call_center');
      console.log('   Nouveau rôle: evangeliste (user)');
    } else {
      console.log('⚠️ Utilisateur non trouvé ou rôle déjà à jour');
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

updateRole();

const mongoose = require('mongoose');

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
  statut: String
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function checkUser() {
  try {
    console.log('🔄 Connexion à MongoDB Atlas...');
    await mongoose.connect(ATLAS_URI);
    console.log('✅ Connecté!\n');

    // Chercher Xavier
    const user = await User.findOne({ telephone: '0749141404' });

    if (user) {
      console.log('📋 Utilisateur trouvé:');
      console.log('   Nom:', user.nom);
      console.log('   Prénom:', user.prenom);
      console.log('   Téléphone:', user.telephone);
      console.log('   Role:', user.role);
      console.log('   Actif:', user.actif);
      console.log('   Statut:', user.statut);
      console.log('   Password hash:', user.password ? 'OUI' : 'NON');
    } else {
      console.log('❌ Utilisateur non trouvé avec le téléphone 0749141404');
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

checkUser();

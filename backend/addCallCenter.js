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

async function addCallCenter() {
  try {
    console.log('🔄 Connexion à MongoDB Atlas...');
    await mongoose.connect(ATLAS_URI);
    console.log('✅ Connecté!\n');

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('123456', salt);

    const exists = await User.findOne({ telephone: '0706144383' });
    if (exists) {
      // Mettre à jour le rôle en call_center
      exists.role = 'call_center';
      exists.password = password;
      exists.actif = true;
      exists.statut = 'actif';
      await exists.save();
      console.log('✅ LÉA CLAHON mis à jour en agent Call Center!');
    } else {
      await User.create({
        prenom: 'LÉA',
        nom: 'CLAHON',
        telephone: '0706144383',
        password: password,
        role: 'call_center',
        actif: true,
        statut: 'actif'
      });
      console.log('✅ LÉA CLAHON ajoutée comme agent Call Center!');
    }

    console.log('   Téléphone: 0706144383');
    console.log('   Mot de passe: 123456');
    console.log('   Rôle: call_center');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

addCallCenter();

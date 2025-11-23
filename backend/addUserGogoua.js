const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ATLAS_URI = 'mongodb+srv://aidriss01_db_user:Cdv5RAnJmGiry2JG@cluster0.bkwuof5.mongodb.net/rehoboth_evangelisation?retryWrites=true&w=majority';

const userSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  telephone: { type: String, required: true, unique: true },
  email: String,
  password: { type: String, required: true },
  role: { type: String, enum: ['evangeliste', 'admin', 'pasteur', 'agent_call_center'], default: 'evangeliste' },
  statut: { type: String, enum: ['actif', 'inactif'], default: 'actif' }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model('User', userSchema);

async function addUser() {
  try {
    console.log('🔄 Connexion à MongoDB Atlas...');
    await mongoose.connect(ATLAS_URI);
    console.log('✅ Connecté!\n');

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ telephone: '0141174397' });
    if (existingUser) {
      console.log('⚠️ Utilisateur GOGOUA CHRISTIAN existe déjà');
      await mongoose.connection.close();
      process.exit(0);
    }

    // Créer le nouvel utilisateur
    const newUser = new User({
      nom: 'GOGOUA',
      prenom: 'CHRISTIAN',
      telephone: '0141174397',
      password: '123456',
      role: 'evangeliste',
      statut: 'actif'
    });

    await newUser.save();
    console.log('✅ Utilisateur créé avec succès!');
    console.log('   Nom: GOGOUA');
    console.log('   Prénom: CHRISTIAN');
    console.log('   Téléphone: 0141174397');
    console.log('   Mot de passe: 123456');
    console.log('   Rôle: evangeliste');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

addUser();

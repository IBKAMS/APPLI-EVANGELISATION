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

    const existingUser = await User.findOne({ telephone: '0503245682' });
    if (existingUser) {
      if (existingUser.role !== 'evangeliste') {
        await User.updateOne({ telephone: '0503245682' }, { $set: { role: 'evangeliste' } });
        console.log('✅ Rôle mis à jour vers evangeliste');
      } else {
        console.log('⚠️ Utilisateur KOUASSI LEA existe déjà comme evangeliste');
      }
      await mongoose.connection.close();
      process.exit(0);
    }

    const newUser = new User({
      nom: 'KOUASSI',
      prenom: 'LEA',
      telephone: '0503245682',
      password: '123456',
      role: 'evangeliste',
      statut: 'actif'
    });

    await newUser.save();
    console.log('✅ Utilisateur créé avec succès!');
    console.log('   Nom: KOUASSI');
    console.log('   Prénom: LEA');
    console.log('   Téléphone: 0503245682');
    console.log('   Mot de passe: 123456');
    console.log('   Rôle: evangeliste (user)');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

addUser();

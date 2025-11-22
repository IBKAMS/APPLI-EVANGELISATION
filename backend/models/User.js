const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true
  },
  prenom: {
    type: String,
    required: [true, 'Le prénom est requis'],
    trim: true
  },
  email: {
    type: String,
    required: false,
    sparse: true, // Permet plusieurs valeurs nulles/vides tout en maintenant l'unicité pour les valeurs non-nulles
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email invalide']
  },
  telephone: {
    type: String,
    required: [true, 'Le téléphone est requis'],
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['evangeliste', 'admin', 'pasteur', 'agent_call_center'],
    default: 'evangeliste'
  },
  eglise: {
    type: String,
    default: 'Centre Missionnaire REHOBOTH'
  },
  statut: {
    type: String,
    enum: ['actif', 'inactif', 'suspendu'],
    default: 'actif'
  },
  dateInscription: {
    type: Date,
    default: Date.now
  },
  derniereConnexion: {
    type: Date
  }
}, {
  timestamps: true
});

// Hacher le mot de passe avant sauvegarde
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

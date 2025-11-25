const mongoose = require('mongoose');

const reponseApprenantSchema = new mongoose.Schema({
  utilisateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  parcoursFormation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ParcoursFormation',
    required: true
  },
  niveau: {
    type: String,
    required: true
  },
  themeId: {
    type: String,
    required: true
  },
  themeNumero: {
    type: Number,
    required: true
  },
  themeTitre: {
    type: String,
    required: true
  },
  questionId: {
    type: String,
    required: true
  },
  reponse: {
    type: String,
    default: ''
  },
  dateReponse: {
    type: Date,
    default: Date.now
  },
  estComplet: {
    type: Boolean,
    default: false
  },
  // Pour les corrections
  estCorrige: {
    type: Boolean,
    default: false
  },
  correction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Correction'
  }
}, {
  timestamps: true
});

// Index composé pour recherche rapide des réponses d'un utilisateur
reponseApprenantSchema.index({ utilisateur: 1, parcoursFormation: 1 });
reponseApprenantSchema.index({ utilisateur: 1, niveau: 1 });
reponseApprenantSchema.index({ utilisateur: 1, themeId: 1 });

// Index unique pour éviter les doublons de réponses
reponseApprenantSchema.index(
  { utilisateur: 1, parcoursFormation: 1, questionId: 1 },
  { unique: true }
);

module.exports = mongoose.model('ReponseApprenant', reponseApprenantSchema);

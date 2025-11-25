const mongoose = require('mongoose');

const correctionSchema = new mongoose.Schema({
  reponseApprenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ReponseApprenant',
    required: true
  },
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
  // Note globale du thème (sur 20)
  noteTheme: {
    type: Number,
    min: 0,
    max: 20
  },
  // Détails des corrections par question
  questionsCorrigees: [{
    questionId: String,
    estCorrect: Boolean,
    commentaire: String,
    points: Number
  }],
  // Commentaire général du formateur
  commentaireGeneral: {
    type: String,
    default: ''
  },
  // Formateur qui a corrigé
  formateurId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  formateurNom: String,
  formateurPrenom: String,
  // Dates
  dateCorrection: {
    type: Date,
    default: Date.now
  },
  dateModification: {
    type: Date
  },
  // Statut
  statut: {
    type: String,
    enum: ['en_attente', 'en_cours', 'termine', 'valide'],
    default: 'en_cours'
  },
  // Validé par un responsable
  valideParResponsable: {
    type: Boolean,
    default: false
  },
  responsableValidationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  dateValidation: Date
}, {
  timestamps: true
});

// Index pour recherche rapide
correctionSchema.index({ utilisateur: 1, parcoursFormation: 1 });
correctionSchema.index({ utilisateur: 1, themeId: 1 });
correctionSchema.index({ formateurId: 1 });
correctionSchema.index({ statut: 1 });

// Index unique pour éviter les doublons de correction par thème
correctionSchema.index(
  { utilisateur: 1, parcoursFormation: 1, themeId: 1 },
  { unique: true }
);

module.exports = mongoose.model('Correction', correctionSchema);

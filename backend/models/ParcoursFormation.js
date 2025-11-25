const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  verset: String,
  versets: [String],
  texte: {
    type: String
  },
  type: {
    type: String,
    enum: ['completion', 'texte_long', 'oui_non', 'choix_multiple'],
    required: true
  },
  reponseAttendue: String, // Pour les questions à complétion
  instruction: String,
  titre: String
});

const subsectionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  titre: {
    type: String,
    required: true
  },
  questions: [questionSchema]
});

const sectionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  titre: {
    type: String,
    required: true
  },
  instruction: String,
  questions: [questionSchema],
  subsections: [subsectionSchema]
});

const applicationSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  instruction: {
    type: String,
    required: true
  },
  verset: String,
  type: {
    type: String,
    enum: ['texte_long', 'oui_non', 'choix_multiple'],
    default: 'texte_long'
  }
});

const themeSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  numero: {
    type: Number,
    required: true
  },
  titre: {
    type: String,
    required: true
  },
  sections: [sectionSchema],
  applications: [applicationSchema]
});

const parcoursFormationSchema = new mongoose.Schema({
  niveau: {
    type: String,
    enum: ['niveau-1', 'niveau-2', 'niveau-3', 'niveau-4'],
    required: true,
    unique: true
  },
  titre: {
    type: String,
    required: true
  },
  description: String,
  themes: [themeSchema],
  statut: {
    type: String,
    enum: ['actif', 'inactif', 'brouillon'],
    default: 'actif'
  },
  version: {
    type: String,
    default: '1.0'
  }
}, {
  timestamps: true
});

// Index pour recherche rapide par niveau
parcoursFormationSchema.index({ niveau: 1 });

module.exports = mongoose.model('ParcoursFormation', parcoursFormationSchema);

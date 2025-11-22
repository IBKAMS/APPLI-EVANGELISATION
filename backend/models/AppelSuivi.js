const mongoose = require('mongoose');

const appelSuiviSchema = new mongoose.Schema({
  // Âme concernée
  ame: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ame',
    required: true
  },

  // Agent du call center qui a passé l'appel
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Date et heure de l'appel
  dateAppel: {
    type: Date,
    default: Date.now,
    required: true
  },

  // Statut de l'appel
  statutAppel: {
    type: String,
    enum: ['Indisponible', 'Injoignable', 'Intéressé', 'Pas intéressé', 'Rendez-vous pris', 'À rappeler'],
    required: true
  },

  // Durée de l'appel (en secondes)
  dureeAppel: {
    type: Number,
    default: 0
  },

  // Notes de l'appel
  notes: {
    type: String,
    trim: true
  },

  // Prochain appel prévu
  prochainAppel: {
    type: Date
  },

  // Priorité
  priorite: {
    type: String,
    enum: ['Faible', 'Moyenne', 'Haute', 'Urgente'],
    default: 'Moyenne'
  },

  // Résultat de l'appel (actions à prendre)
  actionsASuivre: [{
    type: String
  }]
}, {
  timestamps: true
});

// Index pour recherche optimisée
appelSuiviSchema.index({ ame: 1, dateAppel: -1 });
appelSuiviSchema.index({ agent: 1, dateAppel: -1 });
appelSuiviSchema.index({ statutAppel: 1 });
appelSuiviSchema.index({ prochainAppel: 1 });

module.exports = mongoose.model('AppelSuivi', appelSuiviSchema);

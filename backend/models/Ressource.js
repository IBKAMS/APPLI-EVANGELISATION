const mongoose = require('mongoose');

const ressourceSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  categorie: {
    type: String,
    enum: [
      'Qui est Jésus',
      'Plan de salut',
      'Prière du Salut',
      'Versets clés',
      'Témoignages',
      'Réponses aux questions',
      'Comment prier',
      'Comment lire la Bible',
      'Vie chrétienne',
      'Apologétique',
      'Formation',
      'Autre'
    ],
    required: true
  },
  type: {
    type: String,
    enum: ['Texte', 'Vidéo', 'Audio', 'PDF', 'Lien externe'],
    required: true
  },
  contenu: {
    type: String
  },
  urlMedia: {
    type: String
  },
  versetsBibliques: [{
    reference: {
      type: String,
      required: true
    },
    texte: {
      type: String,
      required: true
    },
    version: {
      type: String,
      default: 'Louis Segond'
    }
  }],
  tags: [{
    type: String
  }],
  publicCible: {
    type: String,
    enum: ['Non-croyants', 'Nouveaux convertis', 'Chrétiens matures', 'Tous'],
    default: 'Tous'
  },
  partage: {
    nombreVues: {
      type: Number,
      default: 0
    },
    nombrePartages: {
      type: Number,
      default: 0
    }
  },
  createur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  statut: {
    type: String,
    enum: ['Publié', 'Brouillon', 'Archivé'],
    default: 'Publié'
  }
}, {
  timestamps: true
});

// Index pour recherche
ressourceSchema.index({ titre: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Ressource', ressourceSchema);

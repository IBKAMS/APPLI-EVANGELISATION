const mongoose = require('mongoose');

const progressionParcoursSchema = new mongoose.Schema({
  utilisateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Progression par niveau
  niveaux: {
    niveau1: {
      termine: {
        type: Boolean,
        default: false
      },
      score: {
        type: Number,
        default: 0
      },
      dateCompletion: Date,
      themesTermines: [{
        themeId: String,
        score: Number,
        dateCompletion: Date
      }]
    },
    niveau2: {
      termine: {
        type: Boolean,
        default: false
      },
      score: {
        type: Number,
        default: 0
      },
      dateCompletion: Date,
      themesTermines: [{
        themeId: String,
        score: Number,
        dateCompletion: Date
      }]
    },
    niveau3: {
      termine: {
        type: Boolean,
        default: false
      },
      score: {
        type: Number,
        default: 0
      },
      dateCompletion: Date,
      themesTermines: [{
        themeId: String,
        score: Number,
        dateCompletion: Date
      }]
    },
    niveau4: {
      termine: {
        type: Boolean,
        default: false
      },
      score: {
        type: Number,
        default: 0
      },
      dateCompletion: Date,
      themesTermines: [{
        themeId: String,
        score: Number,
        dateCompletion: Date
      }]
    }
  },

  // Quiz final
  quizFinal: {
    termine: {
      type: Boolean,
      default: false
    },
    score: {
      type: Number,
      default: 0
    },
    dateCompletion: Date
  },

  // Niveau actuel accessible (1, 2, 3, 4, ou 5 pour quiz final)
  niveauActuel: {
    type: Number,
    default: 1,
    min: 1,
    max: 5
  },

  // Certificat obtenu
  certificatObtenu: {
    type: Boolean,
    default: false
  },
  dateCertificat: Date

}, {
  timestamps: true
});

// Index pour recherche rapide par utilisateur
progressionParcoursSchema.index({ utilisateur: 1 });

module.exports = mongoose.model('ProgressionParcours', progressionParcoursSchema);

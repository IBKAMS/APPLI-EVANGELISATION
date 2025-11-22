const mongoose = require('mongoose');

const parcoursSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  niveau: {
    type: String,
    enum: ['Fondation', 'Croissance', 'Maturité', 'Leadership'],
    required: true
  },
  dureeEstimee: {
    type: Number, // en jours
    required: true
  },
  objectifs: [{
    type: String
  }],

  lecons: [{
    numero: {
      type: Number,
      required: true
    },
    titre: {
      type: String,
      required: true
    },
    description: String,
    contenu: {
      type: String,
      required: true
    },
    typeContenu: {
      type: String,
      enum: ['Texte', 'Vidéo', 'Audio', 'PDF'],
      default: 'Texte'
    },
    urlMedia: String,
    versetsBibliques: [{
      reference: String,
      texte: String
    }],
    questionsReflexion: [{
      question: String
    }],
    quiz: [{
      question: String,
      options: [String],
      reponseCorrecte: Number
    }],
    duree: Number // en minutes
  }],

  ressourcesComplementaires: [{
    titre: String,
    type: {
      type: String,
      enum: ['Document', 'Vidéo', 'Audio', 'Lien']
    },
    url: String,
    description: String
  }],

  prerequis: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parcours'
  }],

  statut: {
    type: String,
    enum: ['Brouillon', 'Publié', 'Archivé'],
    default: 'Brouillon'
  },

  createur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  statistiques: {
    nombreInscrits: {
      type: Number,
      default: 0
    },
    nombreTermines: {
      type: Number,
      default: 0
    },
    tauxReussite: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Parcours', parcoursSchema);

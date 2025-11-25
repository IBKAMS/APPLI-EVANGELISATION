const mongoose = require('mongoose');

const campagneSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: [true, 'Le titre de la campagne est requis'],
    trim: true
  },

  description: {
    type: String,
    required: [true, 'La description est requise']
  },

  type: {
    type: String,
    enum: ['Porte-à-porte', 'Rue', 'Événement', 'Médias', 'Jeunesse', 'Université', 'Autre'],
    required: true
  },

  lieu: {
    type: String,
    required: [true, 'Le lieu est requis']
  },

  dateDebut: {
    type: Date,
    required: [true, 'La date de début est requise']
  },

  dateFin: {
    type: Date,
    required: [true, 'La date de fin est requise']
  },

  statut: {
    type: String,
    enum: ['Planifiée', 'En cours', 'Terminée', 'Annulée'],
    default: 'Planifiée'
  },

  objectifs: {
    nombreAmes: {
      type: Number,
      default: 0
    },
    nombreTracts: {
      type: Number,
      default: 0
    },
    nombreParticipants: {
      type: Number,
      default: 0
    }
  },

  resultats: {
    amesGagnees: {
      type: Number,
      default: 0
    },
    tractsDistribues: {
      type: Number,
      default: 0
    },
    participantsPresents: {
      type: Number,
      default: 0
    }
  },

  responsable: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  budget: {
    prevu: {
      type: Number,
      default: 0
    },
    depense: {
      type: Number,
      default: 0
    }
  },

  logistique: {
    sono: {
      type: Boolean,
      default: false
    },
    chaises: {
      type: Number,
      default: 0
    },
    tentes: {
      type: Number,
      default: 0
    },
    generateur: {
      type: Boolean,
      default: false
    },
    eclairage: {
      type: Boolean,
      default: false
    },
    vehicules: {
      type: Number,
      default: 0
    },
    materielAudiovisuel: {
      type: Boolean,
      default: false
    },
    autres: {
      type: String
    }
  },

  notes: {
    type: String
  },

  images: [{
    url: {
      type: String
    },
    data: {
      type: String  // Pour les images base64
    },
    legende: {
      type: String
    },
    dateAjout: {
      type: Date,
      default: Date.now
    }
  }],

  videos: [{
    url: {
      type: String
    },
    titre: {
      type: String
    },
    description: {
      type: String
    },
    dateAjout: {
      type: Date,
      default: Date.now
    }
  }],

  parcours: {
    type: String,
    trim: true
  },

  lieuxRassemblement: [{
    nom: {
      type: String,
      required: true
    },
    adresse: {
      type: String
    },
    heureRassemblement: {
      type: String
    },
    coordonnees: {
      latitude: Number,
      longitude: Number
    }
  }],

  programme: {
    type: String
  },

  publique: {
    type: Boolean,
    default: true
  }

}, {
  timestamps: true
});

// Index pour recherche rapide
campagneSchema.index({ titre: 1, statut: 1 });
campagneSchema.index({ dateDebut: 1, dateFin: 1 });
campagneSchema.index({ responsable: 1 });

module.exports = mongoose.model('Campagne', campagneSchema);

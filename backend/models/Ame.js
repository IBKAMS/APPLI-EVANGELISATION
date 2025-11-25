const mongoose = require('mongoose');

const ameSchema = new mongoose.Schema({
  // Informations personnelles
  nom: {
    type: String,
    trim: true
  },
  prenom: {
    type: String,
    trim: true
  },
  telephone: {
    type: String,
    required: [true, 'Le téléphone est requis'],
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  adresse: {
    type: String,
    trim: true
  },
  commune: {
    type: String,
    trim: true
  },
  ville: {
    type: String,
    trim: true,
    default: 'Abidjan'
  },

  // Informations démographiques
  age: {
    type: Number
  },
  sexe: {
    type: String,
    enum: ['Homme', 'Femme']
  },
  situationMatrimoniale: {
    type: String,
    enum: ['Célibataire', 'Marié(e)', 'Divorcé(e)', 'Veuf(ve)']
  },
  nombreEnfants: {
    type: Number,
    default: 0
  },
  profession: {
    type: String,
    trim: true
  },

  // Informations spirituelles
  statutSpirituel: {
    type: String,
    enum: [
      'Non-croyant',
      'Non-converti',
      'Intéressé',
      'Nouveau converti',
      'Converti non baptisé',
      'Baptisé',
      'Chrétien pratiquant',
      'Membre actif',
      'Chrétien rétrograde',
      'Musulman',
      'Animiste',
      'Bouddhiste',
      'Autre religion'
    ],
    default: 'Non-converti'
  },
  dateConversion: {
    type: Date
  },
  dateBapteme: {
    type: Date
  },
  ancienneEglise: {
    type: String,
    trim: true
  },
  besoinsPriere: [{
    type: String
  }],

  // Informations sur la rencontre
  typeRencontre: {
    type: String,
    enum: [
      'Porte-à-porte',
      'Rue',
      'Marché',
      'Transport',
      'Lieu de travail',
      'École/Université',
      'Hôpital',
      'Événement église',
      'Événement public',
      'Campagne d\'évangélisation',
      'Croisade',
      'Cellule de maison',
      'Réseau social',
      'Appel téléphonique',
      'Référence',
      'Famille',
      'Ami',
      'Voisin',
      'Invité au culte',
      'Soi-même au culte',
      'Autre'
    ],
    required: false  // Changé pour permettre la sauvegarde progressive
  },
  lieuRencontre: {
    type: String,
    trim: true
  },
  nomInviteur: {
    type: String,
    trim: true
  },
  dateRencontre: {
    type: Date,
    default: Date.now
  },
  campagne: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campagne'
  },

  // Évangélisateur
  evangeliste: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Agent Call Center assigné
  agentCallCenter: {
    type: String,
    enum: ['Ornella', 'Octavie', 'Leila', 'Léa', ''],
    default: ''
  },

  // Suivi
  suivis: [{
    date: {
      type: Date,
      default: Date.now
    },
    type: {
      type: String,
      enum: ['Appel', 'Visite', 'SMS', 'Email', 'WhatsApp'],
      required: true
    },
    responsable: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: String,
    prochaineSuivi: Date
  }],

  // Formation
  parcoursFormation: [{
    parcours: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Parcours'
    },
    dateDebut: Date,
    dateFin: Date,
    progression: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    statut: {
      type: String,
      enum: ['En cours', 'Terminé', 'Abandonné'],
      default: 'En cours'
    }
  }],

  // Assiduité
  presences: [{
    date: Date,
    programme: {
      type: String,
      enum: ['Culte dominical', 'École du dimanche', 'Prière', 'Cellule', 'Séminaire', 'Autre']
    },
    present: {
      type: Boolean,
      default: true
    }
  }],

  // Notes et observations
  notes: {
    type: String
  },
  tags: [{
    type: String
  }],

  // Statut
  statut: {
    type: String,
    enum: ['Actif', 'À relancer', 'Inactif', 'Transféré'],
    default: 'Actif'
  },

  prochaineSuivi: {
    type: Date
  }
}, {
  timestamps: true
});

// Index pour recherche optimisée
ameSchema.index({ nom: 'text', prenom: 'text', telephone: 'text' });
ameSchema.index({ evangeliste: 1, statutSpirituel: 1 });
ameSchema.index({ statut: 1, prochaineSuivi: 1 });

module.exports = mongoose.model('Ame', ameSchema);

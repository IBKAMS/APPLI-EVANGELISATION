const mongoose = require('mongoose');

const ATLAS_URI = 'mongodb+srv://aidriss01_db_user:Cdv5RAnJmGiry2JG@cluster0.bkwuof5.mongodb.net/rehoboth_evangelisation?retryWrites=true&w=majority';

// Schéma Campagne
const campagneSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  type: { type: String, enum: ['Journée évangélisation', 'Week-end évangélisation', 'Semaine évangélisation', 'Croisade', 'Autre'], default: 'Journée évangélisation' },
  description: { type: String, required: true },
  dateDebut: { type: Date, required: true },
  dateFin: { type: Date, required: true },
  lieu: { type: String, required: true },
  statut: { type: String, enum: ['Planifiée', 'En cours', 'Terminée', 'Annulée'], default: 'Planifiée' },
  publique: { type: Boolean, default: true },
  objectifs: {
    nombreAmes: Number,
    nombreTracts: Number,
    nombreParticipants: Number
  },
  resultats: {
    amesGagnees: Number,
    tractsDistribues: Number,
    participantsPresents: Number
  },
  parcours: String,
  programme: String,
  lieuxRassemblement: [{
    nom: String,
    adresse: String,
    heureRassemblement: String
  }],
  images: [{
    url: String,
    legende: String
  }],
  videos: [{
    url: String,
    titre: String,
    description: String
  }],
  notes: String
}, { timestamps: true });

const Campagne = mongoose.model('Campagne', campagneSchema);

const campagnesData = [
  {
    titre: "MERA 1 - Mission d'Évangélisation pour une Récolte Abondante",
    type: "Journée évangélisation",
    description: "Première grande journée de mission d'évangélisation à Angré 8e tranche. Une journée bénie où l'équipe REHOBOTH a parcouru les rues pour annoncer la Bonne Nouvelle et rencontrer les âmes en quête de vérité.",
    dateDebut: new Date("2025-10-26"),
    dateFin: new Date("2025-10-26"),
    lieu: "Angré 8e tranche, Cocody",
    statut: "Terminée",
    publique: true,
    objectifs: { nombreAmes: 100, nombreTracts: 500, nombreParticipants: 30 },
    resultats: { amesGagnees: 120, tractsDistribues: 450, participantsPresents: 28 },
    parcours: "Départ église → Carrefour Palmeraie → Rue des commerces → Quartier résidentiel → Retour église",
    programme: "07h00 - Rassemblement et prière\n08h00 - Départ pour le terrain\n08h30-12h00 - Évangélisation\n12h00 - Pause déjeuner\n13h00-16h00 - Suite évangélisation\n16h30 - Débriefing et action de grâce",
    lieuxRassemblement: [
      { nom: "Église CM REHOBOTH", adresse: "Angré 8e tranche", heureRassemblement: "07h00" }
    ],
    notes: "Journée bénie avec 120 âmes rencontrées. Gloire à Dieu !"
  },
  {
    titre: "MERA 2 - Mission d'Évangélisation pour une Récolte Abondante",
    type: "Journée évangélisation",
    description: "Deuxième grande journée de mission d'évangélisation. L'équipe a poursuivi le travail commencé lors de MERA 1, touchant de nouveaux quartiers et consolidant les contacts établis.",
    dateDebut: new Date("2025-11-09"),
    dateFin: new Date("2025-11-09"),
    lieu: "Angré 8e tranche, Cocody",
    statut: "Terminée",
    publique: true,
    objectifs: { nombreAmes: 100, nombreTracts: 500, nombreParticipants: 35 },
    resultats: { amesGagnees: 115, tractsDistribues: 480, participantsPresents: 32 },
    parcours: "Départ église → Nouveau secteur → Zone commerciale → Retour",
    programme: "07h00 - Rassemblement et prière\n08h00 - Départ pour le terrain\n08h30-12h00 - Évangélisation\n12h00 - Pause\n13h00-16h00 - Suite\n16h30 - Débriefing",
    lieuxRassemblement: [
      { nom: "Église CM REHOBOTH", adresse: "Angré 8e tranche", heureRassemblement: "07h00" }
    ],
    notes: "115 âmes rencontrées. Total cumulé : 235 âmes. Seigneur soit loué !"
  },
  {
    titre: "MERA 3 - Mission d'Évangélisation pour une Récolte Abondante",
    type: "Journée évangélisation",
    description: "Troisième grande journée de la mission MERA ! Rejoignez-nous pour cette journée spéciale d'évangélisation dans les rues d'Angré. Ensemble, nous allons impacter notre communauté avec l'amour de Christ.",
    dateDebut: new Date("2025-11-23"),
    dateFin: new Date("2025-11-23"),
    lieu: "Angré 8e tranche, Cocody",
    statut: "Planifiée",
    publique: true,
    objectifs: { nombreAmes: 150, nombreTracts: 600, nombreParticipants: 40 },
    parcours: "À définir selon le Saint-Esprit",
    programme: "07h00 - Rassemblement et prière de consécration\n08h00 - Départ en équipes\n08h30-12h00 - Évangélisation de rue\n12h00-13h00 - Pause fraternelle\n13h00-16h00 - Continuation de la mission\n16h30 - Retour, témoignages et action de grâce",
    lieuxRassemblement: [
      { nom: "Église CM REHOBOTH", adresse: "Angré 8e tranche", heureRassemblement: "07h00" }
    ],
    notes: "Objectif : Battre le record de MERA 1 et MERA 2 !"
  }
];

async function seedCampagnes() {
  try {
    console.log('🔄 Connexion à MongoDB Atlas...');
    await mongoose.connect(ATLAS_URI);
    console.log('✅ Connecté!\n');

    // Supprimer les anciennes campagnes MERA
    await Campagne.deleteMany({ titre: { $regex: /MERA/i } });
    console.log('🗑️ Anciennes campagnes MERA supprimées\n');

    // Créer les nouvelles campagnes
    for (const campagne of campagnesData) {
      await Campagne.create(campagne);
      console.log(`✅ ${campagne.titre} créée`);
    }

    console.log('\n═══════════════════════════════════════');
    console.log('📋 3 Campagnes MERA ajoutées avec succès!');
    console.log('═══════════════════════════════════════');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

seedCampagnes();

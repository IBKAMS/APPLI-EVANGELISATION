const mongoose = require('mongoose');
const Campagne = require('./models/Campagne');
require('dotenv').config();

async function updateMera3() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connexion à MongoDB réussie\n');

    // Trouver MERA 3
    const mera3 = await Campagne.findOne({
      titre: { $regex: /MERA.*3/i }
    });

    if (!mera3) {
      console.log('❌ MERA 3 non trouvée');
      process.exit(1);
    }

    console.log(`📋 MERA 3 trouvée: ${mera3.titre}\n`);

    // Mettre à jour les informations
    mera3.titre = "MERA 3";
    mera3.description = "Campagne d'évangélisation lancée pendant la grande offensive de jeûne et prière 2025. Une initiative puissante pour toucher les âmes et transformer des vies dans le cadre de notre engagement spirituel annuel.";
    mera3.dateDebut = new Date('2025-11-23');
    mera3.dateFin = new Date('2025-11-23');
    mera3.lieu = "Angré 8e tranche";
    mera3.statut = "En cours";
    mera3.type = "Rue";

    // Ajouter des résultats si pas déjà présents
    if (!mera3.resultats) {
      mera3.resultats = {
        amesGagnees: 0,
        tractsDistribues: 0,
        participantsPresents: 0
      };
    }

    await mera3.save();

    console.log('✅ MERA 3 mise à jour avec succès!\n');
    console.log('📅 Date: 23 novembre 2025');
    console.log('📍 Lieu: Angré 8e tranche');
    console.log('📝 Description: Campagne d\'évangélisation lancée pendant la grande offensive...');
    console.log('='.repeat(60));

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

updateMera3();

const mongoose = require('mongoose');
const Ame = require('./models/Ame');
const User = require('./models/User');
require('dotenv').config();

async function validateAmes() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connexion à MongoDB réussie\n');

    console.log('🔍 VÉRIFICATION DE L\'INTÉGRITÉ DES DONNÉES');
    console.log('='.repeat(70));
    console.log('');

    // Récupérer toutes les âmes
    const allAmes = await Ame.find({}).populate('evangeliste', 'nom prenom telephone');
    console.log(`📊 Total d'âmes dans la base: ${allAmes.length}`);
    console.log('');

    // Vérifier les âmes sans typeRencontre
    const sansTypeRencontre = allAmes.filter(ame => !ame.typeRencontre);
    console.log(`⚠️  Âmes SANS typeRencontre: ${sansTypeRencontre.length}`);
    if (sansTypeRencontre.length > 0) {
      sansTypeRencontre.slice(0, 5).forEach(ame => {
        console.log(`   - ${ame.prenom} ${ame.nom} (ID: ${ame._id})`);
      });
      if (sansTypeRencontre.length > 5) {
        console.log(`   ... et ${sansTypeRencontre.length - 5} autres`);
      }
    }
    console.log('');

    // Vérifier les âmes sans évangéliste
    const sansEvangeliste = allAmes.filter(ame => !ame.evangeliste);
    console.log(`⚠️  Âmes SANS évangéliste: ${sansEvangeliste.length}`);
    if (sansEvangeliste.length > 0) {
      sansEvangeliste.slice(0, 5).forEach(ame => {
        console.log(`   - ${ame.prenom} ${ame.nom} (ID: ${ame._id})`);
      });
      if (sansEvangeliste.length > 5) {
        console.log(`   ... et ${sansEvangeliste.length - 5} autres`);
      }
    }
    console.log('');

    // Vérifier les âmes sans téléphone
    const sansTelephone = allAmes.filter(ame => !ame.telephone);
    console.log(`⚠️  Âmes SANS téléphone: ${sansTelephone.length}`);
    if (sansTelephone.length > 0) {
      sansTelephone.slice(0, 5).forEach(ame => {
        console.log(`   - ${ame.prenom} ${ame.nom} (ID: ${ame._id})`);
      });
      if (sansTelephone.length > 5) {
        console.log(`   ... et ${sansTelephone.length - 5} autres`);
      }
    }
    console.log('');

    // Statistiques par statut spirituel
    console.log('='.repeat(70));
    console.log('📊 STATISTIQUES PAR STATUT SPIRITUEL');
    console.log('='.repeat(70));
    const parStatut = {};
    allAmes.forEach(ame => {
      const statut = ame.statutSpirituel || 'Non défini';
      parStatut[statut] = (parStatut[statut] || 0) + 1;
    });
    Object.entries(parStatut).sort((a, b) => b[1] - a[1]).forEach(([statut, count]) => {
      console.log(`   ${statut}: ${count}`);
    });
    console.log('');

    // Statistiques par type de rencontre
    console.log('='.repeat(70));
    console.log('📊 STATISTIQUES PAR TYPE DE RENCONTRE');
    console.log('='.repeat(70));
    const parType = {};
    allAmes.forEach(ame => {
      const type = ame.typeRencontre || 'Non défini';
      parType[type] = (parType[type] || 0) + 1;
    });
    Object.entries(parType).sort((a, b) => b[1] - a[1]).forEach(([type, count]) => {
      console.log(`   ${type}: ${count}`);
    });
    console.log('');

    // Vérifier les âmes créées récemment (dernières 24h)
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentes = allAmes.filter(ame => ame.createdAt > yesterday);
    console.log('='.repeat(70));
    console.log(`📅 ÂMES CRÉÉES DANS LES DERNIÈRES 24H: ${recentes.length}`);
    console.log('='.repeat(70));
    if (recentes.length > 0) {
      recentes.forEach(ame => {
        console.log(`   - ${ame.prenom} ${ame.nom}`);
        console.log(`     Évangéliste: ${ame.evangeliste ? `${ame.evangeliste.prenom} ${ame.evangeliste.nom}` : 'Non défini'}`);
        console.log(`     TypeRencontre: ${ame.typeRencontre || 'Non défini'}`);
        console.log(`     Date: ${ame.createdAt.toLocaleString('fr-FR')}`);
        console.log('');
      });
    }

    console.log('='.repeat(70));
    console.log('✅ VÉRIFICATION TERMINÉE');
    console.log('='.repeat(70));

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

validateAmes();

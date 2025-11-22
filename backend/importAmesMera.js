const mongoose = require('mongoose');
const Ame = require('./models/Ame');
const User = require('./models/User');
require('dotenv').config();

// Données extraites de l'image - APPEL MERA
// Utilisation du prénom uniquement, élimination des doublons
const amesMeraRaw = [
  { prenom: 'MARTIN', telephone: '0787658781' },
  { prenom: 'JOEL', telephone: '0779583542' },
  { prenom: 'DEMOSTHER', telephone: '0767885329' },
  { prenom: 'IRIELOU', telephone: '0502828725' },
  { prenom: 'MAMAN L', telephone: '0709882862' },
  { prenom: 'SANDRINE', telephone: '0142633303' },
  { prenom: 'ANAELLEE', telephone: '0103280880' },
  { prenom: 'KOFI', telephone: '0545074940' },
  { prenom: 'CELESTIN', telephone: '0769205677' },
  { prenom: 'ODETTE', telephone: '0768136972' },
  { prenom: 'YOHANN', telephone: '0595705989' },
  { prenom: 'STEAVEN', telephone: '0707516542' },
  { prenom: 'RICHARD', telephone: '0545815000' },
  { prenom: 'KORE', telephone: '0747931394' },
  { prenom: 'LEIDE', telephone: '0544935450' },
  { prenom: 'ASHLEY', telephone: '0507354441' },
  { prenom: 'ALLOU', telephone: '0716800470' },
  { prenom: 'LOTA', telephone: '0508947834' },
  { prenom: 'RAMATTA', telephone: '0767004590' },
  { prenom: 'EMMANUELLA', telephone: '0709790423' },
  { prenom: 'JOEL', telephone: '0749874305' },
  { prenom: 'RAOUL', telephone: '0749853489' },
  { prenom: 'ISMAEL', telephone: '0150322991' },
  { prenom: 'SOUMAHORO', telephone: '0508162565' },
  { prenom: 'MARIAM', telephone: '0703048745' },
  { prenom: 'KALOU', telephone: '0779583542' },
  { prenom: 'DOUBIA', telephone: '0712661499' },
  { prenom: 'SAGBASSI', telephone: '0101046818' },
  { prenom: 'ADEBAYOR', telephone: '0100298993' },
  { prenom: 'MARTIN', telephone: '0787658782' },
  { prenom: 'IBRAHIM', telephone: '0566872233' },
  { prenom: 'BRICE', telephone: '0778814917' },
  { prenom: 'JEAN', telephone: '0709215106' },
  { prenom: 'LANDRY', telephone: '0777542301' },
  { prenom: 'ANGEL', telephone: '0503895126' },
  { prenom: 'REBECCA', telephone: '0576156561' },
  { prenom: 'DIANE', telephone: '0784879318' },
  { prenom: 'BOLOU', telephone: '0153102830' },
  { prenom: 'AUDREY', telephone: '0565571895' },
  { prenom: 'SEKA', telephone: '0506326296' },
  { prenom: 'ANGE', telephone: '0789281513' },
  { prenom: 'IBRAHIM', telephone: '0757576692' },
  { prenom: 'CHRISTIANE', telephone: '0778995435' },
  { prenom: 'DORCAS', telephone: '0170807402' },
  { prenom: 'MALA', telephone: '0707043866' },
  { prenom: 'MARC', telephone: '0718782152' },
  { prenom: 'ALAIN', telephone: '0506384354' },
  { prenom: 'KAKOU', telephone: '0171800905' },
  { prenom: 'PATRICK', telephone: '0779210123' },
  { prenom: 'KOUADIO', telephone: '0707286963' },
  { prenom: 'MARIAM', telephone: '0504304063' },
  { prenom: 'CHRISTINE', telephone: '0504114180' },
  { prenom: 'AKISSI', telephone: '0160017810' },
  { prenom: 'DJEBOU', telephone: '0140626271' },
  { prenom: 'KASSI', telephone: '0777244137' },
  { prenom: 'BEATRICE', telephone: '0749646417' },
  { prenom: 'AMANI', telephone: '0777901429' },
  { prenom: 'ROCKSANNE', telephone: '0554503005' }
];

// Éliminer les doublons de prénoms (garder le premier numéro)
const prenomsVus = new Set();
const amesMera = amesMeraRaw.filter(ame => {
  if (prenomsVus.has(ame.prenom)) {
    return false; // Doublon de prénom, ignorer
  }
  prenomsVus.add(ame.prenom);
  return true;
});

async function importAmesMera() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connexion à MongoDB réussie\n');

    // Trouver un évangéliste pour assigner les âmes
    // On va utiliser KAMISSOKO IDRISS
    const evangeliste = await User.findOne({ telephone: '0708676604' });

    if (!evangeliste) {
      console.log('❌ Évangéliste KAMISSOKO IDRISS non trouvé');
      process.exit(1);
    }

    console.log(`📋 Import de ${amesMera.length} âmes MERA...\n`);

    let added = 0;
    let skipped = 0;
    let errors = 0;

    for (const ameData of amesMera) {
      try {
        // Vérifier si l'âme existe déjà (par numéro de téléphone)
        const exists = await Ame.findOne({ telephone: ameData.telephone });

        if (exists) {
          console.log(`⏭️  ${ameData.nom || ameData.prenom} (${ameData.telephone}) existe déjà`);
          skipped++;
          continue;
        }

        // Créer l'âme - mettre le prénom dans "prenom" et "-" dans "nom"
        await Ame.create({
          nom: '-',
          prenom: ameData.prenom,
          telephone: ameData.telephone,
          typeRencontre: 'Campagne d\'évangélisation',
          lieuRencontre: 'ANGRÉ 8E TRANCHE',
          commune: 'ANGRÉ 8E TRANCHE',
          ville: 'Abidjan',
          dateRencontre: new Date('2025-08-23'),
          statutSpirituel: 'Non-converti',
          statut: 'Actif',
          evangeliste: evangeliste._id
        });

        console.log(`✅ ${ameData.prenom} (${ameData.telephone}) ajouté`);
        added++;
      } catch (error) {
        console.log(`❌ Erreur pour ${ameData.prenom}: ${error.message}`);
        errors++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`📊 RÉSUMÉ:`);
    console.log(`   ✅ Ajoutées: ${added}`);
    console.log(`   ⏭️  Ignorées (doublons): ${skipped}`);
    console.log(`   ❌ Erreurs: ${errors}`);
    console.log(`   📋 Total traité: ${amesMera.length}`);
    console.log('='.repeat(60));

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

importAmesMera();

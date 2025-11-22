const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function addEvangelistes() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connexion à MongoDB réussie\n');

    const evangelistes = [
      { prenom: 'AUDREY', nom: 'ZOÉ', telephone: '0565285144' },
      { prenom: 'DIDER', nom: 'KACOU', telephone: '0708186646' },
      { prenom: 'MATTHIEU', nom: 'BOLOU', telephone: '0767136619' },
      { prenom: 'JILDAS', nom: 'KOUAMÉ', telephone: '0554301270' },
      { prenom: 'LEATICIA', nom: 'BAMBA', telephone: '0152631212' },
      { prenom: 'MAMAN', nom: 'AUKA', telephone: '0101738870' },
      { prenom: 'NELLY', nom: 'TANOH', telephone: '0708587211' },
      { prenom: 'VICTORINE', nom: 'ATTIAH', telephone: '0707805989' },
      { prenom: 'JOSIANE KOELI', nom: 'YOUAN', telephone: '0707340790' },
      { prenom: 'FLEUR', nom: 'BOLOU', telephone: '0709208320' },
      { prenom: 'MAMAN', nom: 'TANOH', telephone: '0707240406' },
      { prenom: 'MARIE-JOSÉ', nom: 'BOCOUM', telephone: '0779707157' },
      { prenom: 'BAROAN', nom: 'KOFFI', telephone: '0759261961' },
      { prenom: 'ANICET', nom: 'IRIÉ', telephone: '0707948363' },
      { prenom: 'CHRISTELLINE', nom: 'N\'GONKOUA', telephone: '0789844322' },
      { prenom: 'TABITA', nom: 'DINZIO', telephone: '0504305401' },
      { prenom: 'PRISCILLA', nom: 'FANOUD', telephone: '0172243557' },
      { prenom: 'WILFRID', nom: 'KOLY', telephone: '0556461616' },
      { prenom: 'LETICIA', nom: 'GOUANI', telephone: '0501947731' },
      { prenom: 'JULIE', nom: 'KACOU', telephone: '0101553933' },
      { prenom: 'CAMUS', nom: 'KOFFI', telephone: '0749708424' },
      { prenom: 'LANDRY-CHRISTIAN', nom: 'DJOBO', telephone: '0103232428' },
      { prenom: 'RACHELLE', nom: 'KOUASSI', telephone: '0748948903' },
      { prenom: 'SERGE', nom: 'DINZIO', telephone: '0711359938' },
      { prenom: 'PAUL', nom: 'YOUAN', telephone: '0707017806' },
      { prenom: 'LETICIA', nom: 'KOUAMÉ', telephone: '0544056810' },
      { prenom: 'SONIA', nom: 'GNAORÉ', telephone: '0171579034' },
      { prenom: 'PACÔME', nom: 'M\'BAHIA', telephone: '0703180908' }
    ];

    console.log('🔍 VÉRIFICATION DES DOUBLONS ET AJOUT DES ÉVANGÉLISTES');
    console.log('='.repeat(70));
    console.log('');

    let added = 0;
    let duplicates = 0;
    let errors = 0;

    for (const evangeliste of evangelistes) {
      try {
        // Vérifier si l'utilisateur existe déjà
        const existing = await User.findOne({ telephone: evangeliste.telephone });

        if (existing) {
          console.log(`⚠️  DOUBLON: ${evangeliste.prenom} ${evangeliste.nom} (${evangeliste.telephone})`);
          console.log(`   Déjà existant: ${existing.prenom} ${existing.nom} - Rôle: ${existing.role}`);
          console.log('');
          duplicates++;
        } else {
          // Créer le nouvel utilisateur
          const newUser = new User({
            prenom: evangeliste.prenom,
            nom: evangeliste.nom,
            telephone: evangeliste.telephone,
            password: '123456',
            role: 'evangeliste',
            eglise: 'Centre Missionnaire REHOBOTH',
            statut: 'actif'
          });

          await newUser.save();
          console.log(`✅ AJOUTÉ: ${evangeliste.prenom} ${evangeliste.nom} (${evangeliste.telephone})`);
          added++;
        }
      } catch (error) {
        console.log(`❌ ERREUR: ${evangeliste.prenom} ${evangeliste.nom} (${evangeliste.telephone})`);
        console.log(`   ${error.message}`);
        console.log('');
        errors++;
      }
    }

    console.log('');
    console.log('='.repeat(70));
    console.log('📊 RÉSUMÉ:');
    console.log('='.repeat(70));
    console.log(`✅ Évangélistes ajoutés: ${added}`);
    console.log(`⚠️  Doublons détectés: ${duplicates}`);
    console.log(`❌ Erreurs: ${errors}`);
    console.log(`📋 Total traité: ${evangelistes.length}`);
    console.log('='.repeat(70));

    // Afficher le nombre total d'évangélistes
    const totalEvangelistes = await User.countDocuments({ role: 'evangeliste' });
    console.log(`\n📊 Nombre total d'évangélistes dans la base: ${totalEvangelistes}`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

addEvangelistes();

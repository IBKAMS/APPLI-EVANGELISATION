const mongoose = require('mongoose');
const ParcoursFormation = require('./models/ParcoursFormation');
const parcoursData = require('./data/parcours-niveau-1.json');

const ATLAS_URI = 'mongodb+srv://aidriss01_db_user:Cdv5RAnJmGiry2JG@cluster0.bkwuof5.mongodb.net/rehoboth_evangelisation?retryWrites=true&w=majority';

async function seedParcoursNiveau1() {
  try {
    console.log('🔄 Connexion à MongoDB Atlas...');
    await mongoose.connect(ATLAS_URI);
    console.log('✅ Connecté!\n');

    // Vérifier si le parcours niveau-1 existe déjà
    const existingParcours = await ParcoursFormation.findOne({ niveau: 'niveau-1' });

    if (existingParcours) {
      console.log('⚠️  Le parcours Niveau 1 existe déjà.');
      console.log('🗑️  Suppression de l\'ancien parcours...');
      await ParcoursFormation.deleteOne({ niveau: 'niveau-1' });
      console.log('✅ Ancien parcours supprimé.\n');
    }

    console.log('📥 Importation du parcours Niveau 1...');
    console.log(`   Titre: ${parcoursData.titre}`);
    console.log(`   Niveau: ${parcoursData.niveau}`);
    console.log(`   Nombre de thèmes: ${parcoursData.themes.length}\n`);

    // Créer le parcours
    const parcours = await ParcoursFormation.create(parcoursData);

    console.log('✅ Parcours importé avec succès!\n');

    // Afficher un résumé
    console.log('═══════════════════════════════════════');
    console.log('📊 Résumé de l\'importation:');
    console.log('═══════════════════════════════════════');
    console.log(`ID du parcours: ${parcours._id}`);
    console.log(`Titre: ${parcours.titre}`);
    console.log(`Niveau: ${parcours.niveau}`);
    console.log(`Statut: ${parcours.statut}`);
    console.log(`Version: ${parcours.version}`);
    console.log(`\nNombre de thèmes: ${parcours.themes.length}`);

    // Compter le nombre total de questions
    let totalQuestions = 0;
    let totalApplications = 0;

    parcours.themes.forEach((theme, index) => {
      console.log(`\n  Thème ${theme.numero}: ${theme.titre}`);
      console.log(`  └─ Sections: ${theme.sections.length}`);

      theme.sections.forEach(section => {
        totalQuestions += section.questions.length;
        if (section.subsections) {
          section.subsections.forEach(subsection => {
            totalQuestions += subsection.questions.length;
          });
        }
      });

      totalApplications += theme.applications.length;
      console.log(`  └─ Applications: ${theme.applications.length}`);
    });

    console.log(`\n📝 Total de questions: ${totalQuestions}`);
    console.log(`🎯 Total d'applications: ${totalApplications}`);
    console.log('\n═══════════════════════════════════════');
    console.log('✅ Importation terminée avec succès!');
    console.log('═══════════════════════════════════════\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de l\'importation:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

seedParcoursNiveau1();

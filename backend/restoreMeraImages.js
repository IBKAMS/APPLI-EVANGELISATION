const mongoose = require('mongoose');

const ATLAS_URI = 'mongodb+srv://aidriss01_db_user:Cdv5RAnJmGiry2JG@cluster0.bkwuof5.mongodb.net/rehoboth_evangelisation?retryWrites=true&w=majority';

// Schéma Campagne
const campagneSchema = new mongoose.Schema({
  titre: String,
  type: String,
  description: String,
  dateDebut: Date,
  dateFin: Date,
  lieu: String,
  statut: String,
  publique: Boolean,
  objectifs: Object,
  resultats: Object,
  parcours: String,
  programme: String,
  lieuxRassemblement: Array,
  images: Array,
  videos: Array,
  notes: String
}, { timestamps: true });

const Campagne = mongoose.model('Campagne', campagneSchema);

// Images pour MERA 1 (4 photos)
const imagesMera1 = [
  { url: '/uploads/campagnes/mera1_1.jpg', legende: 'MERA 1 - Évangélisation Angré 8e tranche' },
  { url: '/uploads/campagnes/mera1_2.jpg', legende: 'MERA 1 - Équipe en action' },
  { url: '/uploads/campagnes/mera1_3.jpg', legende: 'MERA 1 - Annonce de la Bonne Nouvelle' },
  { url: '/uploads/campagnes/mera1_4.jpg', legende: 'MERA 1 - 120 âmes rencontrées' }
];

// Images pour MERA 2 (4 photos)
const imagesMera2 = [
  { url: '/uploads/campagnes/mera2_1.jpg', legende: 'MERA 2 - Évangélisation Angré 8e tranche' },
  { url: '/uploads/campagnes/mera2_2.jpg', legende: 'MERA 2 - Équipe en action' },
  { url: '/uploads/campagnes/mera2_3.jpg', legende: 'MERA 2 - Annonce de la Bonne Nouvelle' },
  { url: '/uploads/campagnes/mera2_4.jpg', legende: 'MERA 2 - 115 âmes rencontrées' }
];

async function restoreMeraImages() {
  try {
    console.log('🔄 Connexion à MongoDB Atlas...');
    await mongoose.connect(ATLAS_URI);
    console.log('✅ Connecté!\n');

    // Restaurer images de MERA 1
    const result1 = await Campagne.updateOne(
      { titre: 'MERA 1' },
      { $set: { images: imagesMera1 } }
    );
    console.log(`📷 MERA 1 - Images restaurées (4 photos): ${result1.modifiedCount > 0 ? '✅' : '⚠️ Non trouvé'}`);

    // Restaurer images de MERA 2
    const result2 = await Campagne.updateOne(
      { titre: 'MERA 2' },
      { $set: { images: imagesMera2 } }
    );
    console.log(`📷 MERA 2 - Images restaurées (4 photos): ${result2.modifiedCount > 0 ? '✅' : '⚠️ Non trouvé'}`);

    console.log('\n═══════════════════════════════════════');
    console.log('✅ Images restaurées!');
    console.log('   - MERA 1 : 4 photos');
    console.log('   - MERA 2 : 4 photos');
    console.log('═══════════════════════════════════════');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

restoreMeraImages();

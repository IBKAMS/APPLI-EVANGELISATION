const mongoose = require('mongoose');

const ATLAS_URI = 'mongodb+srv://aidriss01_db_user:Cdv5RAnJmGiry2JG@cluster0.bkwuof5.mongodb.net/rehoboth_evangelisation?retryWrites=true&w=majority';

const campagneSchema = new mongoose.Schema({
  titre: String,
  images: Array
}, { timestamps: true, strict: false });

const Campagne = mongoose.model('Campagne', campagneSchema);

async function addMera3Image() {
  try {
    console.log('🔄 Connexion à MongoDB Atlas...');
    await mongoose.connect(ATLAS_URI);
    console.log('✅ Connecté!\n');

    // Ajouter image à MERA 3
    const result = await Campagne.updateOne(
      { titre: 'MERA 3' },
      { $set: { images: [{ url: '/uploads/campagnes/mera3_1.jpg', legende: 'MERA 3 - Évangélisation Angré 8e tranche' }] } }
    );

    console.log(`📷 MERA 3 - Image ajoutée: ${result.modifiedCount > 0 ? '✅' : '⚠️ Non trouvé'}`);

    console.log('\n═══════════════════════════════════════');
    console.log('✅ Image MERA 3 ajoutée!');
    console.log('═══════════════════════════════════════');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

addMera3Image();

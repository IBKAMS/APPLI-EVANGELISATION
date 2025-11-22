const mongoose = require('mongoose');
const Campagne = require('./models/Campagne');
require('dotenv').config();

async function checkMeraImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connexion à MongoDB réussie\n');

    // Chercher MERA 1 et MERA 2
    const meras = await Campagne.find({
      titre: { $regex: /MERA/i }
    });

    console.log(`📋 ${meras.length} campagnes MERA trouvées:\n`);

    meras.forEach((mera, index) => {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`${index + 1}. ${mera.titre}`);
      console.log(`   ID: ${mera._id}`);
      console.log(`   Images:`, mera.images ? mera.images.length : 0);

      if (mera.images && mera.images.length > 0) {
        mera.images.forEach((img, i) => {
          console.log(`   [${i + 1}] URL: ${img.url}`);
          console.log(`       Description: ${img.description || 'N/A'}`);
        });
      } else {
        console.log('   ⚠️  Aucune image');
      }
    });

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

checkMeraImages();

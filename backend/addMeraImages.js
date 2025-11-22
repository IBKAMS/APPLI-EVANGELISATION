const mongoose = require('mongoose');
const Campagne = require('./models/Campagne');
require('dotenv').config();

async function addMeraImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connexion à MongoDB réussie\n');

    // MERA 1
    const mera1 = await Campagne.findOne({
      $or: [
        { titre: { $regex: /MERA.*1/i } },
        { titre: { $regex: /Appel.*MERA.*1/i } }
      ]
    });

    if (mera1) {
      console.log(`📋 MERA 1 trouvée: ${mera1.titre}`);

      // Ajouter l'image si elle n'existe pas déjà
      const imageExists = mera1.images && mera1.images.some(img => img.url && img.url.includes('mera1_2'));

      if (!imageExists) {
        if (!mera1.images) mera1.images = [];

        mera1.images.push({
          url: '/mera1_2.jpg',
          description: 'Image MERA 1 - Évangélisation Angré'
        });

        await mera1.save();
        console.log('✅ Image ajoutée à MERA 1\n');
      } else {
        console.log('ℹ️  Image déjà existante pour MERA 1\n');
      }
    } else {
      console.log('⚠️  MERA 1 non trouvée dans la base de données\n');
    }

    // MERA 2
    const mera2 = await Campagne.findOne({
      $or: [
        { titre: { $regex: /MERA.*2/i } },
        { titre: { $regex: /Appel.*MERA.*2/i } }
      ]
    });

    if (mera2) {
      console.log(`📋 MERA 2 trouvée: ${mera2.titre}`);

      // Ajouter l'image si elle n'existe pas déjà
      const imageExists = mera2.images && mera2.images.some(img => img.url && img.url.includes('mera2_2'));

      if (!imageExists) {
        if (!mera2.images) mera2.images = [];

        mera2.images.push({
          url: '/mera2_2.jpg',
          description: 'Image MERA 2 - Évangélisation Angré'
        });

        await mera2.save();
        console.log('✅ Image ajoutée à MERA 2\n');
      } else {
        console.log('ℹ️  Image déjà existante pour MERA 2\n');
      }
    } else {
      console.log('⚠️  MERA 2 non trouvée dans la base de données\n');
    }

    console.log('='.repeat(60));
    console.log('✅ Traitement terminé');
    console.log('='.repeat(60));

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

addMeraImages();

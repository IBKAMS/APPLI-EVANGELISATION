const mongoose = require('mongoose');
const Campagne = require('../models/Campagne');
require('dotenv').config();

async function addPhotos() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connecté à MongoDB');

    // Récupérer toutes les campagnes pour voir leurs titres
    const campagnes = await Campagne.find().select('titre');
    console.log('\n=== CAMPAGNES EXISTANTES ===');
    campagnes.forEach(c => {
      console.log(`- ID: ${c._id}, Titre: ${c.titre}`);
    });

    // Photos MERA 1
    const photosMera1 = [
      {
        url: '/uploads/campagnes/mera1_1.jpg',
        legende: 'MERA 1 - Évangélisation de rue',
        dateAjout: new Date()
      },
      {
        url: '/uploads/campagnes/mera1_2.jpg',
        legende: 'MERA 1 - Témoignages et prières',
        dateAjout: new Date()
      },
      {
        url: '/uploads/campagnes/mera1_3.jpg',
        legende: 'MERA 1 - Distribution de tracts',
        dateAjout: new Date()
      },
      {
        url: '/uploads/campagnes/mera1_4.jpg',
        legende: 'MERA 1 - Rencontre avec les âmes',
        dateAjout: new Date()
      }
    ];

    // Photos MERA 2
    const photosMera2 = [
      {
        url: '/uploads/campagnes/mera2_1.jpg',
        legende: 'MERA 2 - Évangélisation de masse',
        dateAjout: new Date()
      },
      {
        url: '/uploads/campagnes/mera2_2.jpg',
        legende: 'MERA 2 - Prières pour les âmes',
        dateAjout: new Date()
      },
      {
        url: '/uploads/campagnes/mera2_3.jpg',
        legende: 'MERA 2 - Témoignages de conversion',
        dateAjout: new Date()
      },
      {
        url: '/uploads/campagnes/mera2_4.jpg',
        legende: 'MERA 2 - Célébration des victoires',
        dateAjout: new Date()
      }
    ];

    // Chercher MERA 1 (ajuster le critère de recherche selon vos données)
    const mera1 = await Campagne.findOne({ titre: { $regex: /MERA 1/i } });
    if (mera1) {
      mera1.images = photosMera1;
      await mera1.save();
      console.log('\n✓ Photos ajoutées à MERA 1');
    } else {
      console.log('\n✗ MERA 1 non trouvée');
    }

    // Chercher MERA 2 (ajuster le critère de recherche selon vos données)
    const mera2 = await Campagne.findOne({ titre: { $regex: /MERA 2/i } });
    if (mera2) {
      mera2.images = photosMera2;
      await mera2.save();
      console.log('✓ Photos ajoutées à MERA 2');
    } else {
      console.log('✗ MERA 2 non trouvée');
    }

    console.log('\n=== TERMINÉ ===\n');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('✓ Connexion fermée');
  }
}

addPhotos();

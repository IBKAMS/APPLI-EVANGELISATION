const mongoose = require('mongoose');
const Ressource = require('../models/Ressource');
require('dotenv').config();

const verifier = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const ressource = await Ressource.findOne({titre: 'Prière du Salut'});

    console.log('ID:', ressource._id);
    console.log('Titre:', ressource.titre);
    console.log('Contenu présent:', !!ressource.contenu);
    console.log('Longueur contenu:', ressource.contenu ? ressource.contenu.length : 0);
    console.log('\n--- Contenu complet ---');
    console.log(ressource.contenu);
    console.log('\n--- Versets ---');
    console.log(JSON.stringify(ressource.versetsBibliques, null, 2));

    await mongoose.connection.close();
  } catch (error) {
    console.error('Erreur:', error);
    process.exit(1);
  }
};

verifier();

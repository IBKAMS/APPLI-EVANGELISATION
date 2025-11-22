const mongoose = require('mongoose');
const Ressource = require('../models/Ressource');
require('dotenv').config();

const corriger = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connecté à MongoDB');

    const versetCorrige = {
      reference: 'Matthieu 6:9-13',
      texte: `Voici donc comment vous devez prier :
Notre Père qui es aux cieux !
Que ton nom soit sanctifié ;
Que ton règne vienne ;
Que ta volonté soit faite sur la terre comme au ciel.
Donne-nous aujourd'hui notre pain quotidien ;
Pardonne-nous nos offenses,
Comme nous aussi nous pardonnons à ceux qui nous ont offensés ;
Ne nous induis pas en tentation,
Mais délivre-nous du malin.
Car c'est à toi qu'appartiennent, dans tous les siècles,
Le règne, la puissance et la gloire. Au Nom de JÉSUS Amen !`,
      version: 'Louis Segond'
    };

    const result = await Ressource.updateOne(
      { titre: 'Comment prier efficacement' },
      {
        $set: {
          versetsBibliques: [versetCorrige]
        }
      }
    );

    console.log('Résultat de la correction:', result);

    if (result.modifiedCount > 0) {
      console.log('✅ Verset corrigé avec succès!');
    } else {
      console.log('⚠️ Aucune modification effectuée.');
    }

    await mongoose.connection.close();
    console.log('Connexion fermée');
  } catch (error) {
    console.error('Erreur:', error);
    process.exit(1);
  }
};

corriger();

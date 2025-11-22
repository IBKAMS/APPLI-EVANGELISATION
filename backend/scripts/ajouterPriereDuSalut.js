const mongoose = require('mongoose');
const Ressource = require('../models/Ressource');
require('dotenv').config();

const ajouterPriereDuSalut = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connecté à MongoDB');

    const priereDuSalut = {
      titre: 'Prière du Salut',
      description: 'Une prière pour accepter Jésus-Christ comme Sauveur personnel et recevoir la vie éternelle',
      categorie: 'Prière du Salut',
      type: 'Texte',
      contenu: `Cher Père Céleste, je ne veux pas partir dans l'éternité sans être assuré d'aller au Ciel. C'est pourquoi je viens à toi à travers Jésus et son oeuvre rédemptrice. Je crois que Jésus est mort pour moi, qu'Il a porté mes péchés sur la croix du calvaire, je crois qu'il a été enseveli et qu'il est ressuscité des morts le 3ème jour.

Aussi je me repens sincèrement de mes péchés et j'accepte ton pardon. Ton précieux sang me lave de tout péché et je reçois la vie éternelle. Merci Seigneur, conduis-moi dans une vie nouvelle avec toi, au nom de Jésus, Amen !`,
      versetsBibliques: [
        {
          reference: '1 Jean 5:13',
          texte: 'Je vous ai écrit ces choses, afin que vous sachiez que vous avez la vie éternelle, vous qui croyez au nom du Fils de Dieu.',
          version: 'Louis Segond'
        }
      ],
      tags: ['salut', 'prière', 'conversion', 'repentance', 'vie éternelle'],
      publicCible: 'Non-croyants',
      statut: 'Publié'
    };

    const ressourceExistante = await Ressource.findOne({ titre: 'Prière du Salut' });

    if (ressourceExistante) {
      console.log('La ressource "Prière du Salut" existe déjà.');
      await mongoose.connection.close();
      return;
    }

    const ressource = await Ressource.create(priereDuSalut);
    console.log('Ressource "Prière du Salut" créée avec succès:', ressource.titre);

    await mongoose.connection.close();
    console.log('Connexion fermée');
  } catch (error) {
    console.error('Erreur:', error);
    process.exit(1);
  }
};

ajouterPriereDuSalut();

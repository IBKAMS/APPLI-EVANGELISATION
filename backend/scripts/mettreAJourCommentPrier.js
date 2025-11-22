const mongoose = require('mongoose');
const Ressource = require('../models/Ressource');
require('dotenv').config();

const mettreAJour = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connecté à MongoDB');

    const nouveauContenu = `La prière est une conversation avec Dieu

Voici comment prier :

1. TROUVEZ UN LIEU TRANQUILLE

"Mais quand tu pries, entre dans ta chambre, ferme ta porte, et prie ton Père qui est là dans le lieu secret; et ton Père, qui voit dans le secret, te le rendra."
(Matthieu 6:6)

Cherche un endroit calme, à l'écart des distractions, où ton cœur peut se concentrer sur la présence de Dieu.

2. COMMENCEZ PAR L'ADORATION

"Notre Père qui es aux cieux, que ton nom soit sanctifié."
(Matthieu 6:9)

Commence par élever le Nom de Dieu. Exalte sa grandeur, sa bonté, sa fidélité et sa sainteté.

3. REMERCIEZ DIEU

"Rendez grâces en toutes choses; car c'est à votre égard la volonté de Dieu en Jésus-Christ."
(1 Thessaloniciens 5:18)

Exprime ta reconnaissance pour tout ce que Dieu a déjà fait, pour sa grâce, sa protection et son amour constant.

4. CONFESSEZ VOS PÉCHÉS

"Si nous confessons nos péchés, il est fidèle et juste pour nous les pardonner et pour nous purifier de toute iniquité."
(1 Jean 1:9)

Reconnais tes fautes devant Dieu avec un cœur sincère. Demande pardon pour tout ce qui a attristé le Saint-Esprit.

5. INVOQUEZ LE SANG DE JÉSUS

"Le sang de Jésus-Christ son Fils nous purifie de tout péché."
(1 Jean 1:7)

Invoque le sang précieux de Jésus pour effacer tes péchés, purifier ton cœur, tes pensées et te rendre digne de paraître devant le trône de grâce.

6. INVOQUEZ LA PRÉSENCE DU SAINT-ESPRIT

"Sans moi, vous ne pouvez rien faire."
(Jean 15:5)

Invite le Saint-Esprit à prendre le contrôle de ta prière. Demande-lui de t'inspirer, de t'aider à prier selon la volonté de Dieu et d'intercéder à travers toi.

7. PRÉSENTEZ VOS REQUÊTES

"Ne vous inquiétez de rien; mais en toute chose faites connaître vos besoins à Dieu par des prières et des supplications, avec des actions de grâces."
(Philippiens 4:6)

Expose à Dieu tout ce qui te préoccupe : besoins personnels, projets, famille, travail, santé, etc. Il écoute et répond selon son plan parfait.

8. PRIEZ POUR LES AUTRES

"Priez les uns pour les autres, afin que vous soyez guéris."
(Jacques 5:16)

Souviens-toi des autres dans ta prière : les malades, les âmes perdues, l'Église, les autorités, et tous ceux que le Saint-Esprit te met à cœur.

9. TERMINEZ PAR LA FOI

"Tout ce que vous demanderez en priant, croyez que vous l'avez reçu, et vous le verrez s'accomplir."
(Marc 11:24)

Remercie Dieu par la foi, même avant de voir le résultat. Crois que ta prière est déjà exaucée selon sa volonté.`;

    const versetReference = {
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
Le règne, la puissance et la gloire. Amen !`,
      version: 'Louis Segond'
    };

    const result = await Ressource.updateOne(
      { titre: 'Comment prier efficacement' },
      {
        $set: {
          contenu: nouveauContenu,
          versetsBibliques: [versetReference]
        }
      }
    );

    console.log('Résultat de la mise à jour:', result);

    if (result.modifiedCount > 0) {
      console.log('✅ Ressource "Comment prier efficacement" mise à jour avec succès!');
    } else {
      console.log('⚠️ Aucune modification effectuée. La ressource existe-t-elle?');
    }

    await mongoose.connection.close();
    console.log('Connexion fermée');
  } catch (error) {
    console.error('Erreur:', error);
    process.exit(1);
  }
};

mettreAJour();

const mongoose = require('mongoose');

const ATLAS_URI = 'mongodb+srv://aidriss01_db_user:Cdv5RAnJmGiry2JG@cluster0.bkwuof5.mongodb.net/rehoboth_evangelisation?retryWrites=true&w=majority';

const ressourceSchema = new mongoose.Schema({
  titre: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  categorie: { type: String, required: true },
  type: { type: String, required: true },
  contenu: String,
  versetsBibliques: [{
    reference: String,
    texte: String,
    version: String
  }],
  tags: [String],
  publicCible: String,
  statut: String
}, { timestamps: true });

const Ressource = mongoose.model('Ressource', ressourceSchema);

const nouveauContenu = `❓ QUESTION 1 : Comment puis-je être sauvé ?

RÉPONSE :
La Bible nous enseigne clairement le chemin du salut :
"Crois au Seigneur Jésus, et tu seras sauvé, toi et ta famille." (Actes 16:31)

Le salut est un don gratuit de Dieu que l'on reçoit par la foi en Jésus-Christ. Il ne s'obtient pas par nos propres efforts ou bonnes œuvres.

❓ QUESTION 2 : Dois-je faire de bonnes œuvres pour être sauvé ?

RÉPONSE :
Non, le salut est un don gratuit de Dieu, il ne s'achète pas par nos œuvres.
"C'est par la grâce que vous êtes sauvés, par le moyen de la foi. Et cela ne vient pas de vous, c'est le don de Dieu. Ce n'est point par les œuvres, afin que personne ne se glorifie." (Éphésiens 2:8-9)

Les bonnes œuvres sont le fruit de notre salut, pas sa cause.

❓ QUESTION 3 : Puis-je perdre mon salut une fois que je l'ai reçu ?

RÉPONSE :
Jésus nous assure de la sécurité éternelle de notre salut :
"Je leur donne la vie éternelle; et elles ne périront jamais, et personne ne les ravira de ma main." (Jean 10:28)

Celui qui a sincèrement accepté Jésus est scellé par le Saint-Esprit et ne peut être arraché de la main de Dieu.

❓ QUESTION 4 : Qu'est-ce que le péché et pourquoi est-il si grave ?

RÉPONSE :
Le péché est toute transgression de la loi de Dieu, toute désobéissance à Sa volonté.
"Car tous ont péché et sont privés de la gloire de Dieu." (Romains 3:23)

Le péché nous sépare de Dieu et sa conséquence est la mort spirituelle :
"Car le salaire du péché, c'est la mort." (Romains 6:23)

❓ QUESTION 5 : Pourquoi Jésus devait-il mourir pour mes péchés ?

RÉPONSE :
La justice de Dieu exige que le péché soit puni. Jésus a pris notre place et a payé notre dette :
"Mais Dieu prouve son amour envers nous, en ce que, lorsque nous étions encore des pécheurs, Christ est mort pour nous." (Romains 5:8)

Il est le seul sacrifice parfait capable d'expier nos péchés.

❓ QUESTION 6 : Comment savoir si je suis vraiment sauvé ?

RÉPONSE :
La Bible nous donne l'assurance du salut :
"Je vous ai écrit ces choses, afin que vous sachiez que vous avez la vie éternelle, vous qui croyez au nom du Fils de Dieu." (1 Jean 5:13)

Les signes d'un vrai salut incluent : l'amour pour Dieu et pour les autres, le désir de vivre selon Sa Parole, et le témoignage intérieur du Saint-Esprit.

❓ QUESTION 7 : Que dois-je faire concrètement pour être sauvé ?

RÉPONSE :
Voici les étapes simples pour recevoir le salut :

1. RECONNAÎTRE que vous êtes pécheur devant Dieu

2. CROIRE que Jésus est mort pour vos péchés et qu'il est ressuscité

3. CONFESSER Jésus comme votre Seigneur et Sauveur
"Si tu confesses de ta bouche le Seigneur Jésus, et si tu crois dans ton cœur que Dieu l'a ressuscité des morts, tu seras sauvé." (Romains 10:9)

4. RECEVOIR Jésus dans votre cœur par la foi

❓ QUESTION 8 : Peut-on aller au paradis sans accepter Jésus ?

RÉPONSE :
Jésus lui-même a dit :
"Je suis le chemin, la vérité, et la vie. Nul ne vient au Père que par moi." (Jean 14:6)

Et aussi :
"Il n'y a de salut en aucun autre; car il n'y a sous le ciel aucun autre nom qui ait été donné parmi les hommes, par lequel nous devions être sauvés." (Actes 4:12)

❓ QUESTION 9 : Et si j'ai commis des péchés très graves ?

RÉPONSE :
Aucun péché n'est trop grand pour le pardon de Dieu :
"Le sang de Jésus son Fils nous purifie de tout péché." (1 Jean 1:7)

"Si nous confessons nos péchés, il est fidèle et juste pour nous les pardonner, et pour nous purifier de toute iniquité." (1 Jean 1:9)

David a commis l'adultère et le meurtre, Paul a persécuté les chrétiens, et pourtant Dieu leur a pardonné.

❓ QUESTION 10 : Que se passe-t-il après la mort ?

RÉPONSE :
La Bible enseigne qu'après la mort, il y a deux destinées éternelles :

Pour ceux qui ont accepté Jésus :
"Je vais vous préparer une place. Et, lorsque je m'en serai allé, et que je vous aurai préparé une place, je reviendrai, et je vous prendrai avec moi, afin que là où je suis vous y soyez aussi." (Jean 14:2-3)

Pour ceux qui ont rejeté Jésus :
"Celui qui croit au Fils a la vie éternelle; celui qui ne croit pas au Fils ne verra point la vie, mais la colère de Dieu demeure sur lui." (Jean 3:36)

Le choix nous appartient aujourd'hui.`;

async function updateQuestionsFAQ() {
  try {
    console.log('🔄 Connexion à MongoDB Atlas...');
    await mongoose.connect(ATLAS_URI);
    console.log('✅ Connecté!\n');

    // Mettre à jour la ressource "Questions fréquentes sur le salut"
    const result = await Ressource.updateOne(
      { titre: 'Questions fréquentes sur le salut' },
      {
        $set: {
          contenu: nouveauContenu,
          description: 'Réponses bibliques aux 10 questions les plus posées lors de l\'évangélisation. Chaque question est accompagnée de versets bibliques.',
          versetsBibliques: [
            { reference: 'Actes 16:31', texte: 'Crois au Seigneur Jésus, et tu seras sauvé, toi et ta famille.', version: 'Louis Segond' },
            { reference: 'Éphésiens 2:8-9', texte: 'C\'est par la grâce que vous êtes sauvés, par le moyen de la foi.', version: 'Louis Segond' },
            { reference: 'Jean 10:28', texte: 'Je leur donne la vie éternelle; et elles ne périront jamais.', version: 'Louis Segond' },
            { reference: 'Romains 3:23', texte: 'Car tous ont péché et sont privés de la gloire de Dieu.', version: 'Louis Segond' },
            { reference: 'Romains 5:8', texte: 'Christ est mort pour nous, lorsque nous étions encore des pécheurs.', version: 'Louis Segond' },
            { reference: 'Jean 14:6', texte: 'Je suis le chemin, la vérité, et la vie.', version: 'Louis Segond' },
            { reference: '1 Jean 1:9', texte: 'Si nous confessons nos péchés, il est fidèle et juste pour nous les pardonner.', version: 'Louis Segond' }
          ]
        }
      }
    );

    if (result.modifiedCount > 0) {
      console.log('✅ Ressource "Questions fréquentes sur le salut" mise à jour!');
      console.log('\n📋 10 questions ajoutées:');
      console.log('   1. Comment puis-je être sauvé ?');
      console.log('   2. Dois-je faire de bonnes œuvres pour être sauvé ?');
      console.log('   3. Puis-je perdre mon salut ?');
      console.log('   4. Qu\'est-ce que le péché et pourquoi est-il si grave ?');
      console.log('   5. Pourquoi Jésus devait-il mourir pour mes péchés ?');
      console.log('   6. Comment savoir si je suis vraiment sauvé ?');
      console.log('   7. Que dois-je faire concrètement pour être sauvé ?');
      console.log('   8. Peut-on aller au paradis sans accepter Jésus ?');
      console.log('   9. Et si j\'ai commis des péchés très graves ?');
      console.log('   10. Que se passe-t-il après la mort ?');
    } else {
      console.log('⚠️ Ressource non trouvée ou non modifiée');
    }

    console.log('\n═══════════════════════════════════════');
    console.log('   Questions avec couleurs distinctes!');
    console.log('   - Questions en BLEU');
    console.log('   - Réponses en texte normal');
    console.log('   - Versets en ORANGE');
    console.log('═══════════════════════════════════════');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

updateQuestionsFAQ();

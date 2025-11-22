const mongoose = require('mongoose');

const ATLAS_URI = 'mongodb+srv://aidriss01_db_user:Cdv5RAnJmGiry2JG@cluster0.bkwuof5.mongodb.net/rehoboth_evangelisation?retryWrites=true&w=majority';

const ressourceSchema = new mongoose.Schema({
  titre: String,
  description: String,
  categorie: String,
  type: String,
  contenu: String,
  versetsBibliques: [{ reference: String, texte: String, version: String }],
  tags: [String],
  publicCible: String,
  statut: String
}, { timestamps: true });

const Ressource = mongoose.model('Ressource', ressourceSchema);

const contenu19Questions = `❓ QUESTION 1 : Comment puis-je être sauvé ?

RÉPONSE :
La Bible nous enseigne clairement le chemin du salut :
"Crois au Seigneur Jésus, et tu seras sauvé, toi et ta famille." (Actes 16:31)

Le salut est un don gratuit de Dieu que l'on reçoit par la foi en Jésus-Christ.

❓ QUESTION 2 : Dois-je faire de bonnes œuvres pour être sauvé ?

RÉPONSE :
Non, le salut est un don gratuit de Dieu, il ne s'achète pas par nos œuvres.
"C'est par la grâce que vous êtes sauvés, par le moyen de la foi. Et cela ne vient pas de vous, c'est le don de Dieu. Ce n'est point par les œuvres, afin que personne ne se glorifie." (Éphésiens 2:8-9)

Les bonnes œuvres sont le fruit de notre salut, pas sa cause.

❓ QUESTION 3 : Qu'est-ce que le péché et pourquoi est-il si grave ?

RÉPONSE :
Le péché est toute transgression de la loi de Dieu, toute désobéissance à Sa volonté.
"Car tous ont péché et sont privés de la gloire de Dieu." (Romains 3:23)

Le péché nous sépare de Dieu et sa conséquence est la mort spirituelle :
"Car le salaire du péché, c'est la mort." (Romains 6:23)

❓ QUESTION 4 : Pourquoi Jésus devait-il mourir pour mes péchés ?

RÉPONSE :
La justice de Dieu exige que le péché soit puni. Jésus a pris notre place et a payé notre dette :
"Mais Dieu prouve son amour envers nous, en ce que, lorsque nous étions encore des pécheurs, Christ est mort pour nous." (Romains 5:8)

Il est le seul sacrifice parfait capable d'expier nos péchés.

❓ QUESTION 5 : Comment savoir si je suis vraiment sauvé ?

RÉPONSE :
La Bible nous donne l'assurance du salut :
"Je vous ai écrit ces choses, afin que vous sachiez que vous avez la vie éternelle, vous qui croyez au nom du Fils de Dieu." (1 Jean 5:13)

Les signes incluent : l'amour pour Dieu, le désir de vivre selon Sa Parole, et le témoignage du Saint-Esprit.

❓ QUESTION 6 : Que dois-je faire concrètement pour être sauvé ?

RÉPONSE :
Voici les étapes simples :
1. RECONNAÎTRE que vous êtes pécheur devant Dieu
2. CROIRE que Jésus est mort pour vos péchés et qu'il est ressuscité
3. CONFESSER Jésus comme votre Seigneur et Sauveur
"Si tu confesses de ta bouche le Seigneur Jésus, et si tu crois dans ton cœur que Dieu l'a ressuscité des morts, tu seras sauvé." (Romains 10:9)

❓ QUESTION 7 : Peut-on aller au paradis sans accepter Jésus ?

RÉPONSE :
Jésus lui-même a dit :
"Je suis le chemin, la vérité, et la vie. Nul ne vient au Père que par moi." (Jean 14:6)

"Il n'y a de salut en aucun autre; car il n'y a sous le ciel aucun autre nom qui ait été donné parmi les hommes, par lequel nous devions être sauvés." (Actes 4:12)

❓ QUESTION 8 : Et si j'ai commis des péchés très graves ?

RÉPONSE :
Aucun péché n'est trop grand pour le pardon de Dieu :
"Le sang de Jésus son Fils nous purifie de tout péché." (1 Jean 1:7)

"Si nous confessons nos péchés, il est fidèle et juste pour nous les pardonner." (1 Jean 1:9)

❓ QUESTION 9 : Que se passe-t-il après la mort ?

RÉPONSE :
La Bible enseigne qu'après la mort, il y a deux destinées éternelles :

Pour ceux qui ont accepté Jésus : le paradis
"Je vais vous préparer une place." (Jean 14:2)

Pour ceux qui ont rejeté Jésus : la séparation éternelle de Dieu
"Celui qui ne croit pas au Fils ne verra point la vie." (Jean 3:36)

❓ QUESTION 10 : Qu'est-ce que la repentance ?

RÉPONSE :
La repentance est un changement profond de cœur et de direction. C'est se détourner du péché pour se tourner vers Dieu.
"Repentez-vous donc et convertissez-vous, pour que vos péchés soient effacés." (Actes 3:19)

La vraie repentance produit un changement de vie visible.

❓ QUESTION 11 : Pourquoi dois-je me faire baptiser ?

RÉPONSE :
Le baptême est un acte d'obéissance qui témoigne publiquement de notre foi en Christ.
"Celui qui croira et qui sera baptisé sera sauvé." (Marc 16:16)

C'est un symbole de notre mort au péché et de notre résurrection à une vie nouvelle en Christ.

❓ QUESTION 12 : Comment puis-je résister aux tentations ?

RÉPONSE :
Dieu nous donne les moyens de vaincre :
"Aucune tentation ne vous est survenue qui n'ait été humaine, et Dieu, qui est fidèle, ne permettra pas que vous soyez tentés au-delà de vos forces; mais avec la tentation il préparera aussi le moyen d'en sortir." (1 Corinthiens 10:13)

Priez, lisez la Bible et fuyez les occasions de péché.

❓ QUESTION 13 : Pourquoi Dieu permet-il la souffrance ?

RÉPONSE :
La souffrance est entrée dans le monde par le péché de l'homme. Mais Dieu peut utiliser nos épreuves pour notre bien :
"Nous savons que toutes choses concourent au bien de ceux qui aiment Dieu." (Romains 8:28)

Dieu ne nous abandonne jamais dans nos souffrances.

❓ QUESTION 14 : Qu'est-ce que le Saint-Esprit ?

RÉPONSE :
Le Saint-Esprit est la troisième personne de la Trinité. Il habite en tout croyant :
"Ne savez-vous pas que votre corps est le temple du Saint-Esprit qui est en vous?" (1 Corinthiens 6:19)

Il nous guide, nous console et nous donne la puissance de vivre pour Christ.

❓ QUESTION 15 : Comment puis-je être sûr que Dieu existe ?

RÉPONSE :
Dieu se révèle de plusieurs façons :
- Par la création : "Les cieux racontent la gloire de Dieu." (Psaume 19:1)
- Par notre conscience : "La loi est écrite dans leurs cœurs." (Romains 2:15)
- Par la Bible et par Jésus-Christ

❓ QUESTION 16 : Pourquoi y a-t-il plusieurs religions ?

RÉPONSE :
L'homme a toujours cherché Dieu à sa manière, mais Dieu s'est révélé lui-même en Jésus-Christ :
"Dieu a tant aimé le monde qu'il a donné son Fils unique." (Jean 3:16)

Le christianisme n'est pas une religion créée par l'homme, mais une relation avec le Dieu vivant.

❓ QUESTION 17 : Que signifie "naître de nouveau" ?

RÉPONSE :
Naître de nouveau signifie recevoir une nouvelle vie spirituelle par la foi en Christ :
"Si quelqu'un est en Christ, il est une nouvelle créature. Les choses anciennes sont passées; voici, toutes choses sont devenues nouvelles." (2 Corinthiens 5:17)

C'est un changement radical opéré par le Saint-Esprit.

❓ QUESTION 18 : Comment puis-je grandir dans ma foi ?

RÉPONSE :
La croissance spirituelle vient par :
- La lecture quotidienne de la Bible : "Désirez comme des enfants nouveau-nés le lait spirituel et pur, afin que par lui vous croissiez." (1 Pierre 2:2)
- La prière régulière
- La communion fraternelle avec d'autres chrétiens
- La mise en pratique de la Parole

❓ QUESTION 19 : Comment puis-je partager ma foi avec les autres ?

RÉPONSE :
Partagez simplement ce que Jésus a fait pour vous :
"Allez, faites de toutes les nations des disciples." (Matthieu 28:19)

Vivez votre foi de manière authentique, soyez prêt à rendre témoignage, et priez pour les opportunités de partager l'Évangile.`;

async function updateTo19Questions() {
  try {
    console.log('🔄 Connexion à MongoDB Atlas...');
    await mongoose.connect(ATLAS_URI);
    console.log('✅ Connecté!\n');

    const result = await Ressource.updateOne(
      { titre: 'Questions fréquentes sur le salut' },
      {
        $set: {
          contenu: contenu19Questions,
          description: 'Réponses bibliques aux 19 questions les plus posées lors de l\'évangélisation. Chaque question est accompagnée de versets bibliques.'
        }
      }
    );

    if (result.modifiedCount > 0) {
      console.log('✅ Ressource mise à jour avec 19 questions!\n');
      console.log('❌ Question retirée: "Puis-je perdre mon salut une fois que je l\'ai reçu?"\n');
      console.log('📋 Liste des 19 questions:');
      const questions = [
        'Comment puis-je être sauvé ?',
        'Dois-je faire de bonnes œuvres pour être sauvé ?',
        'Qu\'est-ce que le péché et pourquoi est-il si grave ?',
        'Pourquoi Jésus devait-il mourir pour mes péchés ?',
        'Comment savoir si je suis vraiment sauvé ?',
        'Que dois-je faire concrètement pour être sauvé ?',
        'Peut-on aller au paradis sans accepter Jésus ?',
        'Et si j\'ai commis des péchés très graves ?',
        'Que se passe-t-il après la mort ?',
        'Qu\'est-ce que la repentance ?',
        'Pourquoi dois-je me faire baptiser ?',
        'Comment puis-je résister aux tentations ?',
        'Pourquoi Dieu permet-il la souffrance ?',
        'Qu\'est-ce que le Saint-Esprit ?',
        'Comment puis-je être sûr que Dieu existe ?',
        'Pourquoi y a-t-il plusieurs religions ?',
        'Que signifie "naître de nouveau" ?',
        'Comment puis-je grandir dans ma foi ?',
        'Comment puis-je partager ma foi avec les autres ?'
      ];
      questions.forEach((q, i) => console.log(`   ${i + 1}. ${q}`));
    } else {
      console.log('⚠️ Ressource non trouvée');
    }

    console.log('\n═══════════════════════════════════════');
    console.log('   19 Questions (question 3 retirée)');
    console.log('═══════════════════════════════════════');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

updateTo19Questions();

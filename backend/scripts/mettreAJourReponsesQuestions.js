const mongoose = require('mongoose');
const Ressource = require('../models/Ressource');
require('dotenv').config();

const mettreAJour = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connecté à MongoDB');

    const nouveauContenu = `QUESTIONS FRÉQUEMMENT POSÉES LORS DE L'ÉVANGÉLISATION

❓ QUESTION 1 : "Pourquoi ai-je besoin de Jésus ?"

RÉPONSE :
Parce que tous les hommes ont péché et sont privés de la gloire de Dieu (Romains 3:23). Le péché nous sépare de Dieu et nous conduit à la mort éternelle. Mais Dieu nous aime tellement qu'il a envoyé son Fils unique, Jésus-Christ, pour mourir à notre place et nous réconcilier avec Lui.

"Car le salaire du péché, c'est la mort; mais le don gratuit de Dieu, c'est la vie éternelle en Jésus-Christ notre Seigneur." (Romains 6:23)

"Car Dieu a tant aimé le monde qu'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu'il ait la vie éternelle." (Jean 3:16)

---

❓ QUESTION 2 : "Je suis une bonne personne, pourquoi aurais-je besoin d'être sauvé ?"

RÉPONSE :
Nos bonnes œuvres ne peuvent pas nous sauver. Devant Dieu, toute notre justice est comme un vêtement souillé (Ésaïe 64:6). Le salut ne s'obtient pas par nos propres efforts, mais c'est un don gratuit de Dieu par la foi en Jésus-Christ.

"Car c'est par la grâce que vous êtes sauvés, par le moyen de la foi. Et cela ne vient pas de vous, c'est le don de Dieu. Ce n'est point par les œuvres, afin que personne ne se glorifie." (Éphésiens 2:8-9)

"Il n'y a de salut en aucun autre; car il n'y a sous le ciel aucun autre nom qui ait été donné parmi les hommes, par lequel nous devions être sauvés." (Actes 4:12)

---

❓ QUESTION 3 : "Comment puis-je être sûr que Dieu me pardonnera ?"

RÉPONSE :
Dieu promet de pardonner à tous ceux qui se repentent sincèrement et confessent leurs péchés. Sa Parole est fidèle et vraie. Le sang de Jésus purifie de tout péché.

"Si nous confessons nos péchés, il est fidèle et juste pour nous les pardonner, et pour nous purifier de toute iniquité." (1 Jean 1:9)

"Autant l'orient est éloigné de l'occident, autant il éloigne de nous nos transgressions." (Psaume 103:12)

"Venez et plaidons! dit l'Éternel. Si vos péchés sont comme le cramoisi, ils deviendront blancs comme la neige; s'ils sont rouges comme la pourpre, ils deviendront comme la laine." (Ésaïe 1:18)

---

❓ QUESTION 4 : "Que se passera-t-il après ma mort ?"

RÉPONSE :
La Bible enseigne clairement qu'il y a deux destinations après la mort : le Ciel pour ceux qui ont accepté Jésus-Christ, et l'enfer pour ceux qui l'ont rejeté. C'est un choix que nous faisons de notre vivant.

"Et comme il est réservé aux hommes de mourir une seule fois, après quoi vient le jugement." (Hébreux 9:27)

"Il essuiera toute larme de leurs yeux, et la mort ne sera plus, et il n'y aura plus ni deuil, ni cri, ni douleur, car les premières choses ont disparu." (Apocalypse 21:4)

"Ne craignez pas ceux qui tuent le corps et qui ne peuvent tuer l'âme; craignez plutôt celui qui peut faire périr l'âme et le corps dans la géhenne." (Matthieu 10:28)

---

❓ QUESTION 5 : "Pourquoi y a-t-il tant de souffrance dans le monde si Dieu existe ?"

RÉPONSE :
La souffrance existe à cause du péché qui est entré dans le monde par la désobéissance de l'homme (Genèse 3). Mais Dieu n'est pas indifférent à notre souffrance. Il a envoyé Jésus pour porter nos douleurs et nous offrir l'espérance.

"Cependant, ce sont nos souffrances qu'il a portées, c'est de nos douleurs qu'il s'est chargé." (Ésaïe 53:4)

"Dieu essuiera toute larme de leurs yeux, et la mort ne sera plus, et il n'y aura plus ni deuil, ni cri, ni douleur, car les premières choses ont disparu." (Apocalypse 21:4)

"Nous savons, du reste, que toutes choses concourent au bien de ceux qui aiment Dieu." (Romains 8:28)

---

❓ QUESTION 6 : "Toutes les religions ne mènent-elles pas au même Dieu ?"

RÉPONSE :
Non. Jésus-Christ est le seul chemin vers Dieu. Il l'a déclaré lui-même de façon claire et sans équivoque. C'est par Lui seul que nous pouvons être réconciliés avec le Père.

"Jésus lui dit: Je suis le chemin, la vérité, et la vie. Nul ne vient au Père que par moi." (Jean 14:6)

"Il n'y a de salut en aucun autre; car il n'y a sous le ciel aucun autre nom qui ait été donné parmi les hommes, par lequel nous devions être sauvés." (Actes 4:12)

---

❓ QUESTION 7 : "Que dois-je faire pour être sauvé ?"

RÉPONSE :
Tu dois reconnaître que tu es pécheur, croire que Jésus-Christ est mort pour tes péchés et ressuscité, te repentir sincèrement, et l'accepter comme ton Sauveur et Seigneur personnel.

"Si tu confesses de ta bouche le Seigneur Jésus, et si tu crois dans ton cœur que Dieu l'a ressuscité des morts, tu seras sauvé. Car c'est en croyant du cœur qu'on parvient à la justice, et c'est en confessant de la bouche qu'on parvient au salut." (Romains 10:9-10)

"Repentez-vous donc et convertissez-vous, pour que vos péchés soient effacés." (Actes 3:19)

---

❓ QUESTION 8 : "Comment savoir si la Bible est vraie ?"

RÉPONSE :
La Bible s'est confirmée elle-même à travers les siècles par l'accomplissement de centaines de prophéties, par sa cohérence malgré ses 40 auteurs différents sur 1500 ans, et par la transformation qu'elle opère dans la vie de ceux qui la reçoivent.

"Toute Écriture est inspirée de Dieu, et utile pour enseigner, pour convaincre, pour corriger, pour instruire dans la justice." (2 Timothée 3:16)

"Le ciel et la terre passeront, mais mes paroles ne passeront point." (Matthieu 24:35)

"Car la parole de Dieu est vivante et efficace, plus tranchante qu'une épée quelconque à deux tranchants." (Hébreux 4:12)

---

❓ QUESTION 9 : "J'ai trop péché, Dieu ne peut pas me pardonner."

RÉPONSE :
Aucun péché n'est trop grand pour la grâce de Dieu. Le sang de Jésus purifie de TOUT péché. Peu importe ce que tu as fait, Dieu est prêt à te pardonner si tu viens à Lui avec un cœur repentant.

"Venez et plaidons! dit l'Éternel. Si vos péchés sont comme le cramoisi, ils deviendront blancs comme la neige." (Ésaïe 1:18)

"Le sang de Jésus son Fils nous purifie de tout péché." (1 Jean 1:7)

"Je ne mettrai pas dehors celui qui vient à moi." (Jean 6:37)

---

❓ QUESTION 10 : "Que se passe-t-il si je pèche après avoir accepté Jésus ?"

RÉPONSE :
Quand tu deviens enfant de Dieu, tu ne perds pas ton salut à cause d'un péché. Mais le péché brise ta communion avec Dieu. Tu dois confesser ton péché, demander pardon, et Dieu te restaurera.

"Si nous confessons nos péchés, il est fidèle et juste pour nous les pardonner, et pour nous purifier de toute iniquité." (1 Jean 1:9)

"Mes petits enfants, je vous écris ces choses, afin que vous ne péchiez point. Et si quelqu'un a péché, nous avons un avocat auprès du Père, Jésus-Christ le juste." (1 Jean 2:1)

---

CONCLUSION

Ces questions sont normales et légitimes. Dieu comprend nos doutes et nos interrogations. Il nous invite à venir à Lui avec toutes nos questions. L'essentiel est d'avoir un cœur ouvert et sincère.

"Vous me chercherez, et vous me trouverez, si vous me cherchez de tout votre cœur." (Jérémie 29:13)`;

    const versetsCles = [
      {
        reference: 'Romains 3:23',
        texte: 'Car tous ont péché et sont privés de la gloire de Dieu.',
        version: 'Louis Segond'
      },
      {
        reference: 'Romains 6:23',
        texte: 'Car le salaire du péché, c\'est la mort; mais le don gratuit de Dieu, c\'est la vie éternelle en Jésus-Christ notre Seigneur.',
        version: 'Louis Segond'
      },
      {
        reference: 'Jean 3:16',
        texte: 'Car Dieu a tant aimé le monde qu\'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu\'il ait la vie éternelle.',
        version: 'Louis Segond'
      },
      {
        reference: 'Jean 14:6',
        texte: 'Jésus lui dit: Je suis le chemin, la vérité, et la vie. Nul ne vient au Père que par moi.',
        version: 'Louis Segond'
      },
      {
        reference: 'Romains 10:9-10',
        texte: 'Si tu confesses de ta bouche le Seigneur Jésus, et si tu crois dans ton cœur que Dieu l\'a ressuscité des morts, tu seras sauvé. Car c\'est en croyant du cœur qu\'on parvient à la justice, et c\'est en confessant de la bouche qu\'on parvient au salut.',
        version: 'Louis Segond'
      }
    ];

    const result = await Ressource.updateOne(
      { categorie: 'Réponses aux questions' },
      {
        $set: {
          titre: 'Questions fréquentes sur le salut',
          description: 'Réponses bibliques aux questions les plus posées lors de l\'évangélisation',
          contenu: nouveauContenu,
          versetsBibliques: versetsCles,
          tags: ['questions', 'réponses', 'évangélisation', 'apologétique', 'doutes'],
          publicCible: 'Non-croyants'
        }
      }
    );

    console.log('Résultat de la mise à jour:', result);

    if (result.modifiedCount > 0) {
      console.log('✅ Ressource "Réponses aux questions" mise à jour avec succès!');
    } else {
      console.log('⚠️ Aucune modification effectuée. Vérification...');

      // Vérifier si la ressource existe
      const ressource = await Ressource.findOne({ categorie: 'Réponses aux questions' });
      if (ressource) {
        console.log('La ressource existe:', ressource.titre);
      } else {
        console.log('❌ Aucune ressource trouvée avec la catégorie "Réponses aux questions"');
        console.log('Création d\'une nouvelle ressource...');

        const nouvelleRessource = new Ressource({
          titre: 'Questions fréquentes sur le salut',
          description: 'Réponses bibliques aux questions les plus posées lors de l\'évangélisation',
          categorie: 'Réponses aux questions',
          type: 'Texte',
          contenu: nouveauContenu,
          versetsBibliques: versetsCles,
          tags: ['questions', 'réponses', 'évangélisation', 'apologétique', 'doutes'],
          publicCible: 'Non-croyants',
          statut: 'Publié'
        });

        await nouvelleRessource.save();
        console.log('✅ Nouvelle ressource créée avec succès!');
      }
    }

    await mongoose.connection.close();
    console.log('Connexion fermée');
  } catch (error) {
    console.error('Erreur:', error);
    process.exit(1);
  }
};

mettreAJour();

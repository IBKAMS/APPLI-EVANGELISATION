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

// 1. Versets clés pour l'évangélisation
const contenuVersets = `📖 VERSETS CLÉS POUR L'ÉVANGÉLISATION

✝️ L'AMOUR DE DIEU

"Car Dieu a tant aimé le monde qu'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu'il ait la vie éternelle." (Jean 3:16)

"Mais Dieu prouve son amour envers nous, en ce que, lorsque nous étions encore des pécheurs, Christ est mort pour nous." (Romains 5:8)

---

✝️ LE PÉCHÉ DE L'HOMME

"Car tous ont péché et sont privés de la gloire de Dieu." (Romains 3:23)

"Car le salaire du péché, c'est la mort; mais le don gratuit de Dieu, c'est la vie éternelle en Jésus Christ notre Seigneur." (Romains 6:23)

---

✝️ LE SALUT EN JÉSUS-CHRIST

"Jésus lui dit: Je suis le chemin, la vérité, et la vie. Nul ne vient au Père que par moi." (Jean 14:6)

"Il n'y a de salut en aucun autre; car il n'y a sous le ciel aucun autre nom qui ait été donné parmi les hommes, par lequel nous devions être sauvés." (Actes 4:12)

"Crois au Seigneur Jésus, et tu seras sauvé, toi et ta famille." (Actes 16:31)

---

✝️ LA NOUVELLE NAISSANCE

"Mais à tous ceux qui l'ont reçue, à ceux qui croient en son nom, elle a donné le pouvoir de devenir enfants de Dieu." (Jean 1:12)

"Si tu confesses de ta bouche le Seigneur Jésus, et si tu crois dans ton cœur que Dieu l'a ressuscité des morts, tu seras sauvé." (Romains 10:9)

"Si quelqu'un est en Christ, il est une nouvelle créature. Les choses anciennes sont passées; voici, toutes choses sont devenues nouvelles." (2 Corinthiens 5:17)

---

✝️ L'ASSURANCE DU SALUT

"Je leur donne la vie éternelle; et elles ne périront jamais, et personne ne les ravira de ma main." (Jean 10:28)

"Je vous ai écrit ces choses, afin que vous sachiez que vous avez la vie éternelle, vous qui croyez au nom du Fils de Dieu." (1 Jean 5:13)`;

// 2. Le Plan du Salut
const contenuPlanSalut = `🙏 LE PLAN DU SALUT EN 5 ÉTAPES

1. RECONNAÎTRE QUE VOUS ÊTES PÉCHEUR

Nous avons tous péché et avons besoin du pardon de Dieu.

"Car tous ont péché et sont privés de la gloire de Dieu." (Romains 3:23)

---

2. COMPRENDRE LES CONSÉQUENCES DU PÉCHÉ

Le péché nous sépare de Dieu et conduit à la mort spirituelle.

"Car le salaire du péché, c'est la mort; mais le don gratuit de Dieu, c'est la vie éternelle en Jésus Christ notre Seigneur." (Romains 6:23)

---

3. CROIRE QUE JÉSUS EST MORT POUR VOS PÉCHÉS

Dieu a envoyé son Fils Jésus pour mourir à notre place et payer le prix de nos péchés.

"Mais Dieu prouve son amour envers nous, en ce que, lorsque nous étions encore des pécheurs, Christ est mort pour nous." (Romains 5:8)

---

4. ACCEPTER JÉSUS DANS VOTRE CŒUR

Confessez votre foi en Jésus-Christ comme Seigneur et Sauveur.

"Si tu confesses de ta bouche le Seigneur Jésus, et si tu crois dans ton cœur que Dieu l'a ressuscité des morts, tu seras sauvé. Car c'est en croyant du cœur qu'on parvient à la justice, et c'est en confessant de la bouche qu'on parvient au salut." (Romains 10:9-10)

---

5. SUIVRE JÉSUS CHAQUE JOUR

Engagez-vous à vivre pour Christ et à Le suivre quotidiennement.

"Si quelqu'un veut venir après moi, qu'il renonce à lui-même, qu'il se charge de sa croix, et qu'il me suive." (Matthieu 16:24)

"Mais à tous ceux qui l'ont reçue, à ceux qui croient en son nom, elle a donné le pouvoir de devenir enfants de Dieu." (Jean 1:12)`;

// 3. Qui est Jésus-Christ ?
const contenuJesus = `✝️ QUI EST JÉSUS-CHRIST ?

🙏 JÉSUS EST LE FILS DE DIEU

Jésus-Christ est le Fils unique de Dieu, venu sur terre pour sauver l'humanité du péché.

"Car Dieu a tant aimé le monde qu'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu'il ait la vie éternelle." (Jean 3:16)

---

🙏 JÉSUS EST DIEU FAIT HOMME

Il est à la fois pleinement Dieu et pleinement homme. Il est né d'une vierge, Marie, à Bethléem.

"Au commencement était la Parole, et la Parole était avec Dieu, et la Parole était Dieu. Et la Parole a été faite chair, et elle a habité parmi nous." (Jean 1:1,14)

---

🙏 JÉSUS A ACCOMPLI DES MIRACLES

Durant sa vie terrestre, Jésus a accompli de nombreux miracles : guérisons, résurrections, multiplication des pains...

"Jésus a fait encore, en présence de ses disciples, beaucoup d'autres miracles, qui ne sont pas écrits dans ce livre." (Jean 20:30)

---

🙏 JÉSUS EST MORT POUR NOS PÉCHÉS

Il est mort sur la croix pour nos péchés, puis est ressuscité le troisième jour.

"Christ est mort pour nos péchés, selon les Écritures; il a été enseveli, et il est ressuscité le troisième jour, selon les Écritures." (1 Corinthiens 15:3-4)

---

🙏 JÉSUS EST LE SEUL CHEMIN VERS DIEU

"Jésus lui dit: Je suis le chemin, la vérité, et la vie. Nul ne vient au Père que par moi." (Jean 14:6)

---

✨ JÉSUS EST :
- Le Fils de Dieu
- Le Sauveur du monde
- Le Chemin, la Vérité et la Vie
- Le Bon Berger
- Le Pain de Vie
- La Lumière du monde
- Le Roi des rois et Seigneur des seigneurs`;

// 4. Prière du Salut
const contenuPriere = `🙏 PRIÈRE POUR RECEVOIR JÉSUS-CHRIST

Si vous désirez accepter Jésus-Christ comme votre Sauveur personnel, répétez cette prière avec foi :

---

✝️ LA PRIÈRE

"Seigneur Jésus, je reconnais que je suis un pécheur et que j'ai besoin de ton pardon.

Je crois que tu es mort sur la croix pour mes péchés et que tu es ressuscité des morts.

Je me détourne de mes péchés et je t'invite à entrer dans mon cœur et dans ma vie.

Je veux te suivre et t'obéir comme mon Seigneur et mon Sauveur.

Merci de me pardonner et de me donner la vie éternelle.

Au nom de Jésus, Amen."

---

🙏 LA PROMESSE DE DIEU

"Si tu confesses de ta bouche le Seigneur Jésus, et si tu crois dans ton cœur que Dieu l'a ressuscité des morts, tu seras sauvé." (Romains 10:9)

"Mais à tous ceux qui l'ont reçue, à ceux qui croient en son nom, elle a donné le pouvoir de devenir enfants de Dieu." (Jean 1:12)

---

🎉 FÉLICITATIONS !

Si vous avez prié cette prière avec sincérité, vous êtes maintenant un enfant de Dieu !

"Si quelqu'un est en Christ, il est une nouvelle créature. Les choses anciennes sont passées; voici, toutes choses sont devenues nouvelles." (2 Corinthiens 5:17)

✨ Bienvenue dans la famille de Dieu !

📖 Prochaines étapes :
- Lisez la Bible chaque jour (commencez par l'Évangile de Jean)
- Priez régulièrement
- Rejoignez une église locale
- Partagez votre nouvelle foi avec d'autres`;

async function updateAllRessources() {
  try {
    console.log('🔄 Connexion à MongoDB Atlas...');
    await mongoose.connect(ATLAS_URI);
    console.log('✅ Connecté!\n');

    // Mise à jour des ressources
    const updates = [
      {
        titre: 'Versets clés pour l\'évangélisation',
        contenu: contenuVersets,
        description: 'Compilation de versets essentiels pour partager l\'Évangile avec des couleurs distinctes'
      },
      {
        titre: 'Le Plan du Salut',
        contenu: contenuPlanSalut,
        description: 'Les 5 étapes pour recevoir Jésus comme Sauveur personnel avec couleurs'
      },
      {
        titre: 'Qui est Jésus-Christ ?',
        contenu: contenuJesus,
        description: 'Présentation complète de la personne de Jésus-Christ avec couleurs distinctes'
      },
      {
        titre: 'Prière du Salut',
        contenu: contenuPriere,
        description: 'Une prière pour accepter Jésus-Christ comme Sauveur personnel avec mise en forme colorée'
      }
    ];

    for (const update of updates) {
      const result = await Ressource.updateOne(
        { titre: update.titre },
        { $set: { contenu: update.contenu, description: update.description } }
      );

      if (result.modifiedCount > 0) {
        console.log(`✅ ${update.titre}`);
      } else {
        console.log(`⚠️ ${update.titre} - Non trouvé ou non modifié`);
      }
    }

    console.log('\n═══════════════════════════════════════');
    console.log('   Toutes les ressources mises à jour!');
    console.log('   Avec couleurs distinctes:');
    console.log('   - Titres en BLEU');
    console.log('   - Étapes en ROUGE');
    console.log('   - Versets en ORANGE');
    console.log('   - Sections importantes avec emojis');
    console.log('═══════════════════════════════════════');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

updateAllRessources();

const mongoose = require('mongoose');

const ATLAS_URI = 'mongodb+srv://aidriss01_db_user:Cdv5RAnJmGiry2JG@cluster0.bkwuof5.mongodb.net/rehoboth_evangelisation?retryWrites=true&w=majority';

// Schéma Ressource (identique au modèle)
const ressourceSchema = new mongoose.Schema({
  titre: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  categorie: {
    type: String,
    enum: ['Qui est Jésus', 'Plan de salut', 'Prière du Salut', 'Versets clés', 'Témoignages', 'Réponses aux questions', 'Comment prier', 'Comment lire la Bible', 'Vie chrétienne', 'Apologétique', 'Formation', 'Autre'],
    required: true
  },
  type: { type: String, enum: ['Texte', 'Vidéo', 'Audio', 'PDF', 'Lien externe'], required: true },
  contenu: String,
  urlMedia: String,
  versetsBibliques: [{
    reference: { type: String, required: true },
    texte: { type: String, required: true },
    version: { type: String, default: 'Louis Segond' }
  }],
  tags: [String],
  publicCible: { type: String, enum: ['Non-croyants', 'Nouveaux convertis', 'Chrétiens matures', 'Tous'], default: 'Tous' },
  partage: {
    nombreVues: { type: Number, default: 0 },
    nombrePartages: { type: Number, default: 0 }
  },
  statut: { type: String, enum: ['Publié', 'Brouillon', 'Archivé'], default: 'Publié' }
}, { timestamps: true });

const Ressource = mongoose.model('Ressource', ressourceSchema);

// Ressources originales
const ressourcesOriginales = [
  {
    titre: 'Questions fréquentes sur le salut',
    description: 'Réponses bibliques aux questions les plus posées lors de l\'évangélisation',
    categorie: 'Réponses aux questions',
    type: 'Texte',
    contenu: `**Comment puis-je être sauvé ?**
La Bible dit : "Crois au Seigneur Jésus, et tu seras sauvé" (Actes 16:31). Le salut vient par la foi en Jésus-Christ.

**Dois-je faire de bonnes œuvres pour être sauvé ?**
Non, le salut est un don gratuit de Dieu. "C'est par la grâce que vous êtes sauvés, par le moyen de la foi. Et cela ne vient pas de vous, c'est le don de Dieu. Ce n'est point par les œuvres, afin que personne ne se glorifie." (Éphésiens 2:8-9)

**Puis-je perdre mon salut ?**
Jésus a dit : "Je leur donne la vie éternelle; et elles ne périront jamais, et personne ne les ravira de ma main." (Jean 10:28)

**Que dois-je faire pour être sauvé ?**
1. Reconnaître que vous êtes pécheur
2. Croire que Jésus est mort pour vos péchés
3. Confesser Jésus comme votre Seigneur
4. L'inviter dans votre cœur`,
    versetsBibliques: [
      { reference: 'Actes 16:31', texte: 'Crois au Seigneur Jésus, et tu seras sauvé, toi et ta famille.', version: 'Louis Segond' },
      { reference: 'Éphésiens 2:8-9', texte: 'C\'est par la grâce que vous êtes sauvés, par le moyen de la foi. Et cela ne vient pas de vous, c\'est le don de Dieu. Ce n\'est point par les œuvres, afin que personne ne se glorifie.', version: 'Louis Segond' }
    ],
    tags: ['Salut', 'Questions', 'FAQ', 'Évangélisation'],
    publicCible: 'Non-croyants',
    statut: 'Publié'
  },
  {
    titre: 'Prière du Salut',
    description: 'Une prière pour accepter Jésus-Christ comme Sauveur personnel et recevoir la vie éternelle',
    categorie: 'Prière du Salut',
    type: 'Texte',
    contenu: `**Prière pour recevoir Jésus-Christ**

Si vous désirez accepter Jésus-Christ comme votre Sauveur personnel, répétez cette prière avec foi :

"Seigneur Jésus, je reconnais que je suis un pécheur et que j'ai besoin de ton pardon.

Je crois que tu es mort sur la croix pour mes péchés et que tu es ressuscité des morts.

Je me détourne de mes péchés et je t'invite à entrer dans mon cœur et dans ma vie.

Je veux te suivre et t'obéir comme mon Seigneur et mon Sauveur.

Merci de me pardonner et de me donner la vie éternelle.

Au nom de Jésus, Amen."

**Félicitations !**
Si vous avez prié cette prière avec sincérité, vous êtes maintenant un enfant de Dieu. Bienvenue dans la famille !`,
    versetsBibliques: [
      { reference: 'Romains 10:9', texte: 'Si tu confesses de ta bouche le Seigneur Jésus, et si tu crois dans ton cœur que Dieu l\'a ressuscité des morts, tu seras sauvé.', version: 'Louis Segond' },
      { reference: 'Jean 1:12', texte: 'Mais à tous ceux qui l\'ont reçue, à ceux qui croient en son nom, elle a donné le pouvoir de devenir enfants de Dieu.', version: 'Louis Segond' }
    ],
    tags: ['Prière', 'Salut', 'Conversion', 'Nouveau croyant'],
    publicCible: 'Non-croyants',
    statut: 'Publié'
  },
  {
    titre: 'Qui est Jésus-Christ ?',
    description: 'Présentation complète de la personne de Jésus-Christ',
    categorie: 'Qui est Jésus',
    type: 'Texte',
    contenu: `Jésus-Christ est le Fils de Dieu, venu sur terre pour sauver l'humanité du péché.

Il est à la fois pleinement Dieu et pleinement homme. Il est né d'une vierge, Marie, à Bethléem il y a plus de 2000 ans.

Durant sa vie terrestre, Jésus a accompli de nombreux miracles, enseigné la vérité de Dieu et démontré un amour parfait.

Il est mort sur la croix pour nos péchés, puis est ressuscité le troisième jour, démontrant sa victoire sur la mort et le péché.

**Jésus est :**
- Le Fils de Dieu
- Le Sauveur du monde
- Le Chemin, la Vérité et la Vie
- Le Bon Berger
- Le Pain de Vie
- La Lumière du monde`,
    versetsBibliques: [
      { reference: 'Jean 3:16', texte: 'Car Dieu a tant aimé le monde qu\'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu\'il ait la vie éternelle.', version: 'Louis Segond' },
      { reference: 'Jean 14:6', texte: 'Jésus lui dit: Je suis le chemin, la vérité, et la vie. Nul ne vient au Père que par moi.', version: 'Louis Segond' }
    ],
    tags: ['Jésus', 'Salut', 'Évangile'],
    publicCible: 'Non-croyants',
    statut: 'Publié'
  },
  {
    titre: 'Le Plan du Salut',
    description: 'Les étapes pour recevoir Jésus comme Sauveur personnel',
    categorie: 'Plan de salut',
    type: 'Texte',
    contenu: `1. RECONNAÎTRE que vous êtes pécheur
Tous ont péché et sont privés de la gloire de Dieu (Romains 3:23)

2. COMPRENDRE les conséquences du péché
Le salaire du péché, c'est la mort (Romains 6:23)

3. CROIRE que Jésus est mort pour vos péchés
Mais Dieu prouve son amour envers nous en ce que, lorsque nous étions encore des pécheurs, Christ est mort pour nous (Romains 5:8)

4. ACCEPTER Jésus dans votre cœur
Si tu confesses de ta bouche le Seigneur Jésus, et si tu crois dans ton cœur que Dieu l'a ressuscité des morts, tu seras sauvé (Romains 10:9)

5. SUIVRE Jésus chaque jour
Si quelqu'un veut venir après moi, qu'il renonce à lui-même, qu'il se charge de sa croix, et qu'il me suive (Matthieu 16:24)`,
    versetsBibliques: [
      { reference: 'Romains 10:9-10', texte: 'Si tu confesses de ta bouche le Seigneur Jésus, et si tu crois dans ton cœur que Dieu l\'a ressuscité des morts, tu seras sauvé. Car c\'est en croyant du cœur qu\'on parvient à la justice, et c\'est en confessant de la bouche qu\'on parvient au salut.', version: 'Louis Segond' }
    ],
    tags: ['Salut', 'Conversion', 'Évangile'],
    publicCible: 'Non-croyants',
    statut: 'Publié'
  },
  {
    titre: 'Comment prier efficacement',
    description: 'Guide pratique pour développer une vie de prière',
    categorie: 'Comment prier',
    type: 'Texte',
    contenu: `La prière est une conversation avec Dieu. Voici comment prier :

1. TROUVEZ UN LIEU TRANQUILLE
Quand tu pries, entre dans ta chambre, ferme ta porte, et prie ton Père qui est là dans le lieu secret (Matthieu 6:6)

2. COMMENCEZ PAR L'ADORATION
Notre Père qui es aux cieux, que ton nom soit sanctifié (Matthieu 6:9)

3. REMERCIEZ DIEU
Rendez grâces en toutes choses (1 Thessaloniciens 5:18)

4. CONFESSEZ VOS PÉCHÉS
Si nous confessons nos péchés, il est fidèle et juste pour nous les pardonner (1 Jean 1:9)

5. PRÉSENTEZ VOS REQUÊTES
Ne vous inquiétez de rien; mais en toute chose faites connaître vos besoins à Dieu (Philippiens 4:6)

6. PRIEZ POUR LES AUTRES
Priez les uns pour les autres (Jacques 5:16)

7. TERMINEZ PAR LA FOI
Tout ce que vous demanderez en priant, croyez que vous l'avez reçu, et vous le verrez s'accomplir (Marc 11:24)`,
    versetsBibliques: [
      { reference: 'Matthieu 6:9-13', texte: 'Voici donc comment vous devez prier: Notre Père qui es aux cieux! Que ton nom soit sanctifié; que ton règne vienne; que ta volonté soit faite sur la terre comme au ciel. Donne-nous aujourd\'hui notre pain quotidien; pardonne-nous nos offenses, comme nous aussi nous pardonnons à ceux qui nous ont offensés; ne nous induis pas en tentation, mais délivre-nous du malin. Car c\'est à toi qu\'appartiennent, dans tous les siècles, le règne, la puissance et la gloire. Amen!', version: 'Louis Segond' }
    ],
    tags: ['Prière', 'Formation', 'Vie chrétienne'],
    publicCible: 'Nouveaux convertis',
    statut: 'Publié'
  },
  {
    titre: 'Versets clés pour l\'évangélisation',
    description: 'Compilation de versets essentiels pour partager l\'Évangile',
    categorie: 'Versets clés',
    type: 'Texte',
    contenu: 'Collection de versets bibliques pour évangéliser efficacement.',
    versetsBibliques: [
      { reference: 'Jean 3:16', texte: 'Car Dieu a tant aimé le monde qu\'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu\'il ait la vie éternelle.', version: 'Louis Segond' },
      { reference: 'Romains 3:23', texte: 'Car tous ont péché et sont privés de la gloire de Dieu.', version: 'Louis Segond' },
      { reference: 'Romains 6:23', texte: 'Car le salaire du péché, c\'est la mort; mais le don gratuit de Dieu, c\'est la vie éternelle en Jésus Christ notre Seigneur.', version: 'Louis Segond' },
      { reference: 'Romains 5:8', texte: 'Mais Dieu prouve son amour envers nous, en ce que, lorsque nous étions encore des pécheurs, Christ est mort pour nous.', version: 'Louis Segond' },
      { reference: 'Jean 1:12', texte: 'Mais à tous ceux qui l\'ont reçue, à ceux qui croient en son nom, elle a donné le pouvoir de devenir enfants de Dieu.', version: 'Louis Segond' },
      { reference: 'Actes 16:31', texte: 'Crois au Seigneur Jésus, et tu seras sauvé, toi et ta famille.', version: 'Louis Segond' }
    ],
    tags: ['Versets', 'Évangélisation', 'Bible'],
    publicCible: 'Tous',
    statut: 'Publié'
  }
];

async function seedRessourcesOriginales() {
  try {
    console.log('🔄 Connexion à MongoDB Atlas...');
    await mongoose.connect(ATLAS_URI);
    console.log('✅ Connecté!\n');

    // Supprimer toutes les ressources existantes
    await Ressource.deleteMany({});
    console.log('🗑️ Anciennes ressources supprimées\n');

    // Créer les ressources originales
    console.log('📚 Création des ressources originales...\n');

    for (const ressource of ressourcesOriginales) {
      await Ressource.create(ressource);
      console.log(`✅ ${ressource.titre} (${ressource.categorie})`);
    }

    console.log('\n═══════════════════════════════════════');
    console.log(`📋 ${ressourcesOriginales.length} ressources créées avec succès!`);
    console.log('═══════════════════════════════════════');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

seedRessourcesOriginales();

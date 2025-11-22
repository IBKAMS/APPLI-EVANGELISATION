const mongoose = require('mongoose');

const ATLAS_URI = 'mongodb+srv://aidriss01_db_user:Cdv5RAnJmGiry2JG@cluster0.bkwuof5.mongodb.net/rehoboth_evangelisation?retryWrites=true&w=majority';

// Schéma Ressource
const ressourceSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['PDF', 'Video', 'Audio', 'Image', 'Lien', 'Document'], required: true },
  categorie: { type: String, enum: ['Évangélisation', 'Formation', 'Prière', 'Témoignage', 'Étude biblique', 'Autre'], required: true },
  url: { type: String },
  contenu: { type: String },
  fichier: { type: String },
  miniature: { type: String },
  auteur: { type: String },
  datePublication: { type: Date, default: Date.now },
  actif: { type: Boolean, default: true },
  telechargements: { type: Number, default: 0 },
  vues: { type: Number, default: 0 }
}, { timestamps: true });

const Ressource = mongoose.model('Ressource', ressourceSchema);

const ressourcesData = [
  // === ÉVANGÉLISATION ===
  {
    titre: "Les 4 lois spirituelles",
    description: "Guide classique pour partager l'Évangile de manière simple et claire. Ce document présente les quatre vérités fondamentales du salut en Jésus-Christ.",
    type: "Document",
    categorie: "Évangélisation",
    contenu: `**1. Dieu vous aime et a un plan merveilleux pour votre vie**
Jean 3:16 - "Car Dieu a tant aimé le monde qu'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu'il ait la vie éternelle."

**2. L'homme est pécheur et séparé de Dieu**
Romains 3:23 - "Car tous ont péché et sont privés de la gloire de Dieu."

**3. Jésus-Christ est l'unique solution de Dieu pour le péché**
Romains 5:8 - "Mais Dieu prouve son amour envers nous, en ce que, lorsque nous étions encore des pécheurs, Christ est mort pour nous."

**4. Nous devons recevoir Jésus-Christ personnellement**
Jean 1:12 - "Mais à tous ceux qui l'ont reçu, à ceux qui croient en son nom, il a donné le pouvoir de devenir enfants de Dieu."`,
    auteur: "Centre Missionnaire REHOBOTH",
    actif: true
  },
  {
    titre: "Comment aborder une personne dans la rue",
    description: "Conseils pratiques et techniques éprouvées pour engager une conversation spirituelle avec des inconnus lors de l'évangélisation de rue.",
    type: "Document",
    categorie: "Évangélisation",
    contenu: `**Préparation spirituelle**
- Priez avant de sortir
- Demandez au Saint-Esprit de vous guider
- Soyez rempli de compassion

**Approche initiale**
- Souriez et soyez amical
- Présentez-vous poliment
- Posez une question ouverte: "Puis-je vous poser une question spirituelle?"

**Questions d'accroche**
- "Selon vous, qu'est-ce qui arrive après la mort?"
- "Si vous deviez vous présenter devant Dieu, que lui diriez-vous?"
- "Avez-vous une relation personnelle avec Dieu?"

**Écoute active**
- Laissez la personne s'exprimer
- Ne jugez pas
- Montrez de l'empathie

**Partage de l'Évangile**
- Utilisez votre témoignage personnel
- Présentez les 4 lois spirituelles
- Invitez à recevoir Jésus`,
    auteur: "Équipe Évangélisation REHOBOTH",
    actif: true
  },
  {
    titre: "Script de présentation de l'Évangile",
    description: "Un script simple et efficace pour présenter l'Évangile en 5 minutes. Idéal pour les débutants en évangélisation.",
    type: "Document",
    categorie: "Évangélisation",
    contenu: `**Introduction (30 sec)**
"Bonjour, je m'appelle [Nom]. Je fais partie d'une équipe de chrétiens qui partage un message d'espoir. Puis-je vous accorder quelques minutes?"

**Le problème (1 min)**
"La Bible dit que tous les hommes ont péché et sont séparés de Dieu. Le péché nous empêche d'avoir une relation avec Lui et nous conduit à la mort spirituelle."

**La solution (1 min 30)**
"Mais Dieu nous aime tellement qu'Il a envoyé son Fils Jésus mourir sur la croix pour nos péchés. Jésus a payé le prix de notre faute et est ressuscité pour nous donner la vie éternelle."

**L'invitation (1 min)**
"Pour recevoir ce cadeau, vous devez croire en Jésus, vous repentir de vos péchés et l'accepter comme votre Seigneur et Sauveur."

**La décision (1 min)**
"Voulez-vous accepter Jésus aujourd'hui? Si oui, répétez cette prière avec moi..."

**Prière de salut**
"Seigneur Jésus, je reconnais que je suis pécheur. Je crois que Tu es mort pour mes péchés et ressuscité. Je Te demande pardon et je T'accepte comme mon Seigneur et Sauveur. Amen."`,
    auteur: "Département Évangélisation",
    actif: true
  },
  {
    titre: "Versets clés pour l'évangélisation",
    description: "Collection des versets bibliques les plus importants à mémoriser pour l'évangélisation personnelle.",
    type: "Document",
    categorie: "Évangélisation",
    contenu: `**Sur l'amour de Dieu**
- Jean 3:16 - "Car Dieu a tant aimé le monde..."
- Romains 5:8 - "Dieu prouve son amour envers nous..."
- 1 Jean 4:9-10 - "L'amour de Dieu a été manifesté..."

**Sur le péché**
- Romains 3:23 - "Car tous ont péché..."
- Romains 6:23 - "Le salaire du péché, c'est la mort..."
- Ésaïe 59:2 - "Vos iniquités vous séparent de Dieu..."

**Sur le salut en Christ**
- Jean 14:6 - "Je suis le chemin, la vérité et la vie..."
- Actes 4:12 - "Il n'y a de salut en aucun autre..."
- Éphésiens 2:8-9 - "C'est par la grâce que vous êtes sauvés..."

**Sur la nouvelle naissance**
- Jean 1:12 - "À tous ceux qui l'ont reçu..."
- 2 Corinthiens 5:17 - "Si quelqu'un est en Christ, il est une nouvelle créature..."
- Jean 3:3 - "Si un homme ne naît de nouveau..."

**Sur l'assurance du salut**
- 1 Jean 5:13 - "Afin que vous sachiez que vous avez la vie éternelle..."
- Romains 8:1 - "Il n'y a donc maintenant aucune condamnation..."
- Jean 10:28 - "Je leur donne la vie éternelle..."`,
    auteur: "Centre Missionnaire REHOBOTH",
    actif: true
  },

  // === FORMATION ===
  {
    titre: "Guide du nouvel évangéliste",
    description: "Formation complète pour les nouveaux membres de l'équipe d'évangélisation. Couvre les bases de l'évangélisation personnelle.",
    type: "Document",
    categorie: "Formation",
    contenu: `**Module 1 : L'appel à l'évangélisation**
- Le Grand Commandement (Matthieu 28:19-20)
- L'exemple de Jésus et des apôtres
- Votre rôle en tant que témoin

**Module 2 : Préparation spirituelle**
- La prière quotidienne
- L'étude de la Parole
- La vie sanctifiée
- L'onction du Saint-Esprit

**Module 3 : Connaissance de l'Évangile**
- Les vérités fondamentales
- Comment présenter le plan du salut
- Répondre aux objections courantes

**Module 4 : Techniques pratiques**
- Comment aborder les gens
- L'art de poser des questions
- L'écoute active
- Le suivi des nouveaux convertis

**Module 5 : Le travail en équipe**
- Organisation des sorties
- Rôles et responsabilités
- Rapport et débriefing`,
    auteur: "Équipe Formation REHOBOTH",
    actif: true
  },
  {
    titre: "Répondre aux objections courantes",
    description: "Guide pratique pour répondre avec sagesse aux questions et objections les plus fréquentes lors de l'évangélisation.",
    type: "Document",
    categorie: "Formation",
    contenu: `**"Je suis déjà chrétien/musulman/athée"**
Réponse : "Je comprends. Mais puis-je vous demander : si vous deviez mourir ce soir, êtes-vous certain d'aller au paradis? Sur quoi basez-vous cette certitude?"

**"Je n'ai pas le temps"**
Réponse : "Je comprends que vous soyez occupé. Puis-je vous laisser un tract à lire quand vous aurez un moment? C'est le message le plus important que vous puissiez recevoir."

**"Je ne crois pas en Dieu"**
Réponse : "Je respecte votre opinion. Mais si Dieu existait et vous aimait, voudriez-vous le savoir? La Bible dit que Dieu peut se révéler à ceux qui le cherchent sincèrement."

**"Il y a trop de souffrance dans le monde"**
Réponse : "C'est vrai, et cela nous attriste aussi. Mais la souffrance vient du péché de l'homme, pas de Dieu. C'est justement pourquoi Jésus est venu : pour nous libérer du péché et nous donner l'espérance."

**"Toutes les religions mènent à Dieu"**
Réponse : "Je comprends cette pensée. Mais Jésus a dit : 'Je suis le chemin, la vérité et la vie. Nul ne vient au Père que par moi.' C'est une déclaration exclusive. Soit Il dit la vérité, soit Il ment."

**"Je suis trop pécheur"**
Réponse : "C'est justement pour les pécheurs que Jésus est venu! Il a dit : 'Ce ne sont pas ceux qui se portent bien qui ont besoin de médecin, mais les malades.' Personne n'est trop pécheur pour Dieu."`,
    auteur: "Département Apologétique",
    actif: true
  },

  // === PRIÈRE ===
  {
    titre: "Prières pour l'évangélisation",
    description: "Collection de prières pour préparer et accompagner vos sorties d'évangélisation.",
    type: "Document",
    categorie: "Prière",
    contenu: `**Prière avant la sortie**
"Père céleste, nous Te remercions pour cette opportunité de partager Ton amour. Remplis-nous de Ton Esprit Saint. Donne-nous la sagesse, le courage et les mots justes. Prépare les cœurs que nous allons rencontrer. Au nom de Jésus, Amen."

**Prière pour les âmes perdues**
"Seigneur, nous prions pour toutes les âmes qui vivent sans Te connaître. Ouvre leurs yeux spirituels. Brise les chaînes de l'ennemi. Attire-les à Toi par Ton amour. Utilise-nous comme instruments de Ta grâce. Amen."

**Prière de protection**
"Père, nous nous couvrons du sang de Jésus. Nous revêtons l'armure complète de Dieu. Protège-nous contre toute attaque de l'ennemi. Que Tes anges nous entourent et nous gardent. Amen."

**Prière pour les nouveaux convertis**
"Seigneur, nous Te confions chaque âme qui a accepté Jésus aujourd'hui. Affermis leur foi. Protège-les des attaques de l'ennemi. Guide-les vers une église locale. Aide-les à grandir dans la foi. Amen."

**Prière de reconnaissance**
"Merci Seigneur pour cette journée d'évangélisation. Merci pour chaque conversation, chaque graine semée. Nous Te faisons confiance pour la moisson. À Toi soit toute la gloire! Amen."`,
    auteur: "Département Intercession",
    actif: true
  },

  // === TÉMOIGNAGE ===
  {
    titre: "Comment partager votre témoignage",
    description: "Guide pour structurer et partager efficacement votre témoignage de conversion en 3 minutes.",
    type: "Document",
    categorie: "Témoignage",
    contenu: `**Structure en 3 parties**

**1. MA VIE AVANT CHRIST (1 min)**
- Décrivez brièvement votre situation
- Parlez de vos recherches, vos besoins
- Soyez honnête mais pas trop détaillé sur le péché

**2. COMMENT J'AI RENCONTRÉ CHRIST (1 min)**
- Les circonstances de votre conversion
- Ce qui vous a touché dans l'Évangile
- Votre décision de suivre Jésus

**3. MA VIE DEPUIS (1 min)**
- Les changements concrets dans votre vie
- Comment Jésus vous aide au quotidien
- Votre espérance pour l'éternité

**Conseils pratiques**
- Pratiquez votre témoignage jusqu'à le maîtriser
- Soyez authentique et sincère
- Évitez le jargon religieux
- Concentrez-vous sur Jésus, pas sur vous
- Terminez par une invitation à recevoir Christ`,
    auteur: "Équipe Évangélisation",
    actif: true
  },

  // === ÉTUDE BIBLIQUE ===
  {
    titre: "Étude : Le plan du salut dans la Bible",
    description: "Étude biblique approfondie sur le plan de rédemption de Dieu à travers les Écritures.",
    type: "Document",
    categorie: "Étude biblique",
    contenu: `**Introduction**
Le plan du salut est le fil conducteur de toute la Bible, de la Genèse à l'Apocalypse.

**1. La création et la chute (Genèse 1-3)**
- Dieu crée l'homme à Son image
- L'homme pèche et se sépare de Dieu
- Promesse du Rédempteur (Genèse 3:15)

**2. La loi et les sacrifices (Lévitique)**
- La loi révèle le péché
- Les sacrifices couvrent temporairement le péché
- Tout pointe vers le sacrifice parfait à venir

**3. Les prophéties messianiques**
- Ésaïe 53 : Le serviteur souffrant
- Michée 5:2 : Né à Bethléhem
- Psaume 22 : La crucifixion annoncée

**4. L'accomplissement en Christ**
- La naissance virginale
- La vie parfaite
- La mort expiatoire
- La résurrection glorieuse

**5. L'application personnelle**
- La foi en Christ
- La repentance
- La nouvelle naissance
- La vie éternelle

**Conclusion**
Le salut est entièrement l'œuvre de Dieu, reçu par grâce au moyen de la foi.`,
    auteur: "Département Enseignement",
    actif: true
  },
  {
    titre: "Les promesses de Dieu pour le croyant",
    description: "Compilation des promesses bibliques à mémoriser et à partager lors de l'évangélisation et du suivi.",
    type: "Document",
    categorie: "Étude biblique",
    contenu: `**Promesses de salut**
- "Celui qui croit au Fils a la vie éternelle" (Jean 3:36)
- "Je ne mettrai pas dehors celui qui vient à moi" (Jean 6:37)

**Promesses de pardon**
- "Si nous confessons nos péchés, il est fidèle et juste pour nous les pardonner" (1 Jean 1:9)
- "Autant l'orient est éloigné de l'occident, autant il éloigne de nous nos transgressions" (Psaume 103:12)

**Promesses de présence**
- "Je suis avec vous tous les jours" (Matthieu 28:20)
- "Je ne te délaisserai point, je ne t'abandonnerai point" (Hébreux 13:5)

**Promesses de provision**
- "Mon Dieu pourvoira à tous vos besoins" (Philippiens 4:19)
- "Cherchez premièrement le royaume de Dieu... toutes ces choses vous seront données par-dessus" (Matthieu 6:33)

**Promesses de paix**
- "Je vous laisse la paix, je vous donne ma paix" (Jean 14:27)
- "La paix de Dieu gardera vos cœurs et vos pensées" (Philippiens 4:7)

**Promesses de victoire**
- "Nous sommes plus que vainqueurs par celui qui nous a aimés" (Romains 8:37)
- "Celui qui est en vous est plus grand que celui qui est dans le monde" (1 Jean 4:4)`,
    auteur: "Centre Missionnaire REHOBOTH",
    actif: true
  }
];

async function seedRessources() {
  try {
    console.log('🔄 Connexion à MongoDB Atlas...');
    await mongoose.connect(ATLAS_URI);
    console.log('✅ Connecté!\n');

    // Vérifier les ressources existantes
    const existingCount = await Ressource.countDocuments();
    console.log(`📊 Ressources existantes: ${existingCount}`);

    if (existingCount === 0) {
      // Créer toutes les ressources
      console.log('\n📚 Création des ressources d\'évangélisation...\n');

      for (const ressource of ressourcesData) {
        await Ressource.create(ressource);
        console.log(`✅ ${ressource.titre} (${ressource.categorie})`);
      }

      console.log('\n═══════════════════════════════════════');
      console.log(`📋 ${ressourcesData.length} ressources créées avec succès!`);
      console.log('═══════════════════════════════════════');
    } else {
      // Supprimer et recréer
      console.log('\n🗑️ Suppression des anciennes ressources...');
      await Ressource.deleteMany({});

      console.log('📚 Création des nouvelles ressources...\n');

      for (const ressource of ressourcesData) {
        await Ressource.create(ressource);
        console.log(`✅ ${ressource.titre} (${ressource.categorie})`);
      }

      console.log('\n═══════════════════════════════════════');
      console.log(`📋 ${ressourcesData.length} ressources recréées avec succès!`);
      console.log('═══════════════════════════════════════');
    }

    // Afficher le résumé par catégorie
    const categories = await Ressource.aggregate([
      { $group: { _id: '$categorie', count: { $sum: 1 } } }
    ]);

    console.log('\n📊 Ressources par catégorie:');
    categories.forEach(cat => {
      console.log(`   - ${cat._id}: ${cat.count}`);
    });

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

seedRessources();

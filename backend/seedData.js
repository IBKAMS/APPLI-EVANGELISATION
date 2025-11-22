const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Ressource = require('./models/Ressource');
const Parcours = require('./models/Parcours');

dotenv.config();

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connecté'))
.catch(err => console.error('Erreur de connexion:', err));

// Données de démonstration
const seedDatabase = async () => {
  try {
    // Supprimer les données existantes (optionnel)
    console.log('Nettoyage des données existantes...');
    // await User.deleteMany({});
    // await Ressource.deleteMany({});
    // await Parcours.deleteMany({});

    // Créer les utilisateurs administrateurs
    console.log('Création des utilisateurs administrateurs...');

    const admins = [
      {
        nom: 'ANCIEN',
        prenom: 'N\'GUESSAN',
        telephone: '0707964939',
        password: 'admin2025',
        role: 'admin',
        statut: 'actif'
      },
      {
        nom: 'AGNIMEL',
        prenom: 'ANCIEN VAL',
        telephone: '0708226161',
        password: 'admin2025',
        role: 'admin',
        statut: 'actif'
      },
      {
        nom: 'SAMPAH',
        prenom: 'PASTEUR',
        telephone: '0708993543',
        password: 'admin2025',
        role: 'admin',
        statut: 'actif'
      },
      {
        nom: 'DAGAUD',
        prenom: 'APÔTRE',
        telephone: '0586898848',
        password: 'admin2025',
        role: 'admin',
        statut: 'actif'
      },
      {
        nom: 'KAMISSOKO',
        prenom: 'IDRISS',
        telephone: '0708676604',
        password: 'admin2025',
        role: 'admin',
        statut: 'actif'
      },
      {
        nom: 'SOEUR',
        prenom: 'N\'GUESSAN',
        telephone: '0778092269',
        password: 'admin2025',
        role: 'admin',
        statut: 'actif'
      },
      {
        nom: 'KOUANDÉ',
        prenom: 'HERMANN',
        telephone: '0747313492',
        password: 'admin2025',
        role: 'admin',
        statut: 'actif'
      }
    ];

    const createdAdmins = await User.insertMany(admins);
    console.log(`${createdAdmins.length} administrateurs créés`);

    // Utiliser le premier admin pour créer les ressources et parcours
    const admin = createdAdmins[0];

    // Créer des ressources d'évangélisation
    console.log('Création de ressources d\'évangélisation...');

    const ressources = [
      {
        titre: 'Qui est Jésus-Christ ?',
        description: 'Présentation complète de la personne de Jésus-Christ',
        categorie: 'Qui est Jésus',
        type: 'Texte',
        contenu: `Jésus-Christ est le Fils de Dieu, venu sur terre pour sauver l'humanité du péché.

Il est à la fois pleinement Dieu et pleinement homme. Il est né d'une vierge, Marie, à Bethléem il y a plus de 2000 ans.

Durant sa vie terrestre, Jésus a accompli de nombreux miracles, enseigné la vérité de Dieu et démontré un amour parfait.

Il est mort sur la croix pour nos péchés, puis est ressuscité le troisième jour, démontrant sa victoire sur la mort et le péché.`,
        versetsBibliques: [
          {
            reference: 'Jean 3:16',
            texte: 'Car Dieu a tant aimé le monde qu\'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu\'il ait la vie éternelle.',
            version: 'Louis Segond'
          },
          {
            reference: 'Jean 14:6',
            texte: 'Jésus lui dit: Je suis le chemin, la vérité, et la vie. Nul ne vient au Père que par moi.',
            version: 'Louis Segond'
          }
        ],
        tags: ['Jésus', 'Salut', 'Évangile'],
        publicCible: 'Non-croyants',
        createur: admin._id,
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
          {
            reference: 'Romains 10:9-10',
            texte: 'Si tu confesses de ta bouche le Seigneur Jésus, et si tu crois dans ton cœur que Dieu l\'a ressuscité des morts, tu seras sauvé. Car c\'est en croyant du cœur qu\'on parvient à la justice, et c\'est en confessant de la bouche qu\'on parvient au salut.',
            version: 'Louis Segond'
          }
        ],
        tags: ['Salut', 'Conversion', 'Évangile'],
        publicCible: 'Non-croyants',
        createur: admin._id,
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
          {
            reference: 'Matthieu 6:9-13',
            texte: 'Voici donc comment vous devez prier: Notre Père qui es aux cieux! Que ton nom soit sanctifié; que ton règne vienne; que ta volonté soit faite sur la terre comme au ciel. Donne-nous aujourd\'hui notre pain quotidien; pardonne-nous nos offenses, comme nous aussi nous pardonnons à ceux qui nous ont offensés; ne nous induis pas en tentation, mais délivre-nous du malin. Car c\'est à toi qu\'appartiennent, dans tous les siècles, le règne, la puissance et la gloire. Amen!',
            version: 'Louis Segond'
          }
        ],
        tags: ['Prière', 'Formation', 'Vie chrétienne'],
        publicCible: 'Nouveaux convertis',
        createur: admin._id,
        statut: 'Publié'
      },
      {
        titre: 'Versets clés pour l\'évangélisation',
        description: 'Compilation de versets essentiels pour partager l\'Évangile',
        categorie: 'Versets clés',
        type: 'Texte',
        contenu: 'Collection de versets bibliques pour évangéliser efficacement.',
        versetsBibliques: [
          {
            reference: 'Jean 3:16',
            texte: 'Car Dieu a tant aimé le monde qu\'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu\'il ait la vie éternelle.'
          },
          {
            reference: 'Romains 3:23',
            texte: 'Car tous ont péché et sont privés de la gloire de Dieu.'
          },
          {
            reference: 'Romains 6:23',
            texte: 'Car le salaire du péché, c\'est la mort; mais le don gratuit de Dieu, c\'est la vie éternelle en Jésus Christ notre Seigneur.'
          },
          {
            reference: 'Romains 5:8',
            texte: 'Mais Dieu prouve son amour envers nous, en ce que, lorsque nous étions encore des pécheurs, Christ est mort pour nous.'
          },
          {
            reference: 'Jean 1:12',
            texte: 'Mais à tous ceux qui l\'ont reçue, à ceux qui croient en son nom, elle a donné le pouvoir de devenir enfants de Dieu.'
          },
          {
            reference: 'Actes 16:31',
            texte: 'Crois au Seigneur Jésus, et tu seras sauvé, toi et ta famille.'
          }
        ],
        tags: ['Versets', 'Évangélisation', 'Bible'],
        publicCible: 'Tous',
        createur: admin._id,
        statut: 'Publié'
      }
    ];

    await Ressource.insertMany(ressources);
    console.log(`${ressources.length} ressources créées`);

    // Créer un parcours de formation
    console.log('Création d\'un parcours de formation...');

    const parcours = await Parcours.create({
      titre: 'Fondations de la Foi',
      description: 'Parcours de base pour les nouveaux convertis - 7 jours',
      niveau: 'Fondation',
      dureeEstimee: 7,
      objectifs: [
        'Comprendre qui est Jésus-Christ',
        'Apprendre à prier',
        'Découvrir comment lire la Bible',
        'Comprendre l\'importance du baptême',
        'S\'intégrer dans une église locale'
      ],
      lecons: [
        {
          numero: 1,
          titre: 'Bienvenue dans la famille de Dieu',
          description: 'Comprendre votre nouvelle identité en Christ',
          contenu: 'Félicitations ! Vous venez de prendre la décision la plus importante de votre vie. Vous êtes maintenant un enfant de Dieu. Cette leçon vous aidera à comprendre ce que cela signifie.',
          typeContenu: 'Texte',
          versetsBibliques: [
            {
              reference: 'Jean 1:12',
              texte: 'Mais à tous ceux qui l\'ont reçue, à ceux qui croient en son nom, elle a donné le pouvoir de devenir enfants de Dieu.'
            }
          ],
          questionsReflexion: [
            { question: 'Qu\'est-ce qui a changé dans ma vie depuis que j\'ai accepté Jésus ?' },
            { question: 'Comment puis-je partager cette bonne nouvelle avec ma famille ?' }
          ],
          duree: 15
        },
        {
          numero: 2,
          titre: 'La prière : parler avec Dieu',
          description: 'Apprendre les bases de la prière',
          contenu: 'La prière est simplement une conversation avec Dieu. Vous pouvez lui parler à tout moment, en tout lieu, de tout ce qui vous préoccupe.',
          typeContenu: 'Texte',
          versetsBibliques: [
            {
              reference: 'Matthieu 6:9',
              texte: 'Voici donc comment vous devez prier: Notre Père qui es aux cieux! Que ton nom soit sanctifié.'
            }
          ],
          questionsReflexion: [
            { question: 'Pour quoi vais-je prier aujourd\'hui ?' },
            { question: 'Quels sont mes besoins de prière actuels ?' }
          ],
          duree: 15
        },
        {
          numero: 3,
          titre: 'La Bible : la Parole de Dieu',
          description: 'Découvrir comment lire et comprendre la Bible',
          contenu: 'La Bible est la Parole de Dieu pour vous. C\'est votre manuel de vie, votre guide spirituel. Apprenez à la lire chaque jour.',
          typeContenu: 'Texte',
          versetsBibliques: [
            {
              reference: '2 Timothée 3:16',
              texte: 'Toute Écriture est inspirée de Dieu, et utile pour enseigner, pour convaincre, pour corriger, pour instruire dans la justice.'
            }
          ],
          questionsReflexion: [
            { question: 'Quel passage biblique ai-je lu aujourd\'hui ?' },
            { question: 'Qu\'ai-je appris de nouveau sur Dieu ?' }
          ],
          duree: 20
        },
        {
          numero: 4,
          titre: 'Le baptême : témoigner publiquement',
          description: 'Comprendre l\'importance du baptême',
          contenu: 'Le baptême est un acte d\'obéissance qui démontre publiquement votre foi en Jésus-Christ.',
          typeContenu: 'Texte',
          versetsBibliques: [
            {
              reference: 'Matthieu 28:19',
              texte: 'Allez, faites de toutes les nations des disciples, les baptisant au nom du Père, du Fils et du Saint-Esprit.'
            }
          ],
          questionsReflexion: [
            { question: 'Suis-je prêt à être baptisé ?' },
            { question: 'Qui vais-je inviter à mon baptême ?' }
          ],
          duree: 15
        },
        {
          numero: 5,
          titre: 'L\'église : ma nouvelle famille',
          description: 'Comprendre l\'importance de la communauté chrétienne',
          contenu: 'L\'église n\'est pas un bâtiment, c\'est une famille. Vous avez besoin de vos frères et sœurs en Christ pour grandir.',
          typeContenu: 'Texte',
          versetsBibliques: [
            {
              reference: 'Hébreux 10:25',
              texte: 'N\'abandonnons pas notre assemblée, comme c\'est la coutume de quelques-uns; mais exhortons-nous réciproquement.'
            }
          ],
          questionsReflexion: [
            { question: 'Comment puis-je servir dans mon église ?' },
            { question: 'Qui est mon mentor spirituel ?' }
          ],
          duree: 15
        }
      ],
      createur: admin._id,
      statut: 'Publié'
    });

    console.log('Parcours de formation créé:', parcours.titre);

    console.log('\n✅ Base de données peuplée avec succès !');
    console.log('\n📝 Informations de connexion des administrateurs :');
    console.log('='.repeat(60));
    createdAdmins.forEach((admin, index) => {
      console.log(`${index + 1}. ${admin.prenom} ${admin.nom}`);
      console.log(`   Téléphone: ${admin.telephone}`);
      console.log(`   Mot de passe: admin2025`);
      console.log('-'.repeat(60));
    });
    console.log('\n');

    process.exit(0);
  } catch (error) {
    console.error('Erreur:', error);
    process.exit(1);
  }
};

seedDatabase();

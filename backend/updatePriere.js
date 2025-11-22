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

const nouveauContenu = `La prière est une conversation avec Dieu. Voici comment prier efficacement :

1. TROUVEZ UN LIEU TRANQUILLE
"Quand tu pries, entre dans ta chambre, ferme ta porte, et prie ton Père qui est là dans le lieu secret." (Matthieu 6:6)

2. COMMENCEZ PAR LA LOUANGE ET L'ADORATION
"Notre Père qui es aux cieux, que ton nom soit sanctifié." (Matthieu 6:9)
Glorifiez Dieu pour qui Il est : Sa grandeur, Sa sainteté, Son amour infini.

3. REMERCIEZ DIEU
"Rendez grâces en toutes choses, car c'est à votre égard la volonté de Dieu en Jésus Christ." (1 Thessaloniciens 5:18)

4. CONFESSEZ VOS PÉCHÉS
"Si nous confessons nos péchés, il est fidèle et juste pour nous les pardonner, et pour nous purifier de toute iniquité." (1 Jean 1:9)

5. INVOQUEZ LE SANG DE JÉSUS
"Le sang de Jésus son Fils nous purifie de tout péché." (1 Jean 1:7)
Par le sang de Jésus, nous avons accès au trône de la grâce avec assurance.
"Ayant donc, frères, une pleine liberté pour entrer dans le sanctuaire par le sang de Jésus." (Hébreux 10:19)

6. INVOQUEZ LA PRÉSENCE DU SAINT-ESPRIT
"De même aussi l'Esprit nous aide dans notre faiblesse, car nous ne savons pas ce qu'il nous convient de demander dans nos prières. Mais l'Esprit lui-même intercède par des soupirs inexprimables." (Romains 8:26)
Le Saint-Esprit nous guide dans la prière et intercède pour nous.

7. PRÉSENTEZ VOS REQUÊTES
"Ne vous inquiétez de rien; mais en toute chose faites connaître vos besoins à Dieu par des prières et des supplications, avec des actions de grâces." (Philippiens 4:6)

8. PRIEZ POUR LES AUTRES
"Priez les uns pour les autres, afin que vous soyez guéris. La prière fervente du juste a une grande efficace." (Jacques 5:16)

9. TERMINEZ PAR LA FOI EN REMERCIANT LE SEIGNEUR POUR L'EXAUCEMENT DE VOTRE PRIÈRE
"C'est pourquoi je vous dis: Tout ce que vous demanderez en priant, croyez que vous l'avez reçu, et vous le verrez s'accomplir." (Marc 11:24)
Terminez votre prière avec la certitude que Dieu vous a entendu et qu'Il répondra selon Sa volonté parfaite. Remerciez-Le d'avance pour l'exaucement !`;

async function updatePriere() {
  try {
    console.log('🔄 Connexion à MongoDB Atlas...');
    await mongoose.connect(ATLAS_URI);
    console.log('✅ Connecté!\n');

    const result = await Ressource.updateOne(
      { titre: 'Comment prier efficacement' },
      {
        $set: {
          contenu: nouveauContenu,
          description: 'Guide complet en 9 étapes pour développer une vie de prière efficace et puissante',
          versetsBibliques: [
            { reference: 'Matthieu 6:6', texte: 'Quand tu pries, entre dans ta chambre, ferme ta porte, et prie ton Père qui est là dans le lieu secret.', version: 'Louis Segond' },
            { reference: 'Matthieu 6:9', texte: 'Notre Père qui es aux cieux, que ton nom soit sanctifié.', version: 'Louis Segond' },
            { reference: '1 Jean 1:7', texte: 'Le sang de Jésus son Fils nous purifie de tout péché.', version: 'Louis Segond' },
            { reference: 'Hébreux 10:19', texte: 'Ayant donc, frères, une pleine liberté pour entrer dans le sanctuaire par le sang de Jésus.', version: 'Louis Segond' },
            { reference: 'Romains 8:26', texte: 'L\'Esprit nous aide dans notre faiblesse et intercède par des soupirs inexprimables.', version: 'Louis Segond' },
            { reference: 'Marc 11:24', texte: 'Tout ce que vous demanderez en priant, croyez que vous l\'avez reçu, et vous le verrez s\'accomplir.', version: 'Louis Segond' }
          ]
        }
      }
    );

    if (result.modifiedCount > 0) {
      console.log('✅ Ressource "Comment prier efficacement" mise à jour!\n');
      console.log('📋 Les 9 étapes de la prière:');
      console.log('   1. TROUVEZ UN LIEU TRANQUILLE');
      console.log('   2. COMMENCEZ PAR LA LOUANGE ET L\'ADORATION');
      console.log('   3. REMERCIEZ DIEU');
      console.log('   4. CONFESSEZ VOS PÉCHÉS');
      console.log('   5. INVOQUEZ LE SANG DE JÉSUS');
      console.log('   6. INVOQUEZ LA PRÉSENCE DU SAINT-ESPRIT');
      console.log('   7. PRÉSENTEZ VOS REQUÊTES');
      console.log('   8. PRIEZ POUR LES AUTRES');
      console.log('   9. TERMINEZ PAR LA FOI EN REMERCIANT POUR L\'EXAUCEMENT');
    } else {
      console.log('⚠️ Ressource non trouvée ou non modifiée');
    }

    console.log('\n═══════════════════════════════════════');
    console.log('   Guide de prière mis à jour!');
    console.log('═══════════════════════════════════════');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

updatePriere();

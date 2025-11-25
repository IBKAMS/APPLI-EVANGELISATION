const mongoose = require('mongoose');

const ATLAS_URI = 'mongodb+srv://aidriss01_db_user:Cdv5RAnJmGiry2JG@cluster0.bkwuof5.mongodb.net/rehoboth_evangelisation?retryWrites=true&w=majority';

async function updateCallCenterRoles() {
  try {
    console.log('🔄 Connexion à MongoDB Atlas...');
    await mongoose.connect(ATLAS_URI);
    console.log('✅ Connecté!\n');

    const User = require('./models/User');

    // Les 4 utilisateurs à mettre à jour
    const telephones = [
      '0706144383', // LÉA CLAHON
      '0768127233', // ORNELLA KOFFI
      '0153738145', // OCTAVIE SIAGBÉ
      '0586408505'  // LEILA DIAKITÉ
    ];

    console.log('🔍 Mise à jour des rôles des agents Call Center...\n');

    for (const telephone of telephones) {
      const user = await User.findOne({ telephone });

      if (user) {
        const oldRole = user.role;
        user.role = 'agent_call_center';
        await user.save();
        console.log(`✅ ${user.prenom} ${user.nom} (${telephone}): ${oldRole} → agent_call_center`);
      } else {
        console.log(`❌ Utilisateur non trouvé: ${telephone}`);
      }
    }

    console.log('\n═══════════════════════════════════════');
    console.log('✅ Mise à jour terminée');
    console.log('═══════════════════════════════════════');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

updateCallCenterRoles();

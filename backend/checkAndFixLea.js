const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ATLAS_URI = 'mongodb+srv://aidriss01_db_user:Cdv5RAnJmGiry2JG@cluster0.bkwuof5.mongodb.net/rehoboth_evangelisation?retryWrites=true&w=majority';

const userSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  email: String,
  telephone: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['admin', 'evangeliste', 'responsable', 'call_center'], default: 'evangeliste' },
  actif: { type: Boolean, default: true },
  statut: { type: String, default: 'actif' }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function checkAndFixLea() {
  try {
    console.log('🔄 Connexion à MongoDB Atlas...');
    await mongoose.connect(ATLAS_URI);
    console.log('✅ Connecté!\n');

    // Chercher LÉA CAHON
    const leaUser = await User.findOne({ telephone: '0706144383' });

    if (leaUser) {
      console.log('📋 Utilisateur trouvé:');
      console.log(`   Nom: ${leaUser.nom}`);
      console.log(`   Prénom: ${leaUser.prenom}`);
      console.log(`   Téléphone: ${leaUser.telephone}`);
      console.log(`   Rôle: ${leaUser.role}`);
      console.log(`   Actif: ${leaUser.actif}`);
      console.log(`   Statut: ${leaUser.statut}`);

      // Mettre à jour le mot de passe
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('123456', salt);

      await User.updateOne(
        { telephone: '0706144383' },
        {
          $set: {
            password: hashedPassword,
            actif: true,
            statut: 'actif',
            nom: 'CAHON',
            prenom: 'LÉA'
          }
        }
      );

      console.log('\n✅ Mot de passe mis à jour: 123456');
    } else {
      console.log('❌ Utilisateur non trouvé, création...');

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('123456', salt);

      await User.create({
        nom: 'CAHON',
        prenom: 'LÉA',
        telephone: '0706144383',
        password: hashedPassword,
        role: 'call_center',
        actif: true,
        statut: 'actif'
      });

      console.log('✅ Utilisateur LÉA CAHON créé avec succès!');
    }

    console.log('\n═══════════════════════════════════════');
    console.log('   LÉA CAHON - 0706144383');
    console.log('   Mot de passe: 123456');
    console.log('   Rôle: call_center');
    console.log('═══════════════════════════════════════');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

checkAndFixLea();

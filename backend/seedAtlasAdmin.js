const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// IMPORTANT: Remplacez VOTRE_MOT_DE_PASSE_ATLAS par votre vrai mot de passe MongoDB Atlas
const ATLAS_URI = 'mongodb+srv://aidriss01_db_user:VOTRE_MOT_DE_PASSE_ATLAS@cluster0.bkwuof5.mongodb.net/rehoboth_evangelisation?retryWrites=true&w=majority';

// Schéma User simplifié
const userSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  email: String,
  telephone: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['admin', 'evangeliste', 'responsable'], default: 'evangeliste' },
  actif: { type: Boolean, default: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function seedAdmin() {
  try {
    console.log('🔄 Connexion à MongoDB Atlas...');
    await mongoose.connect(ATLAS_URI);
    console.log('✅ Connecté à MongoDB Atlas!\n');

    // Vérifier si l'admin existe déjà
    const existingAdmin = await User.findOne({ telephone: '0708676604' });

    if (existingAdmin) {
      console.log('⚠️  L\'admin KAMISSOKO IDRISS existe déjà!');
      console.log('   Mise à jour du mot de passe...');

      const salt = await bcrypt.genSalt(10);
      existingAdmin.password = await bcrypt.hash('admin2025', salt);
      existingAdmin.role = 'admin';
      await existingAdmin.save();

      console.log('✅ Mot de passe mis à jour!');
    } else {
      // Créer l'admin
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin2025', salt);

      const admin = await User.create({
        nom: 'KAMISSOKO',
        prenom: 'IDRISS',
        email: 'kamissoko.idriss@rehoboth.ci',
        telephone: '0708676604',
        password: hashedPassword,
        role: 'admin',
        actif: true
      });

      console.log('✅ Admin créé avec succès!');
      console.log('');
      console.log('╔════════════════════════════════════════════╗');
      console.log('║  IDENTIFIANTS ADMIN                        ║');
      console.log('╠════════════════════════════════════════════╣');
      console.log('║  Téléphone: 0708676604                     ║');
      console.log('║  Mot de passe: admin2025                   ║');
      console.log('╚════════════════════════════════════════════╝');
    }

    // Afficher tous les utilisateurs
    const users = await User.find({}).select('nom prenom telephone role');
    console.log('\n📋 Utilisateurs dans la base Atlas:');
    users.forEach((u, i) => {
      console.log(`   ${i + 1}. ${u.prenom} ${u.nom} - ${u.telephone} (${u.role})`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Terminé!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

seedAdmin();

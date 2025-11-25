const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ATLAS_URI = 'mongodb+srv://aidriss01_db_user:Cdv5RAnJmGiry2JG@cluster0.bkwuof5.mongodb.net/rehoboth_evangelisation?retryWrites=true&w=majority';

// Schéma User
const userSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  email: String,
  telephone: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['admin', 'evangeliste', 'responsable', 'call_center'], default: 'evangeliste' },
  actif: { type: Boolean, default: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// Liste des administrateurs
const admins = [
  { prenom: 'VALENTIN', nom: 'AGNIMEL', telephone: '0708226161' },
  { prenom: 'YANNICK', nom: 'AGOUA', telephone: '0564883216' },
  { prenom: 'APÔTRE', nom: 'DAGAUD', telephone: '0586898848' },
  { prenom: 'IDRISS', nom: 'KAMISSOKO', telephone: '0708676604' },
  { prenom: 'HERMANN', nom: 'KOUANDÉ', telephone: '0747313492' },
  { prenom: 'ARNAUD', nom: "N'GUESSAN", telephone: '0707964939' },
  { prenom: 'FLORENCE', nom: "N'GUESSAN", telephone: '0778092269' },
  { prenom: 'PASTEUR', nom: 'SAMPAH', telephone: '0708993543' }
];

// Liste des évangélistes (groupe 1)
const evangelistes1 = [
  { prenom: 'SABINE', nom: 'AGNIMEL', telephone: '0779228559' },
  { prenom: 'YANNICK', nom: 'AGOUA', telephone: '0564883216' },
  { prenom: 'XAVIER', nom: 'AKA', telephone: '0749141404' },
  { prenom: 'HERMANCE', nom: 'AKA', telephone: '0748143005' },
  { prenom: 'ROSE', nom: 'BOTTI', telephone: '0708814110' },
  { prenom: 'CHRIST-SAMUEL', nom: '', telephone: '0789146674' },
  { prenom: 'LÉA', nom: 'CLAHON', telephone: '0706144383' },
  { prenom: 'SANDRA', nom: 'DJOBO', telephone: '0143780376' },
  { prenom: 'SHEKINAËL', nom: 'DJOBO', telephone: '0757720458' },
  { prenom: 'DORCAS', nom: '', telephone: '0758296238' },
  { prenom: 'MARIE MARTHE', nom: 'EGNANKOU', telephone: '0505798904' },
  { prenom: 'JEAN-MICHEL', nom: '', telephone: '0747030799' },
  { prenom: 'EMMANUELLA', nom: 'KOLY', telephone: '0709460705' },
  { prenom: 'HERMANN', nom: 'KOUANDÉ', telephone: '0747313492' },
  { prenom: 'LETICIA', nom: '', telephone: '0556296453' },
  { prenom: 'HERMESS', nom: 'MEL', telephone: '0748088633' },
  { prenom: 'SOSTHÈNE', nom: '', telephone: '0595290146' },
  { prenom: 'VALERIE', nom: 'TETYALY', telephone: '0102084288' },
  { prenom: 'TIFFANY', nom: '', telephone: '0704731312' },
  { prenom: 'ANGÈLE', nom: 'YODÉ', telephone: '0759328804' },
  { prenom: 'MARIE-CLAIRE', nom: 'ZOUZOUA', telephone: '0709525074' }
];

// Liste des évangélistes (groupe 2)
const evangelistes2 = [
  { prenom: 'AUDREY', nom: 'ZOÉ', telephone: '0565285144' },
  { prenom: 'DIDER', nom: 'KACOU', telephone: '0708186646' },
  { prenom: 'MATTHIEU', nom: 'BOLOU', telephone: '0767136619' },
  { prenom: 'JILDAS', nom: 'KOUAMÉ', telephone: '0554301270' },
  { prenom: 'LEATICIA', nom: 'BAMBA', telephone: '0152631212' },
  { prenom: 'MAMAN', nom: 'AUKA', telephone: '0101738870' },
  { prenom: 'NELLY', nom: 'TANOH', telephone: '0708587211' },
  { prenom: 'VICTORINE', nom: 'ATTIAH', telephone: '0707805989' },
  { prenom: 'JOSIANE', nom: 'KOELI YOUAN', telephone: '0707340790' },
  { prenom: 'FLEUR', nom: 'BOLOU', telephone: '0709208320' },
  { prenom: 'MAMAN', nom: 'TANOH', telephone: '0707240406' },
  { prenom: 'MARIE-JOSÉ', nom: 'BOCOUM', telephone: '0779707157' },
  { prenom: 'BAROAN', nom: 'KOFFI', telephone: '0759261961' },
  { prenom: 'ANICET', nom: 'IRIÉ', telephone: '0707948363' },
  { prenom: 'CHRISTELLINE', nom: "N'GONKOUA", telephone: '0789844322' },
  { prenom: 'TABITA', nom: 'DINZIO', telephone: '0504305401' },
  { prenom: 'PRISCILLA', nom: 'FANOUD', telephone: '0172243557' },
  { prenom: 'WILFRID', nom: 'KOLY', telephone: '0556461616' },
  { prenom: 'LETICIA', nom: 'GOUANI', telephone: '0501947731' },
  { prenom: 'JULIE', nom: 'KACOU', telephone: '0101553933' },
  { prenom: 'CAMUS', nom: 'KOFFI', telephone: '0749708424' },
  { prenom: 'LANDRY-CHRISTIAN', nom: 'DJOBO', telephone: '0103232428' },
  { prenom: 'RACHELLE', nom: 'KOUASSI', telephone: '0748948903' },
  { prenom: 'SERGE', nom: 'DINZIO', telephone: '0711359938' },
  { prenom: 'PAUL', nom: 'YOUAN', telephone: '0707017806' },
  { prenom: 'LETICIA', nom: 'KOUAMÉ', telephone: '0544056810' },
  { prenom: 'SONIA', nom: 'GNAORÉ', telephone: '0171579034' },
  { prenom: 'PACÔME', nom: "M'BAHIA", telephone: '0703180908' }
];

// Agents Call Center
const callCenterAgents = [
  { prenom: 'LEILA', nom: 'DIAKITÉ', telephone: '0586408505' },
  { prenom: 'OCTAVIE', nom: 'SIAGBÉ', telephone: '0153738145' },
  { prenom: 'ORNELLA', nom: 'KOFFI', telephone: '0768127233' }
];

async function seedAll() {
  try {
    console.log('🔄 Connexion à MongoDB Atlas...');
    await mongoose.connect(ATLAS_URI);
    console.log('✅ Connecté à MongoDB Atlas!\n');

    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin2025', salt);
    const userPassword = await bcrypt.hash('evangeliste2025', salt);
    const callCenterPassword = await bcrypt.hash('123456', salt);

    let created = 0;
    let skipped = 0;

    // Créer les admins
    console.log('👑 Création des ADMINISTRATEURS...');
    for (const admin of admins) {
      try {
        const exists = await User.findOne({ telephone: admin.telephone });
        if (exists) {
          exists.role = 'admin';
          exists.password = adminPassword;
          await exists.save();
          console.log(`   ↻ ${admin.prenom} ${admin.nom} - mis à jour en admin`);
          skipped++;
        } else {
          await User.create({
            ...admin,
            password: adminPassword,
            role: 'admin',
            actif: true
          });
          console.log(`   ✓ ${admin.prenom} ${admin.nom} - créé`);
          created++;
        }
      } catch (e) {
        console.log(`   ✗ ${admin.prenom} ${admin.nom} - erreur: ${e.message}`);
      }
    }

    // Créer les évangélistes groupe 1
    console.log('\n📖 Création des ÉVANGÉLISTES (groupe 1)...');
    for (const ev of evangelistes1) {
      try {
        const exists = await User.findOne({ telephone: ev.telephone });
        if (exists) {
          skipped++;
          continue;
        }
        await User.create({
          ...ev,
          password: userPassword,
          role: 'evangeliste',
          actif: true
        });
        console.log(`   ✓ ${ev.prenom} ${ev.nom || ''}`);
        created++;
      } catch (e) {
        if (!e.message.includes('duplicate')) {
          console.log(`   ✗ ${ev.prenom} - erreur`);
        }
      }
    }

    // Créer les évangélistes groupe 2
    console.log('\n📖 Création des ÉVANGÉLISTES (groupe 2)...');
    for (const ev of evangelistes2) {
      try {
        const exists = await User.findOne({ telephone: ev.telephone });
        if (exists) {
          skipped++;
          continue;
        }
        await User.create({
          ...ev,
          password: userPassword,
          role: 'evangeliste',
          actif: true
        });
        console.log(`   ✓ ${ev.prenom} ${ev.nom}`);
        created++;
      } catch (e) {
        if (!e.message.includes('duplicate')) {
          console.log(`   ✗ ${ev.prenom} - erreur`);
        }
      }
    }

    // Créer les agents call center
    console.log('\n📞 Création des AGENTS CALL CENTER...');
    for (const agent of callCenterAgents) {
      try {
        const exists = await User.findOne({ telephone: agent.telephone });
        if (exists) {
          skipped++;
          continue;
        }
        await User.create({
          ...agent,
          password: callCenterPassword,
          role: 'call_center',
          actif: true
        });
        console.log(`   ✓ ${agent.prenom} ${agent.nom}`);
        created++;
      } catch (e) {
        console.log(`   ✗ ${agent.prenom} - erreur`);
      }
    }

    // Résumé
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalEvangelistes = await User.countDocuments({ role: 'evangeliste' });

    console.log('\n' + '═'.repeat(50));
    console.log('📊 RÉSUMÉ');
    console.log('═'.repeat(50));
    console.log(`   Créés: ${created}`);
    console.log(`   Existants/Mis à jour: ${skipped}`);
    console.log(`   Total utilisateurs: ${totalUsers}`);
    console.log(`   - Admins: ${totalAdmins}`);
    console.log(`   - Évangélistes: ${totalEvangelistes}`);
    console.log('═'.repeat(50));
    console.log('\n📋 IDENTIFIANTS:');
    console.log('   Admins: mot de passe = admin2025');
    console.log('   Évangélistes: mot de passe = evangeliste2025');
    console.log('   Call Center: mot de passe = 123456');
    console.log('═'.repeat(50));

    await mongoose.connection.close();
    console.log('\n✅ Base Atlas peuplée avec succès!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

seedAll();

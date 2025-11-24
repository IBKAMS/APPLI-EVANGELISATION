const mongoose = require('mongoose');

const ATLAS_URI = 'mongodb+srv://aidriss01_db_user:Cdv5RAnJmGiry2JG@cluster0.bkwuof5.mongodb.net/rehoboth_evangelisation?retryWrites=true&w=majority';

// Schéma Campagne
const campagneSchema = new mongoose.Schema({
  titre: String,
  type: String,
  description: String,
  dateDebut: Date,
  dateFin: Date,
  lieu: String,
  statut: String,
  publique: Boolean,
  objectifs: Object,
  resultats: Object,
  parcours: String,
  programme: String,
  lieuxRassemblement: Array,
  images: Array,
  videos: Array,
  notes: String
}, { timestamps: true });

const Campagne = mongoose.model('Campagne', campagneSchema);

// Nouveau lieu de rassemblement avec heure mise à jour
const nouveauLieuRassemblement = [{
  nom: 'Église CM REHOBOTH',
  adresse: 'Angré 8e tranche',
  heureRassemblement: '08H30'
}];

async function updateMeraCampagnes() {
  try {
    console.log('🔄 Connexion à MongoDB Atlas...');
    await mongoose.connect(ATLAS_URI);
    console.log('✅ Connecté!\n');

    // MERA 1 : Retirer Programme + Mettre à jour heure à 08H30
    const result1 = await Campagne.updateOne(
      { titre: 'MERA 1' },
      {
        $unset: { programme: '' },
        $set: { lieuxRassemblement: nouveauLieuRassemblement }
      }
    );
    console.log(`📋 MERA 1 - Programme retiré + Heure: 08H30: ${result1.modifiedCount > 0 ? '✅' : '⚠️ Non trouvé'}`);

    // MERA 2 : Retirer Programme + Mettre à jour heure à 08H30
    const result2 = await Campagne.updateOne(
      { titre: 'MERA 2' },
      {
        $unset: { programme: '' },
        $set: { lieuxRassemblement: nouveauLieuRassemblement }
      }
    );
    console.log(`📋 MERA 2 - Programme retiré + Heure: 08H30: ${result2.modifiedCount > 0 ? '✅' : '⚠️ Non trouvé'}`);

    // MERA 3 : Retirer Programme ET Notes + Mettre à jour heure à 08H30
    const result3 = await Campagne.updateOne(
      { titre: 'MERA 3' },
      {
        $unset: { programme: '', notes: '' },
        $set: { lieuxRassemblement: nouveauLieuRassemblement }
      }
    );
    console.log(`📋 MERA 3 - Programme + Notes retirés + Heure: 08H30: ${result3.modifiedCount > 0 ? '✅' : '⚠️ Non trouvé'}`);

    console.log('\n═══════════════════════════════════════');
    console.log('✅ Mise à jour terminée!');
    console.log('   - MERA 1 : Programme retiré, Heure: 08H30');
    console.log('   - MERA 2 : Programme retiré, Heure: 08H30');
    console.log('   - MERA 3 : Programme + Notes retirés, Heure: 08H30');
    console.log('═══════════════════════════════════════');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

updateMeraCampagnes();

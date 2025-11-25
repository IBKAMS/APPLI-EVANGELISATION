const mongoose = require('mongoose');
const XLSX = require('xlsx');

const ATLAS_URI = 'mongodb+srv://aidriss01_db_user:Cdv5RAnJmGiry2JG@cluster0.bkwuof5.mongodb.net/rehoboth_evangelisation?retryWrites=true&w=majority';
const EXCEL_FILE = '/Users/kamissokobabaidriss/Desktop/APPEL MERA 1.xlsx';

// ID de l'évangéliste (admin)
const EVANGELISTE_ID = '67291de3f3a2d1f05ab8f1a8'; // À mettre à jour avec votre ID

async function importAmes() {
  try {
    console.log('🔄 Connexion à MongoDB Atlas...');
    await mongoose.connect(ATLAS_URI);
    console.log('✅ Connecté!\n');

    console.log('📖 Lecture du fichier Excel...');
    const workbook = XLSX.readFile(EXCEL_FILE);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    const Ame = require('./models/Ame');

    // Date fixe pour toutes les âmes
    const dateRencontre = new Date('2025-09-20');

    let inserted = 0;
    let errors = 0;
    const amesData = [];

    // Le fichier a 4 colonnes : INTÉRESSÉ, À RAPPELER, NON JOINT, SANS SUITE
    // Colonnes: 0=INTÉRESSÉ, 1=À RAPPELER, 2=NON JOINT, 3=SANS SUITE

    for (let rowIndex = 1; rowIndex < data.length; rowIndex++) {
      const row = data[rowIndex];

      // Parcourir chaque colonne
      for (let colIndex = 0; colIndex < 4; colIndex++) {
        const cellValue = row[colIndex];
        if (!cellValue || cellValue.toString().trim() === '') continue;

        // Déterminer le statut selon la colonne
        let statut;
        if (colIndex === 0 || colIndex === 1) {
          statut = 'Actif'; // INTÉRESSÉ ou À RAPPELER
        } else {
          statut = 'Inactif'; // NON JOINT ou SANS SUITE
        }

        // Parser le nom et téléphone
        const text = cellValue.toString().trim();

        // Extraire tous les chiffres et trouver le téléphone (10 chiffres avec ou sans espaces)
        const digitsOnly = text.replace(/\s+/g, '').match(/\d+/g);
        if (!digitsOnly) continue;

        // Trouver la séquence de 10 chiffres
        const phoneNumber = digitsOnly.find(d => d.length === 10);
        if (!phoneNumber) continue;

        const telephone = phoneNumber;

        // Extraire le nom (tout ce qui n'est pas un chiffre ou espace multiple)
        const fullName = text.replace(/[\d\s]+/g, ' ').trim();

        if (!fullName || !telephone) continue;

        // Séparer le nom en prénom et nom de famille
        const nameParts = fullName.split(' ').filter(part => part.length > 0);
        let prenom = '';
        let nom = '';

        if (nameParts.length === 1) {
          // Un seul mot : mettre dans nom
          nom = nameParts[0];
        } else if (nameParts.length >= 2) {
          // Plusieurs mots : premier = prénom, reste = nom
          prenom = nameParts[0];
          nom = nameParts.slice(1).join(' ');
        }

        const ameData = {
          nom: nom,
          prenom: prenom,
          telephone: telephone,
          commune: 'Cocody',
          ville: 'Angré 8e tranche',
          typeRencontre: 'Porte-à-porte',
          lieuRencontre: 'Angré 8e tranche',
          dateRencontre: dateRencontre,
          statutSpirituel: 'Non-converti',
          statut: statut,
          evangeliste: EVANGELISTE_ID,
          createdAt: dateRencontre,
          updatedAt: dateRencontre
        };

        amesData.push(ameData);
      }
    }

    console.log(`📊 ${amesData.length} âmes à insérer\n`);

    // Insérer toutes les âmes
    for (const ameData of amesData) {
      try {
        await Ame.create(ameData);
        inserted++;
        console.log(`✅ ${inserted}. ${ameData.nom} (${ameData.telephone}) - ${ameData.statut}`);
      } catch (error) {
        errors++;
        console.error(`❌ Erreur: ${ameData.nom} - ${error.message}`);
      }
    }

    console.log('\n═══════════════════════════════════════');
    console.log(`✅ ${inserted} âmes insérées avec succès`);
    console.log(`❌ ${errors} erreurs`);
    console.log('═══════════════════════════════════════');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

importAmes();

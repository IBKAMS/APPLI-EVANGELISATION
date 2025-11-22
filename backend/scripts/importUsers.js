const XLSX = require('xlsx');
const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const EXCEL_FILE = '/Users/kamissokobabaidriss/Desktop/APPLI EVANGELISATION/LISTE DES UTILISATEUR ET ADMINSITRATEUR.xlsx';

async function importUsers() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB\n');

    // Lire le fichier Excel
    console.log('📖 Lecture du fichier Excel...');
    const workbook = XLSX.readFile(EXCEL_FILE);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    console.log(`📊 ${data.length} lignes trouvées dans le fichier Excel\n`);

    let created = 0;
    let skipped = 0;
    let errors = 0;

    // Parcourir chaque ligne
    for (let i = 0; i < data.length; i++) {
      const row = data[i];

      // Extraire les données selon les colonnes du fichier Excel
      const nom = String(row['NOM'] || '').trim();
      const prenom = String(row['PRÉNOM'] || '').trim();
      const telephone = String(row['NUMÉRO'] || '').trim();
      const statut = String(row["OBSERVATION TYPE D'ACCÈS"] || '').toUpperCase();

      // Validation des données - accepter si au moins prénom OU nom + téléphone
      if (!telephone || (!nom && !prenom)) {
        console.log(`⚠️  Ligne ${i + 1}: Données manquantes (téléphone ou nom/prénom) - ignorée`);
        skipped++;
        continue;
      }

      // Si seul le prénom est présent, l'utiliser comme nom également
      const finalNom = nom || prenom;
      const finalPrenom = prenom || nom;

      // Nettoyer le numéro de téléphone
      const cleanTelephone = telephone.replace(/\s+/g, '').replace(/^0+/, '0');

      // Déterminer le rôle et le mot de passe selon le statut
      let role = 'evangeliste';
      let password = '123456';

      if (statut.includes('ADMIN') || statut === 'ADMINISTRATEUR') {
        role = 'admin';
        password = 'admin2025';
      } else if (statut.includes('PASTEUR')) {
        role = 'pasteur';
        password = 'admin2025';
      } else if (statut.includes('AGENT') || statut.includes('CALL CENTER')) {
        role = 'agent_call_center';
        password = '123456';
      }

      try {
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ telephone: cleanTelephone });

        if (existingUser) {
          console.log(`⏭️  ${finalNom} ${finalPrenom} (${cleanTelephone}) - Existe déjà`);
          skipped++;
          continue;
        }

        // Créer l'utilisateur
        const newUser = await User.create({
          nom: finalNom.toUpperCase(),
          prenom: finalPrenom.toUpperCase(),
          telephone: cleanTelephone,
          password: password,
          role: role,
          statut: 'actif'
        });

        console.log(`✅ ${finalNom} ${finalPrenom} (${cleanTelephone}) - ${role} - Créé`);
        created++;

      } catch (error) {
        console.log(`❌ Erreur pour ${finalNom} ${finalPrenom}: ${error.message}`);
        errors++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 RÉSUMÉ DE L\'IMPORTATION');
    console.log('='.repeat(60));
    console.log(`✅ Utilisateurs créés: ${created}`);
    console.log(`⏭️  Utilisateurs ignorés (déjà existants): ${skipped}`);
    console.log(`❌ Erreurs: ${errors}`);
    console.log(`📝 Total de lignes traitées: ${data.length}`);
    console.log('='.repeat(60));

    console.log('\n🔐 MOTS DE PASSE PAR DÉFAUT:');
    console.log('   - Administrateurs/Pasteurs: admin2025');
    console.log('   - Évangélistes/Agents: 123456');

  } catch (error) {
    console.error('❌ Erreur lors de l\'importation:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Connexion MongoDB fermée');
  }
}

// Exécuter l'importation
importUsers();

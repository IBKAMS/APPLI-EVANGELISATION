const axios = require('axios');

async function testLogin() {
  try {
    console.log('=== TEST DE L\'API DE CONNEXION ===\n');
    console.log('URL: http://localhost:5001/api/auth/login');
    console.log('Données envoyées:');
    console.log('  - telephone: 0586898848');
    console.log('  - password: admin2025\n');

    const response = await axios.post('http://localhost:5001/api/auth/login', {
      telephone: '0586898848',
      password: 'admin2025'
    });

    console.log('✅ CONNEXION RÉUSSIE!\n');
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));

    if (response.data.user) {
      console.log('\n📋 Données utilisateur:');
      console.log('  - Nom:', response.data.user.nom);
      console.log('  - Prénom:', response.data.user.prenom);
      console.log('  - Téléphone:', response.data.user.telephone);
      console.log('  - Rôle:', response.data.user.role);
      console.log('  - Token reçu:', response.data.token ? 'OUI' : 'NON');
    }
  } catch (error) {
    console.log('❌ ERREUR DE CONNEXION!\n');

    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Message:', error.response.data.message);
      console.log('Données complètes:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.log('❌ Pas de réponse du serveur');
      console.log('Le backend est-il en cours d\'exécution sur http://localhost:5001 ?');
    } else {
      console.log('Erreur:', error.message);
    }
  }
}

testLogin();

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Charger les variables d'environnement
dotenv.config();

// Connexion à la base de données
connectDB();

const app = express();

// Middleware CORS - Autoriser toutes les origines
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: false
}));

// Augmenter la limite pour supporter les images base64
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Servir les fichiers statiques (images) depuis le dossier uploads
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/ames', require('./routes/ames'));
app.use('/api/ressources', require('./routes/ressources'));
app.use('/api/parcours', require('./routes/parcours'));
app.use('/api/appels', require('./routes/appelSuivi'));
app.use('/api/progression', require('./routes/progression'));
app.use('/api/campagnes', require('./routes/campagnes'));

// Route de test
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API REHOBOTH - Évangélisation et Suivi des Âmes',
    version: '1.0.0'
  });
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée'
  });
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Erreur serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
    ╔═══════════════════════════════════════════════════════╗
    ║                                                       ║
    ║   🙏 REHOBOTH - API Évangélisation                   ║
    ║                                                       ║
    ║   Serveur démarré sur le port ${PORT}                   ║
    ║   Environnement: ${process.env.NODE_ENV}                        ║
    ║                                                       ║
    ║   Prêt à servir le Royaume de Dieu ! ✝️              ║
    ║                                                       ║
    ╚═══════════════════════════════════════════════════════╝
  `);
});

module.exports = app;

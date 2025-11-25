const express = require('express');
const router = express.Router();
const {
  getApprenants,
  getReponsesApprenantTheme,
  createOrUpdateCorrection,
  getCorrectionByTheme,
  getMesCorrections
} = require('../controllers/correctionController');
const { protect, authorize } = require('../middleware/auth');

// Toutes les routes nécessitent une authentification
router.use(protect);

// Routes pour les administrateurs et formateurs
router.get('/apprenants', authorize('admin', 'pasteur'), getApprenants);
router.get('/apprenants/:userId/:parcoursId/:themeId', authorize('admin', 'pasteur'), getReponsesApprenantTheme);
router.post('/', authorize('admin', 'pasteur'), createOrUpdateCorrection);

// Routes pour les apprenants
router.get('/mes-corrections', getMesCorrections);
router.get('/:userId/:parcoursId/:themeId', getCorrectionByTheme);

module.exports = router;

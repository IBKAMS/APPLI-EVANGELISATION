const express = require('express');
const router = express.Router();
const {
  getParcoursFormationByNiveau,
  getAllParcoursFormation,
  createOrUpdateParcoursFormation,
  saveReponse,
  getReponsesByUtilisateur,
  getReponsesByTheme
} = require('../controllers/parcoursFormationController');
const { protect, authorize } = require('../middleware/auth');

// Toutes les routes nécessitent une authentification
router.use(protect);

// Routes pour les parcours de formation
router.route('/')
  .get(getAllParcoursFormation)
  .post(authorize('admin', 'pasteur'), createOrUpdateParcoursFormation);

router.get('/:niveau', getParcoursFormationByNiveau);

// Routes pour les réponses des apprenants
router.post('/reponses', saveReponse);
router.get('/reponses/:parcoursId', getReponsesByUtilisateur);
router.get('/reponses/:parcoursId/theme/:themeId', getReponsesByTheme);

module.exports = router;

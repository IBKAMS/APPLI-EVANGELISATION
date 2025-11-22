const express = require('express');
const router = express.Router();
const {
  getCampagnes,
  getCampagne,
  createCampagne,
  updateCampagne,
  deleteCampagne,
  ajouterParticipants,
  updateResultats
} = require('../controllers/campagneController');
const { protect, authorize } = require('../middleware/auth');

// Toutes les routes nécessitent une authentification
router.use(protect);

// Routes pour les campagnes
router.route('/')
  .get(getCampagnes)
  .post(authorize('admin', 'pasteur'), createCampagne);

router.route('/:id')
  .get(getCampagne)
  .put(authorize('admin', 'pasteur'), updateCampagne)
  .delete(authorize('admin'), deleteCampagne);

// Routes spécifiques
router.post('/:id/participants', authorize('admin', 'pasteur'), ajouterParticipants);
router.put('/:id/resultats', authorize('admin', 'pasteur'), updateResultats);

module.exports = router;

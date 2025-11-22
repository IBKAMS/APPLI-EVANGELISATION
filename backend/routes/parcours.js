const express = require('express');
const router = express.Router();
const {
  getParcours,
  getParcoursById,
  createParcours,
  inscrireAme,
  updateProgression
} = require('../controllers/parcoursController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getParcours)
  .post(authorize('admin', 'pasteur'), createParcours);

router.get('/:id', getParcoursById);
router.post('/:id/inscrire/:ameId', inscrireAme);
router.put('/:id/progression/:ameId', updateProgression);

module.exports = router;

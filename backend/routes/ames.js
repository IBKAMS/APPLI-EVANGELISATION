const express = require('express');
const router = express.Router();
const {
  createAme,
  getAmes,
  getAme,
  updateAme,
  deleteAme,
  addSuivi,
  addPresence,
  getStats,
  assignAgent
} = require('../controllers/ameController');
const { protect, authorize } = require('../middleware/auth');

// Toutes les routes nécessitent une authentification
router.use(protect);

router.route('/')
  .get(getAmes)
  .post(createAme);

router.get('/stats', authorize('admin', 'pasteur'), getStats);

router.route('/:id')
  .get(getAme)
  .put(updateAme)
  .delete(deleteAme);

router.post('/:id/suivis', addSuivi);
router.post('/:id/presences', addPresence);
router.patch('/:id/assign-agent', assignAgent);

module.exports = router;

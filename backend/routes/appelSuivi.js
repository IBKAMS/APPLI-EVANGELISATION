const express = require('express');
const router = express.Router();
const {
  createAppel,
  getAppels,
  getAppelsByAme,
  getAmesAAppeler,
  updateAppel,
  deleteAppel,
  getStats
} = require('../controllers/appelSuiviController');
const { protect } = require('../middleware/auth');

// Routes protégées
router.use(protect);

router.route('/')
  .get(getAppels)
  .post(createAppel);

router.get('/stats', getStats);
router.get('/ames-a-appeler', getAmesAAppeler);
router.get('/ame/:ameId', getAppelsByAme);

router.route('/:id')
  .put(updateAppel)
  .delete(deleteAppel);

module.exports = router;

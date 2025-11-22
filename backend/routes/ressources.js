const express = require('express');
const router = express.Router();
const {
  getRessources,
  getRessource,
  createRessource,
  partagerRessource
} = require('../controllers/ressourceController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getRessources)
  .post(authorize('admin', 'pasteur'), createRessource);

router.get('/:id', getRessource);
router.post('/:id/partager', partagerRessource);

module.exports = router;

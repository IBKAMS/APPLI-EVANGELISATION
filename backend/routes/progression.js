const express = require('express');
const router = express.Router();
const {
  getProgression,
  getAllProgressions,
  completerTheme,
  completerNiveau,
  completerQuizFinal,
  verifierAccesNiveau,
  reinitialiserProgression
} = require('../controllers/progressionController');
const { protect, authorize } = require('../middleware/auth');

// Toutes les routes nécessitent une authentification
router.use(protect);

// Routes de progression
router.get('/', getProgression);
router.get('/all', authorize('admin', 'pasteur'), getAllProgressions);
router.post('/theme', completerTheme);
router.post('/niveau', completerNiveau);
router.post('/quiz-final', completerQuizFinal);
router.get('/niveau/:niveau/accessible', verifierAccesNiveau);

// Route admin pour réinitialiser la progression
router.delete('/:userId', authorize('admin'), reinitialiserProgression);

module.exports = router;

const ProgressionParcours = require('../models/ProgressionParcours');

// @desc    Obtenir la progression de l'utilisateur connecté
// @route   GET /api/progression
// @access  Private
exports.getProgression = async (req, res) => {
  try {
    let progression = await ProgressionParcours.findOne({ utilisateur: req.user.id });

    // Si pas de progression, en créer une nouvelle
    if (!progression) {
      progression = await ProgressionParcours.create({
        utilisateur: req.user.id,
        niveauActuel: 1
      });
    }

    res.status(200).json({
      success: true,
      data: progression
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la progression',
      error: error.message
    });
  }
};

// @desc    Obtenir toutes les progressions (Admin/Pasteur seulement)
// @route   GET /api/progression/all
// @access  Private/Admin/Pasteur
exports.getAllProgressions = async (req, res) => {
  try {
    const progressions = await ProgressionParcours.find()
      .populate('utilisateur', 'nom prenom email telephone')
      .sort('-updatedAt');

    res.status(200).json({
      success: true,
      count: progressions.length,
      data: progressions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des progressions',
      error: error.message
    });
  }
};

// @desc    Enregistrer la complétion d'un quiz de thème
// @route   POST /api/progression/theme
// @access  Private
exports.completerTheme = async (req, res) => {
  try {
    const { niveau, themeId, score } = req.body;

    let progression = await ProgressionParcours.findOne({ utilisateur: req.user.id });

    if (!progression) {
      progression = await ProgressionParcours.create({
        utilisateur: req.user.id,
        niveauActuel: 1
      });
    }

    // Déterminer le champ niveau correspondant
    const niveauField = `niveau${niveau}`;

    // Vérifier si le thème n'est pas déjà complété
    const themeExistant = progression.niveaux[niveauField].themesTermines.find(
      t => t.themeId === themeId
    );

    if (!themeExistant) {
      progression.niveaux[niveauField].themesTermines.push({
        themeId,
        score,
        dateCompletion: new Date()
      });
    } else {
      // Mettre à jour le score si meilleur
      if (score > themeExistant.score) {
        themeExistant.score = score;
        themeExistant.dateCompletion = new Date();
      }
    }

    await progression.save();

    res.status(200).json({
      success: true,
      message: 'Progression du thème enregistrée',
      data: progression
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'enregistrement de la progression',
      error: error.message
    });
  }
};

// @desc    Marquer un niveau comme terminé
// @route   POST /api/progression/niveau
// @access  Private
exports.completerNiveau = async (req, res) => {
  try {
    const { niveau, score } = req.body;

    let progression = await ProgressionParcours.findOne({ utilisateur: req.user.id });

    if (!progression) {
      return res.status(404).json({
        success: false,
        message: 'Progression non trouvée'
      });
    }

    const niveauField = `niveau${niveau}`;

    // Marquer le niveau comme terminé
    progression.niveaux[niveauField].termine = true;
    progression.niveaux[niveauField].score = score;
    progression.niveaux[niveauField].dateCompletion = new Date();

    // Débloquer le niveau suivant
    if (niveau < 4) {
      progression.niveauActuel = niveau + 1;
    } else if (niveau === 4) {
      // Après niveau 4, débloquer le quiz final
      progression.niveauActuel = 5;
    }

    await progression.save();

    res.status(200).json({
      success: true,
      message: `Niveau ${niveau} complété avec succès!`,
      data: progression
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la complétion du niveau',
      error: error.message
    });
  }
};

// @desc    Compléter le quiz final
// @route   POST /api/progression/quiz-final
// @access  Private
exports.completerQuizFinal = async (req, res) => {
  try {
    const { score } = req.body;

    let progression = await ProgressionParcours.findOne({ utilisateur: req.user.id });

    if (!progression) {
      return res.status(404).json({
        success: false,
        message: 'Progression non trouvée'
      });
    }

    // Vérifier que les 4 niveaux sont terminés
    const tousNiveauxTermines =
      progression.niveaux.niveau1.termine &&
      progression.niveaux.niveau2.termine &&
      progression.niveaux.niveau3.termine &&
      progression.niveaux.niveau4.termine;

    if (!tousNiveauxTermines && req.user.role === 'evangeliste') {
      return res.status(403).json({
        success: false,
        message: 'Vous devez terminer tous les niveaux avant de passer le quiz final'
      });
    }

    progression.quizFinal.termine = true;
    progression.quizFinal.score = score;
    progression.quizFinal.dateCompletion = new Date();

    // Si score >= 80%, délivrer le certificat
    if (score >= 80) {
      progression.certificatObtenu = true;
      progression.dateCertificat = new Date();
    }

    await progression.save();

    res.status(200).json({
      success: true,
      message: score >= 80 ? 'Félicitations! Vous avez obtenu votre certificat!' : 'Quiz final terminé',
      data: progression,
      certificat: score >= 80
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la complétion du quiz final',
      error: error.message
    });
  }
};

// @desc    Vérifier si un niveau est accessible
// @route   GET /api/progression/niveau/:niveau/accessible
// @access  Private
exports.verifierAccesNiveau = async (req, res) => {
  try {
    const niveau = parseInt(req.params.niveau);

    // Admin et pasteur ont accès à tout
    if (req.user.role === 'admin' || req.user.role === 'pasteur') {
      return res.status(200).json({
        success: true,
        accessible: true,
        raison: 'Accès complet pour admin/pasteur'
      });
    }

    let progression = await ProgressionParcours.findOne({ utilisateur: req.user.id });

    if (!progression) {
      // Si pas de progression et niveau 1, créer progression et autoriser
      if (niveau === 1) {
        progression = await ProgressionParcours.create({
          utilisateur: req.user.id,
          niveauActuel: 1
        });
        return res.status(200).json({
          success: true,
          accessible: true,
          raison: 'Premier niveau accessible par défaut'
        });
      } else {
        return res.status(200).json({
          success: true,
          accessible: false,
          raison: 'Vous devez d\'abord compléter le niveau précédent'
        });
      }
    }

    // Vérifier si le niveau est accessible
    const accessible = niveau <= progression.niveauActuel;

    res.status(200).json({
      success: true,
      accessible,
      niveauActuel: progression.niveauActuel,
      raison: accessible
        ? 'Niveau accessible'
        : `Vous devez d'abord compléter le niveau ${progression.niveauActuel - 1}`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification d\'accès',
      error: error.message
    });
  }
};

// @desc    Réinitialiser la progression d'un utilisateur (Admin seulement)
// @route   DELETE /api/progression/:userId
// @access  Private/Admin
exports.reinitialiserProgression = async (req, res) => {
  try {
    const progression = await ProgressionParcours.findOneAndDelete({
      utilisateur: req.params.userId
    });

    if (!progression) {
      return res.status(404).json({
        success: false,
        message: 'Progression non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Progression réinitialisée avec succès'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la réinitialisation',
      error: error.message
    });
  }
};

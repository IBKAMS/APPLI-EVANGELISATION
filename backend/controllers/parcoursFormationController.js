const ParcoursFormation = require('../models/ParcoursFormation');
const ReponseApprenant = require('../models/ReponseApprenant');

// @desc    Récupérer le parcours de formation par niveau
// @route   GET /api/parcours-formation/:niveau
// @access  Private
exports.getParcoursFormationByNiveau = async (req, res) => {
  try {
    const { niveau } = req.params;

    const parcours = await ParcoursFormation.findOne({ niveau });

    if (!parcours) {
      return res.status(404).json({
        success: false,
        message: 'Parcours de formation non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: parcours
    });
  } catch (error) {
    console.error('Erreur getParcoursFormationByNiveau:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du parcours',
      error: error.message
    });
  }
};

// @desc    Récupérer tous les parcours de formation
// @route   GET /api/parcours-formation
// @access  Private
exports.getAllParcoursFormation = async (req, res) => {
  try {
    const parcours = await ParcoursFormation.find({ statut: 'actif' }).sort({ niveau: 1 });

    res.status(200).json({
      success: true,
      data: parcours
    });
  } catch (error) {
    console.error('Erreur getAllParcoursFormation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des parcours',
      error: error.message
    });
  }
};

// @desc    Créer ou mettre à jour un parcours de formation
// @route   POST /api/parcours-formation
// @access  Private (Admin/Pasteur)
exports.createOrUpdateParcoursFormation = async (req, res) => {
  try {
    const { niveau, titre, description, themes, statut, version } = req.body;

    // Vérifier si le parcours existe déjà
    let parcours = await ParcoursFormation.findOne({ niveau });

    if (parcours) {
      // Mettre à jour le parcours existant
      parcours.titre = titre || parcours.titre;
      parcours.description = description || parcours.description;
      parcours.themes = themes || parcours.themes;
      parcours.statut = statut || parcours.statut;
      parcours.version = version || parcours.version;

      await parcours.save();

      return res.status(200).json({
        success: true,
        message: 'Parcours mis à jour avec succès',
        data: parcours
      });
    }

    // Créer un nouveau parcours
    parcours = await ParcoursFormation.create({
      niveau,
      titre,
      description,
      themes,
      statut,
      version
    });

    res.status(201).json({
      success: true,
      message: 'Parcours créé avec succès',
      data: parcours
    });
  } catch (error) {
    console.error('Erreur createOrUpdateParcoursFormation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création/mise à jour du parcours',
      error: error.message
    });
  }
};

// @desc    Sauvegarder ou mettre à jour la réponse d'un apprenant
// @route   POST /api/parcours-formation/reponses
// @access  Private
exports.saveReponse = async (req, res) => {
  try {
    const {
      parcoursFormationId,
      niveau,
      themeId,
      themeNumero,
      themeTitre,
      questionId,
      reponse,
      estComplet
    } = req.body;

    const utilisateurId = req.user._id;

    // Vérifier si une réponse existe déjà
    let reponseApprenant = await ReponseApprenant.findOne({
      utilisateur: utilisateurId,
      parcoursFormation: parcoursFormationId,
      questionId
    });

    if (reponseApprenant) {
      // Mettre à jour la réponse existante
      reponseApprenant.reponse = reponse;
      reponseApprenant.estComplet = estComplet || false;
      reponseApprenant.dateReponse = Date.now();
      await reponseApprenant.save();
    } else {
      // Créer une nouvelle réponse
      reponseApprenant = await ReponseApprenant.create({
        utilisateur: utilisateurId,
        parcoursFormation: parcoursFormationId,
        niveau,
        themeId,
        themeNumero,
        themeTitre,
        questionId,
        reponse,
        estComplet: estComplet || false
      });
    }

    res.status(200).json({
      success: true,
      data: reponseApprenant
    });
  } catch (error) {
    console.error('Erreur saveReponse:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la sauvegarde de la réponse',
      error: error.message
    });
  }
};

// @desc    Récupérer toutes les réponses d'un utilisateur pour un parcours
// @route   GET /api/parcours-formation/reponses/:parcoursId
// @access  Private
exports.getReponsesByUtilisateur = async (req, res) => {
  try {
    const { parcoursId } = req.params;
    const utilisateurId = req.user._id;

    const reponses = await ReponseApprenant.find({
      utilisateur: utilisateurId,
      parcoursFormation: parcoursId
    }).sort({ themeNumero: 1, createdAt: 1 });

    res.status(200).json({
      success: true,
      data: reponses
    });
  } catch (error) {
    console.error('Erreur getReponsesByUtilisateur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des réponses',
      error: error.message
    });
  }
};

// @desc    Récupérer les réponses d'un utilisateur pour un thème spécifique
// @route   GET /api/parcours-formation/reponses/:parcoursId/theme/:themeId
// @access  Private
exports.getReponsesByTheme = async (req, res) => {
  try {
    const { parcoursId, themeId } = req.params;
    const utilisateurId = req.user._id;

    const reponses = await ReponseApprenant.find({
      utilisateur: utilisateurId,
      parcoursFormation: parcoursId,
      themeId
    }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      data: reponses
    });
  } catch (error) {
    console.error('Erreur getReponsesByTheme:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des réponses du thème',
      error: error.message
    });
  }
};

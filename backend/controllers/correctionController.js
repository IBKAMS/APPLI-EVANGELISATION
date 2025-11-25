const Correction = require('../models/Correction');
const ReponseApprenant = require('../models/ReponseApprenant');
const User = require('../models/User');
const ParcoursFormation = require('../models/ParcoursFormation');

// @desc    Récupérer la liste des apprenants avec leurs réponses
// @route   GET /api/corrections/apprenants
// @access  Private (Admin/Pasteur)
exports.getApprenants = async (req, res) => {
  try {
    const { niveau, parcoursId } = req.query;

    // Construire le filtre
    const filter = {};
    if (niveau) filter.niveau = niveau;
    if (parcoursId) filter.parcoursFormation = parcoursId;

    // Récupérer toutes les réponses avec les infos des utilisateurs
    const reponses = await ReponseApprenant.find(filter)
      .populate('utilisateur', 'nom prenom email telephone')
      .populate('parcoursFormation', 'titre niveau')
      .sort({ 'utilisateur.nom': 1, themeNumero: 1 });

    // Grouper par utilisateur et parcours
    const apprenants = {};

    reponses.forEach(reponse => {
      if (!reponse.utilisateur) return;

      const userId = reponse.utilisateur._id.toString();
      const key = `${userId}_${reponse.parcoursFormation._id}`;

      if (!apprenants[key]) {
        apprenants[key] = {
          utilisateur: {
            _id: reponse.utilisateur._id,
            nom: reponse.utilisateur.nom,
            prenom: reponse.utilisateur.prenom,
            email: reponse.utilisateur.email,
            telephone: reponse.utilisateur.telephone
          },
          parcoursFormation: {
            _id: reponse.parcoursFormation._id,
            titre: reponse.parcoursFormation.titre,
            niveau: reponse.parcoursFormation.niveau
          },
          themes: {},
          totalQuestions: 0,
          questionsRepondues: 0,
          themesCorrige: 0
        };
      }

      const themeId = reponse.themeId;
      if (!apprenants[key].themes[themeId]) {
        apprenants[key].themes[themeId] = {
          themeId: reponse.themeId,
          themeNumero: reponse.themeNumero,
          themeTitre: reponse.themeTitre,
          questionsRepondues: 0,
          totalQuestions: 0,
          estCorrige: false
        };
      }

      apprenants[key].themes[themeId].totalQuestions++;
      apprenants[key].totalQuestions++;

      if (reponse.reponse && reponse.reponse.trim() !== '') {
        apprenants[key].themes[themeId].questionsRepondues++;
        apprenants[key].questionsRepondues++;
      }

      if (reponse.estCorrige) {
        apprenants[key].themes[themeId].estCorrige = true;
      }
    });

    // Compter les thèmes corrigés et calculer la progression par thème
    Object.keys(apprenants).forEach(key => {
      const apprenant = apprenants[key];
      apprenant.themesCorrige = Object.values(apprenant.themes).filter(t => t.estCorrige).length;

      // Calculer la progression pour chaque thème
      Object.values(apprenant.themes).forEach(theme => {
        theme.progression = theme.totalQuestions > 0
          ? Math.round((theme.questionsRepondues / theme.totalQuestions) * 100)
          : 0;
      });

      apprenant.themes = Object.values(apprenant.themes);
      apprenant.progression = apprenant.totalQuestions > 0
        ? Math.round((apprenant.questionsRepondues / apprenant.totalQuestions) * 100)
        : 0;
    });

    const apprenantsArray = Object.values(apprenants);

    res.status(200).json({
      success: true,
      count: apprenantsArray.length,
      data: apprenantsArray
    });
  } catch (error) {
    console.error('Erreur getApprenants:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des apprenants',
      error: error.message
    });
  }
};

// @desc    Récupérer les détails des réponses d'un apprenant pour un thème
// @route   GET /api/corrections/apprenants/:userId/:parcoursId/:themeId
// @access  Private (Admin/Pasteur)
exports.getReponsesApprenantTheme = async (req, res) => {
  try {
    const { userId, parcoursId, themeId } = req.params;

    // Récupérer les réponses
    const reponses = await ReponseApprenant.find({
      utilisateur: userId,
      parcoursFormation: parcoursId,
      themeId
    })
      .populate('utilisateur', 'nom prenom email')
      .populate('parcoursFormation', 'titre niveau themes')
      .sort({ createdAt: 1 });

    if (!reponses || reponses.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Aucune réponse trouvée'
      });
    }

    // Récupérer la correction si elle existe
    const correction = await Correction.findOne({
      utilisateur: userId,
      parcoursFormation: parcoursId,
      themeId
    }).populate('formateurId', 'nom prenom');

    // Récupérer les détails du thème depuis le parcours
    const parcours = reponses[0].parcoursFormation;
    const theme = parcours.themes.find(t => t.id === themeId);

    res.status(200).json({
      success: true,
      data: {
        utilisateur: reponses[0].utilisateur,
        parcours: {
          _id: parcours._id,
          titre: parcours.titre,
          niveau: parcours.niveau
        },
        theme: theme || null,
        reponses,
        correction: correction || null
      }
    });
  } catch (error) {
    console.error('Erreur getReponsesApprenantTheme:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des réponses',
      error: error.message
    });
  }
};

// @desc    Créer ou mettre à jour une correction
// @route   POST /api/corrections
// @access  Private (Admin/Pasteur)
exports.createOrUpdateCorrection = async (req, res) => {
  try {
    const {
      utilisateurId,
      parcoursFormationId,
      themeId,
      themeNumero,
      themeTitre,
      noteTheme,
      questionsCorrigees,
      commentaireGeneral,
      statut
    } = req.body;

    const formateurId = req.user._id;
    const formateurNom = req.user.nom;
    const formateurPrenom = req.user.prenom;

    // Vérifier si une correction existe déjà
    let correction = await Correction.findOne({
      utilisateur: utilisateurId,
      parcoursFormation: parcoursFormationId,
      themeId
    });

    if (correction) {
      // Mettre à jour la correction existante
      correction.noteTheme = noteTheme;
      correction.questionsCorrigees = questionsCorrigees || correction.questionsCorrigees;
      correction.commentaireGeneral = commentaireGeneral || correction.commentaireGeneral;
      correction.statut = statut || correction.statut;
      correction.formateurId = formateurId;
      correction.formateurNom = formateurNom;
      correction.formateurPrenom = formateurPrenom;
      correction.dateModification = Date.now();

      await correction.save();
    } else {
      // Créer une nouvelle correction
      correction = await Correction.create({
        utilisateur: utilisateurId,
        parcoursFormation: parcoursFormationId,
        themeId,
        themeNumero,
        themeTitre,
        noteTheme,
        questionsCorrigees,
        commentaireGeneral,
        formateurId,
        formateurNom,
        formateurPrenom,
        statut: statut || 'en_cours'
      });
    }

    // Mettre à jour les réponses pour indiquer qu'elles sont corrigées
    await ReponseApprenant.updateMany(
      {
        utilisateur: utilisateurId,
        parcoursFormation: parcoursFormationId,
        themeId
      },
      {
        estCorrige: true,
        correction: correction._id
      }
    );

    res.status(200).json({
      success: true,
      message: 'Correction enregistrée avec succès',
      data: correction
    });
  } catch (error) {
    console.error('Erreur createOrUpdateCorrection:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création/mise à jour de la correction',
      error: error.message
    });
  }
};

// @desc    Récupérer la correction d'un apprenant pour un thème
// @route   GET /api/corrections/:userId/:parcoursId/:themeId
// @access  Private
exports.getCorrectionByTheme = async (req, res) => {
  try {
    const { userId, parcoursId, themeId } = req.params;

    const correction = await Correction.findOne({
      utilisateur: userId,
      parcoursFormation: parcoursId,
      themeId
    })
      .populate('formateurId', 'nom prenom')
      .populate('utilisateur', 'nom prenom email')
      .populate('parcoursFormation', 'titre niveau');

    if (!correction) {
      return res.status(404).json({
        success: false,
        message: 'Correction non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      data: correction
    });
  } catch (error) {
    console.error('Erreur getCorrectionByTheme:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la correction',
      error: error.message
    });
  }
};

// @desc    Récupérer toutes les corrections d'un utilisateur
// @route   GET /api/corrections/mes-corrections
// @access  Private
exports.getMesCorrections = async (req, res) => {
  try {
    const userId = req.user._id;
    const { parcoursId } = req.query;

    const filter = { utilisateur: userId };
    if (parcoursId) filter.parcoursFormation = parcoursId;

    const corrections = await Correction.find(filter)
      .populate('formateurId', 'nom prenom')
      .populate('parcoursFormation', 'titre niveau')
      .sort({ themeNumero: 1 });

    res.status(200).json({
      success: true,
      data: corrections
    });
  } catch (error) {
    console.error('Erreur getMesCorrections:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des corrections',
      error: error.message
    });
  }
};

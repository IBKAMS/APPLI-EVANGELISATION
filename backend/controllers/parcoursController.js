const Parcours = require('../models/Parcours');
const Ame = require('../models/Ame');

// @desc    Obtenir tous les parcours
// @route   GET /api/parcours
// @access  Private
exports.getParcours = async (req, res) => {
  try {
    let query = { statut: 'Publié' };

    if (req.query.niveau) {
      query.niveau = req.query.niveau;
    }

    const parcours = await Parcours.find(query)
      .populate('createur', 'nom prenom')
      .sort('niveau');

    res.status(200).json({
      success: true,
      count: parcours.length,
      data: parcours
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des parcours',
      error: error.message
    });
  }
};

// @desc    Obtenir un parcours
// @route   GET /api/parcours/:id
// @access  Private
exports.getParcoursById = async (req, res) => {
  try {
    const parcours = await Parcours.findById(req.params.id)
      .populate('createur', 'nom prenom')
      .populate('prerequis', 'titre niveau');

    if (!parcours) {
      return res.status(404).json({
        success: false,
        message: 'Parcours non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: parcours
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du parcours',
      error: error.message
    });
  }
};

// @desc    Créer un parcours
// @route   POST /api/parcours
// @access  Private (Admin/Pasteur)
exports.createParcours = async (req, res) => {
  try {
    req.body.createur = req.user.id;
    const parcours = await Parcours.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Parcours créé avec succès',
      data: parcours
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du parcours',
      error: error.message
    });
  }
};

// @desc    Inscrire une âme à un parcours
// @route   POST /api/parcours/:id/inscrire/:ameId
// @access  Private
exports.inscrireAme = async (req, res) => {
  try {
    const parcours = await Parcours.findById(req.params.id);
    const ame = await Ame.findById(req.params.ameId);

    if (!parcours || !ame) {
      return res.status(404).json({
        success: false,
        message: 'Parcours ou âme non trouvé(e)'
      });
    }

    // Vérifier si déjà inscrit
    const dejaInscrit = ame.parcoursFormation.some(
      p => p.parcours.toString() === parcours._id.toString()
    );

    if (dejaInscrit) {
      return res.status(400).json({
        success: false,
        message: 'Déjà inscrit à ce parcours'
      });
    }

    // Ajouter le parcours
    ame.parcoursFormation.push({
      parcours: parcours._id,
      dateDebut: Date.now(),
      statut: 'En cours'
    });

    await ame.save();

    // Mettre à jour les stats
    parcours.statistiques.nombreInscrits += 1;
    await parcours.save();

    res.status(200).json({
      success: true,
      message: 'Inscription réussie',
      data: ame
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'inscription',
      error: error.message
    });
  }
};

// @desc    Mettre à jour la progression
// @route   PUT /api/parcours/:id/progression/:ameId
// @access  Private
exports.updateProgression = async (req, res) => {
  try {
    const { progression } = req.body;
    const ame = await Ame.findById(req.params.ameId);

    if (!ame) {
      return res.status(404).json({
        success: false,
        message: 'Âme non trouvée'
      });
    }

    // Trouver le parcours dans la formation
    const parcoursIndex = ame.parcoursFormation.findIndex(
      p => p.parcours.toString() === req.params.id
    );

    if (parcoursIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Parcours non trouvé pour cette âme'
      });
    }

    // Mettre à jour la progression
    ame.parcoursFormation[parcoursIndex].progression = progression;

    // Si terminé
    if (progression === 100) {
      ame.parcoursFormation[parcoursIndex].statut = 'Terminé';
      ame.parcoursFormation[parcoursIndex].dateFin = Date.now();

      // Mettre à jour les stats du parcours
      const parcours = await Parcours.findById(req.params.id);
      parcours.statistiques.nombreTermines += 1;
      parcours.statistiques.tauxReussite =
        (parcours.statistiques.nombreTermines / parcours.statistiques.nombreInscrits) * 100;
      await parcours.save();
    }

    await ame.save();

    res.status(200).json({
      success: true,
      message: 'Progression mise à jour',
      data: ame
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour',
      error: error.message
    });
  }
};

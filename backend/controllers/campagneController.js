const Campagne = require('../models/Campagne');

// @desc    Obtenir toutes les campagnes
// @route   GET /api/campagnes
// @access  Private
exports.getCampagnes = async (req, res) => {
  try {
    const campagnes = await Campagne.find()
      .populate('responsable', 'nom prenom email')
      .populate('participants', 'nom prenom')
      .sort('-dateDebut');

    res.status(200).json({
      success: true,
      count: campagnes.length,
      data: campagnes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des campagnes',
      error: error.message
    });
  }
};

// @desc    Obtenir une campagne par ID
// @route   GET /api/campagnes/:id
// @access  Private
exports.getCampagne = async (req, res) => {
  try {
    const campagne = await Campagne.findById(req.params.id)
      .populate('responsable', 'nom prenom email telephone')
      .populate('participants', 'nom prenom email telephone');

    if (!campagne) {
      return res.status(404).json({
        success: false,
        message: 'Campagne non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      data: campagne
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la campagne',
      error: error.message
    });
  }
};

// @desc    Créer une nouvelle campagne
// @route   POST /api/campagnes
// @access  Private/Admin/Pasteur
exports.createCampagne = async (req, res) => {
  try {
    // Ajouter l'utilisateur connecté comme responsable par défaut
    if (!req.body.responsable) {
      req.body.responsable = req.user.id;
    }

    const campagne = await Campagne.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Campagne créée avec succès',
      data: campagne
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la création de la campagne',
      error: error.message
    });
  }
};

// @desc    Mettre à jour une campagne
// @route   PUT /api/campagnes/:id
// @access  Private/Admin/Pasteur
exports.updateCampagne = async (req, res) => {
  try {
    let campagne = await Campagne.findById(req.params.id);

    if (!campagne) {
      return res.status(404).json({
        success: false,
        message: 'Campagne non trouvée'
      });
    }

    campagne = await Campagne.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Campagne mise à jour avec succès',
      data: campagne
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la campagne',
      error: error.message
    });
  }
};

// @desc    Supprimer une campagne
// @route   DELETE /api/campagnes/:id
// @access  Private/Admin
exports.deleteCampagne = async (req, res) => {
  try {
    const campagne = await Campagne.findById(req.params.id);

    if (!campagne) {
      return res.status(404).json({
        success: false,
        message: 'Campagne non trouvée'
      });
    }

    await campagne.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Campagne supprimée avec succès'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la campagne',
      error: error.message
    });
  }
};

// @desc    Ajouter des participants à une campagne
// @route   POST /api/campagnes/:id/participants
// @access  Private/Admin/Pasteur
exports.ajouterParticipants = async (req, res) => {
  try {
    const campagne = await Campagne.findById(req.params.id);

    if (!campagne) {
      return res.status(404).json({
        success: false,
        message: 'Campagne non trouvée'
      });
    }

    const { participants } = req.body;

    if (!participants || !Array.isArray(participants)) {
      return res.status(400).json({
        success: false,
        message: 'Liste de participants invalide'
      });
    }

    // Ajouter les nouveaux participants sans dupliquer
    participants.forEach(participantId => {
      if (!campagne.participants.includes(participantId)) {
        campagne.participants.push(participantId);
      }
    });

    await campagne.save();

    res.status(200).json({
      success: true,
      message: 'Participants ajoutés avec succès',
      data: campagne
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'ajout des participants',
      error: error.message
    });
  }
};

// @desc    Mettre à jour les résultats d'une campagne
// @route   PUT /api/campagnes/:id/resultats
// @access  Private/Admin/Pasteur
exports.updateResultats = async (req, res) => {
  try {
    const campagne = await Campagne.findById(req.params.id);

    if (!campagne) {
      return res.status(404).json({
        success: false,
        message: 'Campagne non trouvée'
      });
    }

    const { amesGagnees, tractsDistribues, participantsPresents } = req.body;

    if (amesGagnees !== undefined) campagne.resultats.amesGagnees = amesGagnees;
    if (tractsDistribues !== undefined) campagne.resultats.tractsDistribues = tractsDistribues;
    if (participantsPresents !== undefined) campagne.resultats.participantsPresents = participantsPresents;

    await campagne.save();

    res.status(200).json({
      success: true,
      message: 'Résultats mis à jour avec succès',
      data: campagne
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour des résultats',
      error: error.message
    });
  }
};

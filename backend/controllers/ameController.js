const Ame = require('../models/Ame');
const AppelSuivi = require('../models/AppelSuivi');

// @desc    Enregistrer une nouvelle âme
// @route   POST /api/ames
// @access  Private
exports.createAme = async (req, res) => {
  console.log('🔵 ===== DÉBUT CREATE AME =====');
  console.log('🔵 User:', req.user ? `${req.user.prenom} ${req.user.nom} (ID: ${req.user.id})` : 'NON DÉFINI');
  console.log('🔵 Body reçu:', JSON.stringify(req.body, null, 2));

  try {
    // Nettoyer les champs enum vides (Mongoose n'accepte pas "" pour les enums)
    const enumFields = ['sexe', 'typeRencontre', 'situationMatrimoniale', 'statutSpirituel', 'statut'];
    enumFields.forEach(field => {
      if (req.body[field] === '' || req.body[field] === null) {
        delete req.body[field];
      }
    });

    // Nettoyer les autres champs vides optionnels
    const optionalFields = ['email', 'adresse', 'ville', 'profession', 'lieuRencontre', 'nomInviteur', 'ancienneEglise', 'notes', 'age'];
    optionalFields.forEach(field => {
      if (req.body[field] === '' || req.body[field] === null) {
        delete req.body[field];
      }
    });

    // Ajouter l'ID de l'évangélisateur
    req.body.evangeliste = req.user.id;
    console.log('🔵 Evangeliste ajouté:', req.user.id);
    console.log('🔵 Appel de Ame.create avec:', JSON.stringify(req.body, null, 2));

    const ame = await Ame.create(req.body);
    console.log('✅ Âme créée avec succès:', ame._id);

    res.status(201).json({
      success: true,
      message: 'Âme enregistrée avec succès',
      data: ame
    });
  } catch (error) {
    console.error('❌ ===== ERREUR CREATE AME =====');
    console.error('❌ Message:', error.message);
    console.error('❌ Stack:', error.stack);
    console.error('❌ Erreur complète:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'enregistrement',
      error: error.message
    });
  }
};

// @desc    Obtenir toutes les âmes
// @route   GET /api/ames
// @access  Private
exports.getAmes = async (req, res) => {
  try {
    let query = {};

    // Si l'utilisateur n'est pas admin, voir seulement ses âmes
    if (req.user.role === 'evangeliste') {
      query.evangeliste = req.user.id;
    }

    // Filtres
    if (req.query.statutSpirituel) {
      query.statutSpirituel = req.query.statutSpirituel;
    }
    if (req.query.statut) {
      query.statut = req.query.statut;
    }
    if (req.query.campagne) {
      query.campagne = req.query.campagne;
    }

    // Recherche par texte
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    const ames = await Ame.find(query)
      .populate('evangeliste', 'nom prenom email')
      .populate('campagne', 'nom type')
      .sort('-createdAt');

    // Pour chaque âme, récupérer le dernier appel et le nombre d'appels
    const amesAvecAppels = await Promise.all(
      ames.map(async (ame) => {
        const dernierAppel = await AppelSuivi.findOne({ ame: ame._id })
          .populate('agent', 'nom prenom')
          .sort({ dateAppel: -1 });

        return {
          ...ame.toObject(),
          dernierAppel: dernierAppel || null,
          nombreAppels: await AppelSuivi.countDocuments({ ame: ame._id })
        };
      })
    );

    res.status(200).json({
      success: true,
      count: amesAvecAppels.length,
      data: amesAvecAppels
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des âmes',
      error: error.message
    });
  }
};

// @desc    Obtenir une âme par ID
// @route   GET /api/ames/:id
// @access  Private
exports.getAme = async (req, res) => {
  try {
    const ame = await Ame.findById(req.params.id)
      .populate('evangeliste', 'nom prenom email telephone')
      .populate('campagne', 'nom type dateDebut dateFin')
      .populate('suivis.responsable', 'nom prenom')
      .populate('parcoursFormation.parcours', 'titre niveau');

    if (!ame) {
      return res.status(404).json({
        success: false,
        message: 'Âme non trouvée'
      });
    }

    // Vérifier les permissions
    if (req.user.role === 'evangeliste' && ame.evangeliste._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à accéder à cette ressource'
      });
    }

    res.status(200).json({
      success: true,
      data: ame
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'âme',
      error: error.message
    });
  }
};

// @desc    Mettre à jour une âme
// @route   PUT /api/ames/:id
// @access  Private
exports.updateAme = async (req, res) => {
  try {
    let ame = await Ame.findById(req.params.id);

    if (!ame) {
      return res.status(404).json({
        success: false,
        message: 'Âme non trouvée'
      });
    }

    // Vérifier les permissions
    if (req.user.role === 'evangeliste' && ame.evangeliste.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à modifier cette ressource'
      });
    }

    ame = await Ame.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Âme mise à jour avec succès',
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

// @desc    Ajouter un suivi
// @route   POST /api/ames/:id/suivis
// @access  Private
exports.addSuivi = async (req, res) => {
  try {
    const ame = await Ame.findById(req.params.id);

    if (!ame) {
      return res.status(404).json({
        success: false,
        message: 'Âme non trouvée'
      });
    }

    const suivi = {
      ...req.body,
      responsable: req.user.id
    };

    ame.suivis.push(suivi);

    // Mettre à jour la prochaine date de suivi si fournie
    if (req.body.prochaineSuivi) {
      ame.prochaineSuivi = req.body.prochaineSuivi;
    }

    await ame.save();

    res.status(200).json({
      success: true,
      message: 'Suivi ajouté avec succès',
      data: ame
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'ajout du suivi',
      error: error.message
    });
  }
};

// @desc    Ajouter une présence
// @route   POST /api/ames/:id/presences
// @access  Private
exports.addPresence = async (req, res) => {
  try {
    const ame = await Ame.findById(req.params.id);

    if (!ame) {
      return res.status(404).json({
        success: false,
        message: 'Âme non trouvée'
      });
    }

    ame.presences.push(req.body);
    await ame.save();

    res.status(200).json({
      success: true,
      message: 'Présence enregistrée avec succès',
      data: ame
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'enregistrement de la présence',
      error: error.message
    });
  }
};

// @desc    Obtenir les statistiques
// @route   GET /api/ames/stats
// @access  Private (Admin/Pasteur)
exports.getStats = async (req, res) => {
  try {
    const stats = await Ame.aggregate([
      {
        $group: {
          _id: '$statutSpirituel',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalAmes = await Ame.countDocuments();
    const amesActives = await Ame.countDocuments({ statut: 'Actif' });
    const aRelancer = await Ame.countDocuments({ statut: 'À relancer' });
    const nouveauxConvertis = await Ame.countDocuments({ statutSpirituel: 'Nouveau converti' });

    res.status(200).json({
      success: true,
      data: {
        totalAmes,
        amesActives,
        aRelancer,
        nouveauxConvertis,
        parStatut: stats
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
};

// @desc    Assigner un agent call center à une âme
// @route   PATCH /api/ames/:id/assign-agent
// @access  Private
exports.assignAgent = async (req, res) => {
  try {
    const { agentCallCenter } = req.body;

    const ame = await Ame.findByIdAndUpdate(
      req.params.id,
      { agentCallCenter },
      { new: true, runValidators: true }
    );

    if (!ame) {
      return res.status(404).json({
        success: false,
        message: 'Âme non trouvée'
      });
    }

    res.json({
      success: true,
      message: 'Agent assigné avec succès',
      data: ame
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'assignation de l\'agent',
      error: error.message
    });
  }
};

// @desc    Supprimer une âme
// @route   DELETE /api/ames/:id
// @access  Private (Réservé à KAMISSOKO IDRISS uniquement)
exports.deleteAme = async (req, res) => {
  try {
    // Vérifier que l'utilisateur est KAMISSOKO IDRISS
    if (req.user.telephone !== '0708676604') {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé. Seul KAMISSOKO IDRISS peut supprimer des âmes.'
      });
    }

    const ame = await Ame.findById(req.params.id);

    if (!ame) {
      return res.status(404).json({
        success: false,
        message: 'Âme non trouvée'
      });
    }

    await Ame.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Âme supprimée avec succès'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression',
      error: error.message
    });
  }
};

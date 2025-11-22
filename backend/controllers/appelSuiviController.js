const AppelSuivi = require('../models/AppelSuivi');
const Ame = require('../models/Ame');

// @desc    Créer un nouvel appel de suivi
// @route   POST /api/appels
// @access  Private
exports.createAppel = async (req, res) => {
  try {
    const appel = await AppelSuivi.create({
      ...req.body,
      agent: req.user._id
    });

    const appelPopulated = await AppelSuivi.findById(appel._id)
      .populate('ame', 'nom prenom telephone')
      .populate('agent', 'nom prenom');

    res.status(201).json(appelPopulated);
  } catch (error) {
    console.warn(error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Obtenir tous les appels
// @route   GET /api/appels
// @access  Private
exports.getAppels = async (req, res) => {
  try {
    const { statutAppel, agent, ame, dateDebut, dateFin } = req.query;

    let filter = {};

    if (statutAppel) filter.statutAppel = statutAppel;
    if (agent) filter.agent = agent;
    if (ame) filter.ame = ame;
    if (dateDebut || dateFin) {
      filter.dateAppel = {};
      if (dateDebut) filter.dateAppel.$gte = new Date(dateDebut);
      if (dateFin) filter.dateAppel.$lte = new Date(dateFin);
    }

    const appels = await AppelSuivi.find(filter)
      .populate('ame', 'nom prenom telephone email commune')
      .populate('agent', 'nom prenom')
      .sort({ dateAppel: -1 });

    res.json(appels);
  } catch (error) {
    console.warn(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Obtenir les appels d'une âme spécifique
// @route   GET /api/appels/ame/:ameId
// @access  Private
exports.getAppelsByAme = async (req, res) => {
  try {
    const appels = await AppelSuivi.find({ ame: req.params.ameId })
      .populate('agent', 'nom prenom')
      .sort({ dateAppel: -1 });

    res.json(appels);
  } catch (error) {
    console.warn(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Obtenir les âmes à appeler
// @route   GET /api/appels/ames-a-appeler
// @access  Private
exports.getAmesAAppeler = async (req, res) => {
  try {
    // Récupérer toutes les âmes
    const ames = await Ame.find()
      .populate('evangeliste', 'nom prenom')
      .sort({ dateRencontre: -1 });

    // Pour chaque âme, récupérer le dernier appel
    const amesAvecDernierAppel = await Promise.all(
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

    res.json(amesAvecDernierAppel);
  } catch (error) {
    console.warn(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Mettre à jour un appel
// @route   PUT /api/appels/:id
// @access  Private
exports.updateAppel = async (req, res) => {
  try {
    const appel = await AppelSuivi.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('ame', 'nom prenom telephone')
      .populate('agent', 'nom prenom');

    if (!appel) {
      return res.status(404).json({ message: 'Appel non trouvé' });
    }

    res.json(appel);
  } catch (error) {
    console.warn(error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Supprimer un appel
// @route   DELETE /api/appels/:id
// @access  Private
exports.deleteAppel = async (req, res) => {
  try {
    const appel = await AppelSuivi.findByIdAndDelete(req.params.id);

    if (!appel) {
      return res.status(404).json({ message: 'Appel non trouvé' });
    }

    res.json({ message: 'Appel supprimé' });
  } catch (error) {
    console.warn(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Obtenir les statistiques des appels
// @route   GET /api/appels/stats
// @access  Private
exports.getStats = async (req, res) => {
  try {
    const stats = await AppelSuivi.aggregate([
      {
        $group: {
          _id: '$statutAppel',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalAppels = await AppelSuivi.countDocuments();
    const appelsDuJour = await AppelSuivi.countDocuments({
      dateAppel: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0))
      }
    });

    res.json({
      stats,
      totalAppels,
      appelsDuJour
    });
  } catch (error) {
    console.warn(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

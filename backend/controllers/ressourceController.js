const Ressource = require('../models/Ressource');

// @desc    Obtenir toutes les ressources
// @route   GET /api/ressources
// @access  Private
exports.getRessources = async (req, res) => {
  try {
    let query = { statut: 'Publié' };

    // Filtres
    if (req.query.categorie) {
      query.categorie = req.query.categorie;
    }
    if (req.query.type) {
      query.type = req.query.type;
    }
    if (req.query.publicCible) {
      query.publicCible = req.query.publicCible;
    }

    // Recherche par texte
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    const ressources = await Ressource.find(query)
      .populate('createur', 'nom prenom')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: ressources.length,
      data: ressources
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des ressources',
      error: error.message
    });
  }
};

// @desc    Obtenir une ressource
// @route   GET /api/ressources/:id
// @access  Private
exports.getRessource = async (req, res) => {
  try {
    const ressource = await Ressource.findById(req.params.id);

    if (!ressource) {
      return res.status(404).json({
        success: false,
        message: 'Ressource non trouvée'
      });
    }

    // Incrémenter le nombre de vues
    ressource.partage.nombreVues += 1;
    await ressource.save();

    res.status(200).json({
      success: true,
      data: ressource
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la ressource',
      error: error.message
    });
  }
};

// @desc    Créer une ressource
// @route   POST /api/ressources
// @access  Private (Admin/Pasteur)
exports.createRessource = async (req, res) => {
  try {
    req.body.createur = req.user.id;
    const ressource = await Ressource.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Ressource créée avec succès',
      data: ressource
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la ressource',
      error: error.message
    });
  }
};

// @desc    Partager une ressource
// @route   POST /api/ressources/:id/partager
// @access  Private
exports.partagerRessource = async (req, res) => {
  try {
    const ressource = await Ressource.findById(req.params.id);

    if (!ressource) {
      return res.status(404).json({
        success: false,
        message: 'Ressource non trouvée'
      });
    }

    ressource.partage.nombrePartages += 1;
    await ressource.save();

    res.status(200).json({
      success: true,
      message: 'Ressource partagée',
      data: ressource
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du partage',
      error: error.message
    });
  }
};

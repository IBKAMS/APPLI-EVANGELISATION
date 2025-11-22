import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import {
  CalendarToday,
  LocationOn,
  People,
  Route,
  Close,
  PlayCircleOutline,
  Footprint
} from '@mui/icons-material';
import api from '../services/api';

// URL de base du backend pour les fichiers statiques
const BACKEND_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5001';

const Actualites = () => {
  const [campagnes, setCampagnes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCampagne, setSelectedCampagne] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [mediaDialog, setMediaDialog] = useState({ open: false, type: '', url: '' });

  useEffect(() => {
    fetchCampagnes();
  }, []);

  const fetchCampagnes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/campagnes');
      // Filtrer uniquement les campagnes publiques
      const campagnesPubliques = response.data.data.filter(c => c.publique !== false);
      // Trier par date de début (plus récentes d'abord)
      const campagnesSorted = campagnesPubliques.sort((a, b) =>
        new Date(b.dateDebut) - new Date(a.dateDebut)
      );
      setCampagnes(campagnesSorted);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des campagnes:', err);
      setError('Impossible de charger les actualités. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDateRange = (dateDebut, dateFin) => {
    const debut = new Date(dateDebut).toDateString();
    const fin = new Date(dateFin).toDateString();

    if (debut === fin) {
      // Si les dates sont identiques, afficher une seule date
      return `Le ${formatDate(dateDebut)}`;
    } else {
      // Si les dates sont différentes, afficher la plage
      return `Du ${formatDate(dateDebut)} au ${formatDate(dateFin)}`;
    }
  };

  const isFutureCampagne = (dateDebut) => {
    return new Date(dateDebut) > new Date();
  };

  const getStatutChipColor = (statut) => {
    const colors = {
      'Planifiée': 'info',
      'En cours': 'success',
      'Terminée': 'default',
      'Annulée': 'error'
    };
    return colors[statut] || 'default';
  };

  const handleOpenDialog = (campagne) => {
    setSelectedCampagne(campagne);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCampagne(null);
  };

  const handleOpenMedia = (type, url) => {
    setMediaDialog({ open: true, type, url });
  };

  const handleCloseMedia = () => {
    setMediaDialog({ open: false, type: '', url: '' });
  };

  const campagnesFutures = campagnes.filter(c => isFutureCampagne(c.dateDebut));
  const campagnesPassees = campagnes.filter(c => !isFutureCampagne(c.dateDebut));

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h3" align="center" gutterBottom>
          Actualités MERA
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" gutterBottom>
          Mission d'Évangélisation pour une Récolte Abondante
        </Typography>
        <Divider sx={{ my: 3 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Offensive en cours - Posséder la terre */}
        <Box sx={{ mb: 6 }}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #0047AB 0%, #FFA500 100%)',
              color: 'white',
              overflow: 'hidden'
            }}
          >
            <Grid container>
              <Grid item xs={12} md={7}>
                <CardMedia
                  component="img"
                  image="/offensive-possedar-terre.jpg"
                  alt="Offensive - Posséder la terre"
                  sx={{
                    height: { xs: 350, md: 600 },
                    width: '100%',
                    objectFit: 'cover'
                  }}
                />
              </Grid>
              <Grid item xs={12} md={5}>
                <CardContent sx={{ p: 4 }}>
                  <Chip
                    label="EN COURS"
                    color="error"
                    sx={{
                      mb: 2,
                      fontWeight: 'bold',
                      animation: 'pulse 2s infinite'
                    }}
                  />
                  <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: 'white' }}>
                    OFFENSIVE SPIRITUELLE
                  </Typography>
                  <Typography variant="h4" gutterBottom sx={{ color: '#ffd700', fontWeight: 'bold' }}>
                    "POSSÉDER LA TERRE"
                  </Typography>
                  <Divider sx={{ my: 2, bgcolor: 'white', opacity: 0.3 }} />
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ fontStyle: 'italic', mb: 1 }}>
                      "Tout lieu que foulera la plante de votre pied, je vous le donne..."
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      - Josué 1:3
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CalendarToday sx={{ mr: 1 }} />
                    <Typography variant="h6">
                      Du 16 novembre au 5 décembre 2025
                    </Typography>
                  </Box>
                  <Alert severity="warning" sx={{ mt: 3 }}>
                    <Typography variant="body1" fontWeight="bold">
                      Nous sommes en pleine offensive ! Rejoignez-nous pour conquérir de nouvelles âmes pour le Royaume de Dieu.
                    </Typography>
                  </Alert>
                </CardContent>
              </Grid>
            </Grid>
          </Card>
        </Box>

        {/* Campagnes Futures */}
        {campagnesFutures.length > 0 && (
          <Box sx={{ mb: 6 }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', mb: 3 }}>
              Prochaines Campagnes
            </Typography>
            <Grid container spacing={3}>
              {campagnesFutures.map((campagne) => (
                <Grid item xs={12} md={6} key={campagne._id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'scale(1.02)',
                        boxShadow: 6
                      }
                    }}
                  >
                    {campagne.images && campagne.images.length > 0 && (
                      <CardMedia
                        component="img"
                        height="200"
                        image={campagne.images[0].url}
                        alt={campagne.titre}
                        sx={{ cursor: 'pointer' }}
                        onClick={() => handleOpenMedia('image', campagne.images[0].url)}
                      />
                    )}
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Chip
                          label={campagne.type}
                          color="primary"
                          size="small"
                        />
                        <Chip
                          label={campagne.statut}
                          color={getStatutChipColor(campagne.statut)}
                          size="small"
                        />
                      </Box>
                      <Typography variant="h5" gutterBottom>
                        {campagne.titre}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {campagne.description.substring(0, 150)}...
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CalendarToday sx={{ mr: 1, fontSize: 18 }} />
                        <Typography variant="body2">
                          {formatDateRange(campagne.dateDebut, campagne.dateFin)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationOn sx={{ mr: 1, fontSize: 18 }} />
                        <Typography variant="body2">{campagne.lieu}</Typography>
                      </Box>
                      {campagne.objectifs && campagne.objectifs.nombreAmes > 0 && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <People sx={{ mr: 1, fontSize: 18 }} />
                          <Typography variant="body2">
                            Objectif: {campagne.objectifs.nombreAmes} âmes
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                    <Box sx={{ p: 2, pt: 0 }}>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => handleOpenDialog(campagne)}
                      >
                        Voir les détails
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Campagnes Passées */}
        {campagnesPassees.length > 0 && (
          <Box>
            <Typography variant="h4" gutterBottom sx={{ color: 'secondary.main', mb: 3 }}>
              Campagnes Réalisées
            </Typography>
            <Grid container spacing={3}>
              {campagnesPassees.map((campagne) => (
                <Grid item xs={12} md={6} key={campagne._id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'scale(1.02)',
                        boxShadow: 6
                      }
                    }}
                  >
                    {campagne.images && campagne.images.length > 0 && (
                      <CardMedia
                        component="img"
                        height="200"
                        image={campagne.images[0].url}
                        alt={campagne.titre}
                        sx={{ cursor: 'pointer' }}
                        onClick={() => handleOpenMedia('image', campagne.images[0].url)}
                      />
                    )}
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Chip
                          label={campagne.type}
                          color="primary"
                          size="small"
                        />
                        <Chip
                          label={campagne.statut}
                          color={getStatutChipColor(campagne.statut)}
                          size="small"
                        />
                      </Box>
                      <Typography variant="h5" gutterBottom>
                        {campagne.titre}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {campagne.description.substring(0, 150)}...
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CalendarToday sx={{ mr: 1, fontSize: 18 }} />
                        <Typography variant="body2">
                          {formatDateRange(campagne.dateDebut, campagne.dateFin)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationOn sx={{ mr: 1, fontSize: 18 }} />
                        <Typography variant="body2">{campagne.lieu}</Typography>
                      </Box>
                      {campagne.resultats && campagne.resultats.amesGagnees > 0 && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <People sx={{ mr: 1, fontSize: 18 }} />
                          <Typography variant="body2" color="success.main" fontWeight="bold">
                            {campagne.resultats.amesGagnees} âmes rencontrées
                          </Typography>
                        </Box>
                      )}
                      {(campagne.images?.length > 1 || campagne.videos?.length > 0) && (
                        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                          {campagne.images && campagne.images.length > 1 && (
                            <Chip
                              label={`${campagne.images.length} photos`}
                              size="small"
                              color="info"
                            />
                          )}
                          {campagne.videos && campagne.videos.length > 0 && (
                            <Chip
                              icon={<PlayCircleOutline />}
                              label={`${campagne.videos.length} vidéo${campagne.videos.length > 1 ? 's' : ''}`}
                              size="small"
                              color="error"
                            />
                          )}
                        </Box>
                      )}
                    </CardContent>
                    <Box sx={{ p: 2, pt: 0 }}>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => handleOpenDialog(campagne)}
                      >
                        Voir les détails
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {campagnes.length === 0 && !loading && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              Aucune actualité disponible pour le moment
            </Typography>
          </Box>
        )}
      </Box>

      {/* Dialog détails campagne */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedCampagne && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5">{selectedCampagne.titre}</Typography>
                <IconButton onClick={handleCloseDialog}>
                  <Close />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ mb: 2 }}>
                <Chip label={selectedCampagne.type} color="primary" sx={{ mr: 1 }} />
                <Chip label={selectedCampagne.statut} color={getStatutChipColor(selectedCampagne.statut)} />
              </Box>

              <Typography variant="body1" paragraph>
                {selectedCampagne.description}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Informations
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CalendarToday sx={{ mr: 1 }} />
                  <Typography>
                    {formatDateRange(selectedCampagne.dateDebut, selectedCampagne.dateFin)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOn sx={{ mr: 1 }} />
                  <Typography>{selectedCampagne.lieu}</Typography>
                </Box>
              </Box>

              {selectedCampagne.parcours && (
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Route sx={{ mr: 1 }} />
                    <Typography variant="h6">Parcours</Typography>
                  </Box>
                  <Typography variant="body2">{selectedCampagne.parcours}</Typography>
                </Box>
              )}

              {selectedCampagne.lieuxRassemblement && selectedCampagne.lieuxRassemblement.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Lieux de Rassemblement
                  </Typography>
                  {selectedCampagne.lieuxRassemblement.map((lieu, index) => (
                    <Box key={index} sx={{ mb: 1, pl: 2 }}>
                      <Typography variant="body1" fontWeight="bold">
                        {lieu.nom}
                      </Typography>
                      {lieu.adresse && (
                        <Typography variant="body2" color="text.secondary">
                          {lieu.adresse}
                        </Typography>
                      )}
                      {lieu.heureRassemblement && (
                        <Typography variant="body2" color="text.secondary">
                          Heure: {lieu.heureRassemblement}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>
              )}

              {selectedCampagne.programme && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Programme
                  </Typography>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                    {selectedCampagne.programme}
                  </Typography>
                </Box>
              )}

              {selectedCampagne.resultats && !isFutureCampagne(selectedCampagne.dateDebut) && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Résultats
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography variant="h4" color="success.main">
                        {selectedCampagne.resultats.amesGagnees}
                      </Typography>
                      <Typography variant="body2">Âmes rencontrées</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="h4" color="primary.main">
                        {selectedCampagne.resultats.tractsDistribues}
                      </Typography>
                      <Typography variant="body2">Tracts distribués</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="h4" color="secondary.main">
                        {selectedCampagne.resultats.participantsPresents}
                      </Typography>
                      <Typography variant="body2">Participants</Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {selectedCampagne.images && selectedCampagne.images.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Photos
                  </Typography>
                  <Grid container spacing={2}>
                    {selectedCampagne.images.map((image, index) => (
                      <Grid item xs={6} sm={4} key={index}>
                        <Card
                          sx={{ cursor: 'pointer' }}
                          onClick={() => handleOpenMedia('image', `${BACKEND_URL}${image.url}`)}
                        >
                          <CardMedia
                            component="img"
                            height="120"
                            image={`${BACKEND_URL}${image.url}`}
                            alt={image.legende || `Photo ${index + 1}`}
                          />
                          {image.legende && (
                            <CardContent sx={{ p: 1 }}>
                              <Typography variant="caption">{image.legende}</Typography>
                            </CardContent>
                          )}
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {selectedCampagne.videos && selectedCampagne.videos.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Vidéos
                  </Typography>
                  <Grid container spacing={2}>
                    {selectedCampagne.videos.map((video, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Card
                          sx={{ cursor: 'pointer' }}
                          onClick={() => handleOpenMedia('video', video.url)}
                        >
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <PlayCircleOutline sx={{ mr: 1, color: 'error.main' }} />
                              <Typography variant="subtitle1">
                                {video.titre || `Vidéo ${index + 1}`}
                              </Typography>
                            </Box>
                            {video.description && (
                              <Typography variant="body2" color="text.secondary">
                                {video.description}
                              </Typography>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {selectedCampagne.notes && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Notes
                  </Typography>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                    {selectedCampagne.notes}
                  </Typography>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Fermer</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Dialog média (image/vidéo) */}
      <Dialog
        open={mediaDialog.open}
        onClose={handleCloseMedia}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              {mediaDialog.type === 'image' ? 'Photo' : 'Vidéo'}
            </Typography>
            <IconButton onClick={handleCloseMedia}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {mediaDialog.type === 'image' ? (
            <Box
              component="img"
              src={mediaDialog.url}
              alt="Image"
              sx={{ width: '100%', height: 'auto' }}
            />
          ) : (
            <Box
              component="video"
              controls
              src={mediaDialog.url}
              sx={{ width: '100%', height: 'auto' }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Actualites;

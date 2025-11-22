import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  ArrowBack,
  Person,
  Phone,
  Email,
  LocationOn,
  Cake,
  Work,
  People,
  FavoriteBorder,
  CalendarToday,
  Place,
  Church
} from '@mui/icons-material';
import api from '../services/api';

const DetailAme = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ame, setAme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAmeDetails();
  }, [id]);

  const fetchAmeDetails = async () => {
    try {
      const response = await api.get(`/ames/${id}`);
      setAme(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des détails');
    }
    setLoading(false);
  };

  const getStatutColor = (statut) => {
    const colors = {
      'Non-croyant': 'default',
      'Intéressé': 'info',
      'Nouveau converti': 'success',
      'Baptisé': 'primary',
      'Membre actif': 'secondary'
    };
    return colors[statut] || 'default';
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">{error}</Alert>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/mes-ames')}
            sx={{ mt: 2 }}
          >
            Retour
          </Button>
        </Box>
      </Container>
    );
  }

  if (!ame) {
    return null;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/mes-ames')}
          sx={{ mb: 3 }}
        >
          Retour à mes contacts
        </Button>

        <Paper elevation={3} sx={{ p: 4 }}>
          {/* En-tête avec nom et statut */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h4">
                {ame.prenom} {ame.nom}
              </Typography>
              <Chip
                label={ame.statutSpirituel}
                color={getStatutColor(ame.statutSpirituel)}
                size="large"
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              Enregistré le {new Date(ame.createdAt).toLocaleDateString('fr-FR')}
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Informations personnelles */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Person /> Informations personnelles
            </Typography>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <List>
                  <ListItem>
                    <Phone sx={{ mr: 2, color: 'primary.main' }} />
                    <ListItemText
                      primary="Téléphone"
                      secondary={ame.telephone}
                    />
                  </ListItem>
                  {ame.email && (
                    <ListItem>
                      <Email sx={{ mr: 2, color: 'primary.main' }} />
                      <ListItemText
                        primary="Email"
                        secondary={ame.email}
                      />
                    </ListItem>
                  )}
                  {ame.age && (
                    <ListItem>
                      <Cake sx={{ mr: 2, color: 'primary.main' }} />
                      <ListItemText
                        primary="Âge"
                        secondary={`${ame.age} ans`}
                      />
                    </ListItem>
                  )}
                  {ame.sexe && (
                    <ListItem>
                      <Person sx={{ mr: 2, color: 'primary.main' }} />
                      <ListItemText
                        primary="Sexe"
                        secondary={ame.sexe}
                      />
                    </ListItem>
                  )}
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <List>
                  {ame.adresse && (
                    <ListItem>
                      <LocationOn sx={{ mr: 2, color: 'primary.main' }} />
                      <ListItemText
                        primary="Adresse"
                        secondary={`${ame.adresse}${ame.commune ? ', ' + ame.commune : ''}${ame.ville ? ', ' + ame.ville : ''}`}
                      />
                    </ListItem>
                  )}
                  {ame.situationMatrimoniale && (
                    <ListItem>
                      <People sx={{ mr: 2, color: 'primary.main' }} />
                      <ListItemText
                        primary="Situation matrimoniale"
                        secondary={ame.situationMatrimoniale}
                      />
                    </ListItem>
                  )}
                  {ame.nombreEnfants !== undefined && (
                    <ListItem>
                      <People sx={{ mr: 2, color: 'primary.main' }} />
                      <ListItemText
                        primary="Nombre d'enfants"
                        secondary={ame.nombreEnfants}
                      />
                    </ListItem>
                  )}
                  {ame.profession && (
                    <ListItem>
                      <Work sx={{ mr: 2, color: 'primary.main' }} />
                      <ListItemText
                        primary="Profession"
                        secondary={ame.profession}
                      />
                    </ListItem>
                  )}
                </List>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Informations de la rencontre */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarToday /> Informations de la rencontre
            </Typography>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={4}>
                <List>
                  <ListItem>
                    <CalendarToday sx={{ mr: 2, color: 'secondary.main' }} />
                    <ListItemText
                      primary="Type de rencontre"
                      secondary={ame.typeRencontre}
                    />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12} md={4}>
                <List>
                  <ListItem>
                    <Place sx={{ mr: 2, color: 'secondary.main' }} />
                    <ListItemText
                      primary="Lieu de la rencontre"
                      secondary={ame.lieuRencontre || 'Non spécifié'}
                    />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12} md={4}>
                <List>
                  <ListItem>
                    <CalendarToday sx={{ mr: 2, color: 'secondary.main' }} />
                    <ListItemText
                      primary="Date de la rencontre"
                      secondary={new Date(ame.dateRencontre).toLocaleDateString('fr-FR')}
                    />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Informations spirituelles */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Church /> Informations spirituelles
            </Typography>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <List>
                  <ListItem>
                    <Church sx={{ mr: 2, color: 'warning.main' }} />
                    <ListItemText
                      primary="Statut spirituel"
                      secondary={ame.statutSpirituel}
                    />
                  </ListItem>
                  {ame.ancienneEglise && (
                    <ListItem>
                      <Church sx={{ mr: 2, color: 'warning.main' }} />
                      <ListItemText
                        primary="Ancienne église"
                        secondary={ame.ancienneEglise}
                      />
                    </ListItem>
                  )}
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                {ame.besoinsPriere && ame.besoinsPriere.length > 0 && (
                  <Box>
                    <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FavoriteBorder /> Besoins de prière
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                      {ame.besoinsPriere.map((besoin, index) => (
                        <Chip key={index} label={besoin} color="warning" variant="outlined" />
                      ))}
                    </Box>
                  </Box>
                )}
              </Grid>
            </Grid>
          </Box>

          {/* Notes */}
          {ame.notes && (
            <>
              <Divider sx={{ mb: 3 }} />
              <Box>
                <Typography variant="h6" gutterBottom>
                  Notes et observations
                </Typography>
                <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {ame.notes}
                  </Typography>
                </Paper>
              </Box>
            </>
          )}

          {/* Actions */}
          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/mes-ames')}
            >
              Retour
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default DetailAme;

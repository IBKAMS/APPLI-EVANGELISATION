import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper
} from '@mui/material';
import {
  Share,
  Visibility,
  Church,
  Help,
  FavoriteBorder,
  Book
} from '@mui/icons-material';
import api from '../services/api';

const Ressources = () => {
  const [ressources, setRessources] = useState([]);
  const [filter, setFilter] = useState('');
  const [selectedRessource, setSelectedRessource] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchRessources();
  }, [filter]);

  const fetchRessources = async () => {
    try {
      let url = '/ressources';
      if (filter) {
        url += `?categorie=${filter}`;
      }

      const response = await api.get(url);
      setRessources(response.data.data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleOpenDialog = async (ressource) => {
    try {
      const response = await api.get(`/ressources/${ressource._id}`);
      console.log('Ressource récupérée:', response.data.data);
      console.log('Contenu:', response.data.data.contenu);
      setSelectedRessource(response.data.data);
      setDialogOpen(true);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handlePartager = async (id) => {
    try {
      await api.post(`/ressources/${id}/partager`);

      if (navigator.share) {
        await navigator.share({
          title: selectedRessource?.titre,
          text: selectedRessource?.description,
          url: window.location.href
        });
      } else {
        alert('Ressource partagée !');
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const getCategorieIcon = (categorie) => {
    const icons = {
      'Qui est Jésus': <Church />,
      'Plan de salut': <FavoriteBorder />,
      'Prière du Salut': <FavoriteBorder />,
      'Versets clés': <Book />,
      'Réponses aux questions': <Help />
    };
    return icons[categorie] || <Book />;
  };

  const renderContenuFormate = (contenu) => {
    // Diviser le contenu par lignes
    const lignes = contenu.split('\n');
    const elements = [];
    let currentSection = null;

    lignes.forEach((ligne, index) => {
      const trimmedLigne = ligne.trim();

      // Détecter les titres de sections (TOUT EN MAJUSCULES ou lignes importantes)
      if (
        trimmedLigne.match(/^[A-ZÀÂÄÇÉÈÊËÎÏÔÙÛÜŸÆŒ\s\d:.,!?'"-]+$/) &&
        trimmedLigne.length > 5 &&
        trimmedLigne.length < 100 &&
        !trimmedLigne.startsWith('"') &&
        !trimmedLigne.includes('RÉPONSE')
      ) {
        elements.push(
          <Typography
            key={index}
            variant="h5"
            sx={{
              mt: 3,
              mb: 2,
              fontWeight: 'bold',
              color: '#0047AB',
              textAlign: 'center',
              fontSize: '1.3rem'
            }}
          >
            {ligne}
          </Typography>
        );
        currentSection = 'titre';
      }
      // Détecter les sous-titres numérotés (1., 2., I., II., etc.)
      else if (trimmedLigne.match(/^(\d+\.|[IVX]+\.|[A-Z]\.)[\s-]/)) {
        elements.push(
          <Typography
            key={index}
            variant="h6"
            sx={{
              mt: 2.5,
              mb: 1.5,
              fontWeight: 'bold',
              color: '#E31E24',
              fontSize: '1.1rem',
              textTransform: 'uppercase'
            }}
          >
            {ligne}
          </Typography>
        );
        currentSection = 'soustitre';
      }
      // Détecter les questions (commencent par ❓ QUESTION)
      else if (trimmedLigne.includes('❓ QUESTION') || trimmedLigne.match(/^QUESTION\s*\d+/i)) {
        currentSection = 'question';
        elements.push(
          <Box
            key={index}
            sx={{
              mt: 3,
              mb: 2,
              p: 2,
              bgcolor: '#E8F4FD',
              borderLeft: '5px solid #0047AB',
              borderRadius: 1
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                color: '#0047AB',
                fontSize: '1.1rem'
              }}
            >
              {ligne}
            </Typography>
          </Box>
        );
      }
      // Détecter les réponses
      else if (trimmedLigne === 'RÉPONSE :' || trimmedLigne === 'RÉPONSE' || trimmedLigne.startsWith('RÉPONSE :')) {
        currentSection = 'reponse';
        elements.push(
          <Typography
            key={index}
            variant="subtitle1"
            sx={{
              mt: 2,
              mb: 1,
              fontWeight: 'bold',
              color: '#E31E24',
              fontSize: '1rem'
            }}
          >
            {ligne}
          </Typography>
        );
      }
      // Détecter les versets bibliques (entre guillemets avec référence)
      else if (
        (trimmedLigne.startsWith('"') && (trimmedLigne.endsWith(')') || trimmedLigne.endsWith('"'))) ||
        (trimmedLigne.startsWith('"') && trimmedLigne.length > 30)
      ) {
        elements.push(
          <Box
            key={index}
            sx={{
              my: 1.5,
              p: 2,
              bgcolor: '#FFF8E1',
              borderLeft: '4px solid #FFA500',
              borderRadius: 1,
              fontStyle: 'italic'
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: '#555',
                lineHeight: 1.7,
                fontSize: '0.95rem'
              }}
            >
              {ligne}
            </Typography>
          </Box>
        );
      }
      // Détecter les références bibliques seules (ex: "Jean 3:16", "(Matthieu 6:6)")
      else if (
        trimmedLigne.match(/^\(?[12]?\s*[A-Za-zÉéèê]+\s+\d+:\d+(-\d+)?(\s*-\s*\d+)?\)?$/) ||
        trimmedLigne.match(/^\([A-Za-zÉéèê\s]+\d+:\d+/)
      ) {
        elements.push(
          <Typography
            key={index}
            variant="body2"
            sx={{
              my: 1,
              color: '#FFA500',
              fontWeight: 'bold',
              fontStyle: 'italic',
              fontSize: '0.9rem'
            }}
          >
            {ligne}
          </Typography>
        );
      }
      // Séparateur
      else if (trimmedLigne === '---' || trimmedLigne === '___' || trimmedLigne === '***') {
        elements.push(
          <Box
            key={index}
            sx={{
              my: 3,
              borderBottom: '2px dashed #ddd'
            }}
          />
        );
      }
      // Paragraphes importants (commencent par un emoji ou point d'exclamation)
      else if (trimmedLigne.match(/^[🙏✝️❤️⭐💡📖✨🔥]/)) {
        elements.push(
          <Box
            key={index}
            sx={{
              my: 2,
              p: 2,
              bgcolor: '#FFF0F5',
              borderLeft: '4px solid #E31E24',
              borderRadius: 1
            }}
          >
            <Typography
              variant="body1"
              sx={{
                color: '#333',
                lineHeight: 1.8,
                fontWeight: 500
              }}
            >
              {ligne}
            </Typography>
          </Box>
        );
      }
      // Texte normal
      else if (trimmedLigne !== '') {
        const color = currentSection === 'reponse' ? '#333' : 'text.primary';
        const fontWeight = currentSection === 'soustitre' ? 500 : 400;
        elements.push(
          <Typography
            key={index}
            variant="body1"
            sx={{
              my: 1,
              color: color,
              lineHeight: 1.8,
              fontWeight: fontWeight,
              fontSize: '1rem'
            }}
          >
            {ligne}
          </Typography>
        );
      }
      // Ligne vide
      else {
        elements.push(<Box key={index} sx={{ height: '8px' }} />);
      }
    });

    return <Box>{elements}</Box>;
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{
          background: 'linear-gradient(135deg, #0047AB 0%, #E31E24 100%)',
          borderRadius: 2,
          p: 3,
          mb: 3,
          color: 'white'
        }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            📚 Ressources d'Évangélisation
          </Typography>
          <Typography variant="body1" paragraph sx={{ opacity: 0.95 }}>
            Outils et contenus pour partager efficacement l'Évangile
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            select
            label="Filtrer par catégorie"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            sx={{ minWidth: 250 }}
          >
            <MenuItem value="">Toutes les catégories</MenuItem>
            <MenuItem value="Qui est Jésus">Qui est Jésus</MenuItem>
            <MenuItem value="Plan de salut">Plan de salut</MenuItem>
            <MenuItem value="Prière du Salut">Prière du Salut</MenuItem>
            <MenuItem value="Versets clés">Versets clés</MenuItem>
            <MenuItem value="Témoignages">Témoignages</MenuItem>
            <MenuItem value="Réponses aux questions">Réponses aux questions</MenuItem>
            <MenuItem value="Comment prier">Comment prier</MenuItem>
            <MenuItem value="Vie chrétienne">Vie chrétienne</MenuItem>
          </TextField>
        </Box>

        <Grid container spacing={3}>
          {ressources.length === 0 ? (
            <Grid item xs={12}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography>Aucune ressource disponible</Typography>
              </Paper>
            </Grid>
          ) : (
            ressources.map((ressource) => (
              <Grid item xs={12} sm={6} md={4} key={ressource._id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderTop: '4px solid #0047AB',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 16px rgba(0,71,171,0.2)'
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ color: '#E31E24', mr: 1 }}>
                        {getCategorieIcon(ressource.categorie)}
                      </Box>
                      <Typography variant="h6" sx={{ ml: 1, color: '#0047AB', fontWeight: 'bold' }}>
                        {ressource.titre}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {ressource.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip
                        label={ressource.categorie}
                        size="small"
                        sx={{
                          bgcolor: '#0047AB',
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                      <Chip
                        label={ressource.type}
                        size="small"
                        sx={{
                          borderColor: '#FFA500',
                          color: '#FFA500',
                          fontWeight: 'bold'
                        }}
                        variant="outlined"
                      />
                    </Box>
                  </CardContent>
                  <CardActions sx={{ borderTop: '1px solid #f0f0f0', pt: 2 }}>
                    <Button
                      size="small"
                      startIcon={<Visibility />}
                      onClick={() => handleOpenDialog(ressource)}
                      sx={{
                        color: '#0047AB',
                        '&:hover': {
                          bgcolor: 'rgba(0, 71, 171, 0.1)'
                        }
                      }}
                    >
                      Voir
                    </Button>
                    <Button
                      size="small"
                      startIcon={<Share />}
                      onClick={() => handlePartager(ressource._id)}
                      sx={{
                        color: '#E31E24',
                        '&:hover': {
                          bgcolor: 'rgba(227, 30, 36, 0.1)'
                        }
                      }}
                    >
                      Partager
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Box>

      {/* Dialog pour afficher la ressource */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedRessource && (
          <>
            <DialogTitle>{selectedRessource.titre}</DialogTitle>
            <DialogContent>
              <Typography paragraph>
                {selectedRessource.description}
              </Typography>

              {selectedRessource.contenu && selectedRessource.contenu.trim() !== '' && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#0047AB', fontWeight: 'bold' }}>
                    Contenu
                  </Typography>
                  <Paper elevation={2} sx={{ p: 3, bgcolor: 'grey.50', borderLeft: '4px solid #0047AB' }}>
                    {renderContenuFormate(selectedRessource.contenu)}
                  </Paper>
                </Box>
              )}

              {selectedRessource.versetsBibliques && selectedRessource.versetsBibliques.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Versets bibliques
                  </Typography>
                  {selectedRessource.versetsBibliques.map((verset, index) => (
                    <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                      <Typography variant="subtitle2" color="primary">
                        {verset.reference}
                      </Typography>
                      <Typography variant="body2">
                        "{verset.texte}"
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>
                Fermer
              </Button>
              <Button
                variant="contained"
                startIcon={<Share />}
                onClick={() => handlePartager(selectedRessource._id)}
              >
                Partager
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default Ressources;

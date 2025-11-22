import React from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button
} from '@mui/material';
import {
  PersonAdd,
  MenuBook,
  AutoStories,
  People,
  Campaign
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  const menuItems = [
    {
      title: 'Enregistrer une Âme',
      description: 'Enregistrer les informations d\'une personne rencontrée',
      icon: <PersonAdd sx={{ fontSize: 60, color: 'primary.main' }} />,
      path: '/enregistrer-ame',
      color: '#0047AB' // Bleu REHOBOTH
    },
    {
      title: 'Mes Contacts',
      description: 'Voir et gérer les âmes que j\'ai enregistrées',
      icon: <People sx={{ fontSize: 60, color: 'success.main' }} />,
      path: '/mes-ames',
      color: '#2e7d32'
    },
    {
      title: 'Outils d\'Évangélisation',
      description: 'Ressources bibliques, versets, et guides pratiques',
      icon: <MenuBook sx={{ fontSize: 60, color: 'warning.main' }} />,
      path: '/ressources',
      color: '#FFA500' // Orange REHOBOTH
    },
    {
      title: 'Parcours de Formation',
      description: 'Formations pour les nouveaux convertis et chrétiens',
      icon: <AutoStories sx={{ fontSize: 60, color: 'secondary.main' }} />,
      path: '/parcours',
      color: '#E31E24' // Rouge REHOBOTH
    },
    {
      title: 'Actualités MERA',
      description: 'Campagnes d\'évangélisation passées et à venir',
      icon: <Campaign sx={{ fontSize: 60, color: 'info.main' }} />,
      path: '/actualites',
      color: '#1976d2'
    }
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h3" align="center" gutterBottom>
          Bienvenue, {user?.prenom} !
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" gutterBottom>
          Centre Missionnaire REHOBOTH
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Votre plateforme d'évangélisation et de suivi des âmes
        </Typography>

        <Grid container spacing={3}>
          {menuItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={6} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: 6
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Box sx={{ mb: 2 }}>
                    {item.icon}
                  </Box>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                  <Button
                    variant="contained"
                    onClick={() => window.location.href = item.path}
                    sx={{ backgroundColor: item.color }}
                  >
                    Accéder
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 6, p: 3, bgcolor: 'primary.main', color: 'white', borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom align="center">
            "Allez, faites de toutes les nations des disciples..."
          </Typography>
          <Typography variant="body1" align="center">
            Matthieu 28:19
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;

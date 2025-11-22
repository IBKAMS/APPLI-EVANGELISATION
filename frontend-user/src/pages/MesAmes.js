import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  TextField,
  MenuItem
} from '@mui/material';
import { Visibility } from '@mui/icons-material';
import api from '../services/api';

const MesAmes = () => {
  const [ames, setAmes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAmes();
  }, [filter]);

  const fetchAmes = async () => {
    try {
      let url = '/ames';
      if (filter) {
        url += `?statutSpirituel=${filter}`;
      }

      const response = await api.get(url);
      setAmes(response.data.data);
    } catch (error) {
      console.error('Erreur:', error);
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

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          👥 Mes Contacts
        </Typography>

        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <TextField
              select
              label="Filtrer par statut"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="">Tous</MenuItem>
              <MenuItem value="Non-croyant">Non-croyant</MenuItem>
              <MenuItem value="Intéressé">Intéressé</MenuItem>
              <MenuItem value="Nouveau converti">Nouveau converti</MenuItem>
              <MenuItem value="Baptisé">Baptisé</MenuItem>
              <MenuItem value="Membre actif">Membre actif</MenuItem>
            </TextField>

            <Button
              variant="contained"
              onClick={() => navigate('/enregistrer-ame')}
            >
              + Nouvelle Âme
            </Button>
          </Box>
        </Paper>

        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Nom complet</strong></TableCell>
                <TableCell><strong>Téléphone</strong></TableCell>
                <TableCell><strong>Statut</strong></TableCell>
                <TableCell><strong>Type rencontre</strong></TableCell>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Chargement...
                  </TableCell>
                </TableRow>
              ) : ames.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Aucune âme enregistrée
                  </TableCell>
                </TableRow>
              ) : (
                ames.map((ame) => (
                  <TableRow key={ame._id}>
                    <TableCell>{ame.prenom} {ame.nom}</TableCell>
                    <TableCell>{ame.telephone}</TableCell>
                    <TableCell>
                      <Chip
                        label={ame.statutSpirituel}
                        color={getStatutColor(ame.statutSpirituel)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{ame.typeRencontre}</TableCell>
                    <TableCell>
                      {new Date(ame.dateRencontre).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        startIcon={<Visibility />}
                        onClick={() => navigate(`/ame/${ame._id}`)}
                      >
                        Voir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Total: {ames.length} contact{ames.length > 1 ? 's' : ''}
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default MesAmes;

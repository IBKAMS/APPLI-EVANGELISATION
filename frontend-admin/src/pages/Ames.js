import React, { useState, useEffect } from 'react';
import {
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
  TextField,
  Grid,
  MenuItem,
  IconButton,
  Collapse
} from '@mui/material';
import { FilterList, ExpandMore, ExpandLess } from '@mui/icons-material';
import { formatPhoneNumber } from '../utils/formatters';
import api from '../services/api';

const Ames = () => {
  const [ames, setAmes] = useState([]);
  const [filteredAmes, setFilteredAmes] = useState([]);
  const [filter, setFilter] = useState({
    statut: '',
    statutSpirituel: '',
    ville: '',
    commune: '',
    sexe: '',
    typeRencontre: '',
    agentCallCenter: '',
    search: ''
  });
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    fetchAmes();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filter, ames]);

  const fetchAmes = async () => {
    try {
      const response = await api.get('/ames');
      setAmes(response.data.data || []);
      setFilteredAmes(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Erreur:', error);
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...ames];

    // Filtre par statut (Actif/Inactif)
    if (filter.statut) {
      filtered = filtered.filter(ame => ame.statut === filter.statut);
    }

    // Filtre par statut spirituel
    if (filter.statutSpirituel) {
      filtered = filtered.filter(ame => ame.statutSpirituel === filter.statutSpirituel);
    }

    // Filtre par ville
    if (filter.ville) {
      filtered = filtered.filter(ame =>
        ame.ville?.toLowerCase().includes(filter.ville.toLowerCase())
      );
    }

    // Filtre par commune
    if (filter.commune) {
      filtered = filtered.filter(ame =>
        ame.commune?.toLowerCase().includes(filter.commune.toLowerCase())
      );
    }

    // Filtre par sexe
    if (filter.sexe) {
      filtered = filtered.filter(ame => ame.sexe === filter.sexe);
    }

    // Filtre par type de rencontre
    if (filter.typeRencontre) {
      filtered = filtered.filter(ame => ame.typeRencontre === filter.typeRencontre);
    }

    // Filtre par agent call center
    if (filter.agentCallCenter) {
      filtered = filtered.filter(ame => ame.agentCallCenter === filter.agentCallCenter);
    }

    // Recherche globale (nom, prénom, téléphone)
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      filtered = filtered.filter(ame =>
        ame.nom?.toLowerCase().includes(searchLower) ||
        ame.prenom?.toLowerCase().includes(searchLower) ||
        ame.telephone?.includes(filter.search)
      );
    }

    setFilteredAmes(filtered);
  };

  const getStatutSpirituelColor = (statut) => {
    switch (statut) {
      case 'Nouveau converti':
      case 'Baptisé':
      case 'Chrétien pratiquant':
      case 'Membre actif':
        return 'success';
      case 'Converti non baptisé':
      case 'Intéressé':
        return 'primary';
      case 'Non-croyant':
      case 'Non-converti':
        return 'warning';
      case 'Chrétien rétrograde':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'Actif':
        return 'success';
      case 'À relancer':
        return 'warning';
      case 'Inactif':
        return 'error';
      case 'Transféré':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#0047AB' }}>
          Âmes Enregistrées
        </Typography>
        <IconButton
          onClick={() => setShowFilters(!showFilters)}
          sx={{ color: '#0047AB' }}
        >
          <FilterList />
          {showFilters ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>

      <Collapse in={showFilters}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#0047AB', mb: 2 }}>
            Filtres de recherche
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Recherche (Nom, Prénom, Téléphone)"
                value={filter.search}
                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                placeholder="Tapez pour rechercher..."
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                select
                fullWidth
                label="Statut Spirituel"
                value={filter.statutSpirituel}
                onChange={(e) => setFilter({ ...filter, statutSpirituel: e.target.value })}
              >
                <MenuItem value="">Tous</MenuItem>
                <MenuItem value="Non-croyant">Non-croyant</MenuItem>
                <MenuItem value="Non-converti">Non-converti</MenuItem>
                <MenuItem value="Intéressé">Intéressé</MenuItem>
                <MenuItem value="Nouveau converti">Nouveau converti</MenuItem>
                <MenuItem value="Converti non baptisé">Converti non baptisé</MenuItem>
                <MenuItem value="Baptisé">Baptisé</MenuItem>
                <MenuItem value="Chrétien pratiquant">Chrétien pratiquant</MenuItem>
                <MenuItem value="Membre actif">Membre actif</MenuItem>
                <MenuItem value="Chrétien rétrograde">Chrétien rétrograde</MenuItem>
                <MenuItem value="Musulman">Musulman</MenuItem>
                <MenuItem value="Animiste">Animiste</MenuItem>
                <MenuItem value="Autre religion">Autre religion</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                select
                fullWidth
                label="Statut"
                value={filter.statut}
                onChange={(e) => setFilter({ ...filter, statut: e.target.value })}
              >
                <MenuItem value="">Tous</MenuItem>
                <MenuItem value="Actif">Actif</MenuItem>
                <MenuItem value="À relancer">À relancer</MenuItem>
                <MenuItem value="Inactif">Inactif</MenuItem>
                <MenuItem value="Transféré">Transféré</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Ville"
                value={filter.ville}
                onChange={(e) => setFilter({ ...filter, ville: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Commune"
                value={filter.commune}
                onChange={(e) => setFilter({ ...filter, commune: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                select
                fullWidth
                label="Sexe"
                value={filter.sexe}
                onChange={(e) => setFilter({ ...filter, sexe: e.target.value })}
              >
                <MenuItem value="">Tous</MenuItem>
                <MenuItem value="Homme">Homme</MenuItem>
                <MenuItem value="Femme">Femme</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                select
                fullWidth
                label="Type de rencontre"
                value={filter.typeRencontre}
                onChange={(e) => setFilter({ ...filter, typeRencontre: e.target.value })}
              >
                <MenuItem value="">Tous</MenuItem>
                <MenuItem value="Porte-à-porte">Porte-à-porte</MenuItem>
                <MenuItem value="Rue">Rue</MenuItem>
                <MenuItem value="Marché">Marché</MenuItem>
                <MenuItem value="Transport">Transport</MenuItem>
                <MenuItem value="Lieu de travail">Lieu de travail</MenuItem>
                <MenuItem value="École/Université">École/Université</MenuItem>
                <MenuItem value="Événement église">Événement église</MenuItem>
                <MenuItem value="Campagne d'évangélisation">Campagne d'évangélisation</MenuItem>
                <MenuItem value="Croisade">Croisade</MenuItem>
                <MenuItem value="Réseau social">Réseau social</MenuItem>
                <MenuItem value="Famille">Famille</MenuItem>
                <MenuItem value="Ami">Ami</MenuItem>
                <MenuItem value="Invité au culte">Invité au culte</MenuItem>
                <MenuItem value="Soi-même au culte">Soi-même au culte</MenuItem>
                <MenuItem value="Autre">Autre</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                select
                fullWidth
                label="Agent Call Center"
                value={filter.agentCallCenter}
                onChange={(e) => setFilter({ ...filter, agentCallCenter: e.target.value })}
              >
                <MenuItem value="">Tous</MenuItem>
                <MenuItem value="Ornella">Ornella</MenuItem>
                <MenuItem value="Octavie">Octavie</MenuItem>
                <MenuItem value="Leila">Leila</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </Paper>
      </Collapse>

      <Paper sx={{ p: 2, mb: 2, bgcolor: '#0047AB', color: 'white' }}>
        <Typography variant="h6">
          Total: {filteredAmes.length} âme{filteredAmes.length > 1 ? 's' : ''} trouvée{filteredAmes.length > 1 ? 's' : ''}
        </Typography>
      </Paper>

      <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ bgcolor: '#0047AB', color: 'white', fontWeight: 'bold' }}>Nom</TableCell>
              <TableCell sx={{ bgcolor: '#0047AB', color: 'white', fontWeight: 'bold' }}>Prénom</TableCell>
              <TableCell sx={{ bgcolor: '#0047AB', color: 'white', fontWeight: 'bold' }}>Téléphone</TableCell>
              <TableCell sx={{ bgcolor: '#0047AB', color: 'white', fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ bgcolor: '#0047AB', color: 'white', fontWeight: 'bold' }}>Sexe</TableCell>
              <TableCell sx={{ bgcolor: '#0047AB', color: 'white', fontWeight: 'bold' }}>Âge</TableCell>
              <TableCell sx={{ bgcolor: '#0047AB', color: 'white', fontWeight: 'bold' }}>Commune</TableCell>
              <TableCell sx={{ bgcolor: '#0047AB', color: 'white', fontWeight: 'bold' }}>Ville</TableCell>
              <TableCell sx={{ bgcolor: '#0047AB', color: 'white', fontWeight: 'bold' }}>Type Rencontre</TableCell>
              <TableCell sx={{ bgcolor: '#0047AB', color: 'white', fontWeight: 'bold' }}>Invité par</TableCell>
              <TableCell sx={{ bgcolor: '#0047AB', color: 'white', fontWeight: 'bold' }}>Statut Spirituel</TableCell>
              <TableCell sx={{ bgcolor: '#0047AB', color: 'white', fontWeight: 'bold' }}>Statut</TableCell>
              <TableCell sx={{ bgcolor: '#0047AB', color: 'white', fontWeight: 'bold' }}>Agent CC</TableCell>
              <TableCell sx={{ bgcolor: '#0047AB', color: 'white', fontWeight: 'bold' }}>Date Enreg.</TableCell>
              <TableCell sx={{ bgcolor: '#0047AB', color: 'white', fontWeight: 'bold' }}>Évangéliste</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAmes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={15} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="textSecondary">
                    Aucune âme trouvée avec ces filtres
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredAmes.map((ame) => (
                <TableRow key={ame._id} hover>
                  <TableCell sx={{ fontWeight: 'bold' }}>{ame.nom}</TableCell>
                  <TableCell>{ame.prenom}</TableCell>
                  <TableCell>{formatPhoneNumber(ame.telephone)}</TableCell>
                  <TableCell>{ame.email || '-'}</TableCell>
                  <TableCell>{ame.sexe || '-'}</TableCell>
                  <TableCell>{ame.age || '-'}</TableCell>
                  <TableCell>{ame.commune || '-'}</TableCell>
                  <TableCell>{ame.ville || '-'}</TableCell>
                  <TableCell>
                    <Chip
                      label={ame.typeRencontre}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.75rem' }}
                    />
                  </TableCell>
                  <TableCell>{ame.nomInviteur || '-'}</TableCell>
                  <TableCell>
                    <Chip
                      label={ame.statutSpirituel}
                      color={getStatutSpirituelColor(ame.statutSpirituel)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={ame.statut}
                      color={getStatutColor(ame.statut)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {ame.agentCallCenter ? (
                      <Chip
                        label={ame.agentCallCenter}
                        size="small"
                        color="info"
                      />
                    ) : '-'}
                  </TableCell>
                  <TableCell>
                    {new Date(ame.createdAt).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>
                    {ame.evangeliste?.prenom} {ame.evangeliste?.nom}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Ames;

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Grid,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  CircularProgress,
  Snackbar,
  Alert,
  InputAdornment,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Event as EventIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import api from '../services/api';

const CAMPAIGN_TYPES = [
  'Porte-à-porte',
  'Rue',
  'Événement',
  'Médias',
  'Jeunesse',
  'Université',
  'Autre'
];

const CAMPAIGN_STATUS = {
  PLANIFIEE: 'Planifiée',
  EN_COURS: 'En cours',
  TERMINEE: 'Terminée',
  ANNULEE: 'Annulée'
};

const STATUS_COLORS = {
  'Planifiée': 'primary',
  'En cours': 'success',
  'Terminée': 'default',
  'Annulée': 'error'
};

const Campagnes = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [openResultsDialog, setOpenResultsDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    type: '',
    lieu: '',
    dateDebut: '',
    dateFin: '',
    statut: 'Planifiée',
    objectifs: {
      nombreAmes: '',
      nombreTracts: '',
      nombreParticipants: ''
    },
    budget: {
      prevu: '',
      depense: ''
    },
    logistique: {
      sono: false,
      chaises: '',
      tentes: '',
      generateur: false,
      eclairage: false,
      vehicules: '',
      materielAudiovisuel: false,
      autres: ''
    },
    notes: ''
  });
  const [resultsData, setResultsData] = useState({
    amesGagnees: '',
    tractsDistribues: '',
    participantsPresents: ''
  });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await api.get('/campagnes');
      setCampaigns(response.data.data || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      showSnackbar('Erreur lors du chargement des campagnes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenDialog = (campaign = null) => {
    if (campaign) {
      setSelectedCampaign(campaign);
      setFormData({
        titre: campaign.titre || '',
        description: campaign.description || '',
        type: campaign.type || '',
        lieu: campaign.lieu || '',
        dateDebut: campaign.dateDebut ? campaign.dateDebut.split('T')[0] : '',
        dateFin: campaign.dateFin ? campaign.dateFin.split('T')[0] : '',
        statut: campaign.statut || 'Planifiée',
        objectifs: {
          nombreAmes: campaign.objectifs?.nombreAmes || '',
          nombreTracts: campaign.objectifs?.nombreTracts || '',
          nombreParticipants: campaign.objectifs?.nombreParticipants || ''
        },
        budget: {
          prevu: campaign.budget?.prevu || '',
          depense: campaign.budget?.depense || ''
        },
        logistique: {
          sono: campaign.logistique?.sono || false,
          chaises: campaign.logistique?.chaises || '',
          tentes: campaign.logistique?.tentes || '',
          generateur: campaign.logistique?.generateur || false,
          eclairage: campaign.logistique?.eclairage || false,
          vehicules: campaign.logistique?.vehicules || '',
          materielAudiovisuel: campaign.logistique?.materielAudiovisuel || false,
          autres: campaign.logistique?.autres || ''
        },
        notes: campaign.notes || ''
      });
    } else {
      setSelectedCampaign(null);
      setFormData({
        titre: '',
        description: '',
        type: '',
        lieu: '',
        dateDebut: '',
        dateFin: '',
        statut: 'Planifiée',
        objectifs: {
          nombreAmes: '',
          nombreTracts: '',
          nombreParticipants: ''
        },
        budget: {
          prevu: '',
          depense: ''
        },
        logistique: {
          sono: false,
          chaises: '',
          tentes: '',
          generateur: false,
          eclairage: false,
          vehicules: '',
          materielAudiovisuel: false,
          autres: ''
        },
        notes: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCampaign(null);
  };

  const handleOpenResultsDialog = (campaign) => {
    setSelectedCampaign(campaign);
    setResultsData({
      amesGagnees: campaign.resultats?.amesGagnees || '',
      tractsDistribues: campaign.resultats?.tractsDistribues || '',
      participantsPresents: campaign.resultats?.participantsPresents || ''
    });
    setOpenResultsDialog(true);
  };

  const handleCloseResultsDialog = () => {
    setOpenResultsDialog(false);
    setSelectedCampaign(null);
  };

  const handleOpenDeleteDialog = (campaign) => {
    setSelectedCampaign(campaign);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedCampaign(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleResultsInputChange = (e) => {
    const { name, value } = e.target;
    setResultsData({
      ...resultsData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.titre || !formData.description || !formData.type || !formData.lieu) {
      showSnackbar('Veuillez remplir tous les champs obligatoires', 'error');
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        objectifs: {
          nombreAmes: formData.objectifs.nombreAmes ? parseInt(formData.objectifs.nombreAmes) : 0,
          nombreTracts: formData.objectifs.nombreTracts ? parseInt(formData.objectifs.nombreTracts) : 0,
          nombreParticipants: formData.objectifs.nombreParticipants ? parseInt(formData.objectifs.nombreParticipants) : 0
        },
        budget: {
          prevu: formData.budget.prevu ? parseFloat(formData.budget.prevu) : 0,
          depense: formData.budget.depense ? parseFloat(formData.budget.depense) : 0
        }
      };

      if (selectedCampaign) {
        await api.put(`/campagnes/${selectedCampaign._id}`, dataToSend);
        showSnackbar('Campagne mise à jour avec succès', 'success');
      } else {
        await api.post('/campagnes', dataToSend);
        showSnackbar('Campagne créée avec succès', 'success');
      }

      handleCloseDialog();
      fetchCampaigns();
    } catch (error) {
      console.error('Error saving campaign:', error);
      showSnackbar('Erreur lors de la sauvegarde de la campagne', 'error');
    }
  };

  const handleUpdateResults = async (e) => {
    e.preventDefault();

    try {
      const dataToSend = {
        amesGagnees: resultsData.amesGagnees ? parseInt(resultsData.amesGagnees) : 0,
        tractsDistribues: resultsData.tractsDistribues ? parseInt(resultsData.tractsDistribues) : 0,
        participantsPresents: resultsData.participantsPresents ? parseInt(resultsData.participantsPresents) : 0
      };

      await api.put(`/campagnes/${selectedCampaign._id}/resultats`, dataToSend);
      showSnackbar('Résultats mis à jour avec succès', 'success');
      handleCloseResultsDialog();
      fetchCampaigns();
    } catch (error) {
      console.error('Error updating results:', error);
      showSnackbar('Erreur lors de la mise à jour des résultats', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/campagnes/${selectedCampaign._id}`);
      showSnackbar('Campagne supprimée avec succès', 'success');
      handleCloseDeleteDialog();
      fetchCampaigns();
    } catch (error) {
      console.error('Error deleting campaign:', error);
      showSnackbar('Erreur lors de la suppression de la campagne', 'error');
    }
  };

  const getStatistics = () => {
    const total = campaigns.length;
    const active = campaigns.filter(c => c.statut === 'En cours').length;
    const completed = campaigns.filter(c => c.statut === 'Terminée').length;
    const totalSouls = campaigns.reduce((sum, c) => sum + (c.resultats?.amesGagnees || 0), 0);

    return { total, active, completed, totalSouls };
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.lieu?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.type?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.statut === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = getStatistics();

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#0047AB' }}>
          Campagnes d'Évangélisation
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            bgcolor: '#0047AB',
            '&:hover': { bgcolor: '#003380' }
          }}
        >
          Nouvelle Campagne
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#0047AB', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {stats.total}
                  </Typography>
                  <Typography variant="body2">
                    Total Campagnes
                  </Typography>
                </Box>
                <EventIcon sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#2e7d32', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {stats.active}
                  </Typography>
                  <Typography variant="body2">
                    En Cours
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#ed6c02', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {stats.completed}
                  </Typography>
                  <Typography variant="body2">
                    Terminées
                  </Typography>
                </Box>
                <AssessmentIcon sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#1976d2', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {stats.totalSouls}
                  </Typography>
                  <Typography variant="body2">
                    Âmes Sauvées
                  </Typography>
                </Box>
                <PeopleIcon sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Rechercher une campagne..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Filtrer par statut</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Filtrer par statut"
              >
                <MenuItem value="all">Tous les statuts</MenuItem>
                <MenuItem value="Planifiée">Planifiée</MenuItem>
                <MenuItem value="En cours">En cours</MenuItem>
                <MenuItem value="Terminée">Terminée</MenuItem>
                <MenuItem value="Annulée">Annulée</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Campaigns Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Titre</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Lieu</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Date Début</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Date Fin</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Statut</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Résultats</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCampaigns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    Aucune campagne trouvée
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredCampaigns.map((campaign) => (
                <TableRow key={campaign._id} hover>
                  <TableCell>{campaign.titre}</TableCell>
                  <TableCell>{campaign.type}</TableCell>
                  <TableCell>{campaign.lieu}</TableCell>
                  <TableCell>{formatDate(campaign.dateDebut)}</TableCell>
                  <TableCell>{formatDate(campaign.dateFin)}</TableCell>
                  <TableCell>
                    <Chip
                      label={campaign.statut}
                      color={STATUS_COLORS[campaign.statut]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="caption" display="block">
                        Tracts distribués: {campaign.resultats?.tractsDistribues || 0}
                      </Typography>
                      <Typography variant="caption" display="block">
                        Participants: {campaign.resultats?.participantsPresents || 0}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenResultsDialog(campaign)}
                      title="Voir résultats"
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(campaign)}
                      title="Modifier"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDeleteDialog(campaign)}
                      title="Supprimer"
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create/Edit Campaign Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedCampaign ? 'Modifier la Campagne' : 'Nouvelle Campagne'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Titre"
                  name="titre"
                  value={formData.titre}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={3}
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Type</InputLabel>
                  <Select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    label="Type"
                  >
                    {CAMPAIGN_TYPES.map((type) => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Lieu"
                  name="lieu"
                  value={formData.lieu}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date Début"
                  name="dateDebut"
                  type="date"
                  value={formData.dateDebut}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date Fin"
                  name="dateFin"
                  type="date"
                  value={formData.dateFin}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Statut</InputLabel>
                  <Select
                    name="statut"
                    value={formData.statut}
                    onChange={handleInputChange}
                    label="Statut"
                  >
                    {Object.values(CAMPAIGN_STATUS).map((status) => (
                      <MenuItem key={status} value={status}>{status}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 1, mb: 1 }}>
                  Objectifs
                </Typography>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Nombre d'âmes"
                  name="objectifs.nombreAmes"
                  type="number"
                  value={formData.objectifs.nombreAmes}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Nombre de tracts"
                  name="objectifs.nombreTracts"
                  type="number"
                  value={formData.objectifs.nombreTracts}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Nombre de participants"
                  name="objectifs.nombreParticipants"
                  type="number"
                  value={formData.objectifs.nombreParticipants}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 1, mb: 1 }}>
                  Budget
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Budget prévu"
                  name="budget.prevu"
                  type="number"
                  value={formData.budget.prevu}
                  onChange={handleInputChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">FCFA</InputAdornment>,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Budget dépensé"
                  name="budget.depense"
                  type="number"
                  value={formData.budget.depense}
                  onChange={handleInputChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">FCFA</InputAdornment>,
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 1, mb: 1 }}>
                  Logistique
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.logistique.sono}
                      onChange={(e) => setFormData({
                        ...formData,
                        logistique: { ...formData.logistique, sono: e.target.checked }
                      })}
                    />
                  }
                  label="Sono (Sound System)"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.logistique.generateur}
                      onChange={(e) => setFormData({
                        ...formData,
                        logistique: { ...formData.logistique, generateur: e.target.checked }
                      })}
                    />
                  }
                  label="Générateur"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.logistique.eclairage}
                      onChange={(e) => setFormData({
                        ...formData,
                        logistique: { ...formData.logistique, eclairage: e.target.checked }
                      })}
                    />
                  }
                  label="Éclairage"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.logistique.materielAudiovisuel}
                      onChange={(e) => setFormData({
                        ...formData,
                        logistique: { ...formData.logistique, materielAudiovisuel: e.target.checked }
                      })}
                    />
                  }
                  label="Matériel Audiovisuel"
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Nombre de chaises"
                  name="logistique.chaises"
                  type="number"
                  value={formData.logistique.chaises}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Nombre de tentes"
                  name="logistique.tentes"
                  type="number"
                  value={formData.logistique.tentes}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Nombre de véhicules"
                  name="logistique.vehicules"
                  type="number"
                  value={formData.logistique.vehicules}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Autres équipements"
                  name="logistique.autres"
                  value={formData.logistique.autres}
                  onChange={handleInputChange}
                  placeholder="Spécifiez d'autres équipements nécessaires..."
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Annuler</Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                bgcolor: '#0047AB',
                '&:hover': { bgcolor: '#003380' }
              }}
            >
              {selectedCampaign ? 'Mettre à jour' : 'Créer'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Update Results Dialog */}
      <Dialog open={openResultsDialog} onClose={handleCloseResultsDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Mettre à jour les résultats
        </DialogTitle>
        <form onSubmit={handleUpdateResults}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                  {selectedCampaign?.titre}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tracts distribués"
                  name="tractsDistribues"
                  type="number"
                  value={resultsData.tractsDistribues}
                  onChange={handleResultsInputChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Participants présents"
                  name="participantsPresents"
                  type="number"
                  value={resultsData.participantsPresents}
                  onChange={handleResultsInputChange}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseResultsDialog}>Annuler</Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                bgcolor: '#2e7d32',
                '&:hover': { bgcolor: '#1b5e20' }
              }}
            >
              Mettre à jour
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer la campagne "{selectedCampaign?.titre}" ?
            Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Annuler</Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Campagnes;

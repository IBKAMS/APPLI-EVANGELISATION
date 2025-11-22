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
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Divider,
  LinearProgress,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  School as SchoolIcon,
  Water as WaterIcon,
  Event as EventIcon,
  Person as PersonIcon,
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Group as GroupIcon
} from '@mui/icons-material';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const STATUT_SPIRITUEL = [
  'Non-croyant',
  'Non-converti',
  'Intéressé',
  'Nouveau converti',
  'Converti non baptisé',
  'Baptisé',
  'Chrétien pratiquant',
  'Membre actif',
  'Chrétien rétrograde',
  'Musulman',
  'Animiste',
  'Bouddhiste',
  'Autre religion'
];

const TYPE_RENCONTRE = [
  'Porte-à-porte',
  'Rue',
  'Marché',
  'Transport',
  'Lieu de travail',
  'École/Université',
  'Hôpital',
  'Événement église',
  'Événement public',
  'Campagne d\'évangélisation',
  'Croisade',
  'Cellule de maison',
  'Réseau social',
  'Appel téléphonique',
  'Référence',
  'Famille',
  'Ami',
  'Voisin',
  'Invité au culte',
  'Soi-même au culte',
  'Autre'
];

const STATUT_COLORS = {
  'Actif': 'success',
  'À relancer': 'warning',
  'Inactif': 'error',
  'Transféré': 'default'
};

const PROGRAMMES_PRESENCE = [
  'Culte dominical',
  'École du dimanche',
  'Prière',
  'Cellule',
  'Séminaire',
  'Autre'
];

const SuiviAmes = () => {
  const { user } = useAuth();
  const [ames, setAmes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statutFilter, setStatutFilter] = useState('all');
  const [spiritualFilter, setSpiritualFilter] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openSuiviDialog, setOpenSuiviDialog] = useState(false);
  const [openPresenceDialog, setOpenPresenceDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedAme, setSelectedAme] = useState(null);
  const [detailsTab, setDetailsTab] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [stats, setStats] = useState({
    total: 0,
    nouveauxConvertis: 0,
    baptises: 0,
    enFormation: 0,
    aRelancer: 0
  });

  // Vérifier si l'utilisateur est KAMISSOKO IDRISS
  const canDelete = user?.telephone === '0708676604';

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    adresse: '',
    commune: '',
    ville: 'Abidjan',
    age: '',
    sexe: '',
    situationMatrimoniale: '',
    nombreEnfants: 0,
    profession: '',
    statutSpirituel: 'Non-converti',
    dateConversion: '',
    dateBapteme: '',
    ancienneEglise: '',
    typeRencontre: '',
    lieuRencontre: '',
    nomInviteur: '',
    dateRencontre: new Date().toISOString().split('T')[0],
    notes: '',
    statut: 'Actif'
  });

  const [suiviFormData, setSuiviFormData] = useState({
    type: 'Appel',
    notes: '',
    prochaineSuivi: ''
  });

  const [presenceFormData, setPresenceFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    programme: 'Culte dominical',
    present: true
  });

  useEffect(() => {
    fetchAmes();
  }, []);

  const fetchAmes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/ames');
      setAmes(response.data.data || []);
      calculateStats(response.data.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des âmes:', error);
      showSnackbar('Erreur lors du chargement des âmes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (amesData) => {
    const stats = {
      total: amesData.length,
      nouveauxConvertis: amesData.filter(a => a.statutSpirituel === 'Nouveau converti').length,
      baptises: amesData.filter(a => a.statutSpirituel === 'Baptisé' || a.dateBapteme).length,
      enFormation: amesData.filter(a => a.parcoursFormation && a.parcoursFormation.length > 0).length,
      aRelancer: amesData.filter(a => a.statut === 'À relancer').length
    };
    setStats(stats);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSuiviInputChange = (e) => {
    const { name, value } = e.target;
    setSuiviFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePresenceInputChange = (e) => {
    const { name, value, checked } = e.target;
    setPresenceFormData(prev => ({
      ...prev,
      [name]: name === 'present' ? checked : value
    }));
  };

  const handleOpenDialog = (ame = null) => {
    if (ame) {
      setSelectedAme(ame);
      setFormData({
        nom: ame.nom,
        prenom: ame.prenom,
        telephone: ame.telephone,
        email: ame.email || '',
        adresse: ame.adresse || '',
        commune: ame.commune || '',
        ville: ame.ville || 'Abidjan',
        age: ame.age || '',
        sexe: ame.sexe || '',
        situationMatrimoniale: ame.situationMatrimoniale || '',
        nombreEnfants: ame.nombreEnfants || 0,
        profession: ame.profession || '',
        statutSpirituel: ame.statutSpirituel,
        dateConversion: ame.dateConversion ? new Date(ame.dateConversion).toISOString().split('T')[0] : '',
        dateBapteme: ame.dateBapteme ? new Date(ame.dateBapteme).toISOString().split('T')[0] : '',
        ancienneEglise: ame.ancienneEglise || '',
        typeRencontre: ame.typeRencontre,
        lieuRencontre: ame.lieuRencontre || '',
        nomInviteur: ame.nomInviteur || '',
        dateRencontre: ame.dateRencontre ? new Date(ame.dateRencontre).toISOString().split('T')[0] : '',
        notes: ame.notes || '',
        statut: ame.statut
      });
    } else {
      setSelectedAme(null);
      setFormData({
        nom: '',
        prenom: '',
        telephone: '',
        email: '',
        adresse: '',
        commune: '',
        ville: 'Abidjan',
        age: '',
        sexe: '',
        situationMatrimoniale: '',
        nombreEnfants: 0,
        profession: '',
        statutSpirituel: 'Non-converti',
        dateConversion: '',
        dateBapteme: '',
        ancienneEglise: '',
        typeRencontre: '',
        lieuRencontre: '',
        nomInviteur: '',
        dateRencontre: new Date().toISOString().split('T')[0],
        notes: '',
        statut: 'Actif'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAme(null);
  };

  const handleSubmit = async () => {
    try {
      if (selectedAme) {
        await api.put(`/ames/${selectedAme._id}`, formData);
        showSnackbar('Âme mise à jour avec succès', 'success');
      } else {
        await api.post('/ames', formData);
        showSnackbar('Âme ajoutée avec succès', 'success');
      }
      handleCloseDialog();
      fetchAmes();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      showSnackbar(error.response?.data?.message || 'Erreur lors de l\'enregistrement', 'error');
    }
  };

  const handleOpenDetails = async (ame) => {
    try {
      const response = await api.get(`/ames/${ame._id}`);
      setSelectedAme(response.data.data);
      setOpenDetailsDialog(true);
      setDetailsTab(0);
    } catch (error) {
      console.error('Erreur lors du chargement des détails:', error);
      showSnackbar('Erreur lors du chargement des détails', 'error');
    }
  };

  const handleOpenSuivi = (ame) => {
    setSelectedAme(ame);
    setSuiviFormData({
      type: 'Appel',
      notes: '',
      prochaineSuivi: ''
    });
    setOpenSuiviDialog(true);
  };

  const handleAddSuivi = async () => {
    try {
      await api.post(`/ames/${selectedAme._id}/suivis`, suiviFormData);
      showSnackbar('Suivi ajouté avec succès', 'success');
      setOpenSuiviDialog(false);
      fetchAmes();
      if (openDetailsDialog) {
        const response = await api.get(`/ames/${selectedAme._id}`);
        setSelectedAme(response.data.data);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du suivi:', error);
      showSnackbar('Erreur lors de l\'ajout du suivi', 'error');
    }
  };

  const handleOpenPresence = (ame) => {
    setSelectedAme(ame);
    setPresenceFormData({
      date: new Date().toISOString().split('T')[0],
      programme: 'Culte dominical',
      present: true
    });
    setOpenPresenceDialog(true);
  };

  const handleAddPresence = async () => {
    try {
      await api.post(`/ames/${selectedAme._id}/presences`, presenceFormData);
      showSnackbar('Présence enregistrée avec succès', 'success');
      setOpenPresenceDialog(false);
      fetchAmes();
      if (openDetailsDialog) {
        const response = await api.get(`/ames/${selectedAme._id}`);
        setSelectedAme(response.data.data);
      }
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la présence:', error);
      showSnackbar('Erreur lors de l\'enregistrement de la présence', 'error');
    }
  };

  const handleOpenDeleteDialog = (ame) => {
    setSelectedAme(ame);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedAme(null);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/ames/${selectedAme._id}`);
      showSnackbar('Âme supprimée avec succès', 'success');
      handleCloseDeleteDialog();
      fetchAmes();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      showSnackbar(error.response?.data?.message || 'Erreur lors de la suppression', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR');
  };

  const filteredAmes = ames.filter(ame => {
    const matchesSearch = searchTerm === '' ||
      ame.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ame.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ame.telephone.includes(searchTerm);

    const matchesStatut = statutFilter === 'all' || ame.statut === statutFilter;
    const matchesSpiritual = spiritualFilter === 'all' || ame.statutSpirituel === spiritualFilter;

    return matchesSearch && matchesStatut && matchesSpiritual;
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Suivi des Âmes
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nouvelle Âme
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" variant="caption">
                    Total Âmes
                  </Typography>
                  <Typography variant="h4">
                    {stats.total}
                  </Typography>
                </Box>
                <GroupIcon color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" variant="caption">
                    Nouveaux Convertis
                  </Typography>
                  <Typography variant="h4">
                    {stats.nouveauxConvertis}
                  </Typography>
                </Box>
                <PersonIcon color="success" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" variant="caption">
                    Baptisés
                  </Typography>
                  <Typography variant="h4">
                    {stats.baptises}
                  </Typography>
                </Box>
                <WaterIcon color="info" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" variant="caption">
                    En Formation
                  </Typography>
                  <Typography variant="h4">
                    {stats.enFormation}
                  </Typography>
                </Box>
                <SchoolIcon color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" variant="caption">
                    À Relancer
                  </Typography>
                  <Typography variant="h4">
                    {stats.aRelancer}
                  </Typography>
                </Box>
                <ScheduleIcon color="warning" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Rechercher (nom, prénom, téléphone)..."
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
          <Grid item xs={12} md={4}>
            <Tooltip title="État du suivi de la personne : Actif (suivi régulier), À relancer (nécessite relance), Inactif (plus de contact), Transféré (vers autre église)" placement="top">
              <FormControl fullWidth size="small">
                <InputLabel>Statut</InputLabel>
                <Select
                  value={statutFilter}
                  label="Statut"
                  onChange={(e) => setStatutFilter(e.target.value)}
                >
                  <MenuItem value="all">Tous</MenuItem>
                  <MenuItem value="Actif">Actif</MenuItem>
                  <MenuItem value="À relancer">À relancer</MenuItem>
                  <MenuItem value="Inactif">Inactif</MenuItem>
                  <MenuItem value="Transféré">Transféré</MenuItem>
                </Select>
              </FormControl>
            </Tooltip>
          </Grid>
          <Grid item xs={12} md={4}>
            <Tooltip title="Niveau spirituel de la personne : depuis Non-croyant/Non-converti jusqu'à Membre actif, incluant les différentes étapes du cheminement spirituel" placement="top">
              <FormControl fullWidth size="small">
                <InputLabel>Statut Spirituel</InputLabel>
                <Select
                  value={spiritualFilter}
                  label="Statut Spirituel"
                  onChange={(e) => setSpiritualFilter(e.target.value)}
                >
                  <MenuItem value="all">Tous</MenuItem>
                  {STATUT_SPIRITUEL.map(statut => (
                    <MenuItem key={statut} value={statut}>{statut}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Tooltip>
          </Grid>
        </Grid>
      </Paper>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom & Prénom</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Lieu</TableCell>
              <Tooltip title="Niveau spirituel : étape du cheminement spirituel de la personne (Non-croyant, Intéressé, Nouveau converti, Baptisé, Membre actif, etc.)" placement="top">
                <TableCell>Statut Spirituel</TableCell>
              </Tooltip>
              <TableCell>Date Rencontre</TableCell>
              <Tooltip title="État du suivi : Actif (contact régulier), À relancer (nécessite relance), Inactif (plus de contact), Transféré (autre église)" placement="top">
                <TableCell>Statut</TableCell>
              </Tooltip>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAmes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2" color="textSecondary">
                    Aucune âme trouvée
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredAmes.map((ame) => (
                <TableRow key={ame._id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {ame.nom === '-' ? ame.prenom : `${ame.nom} ${ame.prenom}`}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="caption" display="flex" alignItems="center">
                        <PhoneIcon fontSize="small" sx={{ mr: 0.5 }} />
                        {ame.telephone}
                      </Typography>
                      {ame.email && (
                        <Typography variant="caption" display="flex" alignItems="center">
                          <EmailIcon fontSize="small" sx={{ mr: 0.5 }} />
                          {ame.email}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" display="block">
                      {ame.commune || '-'}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {ame.ville || 'Abidjan'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={ame.statutSpirituel}
                      size="small"
                      color={
                        ame.statutSpirituel === 'Baptisé' || ame.statutSpirituel === 'Membre actif' ? 'success' :
                        ame.statutSpirituel === 'Nouveau converti' ? 'info' :
                        'default'
                      }
                    />
                  </TableCell>
                  <TableCell>
                    {formatDate(ame.dateRencontre)}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={ame.statut}
                      size="small"
                      color={STATUT_COLORS[ame.statut]}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleOpenDetails(ame)}
                      title="Voir détails"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleOpenDialog(ame)}
                      title="Modifier"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="success"
                      onClick={() => handleOpenSuivi(ame)}
                      title="Ajouter suivi"
                    >
                      <PhoneIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="info"
                      onClick={() => handleOpenPresence(ame)}
                      title="Enregistrer présence"
                    >
                      <CheckCircleIcon />
                    </IconButton>
                    {canDelete && (
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleOpenDeleteDialog(ame)}
                        title="Supprimer (réservé à KAMISSOKO IDRISS)"
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog Add/Edit Ame */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedAme ? 'Modifier l\'Âme' : 'Nouvelle Âme'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Nom"
                name="nom"
                value={formData.nom}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Prénom"
                name="prenom"
                value={formData.prenom}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Téléphone"
                name="telephone"
                value={formData.telephone}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Adresse"
                name="adresse"
                value={formData.adresse}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Commune"
                name="commune"
                value={formData.commune}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ville"
                name="ville"
                value={formData.ville}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Âge"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Sexe</InputLabel>
                <Select
                  name="sexe"
                  value={formData.sexe}
                  label="Sexe"
                  onChange={handleInputChange}
                >
                  <MenuItem value="">-</MenuItem>
                  <MenuItem value="Homme">Homme</MenuItem>
                  <MenuItem value="Femme">Femme</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Situation Matrimoniale</InputLabel>
                <Select
                  name="situationMatrimoniale"
                  value={formData.situationMatrimoniale}
                  label="Situation Matrimoniale"
                  onChange={handleInputChange}
                >
                  <MenuItem value="">-</MenuItem>
                  <MenuItem value="Célibataire">Célibataire</MenuItem>
                  <MenuItem value="Marié(e)">Marié(e)</MenuItem>
                  <MenuItem value="Divorcé(e)">Divorcé(e)</MenuItem>
                  <MenuItem value="Veuf(ve)">Veuf(ve)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Profession"
                name="profession"
                value={formData.profession}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre d'enfants"
                name="nombreEnfants"
                type="number"
                value={formData.nombreEnfants}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Statut Spirituel</InputLabel>
                <Select
                  name="statutSpirituel"
                  value={formData.statutSpirituel}
                  label="Statut Spirituel"
                  onChange={handleInputChange}
                >
                  {STATUT_SPIRITUEL.map(statut => (
                    <MenuItem key={statut} value={statut}>{statut}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Type de Rencontre</InputLabel>
                <Select
                  name="typeRencontre"
                  value={formData.typeRencontre}
                  label="Type de Rencontre"
                  onChange={handleInputChange}
                >
                  {TYPE_RENCONTRE.map(type => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Date de Conversion"
                name="dateConversion"
                type="date"
                value={formData.dateConversion}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Date de Baptême"
                name="dateBapteme"
                type="date"
                value={formData.dateBapteme}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Lieu de Rencontre"
                name="lieuRencontre"
                value={formData.lieuRencontre}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nom de l'Inviteur"
                name="nomInviteur"
                value={formData.nomInviteur}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Date de Rencontre"
                name="dateRencontre"
                type="date"
                value={formData.dateRencontre}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ancienne Église"
                name="ancienneEglise"
                value={formData.ancienneEglise}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Statut</InputLabel>
                <Select
                  name="statut"
                  value={formData.statut}
                  label="Statut"
                  onChange={handleInputChange}
                >
                  <MenuItem value="Actif">Actif</MenuItem>
                  <MenuItem value="À relancer">À relancer</MenuItem>
                  <MenuItem value="Inactif">Inactif</MenuItem>
                  <MenuItem value="Transféré">Transféré</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                name="notes"
                multiline
                rows={3}
                value={formData.notes}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={!formData.nom || !formData.prenom || !formData.telephone || !formData.typeRencontre}
          >
            {selectedAme ? 'Mettre à jour' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Details */}
      <Dialog open={openDetailsDialog} onClose={() => setOpenDetailsDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Détails de {selectedAme?.nom} {selectedAme?.prenom}
        </DialogTitle>
        <DialogContent>
          <Tabs value={detailsTab} onChange={(e, newValue) => setDetailsTab(newValue)}>
            <Tab label="Informations" />
            <Tab label="Suivis" />
            <Tab label="Formation" />
            <Tab label="Présences" />
          </Tabs>

          {/* Tab Informations */}
          {detailsTab === 0 && selectedAme && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" color="textSecondary">Nom complet</Typography>
                  <Typography variant="body1">{selectedAme.nom} {selectedAme.prenom}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" color="textSecondary">Téléphone</Typography>
                  <Typography variant="body1">{selectedAme.telephone}</Typography>
                </Grid>
                {selectedAme.email && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="textSecondary">Email</Typography>
                    <Typography variant="body1">{selectedAme.email}</Typography>
                  </Grid>
                )}
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" color="textSecondary">Adresse</Typography>
                  <Typography variant="body1">
                    {selectedAme.adresse || '-'}<br />
                    {selectedAme.commune && `${selectedAme.commune}, `}{selectedAme.ville}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" color="textSecondary">Statut Spirituel</Typography>
                  <Typography variant="body1">
                    <Chip label={selectedAme.statutSpirituel} size="small" />
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" color="textSecondary">Date de Conversion</Typography>
                  <Typography variant="body1">{formatDate(selectedAme.dateConversion)}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" color="textSecondary">Date de Baptême</Typography>
                  <Typography variant="body1">{formatDate(selectedAme.dateBapteme)}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" color="textSecondary">Type de Rencontre</Typography>
                  <Typography variant="body1">{selectedAme.typeRencontre}</Typography>
                </Grid>
                {selectedAme.notes && (
                  <Grid item xs={12}>
                    <Typography variant="caption" color="textSecondary">Notes</Typography>
                    <Typography variant="body1">{selectedAme.notes}</Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}

          {/* Tab Suivis */}
          {detailsTab === 1 && selectedAme && (
            <Box sx={{ mt: 2 }}>
              {selectedAme.suivis && selectedAme.suivis.length > 0 ? (
                <List>
                  {selectedAme.suivis.map((suivi, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemText
                          primary={
                            <Box display="flex" justifyContent="space-between">
                              <Chip label={suivi.type} size="small" color="primary" />
                              <Typography variant="caption">{formatDate(suivi.date)}</Typography>
                            </Box>
                          }
                          secondary={suivi.notes}
                        />
                      </ListItem>
                      {index < selectedAme.suivis.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="textSecondary" align="center">
                  Aucun suivi enregistré
                </Typography>
              )}
            </Box>
          )}

          {/* Tab Formation */}
          {detailsTab === 2 && selectedAme && (
            <Box sx={{ mt: 2 }}>
              {selectedAme.parcoursFormation && selectedAme.parcoursFormation.length > 0 ? (
                <List>
                  {selectedAme.parcoursFormation.map((formation, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemText
                          primary={
                            <Box>
                              <Typography variant="body2">
                                Formation {index + 1} - {formation.statut}
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={formation.progression}
                                sx={{ mt: 1 }}
                              />
                              <Typography variant="caption" color="textSecondary">
                                Progression: {formation.progression}%
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <>
                              Début: {formatDate(formation.dateDebut)}
                              {formation.dateFin && ` - Fin: ${formatDate(formation.dateFin)}`}
                            </>
                          }
                        />
                      </ListItem>
                      {index < selectedAme.parcoursFormation.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="textSecondary" align="center">
                  Aucune formation enregistrée
                </Typography>
              )}
            </Box>
          )}

          {/* Tab Présences */}
          {detailsTab === 3 && selectedAme && (
            <Box sx={{ mt: 2 }}>
              {selectedAme.presences && selectedAme.presences.length > 0 ? (
                <List>
                  {selectedAme.presences.slice(0, 10).map((presence, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemText
                          primary={
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                              <Typography variant="body2">{presence.programme}</Typography>
                              <Chip
                                label={presence.present ? 'Présent' : 'Absent'}
                                size="small"
                                color={presence.present ? 'success' : 'default'}
                              />
                            </Box>
                          }
                          secondary={formatDate(presence.date)}
                        />
                      </ListItem>
                      {index < Math.min(selectedAme.presences.length, 10) - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                  {selectedAme.presences.length > 10 && (
                    <ListItem>
                      <ListItemText
                        secondary={`... et ${selectedAme.presences.length - 10} autres présences`}
                        sx={{ textAlign: 'center' }}
                      />
                    </ListItem>
                  )}
                </List>
              ) : (
                <Typography variant="body2" color="textSecondary" align="center">
                  Aucune présence enregistrée
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailsDialog(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Add Suivi */}
      <Dialog open={openSuiviDialog} onClose={() => setOpenSuiviDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Ajouter un Suivi - {selectedAme?.nom} {selectedAme?.prenom}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Type de Suivi</InputLabel>
                <Select
                  name="type"
                  value={suiviFormData.type}
                  label="Type de Suivi"
                  onChange={handleSuiviInputChange}
                >
                  <MenuItem value="Appel">Appel</MenuItem>
                  <MenuItem value="Visite">Visite</MenuItem>
                  <MenuItem value="SMS">SMS</MenuItem>
                  <MenuItem value="Email">Email</MenuItem>
                  <MenuItem value="WhatsApp">WhatsApp</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                name="notes"
                multiline
                rows={4}
                value={suiviFormData.notes}
                onChange={handleSuiviInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Prochain Suivi"
                name="prochaineSuivi"
                type="date"
                value={suiviFormData.prochaineSuivi}
                onChange={handleSuiviInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSuiviDialog(false)}>Annuler</Button>
          <Button onClick={handleAddSuivi} variant="contained" color="primary">
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Add Presence */}
      <Dialog open={openPresenceDialog} onClose={() => setOpenPresenceDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Enregistrer une Présence - {selectedAme?.nom} {selectedAme?.prenom}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Date"
                name="date"
                type="date"
                value={presenceFormData.date}
                onChange={handlePresenceInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Programme</InputLabel>
                <Select
                  name="programme"
                  value={presenceFormData.programme}
                  label="Programme"
                  onChange={handlePresenceInputChange}
                >
                  {PROGRAMMES_PRESENCE.map(prog => (
                    <MenuItem key={prog} value={prog}>{prog}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPresenceDialog(false)}>Annuler</Button>
          <Button onClick={handleAddPresence} variant="contained" color="primary">
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Delete Confirmation */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Confirmer la suppression
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Êtes-vous sûr de vouloir supprimer définitivement cette âme ?
          </Typography>
          {selectedAme && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
              <Typography variant="body2" fontWeight="bold" color="error.dark">
                {selectedAme.nom} {selectedAme.prenom}
              </Typography>
              <Typography variant="caption" display="block" color="error.dark">
                Téléphone : {selectedAme.telephone}
              </Typography>
              <Typography variant="caption" display="block" color="error.dark">
                Statut : {selectedAme.statutSpirituel}
              </Typography>
            </Box>
          )}
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            ⚠️ Cette action est irréversible. Toutes les données associées (suivis, présences, formations) seront également supprimées.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="inherit">
            Annuler
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
          >
            Supprimer définitivement
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
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

export default SuiviAmes;

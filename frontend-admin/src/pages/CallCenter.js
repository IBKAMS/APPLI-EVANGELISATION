import React, { useState, useEffect } from 'react';
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
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Phone,
  PhoneDisabled,
  PhoneMissed,
  CheckCircle,
  Cancel,
  EventAvailable,
  Settings,
  Add,
  Delete,
  Edit as EditIcon,
  MenuBook
} from '@mui/icons-material';
import api from '../services/api';

const CallCenter = () => {
  const [ames, setAmes] = useState([]);
  const [amesFiltered, setAmesFiltered] = useState([]);
  const [stats, setStats] = useState({ totalAppels: 0, appelsDuJour: 0, stats: [] });
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAme, setSelectedAme] = useState(null);
  const [filtreAgent, setFiltreAgent] = useState('Tous');
  const [appelData, setAppelData] = useState({
    statutAppel: '',
    notes: '',
    dureeAppel: 0,
    prochainAppel: '',
    priorite: 'Moyenne'
  });
  const [agents, setAgents] = useState(['Ornella', 'Octavie', 'Leila', 'Léa']);
  const [openGestionAgents, setOpenGestionAgents] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');
  const [editingAgent, setEditingAgent] = useState(null);
  const [newAgentNameEdit, setNewAgentNameEdit] = useState('');
  const [openGuideEntretien, setOpenGuideEntretien] = useState(false);

  useEffect(() => {
    fetchAmesAAppeler();
    fetchStats();
  }, []);

  useEffect(() => {
    if (filtreAgent === 'Tous') {
      setAmesFiltered(ames);
      fetchStats(); // Stats globales
    } else if (filtreAgent === 'Non assigné') {
      setAmesFiltered(ames.filter(ame => !ame.agentCallCenter || ame.agentCallCenter === ''));
      calculateAgentStats('Non assigné');
    } else {
      setAmesFiltered(ames.filter(ame => ame.agentCallCenter === filtreAgent));
      calculateAgentStats(filtreAgent);
    }
  }, [ames, filtreAgent]);

  const fetchAmesAAppeler = async () => {
    try {
      setLoading(true);
      const response = await api.get('/appels/ames-a-appeler');
      setAmes(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des âmes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/appels/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
    }
  };

  const calculateAgentStats = (agent) => {
    // Filtrer les âmes de l'agent
    let amesAgent;
    if (agent === 'Non assigné') {
      amesAgent = ames.filter(ame => !ame.agentCallCenter || ame.agentCallCenter === '');
    } else {
      amesAgent = ames.filter(ame => ame.agentCallCenter === agent);
    }

    // Calculer le nombre total d'appels de cet agent
    const totalAppels = amesAgent.reduce((sum, ame) => sum + (ame.nombreAppels || 0), 0);

    // Calculer les appels du jour (aujourd'hui)
    const today = new Date().setHours(0, 0, 0, 0);
    const appelsDuJour = amesAgent.filter(ame =>
      ame.dernierAppel && new Date(ame.dernierAppel.dateAppel).setHours(0, 0, 0, 0) === today
    ).length;

    // Compter les statistiques par statut
    const statsParStatut = {};
    amesAgent.forEach(ame => {
      if (ame.dernierAppel && ame.dernierAppel.statutAppel) {
        const statut = ame.dernierAppel.statutAppel;
        if (!statsParStatut[statut]) {
          statsParStatut[statut] = 0;
        }
        statsParStatut[statut]++;
      }
    });

    // Convertir en format attendu
    const statsArray = Object.keys(statsParStatut).map(key => ({
      _id: key,
      count: statsParStatut[key]
    }));

    setStats({
      totalAppels,
      appelsDuJour,
      stats: statsArray
    });
  };

  const handleOpenDialog = (ame) => {
    setSelectedAme(ame);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAme(null);
    setAppelData({
      statutAppel: '',
      notes: '',
      dureeAppel: 0,
      prochainAppel: '',
      priorite: 'Moyenne'
    });
  };

  const handleSaveAppel = async () => {
    try {
      await api.post('/appels', {
        ame: selectedAme._id,
        ...appelData
      });

      handleCloseDialog();
      fetchAmesAAppeler();
      fetchStats();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de l\'appel:', error);
    }
  };

  const handleAssignAgent = async (ameId, agentCallCenter) => {
    try {
      await api.patch(`/ames/${ameId}/assign-agent`, { agentCallCenter });
      fetchAmesAAppeler();
    } catch (error) {
      console.error('Erreur lors de l\'assignation de l\'agent:', error);
    }
  };

  const getStatutColor = (statut) => {
    const colors = {
      'Indisponible': '#FF9800', // Orange
      'Injoignable': '#F44336', // Rouge
      'Intéressé': '#4CAF50', // Vert
      'Pas intéressé': '#9E9E9E', // Gris
      'Rendez-vous pris': '#2196F3', // Bleu
      'À rappeler': '#FFC107' // Amber
    };
    return colors[statut] || '#757575';
  };

  const getStatutIcon = (statut) => {
    switch(statut) {
      case 'Indisponible':
        return <PhoneMissed />;
      case 'Injoignable':
        return <PhoneDisabled />;
      case 'Intéressé':
        return <CheckCircle />;
      case 'Pas intéressé':
        return <Cancel />;
      case 'Rendez-vous pris':
        return <EventAvailable />;
      default:
        return <Phone />;
    }
  };

  const handleAddAgent = () => {
    if (newAgentName.trim() && !agents.includes(newAgentName.trim())) {
      setAgents([...agents, newAgentName.trim()]);
      setNewAgentName('');
    }
  };

  const handleDeleteAgent = (agentName) => {
    // Réassigner les âmes de cet agent à "Non assigné"
    ames.forEach(ame => {
      if (ame.agentCallCenter === agentName) {
        handleAssignAgent(ame._id, '');
      }
    });
    setAgents(agents.filter(a => a !== agentName));
    if (filtreAgent === agentName) {
      setFiltreAgent('Tous');
    }
  };

  const handleEditAgent = (oldName, newName) => {
    if (newName.trim() && newName !== oldName) {
      // Mettre à jour le nom de l'agent dans la liste
      setAgents(agents.map(a => a === oldName ? newName.trim() : a));

      // Mettre à jour les affectations d'âmes
      ames.forEach(ame => {
        if (ame.agentCallCenter === oldName) {
          handleAssignAgent(ame._id, newName.trim());
        }
      });

      // Mettre à jour le filtre si nécessaire
      if (filtreAgent === oldName) {
        setFiltreAgent(newName.trim());
      }

      setEditingAgent(null);
      setNewAgentNameEdit('');
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4">
            📞 Call Center - Suivi des Appels
            {filtreAgent !== 'Tous' && (
              <Typography component="span" variant="h5" sx={{ ml: 2, color: '#0047AB' }}>
                ({filtreAgent})
              </Typography>
            )}
          </Typography>
          <Button
            variant="contained"
            startIcon={<MenuBook />}
            onClick={() => setOpenGuideEntretien(true)}
            sx={{
              bgcolor: '#4CAF50',
              '&:hover': { bgcolor: '#45a049' },
              fontWeight: 'bold',
              px: 3
            }}
          >
            Guide d'Entretien Téléphonique
          </Button>
        </Box>

        {/* Statistiques */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <Card sx={{ bgcolor: '#0047AB', color: 'white' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontSize: '1rem' }}>Total Appels</Typography>
                <Typography variant="h3">{stats.totalAppels}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <Card sx={{ bgcolor: '#4CAF50', color: 'white' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontSize: '1rem' }}>Appels du Jour</Typography>
                <Typography variant="h3">{stats.appelsDuJour}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <Card sx={{ bgcolor: '#FFA500', color: 'white' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontSize: '1rem' }}>Âmes à Appeler</Typography>
                <Typography variant="h3">{amesFiltered.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <Card sx={{ bgcolor: '#4CAF50', color: 'white' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontSize: '1rem' }}>Intéressés</Typography>
                <Typography variant="h3">
                  {stats.stats.find(s => s._id === 'Intéressé')?.count || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <Card sx={{ bgcolor: '#9E9E9E', color: 'white' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontSize: '1rem' }}>Pas intéressés</Typography>
                <Typography variant="h3">
                  {stats.stats.find(s => s._id === 'Pas intéressé')?.count || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <Card sx={{ bgcolor: '#F44336', color: 'white' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontSize: '1rem' }}>Injoignables</Typography>
                <Typography variant="h3">
                  {stats.stats.find(s => s._id === 'Injoignable')?.count || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <Card sx={{ bgcolor: '#FF9800', color: 'white' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontSize: '1rem' }}>Indisponibles</Typography>
                <Typography variant="h3">
                  {stats.stats.find(s => s._id === 'Indisponible')?.count || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <Card sx={{ bgcolor: '#FFC107', color: 'white' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontSize: '1rem' }}>À rappeler</Typography>
                <Typography variant="h3">
                  {stats.stats.find(s => s._id === 'À rappeler')?.count || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filtres par agent */}
        <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <Button
            variant={filtreAgent === 'Tous' ? 'contained' : 'outlined'}
            onClick={() => setFiltreAgent('Tous')}
            sx={{ bgcolor: filtreAgent === 'Tous' ? '#0047AB' : 'transparent' }}
          >
            Tous ({ames.length})
          </Button>
          <Button
            variant={filtreAgent === 'Non assigné' ? 'contained' : 'outlined'}
            onClick={() => setFiltreAgent('Non assigné')}
            sx={{ bgcolor: filtreAgent === 'Non assigné' ? '#9E9E9E' : 'transparent' }}
          >
            Non assigné ({ames.filter(a => !a.agentCallCenter || a.agentCallCenter === '').length})
          </Button>
          {agents.map((agent, index) => {
            const colors = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#FF5722', '#00BCD4'];
            return (
              <Button
                key={agent}
                variant={filtreAgent === agent ? 'contained' : 'outlined'}
                onClick={() => setFiltreAgent(agent)}
                sx={{ bgcolor: filtreAgent === agent ? colors[index % colors.length] : 'transparent' }}
              >
                {agent} ({ames.filter(a => a.agentCallCenter === agent).length})
              </Button>
            );
          })}
          <Tooltip title="Gérer les agents">
            <IconButton
              onClick={() => setOpenGestionAgents(true)}
              sx={{ color: '#0047AB', border: '2px dashed #0047AB' }}
            >
              <Settings />
            </IconButton>
          </Tooltip>
        </Box>
        {/* Table des âmes */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ bgcolor: '#0047AB' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nom</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Prénom</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Téléphone</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Commune</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Agent Assigné</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nb Appels</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Dernier Statut</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Dernier Appel</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Prochain Appel Prévu</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {amesFiltered.map((ame) => (
                <TableRow key={ame._id}>
                  <TableCell>{ame.nom === '-' ? '' : ame.nom}</TableCell>
                  <TableCell>{ame.prenom}</TableCell>
                  <TableCell>{ame.telephone}</TableCell>
                  <TableCell>{ame.commune}</TableCell>
                  <TableCell>
                    <TextField
                      select
                      size="small"
                      value={ame.agentCallCenter || ''}
                      onChange={(e) => handleAssignAgent(ame._id, e.target.value)}
                      sx={{ minWidth: 120 }}
                      displayEmpty
                      SelectProps={{
                        displayEmpty: true,
                        renderValue: (value) => {
                          if (!value || value === '') {
                            return 'Non assigné';
                          }
                          return value;
                        }
                      }}
                    >
                      <MenuItem value="">Non assigné</MenuItem>
                      {agents.map(agent => (
                        <MenuItem key={agent} value={agent}>{agent}</MenuItem>
                      ))}
                    </TextField>
                  </TableCell>
                  <TableCell align="center">{ame.nombreAppels}</TableCell>
                  <TableCell>
                    {ame.dernierAppel && (
                      <Chip
                        icon={getStatutIcon(ame.dernierAppel.statutAppel)}
                        label={ame.dernierAppel.statutAppel}
                        sx={{
                          bgcolor: getStatutColor(ame.dernierAppel.statutAppel),
                          color: 'white'
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {ame.dernierAppel && new Date(ame.dernierAppel.dateAppel).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>
                    {ame.dernierAppel?.prochainAppel &&
                      new Date(ame.dernierAppel.prochainAppel).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    }
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Enregistrer un appel">
                      <IconButton
                        onClick={() => handleOpenDialog(ame)}
                        sx={{ color: '#0047AB' }}
                      >
                        <Phone />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Dialog pour enregistrer un appel */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            Enregistrer un Appel - {selectedAme?.nom} {selectedAme?.prenom}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="Statut de l'appel"
                    value={appelData.statutAppel}
                    onChange={(e) => setAppelData({ ...appelData, statutAppel: e.target.value })}
                    required
                  >
                    <MenuItem value="Indisponible">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhoneMissed sx={{ color: '#FF9800' }} />
                        Indisponible
                      </Box>
                    </MenuItem>
                    <MenuItem value="Injoignable">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhoneDisabled sx={{ color: '#F44336' }} />
                        Injoignable
                      </Box>
                    </MenuItem>
                    <MenuItem value="Intéressé">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircle sx={{ color: '#4CAF50' }} />
                        Intéressé
                      </Box>
                    </MenuItem>
                    <MenuItem value="Pas intéressé">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Cancel sx={{ color: '#9E9E9E' }} />
                        Pas intéressé
                      </Box>
                    </MenuItem>
                    <MenuItem value="Rendez-vous pris">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EventAvailable sx={{ color: '#2196F3' }} />
                        Rendez-vous pris
                      </Box>
                    </MenuItem>
                    <MenuItem value="À rappeler">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Phone sx={{ color: '#FFC107' }} />
                        À rappeler
                      </Box>
                    </MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Durée de l'appel (secondes)"
                    value={appelData.dureeAppel}
                    onChange={(e) => setAppelData({ ...appelData, dureeAppel: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    label="Priorité"
                    value={appelData.priorite}
                    onChange={(e) => setAppelData({ ...appelData, priorite: e.target.value })}
                  >
                    <MenuItem value="Faible">Faible</MenuItem>
                    <MenuItem value="Moyenne">Moyenne</MenuItem>
                    <MenuItem value="Haute">Haute</MenuItem>
                    <MenuItem value="Urgente">Urgente</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="datetime-local"
                    label="Prochain appel prévu"
                    value={appelData.prochainAppel}
                    onChange={(e) => setAppelData({ ...appelData, prochainAppel: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Notes de l'appel"
                    value={appelData.notes}
                    onChange={(e) => setAppelData({ ...appelData, notes: e.target.value })}
                    placeholder="Entrez vos observations sur cet appel..."
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Annuler</Button>
            <Button
              onClick={handleSaveAppel}
              variant="contained"
              disabled={!appelData.statutAppel}
              sx={{ bgcolor: '#0047AB' }}
            >
              Enregistrer
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog pour gérer les agents */}
        <Dialog
          open={openGestionAgents}
          onClose={() => {
            setOpenGestionAgents(false);
            setEditingAgent(null);
            setNewAgentNameEdit('');
            setNewAgentName('');
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ bgcolor: '#0047AB', color: 'white' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Settings />
              <Typography variant="h6">Gestion des Agents</Typography>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ color: '#666' }}>
                Agents actuels
              </Typography>
              <List>
                {agents.map((agent) => (
                  <ListItem
                    key={agent}
                    sx={{
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      mb: 1,
                      bgcolor: '#f9f9f9'
                    }}
                    secondaryAction={
                      <Box>
                        <IconButton
                          edge="end"
                          onClick={() => {
                            setEditingAgent(agent);
                            setNewAgentNameEdit(agent);
                          }}
                          sx={{ color: '#0047AB' }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          onClick={() => {
                            if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'agent "${agent}" ? Toutes ses âmes seront réaffectées à "Non assigné".`)) {
                              handleDeleteAgent(agent);
                            }
                          }}
                          sx={{ color: '#E31E24', ml: 1 }}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    }
                  >
                    {editingAgent === agent ? (
                      <TextField
                        fullWidth
                        size="small"
                        value={newAgentNameEdit}
                        onChange={(e) => setNewAgentNameEdit(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleEditAgent(agent, newAgentNameEdit);
                          }
                        }}
                        onBlur={() => {
                          if (newAgentNameEdit.trim() && newAgentNameEdit !== agent) {
                            handleEditAgent(agent, newAgentNameEdit);
                          } else {
                            setEditingAgent(null);
                            setNewAgentNameEdit('');
                          }
                        }}
                        autoFocus
                        placeholder="Nouveau nom de l'agent"
                      />
                    ) : (
                      <ListItemText
                        primary={agent}
                        secondary={`${ames.filter(a => a.agentCallCenter === agent).length} âme(s) assignée(s)`}
                      />
                    )}
                  </ListItem>
                ))}
              </List>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box>
              <Typography variant="subtitle2" gutterBottom sx={{ color: '#666' }}>
                Ajouter un nouvel agent
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Nom de l'agent"
                  value={newAgentName}
                  onChange={(e) => setNewAgentName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddAgent();
                    }
                  }}
                  placeholder="Ex: Marie, Jean..."
                />
                <Button
                  variant="contained"
                  onClick={handleAddAgent}
                  disabled={!newAgentName.trim() || agents.includes(newAgentName.trim())}
                  sx={{ bgcolor: '#0047AB', minWidth: '100px' }}
                  startIcon={<Add />}
                >
                  Ajouter
                </Button>
              </Box>
              {newAgentName.trim() && agents.includes(newAgentName.trim()) && (
                <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                  Cet agent existe déjà
                </Typography>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setOpenGestionAgents(false);
                setEditingAgent(null);
                setNewAgentNameEdit('');
                setNewAgentName('');
              }}
              sx={{ color: '#666' }}
            >
              Fermer
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog Guide d'Entretien Téléphonique */}
        <Dialog
          open={openGuideEntretien}
          onClose={() => setOpenGuideEntretien(false)}
          maxWidth="md"
          fullWidth
          scroll="paper"
        >
          <DialogTitle sx={{ bgcolor: '#4CAF50', color: 'white', py: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <MenuBook sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  Guide d'Entretien Téléphonique
                </Typography>
                <Typography variant="subtitle2">
                  Structure générale du script de feed-back
                </Typography>
              </Box>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ mt: 3 }}>
            <Typography variant="body1" paragraph sx={{ mb: 3, fontStyle: 'italic', color: '#666' }}>
              Un appel de feed-back réussi suit généralement un schéma en plusieurs étapes. Chaque étape est pensée pour être courte, bienveillante et centrée sur la personne appelée.
            </Typography>

            {/* Étape 1 */}
            <Paper elevation={2} sx={{ p: 3, mb: 3, bgcolor: '#E8F5E9', borderLeft: '4px solid #4CAF50' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2E7D32', mb: 2 }}>
                1. Salutation chaleureuse
              </Typography>
              <Typography variant="body1" paragraph>
                Commencez par un bonjour poli et bienveillant.
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'white', fontStyle: 'italic' }}>
                <Typography variant="body2">
                  "Bonjour ! La paix, la grâce et la faveur de Dieu soient avec vous !"
                </Typography>
              </Paper>
            </Paper>

            {/* Étape 2 */}
            <Paper elevation={2} sx={{ p: 3, mb: 3, bgcolor: '#E3F2FD', borderLeft: '4px solid #2196F3' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1565C0', mb: 2 }}>
                2. Introduction & Rappel du contexte
              </Typography>
              <Typography variant="body1" paragraph>
                Identifiez-vous clairement et rappelez le contexte de la prise de contact.
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'white', fontStyle: 'italic' }}>
                <Typography variant="body2">
                  "Je m'appelle [Prénom] de l'Eglise Centre Missionnaire Rehoboth Angré 8e tranche (CMR). Nous vous appelons suite à notre sortie d'évangélisation un samedi matin à Angré 8e tranche, où nous avons eu le plaisir de vous rencontrer. Et c'est à cette occasion que nous avons obtenu votre numéro."
                </Typography>
              </Paper>
            </Paper>

            {/* Étape 3 */}
            <Paper elevation={2} sx={{ p: 3, mb: 3, bgcolor: '#FFF3E0', borderLeft: '4px solid #FF9800' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#E65100', mb: 2 }}>
                3. Objet de l'appel (prendre des nouvelles)
              </Typography>
              <Typography variant="body1" paragraph>
                Expliquez brièvement la raison de votre appel en insistant sur l'intérêt que vous lui portez.
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'white', fontStyle: 'italic', mb: 2 }}>
                <Typography variant="body2">
                  "Nous voulions d'abord prendre de vos nouvelles et savoir comment vous allez, et aussi vous remercier pour le temps que vous nous avez accordé lors de notre sortie d'évangélisation."
                </Typography>
              </Paper>
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#E65100' }}>
                Faites une petite pause après cela pour lui laisser le temps de répondre.
              </Typography>
            </Paper>

            {/* Étape 4 */}
            <Paper elevation={2} sx={{ p: 3, mb: 3, bgcolor: '#F3E5F5', borderLeft: '4px solid #9C27B0' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#6A1B9A', mb: 2 }}>
                4. Écoute de la personne
              </Typography>
              <Typography variant="body1" paragraph>
                Laissez la personne s'exprimer. Deux cas de figure se présentent généralement :
              </Typography>

              <Box sx={{ ml: 2, mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  • <strong>Si la personne ne répond pas :</strong> dites "j'espère que vous allez bien."
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  • <strong>Si la personne dit qu'elle va bien :</strong> Répondez avec joie "Dieu merci !" et éventuellement rebondissez avec une phrase positive ("C'est une grâce de Dieu, nous en sommes heureux.").
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  • <strong>Si la personne partage un souci ou une difficulté :</strong> Écoutez-la attentivement sans l'interrompre, montrez de l'empathie ("Je suis vraiment désolé d'apprendre cela…" ou "Je comprends que ce n'est pas facile…").
                </Typography>
              </Box>

              <Paper sx={{ p: 2, bgcolor: '#FCE4EC' }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Proposition de prière :
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Proposez-lui spontanément une courte prière sur-le-champ pour ce besoin : "Est-ce que vous me permettez de prier pour vous maintenant par téléphone ?"
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 1 }}>
                  Si elle accepte, faites une prière brève et ciblée pour son problème, avec foi : "Père, je te recommande [Nom]. Interviens dans [sa situation], apporte-Ta guérison/paix/solution, au nom précieux de Jésus-Christ. Amen."
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  Ensuite, rassurez-la : "Dieu est fidèle, [Nom], et nous croyons qu'Il va agir."
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#C62828' }}>
                  ※ NB: Toujours demander la permission avant de prier au téléphone, et respecter si la personne préfère pas à ce moment.
                </Typography>
              </Paper>
            </Paper>

            {/* Étape 5 */}
            <Paper elevation={2} sx={{ p: 3, mb: 3, bgcolor: '#E0F2F1', borderLeft: '4px solid #009688' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#00695C', mb: 2 }}>
                5. Demander la permission de continuer (disponibilité)
              </Typography>
              <Typography variant="body1" paragraph>
                Avant d'aller plus loin dans l'appel, assurez-vous que c'est un bon moment pour discuter.
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'white', fontStyle: 'italic', mb: 2 }}>
                <Typography variant="body2">
                  "Pouvez-vous nous consacrer une ou deux minutes ?"
                </Typography>
              </Paper>
              <Typography variant="body2" paragraph>
                Si la personne est visiblement occupée ou hésitante, proposez de fixer un meilleur moment pour la rappeler :
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'white', fontStyle: 'italic', mb: 2 }}>
                <Typography variant="body2">
                  "Nous ne voulons pas encore empiéter sur votre temps. Pouvons-nous vous rappeler à un moment qui vous arrange mieux ?"
                </Typography>
              </Paper>
              <Typography variant="body2" paragraph>
                S'il y a du bruit en arrière-plan ou qu'elle semble pressée, prenez rendez-vous :
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'white', fontStyle: 'italic' }}>
                <Typography variant="body2">
                  "D'accord, nous pourrions vous rappeler ce soir vers 19h, est-ce que cela vous irait ?"
                </Typography>
              </Paper>
              <Typography variant="body2" sx={{ mt: 2, fontWeight: 'bold', color: '#00695C' }}>
                → Tenez cet engagement scrupuleusement en rappelant à l'heure convenue. Cette courtoisie montre du respect pour son emploi du temps.
              </Typography>
            </Paper>

            {/* Étape 6 */}
            <Paper elevation={2} sx={{ p: 3, mb: 3, bgcolor: '#FFF9C4', borderLeft: '4px solid #FBC02D' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#F57F17', mb: 2 }}>
                6. Présentation des activités de l'Église & Invitation
              </Typography>
              <Typography variant="body1" paragraph>
                Si la personne est disponible pour poursuivre l'échange, passez à l'invitation.
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'white', fontStyle: 'italic', mb: 2 }}>
                <Typography variant="body2">
                  "Nous nous sommes préparés à vous recevoir chaleureusement lors de nos prochains programmes. Nous aimerions passer du temps avec vous. Cela dit voici notre programme de la semaine :"
                </Typography>
              </Paper>
              <Typography variant="body2" paragraph>
                Ensuite, énumérez clairement les trois programmes principaux de la semaine, en marquant une petite pause entre chacun pour bien distinguer :
              </Typography>
              <Box sx={{ ml: 2, mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  • <strong>Mardi soir à 18h30-20h30 :</strong> enseignement biblique et session de questions/réponses.
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  • <strong>Vendredi soir à 18h30-20h30 :</strong> réunion de prière spéciale, avec prières de délivrance, de guérison, et ouverture des portes.
                </Typography>
                <Typography variant="body2">
                  • <strong>Dimanche matin à 9h00-11h30 :</strong> culte d'actions de grâce.
                </Typography>
              </Box>
            </Paper>

            {/* Étape 7 */}
            <Paper elevation={2} sx={{ p: 3, mb: 3, bgcolor: '#FFEBEE', borderLeft: '4px solid #F44336' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#C62828', mb: 2 }}>
                7. Appel à l'action – engagement à venir
              </Typography>
              <Typography variant="body1" paragraph>
                Après avoir présenté le planning, invitez explicitement la personne à l'une de ces rencontres.
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'white', fontStyle: 'italic', mb: 2 }}>
                <Typography variant="body2">
                  "À laquelle de ces rencontres pensez-vous prendre part très bientôt ?"
                </Typography>
              </Paper>
              <Typography variant="body2" paragraph>
                Attendez sa réponse. S'il s'engage sur une date ("Je viendrai dimanche"), réjouissez-vous :
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'white', fontStyle: 'italic' }}>
                <Typography variant="body2">
                  "Nous nous réjouissons déjà à l'idée de vous accueillir ce dimanche !"
                </Typography>
              </Paper>
              <Typography variant="body2" sx={{ mt: 2, fontWeight: 'bold', color: '#C62828' }}>
                → Notez cette intention de venue.
              </Typography>
            </Paper>

            {/* Étape 8 */}
            <Paper elevation={2} sx={{ p: 3, mb: 3, bgcolor: '#E8EAF6', borderLeft: '4px solid #3F51B5' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#283593', mb: 2 }}>
                8. Conclusion amicale de l'appel
              </Typography>
              <Typography variant="body1" paragraph>
                Terminez l'appel de manière positive et fraternelle.
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'white', fontStyle: 'italic' }}>
                <Typography variant="body2">
                  "Merci beaucoup d'avoir pris ce temps au téléphone avec nous. Que Dieu vous bénisse et à très bientôt."
                </Typography>
              </Paper>
            </Paper>

            <Paper elevation={3} sx={{ p: 3, bgcolor: '#1976D2', color: 'white', textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                ✨ Que Dieu bénisse votre service ! ✨
              </Typography>
            </Paper>
          </DialogContent>
          <DialogActions sx={{ p: 3, bgcolor: '#f5f5f5' }}>
            <Button
              onClick={() => setOpenGuideEntretien(false)}
              variant="contained"
              sx={{ bgcolor: '#4CAF50', px: 4, '&:hover': { bgcolor: '#45a049' } }}
            >
              Fermer
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default CallCenter;

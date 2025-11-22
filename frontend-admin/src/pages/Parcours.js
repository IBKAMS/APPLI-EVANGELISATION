import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  LinearProgress,
  Tooltip,
  Alert,
  Snackbar,
  CircularProgress,
  Avatar,
  Divider
} from '@mui/material';
import {
  Visibility,
  Delete,
  Edit,
  Download,
  Search,
  FilterList,
  CheckCircle,
  Cancel,
  School,
  People,
  TrendingUp,
  EmojiEvents,
  RestartAlt
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import api from '../services/api';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Training levels data structure
const TRAINING_LEVELS = [
  {
    level: 1,
    name: 'NIVEAU I: MES PREMIERS PAS',
    themes: 10,
    quizQuestions: 0,
    description: 'Introduction aux fondamentaux de la foi chrétienne'
  },
  {
    level: 2,
    name: 'NIVEAU II: MES PREMIERS PAS',
    themes: 9,
    quizQuestions: 0,
    description: 'Approfondissement des bases spirituelles'
  },
  {
    level: 3,
    name: 'NIVEAU III: LE SAINT-ESPRIT ET LE TÉMOIGNAGE',
    themes: 9,
    quizQuestions: 0,
    description: 'Comprendre le Saint-Esprit et témoigner efficacement'
  },
  {
    level: 4,
    name: 'NIVEAU IV: L\'ÉGLISE LOCALE',
    themes: 8,
    quizQuestions: 25,
    description: 'Le rôle et la mission de l\'église locale'
  }
];

const COLORS = ['#0047AB', '#E31E24', '#FFA500', '#2e7d32'];

// Statistics Card Component
const StatCard = ({ title, value, icon, color, subtitle }) => (
  <Card sx={{ height: '100%', borderLeft: `4px solid ${color}` }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box sx={{ flex: 1 }}>
          <Typography color="textSecondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color, mb: 1 }}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="textSecondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>
          {icon}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

// User Progress Detail Dialog
const UserProgressDialog = ({ open, onClose, user, progression }) => {
  if (!user || !progression) return null;

  const completionPercentage = progression.certificatObtenu ? 100 : ((progression.niveauActuel - 1) / 4) * 100;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: '#0047AB', color: 'white' }}>
        Détails de la Progression
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {user.nom} {user.prenom}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {user.email} | {user.telephone}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Progression Globale
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <LinearProgress
              variant="determinate"
              value={completionPercentage}
              sx={{ flex: 1, height: 10, borderRadius: 5 }}
            />
            <Typography variant="body2" fontWeight="bold">
              {completionPercentage.toFixed(0)}%
            </Typography>
          </Box>
        </Box>

        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
          Détails par Niveau
        </Typography>

        {TRAINING_LEVELS.map((level) => {
          const levelData = progression.niveaux?.[`niveau${level.level}`];
          const isCompleted = levelData?.termine || false;
          const isCurrent = progression.niveauActuel === level.level;
          const levelScore = levelData?.score || 0;

          return (
            <Paper
              key={level.level}
              sx={{
                p: 2,
                mb: 2,
                border: isCurrent ? '2px solid #0047AB' : '1px solid #e0e0e0',
                bgcolor: isCompleted ? '#f0f7ff' : 'white'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2" fontWeight="bold">
                  {level.name}
                </Typography>
                {isCompleted && <CheckCircle sx={{ color: 'success.main' }} />}
                {isCurrent && <Chip label="En cours" color="primary" size="small" />}
              </Box>
              <Typography variant="caption" color="textSecondary" display="block" sx={{ mb: 1 }}>
                {level.themes} thèmes | {level.quizQuestions} questions quiz
              </Typography>
              {levelScore > 0 && (
                <Chip
                  label={`Score: ${levelScore}%`}
                  size="small"
                  color={levelScore >= 70 ? 'success' : 'warning'}
                />
              )}
            </Paper>
          );
        })}

        <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="caption" color="textSecondary">
                Date de début
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {progression.createdAt
                  ? format(new Date(progression.createdAt), 'dd MMMM yyyy', { locale: fr })
                  : 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" color="textSecondary">
                Dernière activité
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {progression.updatedAt
                  ? format(new Date(progression.updatedAt), 'dd MMMM yyyy', { locale: fr })
                  : 'N/A'}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fermer</Button>
      </DialogActions>
    </Dialog>
  );
};

// Reset Progress Confirmation Dialog
const ResetProgressDialog = ({ open, onClose, onConfirm, user }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle sx={{ color: '#E31E24' }}>Confirmer la réinitialisation</DialogTitle>
    <DialogContent>
      <Alert severity="warning" sx={{ mb: 2 }}>
        Cette action est irréversible !
      </Alert>
      <Typography>
        Êtes-vous sûr de vouloir réinitialiser la progression de{' '}
        <strong>{user?.nom} {user?.prenom}</strong> ?
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
        Toutes les données de progression et les scores de quiz seront supprimés.
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Annuler</Button>
      <Button onClick={onConfirm} color="error" variant="contained">
        Réinitialiser
      </Button>
    </DialogActions>
  </Dialog>
);

// Main Component
const Parcours = () => {
  const [tabValue, setTabValue] = useState(0);
  const [progressions, setProgressions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedProgression, setSelectedProgression] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [userToReset, setUserToReset] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const progressionsRes = await api.get('/progression/all');
      setProgressions(progressionsRes.data.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      showSnackbar('Erreur lors du chargement des données', 'error');
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

  // Calculate statistics
  const calculateStats = () => {
    const totalEnrolled = progressions.length;
    const completed = progressions.filter(p => p.certificatObtenu).length;
    const completionRate = totalEnrolled > 0 ? (completed / totalEnrolled * 100).toFixed(1) : 0;

    const levelDistribution = [0, 0, 0, 0, 0]; // levels 1-4 + completed
    progressions.forEach(p => {
      if (p.certificatObtenu) {
        levelDistribution[4]++;
      } else if (p.niveauActuel >= 1 && p.niveauActuel <= 4) {
        levelDistribution[p.niveauActuel - 1]++;
      }
    });

    const averageScores = TRAINING_LEVELS.map(level => {
      const scores = progressions
        .map(p => p.niveaux?.[`niveau${level.level}`]?.score)
        .filter(score => score !== undefined && score > 0);
      return scores.length > 0
        ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
        : 0;
    });

    const certificatesIssued = progressions.filter(p => p.certificatObtenu).length;

    return {
      totalEnrolled,
      completed,
      completionRate,
      levelDistribution,
      averageScores,
      certificatesIssued
    };
  };

  const stats = calculateStats();

  // Filter progressions
  const getFilteredProgressions = () => {
    return progressions.filter(progression => {
      const user = progression.utilisateur;
      if (!user) return false;

      // Search filter
      const searchMatch = searchTerm === '' ||
        user.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase());

      // Level filter
      const levelMatch = levelFilter === 'all' ||
        (levelFilter === 'completed' && progression.certificatObtenu) ||
        parseInt(levelFilter) === progression.niveauActuel;

      // Status filter
      const statusMatch = statusFilter === 'all' ||
        (statusFilter === 'completed' && progression.certificatObtenu) ||
        (statusFilter === 'in_progress' && !progression.certificatObtenu);

      return searchMatch && levelMatch && statusMatch;
    });
  };

  const filteredProgressions = getFilteredProgressions();

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      'Nom',
      'Prénom',
      'Email',
      'Niveau Actuel',
      'Statut',
      'Score Niveau 1',
      'Score Niveau 2',
      'Score Niveau 3',
      'Score Niveau 4',
      'Date Début',
      'Dernière Activité'
    ];

    const rows = filteredProgressions.map(progression => {
      const user = progression.utilisateur;
      return [
        user?.nom || '',
        user?.prenom || '',
        user?.email || '',
        progression.certificatObtenu ? 'Terminé' : `Niveau ${progression.niveauActuel}`,
        progression.certificatObtenu ? 'Complété' : 'En cours',
        progression.niveaux?.niveau1?.score || 0,
        progression.niveaux?.niveau2?.score || 0,
        progression.niveaux?.niveau3?.score || 0,
        progression.niveaux?.niveau4?.score || 0,
        progression.createdAt ? format(new Date(progression.createdAt), 'dd/MM/yyyy') : '',
        progression.updatedAt ? format(new Date(progression.updatedAt), 'dd/MM/yyyy') : ''
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `progression_formation_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();

    showSnackbar('Export CSV réussi');
  };

  // Reset user progress
  const handleResetProgress = async () => {
    if (!userToReset) return;

    try {
      await api.delete(`/progression/${userToReset._id}`);
      showSnackbar('Progression réinitialisée avec succès');
      fetchData();
      setResetDialogOpen(false);
      setUserToReset(null);
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
      showSnackbar('Erreur lors de la réinitialisation', 'error');
    }
  };

  // View user details
  const handleViewDetails = (progression) => {
    setSelectedUser(progression.utilisateur);
    setSelectedProgression(progression);
    setDetailDialogOpen(true);
  };

  // Prepare chart data
  const levelDistributionData = [
    { name: 'Niveau 1', value: stats.levelDistribution[0] },
    { name: 'Niveau 2', value: stats.levelDistribution[1] },
    { name: 'Niveau 3', value: stats.levelDistribution[2] },
    { name: 'Niveau 4', value: stats.levelDistribution[3] },
    { name: 'Terminé', value: stats.levelDistribution[4] }
  ];

  const scoreData = TRAINING_LEVELS.map((level, index) => ({
    name: `Niveau ${level.level}`,
    score: parseFloat(stats.averageScores[index])
  }));

  // Statistics Tab
  const renderStatisticsTab = () => (
    <Box>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Inscrits"
            value={stats.totalEnrolled}
            icon={<People />}
            color="#0047AB"
            subtitle="Utilisateurs en formation"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Taux de Complétion"
            value={`${stats.completionRate}%`}
            icon={<TrendingUp />}
            color="#2e7d32"
            subtitle={`${stats.completed} utilisateurs`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Certificats Émis"
            value={stats.certificatesIssued}
            icon={<EmojiEvents />}
            color="#FFA500"
            subtitle="Score ≥ 70% au niveau 4"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Score Moyen Global"
            value={`${(stats.averageScores.reduce((a, b) => parseFloat(a) + parseFloat(b), 0) / 4).toFixed(1)}%`}
            icon={<School />}
            color="#E31E24"
            subtitle="Tous niveaux confondus"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#0047AB', fontWeight: 'bold' }}>
              Distribution par Niveau
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={levelDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {levelDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#0047AB', fontWeight: 'bold' }}>
              Scores Moyens par Niveau
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scoreData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="score" fill="#0047AB" name="Score Moyen (%)" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#0047AB', fontWeight: 'bold' }}>
              Complétions Récentes
            </Typography>
            {progressions
              .filter(p => p.certificatObtenu)
              .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
              .slice(0, 5)
              .map((progression, index) => {
                const user = progression.utilisateur;
                if (!user) return null;

                return (
                  <Box
                    key={progression._id}
                    sx={{
                      p: 2,
                      mb: 1,
                      bgcolor: index % 2 === 0 ? '#f5f5f5' : 'white',
                      borderRadius: 1,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {user.nom} {user.prenom}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Score quiz final: {progression.quizFinal?.score || 0}%
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Chip
                        label="Complété"
                        color="success"
                        size="small"
                        icon={<CheckCircle />}
                      />
                      <Typography variant="caption" color="textSecondary" display="block" sx={{ mt: 0.5 }}>
                        {progression.dateCertificat
                          ? format(new Date(progression.dateCertificat), 'dd MMM yyyy', { locale: fr })
                          : ''}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            {progressions.filter(p => p.certificatObtenu).length === 0 && (
              <Typography color="textSecondary">Aucune complétion récente</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );

  // User Progress Tab
  const renderUserProgressTab = () => (
    <Box>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Rechercher par nom, prénom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Niveau</InputLabel>
              <Select
                value={levelFilter}
                label="Niveau"
                onChange={(e) => setLevelFilter(e.target.value)}
              >
                <MenuItem value="all">Tous les niveaux</MenuItem>
                <MenuItem value="1">Niveau 1</MenuItem>
                <MenuItem value="2">Niveau 2</MenuItem>
                <MenuItem value="3">Niveau 3</MenuItem>
                <MenuItem value="4">Niveau 4</MenuItem>
                <MenuItem value="completed">Terminé</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Statut</InputLabel>
              <Select
                value={statusFilter}
                label="Statut"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">Tous les statuts</MenuItem>
                <MenuItem value="in_progress">En cours</MenuItem>
                <MenuItem value="completed">Complété</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<Download />}
              onClick={exportToCSV}
              sx={{ bgcolor: '#0047AB' }}
            >
              Export CSV
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: '#0047AB' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Utilisateur</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Niveau Actuel</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Progression</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Statut</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Dernière Activité</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProgressions.map((progression) => {
              const user = progression.utilisateur;
              if (!user) return null;

              const completionPercentage = progression.certificatObtenu ? 100 : ((progression.niveauActuel - 1) / 4) * 100;
              const isCompleted = progression.certificatObtenu;

              return (
                <TableRow key={progression._id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {user.nom} {user.prenom}
                    </Typography>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={isCompleted ? 'Terminé' : `Niveau ${progression.niveauActuel}`}
                      color={isCompleted ? 'success' : 'primary'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={completionPercentage}
                        sx={{ flex: 1, height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="caption" sx={{ minWidth: 40 }}>
                        {completionPercentage.toFixed(0)}%
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {isCompleted ? (
                      <Chip
                        icon={<CheckCircle />}
                        label="Complété"
                        color="success"
                        size="small"
                      />
                    ) : (
                      <Chip label="En cours" color="warning" size="small" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">
                      {progression.updatedAt
                        ? format(new Date(progression.updatedAt), 'dd/MM/yyyy', { locale: fr })
                        : 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Voir les détails">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleViewDetails(progression)}
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Réinitialiser">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => {
                          setUserToReset(user);
                          setResetDialogOpen(true);
                        }}
                      >
                        <RestartAlt />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {filteredProgressions.length === 0 && (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="textSecondary">
              Aucune progression trouvée
            </Typography>
          </Box>
        )}
      </TableContainer>
    </Box>
  );

  // Content Overview Tab
  const renderContentTab = () => (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ color: '#0047AB', fontWeight: 'bold', mb: 3 }}>
        Structure du Parcours de Formation
      </Typography>

      <Grid container spacing={3}>
        {TRAINING_LEVELS.map((level, index) => (
          <Grid item xs={12} md={6} key={level.level}>
            <Card
              sx={{
                height: '100%',
                borderLeft: `4px solid ${COLORS[index]}`,
                '&:hover': { boxShadow: 6 }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: COLORS[index], mr: 2, width: 48, height: 48 }}>
                    <School />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: COLORS[index] }}>
                      {level.name}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Niveau {level.level}
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  {level.description}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: COLORS[index] }}>
                        {level.themes}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Thèmes
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: COLORS[index] }}>
                        {level.quizQuestions}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Questions Quiz
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="textSecondary">
                    Utilisateurs actuels au niveau {level.level}:{' '}
                    <strong>{stats.levelDistribution[index]}</strong>
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 3, mt: 3, bgcolor: '#f0f7ff' }}>
        <Typography variant="h6" gutterBottom sx={{ color: '#0047AB', fontWeight: 'bold' }}>
          Statistiques Globales du Contenu
        </Typography>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#0047AB' }}>
                4
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Niveaux de Formation
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#E31E24' }}>
                {TRAINING_LEVELS.reduce((sum, level) => sum + level.themes, 0)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Thèmes au Total
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#FFA500' }}>
                25
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Questions Quiz Final
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                70%
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Score Minimum pour Certificat
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#0047AB', mb: 3 }}>
        Gestion des Parcours de Formation
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{
            '& .MuiTab-root': { fontWeight: 'bold' },
            '& .Mui-selected': { color: '#0047AB' }
          }}
        >
          <Tab label="Statistiques" />
          <Tab label="Progression des Utilisateurs" />
          <Tab label="Contenu de Formation" />
        </Tabs>
      </Paper>

      <Box sx={{ mt: 3 }}>
        {tabValue === 0 && renderStatisticsTab()}
        {tabValue === 1 && renderUserProgressTab()}
        {tabValue === 2 && renderContentTab()}
      </Box>

      {/* User Progress Detail Dialog */}
      <UserProgressDialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        user={selectedUser}
        progression={selectedProgression}
      />

      {/* Reset Progress Confirmation Dialog */}
      <ResetProgressDialog
        open={resetDialogOpen}
        onClose={() => {
          setResetDialogOpen(false);
          setUserToReset(null);
        }}
        onConfirm={handleResetProgress}
        user={userToReset}
      />

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

export default Parcours;

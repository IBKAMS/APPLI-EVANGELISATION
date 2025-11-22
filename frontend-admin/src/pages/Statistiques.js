import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Chip
} from '@mui/material';
import {
  People as PeopleIcon,
  EmojiEvents as TrophyIcon,
  Campaign as CampaignIcon,
  TrendingUp as TrendingUpIcon,
  Event as EventIcon,
  PersonAdd as PersonAddIcon,
  School as SchoolIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import api from '../services/api';

const Statistiques = () => {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('all');
  const [stats, setStats] = useState({
    ames: { total: 0, nouvelles: 0, enSuivi: 0, baptisees: 0 },
    campagnes: { total: 0, planifiees: 0, enCours: 0, terminees: 0 },
    utilisateurs: { total: 0, evangelistes: 0, pasteurs: 0, admins: 0 },
    formation: { total: 0, enFormation: 0, certifies: 0 },
    topEvangelistes: [],
    recentsAmes: [],
    campagnesStats: []
  });

  useEffect(() => {
    fetchStatistics();
  }, [period]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);

      // Récupérer toutes les données
      const [amesRes, campagnesRes, usersRes, progressionRes] = await Promise.all([
        api.get('/ames'),
        api.get('/campagnes'),
        api.get('/auth/users'),
        api.get('/progression/all')
      ]);

      // Debug: afficher les réponses complètes
      console.log('=== STATISTIQUES DEBUG ===');
      console.log('Réponse complète âmes:', amesRes.data);
      console.log('Réponse complète campagnes:', campagnesRes.data);
      console.log('Réponse complète users:', usersRes.data);

      const ames = amesRes.data.data || [];
      const campagnes = campagnesRes.data.data || [];
      const users = usersRes.data.data || [];
      const progressions = progressionRes.data.data || [];

      // Debug: afficher le nombre d'éléments
      console.log('Nombre d\'âmes récupérées:', ames.length);
      console.log('Données âmes:', ames);
      console.log('Nombre de campagnes:', campagnes.length);
      console.log('Nombre d\'utilisateurs:', users.length);

      // Statistiques des âmes
      const amesStats = {
        total: ames.length,
        nouvelles: ames.filter(a =>
          a.statutSpirituel === 'Non-croyant' ||
          a.statutSpirituel === 'Non-converti' ||
          a.statutSpirituel === 'Intéressé'
        ).length,
        enSuivi: ames.filter(a =>
          a.statutSpirituel === 'Nouveau converti' ||
          a.statutSpirituel === 'Converti non baptisé'
        ).length,
        baptisees: ames.filter(a =>
          a.statutSpirituel === 'Baptisé' ||
          a.statutSpirituel === 'Chrétien pratiquant' ||
          a.statutSpirituel === 'Membre actif'
        ).length
      };

      // Statistiques des campagnes
      const campagnesStats = {
        total: campagnes.length,
        planifiees: campagnes.filter(c => c.statut === 'Planifiée').length,
        enCours: campagnes.filter(c => c.statut === 'En cours').length,
        terminees: campagnes.filter(c => c.statut === 'Terminée').length
      };

      // Statistiques des utilisateurs
      const usersStats = {
        total: users.length,
        evangelistes: users.filter(u => u.role === 'evangeliste').length,
        pasteurs: users.filter(u => u.role === 'pasteur').length,
        admins: users.filter(u => u.role === 'admin').length
      };

      // Statistiques de formation
      const formationStats = {
        total: progressions.length,
        enFormation: progressions.filter(p => !p.certificatObtenu).length,
        certifies: progressions.filter(p => p.certificatObtenu).length
      };

      // Top évangélistes (par nombre d'âmes gagnées)
      const evangelistesMap = {};
      ames.forEach(ame => {
        if (ame.evangeliste) {
          const id = ame.evangeliste._id || ame.evangeliste;
          const nom = ame.evangeliste.nom ? `${ame.evangeliste.nom} ${ame.evangeliste.prenom}` : 'Inconnu';
          if (!evangelistesMap[id]) {
            evangelistesMap[id] = { nom, count: 0 };
          }
          evangelistesMap[id].count++;
        }
      });

      const topEvangelistes = Object.values(evangelistesMap)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Âmes récentes
      const recentsAmes = ames
        .sort((a, b) => new Date(b.dateRencontre) - new Date(a.dateRencontre))
        .slice(0, 5);

      // Stats détaillées par campagne
      const campagnesStatsDetails = campagnes
        .filter(c => c.statut === 'Terminée')
        .map(c => ({
          titre: c.titre,
          amesGagnees: c.resultats?.amesGagnees || 0,
          tractsDistribues: c.resultats?.tractsDistribues || 0,
          participants: c.resultats?.participantsPresents || 0,
          date: c.dateDebut
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

      setStats({
        ames: amesStats,
        campagnes: campagnesStats,
        utilisateurs: usersStats,
        formation: formationStats,
        topEvangelistes,
        recentsAmes,
        campagnesStats: campagnesStatsDetails
      });

    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <Card sx={{ height: '100%', boxShadow: 3 }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color }}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Icon sx={{ fontSize: 50, color, opacity: 0.3 }} />
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#0047AB' }}>
          Statistiques et Rapports
        </Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Période</InputLabel>
          <Select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            label="Période"
          >
            <MenuItem value="all">Toutes périodes</MenuItem>
            <MenuItem value="month">Ce mois</MenuItem>
            <MenuItem value="year">Cette année</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Statistiques principales - Âmes */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
        Statistiques des Âmes
      </Typography>
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total des Âmes"
            value={stats.ames.total}
            icon={PeopleIcon}
            color="#0047AB"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Nouveaux Contacts"
            value={stats.ames.nouvelles}
            icon={PersonAddIcon}
            color="#4CAF50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="En Suivi"
            value={stats.ames.enSuivi}
            icon={TrendingUpIcon}
            color="#FF9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Baptisées"
            value={stats.ames.baptisees}
            icon={CheckCircleIcon}
            color="#9C27B0"
          />
        </Grid>
      </Grid>

      {/* Statistiques Campagnes */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
        Campagnes d'Évangélisation
      </Typography>
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Campagnes"
            value={stats.campagnes.total}
            icon={CampaignIcon}
            color="#0047AB"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Planifiées"
            value={stats.campagnes.planifiees}
            icon={EventIcon}
            color="#2196F3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="En Cours"
            value={stats.campagnes.enCours}
            icon={TrendingUpIcon}
            color="#4CAF50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Terminées"
            value={stats.campagnes.terminees}
            icon={CheckCircleIcon}
            color="#9E9E9E"
          />
        </Grid>
      </Grid>

      {/* Statistiques Formation et Utilisateurs */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Utilisateurs
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <StatCard
                  title="Total"
                  value={stats.utilisateurs.total}
                  icon={PeopleIcon}
                  color="#0047AB"
                />
              </Grid>
              <Grid item xs={6}>
                <StatCard
                  title="Évangélistes"
                  value={stats.utilisateurs.evangelistes}
                  icon={PersonAddIcon}
                  color="#4CAF50"
                />
              </Grid>
              <Grid item xs={6}>
                <StatCard
                  title="Pasteurs"
                  value={stats.utilisateurs.pasteurs}
                  icon={SchoolIcon}
                  color="#FF9800"
                />
              </Grid>
              <Grid item xs={6}>
                <StatCard
                  title="Admins"
                  value={stats.utilisateurs.admins}
                  icon={TrophyIcon}
                  color="#9C27B0"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Parcours de Formation
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <StatCard
                  title="Total Inscrits"
                  value={stats.formation.total}
                  icon={SchoolIcon}
                  color="#0047AB"
                />
              </Grid>
              <Grid item xs={6}>
                <StatCard
                  title="En Formation"
                  value={stats.formation.enFormation}
                  icon={TrendingUpIcon}
                  color="#FF9800"
                />
              </Grid>
              <Grid item xs={6}>
                <StatCard
                  title="Certifiés"
                  value={stats.formation.certifies}
                  icon={CheckCircleIcon}
                  color="#4CAF50"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Top Évangélistes */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Top 5 Évangélistes
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Rang</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Nom</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="right">Âmes gagnées</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.topEvangelistes.length > 0 ? (
                    stats.topEvangelistes.map((evangeliste, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {index === 0 && <TrophyIcon sx={{ color: '#FFD700', verticalAlign: 'middle' }} />}
                          {index === 1 && <TrophyIcon sx={{ color: '#C0C0C0', verticalAlign: 'middle' }} />}
                          {index === 2 && <TrophyIcon sx={{ color: '#CD7F32', verticalAlign: 'middle' }} />}
                          {index > 2 && `#${index + 1}`}
                        </TableCell>
                        <TableCell>{evangeliste.nom}</TableCell>
                        <TableCell align="right">
                          <Chip
                            label={evangeliste.count}
                            color="primary"
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        Aucune donnée disponible
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Résultats des Campagnes */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Résultats des Dernières Campagnes
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Campagne</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="center">Âmes</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="center">Tracts</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.campagnesStats.length > 0 ? (
                    stats.campagnesStats.map((campagne, index) => (
                      <TableRow key={index}>
                        <TableCell>{campagne.titre}</TableCell>
                        <TableCell align="center">
                          <Chip
                            label={campagne.amesGagnees}
                            color="primary"
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={campagne.tractsDistribues}
                            color="default"
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        Aucune campagne terminée
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Âmes récentes */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          Âmes Récemment Contactées
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Nom</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Date de Rencontre</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Statut Spirituel</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Agent CC</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Nb Appels</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Historique des Appels</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Évangéliste</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stats.recentsAmes.length > 0 ? (
                stats.recentsAmes.map((ame) => (
                  <TableRow key={ame._id} hover>
                    <TableCell sx={{ fontWeight: 'bold' }}>{`${ame.nom} ${ame.prenom}`}</TableCell>
                    <TableCell>{new Date(ame.dateRencontre).toLocaleDateString('fr-FR')}</TableCell>
                    <TableCell>
                      <Chip
                        label={ame.statutSpirituel}
                        color={
                          (ame.statutSpirituel === 'Baptisé' || ame.statutSpirituel === 'Chrétien pratiquant' || ame.statutSpirituel === 'Membre actif') ? 'success' :
                          (ame.statutSpirituel === 'Nouveau converti' || ame.statutSpirituel === 'Converti non baptisé') ? 'primary' :
                          'default'
                        }
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
                      ) : (
                        <Chip
                          label="Non assigné"
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={ame.nombreAppels || 0}
                        color={ame.nombreAppels > 0 ? 'primary' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {ame.dernierAppel ? (
                        <Box>
                          <Typography variant="body2" sx={{ fontSize: '0.75rem', mb: 0.5 }}>
                            <strong>Dernier:</strong> {new Date(ame.dernierAppel.dateAppel).toLocaleDateString('fr-FR')}
                          </Typography>
                          <Chip
                            label={ame.dernierAppel.statutAppel}
                            size="small"
                            sx={{ fontSize: '0.7rem' }}
                            color={
                              ame.dernierAppel.statutAppel === 'Intéressé' ? 'success' :
                              ame.dernierAppel.statutAppel === 'À rappeler' ? 'warning' :
                              ame.dernierAppel.statutAppel === 'Injoignable' ? 'error' :
                              'default'
                            }
                          />
                        </Box>
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          Aucun appel
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {ame.evangeliste?.nom ? (
                        <Typography variant="body2">
                          {`${ame.evangeliste.nom} ${ame.evangeliste.prenom}`}
                        </Typography>
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          Non assigné
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Aucune âme enregistrée
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Statistiques;

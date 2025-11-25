import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Avatar,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  People,
  PersonAdd,
  MenuBook,
  TrendingUp,
  Refresh
} from '@mui/icons-material';
import api from '../services/api';

const StatCard = ({ title, value, icon, color, trend }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography color="textSecondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color }}>
            {value}
          </Typography>
          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <TrendingUp sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
              <Typography variant="caption" color="success.main">
                {trend}
              </Typography>
            </Box>
          )}
        </Box>
        <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>
          {icon}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const location = useLocation();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAmes: 0,
    totalRessources: 0,
    amesThisMonth: 0,
    recentAmes: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  // Rafraîchir les données quand on revient sur cette page
  useEffect(() => {
    if (location.pathname === '/') {
      fetchStats();
    }
  }, [location]);

  const fetchStats = async () => {
    try {
      const [usersRes, amesRes, ressourcesRes] = await Promise.all([
        api.get('/auth/users'),
        api.get('/ames'),
        api.get('/ressources')
      ]);

      // Gérer les différentes structures de réponse
      const usersData = usersRes.data.data || usersRes.data || [];
      const amesData = amesRes.data.data || amesRes.data || [];
      const ressourcesData = ressourcesRes.data.data || ressourcesRes.data || [];

      const totalAmes = Array.isArray(amesData) ? amesData.length : 0;
      const currentMonth = new Date().getMonth();
      const amesThisMonth = Array.isArray(amesData)
        ? amesData.filter(ame => new Date(ame.createdAt).getMonth() === currentMonth).length
        : 0;

      setStats({
        totalUsers: Array.isArray(usersData) ? usersData.length : (usersRes.data.results || 0),
        totalAmes,
        totalRessources: Array.isArray(ressourcesData) ? ressourcesData.length : (ressourcesRes.data.results || 0),
        amesThisMonth,
        recentAmes: Array.isArray(amesData) ? amesData.slice(0, 5) : []
      });
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Typography>Chargement...</Typography>
      </Box>
    );
  }

  const handleRefresh = () => {
    setLoading(true);
    fetchStats();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#0047AB' }}>
          Tableau de Bord
        </Typography>
        <Tooltip title="Rafraîchir les données">
          <IconButton
            onClick={handleRefresh}
            sx={{ color: '#0047AB' }}
            disabled={loading}
          >
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Évangélistes"
            value={stats.totalUsers}
            icon={<People />}
            color="#0047AB"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Âmes Enregistrées"
            value={stats.totalAmes}
            icon={<PersonAdd />}
            color="#E31E24"
            trend={`+${stats.amesThisMonth} ce mois`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Ressources"
            value={stats.totalRessources}
            icon={<MenuBook />}
            color="#FFA500"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#0047AB', fontWeight: 'bold' }}>
              Âmes Récemment Enregistrées
            </Typography>
            {stats.recentAmes.length === 0 ? (
              <Typography color="textSecondary">Aucune âme enregistrée récemment</Typography>
            ) : (
              <Box>
                {stats.recentAmes.map((ame, index) => (
                  <Box
                    key={ame._id}
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
                        {ame.nom} {ame.prenom}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {ame.telephone} - {ame.ville || 'Non spécifié'}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(ame.createdAt).toLocaleDateString('fr-FR')}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#0047AB', fontWeight: 'bold' }}>
              Actions Rapides
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box
                sx={{
                  p: 2,
                  bgcolor: '#0047AB',
                  color: 'white',
                  borderRadius: 2,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: '#003380' }
                }}
              >
                <Typography variant="body2">Ajouter une ressource</Typography>
              </Box>
              <Box
                sx={{
                  p: 2,
                  bgcolor: '#E31E24',
                  color: 'white',
                  borderRadius: 2,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: '#B71C1C' }
                }}
              >
                <Typography variant="body2">Créer une campagne</Typography>
              </Box>
              <Box
                sx={{
                  p: 2,
                  bgcolor: '#FFA500',
                  color: 'white',
                  borderRadius: 2,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: '#FF8C00' }
                }}
              >
                <Typography variant="body2">Voir les rapports</Typography>
              </Box>
            </Box>
          </Paper>

          <Paper sx={{ p: 3, bgcolor: '#0047AB', color: 'white' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Citation du Jour
            </Typography>
            <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 2 }}>
              "Allez, faites de toutes les nations des disciples, les baptisant au nom du Père, du Fils et du Saint-Esprit."
            </Typography>
            <Typography variant="caption">
              Matthieu 28:19
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;

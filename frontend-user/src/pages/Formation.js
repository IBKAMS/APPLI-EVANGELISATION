import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Paper,
  LinearProgress,
  Snackbar
} from '@mui/material';
import { School, Save } from '@mui/icons-material';
import api from '../services/api';
import ThemeSection from '../components/Formation/ThemeSection';
import useAutoSave from '../hooks/useAutoSave';

const Formation = () => {
  const [parcours, setParcours] = useState(null);
  const [reponses, setReponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentTheme, setCurrentTheme] = useState(0);
  const [saveMessage, setSaveMessage] = useState('');
  const [showSaveNotif, setShowSaveNotif] = useState(false);

  // Fonction de sauvegarde
  const saveReponse = async (questionId, reponse, questionData) => {
    try {
      await api.post('/parcours-formation/reponses', {
        parcoursFormationId: parcours._id,
        niveau: parcours.niveau,
        themeId: parcours.themes[currentTheme].id,
        themeNumero: parcours.themes[currentTheme].numero,
        themeTitre: parcours.themes[currentTheme].titre,
        questionId,
        reponse,
        estComplet: reponse && reponse.trim().length > 0
      });

      // Mettre à jour les réponses localement
      setReponses(prev => {
        const existing = prev.find(r => r.questionId === questionId);
        if (existing) {
          return prev.map(r =>
            r.questionId === questionId ? { ...r, reponse } : r
          );
        }
        return [...prev, { questionId, reponse }];
      });

      setSaveMessage('Sauvegardé automatiquement');
      setShowSaveNotif(true);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setSaveMessage('Erreur de sauvegarde');
      setShowSaveNotif(true);
    }
  };

  // Hook d'auto-sauvegarde avec debounce de 2 secondes
  const autoSave = useAutoSave(saveReponse, 2000);

  // Charger le parcours au montage
  useEffect(() => {
    const fetchParcours = async () => {
      try {
        const response = await api.get('/parcours-formation/niveau-1');
        setParcours(response.data.data);

        // Charger les réponses existantes
        if (response.data.data?._id) {
          const reponsesRes = await api.get(`/parcours-formation/reponses/${response.data.data._id}`);
          setReponses(reponsesRes.data.data || []);
        }
      } catch (err) {
        console.error('Erreur:', err);
        setError('Impossible de charger le parcours de formation');
      } finally {
        setLoading(false);
      }
    };

    fetchParcours();
  }, []);

  const handleResponseChange = (questionId, value, questionData) => {
    // Lancer l'auto-save
    autoSave(questionId, value, questionData);
  };

  const handleThemeChange = (event, newValue) => {
    setCurrentTheme(newValue);
  };

  // Calculer la progression globale
  const calculateGlobalProgression = () => {
    if (!parcours) return 0;

    let totalQuestions = 0;
    let answeredQuestions = 0;

    parcours.themes.forEach(theme => {
      const themeQuestions = [
        ...(theme.sections?.flatMap(s => [
          ...(s.questions || []),
          ...(s.subsections?.flatMap(sub => sub.questions) || [])
        ]) || []),
        ...(theme.applications || [])
      ];

      totalQuestions += themeQuestions.length;

      themeQuestions.forEach(q => {
        const reponse = reponses.find(r => r.questionId === q.id);
        if (reponse?.reponse && reponse.reponse.trim().length > 0) {
          answeredQuestions++;
        }
      });
    });

    return totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography sx={{ mt: 2 }}>Chargement du parcours...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!parcours) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="info">Aucun parcours disponible</Alert>
      </Container>
    );
  }

  const globalProgression = calculateGlobalProgression();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* En-tête */}
      <Paper elevation={3} sx={{ p: 4, mb: 4, bgcolor: '#0047AB', color: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <School sx={{ fontSize: 50 }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
              {parcours.titre}
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              {parcours.description || 'Parcours de formation biblique'}
            </Typography>
          </Box>
        </Box>

        {/* Barre de progression globale */}
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Progression globale</Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {globalProgression}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={globalProgression}
            sx={{
              height: 10,
              borderRadius: 5,
              bgcolor: 'rgba(255,255,255,0.3)',
              '& .MuiLinearProgress-bar': {
                bgcolor: globalProgression === 100 ? '#4CAF50' : '#FFD700'
              }
            }}
          />
        </Box>
      </Paper>

      {/* Onglets des thèmes */}
      <Paper elevation={2} sx={{ mb: 3 }}>
        <Tabs
          value={currentTheme}
          onChange={handleThemeChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              minHeight: 72,
              textTransform: 'none',
              fontSize: '1rem'
            }
          }}
        >
          {parcours.themes.map((theme, index) => (
            <Tab
              key={theme.id}
              label={
                <Box>
                  <Typography sx={{ fontWeight: 600 }}>
                    Thème {theme.numero}
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                    {theme.titre.length > 40 ? theme.titre.substring(0, 40) + '...' : theme.titre}
                  </Typography>
                </Box>
              }
            />
          ))}
        </Tabs>
      </Paper>

      {/* Contenu du thème actuel */}
      {parcours.themes[currentTheme] && (
        <ThemeSection
          theme={parcours.themes[currentTheme]}
          reponses={reponses}
          onResponseChange={handleResponseChange}
          disabled={false}
        />
      )}

      {/* Notification de sauvegarde */}
      <Snackbar
        open={showSaveNotif}
        autoHideDuration={2000}
        onClose={() => setShowSaveNotif(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={saveMessage.includes('Erreur') ? 'error' : 'success'}
          icon={<Save fontSize="small" />}
          sx={{ width: '100%' }}
        >
          {saveMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Formation;

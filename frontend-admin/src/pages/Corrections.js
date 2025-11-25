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
  Button,
  LinearProgress,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
  CardContent,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  School,
  Visibility,
  Check,
  HourglassEmpty,
  Refresh,
  Close,
  Save,
  CheckCircle,
  RadioButtonUnchecked
} from '@mui/icons-material';
import api from '../services/api';

const Corrections = () => {
  const [apprenants, setApprenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedApprenant, setSelectedApprenant] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [reponses, setReponses] = useState([]);
  const [parcours, setParcours] = useState(null);
  const [correction, setCorrection] = useState({
    noteTheme: 0,
    questionsCorrigees: [],
    commentaireGeneral: ''
  });
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    fetchApprenants();
  }, []);

  const fetchApprenants = async () => {
    try {
      setLoading(true);
      const response = await api.get('/corrections/apprenants');
      setApprenants(response.data.data || []);
      setError('');
    } catch (err) {
      console.error('Erreur lors du chargement des apprenants:', err);
      setError('Impossible de charger la liste des apprenants');
    } finally {
      setLoading(false);
    }
  };

  const fetchDetails = async (userId, parcoursId, themeId) => {
    try {
      setDetailsLoading(true);

      // Charger les réponses de l'apprenant pour ce thème
      const reponsesRes = await api.get(`/corrections/apprenants/${userId}/${parcoursId}/${themeId}`);
      const reponsesData = reponsesRes.data.data || {};

      setReponses(reponsesData.reponses || []);
      setParcours(reponsesData.parcours || null);

      // Charger la correction existante si elle existe
      try {
        const correctionRes = await api.get(`/corrections/${userId}/${parcoursId}/${themeId}`);
        const correctionData = correctionRes.data.data;

        if (correctionData) {
          setCorrection({
            noteTheme: correctionData.noteTheme || 0,
            questionsCorrigees: correctionData.questionsCorrigees || [],
            commentaireGeneral: correctionData.commentaireGeneral || ''
          });
        } else {
          // Initialiser une correction vide
          initializeCorrection(reponsesData.reponses || []);
        }
      } catch (err) {
        // Pas de correction existante, initialiser une nouvelle
        initializeCorrection(reponsesData.reponses || []);
      }

      setError('');
    } catch (err) {
      console.error('Erreur lors du chargement des détails:', err);
      setError('Impossible de charger les détails');
    } finally {
      setDetailsLoading(false);
    }
  };

  const initializeCorrection = (reponsesData) => {
    const questionsCorrigees = reponsesData.map(r => ({
      questionId: r.questionId,
      estCorrect: false,
      commentaire: '',
      points: 0
    }));

    setCorrection({
      noteTheme: 0,
      questionsCorrigees,
      commentaireGeneral: ''
    });
  };

  const handleOpenDialog = async (apprenant, theme) => {
    setSelectedApprenant(apprenant);
    setSelectedTheme(theme);
    setDialogOpen(true);
    await fetchDetails(apprenant.utilisateur._id, apprenant.parcoursFormation._id, theme.themeId);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedApprenant(null);
    setSelectedTheme(null);
    setReponses([]);
    setParcours(null);
    setCorrection({
      noteTheme: 0,
      questionsCorrigees: [],
      commentaireGeneral: ''
    });
    setSaveMessage('');
  };

  const handleQuestionCorrectionChange = (questionId, field, value) => {
    setCorrection(prev => ({
      ...prev,
      questionsCorrigees: prev.questionsCorrigees.map(q =>
        q.questionId === questionId ? { ...q, [field]: value } : q
      )
    }));
  };

  const handleSaveCorrection = async () => {
    try {
      setSaveLoading(true);

      await api.post('/corrections', {
        utilisateurId: selectedApprenant.utilisateur._id,
        parcoursFormationId: selectedApprenant.parcoursFormation._id,
        themeId: selectedTheme.themeId,
        themeNumero: selectedTheme.themeNumero,
        themeTitre: selectedTheme.themeTitre,
        noteTheme: correction.noteTheme,
        questionsCorrigees: correction.questionsCorrigees,
        commentaireGeneral: correction.commentaireGeneral
      });

      setSaveMessage('Correction sauvegardée avec succès');

      // Rafraîchir la liste des apprenants
      await fetchApprenants();

      // Fermer le dialog après 2 secondes
      setTimeout(() => {
        handleCloseDialog();
      }, 2000);
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      setSaveMessage('Erreur lors de la sauvegarde');
    } finally {
      setSaveLoading(false);
    }
  };

  const getProgressionColor = (progression) => {
    if (progression === 100) return '#4CAF50';
    if (progression >= 50) return '#FF9800';
    return '#E31E24';
  };

  const getCorrectionStatus = (theme) => {
    if (theme.estCorrige) {
      return <Chip icon={<Check />} label="Corrigé" color="success" size="small" />;
    }
    if (theme.progression === 100) {
      return <Chip icon={<HourglassEmpty />} label="À corriger" color="warning" size="small" />;
    }
    return <Chip label="En cours" size="small" />;
  };

  const getQuestionFromParcours = (questionId) => {
    if (!parcours || !parcours.themes) return null;

    for (const theme of parcours.themes) {
      // Chercher dans les sections
      if (theme.sections) {
        for (const section of theme.sections) {
          // Questions principales
          if (section.questions) {
            const question = section.questions.find(q => q.id === questionId);
            if (question) return question;
          }

          // Sous-sections
          if (section.subsections) {
            for (const subsection of section.subsections) {
              if (subsection.questions) {
                const question = subsection.questions.find(q => q.id === questionId);
                if (question) return question;
              }
            }
          }
        }
      }

      // Chercher dans les applications
      if (theme.applications) {
        const application = theme.applications.find(app => app.id === questionId);
        if (application) return application;
      }
    }

    return null;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <School sx={{ fontSize: 40, color: '#0047AB' }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#0047AB' }}>
            Corrections Formation
          </Typography>
        </Box>
        <Tooltip title="Rafraîchir">
          <IconButton onClick={fetchApprenants} sx={{ color: '#0047AB' }}>
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#0047AB' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Apprenant</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Parcours</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Thème</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Progression</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Statut</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Note</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {apprenants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography color="textSecondary" sx={{ py: 3 }}>
                      Aucun apprenant n'a commencé la formation
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                apprenants.flatMap((apprenant) =>
                  apprenant.themes.map((theme, index) => (
                    <TableRow key={`${apprenant.utilisateur._id}-${theme.themeId}`} hover>
                      <TableCell>
                        <Typography sx={{ fontWeight: 600 }}>
                          {apprenant.utilisateur.prenom} {apprenant.utilisateur.nom}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {apprenant.utilisateur.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {apprenant.parcoursFormation.titre}
                        </Typography>
                        <Chip
                          label={apprenant.parcoursFormation.niveau}
                          size="small"
                          sx={{ mt: 0.5, bgcolor: '#E3F2FD', color: '#0047AB' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Thème {theme.themeNumero}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {theme.themeTitre.length > 40
                            ? theme.themeTitre.substring(0, 40) + '...'
                            : theme.themeTitre}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ flex: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={theme.progression}
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                bgcolor: 'rgba(0,0,0,0.1)',
                                '& .MuiLinearProgress-bar': {
                                  bgcolor: getProgressionColor(theme.progression)
                                }
                              }}
                            />
                          </Box>
                          <Typography variant="caption" sx={{ minWidth: 35, fontWeight: 600 }}>
                            {theme.progression}%
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="textSecondary">
                          {theme.questionsRepondues}/{theme.totalQuestions} questions
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        {getCorrectionStatus(theme)}
                      </TableCell>
                      <TableCell align="center">
                        {theme.noteTheme !== null && theme.noteTheme !== undefined ? (
                          <Chip
                            label={`${theme.noteTheme}/20`}
                            sx={{
                              bgcolor: theme.noteTheme >= 10 ? '#4CAF50' : '#E31E24',
                              color: 'white',
                              fontWeight: 'bold'
                            }}
                          />
                        ) : (
                          <Typography variant="caption" color="textSecondary">
                            Non noté
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<Visibility />}
                          onClick={() => handleOpenDialog(apprenant, theme)}
                          sx={{
                            bgcolor: '#0047AB',
                            '&:hover': { bgcolor: '#003380' }
                          }}
                        >
                          {theme.estCorrige ? 'Modifier' : 'Corriger'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Dialog de correction */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: '#0047AB', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6">Correction - {selectedApprenant?.utilisateur.prenom} {selectedApprenant?.utilisateur.nom}</Typography>
            <Typography variant="caption">
              {selectedTheme?.themeTitre}
            </Typography>
          </Box>
          <IconButton onClick={handleCloseDialog} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ mt: 2 }}>
          {detailsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* Note globale */}
              <Paper elevation={2} sx={{ p: 3, mb: 3, bgcolor: '#F5F5F5' }}>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <TextField
                        label="Note du thème (sur 20)"
                        type="number"
                        value={correction.noteTheme}
                        onChange={(e) => setCorrection({ ...correction, noteTheme: Math.min(20, Math.max(0, Number(e.target.value))) })}
                        inputProps={{ min: 0, max: 20, step: 0.5 }}
                        sx={{ bgcolor: 'white' }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h3" sx={{ fontWeight: 'bold', color: correction.noteTheme >= 10 ? '#4CAF50' : '#E31E24' }}>
                        {correction.noteTheme}/20
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>

              {/* Liste des réponses */}
              {reponses.map((reponse, index) => {
                const question = getQuestionFromParcours(reponse.questionId);
                const questionCorrection = correction.questionsCorrigees.find(
                  q => q.questionId === reponse.questionId
                ) || { estCorrect: false, commentaire: '', points: 0 };

                return (
                  <Card key={reponse.questionId} sx={{ mb: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                        <Typography
                          sx={{
                            bgcolor: '#0047AB',
                            color: 'white',
                            borderRadius: '50%',
                            width: 32,
                            height: 32,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            flexShrink: 0
                          }}
                        >
                          {index + 1}
                        </Typography>
                        <Box sx={{ flex: 1 }}>
                          {/* Verset */}
                          {question?.verset && (
                            <Chip
                              label={question.verset}
                              size="small"
                              sx={{ bgcolor: '#E3F2FD', color: '#0047AB', mb: 1 }}
                            />
                          )}

                          {/* Question avec réponse intégrée (pour questions à trous) ou normale */}
                          {question?.texte?.includes('...') ? (
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="caption" sx={{ color: '#666', fontWeight: 600, display: 'block', mb: 1 }}>
                                Question à compléter:
                              </Typography>
                              <Paper sx={{ p: 2, bgcolor: '#FFF9E6', borderLeft: '4px solid #FFA726' }}>
                                <Typography variant="body1" sx={{ fontWeight: 500, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                                  {question.texte.split('...').map((part, idx, arr) => (
                                    <React.Fragment key={idx}>
                                      <span>{part}</span>
                                      {idx < arr.length - 1 && (
                                        <Chip
                                          label={reponse.reponse || '(Pas de réponse)'}
                                          sx={{
                                            bgcolor: reponse.reponse ? '#E3F2FD' : '#FFEBEE',
                                            color: reponse.reponse ? '#0047AB' : '#C62828',
                                            fontWeight: 600,
                                            fontSize: '0.9rem'
                                          }}
                                        />
                                      )}
                                    </React.Fragment>
                                  ))}
                                </Typography>
                              </Paper>
                            </Box>
                          ) : (
                            <>
                              {/* Question normale */}
                              <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                                {question?.texte || question?.instruction || 'Question'}
                              </Typography>

                              {/* Réponse de l'apprenant */}
                              <Paper sx={{ p: 2, bgcolor: '#F5F5F5', mb: 2 }}>
                                <Typography variant="caption" sx={{ color: '#666', fontWeight: 600, display: 'block', mb: 1 }}>
                                  Réponse de l'apprenant:
                                </Typography>
                                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                                  {reponse.reponse || '(Pas de réponse)'}
                                </Typography>
                              </Paper>
                            </>
                          )}

                          <Divider sx={{ my: 2 }} />

                          {/* Correction */}
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                              <FormControl fullWidth size="small">
                                <InputLabel>Évaluation</InputLabel>
                                <Select
                                  value={questionCorrection.estCorrect}
                                  onChange={(e) => handleQuestionCorrectionChange(
                                    reponse.questionId,
                                    'estCorrect',
                                    e.target.value
                                  )}
                                  label="Évaluation"
                                >
                                  <MenuItem value={true}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <CheckCircle sx={{ color: '#4CAF50' }} />
                                      Correct
                                    </Box>
                                  </MenuItem>
                                  <MenuItem value={false}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <RadioButtonUnchecked sx={{ color: '#E31E24' }} />
                                      Incorrect
                                    </Box>
                                  </MenuItem>
                                </Select>
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} md={8}>
                              <TextField
                                fullWidth
                                size="small"
                                label="Commentaire"
                                value={questionCorrection.commentaire}
                                onChange={(e) => handleQuestionCorrectionChange(
                                  reponse.questionId,
                                  'commentaire',
                                  e.target.value
                                )}
                                placeholder="Commentaire pour l'apprenant..."
                              />
                            </Grid>
                          </Grid>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}

              {/* Commentaire général */}
              <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#0047AB', fontWeight: 'bold' }}>
                  Commentaire général
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={correction.commentaireGeneral}
                  onChange={(e) => setCorrection({ ...correction, commentaireGeneral: e.target.value })}
                  placeholder="Ajoutez un commentaire général sur le travail de l'apprenant pour ce thème..."
                />
              </Paper>

              {saveMessage && (
                <Alert severity={saveMessage.includes('succès') ? 'success' : 'error'} sx={{ mt: 2 }}>
                  {saveMessage}
                </Alert>
              )}
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, bgcolor: '#F5F5F5' }}>
          <Button onClick={handleCloseDialog} disabled={saveLoading}>
            Annuler
          </Button>
          <Button
            variant="contained"
            startIcon={saveLoading ? <CircularProgress size={20} /> : <Save />}
            onClick={handleSaveCorrection}
            disabled={saveLoading || detailsLoading}
            sx={{ bgcolor: '#4CAF50', '&:hover': { bgcolor: '#45A049' } }}
          >
            {saveLoading ? 'Sauvegarde...' : 'Sauvegarder la correction'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Corrections;

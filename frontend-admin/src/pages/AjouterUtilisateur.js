import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  MenuItem,
  Alert,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  InputAdornment
} from '@mui/material';
import { PersonAdd, ArrowBack, Visibility, VisibilityOff } from '@mui/icons-material';
import api from '../services/api';

const AjouterUtilisateur = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    password: '',
    confirmPassword: '',
    role: 'evangeliste'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Fonction pour formater le numéro de téléphone
  const formatPhoneNumber = (value) => {
    // Supprimer tous les caractères non numériques
    const numbers = value.replace(/\D/g, '');

    // Limiter à 10 chiffres
    const limited = numbers.slice(0, 10);

    // Formater avec des espaces tous les 2 chiffres
    const formatted = limited.match(/.{1,2}/g)?.join(' ') || limited;

    return formatted;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'telephone') {
      setFormData({
        ...formData,
        [name]: formatPhoneNumber(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...userData } = formData;

      // Ne pas envoyer l'email s'il est vide
      if (!userData.email || userData.email.trim() === '') {
        delete userData.email;
      }

      // Retirer les espaces du numéro de téléphone avant envoi
      if (userData.telephone) {
        userData.telephone = userData.telephone.replace(/\s/g, '');
      }

      const response = await api.post('/auth/register', userData);

      if (response.data.success) {
        setSuccess(`Utilisateur ${userData.prenom} ${userData.nom} créé avec succès!`);
        // Réinitialiser le formulaire
        setFormData({
          nom: '',
          prenom: '',
          email: '',
          telephone: '',
          password: '',
          confirmPassword: '',
          role: 'evangeliste'
        });

        // Rediriger vers la liste après 2 secondes
        setTimeout(() => {
          navigate('/utilisateurs');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création de l\'utilisateur');
    }

    setLoading(false);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/utilisateurs')}
          sx={{ mr: 2 }}
        >
          Retour
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#0047AB' }}>
          Ajouter un Utilisateur
        </Typography>
      </Box>

      <Paper sx={{ p: 4, maxWidth: 800 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ color: '#0047AB' }}>
                Informations Personnelles
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Prénom"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email (optionnel)"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Téléphone"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ color: '#0047AB', mt: 2 }}>
                Rôle et Permissions
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Rôle</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  label="Rôle"
                  disabled={loading}
                >
                  <MenuItem value="evangeliste">
                    Évangéliste
                  </MenuItem>
                  <MenuItem value="pasteur">
                    Pasteur
                  </MenuItem>
                  <MenuItem value="admin">
                    Administrateur
                  </MenuItem>
                  <MenuItem value="agent_call_center">
                    Agent Call Center
                  </MenuItem>
                </Select>
              </FormControl>
              <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                {formData.role === 'evangeliste' && '• Peut enregistrer des âmes, voir ses contacts, accéder aux ressources'}
                {formData.role === 'pasteur' && '• Accès complet à l\'interface admin + interface évangéliste'}
                {formData.role === 'admin' && '• Accès complet à toutes les fonctionnalités (admin + évangéliste)'}
                {formData.role === 'agent_call_center' && '• Accès au Call Center pour appeler et suivre les âmes enregistrées'}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ color: '#0047AB', mt: 2 }}>
                Mot de Passe
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Mot de passe"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                helperText="Minimum 6 caractères"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Confirmer le mot de passe"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={<PersonAdd />}
                  disabled={loading}
                  sx={{
                    bgcolor: '#0047AB',
                    '&:hover': { bgcolor: '#003380' }
                  }}
                >
                  {loading ? 'Création en cours...' : 'Créer l\'utilisateur'}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/utilisateurs')}
                  disabled={loading}
                >
                  Annuler
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mt: 3, bgcolor: '#E3F2FD' }}>
        <Typography variant="h6" gutterBottom sx={{ color: '#0047AB' }}>
          📋 Guide des Rôles
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={3}>
            <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#0047AB' }}>
                Évangéliste
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                • Enregistrer des âmes<br />
                • Voir ses propres contacts<br />
                • Accéder aux ressources<br />
                • Suivre ses parcours
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#FFA500' }}>
                Pasteur
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                • Tous les droits évangéliste<br />
                • Accès interface admin<br />
                • Voir toutes les âmes<br />
                • Gérer les ressources
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#E31E24' }}>
                Administrateur
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                • Tous les droits pasteur<br />
                • Créer des utilisateurs<br />
                • Gérer les rôles<br />
                • Accès complet système
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#2196F3' }}>
                Agent Call Center
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                • Accéder au Call Center<br />
                • Appeler les âmes<br />
                • Enregistrer les appels<br />
                • Suivre les conversations
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default AjouterUtilisateur;

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  IconButton,
  InputAdornment,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { Visibility, VisibilityOff, ArrowBack } from '@mui/icons-material';
import api from '../services/api';
import logoRehoboth from '../assets/logo-rehoboth-new.jpg';

const ForgotPassword = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    identifier: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const steps = ['Identification', 'Nouveau mot de passe'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleNext = async () => {
    if (activeStep === 0) {
      // Vérifier si l'utilisateur existe
      if (!formData.identifier) {
        setError('Veuillez saisir votre numéro de téléphone ou email');
        return;
      }
      setActiveStep(1);
    } else {
      // Réinitialiser le mot de passe
      await handleSubmit();
    }
  };

  const handleBack = () => {
    setActiveStep(0);
    setError('');
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    // Validation
    if (!formData.newPassword || !formData.confirmPassword) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);

    try {
      // Déterminer si c'est un email ou un téléphone
      const isEmail = formData.identifier.includes('@');
      const resetData = {
        [isEmail ? 'email' : 'telephone']: formData.identifier,
        newPassword: formData.newPassword
      };

      await api.post('/auth/reset-password', resetData);

      setSuccess('Mot de passe réinitialisé avec succès ! Redirection vers la page de connexion...');

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la réinitialisation du mot de passe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0047AB 0%, #E31E24 50%, #FFA500 100%)',
        py: 4
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            p: 5,
            borderRadius: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <img
              src={logoRehoboth}
              alt="Logo REHOBOTH"
              style={{
                width: '200px',
                height: 'auto',
                marginBottom: '20px',
                imageRendering: 'crisp-edges',
                WebkitFontSmoothing: 'antialiased'
              }}
            />
          </Box>

          <Typography
            component="h1"
            variant="h5"
            align="center"
            gutterBottom
            sx={{
              color: '#0047AB',
              fontWeight: 'bold',
              mb: 2,
              fontSize: { xs: '1.25rem', sm: '1.5rem' }
            }}
          >
            Réinitialiser le mot de passe
          </Typography>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Box>
            {activeStep === 0 && (
              <Box>
                <Typography variant="body2" sx={{ mb: 3, color: '#666', textAlign: 'center' }}>
                  Entrez votre numéro de téléphone ou email pour réinitialiser votre mot de passe
                </Typography>
                <TextField
                  required
                  fullWidth
                  id="identifier"
                  label="Numéro de téléphone ou Email"
                  name="identifier"
                  autoComplete="username"
                  autoFocus
                  value={formData.identifier}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#0047AB',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#0047AB',
                      }
                    }
                  }}
                />
              </Box>
            )}

            {activeStep === 1 && (
              <Box>
                <Typography variant="body2" sx={{ mb: 3, color: '#666', textAlign: 'center' }}>
                  Saisissez votre nouveau mot de passe
                </Typography>
                <TextField
                  required
                  fullWidth
                  name="newPassword"
                  label="Nouveau mot de passe"
                  type={showPassword ? 'text' : 'password'}
                  id="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirmer le mot de passe"
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Typography variant="caption" sx={{ mt: 1, display: 'block', color: '#666' }}>
                  Le mot de passe doit contenir au moins 6 caractères
                </Typography>
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
              {activeStep > 0 && (
                <Button
                  onClick={handleBack}
                  startIcon={<ArrowBack />}
                  sx={{
                    color: '#0047AB',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 71, 171, 0.1)'
                    }
                  }}
                >
                  Retour
                </Button>
              )}
              <Button
                fullWidth
                variant="contained"
                onClick={handleNext}
                disabled={loading}
                sx={{
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #0047AB 30%, #E31E24 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #003380 30%, #B71C1C 90%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(0, 71, 171, 0.4)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {loading ? 'Traitement...' : activeStep === steps.length - 1 ? 'Réinitialiser' : 'Suivant'}
              </Button>
            </Box>

            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#666',
                    fontWeight: 500,
                    '&:hover': {
                      color: '#E31E24',
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Retour à la connexion
                </Typography>
              </Link>
            </Box>
          </Box>

          <Box sx={{
            mt: 4,
            mx: -5,
            mb: -5,
            p: 3,
            textAlign: 'center',
            bgcolor: '#0047AB',
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12
          }}>
            <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
              Centre Missionnaire REHOBOTH - Côte d'Ivoire
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)', display: 'block', mb: 1 }}>
              Cocody Angré 8e Tranche derrière le magasin Phenicia
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)', display: 'block', mb: 2 }}>
              Contacts : 07 78 09 22 69 / 07 08 22 61 61
            </Typography>
            <Typography variant="body2" sx={{ color: 'white' }}>
              Powered by <strong style={{ color: '#FFA500', fontSize: '1.1em' }}>ALiz Strategy</strong>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ForgotPassword;

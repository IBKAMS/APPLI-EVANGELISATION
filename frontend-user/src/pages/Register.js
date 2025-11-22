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
  Grid,
  IconButton,
  InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import logoRehoboth from '../assets/logo-rehoboth-new.jpg';

const Register = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    const { confirmPassword, ...userData } = formData;
    const result = await register(userData);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }

    setLoading(false);
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
      <Container maxWidth="md">
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
            variant="h4"
            align="center"
            gutterBottom
            sx={{
              color: '#0047AB',
              fontWeight: 'bold',
              fontSize: { xs: '1.5rem', sm: '2rem' }
            }}
          >
            CENTRE MISSIONNAIRE REHOBOTH
          </Typography>

          <Typography
            variant="h6"
            align="center"
            sx={{
              color: '#E31E24',
              fontWeight: 500,
              fontSize: { xs: '1rem', sm: '1.25rem' }
            }}
            gutterBottom
          >
            Créer un compte évangéliste
          </Typography>

          <Typography
            variant="body1"
            align="center"
            sx={{
              mt: 1,
              mb: 4,
              color: '#666',
              fontStyle: 'italic'
            }}
          >
            Côte d'Ivoire
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Nom"
                  name="nom"
                  value={formData.nom}
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
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Prénom"
                  name="prenom"
                  value={formData.prenom}
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
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
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
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Téléphone"
                  name="telephone"
                  value={formData.telephone}
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
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
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
              disabled={loading}
            >
              {loading ? 'Inscription...' : 'S\'inscrire'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#0047AB',
                    fontWeight: 500,
                    '&:hover': {
                      color: '#E31E24',
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Déjà un compte ? Se connecter
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

export default Register;

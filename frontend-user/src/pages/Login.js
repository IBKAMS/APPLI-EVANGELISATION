import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  IconButton,
  InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import logoRehoboth from '../assets/logo-rehoboth-new.jpg';

const Login = () => {
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Déterminer si c'est un email ou un téléphone
    const isEmail = formData.identifier.includes('@');
    const loginData = isEmail
      ? { email: formData.identifier, password: formData.password }
      : { telephone: formData.identifier, password: formData.password };

    const result = await login(loginData);

    if (result.success) {
      // Utiliser window.location pour forcer un rechargement complet
      // et garantir que le nouveau contexte est chargé
      window.location.href = '/';
    } else {
      setError(result.message);
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
            variant="body1"
            align="center"
            sx={{
              color: '#E31E24',
              fontWeight: 600,
              mb: 3,
              fontSize: { xs: '0.9rem', sm: '1rem' }
            }}
          >
            MERA (Mission d'Évangélisation pour une Récolte Abondante)
          </Typography>

          <Typography
            component="h1"
            variant="h5"
            align="center"
            gutterBottom
            sx={{
              color: '#0047AB',
              fontWeight: 'bold',
              mb: 4,
              fontSize: { xs: '1.25rem', sm: '1.5rem' }
            }}
          >
            Connexion
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
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
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mot de passe"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
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
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
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
                  Mot de passe oublié ?
                </Typography>
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;

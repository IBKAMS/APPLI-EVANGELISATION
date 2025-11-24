import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Container,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Home,
  PersonAdd,
  People,
  MenuBook,
  AutoStories,
  Logout,
  AdminPanelSettings,
  Campaign
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import logoRehoboth from '../assets/logo-rehoboth-new.jpg';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  const handleAdminInterface = () => {
    // Copier le token et user vers les clés utilisées par l'interface admin
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminUser', user);
    }

    // Déterminer l'URL de l'interface admin selon l'environnement
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const adminUrl = isLocalhost
      ? 'http://localhost:3001'
      : 'https://cmr-ci.admin.jesus-roi.com';

    // Ouvrir l'interface admin dans un nouvel onglet
    window.open(adminUrl, '_blank');
    handleClose();
  };

  const menuItems = [
    { text: 'Accueil', icon: <Home />, path: '/' },
    { text: 'Enregistrer une âme', icon: <PersonAdd />, path: '/enregistrer-ame' },
    { text: 'Mes contacts', icon: <People />, path: '/mes-ames' },
    { text: 'Ressources', icon: <MenuBook />, path: '/ressources' },
    { text: 'Parcours', icon: <AutoStories />, path: '/parcours' },
    { text: 'Actualités', icon: <Campaign />, path: '/actualites' }
  ];

  return (
    <>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2, display: { xs: 'flex', md: 'none' } }}
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>

            <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                cursor: 'pointer'
              }}
              onClick={() => navigate('/')}
            >
              <img
                src={logoRehoboth}
                alt="Logo REHOBOTH"
                style={{
                  height: '40px',
                  width: 'auto'
                }}
              />
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{
                  fontWeight: 'bold',
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                CM REHOBOTH CI
              </Typography>
            </Box>

            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                const isActualites = item.text === 'Actualités';

                return (
                  <Button
                    key={item.text}
                    color="inherit"
                    onClick={() => navigate(item.path)}
                    sx={{
                      // Style pour la page active
                      ...(isActive && {
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        borderBottom: '3px solid #FFA500',
                        fontWeight: 'bold'
                      }),
                      // Animation scintillement pour Actualités
                      ...(isActualites && {
                        animation: 'sparkleNav 2s infinite',
                        fontWeight: 'bold',
                        '@keyframes sparkleNav': {
                          '0%, 100%': {
                            boxShadow: '0 0 10px #ffd700, 0 0 20px #ffd700',
                            backgroundColor: isActive ? 'rgba(255, 215, 0, 0.3)' : 'rgba(255, 215, 0, 0.2)',
                          },
                          '50%': {
                            boxShadow: '0 0 20px #ffd700, 0 0 30px #ffd700',
                            backgroundColor: 'rgba(255, 215, 0, 0.4)',
                          }
                        }
                      })
                    }}
                  >
                    {item.text}
                  </Button>
                );
              })}
              <Button
                color="inherit"
                onClick={handleLogout}
                startIcon={<Logout />}
                sx={{
                  color: '#FFD700',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                  }
                }}
              >
                Déconnexion
              </Button>
            </Box>

            <Box sx={{ ml: 2 }}>
              <IconButton
                size="large"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem disabled>
                  {user?.prenom} {user?.nom}
                </MenuItem>
                {(user?.role === 'admin' || user?.role === 'pasteur') && (
                  <MenuItem onClick={handleAdminInterface}>
                    <AdminPanelSettings sx={{ mr: 1 }} /> Interface Administration
                  </MenuItem>
                )}
                <MenuItem onClick={handleLogout}>
                  <Logout sx={{ mr: 1 }} /> Déconnexion
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 250 }} role="presentation">
          <Box sx={{ p: 2, textAlign: 'center', bgcolor: '#0047AB' }}>
            <img
              src={logoRehoboth}
              alt="Logo REHOBOTH"
              style={{ width: '100px', height: 'auto', marginBottom: '10px' }}
            />
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.9rem' }}>
              CM REHOBOTH CI
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              Évangélisation
            </Typography>
          </Box>
          <List>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              const isActualites = item.text === 'Actualités';

              return (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton
                    onClick={() => {
                      navigate(item.path);
                      setDrawerOpen(false);
                    }}
                    sx={{
                      // Style pour la page active
                      ...(isActive && {
                        backgroundColor: 'rgba(0, 71, 171, 0.1)',
                        borderLeft: '4px solid #FFA500',
                        fontWeight: 'bold'
                      }),
                      // Animation scintillement pour Actualités
                      ...(isActualites && {
                        animation: 'sparkleDrawer 2s infinite',
                        '@keyframes sparkleDrawer': {
                          '0%, 100%': {
                            boxShadow: 'inset 0 0 10px rgba(255, 215, 0, 0.5)',
                            backgroundColor: isActive ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255, 215, 0, 0.1)',
                          },
                          '50%': {
                            boxShadow: 'inset 0 0 20px rgba(255, 215, 0, 0.7)',
                            backgroundColor: 'rgba(255, 215, 0, 0.3)',
                          }
                        }
                      })
                    }}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontWeight: isActive ? 'bold' : 'normal'
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
          <Box sx={{ borderTop: 1, borderColor: 'divider', mt: 2 }}>
            <List>
              {(user?.role === 'admin' || user?.role === 'pasteur') && (
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      handleAdminInterface();
                      setDrawerOpen(false);
                    }}
                  >
                    <ListItemIcon>
                      <AdminPanelSettings />
                    </ListItemIcon>
                    <ListItemText primary="Interface Admin" />
                  </ListItemButton>
                </ListItem>
              )}
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    handleLogout();
                    setDrawerOpen(false);
                  }}
                  sx={{
                    color: '#E31E24',
                    '&:hover': {
                      backgroundColor: 'rgba(227, 30, 36, 0.1)',
                    }
                  }}
                >
                  <ListItemIcon>
                    <Logout sx={{ color: '#E31E24' }} />
                  </ListItemIcon>
                  <ListItemText primary="Déconnexion" />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;

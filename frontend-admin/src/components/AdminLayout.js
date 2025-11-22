import React, { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  People,
  PersonAdd,
  Phone,
  MenuBook,
  School,
  Campaign,
  BarChart,
  Settings,
  Logout,
  AccountCircle
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import logoRehoboth from '../assets/logo-rehoboth-new.jpg';
import Footer from './Footer';

const drawerWidth = 280;

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Tableau de Bord', icon: <Dashboard />, path: '/' },
    { text: 'Utilisateurs', icon: <People />, path: '/utilisateurs' },
    { text: 'Suivi des Âmes', icon: <PersonAdd />, path: '/suivi-ames' },
    { text: 'Call Center', icon: <Phone />, path: '/call-center' },
    { text: 'Ressources', icon: <MenuBook />, path: '/ressources' },
    { text: 'Parcours', icon: <School />, path: '/parcours' },
    { text: 'Campagnes', icon: <Campaign />, path: '/campagnes' },
    { text: 'Statistiques', icon: <BarChart />, path: '/statistiques' }
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleUserInterface = () => {
    // Copier le token et user de l'interface admin vers l'interface utilisateur
    const adminToken = localStorage.getItem('adminToken');
    const adminUser = localStorage.getItem('adminUser');

    if (adminToken && adminUser) {
      // Créer un timestamp unique pour forcer le rechargement
      const timestamp = new Date().getTime();

      // Ouvrir l'interface utilisateur avec les tokens dans l'URL
      // Le nouvel onglet lira les tokens et les sauvegardera dans son localStorage
      window.open(
        `http://localhost:3000?adminToken=${encodeURIComponent(adminToken)}&adminUser=${encodeURIComponent(adminUser)}&t=${timestamp}`,
        '_blank'
      );
    } else {
      // Si pas de tokens, ouvrir normalement
      window.open('http://localhost:3000', '_blank');
    }

    handleMenuClose();
  };

  const drawer = (
    <Box>
      <Box sx={{ p: 2, textAlign: 'center', bgcolor: '#0047AB' }}>
        <img
          src={logoRehoboth}
          alt="Logo REHOBOTH"
          style={{
            width: '140px',
            height: 'auto',
            marginBottom: '10px',
            imageRendering: 'crisp-edges',
            WebkitFontSmoothing: 'antialiased'
          }}
        />
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.9rem' }}>
          CM REHOBOTH CI
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
          Administration
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'rgba(0, 71, 171, 0.1)',
                  borderLeft: '4px solid #0047AB',
                  '& .MuiListItemIcon-root': {
                    color: '#0047AB'
                  },
                  '& .MuiListItemText-primary': {
                    color: '#0047AB',
                    fontWeight: 'bold'
                  }
                }
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
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
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', flex: 1 }}>
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            background: 'linear-gradient(45deg, #0047AB 30%, #E31E24 90%)'
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              Centre Missionnaire REHOBOTH
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
                {user?.prenom} {user?.nom}
              </Typography>
              <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                <Avatar sx={{ bgcolor: '#E31E24' }}>
                  {user?.prenom?.[0]}{user?.nom?.[0]}
                </Avatar>
              </IconButton>
            </Box>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleUserInterface}>
                <ListItemIcon>
                  <AccountCircle fontSize="small" />
                </ListItemIcon>
                Interface Évangéliste
              </MenuItem>
              <MenuItem onClick={() => { navigate('/parametres'); handleMenuClose(); }}>
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                Paramètres
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Déconnexion
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            mt: 8,
            bgcolor: '#f5f5f5'
          }}
        >
          <Outlet />
        </Box>
      </Box>
      <Box sx={{ width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` } }}>
        <Footer />
      </Box>
    </Box>
  );
};

export default AdminLayout;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import AdminLayout from './components/AdminLayout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Utilisateurs from './pages/Utilisateurs';
import AjouterUtilisateur from './pages/AjouterUtilisateur';
import SuiviAmes from './pages/SuiviAmes';
import CallCenter from './pages/CallCenter';
import Ressources from './pages/Ressources';
import Parcours from './pages/Parcours';
import Campagnes from './pages/Campagnes';
import Statistiques from './pages/Statistiques';

// Thème REHOBOTH
const theme = createTheme({
  palette: {
    primary: {
      main: '#0047AB',
      light: '#4A7EC7',
      dark: '#003380',
    },
    secondary: {
      main: '#E31E24',
      light: '#FF5252',
      dark: '#B71C1C',
    },
    warning: {
      main: '#FFA500',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <PrivateRoute>
                  <AdminLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="utilisateurs" element={<Utilisateurs />} />
              <Route path="utilisateurs/ajouter" element={<AjouterUtilisateur />} />
              <Route path="suivi-ames" element={<SuiviAmes />} />
              <Route path="call-center" element={<CallCenter />} />
              <Route path="ressources" element={<Ressources />} />
              <Route path="parcours" element={<Parcours />} />
              <Route path="campagnes" element={<Campagnes />} />
              <Route path="statistiques" element={<Statistiques />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './context/AuthContext';
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
import Corrections from './pages/Corrections';

// Composant pour protéger les routes admin (non accessible aux agents call center)
const AdminOnlyRoute = ({ children }) => {
  const { user } = useAuth();
  if (user?.role === 'agent_call_center') {
    return <Navigate to="/call-center" replace />;
  }
  return children;
};

// Composant pour la page d'accueil selon le rôle
const HomeRedirect = () => {
  const { user } = useAuth();
  if (user?.role === 'agent_call_center') {
    return <Navigate to="/call-center" replace />;
  }
  return <Dashboard />;
};

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
              <Route index element={<HomeRedirect />} />
              <Route path="utilisateurs" element={<AdminOnlyRoute><Utilisateurs /></AdminOnlyRoute>} />
              <Route path="utilisateurs/ajouter" element={<AdminOnlyRoute><AjouterUtilisateur /></AdminOnlyRoute>} />
              <Route path="suivi-ames" element={<AdminOnlyRoute><SuiviAmes /></AdminOnlyRoute>} />
              <Route path="call-center" element={<CallCenter />} />
              <Route path="ressources" element={<AdminOnlyRoute><Ressources /></AdminOnlyRoute>} />
              <Route path="parcours" element={<AdminOnlyRoute><Parcours /></AdminOnlyRoute>} />
              <Route path="campagnes" element={<AdminOnlyRoute><Campagnes /></AdminOnlyRoute>} />
              <Route path="statistiques" element={<AdminOnlyRoute><Statistiques /></AdminOnlyRoute>} />
              <Route path="corrections" element={<AdminOnlyRoute><Corrections /></AdminOnlyRoute>} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

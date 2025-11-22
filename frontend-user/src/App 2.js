import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Box } from '@mui/material';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import EnregistrerAme from './pages/EnregistrerAme';
import MesAmes from './pages/MesAmes';
import DetailAme from './pages/DetailAme';
import Ressources from './pages/Ressources';
import Parcours from './pages/Parcours';
import Actualites from './pages/Actualites';

// Thème REHOBOTH - Couleurs officielles
const theme = createTheme({
  palette: {
    primary: {
      main: '#0047AB', // Bleu REHOBOTH
      light: '#4A7EC7',
      dark: '#003380',
    },
    secondary: {
      main: '#E31E24', // Rouge REHOBOTH
      light: '#FF5252',
      dark: '#B71C1C',
    },
    warning: {
      main: '#FFA500', // Orange/Jaune REHOBOTH
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route
              path="/login"
              element={
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                  <Box sx={{ flex: 1 }}>
                    <Login />
                  </Box>
                  <Footer />
                </Box>
              }
            />
            <Route
              path="/register"
              element={
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                  <Box sx={{ flex: 1 }}>
                    <Register />
                  </Box>
                  <Footer />
                </Box>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                  <Box sx={{ flex: 1 }}>
                    <ForgotPassword />
                  </Box>
                  <Footer />
                </Box>
              }
            />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    <Navbar />
                    <Box sx={{ flex: 1 }}>
                      <Home />
                    </Box>
                    <Footer />
                  </Box>
                </PrivateRoute>
              }
            />
            <Route
              path="/enregistrer-ame"
              element={
                <PrivateRoute>
                  <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    <Navbar />
                    <Box sx={{ flex: 1 }}>
                      <EnregistrerAme />
                    </Box>
                    <Footer />
                  </Box>
                </PrivateRoute>
              }
            />
            <Route
              path="/mes-ames"
              element={
                <PrivateRoute>
                  <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    <Navbar />
                    <Box sx={{ flex: 1 }}>
                      <MesAmes />
                    </Box>
                    <Footer />
                  </Box>
                </PrivateRoute>
              }
            />
            <Route
              path="/ame/:id"
              element={
                <PrivateRoute>
                  <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    <Navbar />
                    <Box sx={{ flex: 1 }}>
                      <DetailAme />
                    </Box>
                    <Footer />
                  </Box>
                </PrivateRoute>
              }
            />
            <Route
              path="/ressources"
              element={
                <PrivateRoute>
                  <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    <Navbar />
                    <Box sx={{ flex: 1 }}>
                      <Ressources />
                    </Box>
                    <Footer />
                  </Box>
                </PrivateRoute>
              }
            />
            <Route
              path="/parcours"
              element={
                <PrivateRoute>
                  <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    <Navbar />
                    <Box sx={{ flex: 1 }}>
                      <Parcours />
                    </Box>
                    <Footer />
                  </Box>
                </PrivateRoute>
              }
            />
            <Route
              path="/actualites"
              element={
                <PrivateRoute>
                  <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    <Navbar />
                    <Box sx={{ flex: 1 }}>
                      <Actualites />
                    </Box>
                    <Footer />
                  </Box>
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

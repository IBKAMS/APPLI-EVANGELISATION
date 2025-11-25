import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import EnregistrerAme from './pages/EnregistrerAme';
import MesAmes from './pages/MesAmes';
import DetailAme from './pages/DetailAme';
import Ressources from './pages/Ressources';
import Parcours from './pages/Parcours';
import Actualites from './pages/Actualites';
import Formation from './pages/Formation';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Routes publiques (authentification) */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />}/>

              {/* Page d'accueil protégée */}
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Home />
                  </PrivateRoute>
                }
              />

              {/* Routes protégées */}
              <Route
                path="/enregistrer-ame"
                element={
                  <PrivateRoute>
                    <EnregistrerAme />
                  </PrivateRoute>
                }
              />
              <Route
                path="/mes-ames"
                element={
                  <PrivateRoute>
                    <MesAmes />
                  </PrivateRoute>
                }
              />
              <Route
                path="/ame/:id"
                element={
                  <PrivateRoute>
                    <DetailAme />
                  </PrivateRoute>
                }
              />
              <Route
                path="/ressources"
                element={
                  <PrivateRoute>
                    <Ressources />
                  </PrivateRoute>
                }
              />
              <Route
                path="/parcours"
                element={
                  <PrivateRoute>
                    <Parcours />
                  </PrivateRoute>
                }
              />
              <Route
                path="/actualites"
                element={
                  <PrivateRoute>
                    <Actualites />
                  </PrivateRoute>
                }
              />
              <Route
                path="/formation"
                element={
                  <PrivateRoute>
                    <Formation />
                  </PrivateRoute>
                }
              />

              {/* Redirection pour routes non trouvées */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

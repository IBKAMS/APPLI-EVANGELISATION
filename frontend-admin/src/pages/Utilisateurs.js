import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  Alert,
  Snackbar
} from '@mui/material';
import { Edit, Delete, PersonAdd } from '@mui/icons-material';
import api from '../services/api';

const Utilisateurs = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    role: '',
    password: '',
    confirmPassword: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Fonction pour formater le numéro de téléphone
  const formatPhoneNumber = (value) => {
    if (!value) return '';
    const numbers = value.replace(/\D/g, '');
    const limited = numbers.slice(0, 10);
    const formatted = limited.match(/.{1,2}/g)?.join(' ') || limited;
    return formatted;
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/auth/users');
      setUsers(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Erreur:', error);
      setLoading(false);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'pasteur':
        return 'warning';
      case 'agent_call_center':
        return 'info';
      case 'evangeliste':
        return 'success';
      default:
        return 'primary';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin':
        return 'Administrateur';
      case 'pasteur':
        return 'Pasteur';
      case 'agent_call_center':
        return 'Call Center';
      case 'evangeliste':
        return 'Évangéliste';
      default:
        return role;
    }
  };

  const getRoleDescription = (role) => {
    switch (role) {
      case 'admin':
        return 'Tous les droits d\'administration';
      case 'pasteur':
        return 'Peut gérer les utilisateurs et voir toutes les âmes';
      case 'evangeliste':
        return 'Peut enregistrer des âmes, voir ses contacts, accéder aux ressources';
      case 'agent_call_center':
        return 'Accès au Call Center pour appeler et suivre les âmes enregistrées';
      default:
        return '';
    }
  };

  const handleOpenEditDialog = (user) => {
    setSelectedUser(user);
    setEditFormData({
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      telephone: formatPhoneNumber(user.telephone),
      role: user.role,
      password: '',
      confirmPassword: ''
    });
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedUser(null);
    setEditFormData({
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      role: '',
      password: '',
      confirmPassword: ''
    });
  };

  const handleEditFormChange = (field, value) => {
    if (field === 'telephone') {
      setEditFormData({ ...editFormData, [field]: formatPhoneNumber(value) });
    } else {
      setEditFormData({ ...editFormData, [field]: value });
    }
  };

  const handleUpdateUser = async () => {
    // Validation
    if (!editFormData.nom || !editFormData.prenom || !editFormData.telephone || !editFormData.role) {
      setSnackbar({ open: true, message: 'Veuillez remplir tous les champs obligatoires', severity: 'error' });
      return;
    }

    // Validation du mot de passe si fourni
    if (editFormData.password) {
      if (editFormData.password.length < 6) {
        setSnackbar({ open: true, message: 'Le mot de passe doit contenir au moins 6 caractères', severity: 'error' });
        return;
      }
      if (editFormData.password !== editFormData.confirmPassword) {
        setSnackbar({ open: true, message: 'Les mots de passe ne correspondent pas', severity: 'error' });
        return;
      }
    }

    try {
      const updateData = {
        nom: editFormData.nom,
        prenom: editFormData.prenom,
        telephone: editFormData.telephone.replace(/\s/g, ''),
        role: editFormData.role
      };

      // Ajouter l'email seulement s'il est fourni
      if (editFormData.email && editFormData.email.trim() !== '') {
        updateData.email = editFormData.email;
      }

      // Ajouter le mot de passe seulement s'il est fourni
      if (editFormData.password) {
        updateData.password = editFormData.password;
      }

      await api.put(`/auth/users/${selectedUser._id}`, updateData);
      setSnackbar({ open: true, message: 'Utilisateur modifié avec succès', severity: 'success' });
      handleCloseEditDialog();
      fetchUsers();
    } catch (error) {
      console.error('Erreur:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Erreur lors de la modification',
        severity: 'error'
      });
    }
  };

  const handleOpenDeleteDialog = (user) => {
    setSelectedUser(user);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = async () => {
    try {
      await api.delete(`/auth/users/${selectedUser._id}`);
      setSnackbar({ open: true, message: 'Utilisateur supprimé avec succès', severity: 'success' });
      handleCloseDeleteDialog();
      fetchUsers();
    } catch (error) {
      console.error('Erreur:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Erreur lors de la suppression',
        severity: 'error'
      });
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#0047AB' }}>
          Gestion des Utilisateurs
        </Typography>
        <Button
          variant="contained"
          startIcon={<PersonAdd />}
          sx={{ bgcolor: '#0047AB' }}
          onClick={() => navigate('/utilisateurs/ajouter')}
        >
          Ajouter un utilisateur
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: '#0047AB' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nom</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Prénom</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Téléphone</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Rôle</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id} hover>
                <TableCell>{user.nom}</TableCell>
                <TableCell>{user.prenom}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{formatPhoneNumber(user.telephone)}</TableCell>
                <TableCell>
                  <Chip
                    label={getRoleLabel(user.role)}
                    color={getRoleColor(user.role)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleOpenEditDialog(user)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleOpenDeleteDialog(user)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog de modification */}
      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
          }
        }}
      >
        <DialogTitle sx={{ bgcolor: '#0047AB', color: 'white', py: 3, fontSize: '1.5rem', fontWeight: 'bold' }}>
          ✏️ Modifier l'utilisateur
        </DialogTitle>
        <DialogContent sx={{ mt: 3, pb: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 1, color: '#0047AB', fontWeight: 'bold', fontSize: '1.1rem' }}>
                📋 Informations Personnelles
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nom"
                required
                value={editFormData.nom}
                onChange={(e) => handleEditFormChange('nom', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Prénom"
                required
                value={editFormData.prenom}
                onChange={(e) => handleEditFormChange('prenom', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email (optionnel)"
                type="email"
                value={editFormData.email}
                onChange={(e) => handleEditFormChange('email', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Téléphone"
                required
                value={editFormData.telephone}
                onChange={(e) => handleEditFormChange('telephone', e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 1, color: '#0047AB', fontWeight: 'bold', fontSize: '1.1rem', mt: 2 }}>
                👤 Rôle et Permissions
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Rôle"
                required
                value={editFormData.role}
                onChange={(e) => handleEditFormChange('role', e.target.value)}
                helperText={getRoleDescription(editFormData.role)}
              >
                <MenuItem value="evangeliste">Évangéliste</MenuItem>
                <MenuItem value="pasteur">Pasteur</MenuItem>
                <MenuItem value="admin">Administrateur</MenuItem>
                <MenuItem value="agent_call_center">Agent Call Center</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 0.5, color: '#0047AB', fontWeight: 'bold', fontSize: '1.1rem', mt: 2 }}>
                🔐 Modifier le Mot de Passe (Optionnel)
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                Laissez vide si vous ne souhaitez pas changer le mot de passe
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nouveau mot de passe"
                type="password"
                value={editFormData.password}
                onChange={(e) => handleEditFormChange('password', e.target.value)}
                helperText="Minimum 6 caractères"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Confirmer le mot de passe"
                type="password"
                value={editFormData.confirmPassword}
                onChange={(e) => handleEditFormChange('confirmPassword', e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseEditDialog} sx={{ color: '#666' }}>
            Annuler
          </Button>
          <Button
            onClick={handleUpdateUser}
            variant="contained"
            sx={{ bgcolor: '#0047AB' }}
          >
            Enregistrer les modifications
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de suppression */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle sx={{ color: '#E31E24' }}>
          Confirmer la suppression
        </DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer l'utilisateur <strong>{selectedUser?.prenom} {selectedUser?.nom}</strong> ?
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            Cette action est irréversible et supprimera définitivement cet utilisateur.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} sx={{ color: '#666' }}>
            Annuler
          </Button>
          <Button
            onClick={handleDeleteUser}
            variant="contained"
            color="error"
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar pour les notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Utilisateurs;

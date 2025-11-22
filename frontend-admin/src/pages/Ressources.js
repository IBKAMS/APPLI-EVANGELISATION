import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  FormHelperText
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import api from '../services/api';

const Ressources = () => {
  const [ressources, setRessources] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingRessource, setEditingRessource] = useState(null);
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    categorie: '',
    type: '',
    url: '',
    fichier: null,
    contenu: ''
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchRessources();
  }, []);

  const fetchRessources = async () => {
    try {
      const response = await api.get('/ressources');
      setRessources(response.data.data || []);
    } catch (error) {
      console.error('Erreur:', error);
      showSnackbar('Erreur lors du chargement des ressources', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenDialog = (ressource = null) => {
    if (ressource) {
      setEditingRessource(ressource);
      setFormData({
        titre: ressource.titre || '',
        description: ressource.description || '',
        categorie: ressource.categorie || '',
        type: ressource.type || '',
        url: ressource.url || '',
        fichier: null,
        contenu: ressource.contenu || ''
      });
    } else {
      setEditingRessource(null);
      setFormData({
        titre: '',
        description: '',
        categorie: '',
        type: '',
        url: '',
        fichier: null,
        contenu: ''
      });
    }
    setErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingRessource(null);
    setFormData({
      titre: '',
      description: '',
      categorie: '',
      type: '',
      url: '',
      fichier: null,
      contenu: ''
    });
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'fichier') {
      setFormData({
        ...formData,
        fichier: files[0]
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.titre.trim()) {
      newErrors.titre = 'Le titre est requis';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }
    if (!formData.categorie) {
      newErrors.categorie = 'La catégorie est requise';
    }
    if (!formData.type) {
      newErrors.type = 'Le type est requis';
    }
    if (!formData.url.trim()) {
      newErrors.url = 'L\'URL est requise';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      showSnackbar('Veuillez remplir tous les champs requis', 'error');
      return;
    }

    setLoading(true);
    try {
      const submitData = new FormData();
      submitData.append('titre', formData.titre);
      submitData.append('description', formData.description);
      submitData.append('categorie', formData.categorie);
      submitData.append('type', formData.type);
      submitData.append('url', formData.url);
      if (formData.contenu) {
        submitData.append('contenu', formData.contenu);
      }
      if (formData.fichier) {
        submitData.append('fichier', formData.fichier);
      }

      if (editingRessource) {
        // Update existing resource
        await api.put(`/ressources/${editingRessource._id}`, submitData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        showSnackbar('Ressource mise à jour avec succès', 'success');
      } else {
        // Create new resource
        await api.post('/ressources', submitData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        showSnackbar('Ressource créée avec succès', 'success');
      }

      fetchRessources();
      handleCloseDialog();
    } catch (error) {
      console.error('Erreur:', error);
      showSnackbar(
        error.response?.data?.message || 'Erreur lors de l\'enregistrement',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpenConfirmDelete = (id) => {
    setDeleteId(id);
    setOpenConfirmDelete(true);
  };

  const handleCloseConfirmDelete = () => {
    setOpenConfirmDelete(false);
    setDeleteId(null);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    setLoading(true);
    try {
      await api.delete(`/ressources/${deleteId}`);
      showSnackbar('Ressource supprimée avec succès', 'success');
      fetchRessources();
      handleCloseConfirmDelete();
    } catch (error) {
      console.error('Erreur:', error);
      showSnackbar(
        error.response?.data?.message || 'Erreur lors de la suppression',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#0047AB' }}>
          Ressources Bibliques
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{ bgcolor: '#0047AB', '&:hover': { bgcolor: '#003380' } }}
          onClick={() => handleOpenDialog()}
        >
          Ajouter une ressource
        </Button>
      </Box>

      <Grid container spacing={3}>
        {ressources.map((ressource) => (
          <Grid item xs={12} md={6} key={ressource._id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#0047AB', flex: 1 }}>
                    {ressource.titre}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(ressource)}
                      sx={{ color: '#0047AB' }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenConfirmDelete(ressource._id)}
                      sx={{ color: '#E31E24' }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
                <Typography variant="body2" color="textSecondary" paragraph>
                  {ressource.description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip label={ressource.categorie} color="primary" size="small" />
                  <Chip label={ressource.type} variant="outlined" size="small" />
                  <Chip
                    label={`${ressource.nombrePartages || 0} partages`}
                    color="success"
                    size="small"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Create/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: '#0047AB', color: 'white' }}>
          {editingRessource ? 'Modifier la ressource' : 'Ajouter une ressource'}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Titre"
            name="titre"
            value={formData.titre}
            onChange={handleChange}
            margin="normal"
            required
            error={!!errors.titre}
            helperText={errors.titre}
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            margin="normal"
            required
            multiline
            rows={3}
            error={!!errors.description}
            helperText={errors.description}
          />
          <FormControl
            fullWidth
            margin="normal"
            required
            error={!!errors.categorie}
          >
            <InputLabel>Catégorie</InputLabel>
            <Select
              name="categorie"
              value={formData.categorie}
              onChange={handleChange}
              label="Catégorie"
            >
              <MenuItem value="Formation">Formation</MenuItem>
              <MenuItem value="Prière">Prière</MenuItem>
              <MenuItem value="Témoignage">Témoignage</MenuItem>
              <MenuItem value="Doctrine">Doctrine</MenuItem>
              <MenuItem value="Autre">Autre</MenuItem>
            </Select>
            {errors.categorie && <FormHelperText>{errors.categorie}</FormHelperText>}
          </FormControl>
          <FormControl
            fullWidth
            margin="normal"
            required
            error={!!errors.type}
          >
            <InputLabel>Type</InputLabel>
            <Select
              name="type"
              value={formData.type}
              onChange={handleChange}
              label="Type"
            >
              <MenuItem value="Document">Document</MenuItem>
              <MenuItem value="Vidéo">Vidéo</MenuItem>
              <MenuItem value="Audio">Audio</MenuItem>
              <MenuItem value="Article">Article</MenuItem>
            </Select>
            {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
          </FormControl>
          <TextField
            fullWidth
            label="URL"
            name="url"
            value={formData.url}
            onChange={handleChange}
            margin="normal"
            required
            error={!!errors.url}
            helperText={errors.url}
          />
          <Box sx={{ mt: 2, mb: 2 }}>
            <input
              accept="*/*"
              style={{ display: 'none' }}
              id="fichier-upload"
              type="file"
              name="fichier"
              onChange={handleChange}
            />
            <label htmlFor="fichier-upload">
              <Button variant="outlined" component="span" fullWidth>
                {formData.fichier ? formData.fichier.name : 'Choisir un fichier (optionnel)'}
              </Button>
            </label>
          </Box>
          <TextField
            fullWidth
            label="Contenu (Markdown)"
            name="contenu"
            value={formData.contenu}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={4}
            placeholder="Contenu optionnel en format Markdown"
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} disabled={loading}>
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{ bgcolor: '#0047AB', '&:hover': { bgcolor: '#003380' } }}
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openConfirmDelete}
        onClose={handleCloseConfirmDelete}
      >
        <DialogTitle sx={{ bgcolor: '#E31E24', color: 'white' }}>
          Confirmer la suppression
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography>
            Êtes-vous sûr de vouloir supprimer cette ressource ? Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseConfirmDelete} disabled={loading}>
            Annuler
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            sx={{ bgcolor: '#E31E24', '&:hover': { bgcolor: '#c01a1f' } }}
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            {loading ? 'Suppression...' : 'Supprimer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Ressources;

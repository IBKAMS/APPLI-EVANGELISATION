import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  MenuItem,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Checkbox,
  ListItemText,
  Select,
  OutlinedInput,
  FormControl,
  InputLabel,
  FormHelperText,
  Tooltip
} from '@mui/material';
import api from '../services/api';

const steps = ['Informations personnelles', 'Informations de la rencontre', 'Informations spirituelles'];

// Communes d'Abidjan et grandes villes de Côte d'Ivoire
const communesEtVilles = [
  // Communes d'Abidjan
  'Abobo',
  'Adjamé',
  'Attécoubé',
  'Cocody',
  'Koumassi',
  'Marcory',
  'Plateau',
  'Port-Bouët',
  'Treichville',
  'Yopougon',
  'Bingerville',
  'Songon',
  'Anyama',
  'Bassam',
  // Autres grandes villes
  'Yamoussoukro',
  'Bouaké',
  'Daloa',
  'San-Pédro',
  'Korhogo',
  'Man',
  'Abengourou',
  'Gagnoa',
  'Divo',
  'Agboville',
  'Adzopé',
  'Soubré',
  'Dabou',
  'Grand-Bassam',
  'Duekoué',
  'Bondoukou',
  'Odienné',
  'Séguéla',
  'Ferkessédougou',
  'Sassandra',
  'Toumodi',
  'Issia',
  'Tiassalé',
  'Sinfra',
  'Autre'
];

// Communes/Villes avec leurs quartiers principaux
const quartiersParCommune = {
  'Abobo': ['Abobo-Gare', 'Abobo-PK18', 'Abobo-Baoulé', 'Abobo-Derrière Rails', 'Abobo-Avocatier', 'Abobo-Sagbé', 'Abobo-N\'Dotré', 'Autre'],
  'Adjamé': ['Adjamé-Liberté', 'Adjamé-Williamsville', 'Adjamé-Bracodi', 'Adjamé-Marché', '220 Logements', 'Autre'],
  'Attécoubé': ['Attécoubé-Santé', 'Attécoubé-Locodjro', 'Attécoubé-Agban', 'Attécoubé-Village', 'Autre'],
  'Cocody': ['Cocody-Angré', 'Cocody-Riviera', 'Cocody-Deux-Plateaux', 'Cocody-Vallon', 'Cocody-Blockhaus', 'Cocody-Ambassades', 'Cocody-Danga', 'Cocody-Saint-Jean', 'Cocody-Bonoumin', 'Cocody-Faya', 'Autre'],
  'Koumassi': ['Koumassi-Remblais', 'Koumassi-Grand Campement', 'Koumassi-Zone Industrielle', 'Koumassi-Sicogi', 'Koumassi-Anani', 'Autre'],
  'Marcory': ['Marcory-Zone 4', 'Marcory-Zone 3', 'Marcory-Anoumambo', 'Marcory-Biétry', 'Marcory-Résidentiel', 'Autre'],
  'Plateau': ['Plateau-Centre Ville', 'Plateau-Administratif', 'Plateau-Banques', 'Autre'],
  'Port-Bouët': ['Port-Bouët-Zone 4', 'Port-Bouët-Vridi', 'Port-Bouët-Gonzagueville', 'Port-Bouët-Aéroport', 'Port-Bouët-Beach', 'Autre'],
  'Treichville': ['Treichville-Zone 1', 'Treichville-Zone 2', 'Treichville-Zone 3', 'Treichville-Zone 4', 'Treichville-Arras', 'Autre'],
  'Yopougon': ['Yopougon-Niangon', 'Yopougon-Sicogi', 'Yopougon-Maroc', 'Yopougon-Gesco', 'Yopougon-Siporex', 'Yopougon-Andokoi', 'Yopougon-Port-Bouët 2', 'Yopougon-Koweït', 'Yopougon-Selmer', 'Yopougon-Wassakara', 'Autre'],
  'Bingerville': ['Bingerville-Centre', 'Bingerville-Akandjé', 'Bingerville-Village', 'Autre'],
  'Songon': ['Songon-Agban', 'Songon-M\'Bratté', 'Songon-Dagbé', 'Autre'],
  'Anyama': ['Anyama-Centre', 'Anyama-Village', 'Anyama-Anonkoua', 'Autre'],
  'Bassam': ['Bassam-Centre', 'Bassam-Ancien Bassam', 'Bassam-Mondoukou', 'Bassam-Moossou', 'Autre'],
  'Yamoussoukro': ['Yamoussoukro-Centre', 'Yamoussoukro-Habitat', 'Yamoussoukro-Millionaire', 'Yamoussoukro-Commerce', 'Autre'],
  'Bouaké': ['Bouaké-Centre', 'Bouaké-Air France', 'Bouaké-Belleville', 'Bouaké-Commerce', 'Bouaké-Dar Es Salam', 'Autre'],
  'Daloa': ['Daloa-Centre', 'Daloa-Commerce', 'Daloa-Tazibouo', 'Daloa-Lobia', 'Autre'],
  'San-Pédro': ['San-Pédro-Centre', 'San-Pédro-Bardot', 'San-Pédro-Port', 'Autre'],
  'Korhogo': ['Korhogo-Centre', 'Korhogo-Petit Paris', 'Korhogo-Koko', 'Autre'],
  'Man': ['Man-Centre', 'Man-Commerce', 'Man-Dompleu', 'Autre'],
  'Abengourou': ['Abengourou-Centre', 'Abengourou-Commerce', 'Autre'],
  'Gagnoa': ['Gagnoa-Centre', 'Gagnoa-Commerce', 'Gagnoa-Dioulabougou', 'Autre'],
  'Divo': ['Divo-Centre', 'Divo-Commerce', 'Autre'],
  'Agboville': ['Agboville-Centre', 'Agboville-Commerce', 'Autre'],
  'Adzopé': ['Adzopé-Centre', 'Adzopé-Commerce', 'Autre'],
  'Soubré': ['Soubré-Centre', 'Soubré-Commerce', 'Autre'],
  'Dabou': ['Dabou-Centre', 'Dabou-Commerce', 'Autre'],
  'Grand-Bassam': ['Grand-Bassam-Centre', 'Grand-Bassam-Phare', 'Grand-Bassam-France', 'Autre'],
  'Duekoué': ['Duekoué-Centre', 'Duekoué-Commerce', 'Autre'],
  'Bondoukou': ['Bondoukou-Centre', 'Bondoukou-Commerce', 'Autre'],
  'Odienné': ['Odienné-Centre', 'Odienné-Commerce', 'Autre'],
  'Séguéla': ['Séguéla-Centre', 'Séguéla-Commerce', 'Autre'],
  'Ferkessédougou': ['Ferkessédougou-Centre', 'Ferkessédougou-Commerce', 'Autre'],
  'Sassandra': ['Sassandra-Centre', 'Sassandra-Port', 'Autre'],
  'Toumodi': ['Toumodi-Centre', 'Toumodi-Commerce', 'Autre'],
  'Issia': ['Issia-Centre', 'Issia-Commerce', 'Autre'],
  'Tiassalé': ['Tiassalé-Centre', 'Tiassalé-Commerce', 'Autre'],
  'Sinfra': ['Sinfra-Centre', 'Sinfra-Commerce', 'Autre']
};

// Liste des professions
const professions = [
  'Étudiant(e)',
  'Élève',
  'Enseignant(e)',
  'Professeur',
  'Médecin',
  'Infirmier(ère)',
  'Pharmacien(ne)',
  'Commerçant(e)',
  'Entrepreneur',
  'Agriculteur/Agricultrice',
  'Éleveur/Éleveuse',
  'Fonctionnaire',
  'Ingénieur',
  'Informaticien(ne)',
  'Comptable',
  'Banquier/Banquière',
  'Avocat(e)',
  'Journaliste',
  'Chauffeur/Chauffeuse',
  'Mécanicien(ne)',
  'Électricien(ne)',
  'Plombier',
  'Menuisier/Menuisière',
  'Maçon',
  'Couturier/Couturière',
  'Coiffeur/Coiffeuse',
  'Restaurateur/Restauratrice',
  'Cuisinier/Cuisinière',
  'Vendeur/Vendeuse',
  'Agent de sécurité',
  'Policier/Policière',
  'Militaire',
  'Artisan(e)',
  'Artiste',
  'Sportif/Sportive',
  'Sans emploi',
  'Retraité(e)',
  'Femme/Homme au foyer',
  'Autre'
];

// Liste des besoins de prière
const besoinsPriereOptions = [
  'Guérison physique',
  'Guérison émotionnelle',
  'Délivrance spirituelle',
  'Recherche d\'emploi',
  'Problèmes financiers',
  'Problèmes familiaux',
  'Problèmes conjugaux',
  'Infertilité / Désir d\'enfant',
  'Problèmes avec les enfants',
  'Réussite scolaire / Études',
  'Réussite professionnelle',
  'Voyage / Visa',
  'Logement',
  'Mariage',
  'Dépression / Anxiété',
  'Addiction (alcool, drogue, etc.)',
  'Protection divine',
  'Guidance / Direction divine',
  'Croissance spirituelle',
  'Réconciliation',
  'Autre'
];

// Fonction pour formater le numéro de téléphone (XX XX XX XX XX)
const formatPhoneNumber = (value) => {
  // Retirer tout ce qui n'est pas un chiffre
  const numbers = value.replace(/\D/g, '');
  // Limiter à 10 chiffres
  const limited = numbers.slice(0, 10);
  // Ajouter des espaces tous les 2 chiffres
  const formatted = limited.replace(/(\d{2})(?=\d)/g, '$1 ');
  return formatted;
};

// Fonction pour obtenir le nombre de chiffres (sans espaces)
const getDigitsCount = (value) => {
  return value.replace(/\D/g, '').length;
};

const EnregistrerAme = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [communeRencontre, setCommuneRencontre] = useState('');
  const [quartierRencontre, setQuartierRencontre] = useState('');
  const [selectedBesoinsPriere, setSelectedBesoinsPriere] = useState([]);
  const [ameId, setAmeId] = useState(null); // ID de l'âme créée
  const [saveMessage, setSaveMessage] = useState(''); // Message de sauvegarde réussie
  const [phoneError, setPhoneError] = useState(''); // Erreur de validation téléphone

  const [formData, setFormData] = useState({
    // Informations personnelles
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    adresse: '',
    commune: '',
    ville: '',
    age: '',
    sexe: '',
    situationMatrimoniale: '',
    nombreEnfants: 0,
    profession: '',

    // Informations de la rencontre
    typeRencontre: '',
    lieuRencontre: '',
    dateRencontre: new Date().toISOString().split('T')[0],
    nomInviteur: '',

    // Informations spirituelles
    statutSpirituel: 'Non-converti',
    ancienneEglise: '',
    besoinsPriere: '',
    notes: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Gestion spéciale du téléphone avec formatage
  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    const digitsCount = getDigitsCount(formatted);
    const digits = formatted.replace(/\s/g, '');

    setFormData({
      ...formData,
      telephone: formatted
    });

    // Validation en temps réel
    if (digitsCount > 0 && digits[0] !== '0') {
      setPhoneError('Le numéro doit commencer par 0');
    } else if (digitsCount > 0 && digitsCount < 10) {
      setPhoneError(`${digitsCount}/10 chiffres - Veuillez saisir 10 chiffres`);
    } else if (digitsCount === 10) {
      setPhoneError('');
    } else {
      setPhoneError('');
    }
  };

  const handleCommuneRencontreChange = (e) => {
    const selectedCommune = e.target.value;
    setCommuneRencontre(selectedCommune);
    setQuartierRencontre(''); // Reset quartier when commune changes

    // Update lieuRencontre to just the commune if no quartier selected
    setFormData({
      ...formData,
      lieuRencontre: selectedCommune
    });
  };

  const handleQuartierRencontreChange = (e) => {
    const selectedQuartier = e.target.value;
    setQuartierRencontre(selectedQuartier);

    // Update lieuRencontre to commune + quartier
    setFormData({
      ...formData,
      lieuRencontre: `${communeRencontre} - ${selectedQuartier}`
    });
  };

  const handleBesoinsPriereChange = (event) => {
    const {
      target: { value },
    } = event;
    const selectedValues = typeof value === 'string' ? value.split(',') : value;
    setSelectedBesoinsPriere(selectedValues);

    // Update formData with the selected values as array
    setFormData({
      ...formData,
      besoinsPriere: selectedValues.join(', ')
    });
  };

  const handleNext = async () => {
    // Validation pour chaque étape
    if (activeStep === 0) {
      // Étape 1: Vérifier qu'on a au moins une des combinaisons valides:
      // - Nom + Prénom (avec ou sans Commune)
      // - Nom + Commune
      // - Prénom + Commune
      const hasNom = formData.nom && formData.nom.trim() !== '';
      const hasPrenom = formData.prenom && formData.prenom.trim() !== '';
      const hasCommune = formData.commune && formData.commune.trim() !== '';

      const isValid = (hasNom && hasPrenom) || (hasNom && hasCommune) || (hasPrenom && hasCommune);

      if (!isValid) {
        setError('Veuillez renseigner: (Nom + Prénom) ou (Nom + Commune) ou (Prénom + Commune)');
        return;
      }

      // Validation du téléphone seulement s'il est renseigné
      if (formData.telephone && formData.telephone.trim() !== '') {
        const phoneClean = formData.telephone.replace(/\s/g, '');
        if (phoneClean[0] !== '0') {
          setError('Le numéro de téléphone doit commencer par 0');
          setPhoneError('Le numéro doit commencer par 0');
          return;
        }
        const phoneDigits = getDigitsCount(formData.telephone);
        if (phoneDigits !== 10) {
          setError('Le numéro de téléphone doit contenir exactement 10 chiffres');
          setPhoneError(`${phoneDigits}/10 chiffres - Numéro invalide`);
          return;
        }
      }
    } else if (activeStep === 1) {
      // Étape 2: Vérifier que typeRencontre est rempli
      if (!formData.typeRencontre) {
        setError('Veuillez sélectionner le type de rencontre');
        return;
      }
    }

    setError('');
    setSaveMessage(''); // Effacer l'ancien message
    setLoading(true);

    try {
      // Préparer les données pour la sauvegarde
      const dataToSend = {
        ...formData,
        telephone: formData.telephone.replace(/\s/g, ''), // Retirer les espaces du téléphone
        besoinsPriere: formData.besoinsPriere ? formData.besoinsPriere.split(',').map(b => b.trim()) : []
      };

      // Supprimer situationMatrimoniale si vide
      if (!dataToSend.situationMatrimoniale) {
        delete dataToSend.situationMatrimoniale;
      }

      console.log('🔵 === DÉBUT ENREGISTREMENT ===');
      console.log('🔵 Étape actuelle:', activeStep);
      console.log('🔵 Données à envoyer:', JSON.stringify(dataToSend, null, 2));
      console.log('🔵 URL API de base:', api.defaults.baseURL);

      if (activeStep === 0) {
        // Première étape : Créer l'âme
        console.log('🔵 Envoi POST vers /ames...');
        const response = await api.post('/ames', dataToSend);
        console.log('✅ Réponse POST reçue:', response.data);
        setAmeId(response.data._id);
        setSaveMessage('✅ Informations personnelles enregistrées avec succès !');
        console.log('✅ Âme créée avec ID:', response.data._id);
      } else if (ameId) {
        // Étapes suivantes : Mettre à jour l'âme existante
        console.log('🔵 Envoi PUT vers /ames/' + ameId + '...');
        const response = await api.put(`/ames/${ameId}`, dataToSend);
        console.log('✅ Réponse PUT reçue:', response.data);
        setSaveMessage('✅ Informations sauvegardées avec succès !');
        console.log('✅ Âme mise à jour:', ameId);
      }

      // Effacer le message après 3 secondes
      setTimeout(() => setSaveMessage(''), 3000);

      // Passer à l'étape suivante
      setActiveStep((prevStep) => prevStep + 1);
      console.log('✅ Passage à l\'étape suivante');
    } catch (err) {
      console.error('❌ === ERREUR DÉTAILLÉE ===');
      console.error('❌ Objet erreur complet:', err);
      console.error('❌ Message:', err.message);
      console.error('❌ Code:', err.code);
      console.error('❌ Response status:', err.response?.status);
      console.error('❌ Response data:', err.response?.data);
      console.error('❌ Response headers:', err.response?.headers);
      console.error('❌ Request:', err.config);
      setError(err.response?.data?.message || err.message || 'Erreur lors de la sauvegarde');
    }

    setLoading(false);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Transformer besoinsPriere en tableau
      const dataToSend = {
        ...formData,
        telephone: formData.telephone.replace(/\s/g, ''), // Retirer les espaces du téléphone
        besoinsPriere: formData.besoinsPriere ? formData.besoinsPriere.split(',').map(b => b.trim()) : []
      };

      // Supprimer situationMatrimoniale si vide pour éviter l'erreur de validation
      if (!dataToSend.situationMatrimoniale) {
        delete dataToSend.situationMatrimoniale;
      }

      if (ameId) {
        // Mettre à jour l'âme existante (dernière étape)
        await api.put(`/ames/${ameId}`, dataToSend);
        console.log('✅ Âme finalisée:', ameId);
      } else {
        // Si pour une raison quelconque l'ID n'existe pas, créer l'âme
        await api.post('/ames', dataToSend);
        console.log('✅ Âme créée (fallback)');
      }

      setSuccess(true);

      setTimeout(() => {
        navigate('/mes-ames');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'enregistrement');
    }

    setLoading(false);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                helperText="Nom ou Prénom requis"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Prénom"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                helperText="Nom ou Prénom requis"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Téléphone"
                name="telephone"
                value={formData.telephone}
                onChange={handlePhoneChange}
                placeholder="07 08 67 66 04"
                error={!!phoneError}
                helperText={phoneError || "Optionnel - Format: XX XX XX XX XX"}
                inputProps={{ maxLength: 14 }} // 10 chiffres + 4 espaces
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Adresse"
                name="adresse"
                value={formData.adresse}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Tooltip title="Lieu de résidence de la personne" placement="top" arrow>
                <TextField
                  required
                  select
                  fullWidth
                  label="Commune / Ville"
                  name="commune"
                  value={formData.commune}
                  onChange={handleChange}
                  helperText="Requis si Nom ou Prénom seul"
                >
                  <MenuItem value="">
                    <em>Choisir une commune/ville</em>
                  </MenuItem>
                  {communesEtVilles.map((commune) => (
                    <MenuItem key={commune} value={commune}>
                      {commune}
                    </MenuItem>
                  ))}
                </TextField>
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Quartier / Précisions"
                name="ville"
                value={formData.ville}
                onChange={handleChange}
                helperText="Ex: Angré, Riviera, etc."
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Âge"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                select
                fullWidth
                label="Sexe"
                name="sexe"
                value={formData.sexe}
                onChange={handleChange}
              >
                <MenuItem value="Homme">Homme</MenuItem>
                <MenuItem value="Femme">Femme</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                select
                fullWidth
                label="Situation matrimoniale"
                name="situationMatrimoniale"
                value={formData.situationMatrimoniale}
                onChange={handleChange}
              >
                <MenuItem value="Célibataire">Célibataire</MenuItem>
                <MenuItem value="Marié(e)">Marié(e)</MenuItem>
                <MenuItem value="Divorcé(e)">Divorcé(e)</MenuItem>
                <MenuItem value="Veuf(ve)">Veuf(ve)</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre d'enfants"
                name="nombreEnfants"
                type="number"
                value={formData.nombreEnfants}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Profession"
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                helperText="Sélectionnez votre profession"
              >
                <MenuItem value="">
                  <em>Choisir une profession</em>
                </MenuItem>
                {professions.map((prof) => (
                  <MenuItem key={prof} value={prof}>
                    {prof}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                select
                fullWidth
                label="Comment avez-vous rencontré cette personne ?"
                name="typeRencontre"
                value={formData.typeRencontre}
                onChange={handleChange}
                helperText="Sélectionnez le type de rencontre"
              >
                <MenuItem value="">
                  <em>Choisir le type de rencontre</em>
                </MenuItem>
                <MenuItem value="Porte-à-porte">Porte-à-porte (Visite de domicile)</MenuItem>
                <MenuItem value="Rue">Dans la rue (Évangélisation de rue)</MenuItem>
                <MenuItem value="Marché">Au marché</MenuItem>
                <MenuItem value="Transport">Dans les transports (Gbakas, Bus, Taxi)</MenuItem>
                <MenuItem value="Lieu de travail">Sur le lieu de travail</MenuItem>
                <MenuItem value="École/Université">École ou Université</MenuItem>
                <MenuItem value="Hôpital">Hôpital ou Centre de santé</MenuItem>
                <MenuItem value="Événement église">Événement de l'église (Culte, Concert, Conférence)</MenuItem>
                <MenuItem value="Événement public">Événement public (Fête, Mariage, Funérailles)</MenuItem>
                <MenuItem value="Campagne d'évangélisation">Campagne d'évangélisation</MenuItem>
                <MenuItem value="Croisade">Croisade</MenuItem>
                <MenuItem value="Cellule de maison">Cellule de maison</MenuItem>
                <MenuItem value="Réseau social">Réseaux sociaux (Facebook, WhatsApp, etc.)</MenuItem>
                <MenuItem value="Appel téléphonique">Appel téléphonique</MenuItem>
                <MenuItem value="Référence">Référence (Recommandé par quelqu'un)</MenuItem>
                <MenuItem value="Famille">Membre de la famille</MenuItem>
                <MenuItem value="Ami">Ami(e) ou Connaissance</MenuItem>
                <MenuItem value="Voisin">Voisin(e)</MenuItem>
                <MenuItem value="Invité au culte">Invité au culte</MenuItem>
                <MenuItem value="Soi-même au culte">Soi-même au culte</MenuItem>
                <MenuItem value="Autre">Autre</MenuItem>
              </TextField>
            </Grid>
            {formData.typeRencontre === 'Invité au culte' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nom de la personne qui a invité"
                  name="nomInviteur"
                  value={formData.nomInviteur}
                  onChange={handleChange}
                  helperText="Veuillez indiquer le nom de la personne qui l'a invité au culte"
                />
              </Grid>
            )}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Commune / Ville de la rencontre"
                value={communeRencontre}
                onChange={handleCommuneRencontreChange}
                helperText="Sélectionnez la commune ou ville où vous avez rencontré la personne"
              >
                <MenuItem value="">
                  <em>Choisir une commune/ville</em>
                </MenuItem>
                {communesEtVilles.map((commune) => (
                  <MenuItem key={commune} value={commune}>
                    {commune}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {communeRencontre && communeRencontre !== 'Autre' && quartiersParCommune[communeRencontre] && (
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Quartier / Lieu précis"
                  value={quartierRencontre}
                  onChange={handleQuartierRencontreChange}
                  helperText="Sélectionnez le quartier ou lieu précis"
                >
                  <MenuItem value="">
                    <em>Choisir un quartier</em>
                  </MenuItem>
                  {quartiersParCommune[communeRencontre].map((quartier) => (
                    <MenuItem key={quartier} value={quartier}>
                      {quartier}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Date de la rencontre"
                name="dateRencontre"
                type="date"
                value={formData.dateRencontre}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                helperText="Date à laquelle vous avez rencontré cette personne"
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Statut spirituel"
                name="statutSpirituel"
                value={formData.statutSpirituel}
                onChange={handleChange}
                helperText="Sélectionnez le niveau spirituel actuel de la personne"
              >
                <MenuItem value="Non-croyant">Non-croyant (Ne croit pas en Dieu, athée ou agnostique)</MenuItem>
                <MenuItem value="Non-converti">Non-converti (Croit en Dieu mais n'a pas encore accepté Christ)</MenuItem>
                <MenuItem value="Intéressé">Intéressé (Ouvert à l'Évangile, pose des questions, cherche Dieu)</MenuItem>
                <MenuItem value="Nouveau converti">Nouveau converti (A accepté Christ récemment, prière de salut faite)</MenuItem>
                <MenuItem value="Converti non baptisé">Converti non baptisé (A accepté Christ mais pas encore baptisé)</MenuItem>
                <MenuItem value="Baptisé">Baptisé (A été baptisé d'eau)</MenuItem>
                <MenuItem value="Chrétien pratiquant">Chrétien pratiquant (Fréquente une église régulièrement)</MenuItem>
                <MenuItem value="Membre actif">Membre actif (Engagé dans le service, ministère ou leadership)</MenuItem>
                <MenuItem value="Chrétien rétrograde">Chrétien rétrograde (Était chrétien mais s'est éloigné de la foi)</MenuItem>
                <MenuItem value="Musulman">Musulman (Pratique l'Islam)</MenuItem>
                <MenuItem value="Animiste">Animiste (Religion traditionnelle africaine)</MenuItem>
                <MenuItem value="Bouddhiste">Bouddhiste (Pratique le Bouddhisme)</MenuItem>
                <MenuItem value="Autre religion">Autre religion (Hindouisme, Bahaïsme, etc.)</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ancienne église (si applicable)"
                name="ancienneEglise"
                value={formData.ancienneEglise}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="besoins-priere-label">Besoins de prière</InputLabel>
                <Select
                  labelId="besoins-priere-label"
                  id="besoins-priere"
                  multiple
                  value={selectedBesoinsPriere}
                  onChange={handleBesoinsPriereChange}
                  input={<OutlinedInput label="Besoins de prière" />}
                  renderValue={(selected) => selected.join(', ')}
                >
                  {besoinsPriereOptions.map((besoin) => (
                    <MenuItem key={besoin} value={besoin}>
                      <Checkbox checked={selectedBesoinsPriere.indexOf(besoin) > -1} />
                      <ListItemText primary={besoin} />
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Sélectionnez un ou plusieurs besoins de prière</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Notes et observations"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
      <Box sx={{ mt: { xs: 2, sm: 4 }, mb: { xs: 2, sm: 4 } }}>
        <Paper elevation={3} sx={{
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: { xs: 2, sm: 3 }
        }}>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{
              fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' },
              mb: { xs: 1, sm: 2 }
            }}
          >
            📝 Enregistrer une Nouvelle Âme
          </Typography>

          <Stepper
            activeStep={activeStep}
            sx={{
              mt: { xs: 1, sm: 3 },
              mb: { xs: 2, sm: 4 },
              '& .MuiStepLabel-label': {
                fontSize: { xs: '0.65rem', sm: '0.75rem', md: '0.875rem' }
              }
            }}
            alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {saveMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {saveMessage}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Âme enregistrée avec succès ! Redirection...
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            {renderStepContent(activeStep)}

            <Box sx={{
              display: 'flex',
              flexDirection: { xs: 'column-reverse', sm: 'row' },
              justifyContent: 'space-between',
              gap: { xs: 2, sm: 0 },
              mt: { xs: 3, sm: 4 }
            }}>
              <Button
                disabled={activeStep === 0 || loading}
                onClick={handleBack}
                variant="outlined"
                sx={{
                  minHeight: { xs: 48, sm: 42 },
                  width: { xs: '100%', sm: 'auto' }
                }}
              >
                Retour
              </Button>
              <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
                {activeStep === steps.length - 1 ? (
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    color="success"
                    fullWidth
                    sx={{
                      minHeight: { xs: 52, sm: 42 },
                      fontSize: { xs: '0.9rem', sm: '0.875rem' }
                    }}
                  >
                    {loading ? 'Enregistrement...' : 'ENREGISTRER ET TERMINER'}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={loading}
                    color="primary"
                    fullWidth
                    sx={{
                      minHeight: { xs: 52, sm: 42 },
                      fontSize: { xs: '1rem', sm: '0.875rem' }
                    }}
                  >
                    {loading ? 'Enregistrement...' : 'ENREGISTRER ET SUIVANT'}
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default EnregistrerAme;

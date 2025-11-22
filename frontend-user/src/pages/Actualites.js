import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import {
  CalendarToday,
  LocationOn,
  People,
  Route,
  Close,
  PlayCircleOutline,
  DirectionsWalk
} from '@mui/icons-material';
import api from '../services/api';

// URL de base du backend pour les fichiers statiques
const BACKEND_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5001';

// Sous-thèmes de l'offensive "Posséder la terre"
const sousThemes = [
  { jour: 1, date: '2025-11-16', titre: "Récupère le pouvoir de domination perdu par la chute", reference: "Genèse 3:17-19", chapitre: "Chapitre 1 : Identité", resume: "Le péché a brisé l'autorité originelle de l'homme, rendant la terre hostile et soumise à l'usurpateur. Cependant, la perte n'est pas définitive : en Christ, nous sommes appelés à récupérer ce mandat de gouvernance perdu." },
  { jour: 2, date: '2025-11-17', titre: "Lève-toi, et exerce ton mandat originel de domination", reference: "Genèse 1:26-28", chapitre: "Chapitre 1 : Identité", resume: "L'homme est le \"vice-roi\" de Dieu, mandaté non pour exploiter la terre, mais pour y imposer l'ordre divin. Il doit dominer sur la passivité et la peur pour manifester concrètement le Royaume de Dieu dans sa famille et son travail." },
  { jour: 3, date: '2025-11-18', titre: "Affirme ton identité de gouverneur de la terre", reference: "Psaume 115:14-16", chapitre: "Chapitre 1 : Identité", resume: "Si les cieux appartiennent à Dieu, la gestion de la terre est déléguée à l'homme. Le croyant doit sortir du sommeil spirituel pour reprendre sa place de gouverneur, car tout vide d'autorité est immédiatement occupé par l'ennemi." },
  { jour: 4, date: '2025-11-19', titre: "Joseph a manifesté son identité de Gouverneur en Égypte", reference: "Genèse 41:33-49", chapitre: "Chapitre 1 : Identité", resume: "Comme Joseph, le croyant est appelé à régner même en territoire hostile (le monde) grâce à l'Esprit de Dieu. Le vrai combat est de gouverner et d'influencer le système sans jamais se laisser corrompre par lui." },
  { jour: 5, date: '2025-11-20', titre: "Aie la mentalité de Caleb et le cœur de Josué", reference: "Nombres 13:16-30", chapitre: "Chapitre 2 : Gouverner la terre", resume: "La conquête exige de voir la promesse divine au-delà des obstacles. Avoir la mentalité de Caleb, c'est refuser la peur contagieuse pour évaluer la réalité avec les yeux de la foi et passer à l'action." },
  { jour: 6, date: '2025-11-21', titre: "Cultive et garde ton territoire contre les ténèbres", reference: "Genèse 2:15", chapitre: "Chapitre 2 : Gouverner la terre", resume: "Le mandat divin est double : cultiver (faire fructifier les talents et territoires) et garder (protéger spirituellement contre l'ennemi). Travailler sans veiller expose nos fruits au pillage ; veiller sans travailler mène à la stérilité." },
  { jour: 7, date: '2025-11-22', titre: "Représente ton Royaume comme ambassadeur sur la terre", reference: "2 Corinthiens 5:19-20", chapitre: "Chapitre 2 : Gouverner la terre", resume: "Le chrétien est un ambassadeur du Ciel en mission sur terre. Par ses décisions, son intégrité et ses prières, il a la responsabilité légale d'imposer les valeurs et la culture du Royaume là où Dieu l'a placé." },
  { jour: 8, date: '2025-11-23', titre: "Sanctifie ton territoire par la prière et la proclamation", reference: "2 Rois 2:19-22", chapitre: "Chapitre 2 : Gouverner la terre", resume: "Un territoire peut être beau en apparence mais maudit à la racine. Comme Élisée à Jéricho, nous devons identifier la source de la malédiction et assainir la terre par la prière et la proclamation de la Parole (le sel)." },
  { jour: 9, date: '2025-11-24', titre: "Fais parler la terre en ta faveur par tes actes", reference: "Job 31:38-40", chapitre: "Chapitre 3 : La terre réagit", resume: "La terre n'est pas neutre : elle enregistre nos actes comme un témoin silencieux. Nos actions morales (justice ou iniquité) influencent spirituellement le sol, qui réagit en produisant bénédiction ou stérilité." },
  { jour: 10, date: '2025-11-25', titre: "Fais de la terre ton partenaire spirituel dans la conquête et le combat", reference: "Job 12:8-10", chapitre: "Chapitre 3 : La terre réagit", resume: "La terre peut être une partenaire ou une adversaire. En vivant dans la sainteté et en élevant des autels à Dieu, nous faisons de notre environnement un allié spirituel qui combat avec nous contre les ténèbres." },
  { jour: 11, date: '2025-11-26', titre: "Libère et déclare des paroles de vie sur ton territoire", reference: "Joël 2:21-23", chapitre: "Chapitre 3 : La terre réagit", resume: "La parole de foi est une arme créatrice capable de changer l'atmosphère d'un lieu. Il faut commander à la terre de ne pas craindre et proclamer sur elle des paroles de vie pour transformer la honte en abondance." },
  { jour: 12, date: '2025-11-27', titre: "Purifie la terre pour qu'elle t'accueille", reference: "Lévitique 18:3-28", chapitre: "Chapitre 3 : La terre réagit", resume: "Le péché et l'abomination souillent le territoire au point que la terre peut littéralement \"vomir\" ses habitants. La conquête durable nécessite une vie de pureté pour que le territoire nous accueille favorablement." },
  { jour: 13, date: '2025-11-28', titre: "Identifie et affronte les esprits territoriaux", reference: "Daniel 10:7-14", chapitre: "Chapitre 4 : Les ennemis", resume: "Des puissances invisibles (esprits territoriaux) cherchent à contrôler des zones géographiques et culturelles spécifiques. Le combat consiste à discerner ces \"princes\" et à les affronter pour libérer la destinée du lieu." },
  { jour: 14, date: '2025-11-29', titre: "Répare les injustices du sang innocent versé sur ton territoire", reference: "Nombre 35:33-34", chapitre: "Chapitre 4 : Les ennemis", resume: "Le sang innocent versé crie vengeance et pollue spirituellement la terre, attirant le jugement. Seule la repentance et l'invocation du sang supérieur de Jésus peuvent purifier le sol et stopper les malédictions." },
  { jour: 15, date: '2025-11-30', titre: "Ne cède aucun espace de ton territoire à l'ennemi", reference: "1 Rois 21:1-16", chapitre: "Chapitre 4 : Les ennemis", resume: "Comme Naboth face à Achab, nous ne devons céder aucun pouce de notre héritage spirituel ou familial à l'ennemi. La compromission ou la peur ouvrent des brèches que le diable exploite pour voler ce que Dieu a donné." },
  { jour: 16, date: '2025-12-01', titre: "Démolis les trônes et renverse l'influence des autels maléfiques sur ton territoire", reference: "2 Rois 23:13-15", chapitre: "Chapitre 4 : Les ennemis", resume: "La délivrance d'un territoire exige de renverser les autels maléfiques et de délégitimer les trônes d'iniquité. Il faut briser les anciennes alliances occultes pour bâtir de nouveaux fondements basés sur Christ." },
  { jour: 17, date: '2025-12-02', titre: "Conquiers ton territoire promis comme Josué", reference: "Josué 6:1-10 et 6:20-26", chapitre: "Chapitre 5 : Conquérir et Posséder", resume: "La victoire sur les forteresses imprenables (Jéricho) ne s'obtient pas par la force humaine, mais par une obéissance stricte à la stratégie divine. La foi, couplée à la proclamation et à la louange, fait tomber les murailles." },
  { jour: 18, date: '2025-12-03', titre: "Va à l'assaut des montagnes que Dieu t'a promis", reference: "Josué 14:6-15", chapitre: "Chapitre 5 : Conquérir et Posséder", resume: "Il n'y a pas de retraite dans la conquête : comme Caleb à 85 ans, nous devons réclamer nos \"montagnes\" (les défis difficiles) avec audace. La promesse de Dieu reste valide malgré le temps qui passe et la difficulté apparente." },
  { jour: 19, date: '2025-12-04', titre: "Parle aux montagnes pour les bénir et les conquérir", reference: "Ézéchiel 36:1-13", chapitre: "Chapitre 5 : Conquérir et Posséder", resume: "Nous avons l'autorité de parler aux \"montagnes\" (situations bloquées, lieux désolés) pour prophétiser leur restauration. La prière prophétique prépare le terrain pour que Dieu y ramène la fertilité et la vie." },
  { jour: 20, date: '2025-12-05', titre: "Laisse l'Éternel guider tes pas vers le territoire de ta destinée", reference: "Genèse 13:1-13", chapitre: "Chapitre 5 : Conquérir et Posséder", resume: "Le vrai territoire promis n'est pas celui qui brille aux yeux (comme le choix charnel de Lot), mais celui que Dieu désigne. Il faut se laisser guider par le Saint-Esprit pour éviter les pièges de l'apparence et entrer dans sa vraie destinée." },
  { jour: 21, date: '2025-12-06', titre: "Prospère au milieu du combat sur ton territoire", reference: "Genèse 26:12-22", chapitre: "Chapitre 5 : Conquérir et Posséder", resume: "Il est possible de prospérer même en temps d'hostilité. En persévérant à creuser nos puits malgré l'opposition, Dieu nous conduit à \"Rehoboth\", un espace de large bénédiction où l'on fructifie au milieu du combat." }
];

const Actualites = () => {
  const [campagnes, setCampagnes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCampagne, setSelectedCampagne] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [mediaDialog, setMediaDialog] = useState({ open: false, type: '', url: '' });
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [themeDialog, setThemeDialog] = useState(false);

  useEffect(() => {
    fetchCampagnes();
  }, []);

  const fetchCampagnes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/campagnes');
      // Filtrer uniquement les campagnes publiques
      const campagnesPubliques = response.data.data.filter(c => c.publique !== false);
      // Trier par date de début (plus récentes d'abord)
      const campagnesSorted = campagnesPubliques.sort((a, b) =>
        new Date(b.dateDebut) - new Date(a.dateDebut)
      );
      setCampagnes(campagnesSorted);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des campagnes:', err);
      setError('Impossible de charger les actualités. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDateRange = (dateDebut, dateFin) => {
    const debut = new Date(dateDebut).toDateString();
    const fin = new Date(dateFin).toDateString();

    if (debut === fin) {
      // Si les dates sont identiques, afficher une seule date
      return `Le ${formatDate(dateDebut)}`;
    } else {
      // Si les dates sont différentes, afficher la plage
      return `Du ${formatDate(dateDebut)} au ${formatDate(dateFin)}`;
    }
  };

  const isFutureCampagne = (dateDebut) => {
    return new Date(dateDebut) > new Date();
  };

  const getStatutChipColor = (statut) => {
    const colors = {
      'Planifiée': 'info',
      'En cours': 'success',
      'Terminée': 'default',
      'Annulée': 'error'
    };
    return colors[statut] || 'default';
  };

  const handleOpenDialog = (campagne) => {
    setSelectedCampagne(campagne);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCampagne(null);
  };

  const handleOpenMedia = (type, url) => {
    setMediaDialog({ open: true, type, url });
  };

  const handleCloseMedia = () => {
    setMediaDialog({ open: false, type: '', url: '' });
  };

  // 📅 CALCUL AUTOMATIQUE DU JOUR ACTUEL DE L'OFFENSIVE
  // L'offensive commence le 16 novembre 2025
  const dateDebutOffensive = new Date('2025-11-16');
  const aujourdhui = new Date();
  aujourdhui.setHours(0, 0, 0, 0); // Ignorer l'heure
  const diffTime = aujourdhui.getTime() - dateDebutOffensive.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  // Le jour actuel est entre 1 et 21 (ou 0 si avant le début, ou 22 si après la fin)
  const jourActuel = Math.max(0, Math.min(22, diffDays + 1));

  // Fonction pour déterminer la couleur selon la progression
  // LOGIQUE : Gauche = Terre non conquise, Droite = Terre conquise (verte)
  const getCaseColor = (jourNumber) => {
    if (jourNumber < jourActuel) {
      // Jours passés (conquis) → VERT avec dégradé
      const intensity = Math.min(100, 50 + (jourNumber / jourActuel) * 50);
      return `hsl(120, ${intensity}%, 35%)`; // Vert de plus en plus intense
    } else if (jourNumber === jourActuel) {
      return '#4caf50'; // Jour actuel → VERT ÉCLATANT avec scintillement
    } else {
      // Jours futurs → TERRE (marron/désert)
      return '#8B4513';
    }
  };

  // Calcul de la progression pour l'arrière-plan
  const progressionPourcentage = (jourActuel / 21) * 100; // Pourcentage de jours conquis

  const handleThemeClick = (theme) => {
    setSelectedTheme(theme);
    setThemeDialog(true);
  };

  const handleCloseTheme = () => {
    setThemeDialog(false);
    setSelectedTheme(null);
  };

  const campagnesFutures = campagnes.filter(c => isFutureCampagne(c.dateDebut));
  const campagnesPassees = campagnes.filter(c => !isFutureCampagne(c.dateDebut));

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h3" align="center" gutterBottom>
          Actualités MERA
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" gutterBottom>
          Mission d'Évangélisation pour une Récolte Abondante
        </Typography>
        <Divider sx={{ my: 3 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Offensive en cours - Posséder la terre */}
        <Box sx={{ mb: 6 }}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #0047AB 0%, #FFA500 100%)',
              color: 'white',
              overflow: 'hidden'
            }}
          >
            <Grid container>
              {/* SECTION COMPLÈTE : IMAGE + TITRES + CALENDRIER */}
              <Grid item xs={12}>
                <CardContent sx={{ p: 3 }}>
                  {/* IMAGE CENTRÉE EN HAUT - GRANDE ET LARGE */}
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <CardMedia
                      component="img"
                      image="/offensive-possedar-terre.jpg"
                      alt="Offensive - Posséder la terre"
                      sx={{
                        width: { xs: '100%', md: '95%' },
                        height: 'auto',
                        objectFit: 'contain', // Affiche l'image entière sans la couper
                        borderRadius: 3,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
                      }}
                    />
                  </Box>

                  {/* TITRES EN DESSOUS DE L'IMAGE */}
                  <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'white' }}>
                      OFFENSIVE SPIRITUELLE
                    </Typography>
                    <Typography variant="h5" sx={{ color: '#ffd700', fontWeight: 'bold', mb: 1 }}>
                      "POSSÉDER LA TERRE"
                    </Typography>
                    <Typography variant="body1" sx={{ fontStyle: 'italic', opacity: 0.9, color: 'white' }}>
                      Josué 1:3
                    </Typography>
                  </Box>

                  {/* 📅 CALENDRIER INTERACTIF - LA CONQUÊTE DU TERRITOIRE */}
                  {/* Arrière-plan avec dégradé et décorations */}
                  <Box
                    sx={{
                      background: 'linear-gradient(to right, #d2b48c 0%, #8B4513 30%, #6b8e23 70%, #228b22 100%)',
                      borderRadius: 2,
                      p: 2,
                      mb: 2,
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {/* GRAND COCOTIER - Coin bas droit */}
                    <Box sx={{
                      position: 'absolute',
                      right: 10,
                      bottom: 10,
                      fontSize: '4rem',
                      opacity: 0.8,
                      zIndex: 0,
                      pointerEvents: 'none'
                    }}>
                      🌴
                    </Box>

                    {/* GRAPPE DE RAISIN - À côté du cocotier */}
                    <Box sx={{
                      position: 'absolute',
                      right: 80,
                      bottom: 10,
                      fontSize: '3.5rem',
                      opacity: 0.8,
                      zIndex: 0,
                      pointerEvents: 'none'
                    }}>
                      🍇
                    </Box>

                    {/* Fruits exotiques - Droite bas */}
                    <Box sx={{
                      position: 'absolute',
                      right: '25%',
                      bottom: 10,
                      fontSize: '1.8rem',
                      opacity: 0.5,
                      zIndex: 0,
                      pointerEvents: 'none'
                    }}>
                      🥥🍇🍊
                    </Box>

                    <Box sx={{
                      position: 'absolute',
                      right: '15%',
                      bottom: 50,
                      fontSize: '1.8rem',
                      opacity: 0.5,
                      zIndex: 0,
                      pointerEvents: 'none'
                    }}>
                      🍋🥭🍑
                    </Box>

                    {/* Fleurs - Zone verte (haut) */}
                    <Box sx={{
                      position: 'absolute',
                      top: 60,
                      right: '30%',
                      fontSize: '1.5rem',
                      opacity: 0.5,
                      zIndex: 0,
                      pointerEvents: 'none'
                    }}>
                      🌹🌺🌸
                    </Box>

                    <Box sx={{
                      position: 'absolute',
                      top: 60,
                      right: '10%',
                      fontSize: '1.5rem',
                      opacity: 0.5,
                      zIndex: 0,
                      pointerEvents: 'none'
                    }}>
                      💐🌷🌼
                    </Box>

                    <Typography variant="body2" sx={{ textAlign: 'center', mb: 2, fontWeight: 'bold', color: 'white', position: 'relative', zIndex: 1 }}>
                      👆 La Conquête : Désert → Jardin verdoyant | Cliquez pour voir le sous-thème
                    </Typography>

                    {/* GRILLE DE 21 CARRÉS - DISPOSITION HORIZONTALE (gauche → droite) */}
                    <Grid container spacing={1.5}>
                      {sousThemes.map((theme) => {
                        const caseColor = getCaseColor(theme.jour);
                        const isCurrentDay = theme.jour === jourActuel;
                        const dateObj = new Date(theme.date);
                        const jourMois = dateObj.getDate();
                        const moisNum = dateObj.getMonth(); // 10 = novembre, 11 = décembre
                        const moisAbrege = moisNum === 10 ? 'nov' : 'déc';
                        const suffixe = (jourMois === 1) ? ' er' : ''; // "er" pour le 1er du mois

                        return (
                          <Grid item xs={4} sm={3} md={2.4} key={theme.jour}>
                            <Box
                              onClick={() => handleThemeClick(theme)}
                              sx={{
                                position: 'relative',
                                aspectRatio: '1',
                                minHeight: '80px',

                                // 🎨 COULEUR selon progression (gauche→droite)
                                backgroundColor: caseColor,

                                border: '3px solid rgba(255,255,255,0.4)',
                                borderRadius: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.3s',

                                // ✨ SCINTILLEMENT pour le jour actuel
                                animation: isCurrentDay ? 'sparkle 1.5s infinite' : 'none',

                                // Effet au survol
                                '&:hover': {
                                  transform: 'scale(1.15)',
                                  boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
                                  zIndex: 10
                                },

                                // 🌟 Animation scintillement
                                '@keyframes sparkle': {
                                  '0%, 100%': {
                                    boxShadow: '0 0 15px #ffd700, 0 0 30px #ffd700',
                                    borderColor: '#ffd700',
                                    transform: 'scale(1.05)'
                                  },
                                  '50%': {
                                    boxShadow: '0 0 25px #ffd700, 0 0 40px #ffd700',
                                    borderColor: '#ffffff',
                                    transform: 'scale(1.1)'
                                  }
                                }
                              }}
                            >
                              {/* 👣 ICÔNE DE PIEDS */}
                              <DirectionsWalk
                                sx={{
                                  fontSize: 20,
                                  color: 'white',
                                  opacity: 0.9,
                                  mb: 0.5
                                }}
                              />

                              {/* 📅 NUMÉRO DU SOUS-THÈME (GRAND) */}
                              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white', lineHeight: 1 }}>
                                {theme.jour}
                              </Typography>

                              {/* 📆 DATE DU CALENDRIER (PETIT) */}
                              <Typography variant="caption" sx={{ fontSize: '0.6rem', color: 'white', opacity: 0.8 }}>
                                {jourMois}{suffixe} {moisAbrege}
                              </Typography>
                            </Box>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>

                  <Alert severity="info" sx={{ backgroundColor: 'rgba(255,255,255,0.9)' }}>
                    <Typography variant="body2" fontWeight="bold" color="text.primary">
                      Rejoignez-nous pour conquérir de nouvelles âmes !
                    </Typography>
                  </Alert>
                </CardContent>
              </Grid>
            </Grid>
          </Card>
        </Box>

        {/* Campagnes Futures */}
        {campagnesFutures.length > 0 && (
          <Box sx={{ mb: 6 }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', mb: 3 }}>
              Prochaines Campagnes
            </Typography>
            <Grid container spacing={3}>
              {campagnesFutures.map((campagne) => {
                const isMera3 = campagne.titre && campagne.titre.includes('MERA 3');

                return (
                  <Grid item xs={12} md={6} key={campagne._id}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'scale(1.02)',
                          boxShadow: 6
                        },
                        // Animation scintillement pour MERA 3
                        ...(isMera3 && {
                          animation: 'sparkleMera3 2.5s infinite',
                          border: '3px solid #FFA500',
                          '@keyframes sparkleMera3': {
                            '0%, 100%': {
                              boxShadow: '0 0 20px rgba(255, 165, 0, 0.6), 0 0 40px rgba(255, 165, 0, 0.3)',
                              borderColor: '#FFA500',
                              transform: 'scale(1)'
                            },
                            '50%': {
                              boxShadow: '0 0 30px rgba(255, 165, 0, 0.8), 0 0 60px rgba(255, 165, 0, 0.5)',
                              borderColor: '#FFD700',
                              transform: 'scale(1.02)'
                            }
                          }
                        })
                      }}
                    >
                    {campagne.images && campagne.images.length > 0 && (
                      <CardMedia
                        component="img"
                        height="200"
                        image={`${BACKEND_URL}${campagne.images[0].url}`}
                        alt={campagne.titre}
                        sx={{ cursor: 'pointer' }}
                        onClick={() => handleOpenMedia('image', `${BACKEND_URL}${campagne.images[0].url}`)}
                      />
                    )}
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Chip
                          label={campagne.type}
                          color="primary"
                          size="small"
                        />
                        <Chip
                          label={campagne.statut}
                          color={getStatutChipColor(campagne.statut)}
                          size="small"
                        />
                      </Box>
                      <Typography variant="h5" gutterBottom>
                        {campagne.titre}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {campagne.description.substring(0, 150)}...
                      </Typography>

                      {/* Date mise en avant pour MERA 3 */}
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 1,
                        ...(isMera3 && {
                          backgroundColor: 'rgba(255, 165, 0, 0.15)',
                          p: 1.5,
                          borderRadius: 2,
                          borderLeft: '4px solid #FFA500'
                        })
                      }}>
                        <CalendarToday sx={{
                          mr: 1,
                          fontSize: isMera3 ? 24 : 18,
                          color: isMera3 ? '#FFA500' : 'inherit'
                        }} />
                        <Typography
                          variant={isMera3 ? "h6" : "body2"}
                          sx={{
                            fontWeight: isMera3 ? 'bold' : 'normal',
                            color: isMera3 ? '#FFA500' : 'inherit'
                          }}
                        >
                          {isMera3 ? '📅 Le 23 novembre 2025' : formatDateRange(campagne.dateDebut, campagne.dateFin)}
                        </Typography>
                      </Box>

                      {/* Lieu mis en avant pour MERA 3 */}
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 1,
                        ...(isMera3 && {
                          backgroundColor: 'rgba(0, 71, 171, 0.15)',
                          p: 1.5,
                          borderRadius: 2,
                          borderLeft: '4px solid #0047AB'
                        })
                      }}>
                        <LocationOn sx={{
                          mr: 1,
                          fontSize: isMera3 ? 24 : 18,
                          color: isMera3 ? '#0047AB' : 'inherit'
                        }} />
                        <Typography
                          variant={isMera3 ? "h6" : "body2"}
                          sx={{
                            fontWeight: isMera3 ? 'bold' : 'normal',
                            color: isMera3 ? '#0047AB' : 'inherit'
                          }}
                        >
                          {isMera3 ? '📍 Angré 8e tranche' : campagne.lieu}
                        </Typography>
                      </Box>
                      {campagne.objectifs && campagne.objectifs.nombreAmes > 0 && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <People sx={{ mr: 1, fontSize: 18 }} />
                          <Typography variant="body2">
                            Objectif: {campagne.objectifs.nombreAmes} âmes
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                    <Box sx={{ p: 2, pt: 0 }}>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => handleOpenDialog(campagne)}
                      >
                        Voir les détails
                      </Button>
                    </Box>
                  </Card>
                </Grid>
                );
              })}
            </Grid>
          </Box>
        )}

        {/* Campagnes Passées */}
        {campagnesPassees.length > 0 && (
          <Box>
            <Typography variant="h4" gutterBottom sx={{ color: 'secondary.main', mb: 3 }}>
              Campagnes Réalisées
            </Typography>
            <Grid container spacing={3}>
              {campagnesPassees.map((campagne) => (
                <Grid item xs={12} md={6} key={campagne._id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'scale(1.02)',
                        boxShadow: 6
                      }
                    }}
                  >
                    {campagne.images && campagne.images.length > 0 && (
                      <CardMedia
                        component="img"
                        height="200"
                        image={`${BACKEND_URL}${campagne.images[0].url}`}
                        alt={campagne.titre}
                        sx={{ cursor: 'pointer' }}
                        onClick={() => handleOpenMedia('image', `${BACKEND_URL}${campagne.images[0].url}`)}
                      />
                    )}
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Chip
                          label={campagne.type}
                          color="primary"
                          size="small"
                        />
                        <Chip
                          label={campagne.statut}
                          color={getStatutChipColor(campagne.statut)}
                          size="small"
                        />
                      </Box>
                      <Typography variant="h5" gutterBottom>
                        {campagne.titre}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {campagne.description.substring(0, 150)}...
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CalendarToday sx={{ mr: 1, fontSize: 18 }} />
                        <Typography variant="body2">
                          {formatDateRange(campagne.dateDebut, campagne.dateFin)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationOn sx={{ mr: 1, fontSize: 18 }} />
                        <Typography variant="body2">{campagne.lieu}</Typography>
                      </Box>
                      {(campagne.images?.length > 1 || campagne.videos?.length > 0) && (
                        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                          {campagne.images && campagne.images.length > 1 && (
                            <Chip
                              label={`${campagne.images.length} photos`}
                              size="small"
                              color="info"
                            />
                          )}
                          {campagne.videos && campagne.videos.length > 0 && (
                            <Chip
                              icon={<PlayCircleOutline />}
                              label={`${campagne.videos.length} vidéo${campagne.videos.length > 1 ? 's' : ''}`}
                              size="small"
                              color="error"
                            />
                          )}
                        </Box>
                      )}
                    </CardContent>
                    <Box sx={{ p: 2, pt: 0 }}>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => handleOpenDialog(campagne)}
                      >
                        Voir les détails
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {campagnes.length === 0 && !loading && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              Aucune actualité disponible pour le moment
            </Typography>
          </Box>
        )}
      </Box>

      {/* Dialog détails campagne */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedCampagne && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5">{selectedCampagne.titre}</Typography>
                <IconButton onClick={handleCloseDialog}>
                  <Close />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ mb: 2 }}>
                <Chip label={selectedCampagne.type} color="primary" sx={{ mr: 1 }} />
                <Chip label={selectedCampagne.statut} color={getStatutChipColor(selectedCampagne.statut)} />
              </Box>

              <Typography variant="body1" paragraph>
                {selectedCampagne.description}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Informations
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CalendarToday sx={{ mr: 1 }} />
                  <Typography>
                    {formatDateRange(selectedCampagne.dateDebut, selectedCampagne.dateFin)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOn sx={{ mr: 1 }} />
                  <Typography>{selectedCampagne.lieu}</Typography>
                </Box>
              </Box>

              {selectedCampagne.parcours && (
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Route sx={{ mr: 1 }} />
                    <Typography variant="h6">Parcours</Typography>
                  </Box>
                  <Typography variant="body2">{selectedCampagne.parcours}</Typography>
                </Box>
              )}

              {selectedCampagne.lieuxRassemblement && selectedCampagne.lieuxRassemblement.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Lieux de Rassemblement
                  </Typography>
                  {selectedCampagne.lieuxRassemblement.map((lieu, index) => (
                    <Box key={index} sx={{ mb: 1, pl: 2 }}>
                      <Typography variant="body1" fontWeight="bold">
                        {lieu.nom}
                      </Typography>
                      {lieu.adresse && (
                        <Typography variant="body2" color="text.secondary">
                          {lieu.adresse}
                        </Typography>
                      )}
                      {lieu.heureRassemblement && (
                        <Typography variant="body2" color="text.secondary">
                          Heure: {lieu.heureRassemblement}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>
              )}

              {selectedCampagne.programme && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Programme
                  </Typography>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                    {selectedCampagne.programme}
                  </Typography>
                </Box>
              )}

              {selectedCampagne.resultats && !isFutureCampagne(selectedCampagne.dateDebut) && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Résultats
                  </Typography>
                  {/* Affichage spécial pour MERA */}
                  {(selectedCampagne.titre.includes('MERA') || selectedCampagne.titre.includes('Mera')) ? (
                    <Box sx={{
                      backgroundColor: '#f5f5f5',
                      p: 3,
                      borderRadius: 2,
                      borderLeft: '4px solid #0047AB'
                    }}>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        📊 <strong>Résultat MERA 1 :</strong> 120 âmes
                      </Typography>
                      <Typography variant="body1">
                        📊 <strong>Résultat MERA 2 :</strong> 115 âmes
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic', color: 'text.secondary' }}>
                        Total cumulé : 235 âmes rencontrées
                      </Typography>
                    </Box>
                  ) : (
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Typography variant="h4" color="success.main">
                          {selectedCampagne.resultats.amesGagnees}
                        </Typography>
                        <Typography variant="body2">Âmes rencontrées</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="h4" color="primary.main">
                          {selectedCampagne.resultats.tractsDistribues}
                        </Typography>
                        <Typography variant="body2">Tracts distribués</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="h4" color="secondary.main">
                          {selectedCampagne.resultats.participantsPresents}
                        </Typography>
                        <Typography variant="body2">Participants</Typography>
                      </Grid>
                    </Grid>
                  )}
                </Box>
              )}

              {selectedCampagne.images && selectedCampagne.images.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Photos
                  </Typography>
                  <Grid container spacing={2}>
                    {selectedCampagne.images.map((image, index) => (
                      <Grid item xs={6} sm={4} key={index}>
                        <Card
                          sx={{ cursor: 'pointer' }}
                          onClick={() => handleOpenMedia('image', `${BACKEND_URL}${image.url}`)}
                        >
                          <CardMedia
                            component="img"
                            height="120"
                            image={`${BACKEND_URL}${image.url}`}
                            alt={image.legende || `Photo ${index + 1}`}
                          />
                          {image.legende && (
                            <CardContent sx={{ p: 1 }}>
                              <Typography variant="caption">{image.legende}</Typography>
                            </CardContent>
                          )}
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {selectedCampagne.videos && selectedCampagne.videos.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Vidéos
                  </Typography>
                  <Grid container spacing={2}>
                    {selectedCampagne.videos.map((video, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Card
                          sx={{ cursor: 'pointer' }}
                          onClick={() => handleOpenMedia('video', video.url)}
                        >
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <PlayCircleOutline sx={{ mr: 1, color: 'error.main' }} />
                              <Typography variant="subtitle1">
                                {video.titre || `Vidéo ${index + 1}`}
                              </Typography>
                            </Box>
                            {video.description && (
                              <Typography variant="body2" color="text.secondary">
                                {video.description}
                              </Typography>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {selectedCampagne.notes && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Notes
                  </Typography>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                    {selectedCampagne.notes}
                  </Typography>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Fermer</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Dialog média (image/vidéo) */}
      <Dialog
        open={mediaDialog.open}
        onClose={handleCloseMedia}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              {mediaDialog.type === 'image' ? 'Photo' : 'Vidéo'}
            </Typography>
            <IconButton onClick={handleCloseMedia}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {mediaDialog.type === 'image' ? (
            <Box
              component="img"
              src={mediaDialog.url}
              alt="Image"
              sx={{ width: '100%', height: 'auto' }}
            />
          ) : (
            <Box
              component="video"
              controls
              src={mediaDialog.url}
              sx={{ width: '100%', height: 'auto' }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog pour afficher le sous-thème */}
      <Dialog
        open={themeDialog}
        onClose={handleCloseTheme}
        maxWidth="md"
        fullWidth
      >
        {selectedTheme && (
          <>
            <DialogTitle sx={{ backgroundColor: '#0047AB', color: 'white' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6">
                    Jour {selectedTheme.jour} - {new Date(selectedTheme.date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>
                    {selectedTheme.chapitre}
                  </Typography>
                </Box>
                <IconButton onClick={handleCloseTheme} sx={{ color: 'white' }}>
                  <Close />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
              <Box sx={{ mb: 3, textAlign: 'center' }}>
                <DirectionsWalk sx={{ fontSize: 60, color: '#0047AB', mb: 2 }} />
              </Box>
              <Typography variant="h5" gutterBottom sx={{ color: '#0047AB', fontWeight: 'bold', textAlign: 'center' }}>
                Sous-thème {selectedTheme.jour}
              </Typography>
              <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', color: 'text.primary' }}>
                {selectedTheme.titre}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{
                backgroundColor: '#FFA500',
                color: 'white',
                p: 2,
                borderRadius: 2,
                textAlign: 'center'
              }}>
                <Typography variant="body1" sx={{ fontStyle: 'italic', fontWeight: 'bold' }}>
                  📖 {selectedTheme.reference}
                </Typography>
              </Box>

              {/* Résumé du sous-thème */}
              {selectedTheme.resume && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <Box sx={{
                    backgroundColor: '#f5f5f5',
                    p: 3,
                    borderRadius: 2,
                    borderLeft: '4px solid #0047AB'
                  }}>
                    <Typography variant="subtitle2" sx={{ color: '#0047AB', fontWeight: 'bold', mb: 2 }}>
                      📝 Résumé
                    </Typography>
                    <Typography variant="body1" sx={{ textAlign: 'justify', lineHeight: 1.8, color: 'text.primary' }}>
                      {selectedTheme.resume}
                    </Typography>
                  </Box>
                </>
              )}
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button
                onClick={handleCloseTheme}
                variant="contained"
                sx={{
                  backgroundColor: '#0047AB',
                  '&:hover': { backgroundColor: '#003380' }
                }}
              >
                Fermer
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default Actualites;

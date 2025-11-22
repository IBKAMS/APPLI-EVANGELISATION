import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Paper,
  CircularProgress,
  LinearProgress
} from '@mui/material';
import {
  ExpandMore,
  School,
  CheckCircle,
  AutoStories,
  Quiz as QuizIcon,
  EmojiEvents as Trophy,
  Lock,
  LockOpen
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Parcours = () => {
  const { user } = useAuth();
  const [expandedTheme, setExpandedTheme] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResults, setQuizResults] = useState({});
  const [showQuizResults, setShowQuizResults] = useState({});
  const [progression, setProgression] = useState(null);
  const [niveauxAccessibles, setNiveauxAccessibles] = useState({
    1: true,
    2: false,
    3: false,
    4: false,
    final: false
  });
  const [loading, setLoading] = useState(true);
  const [expandedNiveau, setExpandedNiveau] = useState(null);

  // Fetch user progression on component mount
  useEffect(() => {
    const fetchProgression = async () => {
      try {
        const response = await api.get('/progression');
        const progressionData = response.data;
        setProgression(progressionData);

        // Set accessible levels based on user role
        if (user?.role === 'admin' || user?.role === 'pasteur') {
          setNiveauxAccessibles({
            1: true,
            2: true,
            3: true,
            4: true,
            final: true
          });
        } else if (user?.role === 'evangeliste') {
          const niveauActuel = progressionData.niveauActuel || 1;
          const newAccessibles = {
            1: true,
            2: niveauActuel >= 2 || progressionData.niveaux?.niveau1?.complete,
            3: niveauActuel >= 3 || progressionData.niveaux?.niveau2?.complete,
            4: niveauActuel >= 4 || progressionData.niveaux?.niveau3?.complete,
            final: progressionData.niveaux?.niveau4?.complete || false
          };
          setNiveauxAccessibles(newAccessibles);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de la progression:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgression();
  }, [user]);

  const handleChangeTheme = (panel) => (event, isExpanded) => {
    setExpandedTheme(isExpanded ? panel : false);
  };

  const handleQuizAnswer = (themeId, questionId, answer) => {
    setQuizAnswers(prev => ({
      ...prev,
      [`${themeId}-${questionId}`]: answer
    }));
  };

  // Helper function to extract niveau from themeId
  const extractNiveauFromThemeId = (themeId) => {
    // themeId format: "theme1", "theme2", etc.
    // We need to map themes to niveaux based on the theme arrays
    const niveau1ThemesIds = niveau1Themes.map(t => t.id);
    const niveau2ThemesIds = niveau2Themes.map(t => t.id);
    const niveau3ThemesIds = niveau3Themes.map(t => t.id);
    const niveau4ThemesIds = niveau4Themes.map(t => t.id);

    if (niveau1ThemesIds.includes(themeId)) return 1;
    if (niveau2ThemesIds.includes(themeId)) return 2;
    if (niveau3ThemesIds.includes(themeId)) return 3;
    if (niveau4ThemesIds.includes(themeId)) return 4;
    return 1;
  };

  // Helper function to check if all themes of a niveau are completed
  const checkNiveauCompletion = async (niveau) => {
    if (!progression || user?.role === 'admin' || user?.role === 'pasteur') return;

    const niveauKey = `niveau${niveau}`;
    const niveauData = progression.niveaux?.[niveauKey];

    if (!niveauData) return;

    const themesCompleted = niveauData.themes || [];
    const totalThemes = niveau === 1 ? niveau1Themes.length :
                       niveau === 2 ? niveau2Themes.length :
                       niveau === 3 ? niveau3Themes.length :
                       niveau === 4 ? niveau4Themes.length : 0;

    // Check if all themes have score >= 75%
    const allThemesCompleted = themesCompleted.length === totalThemes &&
                               themesCompleted.every(theme => theme.score >= 75);

    if (allThemesCompleted && !niveauData.complete) {
      try {
        await api.post('/progression/niveau', { niveau });

        // Update progression state
        setProgression(prev => ({
          ...prev,
          niveauActuel: niveau + 1,
          niveaux: {
            ...prev.niveaux,
            [niveauKey]: {
              ...prev.niveaux[niveauKey],
              complete: true,
              dateCompletion: new Date()
            }
          }
        }));

        // Unlock next niveau
        const nextNiveau = niveau + 1;
        if (nextNiveau <= 4) {
          setNiveauxAccessibles(prev => ({
            ...prev,
            [nextNiveau]: true
          }));
        } else if (nextNiveau > 4) {
          setNiveauxAccessibles(prev => ({
            ...prev,
            final: true
          }));
        }
      } catch (error) {
        console.error('Erreur lors de la mise à jour du niveau:', error);
      }
    }
  };

  const handleSubmitQuiz = async (themeId, quiz) => {
    let correctCount = 0;
    quiz.questions.forEach((q, index) => {
      const userAnswer = quizAnswers[`${themeId}-${index}`];
      if (userAnswer === q.correct) {
        correctCount++;
      }
    });
    const score = Math.round((correctCount / quiz.questions.length) * 100);

    setQuizResults(prev => ({
      ...prev,
      [themeId]: { score, correctCount, total: quiz.questions.length }
    }));
    setShowQuizResults(prev => ({
      ...prev,
      [themeId]: true
    }));

    // Send score to backend
    if (user?.role === 'evangeliste') {
      try {
        const niveau = extractNiveauFromThemeId(themeId);
        await api.post('/progression/theme', {
          niveau,
          themeId,
          score
        });

        // Update progression state
        const niveauKey = `niveau${niveau}`;
        setProgression(prev => {
          const existingThemes = prev.niveaux?.[niveauKey]?.themes || [];
          const themeIndex = existingThemes.findIndex(t => t.themeId === themeId);

          let updatedThemes;
          if (themeIndex >= 0) {
            updatedThemes = [...existingThemes];
            updatedThemes[themeIndex] = { themeId, score, date: new Date() };
          } else {
            updatedThemes = [...existingThemes, { themeId, score, date: new Date() }];
          }

          return {
            ...prev,
            niveaux: {
              ...prev.niveaux,
              [niveauKey]: {
                ...prev.niveaux?.[niveauKey],
                themes: updatedThemes
              }
            }
          };
        });

        // Check if niveau is complete
        setTimeout(() => checkNiveauCompletion(niveau), 500);
      } catch (error) {
        console.error('Erreur lors de la sauvegarde du score:', error);
      }
    }
  };

  const handleSubmitQuizFinal = async (quiz) => {
    let correctCount = 0;
    quiz.questions.forEach((q, index) => {
      const userAnswer = quizAnswers[`quiz-final-${index}`];
      if (userAnswer === q.correct) {
        correctCount++;
      }
    });
    const score = Math.round((correctCount / quiz.questions.length) * 100);

    setQuizResults(prev => ({
      ...prev,
      'quiz-final': { score, correctCount, total: quiz.questions.length }
    }));
    setShowQuizResults(prev => ({
      ...prev,
      'quiz-final': true
    }));

    // Send score to backend
    if (user?.role === 'evangeliste') {
      try {
        await api.post('/progression/quiz-final', { score });

        setProgression(prev => ({
          ...prev,
          quizFinal: {
            complete: score >= 80,
            score,
            date: new Date()
          }
        }));
      } catch (error) {
        console.error('Erreur lors de la sauvegarde du quiz final:', error);
      }
    }
  };

  const niveau1Themes = [
    {
      id: 'theme1',
      titre: 'Dieu nous aime et a un plan merveilleux pour notre vie',
      icon: '🕊️',
      contenu: {
        introduction: "Ce thème établit deux fondements essentiels de la foi chrétienne.",
        points: [
          {
            titre: "1. Dieu nous aime",
            details: [
              "Il est défini comme \"amour\" (1 Jean 4:8)",
              "Son amour est éternel (Jérémie 31:3b)",
              "Cet amour est démontré par le don de son Fils (Jean 3:16)"
            ]
          },
          {
            titre: "2. Il a un plan merveilleux pour nous",
            details: [
              "Dieu a des projets de paix et d'avenir pour l'homme (Jérémie 29:11)",
              "Jésus est venu pour donner la vie en abondance (Jean 10:10)",
              "Dieu veut le bonheur de l'homme dans tous les domaines (études, famille, affaires)"
            ]
          }
        ],
        applications: [
          "Lire Deutéronome 7:1-24 pour identifier les projets de Dieu",
          "Mémoriser Jérémie 29:11"
        ]
      },
      quiz: {
        questions: [
          {
            question: "Comment Dieu est-il défini dans 1 Jean 4:8 ?",
            options: ["Puissance", "Amour", "Justice", "Sagesse"],
            correct: "Amour"
          },
          {
            question: "Selon Jean 3:16, comment Dieu a-t-il démontré son amour ?",
            options: ["En créant le monde", "En donnant son Fils unique", "En pardonnant nos péchés", "En nous donnant la Bible"],
            correct: "En donnant son Fils unique"
          },
          {
            question: "Quel verset dit que Dieu a des projets de paix et d'avenir pour nous ?",
            options: ["Jean 3:16", "Jérémie 29:11", "Romains 3:23", "Matthieu 6:33"],
            correct: "Jérémie 29:11"
          },
          {
            question: "Pourquoi Jésus est-il venu selon Jean 10:10 ?",
            options: ["Pour juger le monde", "Pour donner la vie en abondance", "Pour établir un royaume terrestre", "Pour condamner les pécheurs"],
            correct: "Pour donner la vie en abondance"
          }
        ]
      }
    },
    {
      id: 'theme2',
      titre: 'L\'homme est pécheur et séparé de Dieu',
      icon: '🚫',
      contenu: {
        introduction: "Ce thème explique pourquoi l'homme n'expérimente pas le plan merveilleux de Dieu.",
        points: [
          {
            titre: "1. L'homme est pécheur",
            details: [
              "\"Tous ont péché et sont privés de la gloire de Dieu\" (Romains 3:23)",
              "\"Pas de juste, pas même un seul\" (Romains 3:10)"
            ]
          },
          {
            titre: "2. Qu'est-ce que le péché ?",
            details: [
              "Transgression de la loi (1 Jean 3:4)",
              "Savoir faire le bien et ne pas le faire (Jacques 4:17)",
              "Ce qui ne vient pas de la foi (Romains 14:23)"
            ]
          },
          {
            titre: "3. Les manifestations du péché",
            details: [
              "a) Péchés qui souillent le corps: fornication, adultère, inceste, homosexualité, lesbianisme, prostitution, gourmandise, tabagisme, ivrognerie",
              "b) Péchés qui souillent l'âme: haine, jalousie, colère, disputes, divisions (Galates 5:19-21)",
              "c) Péchés qui souillent l'esprit: idolâtrie, spiritisme, occultisme"
            ]
          },
          {
            titre: "4. Conséquences du péché",
            details: [
              "Au niveau physique: maladies, mort physique",
              "Au niveau spirituel: mort spirituelle, malédiction, mort éternelle (Enfer)",
              "Le péché est la porte d'entrée des démons: obsession → oppression → possession"
            ]
          }
        ],
        applications: [
          "Faire la liste de ses péchés",
          "Demander pardon à Dieu",
          "Mémoriser 1 Jean 1:9"
        ]
      },
      quiz: {
        questions: [
          {
            question: "Selon Romains 3:23, qui a péché et est privé de la gloire de Dieu ?",
            options: ["Seulement les méchants", "Tous les hommes", "Seulement les non-croyants", "Personne"],
            correct: "Tous les hommes"
          },
          {
            question: "Quelle est la définition du péché selon 1 Jean 3:4 ?",
            options: ["L'ignorance de la vérité", "La transgression de la loi", "L'oubli de Dieu", "La faiblesse humaine"],
            correct: "La transgression de la loi"
          },
          {
            question: "Quelles sont les trois catégories de péchés mentionnées ?",
            options: ["Corps, âme et esprit", "Pensées, paroles et actions", "Péchés cachés, publics et secrets", "Péchés mortels, véniels et pardonnables"],
            correct: "Corps, âme et esprit"
          },
          {
            question: "Quelle est une conséquence spirituelle du péché ?",
            options: ["La prospérité matérielle", "La mort spirituelle et éternelle", "La sagesse humaine", "La reconnaissance sociale"],
            correct: "La mort spirituelle et éternelle"
          }
        ]
      }
    },
    {
      id: 'theme3',
      titre: 'Jésus-Christ est la seule solution de Dieu',
      icon: '✝️',
      contenu: {
        introduction: "Jésus-Christ est l'unique solution de Dieu pour le péché de l'homme.",
        points: [
          {
            titre: "1. L'homme ne peut se sauver lui-même",
            details: [
              "Ni les bonnes œuvres, ni l'appartenance à une église, ni la moralité ne peuvent sauver",
              "Le salut est par la grâce, non par les œuvres (Éphésiens 2:8-9)"
            ]
          },
          {
            titre: "2. La personne de Jésus-Christ",
            details: [
              "a) Qui est-il ? Il est Dieu (Jean 1:1), Il s'est fait chair (Jean 1:14), Il est le seul chemin (Jean 14:6)",
              "b) Ce qu'il a fait: Il est mort pour nos péchés (1 Corinthiens 15:3-6), Il est ressuscité pour nous rendre justes (Romains 4:25)"
            ]
          }
        ],
        applications: [
          "Confirmer sa conviction que Christ a payé pour tous ses péchés",
          "Mémoriser Jean 14:6"
        ]
      },
      quiz: {
        questions: [
          {
            question: "Selon Éphésiens 2:8-9, comment sommes-nous sauvés ?",
            options: ["Par nos bonnes œuvres", "Par la grâce, par le moyen de la foi", "Par notre moralité", "Par l'appartenance à une église"],
            correct: "Par la grâce, par le moyen de la foi"
          },
          {
            question: "Selon Jean 14:6, que dit Jésus de lui-même ?",
            options: ["Il est un prophète", "Il est le chemin, la vérité et la vie", "Il est un bon enseignant", "Il est un exemple à suivre"],
            correct: "Il est le chemin, la vérité et la vie"
          },
          {
            question: "Pourquoi Jésus est-il mort selon 1 Corinthiens 15:3-6 ?",
            options: ["Pour donner un exemple", "Pour nos péchés", "Pour établir une religion", "Pour devenir célèbre"],
            correct: "Pour nos péchés"
          },
          {
            question: "Que s'est-il passé après la mort de Jésus selon Romains 4:25 ?",
            options: ["Il a été oublié", "Il est ressuscité pour nous rendre justes", "Il est devenu un ange", "Il a été honoré"],
            correct: "Il est ressuscité pour nous rendre justes"
          }
        ]
      }
    },
    {
      id: 'theme4',
      titre: 'Accepter Jésus-Christ dans notre vie',
      icon: '🙏',
      contenu: {
        introduction: "Ce thème explique les deux actions requises par Actes 20:20-21: se repentir et croire.",
        points: [
          {
            titre: "1. Nous repentir envers Dieu",
            details: [
              "Signification: faire demi-tour, avouer ses péchés, changer de mentalité, abandonner le mal",
              "Les 4 R de la repentance: Refuser (le péché), Rétablir (les relations), Restituer (ce qui a été volé), Réparer (les dommages)"
            ]
          },
          {
            titre: "2. Accepter Jésus-Christ par la foi",
            details: [
              "Il faut \"recevoir\" Christ (Jean 1:12)",
              "Cela se fait par la foi (Éphésiens 2:8-9)",
              "La foi = Transférer sa confiance en Jésus-Christ seul",
              "Cela implique de lui remettre la direction (Seigneurie) de notre vie (Romains 12:1)",
              "L'acceptation se fait par une invitation personnelle (Apocalypse 3:20)"
            ]
          }
        ],
        applications: [
          "Faire une prière d'acceptation de Jésus-Christ",
          "Mémoriser Jean 1:12"
        ]
      },
      quiz: {
        questions: [
          {
            question: "Quelles sont les deux actions requises selon Actes 20:20-21 ?",
            options: ["Prier et jeûner", "Se repentir et croire", "Baptiser et communier", "Lire et méditer"],
            correct: "Se repentir et croire"
          },
          {
            question: "Que signifie la repentance ?",
            options: ["Regretter ses erreurs", "Faire demi-tour et abandonner le mal", "Demander pardon seulement", "Pleurer sur ses péchés"],
            correct: "Faire demi-tour et abandonner le mal"
          },
          {
            question: "Selon Jean 1:12, que devons-nous faire pour devenir enfants de Dieu ?",
            options: ["Aller à l'église", "Recevoir Christ", "Faire de bonnes œuvres", "Être baptisé"],
            correct: "Recevoir Christ"
          },
          {
            question: "Qu'implique accepter Jésus selon Romains 12:1 ?",
            options: ["Seulement croire en Dieu", "Lui remettre la direction de notre vie", "Suivre des règles religieuses", "Assister aux cultes"],
            correct: "Lui remettre la direction de notre vie"
          }
        ]
      }
    },
    {
      id: 'theme5',
      titre: 'Sept (7) certitudes du salut',
      icon: '📜',
      contenu: {
        introduction: "Ce thème liste les choses qui arrivent instantanément lorsque l'on accepte Christ.",
        points: [
          {
            titre: "Ce qui est arrivé",
            details: [
              "1. Jésus-Christ est venu dans notre vie (Apocalypse 3:20)",
              "2. Le Saint-Esprit habite en nous (1 Corinthiens 3:16)",
              "3. Tous nos péchés sont pardonnés (Colossiens 1:14)",
              "4. Nous sommes devenus enfants de Dieu (Jean 1:12)",
              "5. Nous sommes nés de nouveau (Jean 3:3, 5)",
              "6. Nous avons la vie éternelle (Jean 5:24)",
              "7. Nous sommes devenus une nouvelle créature (2 Corinthiens 5:17)"
            ]
          },
          {
            titre: "Être sûr de son salut",
            details: [
              "L'assurance repose sur la Parole de Dieu (1 Jean 5:11-13), non sur les sentiments",
              "Le Saint-Esprit témoigne à notre esprit (Romains 8:16)"
            ]
          }
        ],
        applications: [
          "Énumérer ces bénédictions",
          "Mémoriser 1 Jean 5:12-13"
        ]
      },
      quiz: {
        questions: [
          {
            question: "Combien de certitudes du salut sont mentionnées dans ce thème ?",
            options: ["Cinq", "Six", "Sept", "Huit"],
            correct: "Sept"
          },
          {
            question: "Selon Jean 1:12, que devenons-nous lorsque nous acceptons Christ ?",
            options: ["Des serviteurs de Dieu", "Des enfants de Dieu", "Des prophètes", "Des disciples seulement"],
            correct: "Des enfants de Dieu"
          },
          {
            question: "Selon 2 Corinthiens 5:17, que devient le croyant en Christ ?",
            options: ["Une personne améliorée", "Une nouvelle créature", "Un bon citoyen", "Un religieux"],
            correct: "Une nouvelle créature"
          },
          {
            question: "Sur quoi repose l'assurance du salut selon 1 Jean 5:11-13 ?",
            options: ["Sur nos sentiments", "Sur la Parole de Dieu", "Sur nos œuvres", "Sur l'opinion des autres"],
            correct: "Sur la Parole de Dieu"
          }
        ]
      }
    },
    {
      id: 'theme6',
      titre: 'La vie nouvelle en Christ',
      icon: '✨',
      contenu: {
        introduction: "Devenu une \"nouvelle créature\", le chrétien doit adopter un style de vie radicalement différent.",
        points: [
          {
            titre: "1. Pourquoi mener une vie nouvelle ?",
            details: [
              "Car \"toutes choses sont devenues nouvelles\" (2 Cor 5:17)",
              "Passage des \"ténèbres\" à la \"lumière\" (Éphésiens 5:8)",
              "Porter des \"fruits dignes de la repentance\" (Luc 3:3-9)",
              "Être \"saint\" (mis à part pour Dieu) (1 Pierre 1:15)"
            ]
          },
          {
            titre: "2. Les domaines concernés",
            details: [
              "A. Vie sociale: Être honnête, veiller sur ses paroles, payer ses impôts, être modeste",
              "B. Vie familiale: Parents (honorer le mariage), Mari (aimer sa femme), Femme (être soumise), Enfants (obéir)",
              "C. Vie scolaire/professionnelle: Être exemplaire, soumis aux supérieurs (sauf si cela implique désobéir à Dieu)",
              "D. Vie politique: Exercer selon les principes divins"
            ]
          }
        ],
        applications: [
          "Réflexion personnelle sur les domaines à améliorer",
          "Prière: louange, repentance, requêtes"
        ]
      },
      quiz: {
        questions: [
          {
            question: "Selon 2 Corinthiens 5:17, qu'est-ce qui caractérise la nouvelle créature ?",
            options: ["Les anciennes choses subsistent", "Toutes choses sont devenues nouvelles", "Rien ne change", "Seules quelques choses changent"],
            correct: "Toutes choses sont devenues nouvelles"
          },
          {
            question: "Selon Éphésiens 5:8, de quoi à quoi le chrétien est-il passé ?",
            options: ["De la mort à la vie", "Des ténèbres à la lumière", "De la tristesse à la joie", "De la pauvreté à la richesse"],
            correct: "Des ténèbres à la lumière"
          },
          {
            question: "Quels sont les domaines concernés par la vie nouvelle mentionnés dans ce thème ?",
            options: ["Seulement la vie spirituelle", "Vie sociale, familiale, scolaire/professionnelle et politique", "Seulement la vie d'église", "Seulement la vie personnelle"],
            correct: "Vie sociale, familiale, scolaire/professionnelle et politique"
          }
        ]
      }
    },
    {
      id: 'theme7',
      titre: 'Le baptême d\'eau',
      icon: '💧',
      contenu: {
        introduction: "C'est l'acte suivant à accomplir après avoir accepté Christ.",
        points: [
          {
            titre: "1. Signification du baptême",
            details: [
              "Un engagement d'une bonne conscience envers Dieu (1 Pierre 3:20-21)",
              "Un témoignage public de la mort et résurrection de Christ (Romains 6:3-5)",
              "L'identification du croyant à Christ: le \"vieil homme\" est enterré (Romains 6:6-7)",
              "Une déclaration de victoire sur Satan (Colossiens 2:12-15)",
              "Une confession publique (Matthieu 10:32-33)"
            ]
          },
          {
            titre: "2. Qui devrait être baptisé ?",
            details: [
              "Seulement celui qui s'est repenti et a accepté Jésus-Christ",
              "Note: Le baptême des nourrissons n'est pas biblique"
            ]
          },
          {
            titre: "3. Comment être baptisé ?",
            details: [
              "Le mot grec \"baptizo\" signifie \"plonger, immerger\"",
              "Le baptême biblique est une immersion totale",
              "L'endroit importe peu (rivière, mer, piscine)",
              "Ce n'est pas l'eau qui lave, mais le sang de Jésus-Christ"
            ]
          }
        ],
        applications: [
          "Se faire baptiser si ce n'est pas encore fait",
          "Contacter le formateur"
        ]
      },
      quiz: {
        questions: [
          {
            question: "Selon 1 Pierre 3:20-21, que représente le baptême ?",
            options: ["Un simple bain d'eau", "Un engagement d'une bonne conscience envers Dieu", "Un rituel obligatoire", "Une tradition religieuse"],
            correct: "Un engagement d'une bonne conscience envers Dieu"
          },
          {
            question: "Qui devrait être baptisé selon l'enseignement biblique ?",
            options: ["Tous les nouveau-nés", "Seulement celui qui s'est repenti et a accepté Christ", "Tous les membres de la famille", "Ceux qui le désirent"],
            correct: "Seulement celui qui s'est repenti et a accepté Christ"
          },
          {
            question: "Que signifie le mot grec 'baptizo' ?",
            options: ["Asperger", "Plonger, immerger", "Bénir", "Purifier"],
            correct: "Plonger, immerger"
          },
          {
            question: "Selon Romains 6:3-5, que symbolise le baptême ?",
            options: ["La purification de l'âme", "La mort et la résurrection de Christ", "L'entrée dans l'église", "La fin du péché"],
            correct: "La mort et la résurrection de Christ"
          }
        ]
      }
    },
    {
      id: 'theme8',
      titre: 'La sainte cène',
      icon: '🍞',
      contenu: {
        introduction: "Aussi appelée \"Repas du Seigneur\" ou \"Table du Seigneur\".",
        points: [
          {
            titre: "1. Une institution divine",
            details: [
              "Instituée par Jésus-Christ (Matthieu 26:26-29)",
              "Célébrée par les premiers chrétiens (Actes 2:42)"
            ]
          },
          {
            titre: "2. Sa signification",
            details: [
              "Le pain = symbole du corps de Christ",
              "Le vin = symbole de son sang versé pour le pardon",
              "Se souvenir: Christ est mort pour nos péchés, nos infirmités ont été portées",
              "Union à Christ et aux autres croyants (Romains 12:5)",
              "Annonce du retour de Christ (1 Corinthiens 11:26)"
            ]
          },
          {
            titre: "3. Conditions pour y participer",
            details: [
              "Être un disciple de Christ",
              "Être baptisé par immersion",
              "Être en bonne communion avec Dieu et son prochain (Matthieu 5:23-25)"
            ]
          }
        ],
        applications: [
          "Louer le Seigneur pour le don de sa vie"
        ]
      },
      quiz: {
        questions: [
          {
            question: "Qui a institué la sainte cène selon Matthieu 26:26-29 ?",
            options: ["Les apôtres", "L'église primitive", "Jésus-Christ", "Paul"],
            correct: "Jésus-Christ"
          },
          {
            question: "Que symbolise le pain dans la sainte cène ?",
            options: ["La nourriture spirituelle", "Le corps de Christ", "L'église", "La Parole de Dieu"],
            correct: "Le corps de Christ"
          },
          {
            question: "Selon 1 Corinthiens 11:26, qu'annonce-t-on en prenant la sainte cène ?",
            options: ["Notre foi personnelle", "Le retour de Christ", "Notre repentance", "Notre amour fraternel"],
            correct: "Le retour de Christ"
          },
          {
            question: "Quelles sont les conditions pour participer à la sainte cène ?",
            options: ["Être un disciple de Christ, être baptisé et être en communion", "Seulement croire en Dieu", "Être membre d'une église", "Assister régulièrement aux cultes"],
            correct: "Être un disciple de Christ, être baptisé et être en communion"
          }
        ]
      }
    },
    {
      id: 'theme9',
      titre: 'La croissance chrétienne',
      icon: '🌱',
      contenu: {
        introduction: "Recevoir Christ = naissance spirituelle; il faut maintenant grandir.",
        points: [
          {
            titre: "1. Pourquoi devons-nous grandir ?",
            details: [
              "C'est un commandement (2 Pierre 3:18)",
              "Jésus lui-même a grandi (Luc 2:40, 52)",
              "Pour quitter l'enfance spirituelle (1 Corinthiens 13:11)",
              "Pour jouir de toutes les promesses de Dieu (Galates 4:1-2)"
            ]
          },
          {
            titre: "2. Les dangers de ne pas grandir",
            details: [
              "Ne pas pouvoir jouir des promesses de Dieu",
              "Être \"retranché\" comme un arbre sans fruit (Jean 15:2)",
              "Être victime des fausses doctrines (Éphésiens 4:14)",
              "Rester \"charnel\" (1 Corinthiens 3:1-2)"
            ]
          },
          {
            titre: "3. Domaines de croissance",
            details: [
              "Croître en grâce et connaissance",
              "Croître en amour",
              "Croître en sagesse",
              "Croître en foi"
            ]
          },
          {
            titre: "4. Comment grandir ?",
            details: [
              "a) La Parole de Dieu: la lire, la méditer, la pratiquer (Matthieu 4:4, 1 Pierre 2:2)",
              "b) La prière: vie de prière constante (1 Thessaloniciens 5:17)",
              "c) L'Église: réunions régulières pour la communion fraternelle (Hébreux 10:25)",
              "d) La sanctification: marcher dans la sainteté (Jean 15:1-2)"
            ]
          }
        ],
        applications: [
          "Prendre la décision de grandir",
          "Mémoriser 2 Pierre 3:18"
        ]
      },
      quiz: {
        questions: [
          {
            question: "Selon 2 Pierre 3:18, en quoi devons-nous croître ?",
            options: ["En richesse et prospérité", "En grâce et connaissance de notre Seigneur", "En popularité", "En nombre de membres"],
            correct: "En grâce et connaissance de notre Seigneur"
          },
          {
            question: "Quel est un danger de ne pas grandir spirituellement selon Jean 15:2 ?",
            options: ["Perdre des amis", "Être retranché comme un arbre sans fruit", "Être malade", "Perdre son emploi"],
            correct: "Être retranché comme un arbre sans fruit"
          },
          {
            question: "Quels sont les quatre moyens mentionnés pour grandir spirituellement ?",
            options: ["Jeûner, prier, donner, évangéliser", "La Parole, la prière, l'Église, la sanctification", "Lire, méditer, chanter, témoigner", "Étudier, servir, adorer, partager"],
            correct: "La Parole, la prière, l'Église, la sanctification"
          },
          {
            question: "Selon Hébreux 10:25, que ne devons-nous pas abandonner ?",
            options: ["Nos bonnes habitudes", "Nos réunions d'église", "Nos projets personnels", "Nos traditions"],
            correct: "Nos réunions d'église"
          }
        ]
      }
    },
    {
      id: 'theme10',
      titre: 'La libéralité chrétienne',
      icon: '💰',
      contenu: {
        introduction: "Ce thème traite de la manière dont le chrétien doit donner.",
        points: [
          {
            titre: "1. Trois façons de donner",
            details: [
              "a) La Dîme: La dixième partie de tout revenu qui \"appartient à l'Éternel\" (Lévitique 27:30). À apporter à l'église locale.",
              "b) Les Prémices: Les premiers fruits/produits consacrés à Dieu (Deutéronome 26:1-11)",
              "c) Les offrandes volontaires: Dons en plus des dîmes pour l'entretien des locaux, soutien des pauvres",
              "d) Les aumônes: Dons spécifiques pour les pauvres (Matthieu 6:1-4)"
            ]
          },
          {
            titre: "2. Comment donner ?",
            details: [
              "En se donnant d'abord soi-même (2 Corinthiens 8:5)",
              "Par amour (1 Corinthiens 13:5)",
              "Volontairement, non par contrainte (Exode 25:1)",
              "Par obéissance (Malachie 3:8-12)",
              "Avec joie (2 Corinthiens 9:7)",
              "Avec fidélité (2 Chroniques 31:12)"
            ]
          },
          {
            titre: "3. Dieu bénit ceux qui donnent",
            details: [
              "\"Donnez, et il vous sera donné\" (Luc 6:38)",
              "On moissonne ce que l'on sème (2 Corinthiens 9:6)",
              "Dieu promet l'abondance et la protection (Malachie 3:10-11)",
              "On s'amasse un trésor dans le ciel (Matthieu 6:19-20)"
            ]
          }
        ],
        applications: [
          "Réflexion personnelle",
          "Prière: remerciement, repentance, requêtes"
        ]
      },
      quiz: {
        questions: [
          {
            question: "Selon Lévitique 27:30, quelle proportion de nos revenus appartient à l'Éternel ?",
            options: ["Le cinquième", "Le quart", "La dixième partie (la dîme)", "La moitié"],
            correct: "La dixième partie (la dîme)"
          },
          {
            question: "Selon 2 Corinthiens 9:7, comment devons-nous donner ?",
            options: ["Avec tristesse", "Par contrainte", "Avec joie", "Avec hésitation"],
            correct: "Avec joie"
          },
          {
            question: "Que devons-nous donner en premier selon 2 Corinthiens 8:5 ?",
            options: ["Notre argent", "Nos talents", "Nous-mêmes au Seigneur", "Notre temps"],
            correct: "Nous-mêmes au Seigneur"
          },
          {
            question: "Selon Luc 6:38, quelle promesse Dieu fait-il à ceux qui donnent ?",
            options: ["Ils seront honorés", "Il leur sera donné en retour", "Ils seront bénis spirituellement", "Ils auront la paix"],
            correct: "Il leur sera donné en retour"
          }
        ]
      }
    }
  ];

  const niveau2Themes = [
    {
      id: 'theme1-niveau2',
      titre: 'La communion avec Dieu',
      icon: '🤝',
      contenu: {
        introduction: "Dieu est un être relationnel. En créant l'homme à son image, il a voulu que ce dernier communie avec lui.",
        points: [
          {
            titre: "1. Que signifie le mot 'communion' ?",
            details: [
              "Partage réciproque avec Dieu",
              "Donner et recevoir dans la relation avec Dieu",
              "Une relation vivante et active"
            ]
          },
          {
            titre: "2. Différence entre 'relation' et 'communion'",
            details: [
              "La relation avec Dieu est permanente pour le croyant",
              "La communion peut être rompue par le péché",
              "Il faut distinguer position (relation) et condition (communion)"
            ]
          },
          {
            titre: "3. Les facteurs qui favorisent la communion avec Dieu",
            details: [
              "La lecture et méditation de la Parole de Dieu",
              "La prière quotidienne",
              "L'obéissance à Dieu",
              "La repentance sincère",
              "La confession des péchés",
              "Le jeûne",
              "La louange et l'adoration",
              "La communion fraternelle",
              "Le service pour Dieu",
              "La sanctification",
              "L'amour pour Dieu et le prochain",
              "La foi",
              "L'humilité",
              "La reconnaissance",
              "Le pardon",
              "La patience"
            ]
          }
        ],
        applications: [
          "Identifier ce qui empêche ma communion avec Dieu",
          "Confesser mes péchés (1 Jean 1:9)",
          "Établir un moment quotidien de communion avec Dieu"
        ]
      },
      quiz: {
        questions: [
          {
            question: "Que signifie le mot 'communion' avec Dieu ?",
            options: ["Une relation distante", "Un partage réciproque avec Dieu", "Une obligation religieuse", "Une tradition"],
            correct: "Un partage réciproque avec Dieu"
          },
          {
            question: "Quelle est la différence entre relation et communion ?",
            options: ["Il n'y a pas de différence", "La relation est permanente, la communion peut être rompue par le péché", "La communion est permanente, la relation change", "Les deux sont identiques"],
            correct: "La relation est permanente, la communion peut être rompue par le péché"
          },
          {
            question: "Comment rétablir la communion avec Dieu ?",
            options: ["Attendre que le temps passe", "Confesser ses péchés selon 1 Jean 1:9", "Faire de bonnes œuvres", "Ignorer le problème"],
            correct: "Confesser ses péchés selon 1 Jean 1:9"
          },
          {
            question: "Parmi ces éléments, lequel favorise la communion avec Dieu ?",
            options: ["L'orgueil", "La lecture et méditation de la Parole", "L'indifférence", "La désobéissance"],
            correct: "La lecture et méditation de la Parole"
          }
        ]
      }
    },
    {
      id: 'theme2-niveau2',
      titre: 'Bref aperçu de la Bible',
      icon: '📖',
      contenu: {
        introduction: "La Bible est une bibliothèque de 66 livres répartis entre Ancien et Nouveau Testament.",
        points: [
          {
            titre: "1. L'Ancien Testament (39 livres)",
            details: [
              "Le Pentateuque (5 livres): Genèse à Deutéronome",
              "Les livres historiques (12 livres): Josué à Esther",
              "Les livres poétiques (5 livres): Job à Cantique des cantiques",
              "Les livres prophétiques (17 livres): Ésaïe à Malachie"
            ]
          },
          {
            titre: "2. Le Nouveau Testament (27 livres)",
            details: [
              "Les évangiles (4 livres): Matthieu, Marc, Luc, Jean",
              "Les Actes des Apôtres (1 livre)",
              "Les épîtres (21 livres): Romains à Jude",
              "L'Apocalypse (1 livre)"
            ]
          },
          {
            titre: "3. Les livres apocryphes",
            details: [
              "Ce sont des livres non reconnus comme inspirés",
              "Ils ne font pas partie du canon biblique",
              "Ils contiennent des erreurs doctrinales"
            ]
          },
          {
            titre: "4. Formation de la Bible",
            details: [
              "Écrite sur une période de 1500 ans",
              "Par environ 40 auteurs différents",
              "Tous inspirés par le Saint-Esprit",
              "Unité parfaite malgré la diversité des auteurs"
            ]
          },
          {
            titre: "5. Message central: Jésus-Christ, l'Agneau de Dieu",
            details: [
              "Toute l'Écriture rend témoignage de Christ (Jean 5:39)",
              "L'Ancien Testament annonce sa venue",
              "Le Nouveau Testament révèle son œuvre",
              "La Bible est centrée sur la personne et l'œuvre de Jésus"
            ]
          }
        ],
        applications: [
          "Lire 2 Timothée 3:16-17",
          "Identifier les divisions de la Bible",
          "Mémoriser Jean 5:39"
        ]
      },
      quiz: {
        questions: [
          {
            question: "Combien de livres la Bible contient-elle au total ?",
            options: ["39 livres", "27 livres", "66 livres", "73 livres"],
            correct: "66 livres"
          },
          {
            question: "Combien de livres compose l'Ancien Testament ?",
            options: ["27 livres", "39 livres", "66 livres", "21 livres"],
            correct: "39 livres"
          },
          {
            question: "Selon Jean 5:39, quel est le message central de la Bible ?",
            options: ["La morale", "Les lois", "Jésus-Christ", "L'histoire d'Israël"],
            correct: "Jésus-Christ"
          },
          {
            question: "Sur combien d'années la Bible a-t-elle été écrite ?",
            options: ["100 ans", "500 ans", "1000 ans", "1500 ans"],
            correct: "1500 ans"
          }
        ]
      }
    },
    {
      id: 'theme3-niveau2',
      titre: 'Lire et comprendre la Bible',
      icon: '📚',
      contenu: {
        introduction: "La Bible est le livre le plus répandu mais aussi le moins lu à cause de passages difficiles.",
        points: [
          {
            titre: "1. La Bible est la Parole de Dieu",
            details: [
              "Elle est inspirée par Dieu (2 Timothée 3:16)",
              "Elle est infaillible et sans erreur",
              "Elle est efficace et vivante (Jérémie 23:29)",
              "Elle est notre autorité suprême"
            ]
          },
          {
            titre: "2. Pourquoi lire la Bible ?",
            details: [
              "C'est notre nourriture spirituelle (Matthieu 4:4)",
              "Pour la croissance spirituelle (1 Pierre 2:2)",
              "Pour avoir la direction de Dieu",
              "Pour connaître Dieu et sa volonté",
              "Pour le combat spirituel (Éphésiens 6:17)",
              "Pour réussir dans la vie (Josué 1:8)"
            ]
          },
          {
            titre: "3. Comment lire la Bible ?",
            details: [
              "Avec prière, en demandant l'aide du Saint-Esprit",
              "Dans un esprit d'humilité et de soumission",
              "Avec réflexion personnelle et méditation",
              "De manière systématique et régulière",
              "Avec l'intention de mettre en pratique"
            ]
          },
          {
            titre: "4. Les conditions pour une lecture efficace",
            details: [
              "Conditions spirituelles: être né de nouveau, confesser ses péchés",
              "Conditions humaines: avoir le désir sincère de connaître Dieu",
              "Conditions intellectuelles: être attentif, réfléchir, méditer",
              "Conditions matérielles: avoir un lieu calme, une heure régulière, une Bible, un carnet"
            ]
          }
        ],
        applications: [
          "Établir un moment quotidien de lecture biblique",
          "Mémoriser Josué 1:8",
          "Préparer un lieu et un moment propices à la lecture"
        ]
      },
      quiz: {
        questions: [
          {
            question: "Pourquoi devons-nous lire la Bible selon Matthieu 4:4 ?",
            options: ["Pour la culture", "C'est notre nourriture spirituelle", "Par obligation", "Pour impressionner les autres"],
            correct: "C'est notre nourriture spirituelle"
          },
          {
            question: "Quelles sont les conditions pour une lecture efficace de la Bible ?",
            options: ["Seulement avoir une Bible", "Conditions spirituelles, humaines, intellectuelles et matérielles", "Savoir lire uniquement", "Être dans une église"],
            correct: "Conditions spirituelles, humaines, intellectuelles et matérielles"
          },
          {
            question: "Quel livre parle de méditer la Parole jour et nuit pour réussir ?",
            options: ["Genèse 1", "Psaume 119", "Jean 3", "Apocalypse 22"],
            correct: "Psaume 119"
          },
          {
            question: "Comment devons-nous lire la Bible ?",
            options: ["Rapidement pour finir vite", "Avec prière et dans un esprit d'humilité", "Sans réfléchir", "Une fois par mois"],
            correct: "Avec prière et dans un esprit d'humilité"
          }
        ]
      }
    },
    {
      id: 'theme4-niveau2',
      titre: 'Pratique de la méditation biblique',
      icon: '🧘',
      contenu: {
        introduction: "La méditation est un exercice spirituel qui transforme notre conduite.",
        points: [
          {
            titre: "1. Qu'est-ce que la méditation ?",
            details: [
              "Réfléchir profondément sur la Parole de Dieu",
              "Ruminer comme une vache rumine sa nourriture",
              "Laisser la Parole pénétrer notre cœur et notre esprit",
              "Différent de la méditation orientale ou transcendantale"
            ]
          },
          {
            titre: "2. Quand méditer ?",
            details: [
              "Quotidiennement (Josué 1:8)",
              "Le matin pour commencer la journée",
              "Le soir pour la terminer",
              "À tout moment de la journée"
            ]
          },
          {
            titre: "3. Quoi méditer ?",
            details: [
              "Toute la Bible, pas seulement les passages favoris",
              "De manière systématique (livre par livre, chapitre par chapitre)",
              "Les promesses de Dieu",
              "Les commandements de Dieu"
            ]
          },
          {
            titre: "4. Les 5 étapes de la méditation",
            details: [
              "Étape 1: Prière - Demander l'aide du Saint-Esprit",
              "Étape 2: Lecture - Lire attentivement le passage plusieurs fois",
              "Étape 3: Méditation - Observer (qui, quoi, où, quand, comment, pourquoi) et Interpréter (que signifie ce texte ?)",
              "Étape 4: Prière - Répondre à Dieu par la prière",
              "Étape 5: Pratique - Mettre en pratique ce qui a été compris (Jacques 1:22)"
            ]
          }
        ],
        applications: [
          "Méditer Actes 5:1-11 en suivant les 5 étapes",
          "Mémoriser Jacques 1:22",
          "Établir un plan de méditation quotidienne"
        ]
      },
      quiz: {
        questions: [
          {
            question: "Quelles sont les 5 étapes de la méditation biblique ?",
            options: ["Lire, écrire, parler, écouter, dormir", "Prière, Lecture, Méditation, Prière, Pratique", "Lire, comprendre, oublier, répéter, terminer", "Chanter, danser, prier, lire, partir"],
            correct: "Prière, Lecture, Méditation, Prière, Pratique"
          },
          {
            question: "Que signifie 'observer' dans l'étape de méditation ?",
            options: ["Regarder par la fenêtre", "Se poser les questions: qui, quoi, où, quand, comment, pourquoi", "Lire rapidement", "Ne rien faire"],
            correct: "Se poser les questions: qui, quoi, où, quand, comment, pourquoi"
          },
          {
            question: "Selon Jacques 1:22, que devons-nous faire après avoir médité la Parole ?",
            options: ["L'oublier", "La mettre en pratique", "Seulement l'écouter", "La critiquer"],
            correct: "La mettre en pratique"
          },
          {
            question: "Quelle est la différence entre observation et interprétation ?",
            options: ["Il n'y a pas de différence", "L'observation demande ce que dit le texte, l'interprétation demande ce qu'il signifie", "L'interprétation vient avant l'observation", "Ce sont deux mots pour la même chose"],
            correct: "L'observation demande ce que dit le texte, l'interprétation demande ce qu'il signifie"
          }
        ]
      }
    },
    {
      id: 'theme5-niveau2',
      titre: 'La vie de prière et de jeûne',
      icon: '🙏',
      contenu: {
        introduction: "Dieu a institué la prière pour communiquer avec Lui, et le jeûne pour approfondir notre foi.",
        points: [
          {
            titre: "1. Qu'est-ce que la prière ?",
            details: [
              "Parler à Dieu, communiquer avec Lui",
              "Intercession pour les autres",
              "Requête pour nos besoins",
              "Action de grâces pour ses bienfaits"
            ]
          },
          {
            titre: "2. Différentes sortes de prières",
            details: [
              "Supplication: demander avec insistance",
              "Action de grâces: remercier Dieu",
              "Repentance: confesser ses péchés",
              "Louange: célébrer qui est Dieu",
              "Intercession: prier pour les autres",
              "Adoration: exalter Dieu pour sa grandeur"
            ]
          },
          {
            titre: "3. Pourquoi prier ?",
            details: [
              "C'est un commandement de Dieu (1 Thessaloniciens 5:17)",
              "Pour expérimenter la joie",
              "Pour avoir la victoire sur la tentation",
              "Pour obtenir la puissance de Dieu",
              "Pour porter du fruit spirituel"
            ]
          },
          {
            titre: "4. À qui adresser la prière ?",
            details: [
              "Au Père, au nom de Jésus (Jean 16:23)",
              "À Jésus-Christ directement (Actes 7:59)",
              "Jamais aux morts ou aux anges",
              "Jamais aux saints ou à Marie"
            ]
          },
          {
            titre: "5. Comment prier ?",
            details: [
              "De tout cœur, avec sincérité",
              "Avec foi, en croyant que Dieu exauce",
              "Au nom de Jésus (Jean 14:13-14)",
              "Avec persévérance (Luc 18:1)",
              "Avec patience, en attendant la réponse de Dieu"
            ]
          },
          {
            titre: "6. Obstacles à la prière",
            details: [
              "Mauvaises motivations (Jacques 4:3)",
              "Le péché dans notre vie (Psaume 66:18)",
              "Les idoles dans notre cœur (Ézéchiel 14:3)",
              "Le refus de pardonner (Marc 11:25)",
              "L'incrédulité (Jacques 1:6-7)"
            ]
          },
          {
            titre: "7. Le jeûne",
            details: [
              "Définition: s'abstenir de nourriture pour se consacrer à la prière",
              "Pourquoi jeûner ? Pour chercher Dieu, pour des besoins spécifiques, pour la délivrance",
              "Comment jeûner ? Avec humilité, dans le secret (Matthieu 6:16-18), avec la prière",
              "Durée: selon la direction de Dieu (1 jour, 3 jours, 7 jours, 40 jours)"
            ]
          }
        ],
        applications: [
          "Établir une vie de prière quotidienne",
          "Mémoriser Jean 16:23",
          "Pratiquer le jeûne régulièrement"
        ]
      },
      quiz: {
        questions: [
          {
            question: "Quels sont les types de prières mentionnés ?",
            options: ["Seulement la supplication", "Supplication, action de grâces, repentance, louange, intercession, adoration", "Seulement la demande", "Prière du matin uniquement"],
            correct: "Supplication, action de grâces, repentance, louange, intercession, adoration"
          },
          {
            question: "Quel est un obstacle à la prière selon Jacques 4:3 ?",
            options: ["Prier trop longtemps", "Mauvaises motivations", "Prier à voix haute", "Prier en groupe"],
            correct: "Mauvaises motivations"
          },
          {
            question: "Comment devons-nous prier selon Jean 16:23 ?",
            options: ["En notre propre nom", "Au nom de Jésus", "Au nom des saints", "Au nom de Marie"],
            correct: "Au nom de Jésus"
          },
          {
            question: "Qu'est-ce que le jeûne biblique ?",
            options: ["Arrêter de parler", "S'abstenir de nourriture pour se consacrer à la prière", "Dormir toute la journée", "Ne pas travailler"],
            correct: "S'abstenir de nourriture pour se consacrer à la prière"
          }
        ]
      }
    },
    {
      id: 'theme6-niveau2',
      titre: 'La vie d\'obéissance à Dieu',
      icon: '✅',
      contenu: {
        introduction: "En reconnaissant Jésus comme Seigneur, nous pouvons vivre une vie d'obéissance par le Saint-Esprit.",
        points: [
          {
            titre: "1. Le fondement de notre obéissance",
            details: [
              "Dieu est amour (1 Jean 4:8)",
              "Dieu est notre Créateur",
              "Dieu nous aime et veut notre bien",
              "L'obéissance est une réponse d'amour (Jean 14:15)"
            ]
          },
          {
            titre: "2. Obéir à Dieu = obéir à Sa Parole",
            details: [
              "La parabole des deux bâtisseurs (Matthieu 7:24-27)",
              "L'homme prudent: écoute et met en pratique la Parole",
              "L'homme insensé: écoute mais ne met pas en pratique",
              "Les conséquences de l'obéissance ou de la désobéissance"
            ]
          },
          {
            titre: "3. Comment obéir ?",
            details: [
              "Par amour pour Dieu, non par contrainte (Jean 14:21)",
              "Par la puissance du Saint-Esprit (Romains 8:13)",
              "Immédiatement, sans tarder",
              "Complètement, sans réserve",
              "Malgré les circonstances difficiles",
              "Avec joie et reconnaissance"
            ]
          }
        ],
        applications: [
          "Identifier un domaine de désobéissance dans ma vie",
          "Demander la force du Saint-Esprit pour obéir",
          "Mémoriser Jean 14:21"
        ]
      },
      quiz: {
        questions: [
          {
            question: "Quel est le fondement de notre obéissance selon Jean 14:15 ?",
            options: ["La peur de Dieu", "L'amour pour Dieu", "L'obligation religieuse", "La tradition"],
            correct: "L'amour pour Dieu"
          },
          {
            question: "Quelle est la différence entre les deux bâtisseurs dans Matthieu 7:24-27 ?",
            options: ["L'un est riche, l'autre pauvre", "L'un écoute et pratique, l'autre écoute mais ne pratique pas", "L'un prie, l'autre non", "L'un jeûne, l'autre non"],
            correct: "L'un écoute et pratique, l'autre écoute mais ne pratique pas"
          },
          {
            question: "Comment pouvons-nous obéir à Dieu ?",
            options: ["Par nos propres forces uniquement", "Par la puissance du Saint-Esprit", "En suivant nos sentiments", "En imitant les autres"],
            correct: "Par la puissance du Saint-Esprit"
          },
          {
            question: "Quel est le rôle du Saint-Esprit dans l'obéissance selon Romains 8:13 ?",
            options: ["Il nous condamne", "Il nous donne la puissance d'obéir", "Il nous observe", "Il nous juge"],
            correct: "Il nous donne la puissance d'obéir"
          }
        ]
      }
    },
    {
      id: 'theme7-niveau2',
      titre: 'Comment obtenir la direction de Dieu ?',
      icon: '🧭',
      contenu: {
        introduction: "Dieu promet de diriger nos pas. Il nous faut savoir comment reconnaître Sa direction.",
        points: [
          {
            titre: "1. Les 7 'balises lumineuses' pour discerner la direction de Dieu",
            details: [
              "1. Conviction intérieure: paix et assurance du Saint-Esprit",
              "2. Confirmation dans les Écritures: la direction ne contredit jamais la Bible",
              "3. Confirmation par prophétie: message prophétique confirmant la direction",
              "4. Conseil de chrétiens mûrs: sagesse des anciens et leaders spirituels",
              "5. Circonstances: Dieu ouvre ou ferme des portes",
              "6. Paix de Dieu: paix intérieure qui surpasse toute intelligence (Philippiens 4:7)",
              "7. Provision de Dieu: Il pourvoit aux moyens nécessaires"
            ]
          },
          {
            titre: "2. Dieu dirige dans les ténèbres",
            details: [
              "Parfois Dieu nous demande d'avancer sans tout comprendre (Ésaïe 42:16)",
              "Il faut rester fidèle même dans l'obscurité",
              "La foi consiste à faire confiance à Dieu malgré les circonstances",
              "Dieu révèle son plan étape par étape"
            ]
          }
        ],
        applications: [
          "Appliquer les 7 balises à une décision importante",
          "Mémoriser Ésaïe 58:11",
          "Consulter des chrétiens mûrs pour une direction importante"
        ]
      },
      quiz: {
        questions: [
          {
            question: "Combien de 'balises lumineuses' sont mentionnées pour discerner la direction de Dieu ?",
            options: ["5 balises", "7 balises", "10 balises", "3 balises"],
            correct: "7 balises"
          },
          {
            question: "Quelle est la première balise à considérer ?",
            options: ["Les circonstances", "La conviction intérieure du Saint-Esprit", "Les prophéties", "L'argent disponible"],
            correct: "La conviction intérieure du Saint-Esprit"
          },
          {
            question: "Quel rôle joue la paix de Dieu dans la direction selon Philippiens 4:7 ?",
            options: ["Aucun rôle", "Elle confirme la bonne direction", "Elle crée la confusion", "Elle est facultative"],
            correct: "Elle confirme la bonne direction"
          },
          {
            question: "Que signifie 'Dieu dirige dans les ténèbres' selon Ésaïe 42:16 ?",
            options: ["Dieu nous abandonne", "Nous devons tout comprendre avant d'obéir", "Parfois Dieu demande d'avancer sans tout comprendre", "Dieu ne dirige jamais dans l'obscurité"],
            correct: "Parfois Dieu demande d'avancer sans tout comprendre"
          }
        ]
      }
    },
    {
      id: 'theme8-niveau2',
      titre: 'La communion fraternelle',
      icon: '👥',
      contenu: {
        introduction: "La communion fraternelle est une nécessité vitale, pas une option facultative.",
        points: [
          {
            titre: "1. Les buts de la communion fraternelle",
            details: [
              "S'entraider mutuellement",
              "S'encourager les uns les autres",
              "Se stimuler à l'amour et aux bonnes œuvres (Hébreux 10:24-25)",
              "Porter les fardeaux les uns des autres (Galates 6:2)"
            ]
          },
          {
            titre: "2. Ce qu'apporte la communion",
            details: [
              "Édification spirituelle",
              "Encouragement dans les épreuves",
              "Joie et réconfort",
              "Unité dans le corps de Christ",
              "Croissance spirituelle"
            ]
          },
          {
            titre: "3. Les facteurs qui favorisent la communion",
            details: [
              "L'amour fraternel sincère",
              "L'humilité",
              "Le pardon mutuel",
              "La prière les uns pour les autres",
              "Le partage des biens matériels",
              "L'honnêteté et la transparence",
              "L'acceptation mutuelle",
              "La patience",
              "La douceur",
              "La bienveillance",
              "L'écoute active",
              "Le service mutuel",
              "L'hospitalité",
              "La générosité",
              "La fidélité",
              "Le respect mutuel",
              "La compassion",
              "L'encouragement",
              "La prière commune",
              "L'étude biblique ensemble",
              "Le partage des témoignages",
              "La célébration ensemble",
              "Le soutien dans les épreuves",
              "La correction fraternelle avec amour",
              "L'unité d'esprit",
              "La soumission mutuelle",
              "La reconnaissance des dons de chacun",
              "La collaboration dans le service",
              "Le pardon rapide",
              "La communication ouverte",
              "La confiance mutuelle"
            ]
          },
          {
            titre: "4. Les obstacles à la communion",
            details: [
              "L'esprit d'indépendance",
              "La superficialité dans les relations",
              "L'amertume et le ressentiment",
              "L'orgueil et l'égoïsme",
              "Les commérages et médisances",
              "Le manque de pardon"
            ]
          }
        ],
        applications: [
          "Identifier un obstacle à la communion dans ma vie",
          "Mémoriser Hébreux 10:25",
          "S'engager activement dans une cellule ou un groupe de maison"
        ]
      },
      quiz: {
        questions: [
          {
            question: "Quels sont les buts de la communion fraternelle selon Hébreux 10:24-25 ?",
            options: ["Passer du bon temps ensemble", "S'entraider, s'encourager, se stimuler à l'amour et aux bonnes œuvres", "Critiquer les absents", "Faire des affaires"],
            correct: "S'entraider, s'encourager, se stimuler à l'amour et aux bonnes œuvres"
          },
          {
            question: "Quel est un obstacle majeur à la communion fraternelle ?",
            options: ["L'amour", "L'orgueil et l'égoïsme", "La prière", "Le pardon"],
            correct: "L'orgueil et l'égoïsme"
          },
          {
            question: "Que dit Hébreux 10:24-25 sur la communion fraternelle ?",
            options: ["C'est facultatif", "Il ne faut pas abandonner nos assemblées", "On peut s'isoler", "C'est pour les leaders seulement"],
            correct: "Il ne faut pas abandonner nos assemblées"
          },
          {
            question: "Pourquoi la communion fraternelle est-elle importante ?",
            options: ["Pour avoir des amis", "C'est une nécessité vitale pour l'édification et la croissance", "Pour passer le temps", "Par tradition"],
            correct: "C'est une nécessité vitale pour l'édification et la croissance"
          }
        ]
      }
    },
    {
      id: 'theme9-niveau2',
      titre: 'Le pardon mutuel et la réconciliation',
      icon: '🕊️',
      contenu: {
        introduction: "Dans la famille de Dieu, il y a des tensions. D'où la nécessité du pardon et de la réconciliation.",
        points: [
          {
            titre: "1. Ce que signifie pardonner",
            details: [
              "Effacer l'offense (Ésaïe 43:25)",
              "Oublier le mal subi",
              "Ne plus tenir compte des fautes",
              "Libérer celui qui nous a offensé",
              "Se libérer soi-même de l'amertume"
            ]
          },
          {
            titre: "2. Pourquoi devons-nous pardonner ?",
            details: [
              "C'est un commandement de Dieu (Colossiens 3:13)",
              "Pour être pardonnés nous-mêmes (Matthieu 6:14-15)",
              "Pour vivre en paix avec tous",
              "Pour ressembler à Christ",
              "Pour maintenir la communion avec Dieu"
            ]
          },
          {
            titre: "3. Les obstacles au pardon",
            details: [
              "L'orgueil et l'amour-propre blessé",
              "Le désir de vengeance",
              "L'incompréhension de la grâce de Dieu",
              "La gravité de l'offense perçue",
              "Le manque d'amour"
            ]
          },
          {
            titre: "4. Combien de fois pardonner ?",
            details: [
              "Toujours, sans limite (Matthieu 18:21-22)",
              "70 fois 7 fois = infiniment",
              "À chaque fois que notre frère se repent",
              "Le pardon doit devenir un style de vie"
            ]
          },
          {
            titre: "5. La réconciliation",
            details: [
              "C'est notre responsabilité d'initier la réconciliation (Matthieu 5:23-24)",
              "Aller vers celui qui a quelque chose contre nous",
              "Aspects pratiques: approche humble, reconnaissance de notre part de tort, demande de pardon",
              "Restauration de la relation"
            ]
          }
        ],
        applications: [
          "Identifier quelqu'un à qui je dois pardonner",
          "Entreprendre une démarche de réconciliation cette semaine",
          "Mémoriser Colossiens 3:13"
        ]
      },
      quiz: {
        questions: [
          {
            question: "Que signifie pardonner selon Ésaïe 43:25 ?",
            options: ["Se venger", "Effacer l'offense et ne plus s'en souvenir", "Ignorer la personne", "Faire semblant"],
            correct: "Effacer l'offense et ne plus s'en souvenir"
          },
          {
            question: "Combien de fois devons-nous pardonner selon Matthieu 18:21-22 ?",
            options: ["Une fois", "Sept fois", "70 fois 7 fois (toujours)", "Jamais"],
            correct: "70 fois 7 fois (toujours)"
          },
          {
            question: "Selon Matthieu 5:23-24, qui doit initier la réconciliation ?",
            options: ["Seulement celui qui a offensé", "C'est notre responsabilité d'initier", "Personne", "Le pasteur"],
            correct: "C'est notre responsabilité d'initier"
          },
          {
            question: "Quel est un obstacle au pardon ?",
            options: ["L'amour", "L'orgueil et le désir de vengeance", "La foi", "L'humilité"],
            correct: "L'orgueil et le désir de vengeance"
          }
        ]
      }
    }
  ];

  const niveau3Themes = [
    {
      id: 'theme1-niveau3',
      titre: 'Le Saint-Esprit',
      icon: '💨',
      contenu: {
        introduction: "Quand nous avons reçu Jésus-Christ, le Saint-Esprit est venu habiter en nous. Nous devenons le temple du Saint-Esprit (1 Cor 3:16).",
        points: [
          {
            titre: "1. Ce que le Saint-Esprit n'est pas",
            details: [
              "Pas une force impersonnelle",
              "Pas seulement la puissance",
              "Pas un simple sentiment"
            ]
          },
          {
            titre: "2. Ce que le Saint-Esprit est",
            details: [
              "Il est Dieu (Actes 5:3-5)",
              "Il est une personne avec des attributs personnels",
              "Il possède intelligence, volonté et émotions"
            ]
          },
          {
            titre: "3. Ses caractères",
            details: [
              "Esprit de sainteté",
              "Esprit d'adoption",
              "Esprit de puissance",
              "Esprit de vérité",
              "Esprit qui glorifie Christ",
              "Esprit de vie",
              "Esprit de grâce"
            ]
          },
          {
            titre: "4. Son œuvre dans l'homme",
            details: [
              "Conviction de péché",
              "Nouvelle naissance",
              "Conduit dans la vérité",
              "Baptise en un seul corps",
              "Témoigne que nous sommes enfants de Dieu",
              "Donne intelligence spirituelle",
              "Fait marcher dans la victoire",
              "Intercède pour nous",
              "Nous conduit",
              "Produit le fruit"
            ]
          }
        ],
        applications: [
          "Remercier Dieu pour le Saint-Esprit",
          "Mémoriser Jean 16:13-14"
        ]
      },
      quiz: {
        questions: [
          {
            question: "Que dit Actes 5:3-5 sur la nature du Saint-Esprit ?",
            options: ["C'est une force", "C'est Dieu lui-même", "C'est un sentiment", "C'est une énergie"],
            correct: "C'est Dieu lui-même"
          },
          {
            question: "Parmi ces caractères, lequel ne décrit PAS le Saint-Esprit ?",
            options: ["Esprit de vérité", "Esprit de sainteté", "Esprit de confusion", "Esprit de grâce"],
            correct: "Esprit de confusion"
          },
          {
            question: "Quelle est une œuvre du Saint-Esprit dans l'homme ?",
            options: ["Condamner sans cesse", "Conduire dans la vérité", "Créer la confusion", "Diviser les croyants"],
            correct: "Conduire dans la vérité"
          },
          {
            question: "Selon Jean 16:13-14, quel est le rôle du Saint-Esprit ?",
            options: ["Nous condamner", "Nous conduire dans toute la vérité et glorifier Christ", "Nous laisser seuls", "Nous confondre"],
            correct: "Nous conduire dans toute la vérité et glorifier Christ"
          }
        ]
      }
    },
    {
      id: 'theme2-niveau3',
      titre: 'Dieu veut nous remplir du Saint-Esprit',
      icon: '🔥',
      contenu: {
        introduction: "La volonté de Dieu est que nous soyons remplis du Saint-Esprit comme Christ (Luc 4:1).",
        points: [
          {
            titre: "1. La volonté de Dieu",
            details: [
              "Éphésiens 5:18 - Ne vous enivrez pas de vin, mais soyez remplis du Saint-Esprit",
              "C'est un commandement, non une option",
              "Dieu veut que tous ses enfants soient remplis"
            ]
          },
          {
            titre: "2. Pourquoi Dieu veut nous remplir ?",
            details: [
              "Pour nous sanctifier et nous rendre semblables à Christ (Romains 8:29)",
              "Pour nous donner la puissance pour servir (Actes 1:8)",
              "Pour porter du fruit spirituel",
              "Pour vivre une vie victorieuse"
            ]
          },
          {
            titre: "3. Que signifie 'être rempli du Saint-Esprit' ?",
            details: [
              "Être contrôlé par l'Esprit",
              "Lui permettre de diriger notre vie",
              "Lui donner toute la place",
              "Vivre sous son influence constante"
            ]
          }
        ],
        applications: [
          "Décider d'obéir à Éphésiens 5:18",
          "Mémoriser Éphésiens 5:18"
        ]
      },
      quiz: {
        questions: [
          {
            question: "Que dit Éphésiens 5:18 ?",
            options: ["Priez sans cesse", "Ne vous enivrez pas, mais soyez remplis du Saint-Esprit", "Aimez-vous les uns les autres", "Baptisez-vous"],
            correct: "Ne vous enivrez pas, mais soyez remplis du Saint-Esprit"
          },
          {
            question: "Pourquoi Dieu veut-il nous remplir du Saint-Esprit ?",
            options: ["Pour nous rendre fiers", "Pour nous sanctifier et nous donner la puissance", "Pour nous isoler", "Pour nous rendre parfaits instantanément"],
            correct: "Pour nous sanctifier et nous donner la puissance"
          },
          {
            question: "Que signifie être rempli du Saint-Esprit ?",
            options: ["Avoir des émotions fortes", "Être contrôlé par l'Esprit et lui donner toute la place", "Ne plus avoir de problèmes", "Devenir parfait"],
            correct: "Être contrôlé par l'Esprit et lui donner toute la place"
          },
          {
            question: "Être rempli du Saint-Esprit est-il une option ou un commandement ?",
            options: ["Une option facultative", "Un commandement de Dieu", "Seulement pour les leaders", "Pour ceux qui en ressentent le besoin"],
            correct: "Un commandement de Dieu"
          }
        ]
      }
    },
    {
      id: 'theme3-niveau3',
      titre: 'Trois sortes d\'hommes',
      icon: '👥',
      contenu: {
        introduction: "Dans 1 Corinthiens 2:14 et 3:1, la Bible énumère trois sortes d'hommes.",
        points: [
          {
            titre: "1. L'homme naturel/animal",
            details: [
              "N'a pas reçu Christ",
              "Le 'moi' sur le trône de sa vie",
              "Vit dans le péché",
              "A besoin de salut",
              "Ne comprend pas les choses spirituelles"
            ]
          },
          {
            titre: "2. L'homme spirituel",
            details: [
              "A reçu Christ",
              "Le Saint-Esprit habite en lui",
              "Christ sur le trône de sa vie",
              "Marche dans la lumière",
              "Vie transformée",
              "Aime prier, lire la Bible et témoigner"
            ]
          },
          {
            titre: "3. L'homme/chrétien charnel",
            details: [
              "A reçu Christ mais dirige sa vie lui-même",
              "Désobéit à Dieu",
              "Vie désordonnée",
              "Pas de témoignage",
              "Vie semblable à l'homme naturel",
              "Besoin de croissance spirituelle"
            ]
          }
        ],
        applications: [
          "Identifier quelle image représente ma vie",
          "Décider de devenir spirituel",
          "Mémoriser Romains 8:14"
        ]
      },
      quiz: {
        questions: [
          {
            question: "Quels sont les trois types d'hommes mentionnés dans 1 Corinthiens 2-3 ?",
            options: ["Bon, mauvais, neutre", "Naturel, spirituel, charnel", "Jeune, adulte, vieux", "Riche, pauvre, moyen"],
            correct: "Naturel, spirituel, charnel"
          },
          {
            question: "Quelle est la caractéristique de l'homme spirituel ?",
            options: ["Christ sur le trône de sa vie", "Vit dans le péché", "Désobéit à Dieu", "N'a pas reçu Christ"],
            correct: "Christ sur le trône de sa vie"
          },
          {
            question: "Quelle est la différence entre l'homme naturel et le chrétien charnel ?",
            options: ["Il n'y a pas de différence", "Le charnel a reçu Christ mais se dirige lui-même", "Le naturel est meilleur", "Le charnel n'a jamais accepté Christ"],
            correct: "Le charnel a reçu Christ mais se dirige lui-même"
          },
          {
            question: "Que dit Romains 8:14 sur les fils de Dieu ?",
            options: ["Ils sont parfaits", "Ils sont conduits par l'Esprit de Dieu", "Ils n'ont plus de problèmes", "Ils sont riches"],
            correct: "Ils sont conduits par l'Esprit de Dieu"
          }
        ]
      }
    },
    {
      id: 'theme4-niveau3',
      titre: 'Comment être rempli du Saint-Esprit',
      icon: '📋',
      contenu: {
        introduction: "Dieu veut nous remplir du Saint-Esprit. Les premiers chrétiens l'étaient constamment (Actes 2:4, 4:31, 9:17).",
        points: [
          {
            titre: "1. Les cinq étapes pour être rempli",
            details: [
              "Étape 1: Avoir faim et soif (Matthieu 5:6)",
              "Étape 2: Confesser tout péché (1 Jean 1:9)",
              "Étape 3: Se consacrer à Dieu sans réserve (Romains 6:13, 12:1)",
              "Étape 4: Demander à Dieu (Luc 11:13)",
              "Étape 5: Croire par la foi (Hébreux 11:6 - basé sur commandement et fidélité de Dieu)"
            ]
          },
          {
            titre: "2. Soyez continuellement remplis",
            details: [
              "Expérience à renouveler constamment",
              "Pas une expérience unique",
              "Vie de dépendance quotidienne"
            ]
          },
          {
            titre: "3. Respiration spirituelle",
            details: [
              "Quand nous avons péché:",
              "Expirer: confesser le péché immédiatement",
              "Inspirer: recevoir le pardon par la foi",
              "Rétablissement immédiat de la communion"
            ]
          },
          {
            titre: "4. Avantages d'être rempli",
            details: [
              "Fruit de l'Esprit dans notre vie",
              "Victoire sur la chair",
              "Croissance spirituelle",
              "Puissance pour témoigner"
            ]
          }
        ],
        applications: [
          "Citer les 5 étapes",
          "Prier pour être rempli du Saint-Esprit",
          "Mémoriser Éphésiens 5:18"
        ]
      },
      quiz: {
        questions: [
          {
            question: "Quelles sont les 5 étapes pour être rempli du Saint-Esprit ?",
            options: ["Prier, jeûner, lire, chanter, danser", "Avoir faim et soif, confesser, se consacrer, demander, croire", "Aller à l'église, donner, servir, aimer, pardonner", "Lire, méditer, prier, obéir, témoigner"],
            correct: "Avoir faim et soif, confesser, se consacrer, demander, croire"
          },
          {
            question: "Qu'est-ce que la respiration spirituelle ?",
            options: ["Une technique de méditation", "Expirer le péché par confession et inspirer par la foi", "Une forme de prière", "Un exercice physique"],
            correct: "Expirer le péché par confession et inspirer par la foi"
          },
          {
            question: "Selon Luc 11:13, que donne le Père à ceux qui le lui demandent ?",
            options: ["De l'argent", "Le Saint-Esprit", "La sagesse", "La guérison"],
            correct: "Le Saint-Esprit"
          },
          {
            question: "Quels sont les avantages d'être rempli du Saint-Esprit ?",
            options: ["Richesse matérielle", "Fruit de l'Esprit, victoire, croissance, puissance", "Popularité", "Absence de problèmes"],
            correct: "Fruit de l'Esprit, victoire, croissance, puissance"
          }
        ]
      }
    },
    {
      id: 'theme5-niveau3',
      titre: 'Le Baptême du Saint-Esprit',
      icon: '⚡',
      contenu: {
        introduction: "La Bible utilise plusieurs expressions: baptême du Saint-Esprit, recevoir le Saint-Esprit, être revêtu de puissance.",
        points: [
          {
            titre: "1. Ses caractéristiques",
            details: [
              "Biblique et fondé sur la Parole",
              "Suit la nouvelle naissance",
              "Diffère de la plénitude du Saint-Esprit",
              "Peut précéder le baptême d'eau",
              "Suivi de manifestations surnaturelles variables",
              "Peut être reçu par imposition des mains ou pas"
            ]
          },
          {
            titre: "2. L'expérience du baptême",
            details: [
              "Expérience réelle et observable",
              "Expérience consciente et précise",
              "Deux phases: expérience intérieure de plénitude et manifestation extérieure"
            ]
          },
          {
            titre: "3. Qui peut recevoir ?",
            details: [
              "Tout croyant né de nouveau",
              "Pas réservé à une élite spirituelle",
              "Disponible pour tous les enfants de Dieu"
            ]
          },
          {
            titre: "4. Conditions pour recevoir",
            details: [
              "Se repentir",
              "Être baptisé d'eau",
              "Avoir soif",
              "Demander par la foi avec persévérance",
              "Obéir à Dieu",
              "Croire"
            ]
          },
          {
            titre: "5. Conséquences du baptême",
            details: [
              "Dons spirituels",
              "Puissance pour témoigner",
              "Hardiesse",
              "Louange",
              "Illumination spirituelle",
              "Victoire sur le péché",
              "Aide à la prière"
            ]
          },
          {
            titre: "6. Pourquoi parler en langues ?",
            details: [
              "Communion avec Dieu",
              "Édification personnelle",
              "Édification de l'Église quand interprété",
              "Prière et chant avec l'Esprit",
              "Louange à Dieu",
              "Maîtrise de la langue",
              "Action de grâces",
              "Porte d'entrée aux dons spirituels"
            ]
          }
        ],
        applications: [
          "Reprendre les conditions pour être baptisé",
          "Désirer être baptisé du Saint-Esprit",
          "Mémoriser Actes 1:8"
        ]
      },
      quiz: {
        questions: [
          {
            question: "Quelle est la différence entre le baptême du Saint-Esprit et la plénitude ?",
            options: ["Il n'y a pas de différence", "Le baptême suit la nouvelle naissance, la plénitude est continue", "Ce sont deux noms pour la même chose", "Le baptême est pour les leaders seulement"],
            correct: "Le baptême suit la nouvelle naissance, la plénitude est continue"
          },
          {
            question: "Quelles sont les conditions pour recevoir le baptême du Saint-Esprit ?",
            options: ["Être parfait", "Se repentir, être baptisé, avoir soif, demander, obéir, croire", "Avoir beaucoup d'argent", "Être pasteur"],
            correct: "Se repentir, être baptisé, avoir soif, demander, obéir, croire"
          },
          {
            question: "Pourquoi parler en langues ?",
            options: ["Pour impressionner", "Pour communion avec Dieu, édification, louange, prière", "Ce n'est pas important", "Pour créer la confusion"],
            correct: "Pour communion avec Dieu, édification, louange, prière"
          },
          {
            question: "Que dit Actes 1:8 sur le baptême du Saint-Esprit ?",
            options: ["Ce n'est pas nécessaire", "Vous recevrez une puissance pour être mes témoins", "C'est facultatif", "C'est pour plus tard"],
            correct: "Vous recevrez une puissance pour être mes témoins"
          }
        ]
      }
    },
    {
      id: 'theme6-niveau3',
      titre: 'Les dons du Saint-Esprit',
      icon: '🎁',
      contenu: {
        introduction: "Paul dit: 'Je ne veux pas que vous soyez dans l'ignorance' (1 Cor 12:1).",
        points: [
          {
            titre: "1. Les trois catégories de dons (1 Cor 12:8-10)",
            details: [
              "a) Dons des langues: diversité des langues, interprétation, prophétie",
              "b) Dons de révélation: parole de connaissance, parole de sagesse, discernement des esprits",
              "c) Dons de puissance: don de foi, dons de guérisons, opérer des miracles"
            ]
          },
          {
            titre: "2. Les dons des langues",
            details: [
              "Don pour édification personnelle",
              "Édification de l'Église quand interprété",
              "Règles: avec amour, interprété, limité à 2-3, parler clairement"
            ]
          },
          {
            titre: "3. Le don d'interprétation",
            details: [
              "Surnaturel, pas une traduction littérale",
              "Donne la signification du message en langues",
              "Agit par la foi"
            ]
          },
          {
            titre: "4. Le don de prophétie",
            details: [
              "Parler de la part de Dieu",
              "But: édifier, exhorter, consoler",
              "Tous peuvent prophétiser",
              "Doit être évalué par l'église"
            ]
          },
          {
            titre: "5. Parole de connaissance",
            details: [
              "Révélation d'une partie de la connaissance de Dieu",
              "Ne s'acquiert pas par étude",
              "Connaissance surnaturelle d'un fait ou situation"
            ]
          },
          {
            titre: "6. Parole de sagesse",
            details: [
              "Savoir quoi faire avec la parole de connaissance",
              "Sagesse divine pour une situation spécifique"
            ]
          },
          {
            titre: "7. Discernement des esprits",
            details: [
              "Connaître la source: Dieu, notre chair, ou démon",
              "Protège l'église des faux enseignements"
            ]
          },
          {
            titre: "8. Don de foi",
            details: [
              "Foi surnaturelle pour une tâche spécifique",
              "Différent de la foi pour le salut",
              "Foi pour accomplir l'impossible"
            ]
          },
          {
            titre: "9. Dons de guérisons",
            details: [
              "Divers dons pour diverses maladies",
              "Guérison physique, émotionnelle, spirituelle"
            ]
          },
          {
            titre: "10. Opérer des miracles",
            details: [
              "Dieu suspend les lois naturelles",
              "Manifestation de la puissance divine",
              "Signes et prodiges"
            ]
          }
        ],
        applications: [
          "Identifier ce qui vous touche le plus",
          "Demander des dons spirituels",
          "Mémoriser Marc 16:17-18"
        ]
      },
      quiz: {
        questions: [
          {
            question: "Quelles sont les 3 catégories de dons spirituels ?",
            options: ["Foi, espérance, amour", "Dons des langues, de révélation, de puissance", "Prière, jeûne, louange", "Parole, sagesse, connaissance"],
            correct: "Dons des langues, de révélation, de puissance"
          },
          {
            question: "Quelle est la différence entre le don des langues et l'interprétation ?",
            options: ["Il n'y a pas de différence", "Les langues sont le message, l'interprétation donne la signification", "L'interprétation n'est pas importante", "Ce sont deux noms pour la même chose"],
            correct: "Les langues sont le message, l'interprétation donne la signification"
          },
          {
            question: "Quel est le but du don de prophétie ?",
            options: ["Prédire l'avenir seulement", "Édifier, exhorter et consoler", "Condamner les pécheurs", "Impressionner les gens"],
            correct: "Édifier, exhorter et consoler"
          },
          {
            question: "Que dit Marc 16:17-18 sur les signes qui accompagneront ceux qui auront cru ?",
            options: ["Ils seront riches", "Ils chasseront démons, parleront langues, imposeront mains aux malades", "Ils n'auront plus de problèmes", "Ils seront parfaits"],
            correct: "Ils chasseront démons, parleront langues, imposeront mains aux malades"
          }
        ]
      }
    },
    {
      id: 'theme7-niveau3',
      titre: 'Le Fruit de l\'Esprit',
      icon: '🍇',
      contenu: {
        introduction: "Galates 5:22-23 parle du fruit de l'Esprit - le caractère de Christ que tous doivent revêtir.",
        points: [
          {
            titre: "1. L'amour",
            details: [
              "Amour agapé - amour de Dieu",
              "1 Corinthiens 13:1-7 - Sans amour, tout est vain",
              "Amour inconditionnel et sacrificiel"
            ]
          },
          {
            titre: "2. La joie",
            details: [
              "Ne dépend pas des circonstances",
              "Joie de Christ en nous (Jean 15:11)",
              "Joie profonde et durable"
            ]
          },
          {
            titre: "3. La paix",
            details: [
              "Différente de la paix du monde",
              "Garde nos cœurs (Jean 14:27)",
              "Paix au milieu des tempêtes"
            ]
          },
          {
            titre: "4. La patience",
            details: [
              "Produit la persévérance",
              "Longanimité (Colossiens 3:12)",
              "Supporter les épreuves avec constance"
            ]
          },
          {
            titre: "5. La bienveillance",
            details: [
              "Bonne volonté du cœur à faire le bien",
              "Bonté active (Proverbes 22:9)",
              "Attitude positive envers les autres"
            ]
          },
          {
            titre: "6. La bonté",
            details: [
              "Acte de bienveillance",
              "Exemple d'Abraham",
              "Faire le bien concrètement"
            ]
          },
          {
            titre: "7. La fidélité",
            details: [
              "Tenir ses engagements",
              "Tenir ses promesses",
              "Fiable et digne de confiance (Apocalypse 2:10)"
            ]
          },
          {
            titre: "8. La douceur",
            details: [
              "Pas faiblesse",
              "Permet de bonnes relations (Matthieu 5:5)",
              "Force sous contrôle"
            ]
          },
          {
            titre: "9. La tempérance/maîtrise de soi",
            details: [
              "Contrôle sur les pensées",
              "Contrôle sur la langue",
              "Contrôle sur les émotions",
              "Discipline personnelle"
            ]
          },
          {
            titre: "Conclusion",
            details: [
              "Les dons cesseront mais le fruit demeure (1 Corinthiens 13:8)",
              "Le fruit et les dons sont comme les deux ailes d'un oiseau",
              "Les deux sont nécessaires pour un ministère équilibré"
            ]
          }
        ],
        applications: [
          "Identifier un aspect du fruit à développer",
          "Mémoriser Galates 5:22-23"
        ]
      },
      quiz: {
        questions: [
          {
            question: "Quels sont les 9 aspects du fruit de l'Esprit selon Galates 5:22-23 ?",
            options: ["Foi, espérance, charité", "Amour, joie, paix, patience, bienveillance, bonté, fidélité, douceur, tempérance", "Prière, jeûne, louange", "Sagesse, connaissance, intelligence"],
            correct: "Amour, joie, paix, patience, bienveillance, bonté, fidélité, douceur, tempérance"
          },
          {
            question: "Selon 1 Corinthiens 13, que vaut tout sans l'amour ?",
            options: ["Beaucoup", "Rien - tout est vain", "Un peu", "Suffisant"],
            correct: "Rien - tout est vain"
          },
          {
            question: "Quelle est la différence entre le fruit et les dons ?",
            options: ["Il n'y a pas de différence", "Les dons cesseront mais le fruit demeure", "Le fruit cesse mais les dons demeurent", "Ce sont la même chose"],
            correct: "Les dons cesseront mais le fruit demeure"
          },
          {
            question: "Comment sont décrits le fruit et les dons ?",
            options: ["Opposés", "Comme les deux ailes d'un oiseau - tous deux nécessaires", "Le fruit est plus important", "Les dons sont plus importants"],
            correct: "Comme les deux ailes d'un oiseau - tous deux nécessaires"
          }
        ]
      }
    },
    {
      id: 'theme8-niveau3',
      titre: 'Rédigez votre témoignage',
      icon: '✍️',
      contenu: {
        introduction: "Dieu nous remplit de son Esprit pour être témoins de Jésus-Christ (Actes 1:8).",
        points: [
          {
            titre: "1. Examiner le témoignage de Paul (Actes 22:3-21)",
            details: [
              "1ère partie: Vie avant Christ",
              "2ème partie: Rencontre avec Christ",
              "3ème partie: Vie après Christ"
            ]
          },
          {
            titre: "2. Écrire votre témoignage - 1ère partie: Vie avant Christ",
            details: [
              "Votre nom",
              "Quelques détails sur votre vie",
              "Ce qui vous a conduit à chercher Dieu",
              "Vos besoins, vos questions, vos problèmes"
            ]
          },
          {
            titre: "3. Écrire votre témoignage - 2ème partie: Conversion",
            details: [
              "Comment Christ est entré dans votre vie",
              "Les circonstances de votre rencontre avec Dieu",
              "Le moment où vous avez accepté Jésus",
              "Votre prière de repentance"
            ]
          },
          {
            titre: "4. Écrire votre témoignage - 3ème partie: Vie après Christ",
            details: [
              "Changements concrets dans votre vie",
              "Différences avant/après",
              "Ce que Christ a fait pour vous",
              "Votre vie actuelle avec Christ"
            ]
          },
          {
            titre: "5. Remarques importantes",
            details: [
              "Être honnête et authentique",
              "Ne pas dire qu'on n'a plus de problèmes",
              "Ne pas s'étendre trop sur la vie avant Christ",
              "Prévoir une question pour continuer le débat",
              "Garder le témoignage court (3-5 minutes)"
            ]
          }
        ],
        applications: [
          "Identifier les 3 parties du témoignage",
          "Rédiger son témoignage personnel",
          "Mémoriser Actes 1:8"
        ]
      },
      quiz: {
        questions: [
          {
            question: "Quelles sont les 3 parties d'un témoignage selon Actes 22:3-21 ?",
            options: ["Début, milieu, fin", "Vie avant Christ, conversion, vie après Christ", "Passé, présent, futur", "Introduction, développement, conclusion"],
            correct: "Vie avant Christ, conversion, vie après Christ"
          },
          {
            question: "Quel est l'exemple de témoignage donné dans la Bible ?",
            options: ["David", "Paul dans Actes 22", "Pierre", "Jean"],
            correct: "Paul dans Actes 22"
          },
          {
            question: "Quelle est l'importance de chaque partie du témoignage ?",
            options: ["Seul l'avant compte", "Les 3 parties sont nécessaires pour montrer la transformation", "Seul l'après compte", "Seule la conversion compte"],
            correct: "Les 3 parties sont nécessaires pour montrer la transformation"
          },
          {
            question: "Que dit Actes 1:8 sur le témoignage ?",
            options: ["Ce n'est pas important", "Vous recevrez puissance du Saint-Esprit pour être mes témoins", "Seulement pour les pasteurs", "Facultatif"],
            correct: "Vous recevrez puissance du Saint-Esprit pour être mes témoins"
          }
        ]
      }
    },
    {
      id: 'theme9-niveau3',
      titre: 'Témoigner pour Christ',
      icon: '📣',
      contenu: {
        introduction: "La plénitude du Saint-Esprit nous est donnée pour être des témoins du Seigneur (Actes 1:8).",
        points: [
          {
            titre: "1. Pourquoi témoigner ?",
            details: [
              "a) C'est un commandement (Matthieu 28:19, Marc 16:15-16)",
              "b) Dieu désire le salut des pécheurs (Jean 3:16, 2 Pierre 3:9)",
              "c) La moisson est grande (Jean 4:35, Matthieu 9:37)",
              "d) Nous sommes appelés pêcheurs d'hommes (Luc 10:1-20, Matthieu 4:19-20)",
              "e) Nous devons confesser Christ (Luc 12:8-9)",
              "f) Pour amener d'autres au Seigneur (Jean 4:28-30, 39-42)"
            ]
          },
          {
            titre: "2. Comment témoigner ? - Étapes pratiques",
            details: [
              "a) Prier pour les personnes à contacter",
              "b) Établir le contact (fréquenter, créer occasions, poser questions)",
              "c) Partager son témoignage",
              "d) Poser une question qui invite à la décision",
              "e) Suggérer une prière d'acceptation",
              "f) Assurer la personne que Christ est venu dans sa vie",
              "g) Ne pas se décourager"
            ]
          },
          {
            titre: "3. Le succès dans le témoignage",
            details: [
              "Le succès = prendre l'initiative de témoigner",
              "Laisser les résultats à Dieu",
              "Ne pas être découragé par les refus",
              "Continuer fidèlement à témoigner"
            ]
          }
        ],
        applications: [
          "Lister des personnes pour lesquelles prier",
          "Créer des occasions de témoigner cette semaine",
          "Écrire et mémoriser Actes 1:8"
        ]
      },
      quiz: {
        questions: [
          {
            question: "Pourquoi devons-nous témoigner selon Matthieu 28:19 ?",
            options: ["C'est facultatif", "C'est un commandement de Jésus", "Seulement si on en a envie", "Pour les pasteurs seulement"],
            correct: "C'est un commandement de Jésus"
          },
          {
            question: "Comment témoigner efficacement ?",
            options: ["Forcer les gens", "Prier, établir contact, partager témoignage, inviter à la décision", "Critiquer les autres religions", "Distribuer des tracts seulement"],
            correct: "Prier, établir contact, partager témoignage, inviter à la décision"
          },
          {
            question: "Que dit Matthieu 28:19 ?",
            options: ["Restez chez vous", "Allez, faites de toutes les nations des disciples", "Attendez", "Priez seulement"],
            correct: "Allez, faites de toutes les nations des disciples"
          },
          {
            question: "Qu'est-ce que le succès dans le témoignage ?",
            options: ["Convertir beaucoup de personnes", "Prendre l'initiative de témoigner en laissant résultats à Dieu", "Ne jamais être refusé", "Avoir toujours raison"],
            correct: "Prendre l'initiative de témoigner en laissant résultats à Dieu"
          }
        ]
      }
    }
  ];

  const niveau4Themes = [
    {
      id: 'theme1-niveau4',
      titre: 'L\'Église',
      icon: '⛪',
      contenu: {
        introduction: "Le mot 'Église' vient du grec 'Ekklésia' qui signifie 'assemblée des appelés hors du monde'.",
        points: [
          {
            titre: "1. Qu'est-ce que l'Église ?",
            details: [
              "Définition: assemblée universelle de tous les croyants",
              "On devient membre en recevant Christ",
              "L'Église n'est pas un bâtiment ni une dénomination mais le peuple de Dieu"
            ]
          },
          {
            titre: "2. L'Église universelle",
            details: [
              "Tous les croyants de tous pays",
              "Aussi appelée: Corps de Christ (1 Cor 12:27), Épouse de Christ (2 Cor 11:2)",
              "Troupeau (Luc 12:32), Famille de Dieu (2 Cor 6:18), Édifice de Dieu (1 Cor 3:9)",
              "Invisible, seul Dieu connaît tous les membres"
            ]
          },
          {
            titre: "3. L'église locale",
            details: [
              "Groupe de croyants en un lieu donné",
              "Expression locale de l'Église universelle",
              "Exemples: Jérusalem, Corinthe, Thessalonique",
              "Dénominations et assemblées"
            ]
          },
          {
            titre: "4. Éléments constituant une église locale",
            details: [
              "Lieu de rassemblement",
              "Organisation et direction",
              "Parole de Dieu enseignée",
              "Baptême et Sainte Cène",
              "Dons spirituels",
              "Frères et sœurs en communion"
            ]
          }
        ],
        applications: [
          "Comprendre la différence entre Église universelle et église locale",
          "Remercier Dieu pour l'Église"
        ]
      },
      quiz: {
        questions: [
          {
            question: "Que signifie le mot 'Ekklésia' ?",
            options: ["Bâtiment religieux", "Assemblée des appelés hors du monde", "Groupe de prêtres", "Organisation religieuse"],
            correct: "Assemblée des appelés hors du monde"
          },
          {
            question: "Quelle est la différence entre l'Église universelle et l'église locale ?",
            options: ["Il n'y a pas de différence", "L'universelle = tous les croyants, la locale = groupe en un lieu", "L'universelle = catholique, la locale = protestante", "L'universelle = au ciel, la locale = sur terre"],
            correct: "L'universelle = tous les croyants, la locale = groupe en un lieu"
          },
          {
            question: "Parmi ces éléments, lequel ne constitue PAS une église locale ?",
            options: ["La Parole de Dieu", "Un bâtiment luxueux", "Le baptême", "Les dons spirituels"],
            correct: "Un bâtiment luxueux"
          },
          {
            question: "Comment appelle-t-on aussi l'Église universelle selon 1 Cor 12:27 ?",
            options: ["Le Temple de Dieu", "Le Corps de Christ", "Le Royaume des cieux", "La Famille éternelle"],
            correct: "Le Corps de Christ"
          }
        ]
      }
    },
    {
      id: 'theme2-niveau4',
      titre: 'Nous devons appartenir à une église locale',
      icon: '🏠',
      contenu: {
        introduction: "Certains pensent que l'appartenance à une église locale n'est pas nécessaire. La Bible dit le contraire.",
        points: [
          {
            titre: "1. Pourquoi se joindre à une église locale ?",
            details: [
              "a) C'est un commandement (Mat 18:19 - mépriser l'église = mépriser ce que Christ a institué)",
              "b) C'est l'œuvre du Saint-Esprit (Actes 2:42-47, 1 Cor 12:13 - le Saint-Esprit rassemble les croyants)",
              "c) C'est l'exemple des premiers chrétiens (Actes 9:26, 11:26, 13:1)",
              "d) Les apôtres établissaient des anciens dans chaque église (Actes 14:23)",
              "e) Les épîtres étaient adressées aux églises locales",
              "f) Pour le perfectionnement des saints (Éph 4:12-13 - besoin de communion fraternelle)",
              "g) Nous recevons et donnons (interaction constante, équilibre, correction mutuelle)"
            ]
          },
          {
            titre: "2. L'église a des faiblesses",
            details: [
              "L'Église n'est pas un rassemblement d'anges mais de pécheurs graciés",
              "Êtres imparfaits - exemples: divisions à Corinthe, désordres moraux",
              "Les faiblesses humaines sont présentes dans toute église"
            ]
          },
          {
            titre: "3. Dieu nous veut cependant dans une église locale",
            details: [
              "Les faiblesses ne doivent pas nous décourager",
              "C'est le cadre pour grandir et atteindre la maturité (Rom 12-15, Gal 4-6, Col 3-4)",
              "Dieu utilise l'église pour nous former"
            ]
          }
        ],
        applications: [
          "Identifier les excuses pour ne pas aller à l'église",
          "S'engager dans une église locale",
          "Mémoriser Hébreux 10:25"
        ]
      },
      quiz: {
        questions: [
          {
            question: "Pourquoi devons-nous appartenir à une église locale ?",
            options: ["C'est une option personnelle", "C'est un commandement et l'œuvre du Saint-Esprit", "Pour avoir des amis", "C'est une tradition"],
            correct: "C'est un commandement et l'œuvre du Saint-Esprit"
          },
          {
            question: "Que dit Hébreux 10:25 ?",
            options: ["Priez sans cesse", "N'abandonnez pas votre assemblée", "Aimez-vous les uns les autres", "Baptisez-vous"],
            correct: "N'abandonnez pas votre assemblée"
          },
          {
            question: "Quel est le rôle du Saint-Esprit concernant l'église locale ?",
            options: ["Il divise les croyants", "Il rassemble les croyants en un corps", "Il condamne l'église", "Il est absent de l'église"],
            correct: "Il rassemble les croyants en un corps"
          },
          {
            question: "Comment devons-nous réagir face aux faiblesses de l'église ?",
            options: ["La quitter immédiatement", "Ne pas nous décourager car c'est le cadre pour grandir", "La critiquer publiquement", "Chercher une église parfaite"],
            correct: "Ne pas nous décourager car c'est le cadre pour grandir"
          }
        ]
      }
    },
    {
      id: 'theme3-niveau4',
      titre: 'Les quatre persévérances de Actes 2:42',
      icon: '4️⃣',
      contenu: {
        introduction: "Actes 2:42 dit que les premiers chrétiens persévéraient dans 4 domaines essentiels.",
        points: [
          {
            titre: "1. Persévérer dans l'enseignement des apôtres",
            details: [
              "Prédication et études bibliques pour transmettre et approfondir l'enseignement",
              "Christ a donné des hommes pour enseigner (Éph 4:11-13)",
              "Enseignement oral complète l'écrit par valeur affective",
              "Plus dynamique et adapté, complété par la mise en pratique"
            ]
          },
          {
            titre: "2. Persévérer dans la communion fraternelle",
            details: [
              "Pourquoi ? Jean 13:34-35 - l'amour = signe des disciples",
              "Montrer Christ au monde, épanouissement harmonieux",
              "Ps 133 - bénédiction et vie dans l'unité",
              "Comment ? Demeurer ensemble, se parler, se visiter",
              "S'entraider (Gal 6:10, Jac 2:14-16, 1 Jean 3:17-18)",
              "Travailler ensemble"
            ]
          },
          {
            titre: "3. Persévérer dans la fraction du pain",
            details: [
              "Célébrer régulièrement la Sainte Cène (Actes 20:7)",
              "Repas de famille spirituelle",
              "Commémorer la mort et résurrection de Christ",
              "Jouir des bénédictions de l'alliance",
              "L'absence = signe d'alerte spirituelle"
            ]
          },
          {
            titre: "4. Persévérer dans les prières",
            details: [
              "Première activité après l'Ascension (Actes 1:14,24)",
              "La prière sous toutes ses formes a sa place dans l'Église",
              "Invite Dieu à intervenir dans nos situations",
              "Bénéficier des prières des autres (Actes 12:6-16)"
            ]
          }
        ],
        applications: [
          "Évaluer mes 4 persévérances personnellement",
          "M'engager à persévérer dans ces 4 domaines",
          "Mémoriser Actes 2:42"
        ]
      },
      quiz: {
        questions: [
          {
            question: "Quelles sont les 4 persévérances de Actes 2:42 ?",
            options: ["Prier, jeûner, donner, évangéliser", "Enseignement, communion, fraction du pain, prières", "Lire, chanter, danser, témoigner", "Baptême, mariage, enterrement, adoration"],
            correct: "Enseignement, communion, fraction du pain, prières"
          },
          {
            question: "Que dit Actes 2:42 ?",
            options: ["Ils priaient seulement", "Ils persévéraient dans l'enseignement, la communion, la fraction du pain et les prières", "Ils jeûnaient souvent", "Ils voyageaient beaucoup"],
            correct: "Ils persévéraient dans l'enseignement, la communion, la fraction du pain et les prières"
          },
          {
            question: "Pourquoi la communion fraternelle est-elle importante ?",
            options: ["Pour passer le temps", "L'amour est le signe des disciples de Christ", "Pour faire des affaires", "C'est obligatoire"],
            correct: "L'amour est le signe des disciples de Christ"
          },
          {
            question: "Que représente la fraction du pain ?",
            options: ["Un simple repas", "La commémoration de la mort et résurrection de Christ", "Une tradition", "Une fête"],
            correct: "La commémoration de la mort et résurrection de Christ"
          }
        ]
      }
    },
    {
      id: 'theme4-niveau4',
      titre: 'Notre confession de foi',
      icon: '📜',
      contenu: {
        introduction: "En tant que chrétien, nous devons être au clair sur ce que nous croyons.",
        points: [
          {
            titre: "1. Au Centre Missionnaire REHOBOTH, nous croyons:",
            details: [
              "Que la Bible entière est la Parole inspirée de Dieu (2 Tim 3:15-16, 2 Pierre 1:21)",
              "Qu'il n'y a qu'un seul Dieu vrai et vivant en trois personnes: Père, Fils, Saint-Esprit (Deut 6:4, Jean 8:58, Mat 28:19)",
              "Que l'homme a été créé à l'image de Dieu, séparé par le péché, réconcilié par Christ (Gen 1:26-31, Rom 5:12-21)",
              "En la divinité de Jésus-Christ: naissance virginale, vie sans péché, miracles, mort rédemptrice, résurrection corporelle, ascension, retour en gloire (Luc 22:70, Mat 1:18,23, Héb 7:26, Rom 4:25)",
              "Que la nouvelle naissance par l'eau et l'Esprit est nécessaire au salut (Jean 3:3)",
              "Au baptême par immersion pour ceux qui ont reçu Christ (Mat 28:19, Marc 16:16)",
              "Au baptême du Saint-Esprit avec dons spirituels (Actes 2:4, 1 Cor 1:2)",
              "Aux ministères du NT: Apôtre, Prophète, Évangéliste, Pasteur, Docteur (Éph 4:11-12)",
              "En la Sainte Cène ordonnée jusqu'au retour de Christ (Luc 22:14-20, 1 Cor 11:23-24)",
              "En la résurrection des sauvés et des perdus (Mat 25:46)",
              "À l'enlèvement de l'Église (1 Thes 4:17)"
            ]
          }
        ],
        applications: [
          "Identifier les points clés de la confession de foi",
          "Mémoriser 2 Tim 3:15-16, Mat 28:19, Jean 3:3"
        ]
      },
      quiz: {
        questions: [
          {
            question: "Que dit 2 Timothée 3:15-16 sur la Bible ?",
            options: ["Elle est un livre historique", "Elle est la Parole inspirée de Dieu", "Elle est dépassée", "Elle contient des erreurs"],
            correct: "Elle est la Parole inspirée de Dieu"
          },
          {
            question: "Combien de personnes y a-t-il dans la Trinité ?",
            options: ["Une seule", "Deux", "Trois: Père, Fils, Saint-Esprit", "Quatre"],
            correct: "Trois: Père, Fils, Saint-Esprit"
          },
          {
            question: "Que dit Jean 3:3 sur la nouvelle naissance ?",
            options: ["Elle est optionnelle", "Elle est nécessaire pour voir le royaume de Dieu", "Elle concerne seulement les pasteurs", "Elle n'existe pas"],
            correct: "Elle est nécessaire pour voir le royaume de Dieu"
          },
          {
            question: "Que croyons-nous concernant l'enlèvement de l'Église ?",
            options: ["C'est une légende", "L'Église sera enlevée selon 1 Thes 4:17", "Cela ne se produira jamais", "C'est symbolique"],
            correct: "L'Église sera enlevée selon 1 Thes 4:17"
          }
        ]
      }
    },
    {
      id: 'theme5-niveau4',
      titre: 'Les ministères dans l\'Église',
      icon: '🎯',
      contenu: {
        introduction: "Dieu a fait don à l'Église d'hommes dotés de capacités particulières (Éph 4:11).",
        points: [
          {
            titre: "1. Leurs buts (Éph 4:12)",
            details: [
              "Perfectionnement des saints pour la maturité",
              "Équipement du service des croyants",
              "Édification du corps de Christ"
            ]
          },
          {
            titre: "2. Les cinq ministères (Éph 4:11)",
            details: [
              "a) Apôtre: envoyé, ambassadeur, délégué (exemples: Jésus - Héb 3:1, les Douze, Paul)",
              "Rôles: fonder des églises (1 Cor 3:9-16), ouvrir nouveaux champs, établir anciens (Actes 14:23), former disciples (2 Tim 2:2)",
              "b) Prophète: voyant, proclamateur de vérité divine (exemples: Jésus, Jude et Silas, Agabus)",
              "Rôles: poser fondement avec apôtres (Éph 2:20-22), édifier/exhorter/consoler (1 Cor 14:3), révéler la Parole (2 Pierre 1:20-21)",
              "c) Évangéliste: messager de bonnes nouvelles (exemples: Jésus - És 41:47, Philippe - Actes 8:12)",
              "Rôles: prêcher l'évangile, amener les gens à Christ, faire des disciples",
              "d) Pasteur: berger du troupeau (exemple: Jésus - Jean 10:11, Héb 13:20)",
              "Rôles: paître et prendre soin (Actes 20:28-31), protéger contre faux docteurs, guider et conduire",
              "e) Docteur/Enseignant: instruit, explique doctrine (exemple: Jésus - Jean 3:2, docteurs à Antioche - Actes 13:1)",
              "Rôles: enseigner, instruire, expliquer par exemples/paraboles, former/discipliner/affermir"
            ]
          }
        ],
        applications: [
          "Comprendre les 5 ministères et leurs rôles",
          "Remercier Dieu pour ces dons à l'Église",
          "Mémoriser Éphésiens 4:11-12"
        ]
      },
      quiz: {
        questions: [
          {
            question: "Quel est le but des ministères selon Éphésiens 4:12 ?",
            options: ["Dominer l'église", "Perfectionner les saints, équiper pour le service, édifier le corps", "Gagner de l'argent", "Impressionner les gens"],
            correct: "Perfectionner les saints, équiper pour le service, édifier le corps"
          },
          {
            question: "Quelle est la différence entre un apôtre et un prophète ?",
            options: ["Il n'y en a pas", "L'apôtre fonde et établit, le prophète édifie et révèle la Parole", "Le prophète est supérieur", "L'apôtre prêche seulement"],
            correct: "L'apôtre fonde et établit, le prophète édifie et révèle la Parole"
          },
          {
            question: "Quel est le rôle principal du pasteur ?",
            options: ["Prêcher seulement", "Paître, prendre soin et protéger le troupeau", "Administrer l'église", "Baptiser"],
            correct: "Paître, prendre soin et protéger le troupeau"
          },
          {
            question: "Que dit Éphésiens 4:11-12 ?",
            options: ["Dieu a donné 3 ministères", "Dieu a donné 5 ministères pour équiper les saints", "Dieu a donné 7 ministères", "Dieu n'a donné aucun ministère"],
            correct: "Dieu a donné 5 ministères pour équiper les saints"
          }
        ]
      }
    },
    {
      id: 'theme6-niveau4',
      titre: 'Les Responsables de l\'Église Locale',
      icon: '👥',
      contenu: {
        introduction: "L'église locale a des dirigeants désignés par Dieu: pasteur, anciens, diacres (Actes 20:28).",
        points: [
          {
            titre: "1. Le pasteur",
            details: [
              "A reçu le ministère selon Éph 4:11",
              "Parfois appelé 'évêque' ou 'pasteur principal'",
              "Est l'ancien principal, premier parmi des égaux",
              "Dirige avec les anciens, pas seul"
            ]
          },
          {
            titre: "2. Les anciens",
            details: [
              "Mentionnés dans: Actes 11:30, 14:23, 15:2, 16:4, 20:17",
              "Avec le pasteur, sont les dirigeants de l'église locale",
              "Toujours une pluralité (jamais un seul ancien) - évite dictature et erreur doctrinale",
              "Ensemble, ils paissent le troupeau (Actes 20:28)",
              "Différence: pasteur = ministère (don), ancien = fonction (on peut aspirer)",
              "Désignation: nommés par fondateur ou anciens en place (Tite 1:5)",
              "Qualifications: 1 Tim 3:2-7 et Tite 1:6-9 (irréprochable, mari d'une seule femme, sobre, modéré, hospitalier, capable d'enseigner, pas nouveau converti, bon témoignage)",
              "Fonctions: diriger, enseigner, paître, surveiller, prendre soin du troupeau (Actes 20:28, 1 Tim 5:17, Jacques 5:14)",
              "Responsabilités de l'assemblée: avoir de la considération (1 Thes 5:12-13), les soutenir financièrement (1 Tim 5:17-18), leur être soumis (1 Pierre 5:5), obéir (Héb 13:17), les imiter (Héb 13:7), prier pour eux (Éph 6:18)"
            ]
          },
          {
            titre: "3. Les diacres",
            details: [
              "Actes 6:1-7: serviteur, exerce service envers les gens",
              "Ne s'occupe pas seulement des affaires matérielles mais aussi spirituelles",
              "Exemple: Philippe évangélise et baptise (Actes 8)",
              "Diaconat = tremplin pour ministère",
              "Qualifications: 1 Tim 3:8-12 - spirituelles, morales, domestiques",
              "Femmes diaconesses: Rom 16:1, Luc 8:2-3",
              "Mise à l'épreuve avant installation définitive (1 Tim 3:10)"
            ]
          }
        ],
        applications: [
          "Comprendre la structure de l'église locale",
          "Respecter et honorer les responsables",
          "Prier pour eux régulièrement",
          "Mémoriser 1 Timothée 3:1-7"
        ]
      },
      quiz: {
        questions: [
          {
            question: "Quelle est la différence entre un pasteur et un ancien ?",
            options: ["Il n'y en a pas", "Le pasteur a un ministère (don), l'ancien a une fonction", "Le pasteur est supérieur", "L'ancien n'a pas d'autorité"],
            correct: "Le pasteur a un ministère (don), l'ancien a une fonction"
          },
          {
            question: "Quelles sont les qualifications d'un ancien selon 1 Tim 3:2-7 ?",
            options: ["Riche et influent", "Irréprochable, sobre, hospitalier, capable d'enseigner, bon témoignage", "Jeune et dynamique", "Diplômé universitaire"],
            correct: "Irréprochable, sobre, hospitalier, capable d'enseigner, bon témoignage"
          },
          {
            question: "Quel est le rôle principal des diacres ?",
            options: ["Diriger l'église", "Servir dans les affaires matérielles et spirituelles", "Enseigner seulement", "Collecter les offrandes"],
            correct: "Servir dans les affaires matérielles et spirituelles"
          },
          {
            question: "Quelles sont nos responsabilités envers les anciens ?",
            options: ["Les critiquer", "Avoir de la considération, les soutenir, leur obéir, prier pour eux", "Les ignorer", "Les contrôler"],
            correct: "Avoir de la considération, les soutenir, leur obéir, prier pour eux"
          }
        ]
      }
    },
    {
      id: 'theme7-niveau4',
      titre: 'Servir dans l\'Église locale',
      icon: '🤝',
      contenu: {
        introduction: "Chaque chrétien a reçu au moins un don pour servir dans l'Église (1 Cor 12:7).",
        points: [
          {
            titre: "1. Chaque chrétien a reçu au moins un don",
            details: [
              "1 Cor 12:7 - Saint-Esprit dote chaque chrétien",
              "1 Cor 12:11 - Saint-Esprit accorde le don qu'Il veut",
              "On peut recevoir un ou plusieurs dons",
              "1 Cor 12:14-26 - ne pas convoiter don des autres ni mépriser le nôtre",
              "Don accordé gratuitement, pas un mérite"
            ]
          },
          {
            titre: "2. Différentes sortes de dons spirituels",
            details: [
              "Servent à l'édification (1 Cor 14:12), pour l'utilité commune (1 Cor 12:7)",
              "Romains 12:6-8: prophétiser, servir, enseigner, encourager, exhorter, exercer miséricorde, diriger, secourir pauvres",
              "1 Corinthiens 12:8-10: parole de sagesse, parole de connaissance, don de foi, don d'opérer miracles, prophétie, discernement des esprits, diversité des langues, interprétation des langues",
              "1 Corinthiens 12:28-30: apôtre, prophète, docteur, don de miracles, don de guérisons, don de secours, don de gouverner/administrer, don de parler diverses langues",
              "Éphésiens 4:11: apôtre, prophète, évangéliste, pasteur, docteur",
              "1 Pierre 4:11: prêcher/exhorter/prophétiser, servir (tâches matérielles)"
            ]
          },
          {
            titre: "3. Nous devons découvrir notre/nos don(s)",
            details: [
              "Beaucoup ne s'engagent pas car ne connaissent pas leur don",
              "Dieu a donné des ministères pour aider (Éph 4:11-12)",
              "La prière aussi moyen efficace de découverte",
              "Une fois révélé, se mettre au travail immédiatement"
            ]
          },
          {
            titre: "4. Nous devons rendre compte un jour",
            details: [
              "Mat 25:14-30, Luc 19:11-26, 1 Cor 3:8-15, Mat 16:27, 2 Tim 4:14, Ap 2:23, 22:12",
              "Rétribution prévue pour fidélité",
              "Servir avec: zèle (Rom 12:11), fidélité (Mat 25:21), ferveur (Rom 10:2)"
            ]
          }
        ],
        applications: [
          "Découvrir mon don spirituel par la prière",
          "Me mettre au service dans l'église",
          "Mémoriser 1 Corinthiens 12:7 et Romains 12:11"
        ]
      },
      quiz: {
        questions: [
          {
            question: "Que dit 1 Corinthiens 12:7 sur les dons spirituels ?",
            options: ["Seuls les pasteurs ont des dons", "Chacun reçoit la manifestation de l'Esprit pour l'utilité commune", "Les dons sont pour soi-même", "Les dons n'existent plus"],
            correct: "Chacun reçoit la manifestation de l'Esprit pour l'utilité commune"
          },
          {
            question: "Parmi ces dons, lequel est mentionné dans Romains 12:6-8 ?",
            options: ["Don de voler", "Don de servir et d'enseigner", "Don de richesse", "Don de domination"],
            correct: "Don de servir et d'enseigner"
          },
          {
            question: "Comment découvrir son don spirituel ?",
            options: ["Par hasard", "Par la prière et l'aide des ministères (Éph 4:11-12)", "En imitant les autres", "Ce n'est pas nécessaire"],
            correct: "Par la prière et l'aide des ministères (Éph 4:11-12)"
          },
          {
            question: "Devrons-nous rendre compte de l'utilisation de nos dons ?",
            options: ["Non, c'est personnel", "Oui, nous devrons rendre compte selon Mat 25:14-30", "Seulement les pasteurs", "Peut-être"],
            correct: "Oui, nous devrons rendre compte selon Mat 25:14-30"
          }
        ]
      }
    },
    {
      id: 'theme8-niveau4',
      titre: 'La Discipline dans l\'Église locale',
      icon: '⚖️',
      contenu: {
        introduction: "L'église locale est un endroit où règnent l'ordre et la discipline.",
        points: [
          {
            titre: "1. Le manque de discipline",
            details: [
              "1 Sam 2:22-24, 3:13 - Éli ne réprimanda pas ses fils, fin de son ministère",
              "1 Cor 5:1-8 - Paul reprocha à Corinthe de ne pas avoir discipliné un homme vivant dans le péché",
              "Ap 2:14-16, 20-23 - Seigneur blâma deux églises pour négligence",
              "Manque de discipline = sérieux problèmes"
            ]
          },
          {
            titre: "2. Le but principal de la discipline",
            details: [
              "Éph 5:25,27, 1 Cor 6:9-11, 2 Cor 11:2-3",
              "But: préserver la vocation de l'Église d'être un peuple mis à part",
              "Groupe saint détaché du monde, loin de l'impureté et du péché",
              "Sans discipline, le monde entre dans l'église et l'église glisse dans le monde"
            ]
          },
          {
            titre: "3. Que signifie discipliner ?",
            details: [
              "Élever/former quelqu'un en l'instruisant, l'avertissant, le réprimandant, le châtiant (Luc 23:16,22, Actes 7:27, 1 Cor 11:32, 2 Tim 2:25)",
              "Supplier/exhorter/pousser à poursuivre bonne conduite (Rom 12:1, Actes 11:23, 14:22, Héb 3:13)",
              "Avertir de manière paternelle (Actes 20:31, 1 Cor 4:14, 1 Thes 5:14)",
              "Convaincre/reprendre/réfuter/blâmer (Mat 18:15, Éph 5:11, 1 Tim 5:20, Tite 1:13)"
            ]
          },
          {
            titre: "4. Les offenses nécessitant la discipline",
            details: [
              "A. Comportement: l'immoralité (1 Cor 5:11, Gal 5:19-21), la cupidité (1 Cor 5:11, Éph 5:3), l'idolâtrie (1 Cor 5:11, 1 Jean 5:21), l'ivrognerie (1 Cor 5:11), l'injure (1 Cor 5:11, Gal 5:19-21), le désordre (2 Thes 3:6,11-14)",
              "B. Doctrine: reniement des grandes vérités bibliques (divinité et résurrection de Jésus, naissance virginale, efficacité du sang, résurrection - 2 Tim 2:17-18); différences doctrinales mineures causant querelles et détruisant unité et paix (Tite 3:10-11, Rom 16:17-18)"
            ]
          },
          {
            titre: "5. Les différents pas de la discipline",
            details: [
              "1er pas: Mat 18:15 - reprendre entre deux personnes seulement, ne pas divulguer le péché (Prov 10:12, 11:13, 17:9)",
              "2è pas: Mat 18:16 - si ne t'écoute pas, prendre 1-2 personnes expérimentées",
              "3è pas: Mat 18:17 - si refuse toujours, le dire à l'église, demander aux membres de prier pour sa repentance",
              "4è pas (principal): Mat 18:17 - si refuse d'écouter l'église, l'exclure publiquement, le retrancher de l'assemblée (1 Tim 5:20, Tite 3:10-11, 1 Cor 5:13b)"
            ]
          },
          {
            titre: "6. Remarques importantes",
            details: [
              "a) Personne exclue: 1 Cor 5:11 - ne pas avoir de relations; tous doivent respecter les mesures disciplinaires",
              "Si communion continue, le péché paraît moins grave; relations limitées au strict nécessaire pour le regagner",
              "b) Si la personne se repent: l'église doit la recevoir de nouveau et la réintégrer comme membre (Jean 20:23, 2 Cor 2:10, 1 Jean 5:16)",
              "But de correction = restauration, pas destruction",
              "Réintégration publique comme l'exclusion l'a été"
            ]
          }
        ],
        applications: [
          "Comprendre l'importance de la discipline pour la sainteté de l'Église",
          "Accepter la discipline comme un acte d'amour",
          "Mémoriser Matthieu 18:15-17",
          "Prier pour l'église et ses dirigeants"
        ]
      },
      quiz: {
        questions: [
          {
            question: "Quel est le but principal de la discipline dans l'église ?",
            options: ["Punir les membres", "Préserver la vocation de l'Église d'être un peuple saint mis à part", "Réduire le nombre de membres", "Montrer l'autorité des dirigeants"],
            correct: "Préserver la vocation de l'Église d'être un peuple saint mis à part"
          },
          {
            question: "Quels sont les 4 pas de la discipline selon Matthieu 18 ?",
            options: ["Exclure immédiatement", "Reprendre seul, avec témoins, dire à l'église, exclure si refus", "Ignorer le problème", "Prier seulement"],
            correct: "Reprendre seul, avec témoins, dire à l'église, exclure si refus"
          },
          {
            question: "Parmi ces offenses, laquelle nécessite la discipline ?",
            options: ["Être en retard", "L'immoralité, la cupidité, l'idolâtrie, le désordre", "Oublier son livre", "Chanter faux"],
            correct: "L'immoralité, la cupidité, l'idolâtrie, le désordre"
          },
          {
            question: "Que doit faire l'église si la personne disciplinée se repent ?",
            options: ["L'exclure définitivement", "La recevoir de nouveau et la réintégrer publiquement", "L'ignorer", "La surveiller toute sa vie"],
            correct: "La recevoir de nouveau et la réintégrer publiquement"
          }
        ]
      }
    }
  ];

  // Quiz Général Final - 25 questions couvrant tous les niveaux
  const quizGeneralFinal = {
    questions: [
      // 5 questions de NIVEAU I
      {
        question: "Comment Dieu est-il défini dans 1 Jean 4:8 ?",
        options: ["Puissance", "Amour", "Justice", "Sagesse"],
        correct: "Amour",
        niveau: "I"
      },
      {
        question: "Selon Romains 3:23, qui a péché et est privé de la gloire de Dieu ?",
        options: ["Seulement les méchants", "Tous les hommes", "Seulement les non-croyants", "Personne"],
        correct: "Tous les hommes",
        niveau: "I"
      },
      {
        question: "Selon Jean 14:6, que dit Jésus de lui-même ?",
        options: ["Il est un prophète", "Il est le chemin, la vérité et la vie", "Il est un bon enseignant", "Il est un exemple à suivre"],
        correct: "Il est le chemin, la vérité et la vie",
        niveau: "I"
      },
      {
        question: "Quelles sont les deux actions requises selon Actes 20:20-21 ?",
        options: ["Prier et jeûner", "Se repentir et croire", "Baptiser et communier", "Lire et méditer"],
        correct: "Se repentir et croire",
        niveau: "I"
      },
      {
        question: "Selon Romains 8:16, comment savons-nous que nous sommes enfants de Dieu ?",
        options: ["Par nos œuvres", "Le Saint-Esprit lui-même rend témoignage à notre esprit", "Par nos émotions", "Par l'approbation des autres"],
        correct: "Le Saint-Esprit lui-même rend témoignage à notre esprit",
        niveau: "I"
      },
      // 5 questions de NIVEAU II
      {
        question: "Que signifie le mot 'communion' avec Dieu ?",
        options: ["Une relation distante", "Un partage réciproque avec Dieu", "Une obligation religieuse", "Une tradition"],
        correct: "Un partage réciproque avec Dieu",
        niveau: "II"
      },
      {
        question: "Combien de livres la Bible contient-elle au total ?",
        options: ["39 livres", "27 livres", "66 livres", "73 livres"],
        correct: "66 livres",
        niveau: "II"
      },
      {
        question: "Selon Jean 5:39, quel est le message central de la Bible ?",
        options: ["La morale", "Les lois", "Jésus-Christ", "L'histoire d'Israël"],
        correct: "Jésus-Christ",
        niveau: "II"
      },
      {
        question: "Selon Matthieu 4:4, pourquoi devons-nous lire la Bible ?",
        options: ["Pour avoir des connaissances", "L'homme ne vivra pas de pain seulement, mais de toute parole de Dieu", "Pour impressionner les autres", "C'est une tradition"],
        correct: "L'homme ne vivra pas de pain seulement, mais de toute parole de Dieu",
        niveau: "II"
      },
      {
        question: "Quel est le but du témoignage chrétien ?",
        options: ["Gagner des débats", "Amener les gens à Christ", "Se faire des amis", "Montrer sa supériorité"],
        correct: "Amener les gens à Christ",
        niveau: "II"
      },
      // 5 questions de NIVEAU III
      {
        question: "Que dit Actes 5:3-5 sur la nature du Saint-Esprit ?",
        options: ["C'est une force", "C'est Dieu lui-même", "C'est un sentiment", "C'est une énergie"],
        correct: "C'est Dieu lui-même",
        niveau: "III"
      },
      {
        question: "Que dit Éphésiens 5:18 ?",
        options: ["Priez sans cesse", "Ne vous enivrez pas, mais soyez remplis du Saint-Esprit", "Aimez-vous les uns les autres", "Baptisez-vous"],
        correct: "Ne vous enivrez pas, mais soyez remplis du Saint-Esprit",
        niveau: "III"
      },
      {
        question: "Quels sont les trois types d'hommes mentionnés dans 1 Corinthiens 2-3 ?",
        options: ["Bon, mauvais, neutre", "Naturel, spirituel, charnel", "Jeune, adulte, vieux", "Riche, pauvre, moyen"],
        correct: "Naturel, spirituel, charnel",
        niveau: "III"
      },
      {
        question: "Selon Galates 5:22-23, quel est le fruit de l'Esprit ?",
        options: ["Richesse et succès", "Amour, joie, paix, patience, bonté, bénignité, fidélité, douceur, tempérance", "Pouvoir et autorité", "Connaissance et sagesse"],
        correct: "Amour, joie, paix, patience, bonté, bénignité, fidélité, douceur, tempérance",
        niveau: "III"
      },
      {
        question: "Que signifie le mot 'sanctification' ?",
        options: ["Devenir parfait", "Être mis à part pour Dieu", "Aller au ciel", "Faire des miracles"],
        correct: "Être mis à part pour Dieu",
        niveau: "III"
      },
      // 5 questions de NIVEAU IV
      {
        question: "Que signifie le mot 'Ekklésia' ?",
        options: ["Bâtiment religieux", "Assemblée des appelés hors du monde", "Groupe de prêtres", "Organisation religieuse"],
        correct: "Assemblée des appelés hors du monde",
        niveau: "IV"
      },
      {
        question: "Pourquoi devons-nous appartenir à une église locale ?",
        options: ["C'est une option personnelle", "C'est un commandement et l'œuvre du Saint-Esprit", "Pour avoir des amis", "C'est une tradition"],
        correct: "C'est un commandement et l'œuvre du Saint-Esprit",
        niveau: "IV"
      },
      {
        question: "Quelles sont les 4 persévérances de Actes 2:42 ?",
        options: ["Prière, jeûne, offrande, témoignage", "Enseignement, communion, fraction du pain, prières", "Louange, adoration, intercession, confession", "Foi, espérance, charité, patience"],
        correct: "Enseignement, communion, fraction du pain, prières",
        niveau: "IV"
      },
      {
        question: "Que dit 1 Corinthiens 12:7 sur les dons spirituels ?",
        options: ["Seuls les pasteurs ont des dons", "Chacun reçoit la manifestation de l'Esprit pour l'utilité commune", "Les dons sont pour soi-même", "Les dons n'existent plus"],
        correct: "Chacun reçoit la manifestation de l'Esprit pour l'utilité commune",
        niveau: "IV"
      },
      {
        question: "Quel est le but principal de la discipline dans l'église ?",
        options: ["Punir les membres", "Préserver la vocation de l'Église d'être un peuple saint mis à part", "Réduire le nombre de membres", "Montrer l'autorité des dirigeants"],
        correct: "Préserver la vocation de l'Église d'être un peuple saint mis à part",
        niveau: "IV"
      },
      // 5 questions transversales
      {
        question: "Quel est le plus grand commandement selon Jésus ?",
        options: ["Ne pas voler", "Aimer Dieu de tout son cœur et son prochain comme soi-même", "Aller à l'église", "Donner la dîme"],
        correct: "Aimer Dieu de tout son cœur et son prochain comme soi-même",
        niveau: "Transversal"
      },
      {
        question: "Selon Jean 13:35, comment le monde reconnaîtra-t-il les disciples de Jésus ?",
        options: ["Par leurs miracles", "À l'amour qu'ils auront les uns pour les autres", "Par leur richesse", "Par leurs connaissances"],
        correct: "À l'amour qu'ils auront les uns pour les autres",
        niveau: "Transversal"
      },
      {
        question: "Quelle est la Grande Commission de Matthieu 28:19-20 ?",
        options: ["Construire des églises", "Allez, faites de toutes les nations des disciples", "Prier sans cesse", "Jeûner régulièrement"],
        correct: "Allez, faites de toutes les nations des disciples",
        niveau: "Transversal"
      },
      {
        question: "Selon 2 Timothée 3:16, à quoi la Bible est-elle utile ?",
        options: ["Seulement à la lecture", "À l'enseignement, la réfutation, la correction, l'instruction dans la justice", "À décorer", "À impressionner"],
        correct: "À l'enseignement, la réfutation, la correction, l'instruction dans la justice",
        niveau: "Transversal"
      },
      {
        question: "Que dit Romains 12:1 sur la consécration ?",
        options: ["Offrir son argent", "Offrir nos corps comme un sacrifice vivant, saint, agréable à Dieu", "Devenir pasteur", "Partir en mission"],
        correct: "Offrir nos corps comme un sacrifice vivant, saint, agréable à Dieu",
        niveau: "Transversal"
      }
    ]
  };

  // Calculate progression statistics
  const calculateProgressionStats = () => {
    if (!progression) return { niveauActuel: 1, totalThemes: 0, themesCompletes: 0, pourcentage: 0 };

    let totalThemes = 0;
    let themesCompletes = 0;

    ['niveau1', 'niveau2', 'niveau3', 'niveau4'].forEach((niveauKey, index) => {
      const niveauData = progression.niveaux?.[niveauKey];
      const niveauThemes = [niveau1Themes, niveau2Themes, niveau3Themes, niveau4Themes][index];
      totalThemes += niveauThemes.length;

      if (niveauData?.themes) {
        themesCompletes += niveauData.themes.filter(t => t.score >= 75).length;
      }
    });

    const pourcentage = totalThemes > 0 ? Math.round((themesCompletes / totalThemes) * 100) : 0;

    return {
      niveauActuel: progression.niveauActuel || 1,
      totalThemes,
      themesCompletes,
      pourcentage
    };
  };

  const stats = calculateProgressionStats();

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
        <Typography variant="h4" gutterBottom sx={{ color: '#0047AB', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
          <School /> Parcours de Formation
        </Typography>

        {/* Progression Badge */}
        {user?.role === 'evangeliste' && progression && (
          <Card sx={{ mb: 3, bgcolor: '#E3F2FD', borderLeft: '5px solid #2196F3' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ color: '#0047AB', fontWeight: 'bold' }}>
                  Votre Progression
                </Typography>
                <Chip
                  label={`Niveau ${stats.niveauActuel}/4`}
                  sx={{ bgcolor: '#2196F3', color: 'white', fontWeight: 'bold' }}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Themes completes: {stats.themesCompletes}/{stats.totalThemes}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                    {stats.pourcentage}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={stats.pourcentage}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    bgcolor: '#BBDEFB',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: '#2196F3'
                    }
                  }}
                />
              </Box>

              <Typography variant="caption" color="text.secondary">
                Completez tous les themes d'un niveau avec un score de 75% ou plus pour debloquer le niveau suivant.
              </Typography>
            </CardContent>
          </Card>
        )}

        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Méthodologie:</strong> Avant chaque cours, lisez le thème et préparez-vous.
            Pendant le cours, le formateur vous aidera à corriger et comprendre.
            Après chaque thème, mettez en pratique ce que vous avez appris.
          </Typography>
        </Alert>

        {/* NIVEAU I */}
        <Card sx={{ mb: 3, borderLeft: '5px solid #0047AB', opacity: niveauxAccessibles[1] ? 1 : 0.6 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <AutoStories sx={{ fontSize: 40, color: '#0047AB' }} />
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h5" sx={{ color: '#0047AB', fontWeight: 'bold' }}>
                      NIVEAU I : MES PREMIERS PAS
                    </Typography>
                    {niveauxAccessibles[1] ? (
                      <LockOpen sx={{ color: '#4CAF50' }} />
                    ) : (
                      <Lock sx={{ color: '#757575' }} />
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Cahier de l'apprenant - Centre Missionnaire Réhoboth
                  </Typography>
                  <Chip
                    label="10 Thèmes"
                    size="small"
                    sx={{ mt: 1, bgcolor: '#4CAF50', color: 'white' }}
                  />
                </Box>
              </Box>
              {progression?.niveaux?.niveau1?.complete && (
                <CheckCircle sx={{ fontSize: 40, color: '#4CAF50' }} />
              )}
            </Box>

            {!niveauxAccessibles[1] && user?.role === 'evangeliste' && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                Vous devez d'abord completer le NIVEAU precedent
              </Alert>
            )}

            <Divider sx={{ my: 2 }} />

            {niveau1Themes.map((theme, index) => (
              <Accordion
                key={theme.id}
                expanded={expandedTheme === theme.id}
                onChange={niveauxAccessibles[1] ? handleChangeTheme(theme.id) : undefined}
                disabled={!niveauxAccessibles[1]}
                sx={{ mb: 1 }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  sx={{
                    bgcolor: expandedTheme === theme.id ? '#f5f5f5' : 'white',
                    '&:hover': { bgcolor: '#f9f9f9' }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                    <Typography sx={{ fontSize: '1.5rem' }}>{theme.icon}</Typography>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ color: '#0047AB', fontSize: '1rem' }}>
                        Thème {index + 1}: {theme.titre}
                      </Typography>
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ pl: 2 }}>
                    <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic', color: '#666' }}>
                      {theme.contenu.introduction}
                    </Typography>

                    {theme.contenu.points.map((point, idx) => (
                      <Box key={idx} sx={{ mb: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#0047AB', mb: 1 }}>
                          {point.titre}
                        </Typography>
                        <List dense>
                          {point.details.map((detail, detailIdx) => (
                            <ListItem key={detailIdx} sx={{ py: 0.5 }}>
                              <CheckCircle sx={{ fontSize: 16, color: '#4CAF50', mr: 1 }} />
                              <ListItemText
                                primary={detail}
                                primaryTypographyProps={{ variant: 'body2' }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    ))}

                    {theme.contenu.applications && theme.contenu.applications.length > 0 && (
                      <Box sx={{ mt: 3, p: 2, bgcolor: '#E3F2FD', borderRadius: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#0047AB', mb: 1 }}>
                          Applications pratiques:
                        </Typography>
                        <List dense>
                          {theme.contenu.applications.map((app, appIdx) => (
                            <ListItem key={appIdx} sx={{ py: 0.5 }}>
                              <CheckCircle sx={{ fontSize: 16, color: '#2196F3', mr: 1 }} />
                              <ListItemText
                                primary={app}
                                primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}

                    {/* Quiz Section */}
                    {theme.quiz && (
                      <Paper sx={{ mt: 3, p: 3, bgcolor: '#FFF9C4', borderLeft: '4px solid #FFA500' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <QuizIcon sx={{ color: '#FF8A00', fontSize: 28 }} />
                          <Typography variant="h6" sx={{ color: '#FF8A00', fontWeight: 'bold' }}>
                            Quiz d'évaluation
                          </Typography>
                        </Box>

                        <Typography variant="body2" sx={{ mb: 3, fontStyle: 'italic', color: '#666' }}>
                          Testez votre compréhension de ce thème en répondant aux questions suivantes :
                        </Typography>

                        {theme.quiz.questions.map((q, qIdx) => (
                          <Box key={qIdx} sx={{ mb: 3, p: 2, bgcolor: 'white', borderRadius: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: '#0047AB' }}>
                              {qIdx + 1}. {q.question}
                            </Typography>
                            <FormControl component="fieldset">
                              <RadioGroup
                                value={quizAnswers[`${theme.id}-${qIdx}`] || ''}
                                onChange={(e) => handleQuizAnswer(theme.id, qIdx, e.target.value)}
                              >
                                {q.options.map((option, optIdx) => (
                                  <FormControlLabel
                                    key={optIdx}
                                    value={option}
                                    control={<Radio />}
                                    label={option}
                                    sx={{
                                      mb: 0.5,
                                      '& .MuiFormControlLabel-label': {
                                        fontSize: '0.95rem'
                                      },
                                      ...(showQuizResults[theme.id] && {
                                        bgcolor: option === q.correct
                                          ? '#C8E6C9'
                                          : option === quizAnswers[`${theme.id}-${qIdx}`] && option !== q.correct
                                          ? '#FFCDD2'
                                          : 'transparent',
                                        borderRadius: 1,
                                        px: 1
                                      })
                                    }}
                                  />
                                ))}
                              </RadioGroup>
                            </FormControl>
                          </Box>
                        ))}

                        {!showQuizResults[theme.id] ? (
                          <Button
                            variant="contained"
                            onClick={() => handleSubmitQuiz(theme.id, theme.quiz)}
                            sx={{
                              mt: 2,
                              bgcolor: '#FF8A00',
                              '&:hover': { bgcolor: '#E67A00' }
                            }}
                            disabled={
                              theme.quiz.questions.some((_, idx) => !quizAnswers[`${theme.id}-${idx}`])
                            }
                          >
                            Soumettre le Quiz
                          </Button>
                        ) : (
                          <Alert
                            severity={quizResults[theme.id]?.score >= 75 ? 'success' : quizResults[theme.id]?.score >= 50 ? 'warning' : 'error'}
                            sx={{ mt: 2 }}
                          >
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              Résultat: {quizResults[theme.id]?.score}%
                            </Typography>
                            <Typography variant="body2">
                              Vous avez obtenu {quizResults[theme.id]?.correctCount} bonne(s) réponse(s) sur {quizResults[theme.id]?.total}.
                            </Typography>
                            {quizResults[theme.id]?.score >= 75 ? (
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                Excellent! Vous avez bien compris ce thème.
                              </Typography>
                            ) : quizResults[theme.id]?.score >= 50 ? (
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                Bien! Il serait bon de relire certaines parties du thème.
                              </Typography>
                            ) : (
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                Il est recommandé de relire attentivement ce thème.
                              </Typography>
                            )}
                          </Alert>
                        )}
                      </Paper>
                    )}
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </CardContent>
        </Card>

        {/* NIVEAU II */}
        <Card sx={{ mb: 3, borderLeft: '5px solid #E31E24', opacity: niveauxAccessibles[2] ? 1 : 0.6 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <AutoStories sx={{ fontSize: 40, color: '#E31E24' }} />
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h5" sx={{ color: '#E31E24', fontWeight: 'bold' }}>
                      NIVEAU II : MES PREMIERS PAS
                    </Typography>
                    {niveauxAccessibles[2] ? (
                      <LockOpen sx={{ color: '#4CAF50' }} />
                    ) : (
                      <Lock sx={{ color: '#757575' }} />
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Cahier de l'apprenant - Centre Missionnaire Réhoboth
                  </Typography>
                  <Chip
                    label="9 Thèmes"
                    size="small"
                    sx={{ mt: 1, bgcolor: '#FF9800', color: 'white' }}
                  />
                </Box>
              </Box>
              {progression?.niveaux?.niveau2?.complete && (
                <CheckCircle sx={{ fontSize: 40, color: '#4CAF50' }} />
              )}
            </Box>

            {!niveauxAccessibles[2] && user?.role === 'evangeliste' && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                Vous devez d'abord completer le NIVEAU precedent
              </Alert>
            )}

            <Divider sx={{ my: 2 }} />

            {niveau2Themes.map((theme, index) => (
              <Accordion
                key={theme.id}
                expanded={expandedTheme === theme.id}
                onChange={niveauxAccessibles[2] ? handleChangeTheme(theme.id) : undefined}
                disabled={!niveauxAccessibles[2]}
                sx={{ mb: 1 }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  sx={{
                    bgcolor: expandedTheme === theme.id ? '#fff5f5' : 'white',
                    '&:hover': { bgcolor: '#fff9f9' }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                    <Typography sx={{ fontSize: '1.5rem' }}>{theme.icon}</Typography>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ color: '#E31E24', fontSize: '1rem' }}>
                        Thème {index + 1}: {theme.titre}
                      </Typography>
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ pl: 2 }}>
                    <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic', color: '#666' }}>
                      {theme.contenu.introduction}
                    </Typography>

                    {theme.contenu.points.map((point, idx) => (
                      <Box key={idx} sx={{ mb: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#E31E24', mb: 1 }}>
                          {point.titre}
                        </Typography>
                        <List dense>
                          {point.details.map((detail, detailIdx) => (
                            <ListItem key={detailIdx} sx={{ py: 0.5 }}>
                              <CheckCircle sx={{ fontSize: 16, color: '#FF9800', mr: 1 }} />
                              <ListItemText
                                primary={detail}
                                primaryTypographyProps={{ variant: 'body2' }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    ))}

                    {theme.contenu.applications && theme.contenu.applications.length > 0 && (
                      <Box sx={{ mt: 3, p: 2, bgcolor: '#FFE0E0', borderRadius: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#E31E24', mb: 1 }}>
                          Applications pratiques:
                        </Typography>
                        <List dense>
                          {theme.contenu.applications.map((app, appIdx) => (
                            <ListItem key={appIdx} sx={{ py: 0.5 }}>
                              <CheckCircle sx={{ fontSize: 16, color: '#FF5252', mr: 1 }} />
                              <ListItemText
                                primary={app}
                                primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}

                    {/* Quiz Section */}
                    {theme.quiz && (
                      <Paper sx={{ mt: 3, p: 3, bgcolor: '#FFF9C4', borderLeft: '4px solid #FFA500' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <QuizIcon sx={{ color: '#FF8A00', fontSize: 28 }} />
                          <Typography variant="h6" sx={{ color: '#FF8A00', fontWeight: 'bold' }}>
                            Quiz d'évaluation
                          </Typography>
                        </Box>

                        <Typography variant="body2" sx={{ mb: 3, fontStyle: 'italic', color: '#666' }}>
                          Testez votre compréhension de ce thème en répondant aux questions suivantes :
                        </Typography>

                        {theme.quiz.questions.map((q, qIdx) => (
                          <Box key={qIdx} sx={{ mb: 3, p: 2, bgcolor: 'white', borderRadius: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: '#E31E24' }}>
                              {qIdx + 1}. {q.question}
                            </Typography>
                            <FormControl component="fieldset">
                              <RadioGroup
                                value={quizAnswers[`${theme.id}-${qIdx}`] || ''}
                                onChange={(e) => handleQuizAnswer(theme.id, qIdx, e.target.value)}
                              >
                                {q.options.map((option, optIdx) => (
                                  <FormControlLabel
                                    key={optIdx}
                                    value={option}
                                    control={<Radio />}
                                    label={option}
                                    sx={{
                                      mb: 0.5,
                                      '& .MuiFormControlLabel-label': {
                                        fontSize: '0.95rem'
                                      },
                                      ...(showQuizResults[theme.id] && {
                                        bgcolor: option === q.correct
                                          ? '#C8E6C9'
                                          : option === quizAnswers[`${theme.id}-${qIdx}`] && option !== q.correct
                                          ? '#FFCDD2'
                                          : 'transparent',
                                        borderRadius: 1,
                                        px: 1
                                      })
                                    }}
                                  />
                                ))}
                              </RadioGroup>
                            </FormControl>
                          </Box>
                        ))}

                        {!showQuizResults[theme.id] ? (
                          <Button
                            variant="contained"
                            onClick={() => handleSubmitQuiz(theme.id, theme.quiz)}
                            sx={{
                              mt: 2,
                              bgcolor: '#FF8A00',
                              '&:hover': { bgcolor: '#E67A00' }
                            }}
                            disabled={
                              theme.quiz.questions.some((_, idx) => !quizAnswers[`${theme.id}-${idx}`])
                            }
                          >
                            Soumettre le Quiz
                          </Button>
                        ) : (
                          <Alert
                            severity={quizResults[theme.id]?.score >= 75 ? 'success' : quizResults[theme.id]?.score >= 50 ? 'warning' : 'error'}
                            sx={{ mt: 2 }}
                          >
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              Résultat: {quizResults[theme.id]?.score}%
                            </Typography>
                            <Typography variant="body2">
                              Vous avez obtenu {quizResults[theme.id]?.correctCount} bonne(s) réponse(s) sur {quizResults[theme.id]?.total}.
                            </Typography>
                            {quizResults[theme.id]?.score >= 75 ? (
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                Excellent! Vous avez bien compris ce thème.
                              </Typography>
                            ) : quizResults[theme.id]?.score >= 50 ? (
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                Bien! Il serait bon de relire certaines parties du thème.
                              </Typography>
                            ) : (
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                Il est recommandé de relire attentivement ce thème.
                              </Typography>
                            )}
                          </Alert>
                        )}
                      </Paper>
                    )}
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </CardContent>
        </Card>

        {/* NIVEAU III */}
        <Card sx={{ mb: 3, borderLeft: '5px solid #9C27B0', opacity: niveauxAccessibles[3] ? 1 : 0.6 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <AutoStories sx={{ fontSize: 40, color: '#9C27B0' }} />
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h5" sx={{ color: '#9C27B0', fontWeight: 'bold' }}>
                      NIVEAU III : LE SAINT-ESPRIT ET LE TÉMOIGNAGE
                    </Typography>
                    {niveauxAccessibles[3] ? (
                      <LockOpen sx={{ color: '#4CAF50' }} />
                    ) : (
                      <Lock sx={{ color: '#757575' }} />
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Cahier de l'apprenant - Centre Missionnaire Réhoboth
                  </Typography>
                  <Chip
                    label="9 Thèmes"
                    size="small"
                    sx={{ mt: 1, bgcolor: '#9C27B0', color: 'white' }}
                  />
                </Box>
              </Box>
              {progression?.niveaux?.niveau3?.complete && (
                <CheckCircle sx={{ fontSize: 40, color: '#4CAF50' }} />
              )}
            </Box>

            {!niveauxAccessibles[3] && user?.role === 'evangeliste' && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                Vous devez d'abord completer le NIVEAU precedent
              </Alert>
            )}

            <Divider sx={{ my: 2 }} />

            {niveau3Themes.map((theme, index) => (
              <Accordion
                key={theme.id}
                expanded={expandedTheme === theme.id}
                onChange={niveauxAccessibles[3] ? handleChangeTheme(theme.id) : undefined}
                disabled={!niveauxAccessibles[3]}
                sx={{ mb: 1 }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  sx={{
                    bgcolor: expandedTheme === theme.id ? '#f3e5f5' : 'white',
                    '&:hover': { bgcolor: '#faf5fb' }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                    <Typography sx={{ fontSize: '1.5rem' }}>{theme.icon}</Typography>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ color: '#9C27B0', fontSize: '1rem' }}>
                        Thème {index + 1}: {theme.titre}
                      </Typography>
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ pl: 2 }}>
                    <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic', color: '#666' }}>
                      {theme.contenu.introduction}
                    </Typography>

                    {theme.contenu.points.map((point, idx) => (
                      <Box key={idx} sx={{ mb: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#9C27B0', mb: 1 }}>
                          {point.titre}
                        </Typography>
                        <List dense>
                          {point.details.map((detail, detailIdx) => (
                            <ListItem key={detailIdx} sx={{ py: 0.5 }}>
                              <CheckCircle sx={{ fontSize: 16, color: '#9C27B0', mr: 1 }} />
                              <ListItemText
                                primary={detail}
                                primaryTypographyProps={{ variant: 'body2' }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    ))}

                    {theme.contenu.applications && theme.contenu.applications.length > 0 && (
                      <Box sx={{ mt: 3, p: 2, bgcolor: '#F3E5F5', borderRadius: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#9C27B0', mb: 1 }}>
                          Applications pratiques:
                        </Typography>
                        <List dense>
                          {theme.contenu.applications.map((app, appIdx) => (
                            <ListItem key={appIdx} sx={{ py: 0.5 }}>
                              <CheckCircle sx={{ fontSize: 16, color: '#BA68C8', mr: 1 }} />
                              <ListItemText
                                primary={app}
                                primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}

                    {/* Quiz Section */}
                    {theme.quiz && (
                      <Paper sx={{ mt: 3, p: 3, bgcolor: '#FFF9C4', borderLeft: '4px solid #FFA500' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <QuizIcon sx={{ color: '#FF8A00', fontSize: 28 }} />
                          <Typography variant="h6" sx={{ color: '#FF8A00', fontWeight: 'bold' }}>
                            Quiz d'évaluation
                          </Typography>
                        </Box>

                        <Typography variant="body2" sx={{ mb: 3, fontStyle: 'italic', color: '#666' }}>
                          Testez votre compréhension de ce thème en répondant aux questions suivantes :
                        </Typography>

                        {theme.quiz.questions.map((q, qIdx) => (
                          <Box key={qIdx} sx={{ mb: 3, p: 2, bgcolor: 'white', borderRadius: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: '#9C27B0' }}>
                              {qIdx + 1}. {q.question}
                            </Typography>
                            <FormControl component="fieldset">
                              <RadioGroup
                                value={quizAnswers[`${theme.id}-${qIdx}`] || ''}
                                onChange={(e) => handleQuizAnswer(theme.id, qIdx, e.target.value)}
                              >
                                {q.options.map((option, optIdx) => (
                                  <FormControlLabel
                                    key={optIdx}
                                    value={option}
                                    control={<Radio />}
                                    label={option}
                                    sx={{
                                      mb: 0.5,
                                      '& .MuiFormControlLabel-label': {
                                        fontSize: '0.95rem'
                                      },
                                      ...(showQuizResults[theme.id] && {
                                        bgcolor: option === q.correct
                                          ? '#C8E6C9'
                                          : option === quizAnswers[`${theme.id}-${qIdx}`] && option !== q.correct
                                          ? '#FFCDD2'
                                          : 'transparent',
                                        borderRadius: 1,
                                        px: 1
                                      })
                                    }}
                                  />
                                ))}
                              </RadioGroup>
                            </FormControl>
                          </Box>
                        ))}

                        {!showQuizResults[theme.id] ? (
                          <Button
                            variant="contained"
                            onClick={() => handleSubmitQuiz(theme.id, theme.quiz)}
                            sx={{
                              mt: 2,
                              bgcolor: '#FF8A00',
                              '&:hover': { bgcolor: '#E67A00' }
                            }}
                            disabled={
                              theme.quiz.questions.some((_, idx) => !quizAnswers[`${theme.id}-${idx}`])
                            }
                          >
                            Soumettre le Quiz
                          </Button>
                        ) : (
                          <Alert
                            severity={quizResults[theme.id]?.score >= 75 ? 'success' : quizResults[theme.id]?.score >= 50 ? 'warning' : 'error'}
                            sx={{ mt: 2 }}
                          >
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              Résultat: {quizResults[theme.id]?.score}%
                            </Typography>
                            <Typography variant="body2">
                              Vous avez obtenu {quizResults[theme.id]?.correctCount} bonne(s) réponse(s) sur {quizResults[theme.id]?.total}.
                            </Typography>
                            {quizResults[theme.id]?.score >= 75 ? (
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                Excellent! Vous avez bien compris ce thème.
                              </Typography>
                            ) : quizResults[theme.id]?.score >= 50 ? (
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                Bien! Il serait bon de relire certaines parties du thème.
                              </Typography>
                            ) : (
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                Il est recommandé de relire attentivement ce thème.
                              </Typography>
                            )}
                          </Alert>
                        )}
                      </Paper>
                    )}
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </CardContent>
        </Card>

        {/* NIVEAU IV */}
        <Card sx={{ mb: 3, borderLeft: '5px solid #4CAF50', opacity: niveauxAccessibles[4] ? 1 : 0.6 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <AutoStories sx={{ fontSize: 40, color: '#4CAF50' }} />
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h5" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
                      NIVEAU IV : L'ÉGLISE LOCALE
                    </Typography>
                    {niveauxAccessibles[4] ? (
                      <LockOpen sx={{ color: '#4CAF50' }} />
                    ) : (
                      <Lock sx={{ color: '#757575' }} />
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Cahier de l'apprenant - Centre Missionnaire Réhoboth
                  </Typography>
                  <Chip
                    label="8 Thèmes"
                    size="small"
                    sx={{ mt: 1, bgcolor: '#4CAF50', color: 'white' }}
                  />
                </Box>
              </Box>
              {progression?.niveaux?.niveau4?.complete && (
                <CheckCircle sx={{ fontSize: 40, color: '#4CAF50' }} />
              )}
            </Box>

            {!niveauxAccessibles[4] && user?.role === 'evangeliste' && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                Vous devez d'abord completer le NIVEAU precedent
              </Alert>
            )}

            <Divider sx={{ my: 2 }} />

            {niveau4Themes.map((theme, index) => (
              <Accordion
                key={theme.id}
                expanded={expandedTheme === theme.id}
                onChange={niveauxAccessibles[4] ? handleChangeTheme(theme.id) : undefined}
                disabled={!niveauxAccessibles[4]}
                sx={{ mb: 1 }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  sx={{
                    bgcolor: expandedTheme === theme.id ? '#e8f5e9' : 'white',
                    '&:hover': { bgcolor: '#f1f8f4' }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                    <Typography sx={{ fontSize: '1.5rem' }}>{theme.icon}</Typography>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ color: '#4CAF50', fontSize: '1rem' }}>
                        Thème {index + 1}: {theme.titre}
                      </Typography>
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ pl: 2 }}>
                    <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic', color: '#666' }}>
                      {theme.contenu.introduction}
                    </Typography>

                    {theme.contenu.points.map((point, idx) => (
                      <Box key={idx} sx={{ mb: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#4CAF50', mb: 1 }}>
                          {point.titre}
                        </Typography>
                        <List dense>
                          {point.details.map((detail, detailIdx) => (
                            <ListItem key={detailIdx} sx={{ py: 0.5 }}>
                              <CheckCircle sx={{ fontSize: 16, color: '#4CAF50', mr: 1 }} />
                              <ListItemText
                                primary={detail}
                                primaryTypographyProps={{ variant: 'body2' }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    ))}

                    {theme.contenu.applications && theme.contenu.applications.length > 0 && (
                      <Box sx={{ mt: 3, p: 2, bgcolor: '#E8F5E9', borderRadius: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#4CAF50', mb: 1 }}>
                          Applications pratiques:
                        </Typography>
                        <List dense>
                          {theme.contenu.applications.map((app, appIdx) => (
                            <ListItem key={appIdx} sx={{ py: 0.5 }}>
                              <CheckCircle sx={{ fontSize: 16, color: '#66BB6A', mr: 1 }} />
                              <ListItemText
                                primary={app}
                                primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}

                    {/* Quiz Section */}
                    {theme.quiz && (
                      <Paper sx={{ mt: 3, p: 3, bgcolor: '#FFF9C4', borderLeft: '4px solid #FFA500' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <QuizIcon sx={{ color: '#FF8A00', fontSize: 28 }} />
                          <Typography variant="h6" sx={{ color: '#FF8A00', fontWeight: 'bold' }}>
                            Quiz d'évaluation
                          </Typography>
                        </Box>

                        <Typography variant="body2" sx={{ mb: 3, fontStyle: 'italic', color: '#666' }}>
                          Testez votre compréhension de ce thème en répondant aux questions suivantes :
                        </Typography>

                        {theme.quiz.questions.map((q, qIdx) => (
                          <Box key={qIdx} sx={{ mb: 3, p: 2, bgcolor: 'white', borderRadius: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: '#4CAF50' }}>
                              {qIdx + 1}. {q.question}
                            </Typography>
                            <FormControl component="fieldset">
                              <RadioGroup
                                value={quizAnswers[`${theme.id}-${qIdx}`] || ''}
                                onChange={(e) => handleQuizAnswer(theme.id, qIdx, e.target.value)}
                              >
                                {q.options.map((option, optIdx) => (
                                  <FormControlLabel
                                    key={optIdx}
                                    value={option}
                                    control={<Radio />}
                                    label={option}
                                    sx={{
                                      mb: 0.5,
                                      '& .MuiFormControlLabel-label': {
                                        fontSize: '0.95rem'
                                      },
                                      ...(showQuizResults[theme.id] && {
                                        bgcolor: option === q.correct
                                          ? '#C8E6C9'
                                          : option === quizAnswers[`${theme.id}-${qIdx}`] && option !== q.correct
                                          ? '#FFCDD2'
                                          : 'transparent',
                                        borderRadius: 1,
                                        px: 1
                                      })
                                    }}
                                  />
                                ))}
                              </RadioGroup>
                            </FormControl>
                          </Box>
                        ))}

                        {!showQuizResults[theme.id] ? (
                          <Button
                            variant="contained"
                            onClick={() => handleSubmitQuiz(theme.id, theme.quiz)}
                            sx={{
                              mt: 2,
                              bgcolor: '#FF8A00',
                              '&:hover': { bgcolor: '#E67A00' }
                            }}
                            disabled={
                              theme.quiz.questions.some((_, idx) => !quizAnswers[`${theme.id}-${idx}`])
                            }
                          >
                            Soumettre le Quiz
                          </Button>
                        ) : (
                          <Alert
                            severity={quizResults[theme.id]?.score >= 75 ? 'success' : quizResults[theme.id]?.score >= 50 ? 'warning' : 'error'}
                            sx={{ mt: 2 }}
                          >
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              Résultat: {quizResults[theme.id]?.score}%
                            </Typography>
                            <Typography variant="body2">
                              Vous avez obtenu {quizResults[theme.id]?.correctCount} bonne(s) réponse(s) sur {quizResults[theme.id]?.total}.
                            </Typography>
                            {quizResults[theme.id]?.score >= 75 ? (
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                Excellent! Vous avez bien compris ce thème.
                              </Typography>
                            ) : quizResults[theme.id]?.score >= 50 ? (
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                Bien! Il serait bon de relire certaines parties du thème.
                              </Typography>
                            ) : (
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                Il est recommandé de relire attentivement ce thème.
                              </Typography>
                            )}
                          </Alert>
                        )}
                      </Paper>
                    )}
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </CardContent>
        </Card>
      </Box>

      {/* Quiz Général Final */}
      <Box sx={{ mt: 6, mb: 4 }}>
        <Card
          elevation={6}
          sx={{
            background: 'linear-gradient(135deg, #0047AB 0%, #DC143C 25%, #9370DB 50%, #228B22 100%)',
            borderRadius: 3,
            border: '3px solid gold',
            opacity: niveauxAccessibles.final ? 1 : 0.6
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                <Trophy sx={{ fontSize: 80, color: '#FFD700' }} />
                {niveauxAccessibles.final ? (
                  <LockOpen sx={{ fontSize: 40, color: '#4CAF50' }} />
                ) : (
                  <Lock sx={{ fontSize: 40, color: '#757575' }} />
                )}
              </Box>
              <Typography
                variant="h3"
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                  mb: 2,
                  mt: 2
                }}
              >
                QUIZ GÉNÉRAL FINAL
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: '#FFD700',
                  fontWeight: 'bold',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                }}
              >
                ÉVALUATION COMPLÈTE
              </Typography>
              {!niveauxAccessibles.final && user?.role === 'evangeliste' && (
                <Alert severity="warning" sx={{ mt: 3, bgcolor: 'rgba(255,255,255,0.9)' }}>
                  Vous devez d'abord completer tous les 4 niveaux pour acceder au quiz final
                </Alert>
              )}
              <Typography
                variant="body1"
                sx={{
                  color: 'white',
                  mt: 2,
                  fontSize: '1.1rem'
                }}
              >
                25 questions couvrant tous les niveaux du parcours
              </Typography>
            </Box>

            <Paper elevation={3} sx={{ p: 3, bgcolor: 'rgba(255, 255, 255, 0.95)' }}>
              {niveauxAccessibles.final && quizGeneralFinal.questions.map((q, qIdx) => {
                const isStartOfSection = qIdx === 0 || q.niveau !== quizGeneralFinal.questions[qIdx - 1].niveau;

                return (
                  <React.Fragment key={qIdx}>
                    {isStartOfSection && (
                      <Box
                        sx={{
                          mt: qIdx === 0 ? 0 : 4,
                          mb: 3,
                          p: 2,
                          background:
                            q.niveau === 'I' ? 'linear-gradient(135deg, #0047AB, #1E90FF)' :
                            q.niveau === 'II' ? 'linear-gradient(135deg, #DC143C, #FF6347)' :
                            q.niveau === 'III' ? 'linear-gradient(135deg, #9370DB, #BA55D3)' :
                            q.niveau === 'IV' ? 'linear-gradient(135deg, #228B22, #32CD32)' :
                            'linear-gradient(135deg, #FF8C00, #FFA500)',
                          borderRadius: 2,
                          textAlign: 'center'
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            color: 'white',
                            fontWeight: 'bold',
                            textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                          }}
                        >
                          {q.niveau === 'Transversal' ? 'QUESTIONS TRANSVERSALES' : `NIVEAU ${q.niveau}`}
                        </Typography>
                      </Box>
                    )}

                    <Box
                      key={qIdx}
                      sx={{
                        mb: 3,
                        p: 2,
                        bgcolor: 'rgba(248, 249, 250, 0.8)',
                        borderRadius: 2,
                        border: '1px solid #dee2e6'
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                        Question {qIdx + 1}: {q.question}
                      </Typography>
                      <FormControl component="fieldset" fullWidth>
                        <RadioGroup
                          value={quizAnswers[`quiz-final-${qIdx}`] || ''}
                          onChange={(e) => handleQuizAnswer('quiz-final', qIdx, e.target.value)}
                        >
                          {q.options.map((option, oIdx) => (
                            <FormControlLabel
                              key={oIdx}
                              value={option}
                              control={<Radio disabled={showQuizResults['quiz-final']} />}
                              label={option}
                              sx={{
                                mb: 1,
                                '& .MuiFormControlLabel-label': {
                                  fontSize: '0.95rem'
                                },
                                ...(showQuizResults['quiz-final'] && {
                                  bgcolor: option === q.correct
                                    ? '#C8E6C9'
                                    : option === quizAnswers[`quiz-final-${qIdx}`] && option !== q.correct
                                    ? '#FFCDD2'
                                    : 'transparent',
                                  borderRadius: 1,
                                  px: 1
                                })
                              }}
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </Box>
                  </React.Fragment>
                );
              })}

              {niveauxAccessibles.final && !showQuizResults['quiz-final'] ? (
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => handleSubmitQuizFinal(quizGeneralFinal)}
                  sx={{
                    mt: 3,
                    py: 2,
                    px: 6,
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                    color: '#000',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #FFA500, #FF8C00)',
                      transform: 'scale(1.05)',
                      transition: 'all 0.3s'
                    },
                    '&:disabled': {
                      background: '#ccc'
                    }
                  }}
                  disabled={
                    quizGeneralFinal.questions.some((_, idx) => !quizAnswers[`quiz-final-${idx}`])
                  }
                  fullWidth
                >
                  <Trophy sx={{ mr: 2 }} />
                  Soumettre le Quiz Final
                </Button>
              ) : null}

              {showQuizResults['quiz-final'] && (
                <Alert
                  severity={quizResults['quiz-final']?.score >= 80 ? 'success' : quizResults['quiz-final']?.score >= 60 ? 'warning' : 'error'}
                  sx={{
                    mt: 3,
                    p: 3,
                    fontSize: '1.1rem'
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                    <Trophy sx={{ mr: 1, verticalAlign: 'middle', color: '#FFD700' }} />
                    Résultat Final: {quizResults['quiz-final']?.score}%
                  </Typography>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Vous avez obtenu {quizResults['quiz-final']?.correctCount} bonne(s) réponse(s) sur {quizResults['quiz-final']?.total}.
                  </Typography>
                  {quizResults['quiz-final']?.score >= 80 ? (
                    <Box sx={{ mt: 2, p: 3, bgcolor: 'rgba(76, 175, 80, 0.1)', borderRadius: 2, border: '2px solid #4CAF50' }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2E7D32', mb: 2 }}>
                        FÉLICITATIONS! CERTIFICAT DE RÉUSSITE!
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        Vous avez brillamment réussi le Quiz Général Final avec un score exceptionnel de {quizResults['quiz-final']?.score}%!
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        Vous avez démontré une excellente compréhension de tous les niveaux du parcours de formation.
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#1B5E20' }}>
                        Vous êtes maintenant prêt(e) à mettre en pratique ces enseignements et à servir dans l'oeuvre de Dieu!
                      </Typography>
                    </Box>
                  ) : quizResults['quiz-final']?.score >= 60 ? (
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(255, 152, 0, 0.1)', borderRadius: 2 }}>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        Bon résultat! Vous avez une bonne compréhension générale du parcours.
                      </Typography>
                      <Typography variant="body1">
                        Il serait bénéfique de réviser certains thèmes pour renforcer vos connaissances.
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(244, 67, 54, 0.1)', borderRadius: 2 }}>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        Nous vous encourageons à relire attentivement les différents thèmes du parcours.
                      </Typography>
                      <Typography variant="body1">
                        Prenez le temps de méditer sur chaque enseignement et de vous approprier les vérités bibliques.
                      </Typography>
                    </Box>
                  )}

                  <Divider sx={{ my: 3 }} />

                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Répartition par niveau:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    {['I', 'II', 'III', 'IV', 'Transversal'].map(niveau => {
                      const niveauQuestions = quizGeneralFinal.questions.filter(q => q.niveau === niveau);
                      const niveauCorrect = niveauQuestions.filter((q, idx) => {
                        const originalIdx = quizGeneralFinal.questions.indexOf(q);
                        return quizAnswers[`quiz-final-${originalIdx}`] === q.correct;
                      }).length;
                      const niveauScore = Math.round((niveauCorrect / niveauQuestions.length) * 100);

                      return (
                        <Chip
                          key={niveau}
                          label={`${niveau === 'Transversal' ? 'Transversal' : `Niveau ${niveau}`}: ${niveauCorrect}/${niveauQuestions.length} (${niveauScore}%)`}
                          sx={{
                            fontSize: '0.95rem',
                            py: 2.5,
                            px: 1,
                            fontWeight: 'bold',
                            bgcolor:
                              niveau === 'I' ? '#0047AB' :
                              niveau === 'II' ? '#DC143C' :
                              niveau === 'III' ? '#9370DB' :
                              niveau === 'IV' ? '#228B22' :
                              '#FF8C00',
                            color: 'white'
                          }}
                        />
                      );
                    })}
                  </Box>
                </Alert>
              )}
            </Paper>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Parcours;

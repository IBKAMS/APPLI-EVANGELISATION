import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Chip
} from '@mui/material';
import {
  ExpandMore,
  MenuBook,
  CheckCircle,
  RadioButtonUnchecked
} from '@mui/icons-material';
import QuestionInput from './QuestionInput';

const ThemeSection = ({ theme, reponses, onResponseChange, disabled }) => {
  const getResponseForQuestion = (questionId) => {
    const reponse = reponses.find(r => r.questionId === questionId);
    return reponse?.reponse || '';
  };

  const isQuestionAnswered = (questionId) => {
    const response = getResponseForQuestion(questionId);
    return response && response.trim().length > 0;
  };

  const renderQuestions = (questions, prefix = '') => {
    return questions.map((question, idx) => (
      <Box key={question.id} sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          {isQuestionAnswered(question.id) ? (
            <CheckCircle sx={{ color: '#4CAF50', fontSize: 20 }} />
          ) : (
            <RadioButtonUnchecked sx={{ color: '#90CAF9', fontSize: 20 }} />
          )}
          <Typography variant="caption" sx={{ color: '#666', fontWeight: 600 }}>
            {prefix}Question {idx + 1}
          </Typography>
        </Box>
        <QuestionInput
          question={question}
          value={getResponseForQuestion(question.id)}
          onChange={(value) => onResponseChange(question.id, value, question)}
          disabled={disabled}
        />
      </Box>
    ));
  };

  const renderSection = (section, sectionIndex) => {
    return (
      <Accordion
        key={section.id}
        defaultExpanded={sectionIndex === 0}
        sx={{
          mb: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          '&:before': { display: 'none' },
          borderRadius: '8px !important'
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          sx={{
            bgcolor: '#F5F5F5',
            borderRadius: '8px',
            '&:hover': { bgcolor: '#EEEEEE' }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
            <MenuBook sx={{ color: '#0047AB' }} />
            <Typography sx={{ fontWeight: 600, color: '#0047AB', flex: 1 }}>
              {section.titre}
            </Typography>
            <Chip
              label={`${section.questions?.length || 0} questions`}
              size="small"
              sx={{ bgcolor: '#E3F2FD', color: '#0047AB' }}
            />
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 3 }}>
          {section.instruction && (
            <Typography
              variant="body2"
              sx={{
                mb: 3,
                p: 2,
                bgcolor: '#FFF3E0',
                borderLeft: '4px solid #FF9800',
                borderRadius: 1,
                fontStyle: 'italic'
              }}
            >
              {section.instruction}
            </Typography>
          )}

          {/* Questions principales */}
          {section.questions && section.questions.length > 0 && (
            <Box sx={{ mb: 3 }}>
              {renderQuestions(section.questions)}
            </Box>
          )}

          {/* Sous-sections */}
          {section.subsections && section.subsections.map((subsection, subIdx) => (
            <Box
              key={subsection.id}
              sx={{
                mb: 3,
                p: 2,
                bgcolor: '#FAFAFA',
                borderRadius: 2,
                borderLeft: '3px solid #90CAF9'
              }}
            >
              <Typography
                variant="h6"
                sx={{ mb: 2, color: '#0047AB', fontSize: '1.1rem', fontWeight: 600 }}
              >
                {subsection.titre}
              </Typography>
              {renderQuestions(subsection.questions, `${sectionIndex + 1}.${subIdx + 1}.`)}
            </Box>
          ))}
        </AccordionDetails>
      </Accordion>
    );
  };

  const renderApplications = () => {
    if (!theme.applications || theme.applications.length === 0) return null;

    return (
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mt: 3,
          bgcolor: '#E8F5E9',
          borderLeft: '5px solid #4CAF50'
        }}
      >
        <Typography
          variant="h6"
          sx={{ mb: 3, color: '#2E7D32', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <CheckCircle /> Applications pratiques
        </Typography>

        {theme.applications.map((app, idx) => (
          <Box key={app.id} sx={{ mb: 3 }}>
            <QuestionInput
              question={{
                ...app,
                texte: app.instruction,
                titre: `Application ${idx + 1}`
              }}
              value={getResponseForQuestion(app.id)}
              onChange={(value) => onResponseChange(app.id, value, app)}
              disabled={disabled}
            />
          </Box>
        ))}
      </Paper>
    );
  };

  // Calculer la progression
  const totalQuestions = [
    ...(theme.sections?.flatMap(s => [
      ...(s.questions || []),
      ...(s.subsections?.flatMap(sub => sub.questions) || [])
    ]) || []),
    ...(theme.applications || [])
  ].length;

  const answeredQuestions = [
    ...(theme.sections?.flatMap(s => [
      ...(s.questions || []),
      ...(s.subsections?.flatMap(sub => sub.questions) || [])
    ]) || []),
    ...(theme.applications || [])
  ].filter(q => isQuestionAnswered(q.id)).length;

  const progression = totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;

  return (
    <Paper elevation={4} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
      {/* En-tête du thème */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Chip
            label={`Thème ${theme.numero}`}
            sx={{
              bgcolor: '#0047AB',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1rem',
              px: 2,
              py: 2.5
            }}
          />
          <Chip
            label={`${progression}% complété`}
            sx={{
              bgcolor: progression === 100 ? '#4CAF50' : '#FF9800',
              color: 'white',
              fontWeight: 'bold'
            }}
          />
        </Box>

        <Typography
          variant="h4"
          sx={{
            color: '#0047AB',
            fontWeight: 'bold',
            mb: 2,
            lineHeight: 1.3
          }}
        >
          {theme.titre}
        </Typography>

        <Divider sx={{ borderWidth: 2, borderColor: '#0047AB' }} />
      </Box>

      {/* Sections */}
      {theme.sections && theme.sections.map((section, idx) => renderSection(section, idx))}

      {/* Applications */}
      {renderApplications()}

      {/* Progression footer */}
      <Box sx={{ mt: 4, p: 2, bgcolor: '#F5F5F5', borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ color: '#666' }}>
          {answeredQuestions} sur {totalQuestions} questions répondues
        </Typography>
      </Box>
    </Paper>
  );
};

export default ThemeSection;

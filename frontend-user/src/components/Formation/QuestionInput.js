import React, { useState, useEffect } from 'react';
import { TextField, Box, Typography, Chip } from '@mui/material';
import { Book, Edit } from '@mui/icons-material';

const QuestionInput = ({ question, value, onChange, disabled }) => {
  const [localValue, setLocalValue] = useState(value || '');

  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue);
  };

  const getQuestionLabel = () => {
    if (question.titre) return question.titre;
    if (question.texte) return question.texte;
    if (question.verset) return `Méditation sur ${question.verset}`;
    return 'Votre réponse';
  };

  const isCompletion = question.type === 'completion';
  const isLongText = question.type === 'texte_long';

  // Fonction pour afficher la phrase à compléter avec espace scintillant
  const renderCompletionText = () => {
    if (!isCompletion || !question.texte) return null;

    const parts = question.texte.split('...');
    if (parts.length < 2) return null;

    return (
      <Box sx={{ mb: 2, p: 2, bgcolor: '#FFF9E6', borderRadius: 2, border: '2px dashed #FFA726' }}>
        <Typography variant="body1" sx={{ color: '#333', fontWeight: 500, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          {parts.map((part, idx) => (
            <React.Fragment key={idx}>
              <span>{part}</span>
              {idx < parts.length - 1 && (
                <Box
                  component="span"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.5,
                    px: 2,
                    py: 0.5,
                    bgcolor: '#E3F2FD',
                    borderRadius: 1,
                    border: '2px solid #0047AB',
                    animation: 'pulse 2s ease-in-out infinite',
                    '@keyframes pulse': {
                      '0%, 100%': {
                        opacity: 1,
                        boxShadow: '0 0 0 0 rgba(0, 71, 171, 0.4)'
                      },
                      '50%': {
                        opacity: 0.7,
                        boxShadow: '0 0 0 8px rgba(0, 71, 171, 0)'
                      }
                    }
                  }}
                >
                  <Edit sx={{ fontSize: 16, color: '#0047AB' }} />
                  <Typography component="span" sx={{ fontSize: '0.85rem', color: '#0047AB', fontWeight: 600 }}>
                    {localValue || 'À compléter'}
                  </Typography>
                </Box>
              )}
            </React.Fragment>
          ))}
        </Typography>
        <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#666', fontStyle: 'italic' }}>
          💡 Renseignez votre réponse dans le champ ci-dessous
        </Typography>
      </Box>
    );
  };

  return (
    <Box sx={{ mb: 3 }}>
      {/* Verset biblique */}
      {(question.verset || (question.versets && question.versets.length > 0)) && (
        <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Book sx={{ color: '#0047AB', fontSize: 20 }} />
          {question.verset && (
            <Chip
              label={question.verset}
              size="small"
              sx={{
                bgcolor: '#E3F2FD',
                color: '#0047AB',
                fontWeight: 600,
                fontSize: '0.85rem'
              }}
            />
          )}
          {question.versets && question.versets.map((verset, idx) => (
            <Chip
              key={idx}
              label={verset}
              size="small"
              sx={{
                bgcolor: '#E3F2FD',
                color: '#0047AB',
                fontWeight: 600,
                fontSize: '0.85rem'
              }}
            />
          ))}
        </Box>
      )}

      {/* Question instruction */}
      {question.instruction && (
        <Typography
          variant="body2"
          sx={{
            mb: 1.5,
            color: '#555',
            fontStyle: 'italic',
            pl: 1,
            borderLeft: '3px solid #0047AB'
          }}
        >
          {question.instruction}
        </Typography>
      )}

      {/* Affichage de la phrase à compléter avec espace scintillant */}
      {renderCompletionText()}

      {/* Champ de saisie */}
      <TextField
        fullWidth
        multiline={isLongText}
        rows={isLongText ? 4 : isCompletion ? 1 : 2}
        label={getQuestionLabel()}
        value={localValue}
        onChange={handleChange}
        disabled={disabled}
        placeholder={
          isLongText
            ? 'Écrivez votre réflexion personnelle ici...'
            : isCompletion
            ? 'Complétez la phrase...'
            : 'Votre réponse...'
        }
        sx={{
          '& .MuiOutlinedInput-root': {
            bgcolor: '#E3F2FD',
            '&:hover': {
              bgcolor: '#BBDEFB'
            },
            '&.Mui-focused': {
              bgcolor: '#E3F2FD'
            }
          },
          '& .MuiInputLabel-root': {
            color: '#0047AB',
            fontWeight: 500
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#90CAF9'
          }
        }}
      />
    </Box>
  );
};

export default QuestionInput;

import React, { useState, useEffect } from 'react';
import { TextField, Box, Typography, Chip } from '@mui/material';
import { Book } from '@mui/icons-material';

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

      {/* Aide pour complétion */}
      {isCompletion && question.reponseAttendue && (
        <Typography
          variant="caption"
          sx={{
            mt: 0.5,
            display: 'block',
            color: '#666',
            fontStyle: 'italic'
          }}
        >
          Indice: environ {question.reponseAttendue.length} caractères attendus
        </Typography>
      )}
    </Box>
  );
};

export default QuestionInput;

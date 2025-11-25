import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook personnalisé pour la sauvegarde automatique avec debounce
 * @param {Function} saveFunction - Fonction appelée pour sauvegarder
 * @param {number} delay - Délai de debounce en ms (défaut: 2000ms)
 */
const useAutoSave = (saveFunction, delay = 2000) => {
  const timeoutRef = useRef(null);
  const isSavingRef = useRef(false);

  const debouncedSave = useCallback(
    (...args) => {
      // Annuler le timeout précédent
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Créer un nouveau timeout
      timeoutRef.current = setTimeout(async () => {
        if (!isSavingRef.current) {
          isSavingRef.current = true;
          try {
            await saveFunction(...args);
          } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
          } finally {
            isSavingRef.current = false;
          }
        }
      }, delay);
    },
    [saveFunction, delay]
  );

  // Nettoyer le timeout lors du démontage du composant
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedSave;
};

export default useAutoSave;

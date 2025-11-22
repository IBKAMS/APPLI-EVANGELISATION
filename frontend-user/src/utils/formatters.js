// Fonction pour formater un numéro de téléphone avec des espaces tous les 2 chiffres
// Exemple: "0506888289" devient "05 06 88 82 89"
export const formatPhoneNumber = (value) => {
  if (!value) return '';

  // Supprimer tous les caractères non numériques
  const numbers = value.replace(/\D/g, '');

  // Limiter à 10 chiffres
  const limited = numbers.slice(0, 10);

  // Formater avec des espaces tous les 2 chiffres
  const formatted = limited.match(/.{1,2}/g)?.join(' ') || limited;

  return formatted;
};

// Fonction pour retirer le formatage et obtenir seulement les chiffres
// Exemple: "05 06 88 82 89" devient "0506888289"
export const unformatPhoneNumber = (value) => {
  if (!value) return '';
  return value.replace(/\s/g, '');
};

// Fonction pour valider un numéro de téléphone (doit avoir 10 chiffres)
export const isValidPhoneNumber = (value) => {
  const numbers = unformatPhoneNumber(value);
  return numbers.length === 10;
};

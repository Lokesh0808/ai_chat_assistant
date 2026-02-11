export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .substring(0, 1000) // Limit input length
    .replace(/[<>]/g, ''); // Remove potential HTML tags
};

export const isValidInput = (input) => {
  const sanitized = sanitizeInput(input);
  return sanitized.length > 0 && sanitized.length <= 1000;
};

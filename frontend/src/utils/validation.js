export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validatePasswordMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

export const getPasswordStrength = (password) => {
  if (!password) return { score: 0, text: 'Enter a password' };
  
  let score = 0;
  const checks = {
    length: password.length >= 6,
  };
  
  score = Object.values(checks).filter(Boolean).length;
  
  if (score < 2) return { score, text: 'Weak', color: '#e53e3e' };
  if (score < 4) return { score, text: 'Medium', color: '#dd6b20' };
  return { score, text: 'Strong', color: '#38a169' };
};

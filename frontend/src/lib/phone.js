export const normalizePhoneNumber = (input) => {
  if (!input) return '';
  // Strip all non-digits
  let digits = String(input).replace(/\D+/g, '');

  // If starts with 8 and has 11 digits, convert to 7
  if (digits.length === 11 && digits.startsWith('8')) {
    digits = '7' + digits.slice(1);
  }

  // If 10 digits (assume RU local), prepend 7
  if (digits.length === 10) {
    digits = '7' + digits;
  }

  // If 11 digits and not starting with 7, coerce to RU by replacing first digit with 7
  if (digits.length === 11 && !digits.startsWith('7')) {
    digits = '7' + digits.slice(1);
  }

  // Trim to 11 digits if longer (take last 11 to be safe)
  if (digits.length > 11) {
    digits = digits.slice(-11);
  }

  // Return in +7XXXXXXXXXX format when length is 11
  if (digits.length === 11 && digits.startsWith('7')) {
    return `+${digits}`;
  }

  // Fallback: return sanitized digits with plus if it starts with 7 and has <= 11
  if (digits.startsWith('7')) {
    return `+${digits}`;
  }

  return `+${digits}`;
};

export const isValidRussianPhone = (input) => {
  if (!input) return false;
  const normalized = normalizePhoneNumber(input);
  return /^\+7\d{10}$/.test(normalized);
}; 
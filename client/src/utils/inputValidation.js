// ==============================
// Allow only letters and spaces
// ==============================
export const allowOnlyLetters = (value) => {
  return value
    .replace(/[^A-Za-z\s]/g, "")   // Remove everything except letters & spaces
    .replace(/\s{2,}/g, " ");      // Prevent multiple spaces
};

// ==============================
// Allow only numbers
// ==============================
export const allowOnlyNumbers = (value) => {
  return value.replace(/\D/g, "");
};

// ==============================
// Allow letters, numbers & spaces
// ==============================
export const allowAlphaNumeric = (value) => {
  return value.replace(/[^A-Za-z0-9\s]/g, "");
};

// ==============================
// Textarea
// Allows normal punctuation but removes unsupported characters
// ==============================
export const allowParagraph = (value) => {
  return value.replace(/[^A-Za-z0-9\s.,!?()\-/:&']/g, "");
};
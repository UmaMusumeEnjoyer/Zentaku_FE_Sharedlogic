// shared-logic/src/features/authPage/authValidation.ts
// Client-side validation rules — mirrors backend express-validator rules 1:1

/**
 * Map of field names to their validation error i18n key (null = valid).
 */
export interface ValidationErrors {
  [field: string]: string | null;
}

// ----------------------------------------------------------------
// Regex patterns (identical to backend auth.validators.ts)
// ----------------------------------------------------------------

const USERNAME_PATTERN = /^[a-zA-Z0-9_-]+$/;
const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ----------------------------------------------------------------
// Individual field validators — return i18n key or null
// ----------------------------------------------------------------

/** Validate login email: must be a valid email format */
export function validateLoginEmail(email: string): string | null {
  const trimmed = email.trim();
  if (!trimmed) return 'Auth:validation.email_required';
  if (!EMAIL_PATTERN.test(trimmed)) return 'Auth:validation.email_invalid';
  return null;
}

/** Validate login password: must not be empty */
export function validateLoginPassword(password: string): string | null {
  if (!password) return 'Auth:validation.password_required';
  return null;
}

/** Validate register username: 3–50 chars, [a-zA-Z0-9_-] only */
export function validateRegisterUsername(username: string): string | null {
  const trimmed = username.trim();
  if (!trimmed) return 'Auth:validation.username_length';
  if (trimmed.length < 3 || trimmed.length > 50)
    return 'Auth:validation.username_length';
  if (!USERNAME_PATTERN.test(trimmed))
    return 'Auth:validation.username_format';
  return null;
}

/** Validate register email: must be a valid email format */
export function validateRegisterEmail(email: string): string | null {
  return validateLoginEmail(email); // same rule
}

/** Validate register password: ≥8 chars + complexity */
export function validateRegisterPassword(password: string): string | null {
  if (!password) return 'Auth:validation.password_required';
  if (password.length < 8) return 'Auth:validation.password_min_length';
  if (!PASSWORD_PATTERN.test(password))
    return 'Auth:validation.password_complexity';
  return null;
}

/** Validate confirm password: must match password */
export function validateRegisterConfirmPassword(
  password: string,
  confirmPassword: string,
): string | null {
  if (confirmPassword !== password)
    return 'Auth:validation.confirm_password_mismatch';
  return null;
}

// ----------------------------------------------------------------
// Full-form validators
// ----------------------------------------------------------------

export function validateLoginForm(data: {
  email: string;
  password: string;
}): ValidationErrors {
  return {
    email: validateLoginEmail(data.email),
    password: validateLoginPassword(data.password),
  };
}

export interface RegisterFormData {
  email: string;
  username: string;
  password: string;
  confirm_password: string;
}

export function validateRegisterForm(data: RegisterFormData): ValidationErrors {
  return {
    email: validateRegisterEmail(data.email),
    username: validateRegisterUsername(data.username),
    password: validateRegisterPassword(data.password),
    confirm_password: validateRegisterConfirmPassword(
      data.password,
      data.confirm_password,
    ),
  };
}

/** Check if a ValidationErrors object has any errors */
export function hasValidationErrors(errors: ValidationErrors): boolean {
  return Object.values(errors).some((v) => v !== null);
}

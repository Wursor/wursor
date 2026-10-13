const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** A full address: something, an @, a domain with a dot, and a top-level part of two or more letters. */
export const isValidEmail = (value: string): boolean => EMAIL.test(value.trim());

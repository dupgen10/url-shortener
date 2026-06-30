import { nanoid } from 'nanoid';

/**
 * Generates a URL-safe short code using nanoid.
 * @param length - Length of the short code (default: 7)
 * @returns A URL-safe random string
 */
export const generateShortCode = (length: number = 7): string => {
  return nanoid(length);
};

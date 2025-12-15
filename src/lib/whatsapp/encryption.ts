/**
 * Encryption Utilities for WhatsApp Access Tokens
 * @module whatsapp/encryption
 */

import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY =
  process.env.WHATSAPP_ENCRYPTION_KEY ??
  "dev-test-encryption-key-32chars";

/**
 * Encrypt sensitive data (access tokens, etc.)
 * @param text - Plain text to encrypt
 * @returns Encrypted string
 */
export function encrypt(text: string): string {
  try {
    const encrypted = CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypt encrypted data
 * @param encryptedText - Encrypted text to decrypt
 * @returns Decrypted plain text
 */
export function decrypt(encryptedText: string): string {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_KEY);
    const plainText = decrypted.toString(CryptoJS.enc.Utf8);
    
    if (!plainText) {
      throw new Error('Decryption resulted in empty string');
    }
    
    return plainText;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}

/**
 * Generate a random encryption key (for initial setup)
 * @param length - Length of the key (default: 32)
 * @returns Random key string
 */
export function generateEncryptionKey(length: number = 32): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
}

/**
 * Hash a string (for verification purposes)
 * @param text - Text to hash
 * @returns SHA256 hash
 */
export function hash(text: string): string {
  return CryptoJS.SHA256(text).toString();
}

/**
 * Verify a hash matches the original text
 * @param text - Original text
 * @param hashedText - Hash to verify
 * @returns True if hash matches
 */
export function verifyHash(text: string, hashedText: string): boolean {
  return hash(text) === hashedText;
}



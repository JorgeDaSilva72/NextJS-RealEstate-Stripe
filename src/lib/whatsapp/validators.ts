/**
 * Input Validation Utilities for WhatsApp Integration
 * @module whatsapp/validators
 */

import validator from 'validator';

/**
 * Validate phone number format
 * Accepts international format with country code
 * @param phone - Phone number to validate
 * @returns True if valid
 */
export function isValidPhoneNumber(phone: string): boolean {
  if (!phone) return false;
  
  // Remove spaces, dashes, and parentheses
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  // Must start with + and have at least 10 digits
  const phoneRegex = /^\+[1-9]\d{9,14}$/;
  
  return phoneRegex.test(cleaned);
}

/**
 * Format phone number to WhatsApp format (without + prefix for API)
 * @param phone - Phone number to format
 * @returns Formatted phone number
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters except +
  let cleaned = phone.replace(/[^\d+]/g, '');
  
  // Remove + prefix if present (WhatsApp API doesn't use it)
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1);
  }
  
  return cleaned;
}

/**
 * Normalize phone number by adding country code if missing
 * @param phone - Phone number to normalize
 * @param countryPhonePrefix - Country phone prefix (e.g., "+212", "+221")
 * @returns Normalized phone number with country code
 */
export function normalizePhoneNumber(
  phone: string,
  countryPhonePrefix?: string
): string {
  if (!phone) return phone;
  
  // Remove spaces, dashes, and parentheses
  let cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  // If already starts with +, return as is
  if (cleaned.startsWith('+')) {
    return cleaned;
  }
  
  // If country prefix is provided, add it
  if (countryPhonePrefix) {
    // Remove + from prefix if present (we'll add it)
    const prefix = countryPhonePrefix.replace(/^\+/, '');
    // Remove leading 0 if present (common in local numbers)
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1);
    }
    return `+${prefix}${cleaned}`;
  }
  
  // If no country prefix and doesn't start with +, return as is
  // (validation will catch it)
  return cleaned;
}

/**
 * Validate message content
 * @param content - Message text
 * @param maxLength - Maximum length (default: 4096 for WhatsApp)
 * @returns Validation result
 */
export function validateMessageContent(
  content: string,
  maxLength: number = 4096
): { valid: boolean; error?: string } {
  if (!content) {
    return { valid: false, error: 'Message content cannot be empty' };
  }
  
  if (typeof content !== 'string') {
    return { valid: false, error: 'Message content must be a string' };
  }
  
  if (content.trim().length === 0) {
    return { valid: false, error: 'Message content cannot be only whitespace' };
  }
  
  if (content.length > maxLength) {
    return { 
      valid: false, 
      error: `Message content exceeds maximum length of ${maxLength} characters` 
    };
  }
  
  return { valid: true };
}

/**
 * Validate URL format
 * @param url - URL to validate
 * @returns True if valid URL
 */
export function isValidUrl(url: string): boolean {
  if (!url) return false;
  
  try {
    return validator.isURL(url, {
      protocols: ['http', 'https'],
      require_protocol: true,
    });
  } catch {
    return false;
  }
}

/**
 * Validate template name format
 * @param name - Template name
 * @returns True if valid
 */
export function isValidTemplateName(name: string): boolean {
  if (!name) return false;
  
  // Template names must be lowercase and can contain letters, numbers, and underscores
  const templateNameRegex = /^[a-z0-9_]+$/;
  
  return templateNameRegex.test(name) && name.length <= 512;
}

/**
 * Validate language code format (ISO 639-1)
 * @param code - Language code (e.g., 'en', 'fr', 'ar')
 * @returns True if valid
 */
export function isValidLanguageCode(code: string): boolean {
  if (!code) return false;
  
  // Basic validation for 2-letter ISO codes or locale codes like 'en_US'
  const languageCodeRegex = /^[a-z]{2}(_[A-Z]{2})?$/;
  
  return languageCodeRegex.test(code);
}

/**
 * Sanitize user input to prevent XSS
 * @param input - User input
 * @returns Sanitized input
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  
  return validator.escape(input);
}

/**
 * Validate WhatsApp message ID format
 * @param messageId - Message ID from WhatsApp
 * @returns True if valid format
 */
export function isValidMessageId(messageId: string): boolean {
  if (!messageId) return false;
  
  // WhatsApp message IDs are typically alphanumeric strings
  return /^[a-zA-Z0-9_\-\.]+$/.test(messageId) && messageId.length > 0;
}

/**
 * Validate media file size
 * @param sizeInBytes - File size in bytes
 * @param type - Media type
 * @returns Validation result
 */
export function validateMediaSize(
  sizeInBytes: number,
  type: 'image' | 'video' | 'document' | 'audio'
): { valid: boolean; error?: string } {
  const maxSizes = {
    image: 5 * 1024 * 1024, // 5 MB
    video: 16 * 1024 * 1024, // 16 MB
    document: 100 * 1024 * 1024, // 100 MB
    audio: 16 * 1024 * 1024, // 16 MB
  };
  
  const maxSize = maxSizes[type];
  
  if (sizeInBytes > maxSize) {
    return {
      valid: false,
      error: `File size exceeds maximum of ${maxSize / (1024 * 1024)} MB for ${type}`,
    };
  }
  
  return { valid: true };
}

/**
 * Validate media MIME type
 * @param mimeType - MIME type
 * @param type - Media type
 * @returns True if valid
 */
export function validateMediaMimeType(
  mimeType: string,
  type: 'image' | 'video' | 'document' | 'audio'
): boolean {
  const validMimeTypes: Record<string, string[]> = {
    image: ['image/jpeg', 'image/png'],
    video: ['video/mp4', 'video/3gpp'],
    audio: ['audio/aac', 'audio/mp4', 'audio/mpeg', 'audio/amr', 'audio/ogg'],
    document: [
      'application/pdf',
      'application/vnd.ms-powerpoint',
      'application/msword',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
  };
  
  return validMimeTypes[type]?.includes(mimeType) || false;
}

/**
 * Validate coordinates
 * @param latitude - Latitude
 * @param longitude - Longitude
 * @returns True if valid coordinates
 */
export function isValidCoordinates(latitude: number, longitude: number): boolean {
  return (
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}

/**
 * Validate webhook signature (for Meta webhooks)
 * @param signature - Signature from X-Hub-Signature-256 header
 * @param payload - Raw request body
 * @param secret - App secret
 * @returns True if signature is valid
 */
export function validateWebhookSignature(
  signature: string,
  payload: string,
  secret: string
): boolean {
  if (!signature || !payload || !secret) return false;
  
  try {
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    
    const signatureHash = signature.replace('sha256=', '');
    
    return crypto.timingSafeEqual(
      Buffer.from(signatureHash, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  } catch (error) {
    console.error('Webhook signature validation error:', error);
    return false;
  }
}



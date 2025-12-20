/**
 * WhatsApp Business API Client
 * Handles all communication with Meta Cloud API
 * @module whatsapp/client
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import type {
  WhatsAppConfig,
  SendMessageRequest,
  SendMessageResponse,
  SendTextMessageOptions,
  SendMediaMessageOptions,
  SendTemplateMessageOptions,
  SendLocationMessageOptions,
  MarkMessageAsReadOptions,
  GetMediaUrlOptions,
  ApiResponse,
} from './types';
import { 
  isValidPhoneNumber, 
  formatPhoneNumber, 
  validateMessageContent,
  isValidUrl,
  isValidCoordinates,
} from './validators';

export class WhatsAppClient {
  private client: AxiosInstance;
  private config: WhatsAppConfig;
  private readonly baseUrl: string;

  constructor(config: WhatsAppConfig) {
    this.config = config;
    this.baseUrl = `https://graph.facebook.com/${config.apiVersion}`;

    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': `Bearer ${config.accessToken}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 seconds
    });

    // Add request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        const debugMode =
          process.env.WHATSAPP_DEBUG_MODE ?? "true";
        if (debugMode === "true") {
          console.log('[WhatsApp Client] Request:', {
            method: config.method,
            url: config.url,
            data: config.data,
          });
        }
        return config;
      },
      (error) => {
        console.error('[WhatsApp Client] Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => {
        const debugMode =
          process.env.WHATSAPP_DEBUG_MODE ?? "true";
        if (debugMode === "true") {
          console.log('[WhatsApp Client] Response:', response.data);
        }
        return response;
      },
      (error: AxiosError) => {
        return Promise.reject(this.handleApiError(error));
      }
    );
  }

  /**
   * Send a text message
   */
  async sendTextMessage(options: SendTextMessageOptions): Promise<ApiResponse<SendMessageResponse>> {
    try {
      // Validate inputs
      if (!isValidPhoneNumber(options.to)) {
        return {
          success: false,
          error: {
            code: 400,
            message: 'Invalid phone number format',
          },
        };
      }

      const validation = validateMessageContent(options.message);
      if (!validation.valid) {
        return {
          success: false,
          error: {
            code: 400,
            message: validation.error || 'Invalid message content',
          },
        };
      }

      const payload: SendMessageRequest = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: formatPhoneNumber(options.to),
        type: 'text',
        text: {
          body: options.message,
          preview_url: options.previewUrl || false,
        },
      };

      // Add context if replying to a message
      if (options.replyToMessageId) {
        payload.context = {
          message_id: options.replyToMessageId,
        };
      }

      const response = await this.client.post<SendMessageResponse>(
        `/${this.config.phoneNumberId}/messages`,
        payload
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('[WhatsApp Client] Send text message error:', error);
      return {
        success: false,
        error: this.formatError(error),
      };
    }
  }

  /**
   * Send an image message
   */
  async sendImageMessage(options: SendMediaMessageOptions): Promise<ApiResponse<SendMessageResponse>> {
    return this.sendMediaMessage({ ...options, type: 'image' });
  }

  /**
   * Send a video message
   */
  async sendVideoMessage(options: SendMediaMessageOptions): Promise<ApiResponse<SendMessageResponse>> {
    return this.sendMediaMessage({ ...options, type: 'video' });
  }

  /**
   * Send a document message
   */
  async sendDocumentMessage(options: SendMediaMessageOptions): Promise<ApiResponse<SendMessageResponse>> {
    return this.sendMediaMessage({ ...options, type: 'document' });
  }

  /**
   * Send an audio message
   */
  async sendAudioMessage(options: SendMediaMessageOptions): Promise<ApiResponse<SendMessageResponse>> {
    return this.sendMediaMessage({ ...options, type: 'audio' });
  }

  /**
   * Generic method to send media messages
   */
  private async sendMediaMessage(
    options: SendMediaMessageOptions & { type: 'image' | 'video' | 'document' | 'audio' }
  ): Promise<ApiResponse<SendMessageResponse>> {
    try {
      // Validate inputs
      if (!isValidPhoneNumber(options.to)) {
        return {
          success: false,
          error: {
            code: 400,
            message: 'Invalid phone number format',
          },
        };
      }

      if (!options.mediaUrl && !options.mediaId) {
        return {
          success: false,
          error: {
            code: 400,
            message: 'Either mediaUrl or mediaId must be provided',
          },
        };
      }

      if (options.mediaUrl && !isValidUrl(options.mediaUrl)) {
        return {
          success: false,
          error: {
            code: 400,
            message: 'Invalid media URL format',
          },
        };
      }

      const mediaObject: any = {};
      if (options.mediaUrl) {
        mediaObject.link = options.mediaUrl;
      } else if (options.mediaId) {
        mediaObject.id = options.mediaId;
      }

      if (options.caption) {
        mediaObject.caption = options.caption;
      }

      if (options.filename && options.type === 'document') {
        mediaObject.filename = options.filename;
      }

      const payload: SendMessageRequest = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: formatPhoneNumber(options.to),
        type: options.type,
        [options.type]: mediaObject,
      };

      if (options.replyToMessageId) {
        payload.context = {
          message_id: options.replyToMessageId,
        };
      }

      const response = await this.client.post<SendMessageResponse>(
        `/${this.config.phoneNumberId}/messages`,
        payload
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error(`[WhatsApp Client] Send ${options.type} message error:`, error);
      return {
        success: false,
        error: this.formatError(error),
      };
    }
  }

  /**
   * Send a template message
   */
  async sendTemplateMessage(options: SendTemplateMessageOptions): Promise<ApiResponse<SendMessageResponse>> {
    try {
      if (!isValidPhoneNumber(options.to)) {
        return {
          success: false,
          error: {
            code: 400,
            message: 'Invalid phone number format',
          },
        };
      }

      const payload: SendMessageRequest = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: formatPhoneNumber(options.to),
        type: 'template',
        template: {
          name: options.templateName,
          language: {
            code: options.languageCode,
          },
          components: options.components,
        },
      };

      const response = await this.client.post<SendMessageResponse>(
        `/${this.config.phoneNumberId}/messages`,
        payload
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('[WhatsApp Client] Send template message error:', error);
      return {
        success: false,
        error: this.formatError(error),
      };
    }
  }

  /**
   * Send a location message
   */
  async sendLocationMessage(options: SendLocationMessageOptions): Promise<ApiResponse<SendMessageResponse>> {
    try {
      if (!isValidPhoneNumber(options.to)) {
        return {
          success: false,
          error: {
            code: 400,
            message: 'Invalid phone number format',
          },
        };
      }

      if (!isValidCoordinates(options.latitude, options.longitude)) {
        return {
          success: false,
          error: {
            code: 400,
            message: 'Invalid coordinates',
          },
        };
      }

      const payload: SendMessageRequest = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: formatPhoneNumber(options.to),
        type: 'location',
        location: {
          latitude: options.latitude,
          longitude: options.longitude,
          name: options.name,
          address: options.address,
        },
      };

      const response = await this.client.post<SendMessageResponse>(
        `/${this.config.phoneNumberId}/messages`,
        payload
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('[WhatsApp Client] Send location message error:', error);
      return {
        success: false,
        error: this.formatError(error),
      };
    }
  }

  /**
   * Mark a message as read
   */
  async markAsRead(options: MarkMessageAsReadOptions): Promise<ApiResponse<void>> {
    try {
      await this.client.post(`/${this.config.phoneNumberId}/messages`, {
        messaging_product: 'whatsapp',
        status: 'read',
        message_id: options.messageId,
      });

      return { success: true };
    } catch (error) {
      console.error('[WhatsApp Client] Mark as read error:', error);
      return {
        success: false,
        error: this.formatError(error),
      };
    }
  }

  /**
   * Get media URL from media ID
   */
  async getMediaUrl(options: GetMediaUrlOptions): Promise<ApiResponse<string>> {
    try {
      const response = await this.client.get(`/${options.mediaId}`);
      return {
        success: true,
        data: response.data.url,
      };
    } catch (error) {
      console.error('[WhatsApp Client] Get media URL error:', error);
      return {
        success: false,
        error: this.formatError(error),
      };
    }
  }

  /**
   * Download media file
   */
  async downloadMedia(mediaUrl: string): Promise<ApiResponse<Buffer>> {
    try {
      const response = await axios.get(mediaUrl, {
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`,
        },
        responseType: 'arraybuffer',
      });

      return {
        success: true,
        data: Buffer.from(response.data),
      };
    } catch (error) {
      console.error('[WhatsApp Client] Download media error:', error);
      return {
        success: false,
        error: this.formatError(error),
      };
    }
  }

  /**
   * Handle API errors
   */
  private handleApiError(error: AxiosError): Error {
    if (error.response) {
      const data: any = error.response.data;
      const errorMessage = data?.error?.message || 'API request failed';
      const errorCode = data?.error?.code || error.response.status;

      console.error('[WhatsApp API Error]', {
        code: errorCode,
        message: errorMessage,
        details: data?.error,
      });

      return new Error(`WhatsApp API Error (${errorCode}): ${errorMessage}`);
    } else if (error.request) {
      console.error('[WhatsApp Request Error] No response received');
      return new Error('No response received from WhatsApp API');
    } else {
      console.error('[WhatsApp Error]', error.message);
      return new Error(`WhatsApp request failed: ${error.message}`);
    }
  }

  /**
   * Format error for API response
   */
  private formatError(error: any): { code: number; message: string; details?: any; isTokenExpired?: boolean } {
    if (axios.isAxiosError(error)) {
      const data: any = error.response?.data;
      const errorCode = data?.error?.code || error.response?.status || 500;
      const isTokenExpired = errorCode === 190 || 
                            (data?.error?.message?.includes('expired') || 
                             data?.error?.message?.includes('Session has expired'));

      return {
        code: errorCode,
        message: data?.error?.message || error.message,
        details: data?.error,
        isTokenExpired,
      };
    }

    return {
      code: 500,
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      isTokenExpired: false,
    };
  }
}

/**
 * Create a WhatsApp client instance
 */
export function createWhatsAppClient(config?: Partial<WhatsAppConfig>): WhatsAppClient {
  const defaultConfig: WhatsAppConfig = {
    phoneNumberId:
      process.env.WHATSAPP_PHONE_NUMBER_ID ?? "947502885103297",
    accessToken:
      process.env.WHATSAPP_ACCESS_TOKEN ??
      "EAAZA6hb3eKzIBQIKq8Wrdx2Lg87jEkvL4foV3OjpnoLZBFnCtG2yaaFZCNUzXmEOB7iB4ZBPW1FYtT3xE4oZCnZBuHxOR6vGnXTnBL8zt4UxqHOnwCrPGGySDmJzMejbbnydApFr31k9xPJVmlZAx7LLo28DZBZCubidxHfJ0RllnX8YdQAun6Xj5kAuFVGRoYykvDLhhJVoq3h9JHjt4CmxVP3EIxE95lNVetZCoGhZCSCqaChTsRZCYB60ovIjo7MHaKjaYOoWAIr27YokPZC49tZCs6AQZDZD",
    apiVersion: process.env.WHATSAPP_API_VERSION ?? "v18.0",
    webhookVerifyToken:
      process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN ??
      "whatsapp_verify_123",
    businessAccountId:
      process.env.WHATSAPP_BUSINESS_ACCOUNT_ID ??
      "1203289797803197",
  };

  const mergedConfig = { ...defaultConfig, ...config };

  if (!mergedConfig.phoneNumberId || !mergedConfig.accessToken) {
    throw new Error(
      'WhatsApp configuration incomplete. Please set WHATSAPP_PHONE_NUMBER_ID and WHATSAPP_ACCESS_TOKEN.'
    );
  }

  return new WhatsAppClient(mergedConfig);
}



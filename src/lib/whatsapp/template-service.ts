/**
 * WhatsApp Template Service
 * Manages message templates for WhatsApp Business API
 * @module whatsapp/template-service
 */

import { PrismaClient } from '@prisma/client';
import type {
  TemplateCategory,
  TemplateStatus,
  TemplateComponent,
} from './types';

const prisma = new PrismaClient();

export class WhatsAppTemplateService {
  /**
   * Get predefined template for property inquiry
   */
  static getPropertyInquiryTemplate(
    propertyName: string,
    propertyPrice: string,
    propertyUrl: string,
    locale: string = 'fr'
  ): { name: string; components: TemplateComponent[] } {
    const templates = {
      fr: {
        name: 'property_inquiry_response',
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: propertyName },
              { type: 'text', text: propertyPrice },
              { type: 'text', text: propertyUrl },
            ],
          },
        ] as TemplateComponent[],
      },
      en: {
        name: 'property_inquiry_response_en',
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: propertyName },
              { type: 'text', text: propertyPrice },
              { type: 'text', text: propertyUrl },
            ],
          },
        ] as TemplateComponent[],
      },
    };

    return templates[locale as keyof typeof templates] || templates.fr;
  }

  /**
   * Get appointment confirmation template
   */
  static getAppointmentConfirmationTemplate(
    userName: string,
    appointmentDate: string,
    appointmentTime: string,
    propertyName: string,
    locale: string = 'fr'
  ): { name: string; components: TemplateComponent[] } {
    const templates = {
      fr: {
        name: 'appointment_confirmation',
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: userName },
              { type: 'text', text: appointmentDate },
              { type: 'text', text: appointmentTime },
              { type: 'text', text: propertyName },
            ],
          },
        ] as TemplateComponent[],
      },
      en: {
        name: 'appointment_confirmation_en',
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: userName },
              { type: 'text', text: appointmentDate },
              { type: 'text', text: appointmentTime },
              { type: 'text', text: propertyName },
            ],
          },
        ] as TemplateComponent[],
      },
    };

    return templates[locale as keyof typeof templates] || templates.fr;
  }

  /**
   * Get payment confirmation template
   */
  static getPaymentConfirmationTemplate(
    userName: string,
    amount: string,
    subscriptionPlan: string,
    locale: string = 'fr'
  ): { name: string; components: TemplateComponent[] } {
    const templates = {
      fr: {
        name: 'payment_confirmation',
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: userName },
              { type: 'text', text: amount },
              { type: 'text', text: subscriptionPlan },
            ],
          },
        ] as TemplateComponent[],
      },
      en: {
        name: 'payment_confirmation_en',
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: userName },
              { type: 'text', text: amount },
              { type: 'text', text: subscriptionPlan },
            ],
          },
        ] as TemplateComponent[],
      },
    };

    return templates[locale as keyof typeof templates] || templates.fr;
  }

  /**
   * Get new property alert template
   */
  static getNewPropertyAlertTemplate(
    propertyName: string,
    propertyLocation: string,
    propertyPrice: string,
    propertyUrl: string,
    locale: string = 'fr'
  ): { name: string; components: TemplateComponent[] } {
    const templates = {
      fr: {
        name: 'new_property_alert',
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: propertyName },
              { type: 'text', text: propertyLocation },
              { type: 'text', text: propertyPrice },
              { type: 'text', text: propertyUrl },
            ],
          },
        ] as TemplateComponent[],
      },
      en: {
        name: 'new_property_alert_en',
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: propertyName },
              { type: 'text', text: propertyLocation },
              { type: 'text', text: propertyPrice },
              { type: 'text', text: propertyUrl },
            ],
          },
        ] as TemplateComponent[],
      },
    };

    return templates[locale as keyof typeof templates] || templates.fr;
  }

  /**
   * Create template in database
   */
  static async createTemplate(data: {
    accountId: string;
    name: string;
    category: TemplateCategory;
    language: string;
    headerType?: string;
    headerContent?: string;
    bodyText: string;
    footerText?: string;
    variables?: any;
  }) {
    try {
      const template = await prisma.whatsAppTemplate.create({
        data: {
          ...data,
          status: 'PENDING' as TemplateStatus,
        },
      });

      return {
        success: true,
        data: template,
      };
    } catch (error) {
      console.error('[Template Service] Create template error:', error);
      return {
        success: false,
        error: {
          code: 500,
          message: error instanceof Error ? error.message : 'Failed to create template',
        },
      };
    }
  }

  /**
   * Get template by name and language
   */
  static async getTemplate(accountId: string, name: string, language: string) {
    try {
      const template = await prisma.whatsAppTemplate.findFirst({
        where: {
          accountId,
          name,
          language,
        },
      });

      if (!template) {
        return {
          success: false,
          error: {
            code: 404,
            message: 'Template not found',
          },
        };
      }

      return {
        success: true,
        data: template,
      };
    } catch (error) {
      console.error('[Template Service] Get template error:', error);
      return {
        success: false,
        error: {
          code: 500,
          message: error instanceof Error ? error.message : 'Failed to get template',
        },
      };
    }
  }

  /**
   * List all templates for an account
   */
  static async listTemplates(
    accountId: string,
    filters?: {
      status?: TemplateStatus;
      category?: TemplateCategory;
      language?: string;
    }
  ) {
    try {
      const where: any = { accountId };

      if (filters?.status) {
        where.status = filters.status;
      }
      if (filters?.category) {
        where.category = filters.category;
      }
      if (filters?.language) {
        where.language = filters.language;
      }

      const templates = await prisma.whatsAppTemplate.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
      });

      return {
        success: true,
        data: templates,
      };
    } catch (error) {
      console.error('[Template Service] List templates error:', error);
      return {
        success: false,
        error: {
          code: 500,
          message: error instanceof Error ? error.message : 'Failed to list templates',
        },
      };
    }
  }

  /**
   * Update template status
   */
  static async updateTemplateStatus(
    templateId: string,
    status: TemplateStatus,
    waTemplateId?: string
  ) {
    try {
      const template = await prisma.whatsAppTemplate.update({
        where: { id: templateId },
        data: {
          status,
          waTemplateId,
        },
      });

      return {
        success: true,
        data: template,
      };
    } catch (error) {
      console.error('[Template Service] Update template status error:', error);
      return {
        success: false,
        error: {
          code: 500,
          message: error instanceof Error ? error.message : 'Failed to update template',
        },
      };
    }
  }

  /**
   * Delete template
   */
  static async deleteTemplate(templateId: string) {
    try {
      await prisma.whatsAppTemplate.delete({
        where: { id: templateId },
      });

      return {
        success: true,
      };
    } catch (error) {
      console.error('[Template Service] Delete template error:', error);
      return {
        success: false,
        error: {
          code: 500,
          message: error instanceof Error ? error.message : 'Failed to delete template',
        },
      };
    }
  }

  /**
   * Get template usage statistics
   */
  static async getTemplateStats(accountId: string) {
    try {
      const stats = await prisma.whatsAppTemplate.groupBy({
        by: ['status', 'category'],
        where: { accountId },
        _count: {
          id: true,
        },
        _sum: {
          sentCount: true,
        },
      });

      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      console.error('[Template Service] Get template stats error:', error);
      return {
        success: false,
        error: {
          code: 500,
          message: error instanceof Error ? error.message : 'Failed to get template stats',
        },
      };
    }
  }
}

/**
 * Template body examples for common use cases
 */
export const TEMPLATE_EXAMPLES = {
  propertyInquiry: {
    fr: {
      name: 'property_inquiry_response',
      body: 'Bonjour! Merci de votre intérêt pour {{1}}. Prix: {{2}}. Pour plus d\'informations, visitez: {{3}}',
      variables: ['Nom de la propriété', 'Prix', 'URL'],
    },
    en: {
      name: 'property_inquiry_response_en',
      body: 'Hello! Thank you for your interest in {{1}}. Price: {{2}}. For more information, visit: {{3}}',
      variables: ['Property Name', 'Price', 'URL'],
    },
  },
  appointmentConfirmation: {
    fr: {
      name: 'appointment_confirmation',
      body: 'Bonjour {{1}}, votre rendez-vous est confirmé pour le {{2}} à {{3}} pour visiter {{4}}. Nous avons hâte de vous voir!',
      variables: ['Nom', 'Date', 'Heure', 'Propriété'],
    },
    en: {
      name: 'appointment_confirmation_en',
      body: 'Hello {{1}}, your appointment is confirmed for {{2}} at {{3}} to visit {{4}}. Looking forward to seeing you!',
      variables: ['Name', 'Date', 'Time', 'Property'],
    },
  },
  paymentConfirmation: {
    fr: {
      name: 'payment_confirmation',
      body: 'Bonjour {{1}}, nous avons bien reçu votre paiement de {{2}} pour le plan {{3}}. Merci pour votre confiance!',
      variables: ['Nom', 'Montant', 'Plan'],
    },
    en: {
      name: 'payment_confirmation_en',
      body: 'Hello {{1}}, we have received your payment of {{2}} for the {{3}} plan. Thank you for your trust!',
      variables: ['Name', 'Amount', 'Plan'],
    },
  },
  newPropertyAlert: {
    fr: {
      name: 'new_property_alert',
      body: 'Nouvelle propriété disponible! {{1}} à {{2}} pour {{3}}. Découvrez-la ici: {{4}}',
      variables: ['Nom', 'Localisation', 'Prix', 'URL'],
    },
    en: {
      name: 'new_property_alert_en',
      body: 'New property available! {{1}} in {{2}} for {{3}}. Check it out here: {{4}}',
      variables: ['Name', 'Location', 'Price', 'URL'],
    },
  },
};

export default WhatsAppTemplateService;



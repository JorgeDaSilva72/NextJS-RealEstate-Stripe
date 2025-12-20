/**
 * WhatsApp Notification Service
 * Handles automated notifications for appointments, payments, etc.
 * @module whatsapp/notifications
 */

import { PrismaClient } from '@prisma/client';
import { createMessageService } from './message-service';
import { WhatsAppTemplateService } from './template-service';
import { formatPhoneNumber } from './validators';
import moment from 'moment-timezone';

const prisma = new PrismaClient();

export class WhatsAppNotificationService {
  private accountId: string;
  private messageService: ReturnType<typeof createMessageService>;

  constructor(accountId: string) {
    this.accountId = accountId;
    this.messageService = createMessageService(accountId);
  }

  /**
   * Send appointment confirmation notification
   */
  async sendAppointmentConfirmation(appointmentId: number, locale: string = 'fr') {
    try {
      // Get appointment with related data
      const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId },
        include: {
          user: true,
          property: {
            include: {
              contact: true,
              location: true,
            },
          },
        },
      });

      if (!appointment) {
        throw new Error('Appointment not found');
      }

      // Check if user has phone number (assume it's in contact or user profile)
      const userPhone = appointment.user.email; // TODO: Add phone field to User model
      if (!userPhone) {
        console.warn('User phone number not available');
        return { success: false, error: 'No phone number available' };
      }

      // Format appointment details
      const appointmentDate = moment(appointment.start).format('DD/MM/YYYY');
      const appointmentTime = moment(appointment.start).format('HH:mm');
      const userName = `${appointment.user.firstname || ''} ${appointment.user.lastname || ''}`.trim();
      const propertyName = typeof appointment.property.name === 'string' 
        ? appointment.property.name 
        : JSON.stringify(appointment.property.name);

      // Get conversation
      const conversationId = await this.messageService.getOrCreateConversation(
        userPhone,
        appointment.propertyId
      );

      // Build message based on locale
      const messages = {
        fr: `Bonjour ${userName},\n\n✅ Votre rendez-vous est confirmé!\n\n📅 Date: ${appointmentDate}\n🕐 Heure: ${appointmentTime}\n🏠 Propriété: ${propertyName}\n\nNous avons hâte de vous voir!\n\n📍 Adresse: ${appointment.property.location?.streetAddress || 'À confirmer'}`,
        en: `Hello ${userName},\n\n✅ Your appointment is confirmed!\n\n📅 Date: ${appointmentDate}\n🕐 Time: ${appointmentTime}\n🏠 Property: ${propertyName}\n\nLooking forward to seeing you!\n\n📍 Address: ${appointment.property.location?.streetAddress || 'To be confirmed'}`,
      };

      const message = messages[locale as keyof typeof messages] || messages.fr;

      // Send notification
      const result = await this.messageService.sendText(conversationId, {
        to: userPhone,
        message,
      });

      if (result.success) {
        console.log(`[Notifications] Appointment confirmation sent: ${appointmentId}`);
      }

      return result;
    } catch (error) {
      console.error('[Notifications] Send appointment confirmation error:', error);
      return {
        success: false,
        error: {
          code: 500,
          message: error instanceof Error ? error.message : 'Failed to send notification',
        },
      };
    }
  }

  /**
   * Send payment confirmation notification
   */
  async sendPaymentConfirmation(
    subscriptionId: number,
    locale: string = 'fr'
  ) {
    try {
      // Get subscription with related data
      const subscription = await prisma.subscriptions.findUnique({
        where: { id: subscriptionId },
        include: {
          user: true,
          plan: true,
        },
      });

      if (!subscription) {
        throw new Error('Subscription not found');
      }

      const userPhone = subscription.user.email; // TODO: Add phone field
      if (!userPhone) {
        console.warn('User phone number not available');
        return { success: false, error: 'No phone number available' };
      }

      const userName = `${subscription.user.firstname || ''} ${subscription.user.lastname || ''}`.trim();
      const amount = `${subscription.plan.price}`;
      const planName = subscription.plan.namePlan;

      // Get conversation
      const conversationId = await this.messageService.getOrCreateConversation(userPhone);

      // Build message
      const messages = {
        fr: `Bonjour ${userName},\n\n✅ Paiement confirmé!\n\n💰 Montant: ${amount}\n📦 Plan: ${planName}\n\nMerci pour votre confiance! Votre compte est maintenant actif.\n\nID de transaction: ${subscription.paymentID}`,
        en: `Hello ${userName},\n\n✅ Payment confirmed!\n\n💰 Amount: ${amount}\n📦 Plan: ${planName}\n\nThank you for your trust! Your account is now active.\n\nTransaction ID: ${subscription.paymentID}`,
      };

      const message = messages[locale as keyof typeof messages] || messages.fr;

      // Send notification
      const result = await this.messageService.sendText(conversationId, {
        to: userPhone,
        message,
      });

      if (result.success) {
        console.log(`[Notifications] Payment confirmation sent: ${subscriptionId}`);
      }

      return result;
    } catch (error) {
      console.error('[Notifications] Send payment confirmation error:', error);
      return {
        success: false,
        error: {
          code: 500,
          message: error instanceof Error ? error.message : 'Failed to send notification',
        },
      };
    }
  }

  /**
   * Send new property alert
   */
  async sendNewPropertyAlert(
    propertyId: number,
    recipientPhone: string,
    locale: string = 'fr'
  ) {
    try {
      // Get property with related data
      const property = await prisma.property.findUnique({
        where: { id: propertyId },
        include: {
          location: true,
          type: {
            include: {
              translations: true,
            },
          },
          images: {
            take: 1,
            where: { isMain: true },
          },
        },
      });

      if (!property) {
        throw new Error('Property not found');
      }

      const propertyName = typeof property.name === 'string'
        ? property.name
        : JSON.stringify(property.name);
      
      const propertyLocation = property.location?.streetAddress || 'Non spécifié';
      const propertyPrice = `${property.price} ${property.currency}`;
      const propertyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/property/${property.id}`;

      // Get conversation
      const conversationId = await this.messageService.getOrCreateConversation(
        recipientPhone,
        property.id
      );

      // Build message
      const messages = {
        fr: `🏠 Nouvelle propriété disponible!\n\n📍 ${propertyName}\n🗺️ Localisation: ${propertyLocation}\n💰 Prix: ${propertyPrice}\n\n✨ Découvrez cette opportunité maintenant:\n${propertyUrl}`,
        en: `🏠 New property available!\n\n📍 ${propertyName}\n🗺️ Location: ${propertyLocation}\n💰 Price: ${propertyPrice}\n\n✨ Check out this opportunity now:\n${propertyUrl}`,
      };

      const message = messages[locale as keyof typeof messages] || messages.fr;

      // Send notification
      const result = await this.messageService.sendText(conversationId, {
        to: recipientPhone,
        message,
        previewUrl: true,
      });

      if (result.success) {
        console.log(`[Notifications] Property alert sent: ${propertyId}`);
      }

      return result;
    } catch (error) {
      console.error('[Notifications] Send property alert error:', error);
      return {
        success: false,
        error: {
          code: 500,
          message: error instanceof Error ? error.message : 'Failed to send notification',
        },
      };
    }
  }

  /**
   * Send subscription expiry reminder
   */
  async sendSubscriptionExpiryReminder(
    subscriptionId: number,
    daysLeft: number,
    locale: string = 'fr'
  ) {
    try {
      const subscription = await prisma.subscriptions.findUnique({
        where: { id: subscriptionId },
        include: {
          user: true,
          plan: true,
        },
      });

      if (!subscription) {
        throw new Error('Subscription not found');
      }

      const userPhone = subscription.user.email; // TODO: Add phone field
      if (!userPhone) {
        return { success: false, error: 'No phone number available' };
      }

      const userName = `${subscription.user.firstname || ''} ${subscription.user.lastname || ''}`.trim();
      const planName = subscription.plan.namePlan;
      const expiryDate = moment(subscription.endDate).format('DD/MM/YYYY');

      // Get conversation
      const conversationId = await this.messageService.getOrCreateConversation(userPhone);

      // Build message
      const messages = {
        fr: `⚠️ Rappel d'expiration\n\nBonjour ${userName},\n\nVotre abonnement "${planName}" expire dans ${daysLeft} jour${daysLeft > 1 ? 's' : ''} (${expiryDate}).\n\nRenouvelez maintenant pour continuer à profiter de nos services!`,
        en: `⚠️ Expiry reminder\n\nHello ${userName},\n\nYour "${planName}" subscription expires in ${daysLeft} day${daysLeft > 1 ? 's' : ''} (${expiryDate}).\n\nRenew now to continue enjoying our services!`,
      };

      const message = messages[locale as keyof typeof messages] || messages.fr;

      // Send notification
      const result = await this.messageService.sendText(conversationId, {
        to: userPhone,
        message,
      });

      if (result.success) {
        console.log(`[Notifications] Expiry reminder sent: ${subscriptionId}`);
      }

      return result;
    } catch (error) {
      console.error('[Notifications] Send expiry reminder error:', error);
      return {
        success: false,
        error: {
          code: 500,
          message: error instanceof Error ? error.message : 'Failed to send notification',
        },
      };
    }
  }

  /**
   * Send notification to property owner about new appointment
   */
  async sendOwnerAppointmentNotification(
    appointmentId: number,
    ownerPhone: string,
    locale: string = 'fr'
  ) {
    try {
      const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId },
        include: {
          user: true,
          property: {
            include: {
              location: true,
            },
          },
        },
      });

      if (!appointment) {
        throw new Error('Appointment not found');
      }

      const appointmentDate = moment(appointment.start).format('DD/MM/YYYY');
      const appointmentTime = moment(appointment.start).format('HH:mm');
      const visitorName = `${appointment.user.firstname || ''} ${appointment.user.lastname || ''}`.trim() || 'Un visiteur';
      const propertyName = typeof appointment.property.name === 'string' 
        ? appointment.property.name 
        : JSON.stringify(appointment.property.name);

      // Get or create conversation
      const conversationId = await this.messageService.getOrCreateConversation(
        ownerPhone,
        appointment.propertyId
      );

      // Build message
      const messages = {
        fr: `🔔 Nouveau rendez-vous de visite\n\nBonjour,\n\nVous avez reçu une nouvelle demande de visite:\n\n👤 Visiteur: ${visitorName}\n📅 Date: ${appointmentDate}\n🕐 Heure: ${appointmentTime}\n🏠 Propriété: ${propertyName}\n\nMerci de confirmer ou contacter le visiteur si nécessaire.`,
        en: `🔔 New visit appointment\n\nHello,\n\nYou have received a new visit request:\n\n👤 Visitor: ${visitorName}\n📅 Date: ${appointmentDate}\n🕐 Time: ${appointmentTime}\n🏠 Property: ${propertyName}\n\nPlease confirm or contact the visitor if needed.`,
      };

      const message = messages[locale as keyof typeof messages] || messages.fr;

      // Send notification
      const result = await this.messageService.sendText(conversationId, {
        to: ownerPhone,
        message,
      });

      if (result.success) {
        console.log(`[Notifications] Owner appointment notification sent: ${appointmentId}`);
      }

      return result;
    } catch (error) {
      console.error('[Notifications] Send owner appointment notification error:', error);
      return {
        success: false,
        error: {
          code: 500,
          message: error instanceof Error ? error.message : 'Failed to send notification',
        },
      };
    }
  }

  /**
   * Send appointment reminder (24 hours before)
   */
  async sendAppointmentReminder(appointmentId: number, locale: string = 'fr') {
    try {
      const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId },
        include: {
          user: true,
          property: {
            include: {
              location: true,
            },
          },
        },
      });

      if (!appointment) {
        throw new Error('Appointment not found');
      }

      const userPhone = appointment.user.email; // TODO: Add phone field
      if (!userPhone) {
        return { success: false, error: 'No phone number available' };
      }

      const userName = `${appointment.user.firstname || ''} ${appointment.user.lastname || ''}`.trim();
      const appointmentDate = moment(appointment.start).format('DD/MM/YYYY');
      const appointmentTime = moment(appointment.start).format('HH:mm');
      const propertyName = typeof appointment.property.name === 'string'
        ? appointment.property.name
        : JSON.stringify(appointment.property.name);

      // Get conversation
      const conversationId = await this.messageService.getOrCreateConversation(
        userPhone,
        appointment.propertyId
      );

      // Build message
      const messages = {
        fr: `🔔 Rappel de rendez-vous\n\nBonjour ${userName},\n\nN'oubliez pas votre rendez-vous demain:\n\n📅 ${appointmentDate} à ${appointmentTime}\n🏠 ${propertyName}\n📍 ${appointment.property.location?.streetAddress || 'Adresse à confirmer'}\n\nÀ bientôt!`,
        en: `🔔 Appointment reminder\n\nHello ${userName},\n\nDon't forget your appointment tomorrow:\n\n📅 ${appointmentDate} at ${appointmentTime}\n🏠 ${propertyName}\n📍 ${appointment.property.location?.streetAddress || 'Address to be confirmed'}\n\nSee you soon!`,
      };

      const message = messages[locale as keyof typeof messages] || messages.fr;

      // Send notification
      const result = await this.messageService.sendText(conversationId, {
        to: userPhone,
        message,
      });

      if (result.success) {
        console.log(`[Notifications] Appointment reminder sent: ${appointmentId}`);
      }

      return result;
    } catch (error) {
      console.error('[Notifications] Send appointment reminder error:', error);
      return {
        success: false,
        error: {
          code: 500,
          message: error instanceof Error ? error.message : 'Failed to send notification',
        },
      };
    }
  }
}

/**
 * Create notification service instance
 */
export function createNotificationService(accountId: string): WhatsAppNotificationService {
  return new WhatsAppNotificationService(accountId);
}



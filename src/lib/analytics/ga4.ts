/**
 * Google Analytics 4 (GA4) Event Tracking Utility
 * Tracks custom events for WhatsApp interactions
 */

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
    dataLayer?: any[];
  }
}

/**
 * Track WhatsApp contact event
 * @param sourceUrl - The URL where the click originated
 * @param propertyId - Optional property ID if clicking from property page
 * @param propertyName - Optional property name
 */
export const trackWhatsAppContact = (
  sourceUrl: string,
  propertyId?: number,
  propertyName?: string
) => {
  if (typeof window === 'undefined' || !window.gtag) {
    console.warn('GA4 gtag not available');
    return;
  }

  try {
    window.gtag('event', 'contact_whatsapp', {
      source_url: sourceUrl,
      property_id: propertyId || null,
      property_name: propertyName || null,
      event_category: 'WhatsApp',
      event_label: propertyId ? `Property ${propertyId}` : 'General Contact',
    });

    console.log('GA4 Event tracked: contact_whatsapp', {
      source_url: sourceUrl,
      property_id: propertyId,
      property_name: propertyName,
    });
  } catch (error) {
    console.error('Error tracking GA4 event:', error);
  }
};

/**
 * Track WhatsApp button click with additional context
 */
export const trackWhatsAppClick = (params: {
  sourceUrl: string;
  buttonType: 'floating' | 'contact_agent' | 'quick_action' | 'other';
  propertyId?: number;
  propertyName?: string;
  phoneNumber?: string;
}) => {
  if (typeof window === 'undefined' || !window.gtag) {
    console.warn('GA4 gtag not available');
    return;
  }

  try {
    window.gtag('event', 'contact_whatsapp', {
      source_url: params.sourceUrl,
      button_type: params.buttonType,
      property_id: params.propertyId || null,
      property_name: params.propertyName || null,
      phone_number: params.phoneNumber ? 'provided' : 'not_provided', // Don't track actual phone numbers for privacy
      event_category: 'WhatsApp',
      event_label: params.buttonType,
    });

    console.log('GA4 Event tracked: contact_whatsapp', params);
  } catch (error) {
    console.error('Error tracking GA4 event:', error);
  }
};













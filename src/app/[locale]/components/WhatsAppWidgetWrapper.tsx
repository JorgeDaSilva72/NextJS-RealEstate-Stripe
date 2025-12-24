/**
 * WhatsApp Widget Wrapper (Client Component)
 * Wraps the WhatsApp floating widget for use in Server Components
 */

'use client';

import React from 'react';
import WhatsAppFloatingWidget from './WhatsAppFloatingWidget';
import prisma from '@/lib/prisma';

// Note: This will fetch phone number from environment or API
const WhatsAppWidgetWrapper: React.FC = () => {
  // Get WhatsApp phone number from environment or API
  // For now, using hardcoded fallback
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER || undefined;

  if (!phoneNumber) {
    return null;
  }

  return (
    <WhatsAppFloatingWidget
      phoneNumber={phoneNumber}
      companyName="Afrique Avenir Immobilier"
      greeting="Besoin d'aide? Contactez-nous!"
      position="bottom-right"
      showAfter={5000}
    />
  );
};

export default WhatsAppWidgetWrapper;















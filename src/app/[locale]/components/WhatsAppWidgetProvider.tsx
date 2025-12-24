/**
 * WhatsApp Widget Provider (Server Component)
 * Fetches WhatsApp account info and provides to client widget
 */

import React from 'react';
import prisma from '@/lib/prisma';
import WhatsAppFloatingWidgetClient from './WhatsAppFloatingWidgetClient';

const WhatsAppWidgetProvider: React.FC = async () => {
  try {
    // Get active WhatsApp account
    const account = await prisma.whatsAppAccount.findFirst({
      where: { isActive: true },
      select: {
        phoneNumber: true,
        displayName: true,
      },
    });

    if (!account) {
      return null;
    }

    return (
      <WhatsAppFloatingWidgetClient
        phoneNumber={account.phoneNumber}
        companyName={account.displayName || 'Support'}
      />
    );
  } catch (error) {
    console.error('Error loading WhatsApp account:', error);
    return null;
  }
};

export default WhatsAppWidgetProvider;















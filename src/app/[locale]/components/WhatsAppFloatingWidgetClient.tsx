/**
 * WhatsApp Floating Widget Client Component
 * Client-side wrapper for the floating widget
 */

'use client';

import React from 'react';
import WhatsAppFloatingWidget from './WhatsAppFloatingWidget';

interface WhatsAppFloatingWidgetClientProps {
  phoneNumber: string;
  companyName?: string;
}

const WhatsAppFloatingWidgetClient: React.FC<WhatsAppFloatingWidgetClientProps> = ({
  phoneNumber,
  companyName,
}) => {
  return (
    <WhatsAppFloatingWidget
      phoneNumber={phoneNumber}
      companyName={companyName}
      position="bottom-right"
      showAfter={5000}
    />
  );
};

export default WhatsAppFloatingWidgetClient;















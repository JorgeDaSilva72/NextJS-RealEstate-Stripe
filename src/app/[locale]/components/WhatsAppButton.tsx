/**
 * WhatsApp Contact Button Component
 * Allows users to contact property owners via WhatsApp
 */

'use client';

import React, { useState } from 'react';
import { BsWhatsapp } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { formatPhoneNumber } from '@/lib/whatsapp/validators';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  propertyId?: number;
  propertyName?: string;
  propertyPrice?: string;
  propertyUrl?: string;
  message?: string;
  variant?: 'button' | 'icon' | 'link';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber,
  propertyId,
  propertyName,
  propertyPrice,
  propertyUrl,
  message,
  variant = 'button',
  size = 'md',
  className = '',
  disabled = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  /**
   * Handle WhatsApp contact
   */
  const handleWhatsAppContact = async () => {
    try {
      setIsLoading(true);

      // If phone number is provided, open WhatsApp directly
      if (phoneNumber) {
        const formattedPhone = formatPhoneNumber(phoneNumber);
        let whatsappMessage = message;

        // Create default message if not provided
        if (!whatsappMessage && propertyName) {
          whatsappMessage = `Bonjour! Je suis intéressé(e) par cette propriété: ${propertyName}`;
          if (propertyPrice) {
            whatsappMessage += ` (${propertyPrice})`;
          }
          if (propertyUrl) {
            whatsappMessage += `\n\n${propertyUrl}`;
          }
        }

        const encodedMessage = encodeURIComponent(whatsappMessage || 'Bonjour!');
        const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;

        // Open WhatsApp in new tab
        window.open(whatsappUrl, '_blank');

        // Log the interaction (optional)
        await fetch('/api/whatsapp/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: phoneNumber,
            message: whatsappMessage || 'User initiated contact',
            type: 'text',
            propertyId,
          }),
        }).catch((error) => {
          console.error('Failed to log WhatsApp interaction:', error);
        });

        toast.success('Ouverture de WhatsApp...');
      } else {
        toast.error('Numéro WhatsApp non disponible');
      }
    } catch (error) {
      console.error('WhatsApp contact error:', error);
      toast.error('Erreur lors de l\'ouverture de WhatsApp');
    } finally {
      setIsLoading(false);
    }
  };

  // Render based on variant
  if (variant === 'icon') {
    return (
      <button
        onClick={handleWhatsAppContact}
        disabled={disabled || isLoading || !phoneNumber}
        className={`
          inline-flex items-center justify-center
          rounded-full bg-green-500 hover:bg-green-600
          text-white transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          ${sizeClasses[size]}
          ${className}
        `}
        title="Contacter via WhatsApp"
      >
        <BsWhatsapp size={iconSizes[size]} />
      </button>
    );
  }

  if (variant === 'link') {
    return (
      <button
        onClick={handleWhatsAppContact}
        disabled={disabled || isLoading || !phoneNumber}
        className={`
          inline-flex items-center gap-2
          text-green-600 hover:text-green-700
          font-medium transition-colors duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
      >
        <BsWhatsapp size={iconSizes[size]} />
        <span>WhatsApp</span>
      </button>
    );
  }

  // Default button variant
  return (
    <button
      onClick={handleWhatsAppContact}
      disabled={disabled || isLoading || !phoneNumber}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-lg bg-green-500 hover:bg-green-600
        text-white font-medium
        transition-all duration-200
        shadow-md hover:shadow-lg
        disabled:opacity-50 disabled:cursor-not-allowed
        disabled:hover:bg-green-500 disabled:hover:shadow-md
        ${sizeClasses[size]}
        ${className}
      `}
    >
      <BsWhatsapp size={iconSizes[size]} />
      <span>{isLoading ? 'Chargement...' : 'Contacter par WhatsApp'}</span>
    </button>
  );
};

export default WhatsAppButton;



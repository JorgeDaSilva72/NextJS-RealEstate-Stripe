/**
 * Enhanced WhatsApp Contact Button
 * Uses WhatsApp Business API to send messages directly from the app
 */

'use client';

import React, { useState } from 'react';
import { BsWhatsapp } from 'react-icons/bs';
import { Button, Checkbox } from '@nextui-org/react';
import { toast } from 'react-toastify';
import { useTranslations } from 'next-intl';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { trackWhatsAppClick } from '@/lib/analytics/ga4';
import { usePathname } from 'next/navigation';

interface WhatsAppContactButtonProps {
  phoneNumber?: string;
  propertyId?: number;
  propertyName?: string | any; // Can be multilingual object or string
  propertyPrice?: string;
  propertyUrl?: string;
  message?: string;
  variant?: 'button' | 'icon' | 'link' | 'floating';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  useBusinessAPI?: boolean; // Use WhatsApp Business API instead of wa.me link
  buttonType?: 'floating' | 'contact_agent' | 'quick_action' | 'other'; // For GA4 tracking
  requireGDPRConsent?: boolean; // Show GDPR consent checkbox
}

const WhatsAppContactButton: React.FC<WhatsAppContactButtonProps> = ({
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
  useBusinessAPI = true,
  buttonType = 'other',
  requireGDPRConsent = false,
}) => {
  const t = useTranslations('WhatsApp');
  const { isAuthenticated, user } = useKindeBrowserClient();
  const [isLoading, setIsLoading] = useState(false);
  const [gdprConsent, setGdprConsent] = useState(false);
  const pathname = usePathname();
  
  // Helper to extract text from multilingual property name
  const getPropertyNameText = (): string => {
    if (!propertyName) return '';
    if (typeof propertyName === 'string') return propertyName;
    if (typeof propertyName === 'object') {
      // Try to get French value first, then any available value
      return propertyName.fr || propertyName.en || propertyName.ar || propertyName.pt || '';
    }
    return String(propertyName);
  };

  /**
   * Send message via WhatsApp Business API
   */
  const sendViaBusinessAPI = async (to: string, text: string) => {
    try {
      const response = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to,
          message: text,
          type: 'text',
          propertyId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Check if token expired
        if (data.error?.isTokenExpired || data.error?.code === 190) {
          return {
            success: false,
            error: {
              ...data.error,
              isTokenExpired: true,
            },
          };
        }
        throw new Error(data.error?.message || 'Failed to send message');
      }

      return data;
    } catch (error: any) {
      console.error('WhatsApp Business API error:', error);
      // Check if it's a token expired error
      if (error?.error?.isTokenExpired || error?.error?.code === 190) {
        return {
          success: false,
          error: {
            ...error.error,
            isTokenExpired: true,
          },
        };
      }
      throw error;
    }
  };

  /**
   * Open WhatsApp web/mobile app
   */
  const openWhatsAppWeb = (phone: string, text: string) => {
    const formattedPhone = phone.replace(/[^0-9]/g, '');
    const encodedMessage = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  /**
   * Handle WhatsApp contact
   */
  const handleContact = async () => {
    if (!phoneNumber) {
      toast.error(t('phoneNumberRequired'));
      return;
    }

    // Check GDPR consent if required
    if (requireGDPRConsent && !gdprConsent) {
      toast.error(t('gdprConsentRequired') || 'Veuillez accepter les conditions de confidentialité');
      return;
    }

    try {
      setIsLoading(true);

      // Track GA4 event
      const sourceUrl = typeof window !== 'undefined' ? window.location.href : pathname || '';
      trackWhatsAppClick({
        sourceUrl,
        buttonType,
        propertyId,
        propertyName: getPropertyNameText(),
        phoneNumber,
      });

      // Build message with dynamic variables (ID_BIEN, TITRE_BIEN)
      let whatsappMessage = message;
      if (!whatsappMessage) {
        const propertyNameText = getPropertyNameText();
        
        // Format message according to requirements: "Hello, I would like information regarding reference [ID_BIEN] ([TITRE_BIEN])."
        if (propertyId && propertyNameText) {
          whatsappMessage = t('contactAgentMessage', {
            propertyId: propertyId.toString(),
            propertyName: propertyNameText,
          }) || `Bonjour, je souhaite des informations concernant la référence ${propertyId} (${propertyNameText}).`;
        } else {
          // Fallback to default message
          whatsappMessage = t('defaultMessage', {
            propertyName: propertyNameText || t('property'),
            price: propertyPrice || '',
            url: propertyUrl || '',
          });
        }
      }

      if (useBusinessAPI && isAuthenticated) {
        // Try to send via Business API first
        try {
          const response = await sendViaBusinessAPI(phoneNumber, whatsappMessage);
          if (response.success) {
            toast.success(t('messageSent'));
            return;
          }
          
          // Check if token expired
          if (response.error?.isTokenExpired || response.error?.code === 190) {
            console.warn('WhatsApp token expired, using wa.me fallback');
            openWhatsAppWeb(phoneNumber, whatsappMessage);
            toast.warning(t('tokenExpiredUsingFallback') || 'Token expiré, ouverture de WhatsApp...');
            return;
          }
          
          throw new Error(response.error?.message || t('errorSending'));
        } catch (apiError: any) {
          // Check if it's a token expired error
          if (apiError?.error?.isTokenExpired || apiError?.error?.code === 190) {
            console.warn('WhatsApp token expired, using wa.me fallback');
            openWhatsAppWeb(phoneNumber, whatsappMessage);
            toast.warning(t('tokenExpiredUsingFallback') || 'Token expiré, ouverture de WhatsApp...');
            return;
          }
          
          // Fallback to wa.me if API fails for other reasons
          console.warn('Business API failed, falling back to wa.me:', apiError);
          openWhatsAppWeb(phoneNumber, whatsappMessage);
          toast.info(t('openingWhatsApp'));
        }
      } else {
        // Use wa.me link (works for everyone)
        openWhatsAppWeb(phoneNumber, whatsappMessage);
        toast.info(t('openingWhatsApp'));
      }
    } catch (error: any) {
      console.error('WhatsApp contact error:', error);
      toast.error(error.message || t('errorSending'));
    } finally {
      setIsLoading(false);
    }
  };

  // Render GDPR consent checkbox if required
  const renderGDPRConsent = () => {
    if (!requireGDPRConsent) return null;
    
    return (
      <Checkbox
        isSelected={gdprConsent}
        onValueChange={setGdprConsent}
        size="sm"
        className="mb-2"
      >
        <span className="text-xs">
          {t('gdprConsentText')}
          {' '}
          <a
            href="/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {t('gdprConsentLink')}
          </a>
        </span>
      </Checkbox>
    );
  };

  // Icon only variant
  if (variant === 'icon') {
    return (
      <div className="space-y-2">
        {renderGDPRConsent()}
        <Button
          isIconOnly
          onClick={handleContact}
          disabled={disabled || isLoading || !phoneNumber || (requireGDPRConsent && !gdprConsent)}
          className={`bg-green-500 hover:bg-green-600 text-white ${className}`}
          size={size}
          title={t('contactViaWhatsApp')}
        >
          <BsWhatsapp size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />
        </Button>
      </div>
    );
  }

  // Link variant
  if (variant === 'link') {
    return (
      <div className="space-y-2">
        {renderGDPRConsent()}
        <Button
          variant="light"
          onClick={handleContact}
          disabled={disabled || isLoading || !phoneNumber || (requireGDPRConsent && !gdprConsent)}
          className={`text-green-600 hover:text-green-700 ${className}`}
          size={size}
          startContent={<BsWhatsapp />}
        >
          {t('whatsApp')}
        </Button>
      </div>
    );
  }

  // Floating variant
  if (variant === 'floating') {
    return (
      <div className="space-y-2">
        {renderGDPRConsent()}
        <button
          onClick={handleContact}
          disabled={disabled || isLoading || !phoneNumber || (requireGDPRConsent && !gdprConsent)}
          className={`
            fixed bottom-6 right-6 z-50
            w-16 h-16 rounded-full
            bg-green-500 hover:bg-green-600
            text-white shadow-lg hover:shadow-xl
            flex items-center justify-center
            transition-all duration-300
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className}
          `}
          title={t('contactViaWhatsApp')}
        >
          <BsWhatsapp size={32} />
        </button>
      </div>
    );
  }

  // Default button variant
  return (
    <div className="space-y-2">
      {renderGDPRConsent()}
      <Button
        onClick={handleContact}
        disabled={disabled || isLoading || !phoneNumber || (requireGDPRConsent && !gdprConsent)}
        className={`bg-green-500 hover:bg-green-600 text-white ${className}`}
        size={size}
        isLoading={isLoading}
        startContent={<BsWhatsapp />}
      >
        {isLoading ? t('sending') : t('contactViaWhatsApp')}
      </Button>
    </div>
  );
};

export default WhatsAppContactButton;


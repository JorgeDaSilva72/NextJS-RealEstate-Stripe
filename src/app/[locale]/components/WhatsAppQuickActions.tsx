/**
 * WhatsApp Quick Actions Component
 * Provides quick action buttons for common WhatsApp interactions
 */

'use client';

import React, { useState } from 'react';
import {
  Card,
  CardBody,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@nextui-org/react';
import {
  BsWhatsapp,
  BsLink45Deg,
  BsCalendar3,
  BsInfoCircle,
} from 'react-icons/bs';
import { useTranslations } from 'next-intl';
import { toast } from 'react-toastify';
import { usePathname } from 'next/navigation';
import { trackWhatsAppClick } from '@/lib/analytics/ga4';
import WhatsAppContactButton from './WhatsAppContactButton';
import { getLocalizedText } from '@/lib/utils/translation-utils';

interface WhatsAppQuickActionsProps {
  phoneNumber?: string;
  propertyId?: number;
  propertyName?: string | any; // Can be multilingual object or string
  propertyUrl?: string;
  propertyPrice?: string;
}

const WhatsAppQuickActions: React.FC<WhatsAppQuickActionsProps> = ({
  phoneNumber,
  propertyId,
  propertyName,
  propertyUrl,
  propertyPrice,
}) => {
  const t = useTranslations('WhatsApp');
  const pathname = usePathname();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  // Helper to extract text from multilingual property name
  const getPropertyNameText = (): string => {
    if (!propertyName) return '';
    if (typeof propertyName === 'string') return propertyName;
    // Get locale from pathname or default to 'fr'
    const locale = pathname?.split('/')[1] || 'fr';
    return getLocalizedText(propertyName, locale);
  };

  /**
   * Send property link via WhatsApp
   */
  const handleSendLink = async () => {
    if (!phoneNumber || !propertyUrl) {
      toast.error(t('phoneNumberRequired'));
      return;
    }

    // Track GA4 event
    const propertyNameText = getPropertyNameText();
    const sourceUrl = typeof window !== 'undefined' ? window.location.href : pathname || '';
    trackWhatsAppClick({
      sourceUrl,
      buttonType: 'quick_action',
      propertyId,
      propertyName: propertyNameText,
      phoneNumber,
    });

    const message = `${t('sendPropertyLink')}: ${propertyNameText}\n${propertyUrl}`;
    
    try {
      const response = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: phoneNumber,
          message,
          type: 'text',
          propertyId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // If token expired, use wa.me fallback
        if (data.error?.isTokenExpired || data.error?.code === 190) {
          const formattedPhone = phoneNumber.replace(/[^0-9]/g, '');
          const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
          window.open(whatsappUrl, '_blank');
          toast.warning(t('tokenExpiredUsingFallback') || 'Token expiré, ouverture de WhatsApp...');
          onClose();
          return;
        }
        throw new Error(data.error?.message || t('errorSending'));
      }

      toast.success(t('messageSent'));
      onClose();
    } catch (error: any) {
      console.error('Send link error:', error);
      // Check if token expired
      if (error?.error?.isTokenExpired || error?.error?.code === 190) {
        const formattedPhone = phoneNumber.replace(/[^0-9]/g, '');
        const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        toast.warning(t('tokenExpiredUsingFallback') || 'Token expiré, ouverture de WhatsApp...');
        onClose();
        return;
      }
      toast.error(error.message || t('errorSending'));
    }
  };

  /**
   * Schedule visit via WhatsApp
   */
  const handleScheduleVisit = async () => {
    if (!phoneNumber) {
      toast.error(t('phoneNumberRequired'));
      return;
    }

    // Track GA4 event
    const propertyNameText = getPropertyNameText();
    const sourceUrl = typeof window !== 'undefined' ? window.location.href : pathname || '';
    trackWhatsAppClick({
      sourceUrl,
      buttonType: 'quick_action',
      propertyId,
      propertyName: propertyNameText,
      phoneNumber,
    });

    const message = `${t('scheduleVisit')}: ${propertyNameText}\n${t('requestInfo')}`;
    
    try {
      const response = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: phoneNumber,
          message,
          type: 'text',
          propertyId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // If token expired, use wa.me fallback
        if (data.error?.isTokenExpired || data.error?.code === 190) {
          const formattedPhone = phoneNumber.replace(/[^0-9]/g, '');
          const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
          window.open(whatsappUrl, '_blank');
          toast.warning(t('tokenExpiredUsingFallback') || 'Token expiré, ouverture de WhatsApp...');
          onClose();
          return;
        }
        throw new Error(data.error?.message || t('errorSending'));
      }

      toast.success(t('messageSent'));
      onClose();
    } catch (error: any) {
      console.error('Schedule visit error:', error);
      // Check if token expired
      if (error?.error?.isTokenExpired || error?.error?.code === 190) {
        const formattedPhone = phoneNumber.replace(/[^0-9]/g, '');
        const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        toast.warning(t('tokenExpiredUsingFallback') || 'Token expiré, ouverture de WhatsApp...');
        onClose();
        return;
      }
      toast.error(error.message || t('errorSending'));
    }
  };

  /**
   * Request information via WhatsApp
   */
  const handleRequestInfo = async () => {
    if (!phoneNumber) {
      toast.error(t('phoneNumberRequired'));
      return;
    }

    // Track GA4 event
    const propertyNameText = getPropertyNameText();
    const sourceUrl = typeof window !== 'undefined' ? window.location.href : pathname || '';
    trackWhatsAppClick({
      sourceUrl,
      buttonType: 'quick_action',
      propertyId,
      propertyName: propertyNameText,
      phoneNumber,
    });

    const message = `${t('requestInfo')}: ${propertyNameText}\n${propertyPrice ? `Prix: ${propertyPrice}` : ''}`;
    
    try {
      const response = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: phoneNumber,
          message,
          type: 'text',
          propertyId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // If token expired, use wa.me fallback
        if (data.error?.isTokenExpired || data.error?.code === 190) {
          const formattedPhone = phoneNumber.replace(/[^0-9]/g, '');
          const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
          window.open(whatsappUrl, '_blank');
          toast.warning(t('tokenExpiredUsingFallback') || 'Token expiré, ouverture de WhatsApp...');
          onClose();
          return;
        }
        throw new Error(data.error?.message || t('errorSending'));
      }

      toast.success(t('messageSent'));
      onClose();
    } catch (error: any) {
      console.error('Request info error:', error);
      // Check if token expired
      if (error?.error?.isTokenExpired || error?.error?.code === 190) {
        const formattedPhone = phoneNumber.replace(/[^0-9]/g, '');
        const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        toast.warning(t('tokenExpiredUsingFallback') || 'Token expiré, ouverture de WhatsApp...');
        onClose();
        return;
      }
      toast.error(error.message || t('errorSending'));
    }
  };

  if (!phoneNumber) {
    return null;
  }

  return (
    <>
      <Card>
        <CardBody className="p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <BsWhatsapp className="text-green-500" />
            {t('quickActions')}
          </h3>
          <div className="grid grid-cols-1 gap-2">
            <Button
              variant="flat"
              color="success"
              startContent={<BsLink45Deg />}
              onClick={handleSendLink}
              className="justify-start"
            >
              {t('sendPropertyLink')}
            </Button>
            <Button
              variant="flat"
              color="success"
              startContent={<BsCalendar3 />}
              onClick={handleScheduleVisit}
              className="justify-start"
            >
              {t('scheduleVisit')}
            </Button>
            <Button
              variant="flat"
              color="success"
              startContent={<BsInfoCircle />}
              onClick={handleRequestInfo}
              className="justify-start"
            >
              {t('requestInfo')}
            </Button>
            <div className="pt-2 border-t mt-2">
              <WhatsAppContactButton
                phoneNumber={phoneNumber}
                propertyId={propertyId}
                propertyName={propertyName}
                propertyUrl={propertyUrl}
                propertyPrice={propertyPrice}
                variant="button"
                size="sm"
                className="w-full"
              />
            </div>
          </div>
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>{t('quickActions')}</ModalHeader>
          <ModalBody>
            <p>{t('selectAction')}</p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              {t('cancel')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default WhatsAppQuickActions;


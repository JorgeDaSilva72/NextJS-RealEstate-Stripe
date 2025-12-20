/**
 * WhatsApp Floating Widget
 * Global floating WhatsApp button with chat interface
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
} from '@nextui-org/react';
import { BsWhatsapp, BsX, BsSend } from 'react-icons/bs';
import { useTranslations } from 'next-intl';
import { toast } from 'react-toastify';
import { usePathname } from 'next/navigation';
import { trackWhatsAppClick } from '@/lib/analytics/ga4';
import WhatsAppContactButton from './WhatsAppContactButton';

interface WhatsAppFloatingWidgetProps {
  phoneNumber?: string;
  companyName?: string;
  greeting?: string;
  position?: 'bottom-right' | 'bottom-left';
  showAfter?: number; // Show widget after X seconds
}

const WhatsAppFloatingWidget: React.FC<WhatsAppFloatingWidgetProps> = ({
  phoneNumber,
  companyName = 'Support',
  greeting = 'Besoin d\'aide? Contactez-nous!',
  position = 'bottom-right',
  showAfter = 5000,
}) => {
  const t = useTranslations('WhatsApp');
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (showAfter > 0) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, showAfter);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
    }
  }, [showAfter]);

  /**
   * Handle send message
   */
  const handleSend = async () => {
    if (!message.trim() || !phoneNumber) return;

    try {
      setSending(true);

      const response = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: phoneNumber,
          message: message.trim(),
          type: 'text',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // If token expired, use wa.me fallback
        if (data.error?.isTokenExpired || data.error?.code === 190) {
          const formattedPhone = phoneNumber.replace(/[^0-9]/g, '');
          const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message.trim())}`;
          window.open(whatsappUrl, '_blank');
          toast.warning(t('tokenExpiredUsingFallback') || 'Token expiré, ouverture de WhatsApp...');
          setMessage('');
          setIsOpen(false);
          return;
        }
        throw new Error(data.error?.message || t('errorSending'));
      }

      toast.success(t('messageSent'));
      setMessage('');
      setIsOpen(false);
    } catch (error: any) {
      console.error('Send message error:', error);
      toast.error(error.message || t('errorSending'));
    } finally {
      setSending(false);
    }
  };

  if (!phoneNumber || !isVisible) {
    return null;
  }

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
  };

  return (
    <>
      {/* Floating Button */}
      <div
        className={`
          fixed ${positionClasses[position]} z-50
          transition-all duration-300
          ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}
        `}
      >
        <button
          onClick={() => {
            // Track GA4 event
            const sourceUrl = typeof window !== 'undefined' ? window.location.href : pathname || '';
            trackWhatsAppClick({
              sourceUrl,
              buttonType: 'floating',
              phoneNumber,
            });
            setIsOpen(true);
          }}
          className="
            w-16 h-16 rounded-full
            bg-green-500 hover:bg-green-600
            text-white shadow-lg hover:shadow-xl
            flex items-center justify-center
            transition-all duration-300
            animate-pulse
          "
          title={t('chatWithUs')}
        >
          <BsWhatsapp size={32} />
        </button>
      </div>

      {/* Chat Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        size="md"
        placement="bottom"
        classNames={{
          base: 'fixed bottom-20',
        }}
      >
        <ModalContent>
          <ModalHeader className="flex items-center gap-2">
            <BsWhatsapp className="text-green-500" />
            <div>
              <h3>{companyName}</h3>
              <p className="text-sm text-gray-500 font-normal">{greeting}</p>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">{t('weRespondQuickly')}</p>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('typeMessage')}</label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t('typeMessage')}
                  minRows={3}
                  maxRows={6}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
              </div>

              <div className="pt-2">
                <WhatsAppContactButton
                  phoneNumber={phoneNumber}
                  variant="button"
                  size="sm"
                  className="w-full"
                  message={message || t('globalWidgetMessage') || 'Hello, I am contacting you from Afrique Avenir Immobilier.'}
                  buttonType="floating"
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setIsOpen(false)}>
              {t('close')}
            </Button>
            <Button
              color="success"
              onPress={handleSend}
              disabled={!message.trim() || sending}
              startContent={<BsSend />}
            >
              {sending ? t('sending') : t('send')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default WhatsAppFloatingWidget;


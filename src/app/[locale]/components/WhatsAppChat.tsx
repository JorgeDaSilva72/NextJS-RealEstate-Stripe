/**
 * WhatsApp Chat Widget Component
 * Floating WhatsApp button with optional chat interface
 */

'use client';

import React, { useState, useEffect } from 'react';
import { BsWhatsapp, BsX } from 'react-icons/bs';
import { formatPhoneNumber } from '@/lib/whatsapp/validators';

interface WhatsAppChatProps {
  phoneNumber: string;
  message?: string;
  position?: 'bottom-right' | 'bottom-left';
  showPopup?: boolean;
  companyName?: string;
  greeting?: string;
  avatar?: string;
}

const WhatsAppChat: React.FC<WhatsAppChatProps> = ({
  phoneNumber,
  message = 'Bonjour! Comment puis-je vous aider?',
  position = 'bottom-right',
  showPopup = true,
  companyName = 'Support',
  greeting = 'Besoin d\'aide? Contactez-nous!',
  avatar,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        setShowGreeting(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  const handleOpenWhatsApp = () => {
    const formattedPhone = formatPhoneNumber(phoneNumber);
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    setShowGreeting(false);
  };

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
  };

  return (
    <>
      {/* Floating Button */}
      <div className={`fixed ${positionClasses[position]} z-50`}>
        {/* Greeting Popup */}
        {showGreeting && !isOpen && (
          <div
            className={`
              absolute bottom-20 bg-white rounded-lg shadow-xl
              p-4 max-w-xs mb-2 animate-fade-in
              ${position === 'bottom-right' ? 'right-0' : 'left-0'}
            `}
          >
            <button
              onClick={() => setShowGreeting(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              <BsX size={20} />
            </button>
            
            <div className="flex items-start gap-3">
              {avatar ? (
                <img
                  src={avatar}
                  alt={companyName}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">
                  <BsWhatsapp size={20} />
                </div>
              )}
              
              <div>
                <p className="font-medium text-gray-900 mb-1">{companyName}</p>
                <p className="text-sm text-gray-600">{greeting}</p>
              </div>
            </div>
          </div>
        )}

        {/* WhatsApp Button */}
        <button
          onClick={handleOpenWhatsApp}
          className="
            w-16 h-16 rounded-full
            bg-green-500 hover:bg-green-600
            text-white shadow-lg hover:shadow-xl
            flex items-center justify-center
            transition-all duration-300
            animate-bounce-slow
          "
          title="Contacter via WhatsApp"
        >
          <BsWhatsapp size={32} />
        </button>
      </div>

      {/* Add custom animation styles */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s infinite;
        }
      `}</style>
    </>
  );
};

export default WhatsAppChat;



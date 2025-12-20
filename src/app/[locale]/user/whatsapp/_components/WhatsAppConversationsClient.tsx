/**
 * WhatsApp Conversations Client Component
 * Displays user's WhatsApp conversations with ability to send messages
 */

'use client';

import React, { useState } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Textarea,
  Avatar,
  Chip,
  Spinner,
} from '@nextui-org/react';
import { BsWhatsapp, BsSend, BsCheck2, BsCheck2All } from 'react-icons/bs';
import { useTranslations } from 'next-intl';
import { toast } from 'react-toastify';
import { useLocale } from 'next-intl';
import Link from 'next/link';

// Simple date formatter (no external dependency)
const formatDate = (date: Date, locale: string): string => {
  try {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return locale === 'fr' ? 'À l\'instant' : 'Just now';
    if (diffMins < 60) return `${diffMins} ${locale === 'fr' ? 'min' : 'min'} ago`;
    if (diffHours < 24) return `${diffHours} ${locale === 'fr' ? 'h' : 'h'} ago`;
    if (diffDays < 7) return `${diffDays} ${locale === 'fr' ? 'j' : 'd'} ago`;
    
    return new Date(date).toLocaleDateString(locale);
  } catch {
    return new Date(date).toLocaleDateString();
  }
};

interface Conversation {
  id: string;
  userPhone: string;
  status: string;
  lastMessageAt: Date | null;
  account: {
    phoneNumber: string;
    displayName: string | null;
  };
  property: {
    id: number;
    name: string;
    images: Array<{ url: string }>;
  } | null;
  messages: Array<{
    id: string;
    content: any;
    direction: string;
    status: string;
    sentAt: Date;
  }>;
  _count: {
    messages: number;
  };
}

interface WhatsAppConversationsClientProps {
  conversations: Conversation[];
  account: {
    id: string;
    phoneNumber: string;
    displayName: string | null;
    isVerified: boolean;
  } | null;
  userId: string;
}

const WhatsAppConversationsClient: React.FC<WhatsAppConversationsClientProps> = ({
  conversations,
  account,
  userId,
}) => {
  const t = useTranslations('WhatsApp');
  const locale = useLocale();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(
    conversations[0]?.id || null
  );
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState<string | null>(null);

  const selectedConv = conversations.find((c) => c.id === selectedConversation);

  /**
   * Send a message
   */
  const handleSendMessage = async () => {
    if (!message.trim() || !selectedConv) return;

    try {
      setSending(true);

      const response = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: selectedConv.userPhone,
          message: message.trim(),
          type: 'text',
          conversationId: selectedConv.id,
          propertyId: selectedConv.property?.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // If token expired, inform user and suggest wa.me
        if (data.error?.isTokenExpired || data.error?.code === 190) {
          const formattedPhone = selectedConv.userPhone.replace(/[^0-9]/g, '');
          const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message.trim())}`;
          toast.warning(t('tokenExpiredUsingFallback') || 'Token expiré. Cliquez pour ouvrir WhatsApp...', {
            onClick: () => window.open(whatsappUrl, '_blank'),
          });
          return;
        }
        throw new Error(data.error?.message || t('errorSending'));
      }

      toast.success(t('messageSent'));
      setMessage('');
      
      // Refresh page to show new message
      window.location.reload();
    } catch (error: any) {
      console.error('Send message error:', error);
      toast.error(error.message || t('errorSending'));
    } finally {
      setSending(false);
    }
  };

  /**
   * Get status icon
   */
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SENT':
        return <BsCheck2 className="text-gray-400" />;
      case 'DELIVERED':
        return <BsCheck2All className="text-gray-400" />;
      case 'READ':
        return <BsCheck2All className="text-green-500" />;
      default:
        return null;
    }
  };

  /**
   * Format message content
   */
  const formatMessageContent = (content: any): string => {
    if (typeof content === 'string') return content;
    if (content?.text) return content.text;
    if (content?.caption) return content.caption;
    return t('unsupportedMessage');
  };

  /**
   * Format date
   */
  const formatDateHelper = (date: Date) => {
    return formatDate(date, locale);
  };

  if (!account) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardBody className="text-center py-12">
            <BsWhatsapp size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">{t('whatsAppNotConfigured')}</h2>
            <p className="text-gray-600">{t('contactAdmin')}</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <BsWhatsapp size={32} className="text-green-500" />
        <h1 className="text-3xl font-bold">{t('conversations')}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <h2 className="text-xl font-semibold">{t('conversations')}</h2>
          </CardHeader>
          <CardBody className="p-0">
            {conversations.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <BsWhatsapp size={48} className="mx-auto mb-4 opacity-50" />
                <p>{t('noConversations')}</p>
              </div>
            ) : (
              <div className="divide-y">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv.id)}
                    className={`
                      w-full p-4 text-left hover:bg-gray-50 transition-colors
                      ${selectedConversation === conv.id ? 'bg-green-50 border-l-4 border-green-500' : ''}
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar
                        src={conv.property?.images[0]?.url}
                        name={conv.userPhone}
                        className="flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-sm truncate">
                            {conv.property?.name || conv.userPhone}
                          </p>
                          {conv.lastMessageAt && (
                            <span className="text-xs text-gray-500">
                              {formatDateHelper(conv.lastMessageAt)}
                            </span>
                          )}
                        </div>
                        {conv.messages[0] && (
                          <p className="text-sm text-gray-600 truncate">
                            {formatMessageContent(conv.messages[0].content)}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <Chip size="sm" variant="flat" color="success">
                            {conv._count.messages} {t('messages')}
                          </Chip>
                          <Chip
                            size="sm"
                            variant="flat"
                            color={
                              conv.status === 'ACTIVE' ? 'success' : 'default'
                            }
                          >
                            {conv.status}
                          </Chip>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2 flex flex-col">
          {selectedConv ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={selectedConv.property?.images[0]?.url}
                      name={selectedConv.userPhone}
                    />
                    <div>
                      <h3 className="font-semibold">
                        {selectedConv.property?.name || selectedConv.userPhone}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {selectedConv.userPhone}
                      </p>
                    </div>
                  </div>
                  {selectedConv.property && (
                    <Link href={`/property/${selectedConv.property.id}`}>
                      <Button size="sm" variant="flat">
                        {t('viewProperty')}
                      </Button>
                    </Link>
                  )}
                </div>
              </CardHeader>

              <CardBody className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {selectedConv.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`
                        flex gap-2
                        ${msg.direction === 'OUTBOUND' ? 'justify-end' : 'justify-start'}
                      `}
                    >
                      <div
                        className={`
                          max-w-[70%] rounded-lg p-3
                          ${
                            msg.direction === 'OUTBOUND'
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }
                        `}
                      >
                        <p className="text-sm whitespace-pre-wrap">
                          {formatMessageContent(msg.content)}
                        </p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <span className="text-xs opacity-70">
                            {formatDateHelper(msg.sentAt)}
                          </span>
                          {msg.direction === 'OUTBOUND' && getStatusIcon(msg.status)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>

              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t('typeMessage')}
                    minRows={1}
                    maxRows={4}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim() || sending}
                    className="bg-green-500 text-white"
                    isIconOnly
                  >
                    {sending ? (
                      <Spinner size="sm" color="white" />
                    ) : (
                      <BsSend />
                    )}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <CardBody className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <BsWhatsapp size={64} className="mx-auto mb-4 opacity-50" />
                <p>{t('selectConversation')}</p>
              </div>
            </CardBody>
          )}
        </Card>
      </div>
    </div>
  );
};

export default WhatsAppConversationsClient;


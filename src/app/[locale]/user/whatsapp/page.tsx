/**
 * User WhatsApp Conversations Page
 * Allows users to view and manage their WhatsApp conversations
 */

'use server';

import { redirect } from 'next/navigation';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { getTranslations } from 'next-intl/server';
import prisma from '@/lib/prisma';
import WhatsAppConversationsClient from './_components/WhatsAppConversationsClient';
import { getLocalizedText } from '@/lib/utils/translation-utils';

interface Props {
  params: { locale: string };
}

export default async function WhatsAppConversationsPage({ params }: Props) {
  const t = await getTranslations('WhatsApp');
  const locale = params.locale || 'fr';
  const { getUser } = await getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    redirect('/api/auth/login');
  }

  // Get user's WhatsApp conversations
  const conversations = await prisma.whatsAppConversation.findMany({
    where: {
      userId: user.id,
    },
    include: {
      account: {
        select: {
          phoneNumber: true,
          displayName: true,
        },
      },
      property: {
        select: {
          id: true,
          name: true,
          images: {
            where: { isMain: true },
            take: 1,
            select: { url: true },
          },
        },
      },
      messages: {
        orderBy: { sentAt: 'desc' },
        take: 1,
        select: {
          id: true,
          content: true,
          direction: true,
          status: true,
          sentAt: true,
        },
      },
      _count: {
        select: {
          messages: true,
        },
      },
    },
    orderBy: {
      lastMessageAt: 'desc',
    },
  });

  // Transform conversations to convert JsonValue property.name to string
  const transformedConversations = conversations.map((conv) => ({
    ...conv,
    property: conv.property
      ? {
          ...conv.property,
          name: typeof conv.property.name === 'string' 
            ? conv.property.name 
            : getLocalizedText(conv.property.name as any, locale) || '',
        }
      : null,
  }));

  // Get WhatsApp account status
  const account = await prisma.whatsAppAccount.findFirst({
    where: { isActive: true },
    select: {
      id: true,
      phoneNumber: true,
      displayName: true,
      isVerified: true,
    },
  });

  return (
    <WhatsAppConversationsClient
      conversations={transformedConversations}
      account={account}
      userId={user.id}
    />
  );
}















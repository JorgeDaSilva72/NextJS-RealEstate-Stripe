/**
 * WhatsApp Admin Dashboard
 * Manage WhatsApp conversations and messages
 */

'use client';

import React, { useState, useEffect } from 'react';
import { BsWhatsapp, BsCheck2All, BsCheck, BsClock } from 'react-icons/bs';
import { toast } from 'react-toastify';
import moment from 'moment';

interface Conversation {
  id: string;
  userPhone: string;
  userName?: string;
  status: string;
  lastMessageAt: Date;
  unreadCount: number;
  property?: {
    id: number;
    name: any;
    price: number;
  };
  messages: Array<{
    content: any;
    sentAt: Date;
    direction: string;
  }>;
  _count: {
    messages: number;
  };
}

export default function WhatsAppAdminPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ACTIVE');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalConversations: 0,
    activeConversations: 0,
    todayMessages: 0,
    approvedTemplates: 0,
  });

  useEffect(() => {
    loadConversations();
    loadStats();
  }, [statusFilter]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/whatsapp/conversations?status=${statusFilter}&limit=50`
      );
      
      if (response.ok) {
        const data = await response.json();
        setConversations(data.data.conversations);
      } else {
        toast.error('Erreur lors du chargement des conversations');
      }
    } catch (error) {
      console.error('Load conversations error:', error);
      toast.error('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch('/api/whatsapp/status');
      if (response.ok) {
        const data = await response.json();
        if (data.data.statistics) {
          setStats(data.data.statistics);
        }
      }
    } catch (error) {
      console.error('Load stats error:', error);
    }
  };

  const getMessageStatus = (message: any) => {
    if (message.direction === 'INBOUND') {
      return <BsCheck2All className="text-blue-500" />;
    }

    switch (message.status) {
      case 'READ':
        return <BsCheck2All className="text-blue-500" />;
      case 'DELIVERED':
        return <BsCheck2All className="text-gray-400" />;
      case 'SENT':
        return <BsCheck className="text-gray-400" />;
      case 'FAILED':
        return <span className="text-red-500">!</span>;
      default:
        return <BsClock className="text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <BsWhatsapp className="text-4xl text-green-500" />
            <h1 className="text-3xl font-bold text-gray-900">
              WhatsApp Business Dashboard
            </h1>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-1">Total Conversations</div>
              <div className="text-3xl font-bold text-gray-900">
                {stats.totalConversations}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-1">Active</div>
              <div className="text-3xl font-bold text-green-600">
                {stats.activeConversations}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-1">Messages Today</div>
              <div className="text-3xl font-bold text-blue-600">
                {stats.todayMessages}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-1">Templates Approved</div>
              <div className="text-3xl font-bold text-purple-600">
                {stats.approvedTemplates}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex gap-4">
              <button
                onClick={() => setStatusFilter('ACTIVE')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  statusFilter === 'ACTIVE'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setStatusFilter('ARCHIVED')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  statusFilter === 'ARCHIVED'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Archived
              </button>
              <button
                onClick={() => setStatusFilter('BLOCKED')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  statusFilter === 'BLOCKED'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Blocked
              </button>
            </div>
          </div>
        </div>

        {/* Conversations List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Conversations ({conversations.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Chargement...</p>
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Aucune conversation trouvée
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                    selectedConversation === conversation.id ? 'bg-gray-50' : ''
                  }`}
                  onClick={() => setSelectedConversation(conversation.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold">
                          {conversation.userName?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {conversation.userName || conversation.userPhone}
                          </div>
                          <div className="text-sm text-gray-500">
                            {conversation.userPhone}
                          </div>
                        </div>
                      </div>

                      {conversation.property && (
                        <div className="ml-13 mb-2 text-sm text-blue-600">
                          📍 Propriété: {
                            typeof conversation.property.name === 'string'
                              ? conversation.property.name
                              : 'Property'
                          }
                        </div>
                      )}

                      {conversation.messages.length > 0 && (
                        <div className="ml-13 flex items-center gap-2 text-sm text-gray-600">
                          {getMessageStatus(conversation.messages[0])}
                          <span className="truncate max-w-md">
                            {conversation.messages[0].content?.text || 'Media message'}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-gray-500 mb-1">
                        {moment(conversation.lastMessageAt).fromNow()}
                      </div>
                      {conversation.unreadCount > 0 && (
                        <div className="inline-block px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                          {conversation.unreadCount}
                        </div>
                      )}
                      <div className="text-xs text-gray-500 mt-1">
                        {conversation._count.messages} messages
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Message */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            💡 <strong>Astuce:</strong> Cliquez sur une conversation pour voir les détails et
            envoyer des messages. Utilisez les filtres pour organiser vos conversations.
          </p>
        </div>
      </div>
    </div>
  );
}



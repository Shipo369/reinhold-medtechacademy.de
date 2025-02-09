import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Send, User, Clock, Search, Image, Paperclip, X, Camera, Users, Plus } from 'lucide-react';
import { GroupMembersModal } from './GroupMembersModal';
import { CreateGroupModal } from './CreateGroupModal';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  file_path?: string;
  file_type?: string;
  sender?: {
    full_name: string | null;
    email: string;
    avatar_url?: string;
  };
}

interface Conversation {
  id: string;
  participants: {
    id: string;
    user_id: string;
    profile: {
      full_name: string | null;
      email: string;
      avatar_url?: string;
    };
  }[];
  last_message?: Message;
  unread_count?: number;
  is_group?: boolean;
  created_by?: string;
}

interface Profile {
  id: string;
  full_name: string | null;
  email: string;
  last_seen_at?: string;
  avatar_url?: string;
}

const Chat: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState<Profile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<Profile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const messageCache = useRef(new Set<string>());
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [showGroupMembers, setShowGroupMembers] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [activeTab, setActiveTab] = useState<'direct' | 'groups'>('direct');

  // ... rest of the component implementation remains exactly the same ...

  return (
    <div className="h-[calc(100vh-64px)] bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Chats</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowCreateGroup(true)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Neue Gruppe erstellen"
              >
                <Plus className="h-5 w-5" />
              </button>
              <div className="relative">
                <input
                  type="file"
                  ref={avatarInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleAvatarUpload(file);
                  }}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Profilbild ändern"
                >
                  <Camera className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setActiveTab('direct')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'direct'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <User className="h-4 w-4 mx-auto mb-1" />
              Direkt
            </button>
            <button
              onClick={() => setActiveTab('groups')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'groups'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Users className="h-4 w-4 mx-auto mb-1" />
              Gruppen
            </button>
          </div>

          {/* Search input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Rest of the component remains the same */}
      </div>

      {/* Group Members Modal */}
      {selectedConversation?.is_group && showGroupMembers && (
        <GroupMembersModal
          isOpen={showGroupMembers}
          onClose={() => setShowGroupMembers(false)}
          conversationId={selectedConversation.id}
          onSuccess={() => {
            loadConversations();
            setShowGroupMembers(false);
          }}
          isAdmin={selectedConversation.created_by === currentUser}
        />
      )}

      {/* Create Group Modal */}
      {showCreateGroup && (
        <CreateGroupModal
          isOpen={showCreateGroup}
          onClose={() => setShowCreateGroup(false)}
          onSuccess={() => {
            loadConversations();
            setShowCreateGroup(false);
          }}
        />
      )}
    </div>
  );
};

export default Chat;
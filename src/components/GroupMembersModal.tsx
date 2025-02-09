import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Search, User, Plus, Trash2, Shield, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface GroupMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversationId: string;
  onSuccess: () => void;
  isAdmin: boolean;
}

interface Member {
  id: string;
  full_name: string | null;
  email: string;
  avatar_url?: string;
  is_admin?: boolean;
}

interface User {
  id: string;
  full_name: string | null;
  email: string;
  avatar_url?: string;
}

export function GroupMembersModal({ isOpen, onClose, conversationId, onSuccess, isAdmin }: GroupMembersModalProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadMembers();
      if (isAdmin) {
        loadUsers();
      }
    }
  }, [isOpen, conversationId]);

  const loadMembers = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase.rpc(
        'get_group_details',
        { p_conversation_id: conversationId }
      );

      if (error) throw error;

      const members = data.members.map((member: any) => ({
        ...member,
        is_admin: member.id === data.created_by
      }));

      setMembers(members);
    } catch (err: any) {
      console.error('Error loading members:', err);
      setError(err.message || 'Fehler beim Laden der Mitglieder');
    } finally {
      setIsLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, avatar_url')
        .neq('id', user.id)
        .order('full_name');

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error('Error loading users:', err);
    }
  };

  const addMember = async (userId: string) => {
    try {
      setIsProcessing(true);
      setError(null);

      const { error } = await supabase.rpc(
        'add_group_members',
        { 
          p_conversation_id: conversationId,
          p_member_ids: [userId]
        }
      );

      if (error) throw error;

      await loadMembers();
      setError('Mitglied wurde erfolgreich hinzugefügt');
      setTimeout(() => setError(null), 3000);
    } catch (err: any) {
      console.error('Error adding member:', err);
      setError(err.message || 'Fehler beim Hinzufügen des Mitglieds');
    } finally {
      setIsProcessing(false);
    }
  };

  const removeMember = async (userId: string) => {
    try {
      setIsProcessing(true);
      setError(null);

      const { error } = await supabase.rpc(
        'remove_group_member',
        { 
          p_conversation_id: conversationId,
          p_member_id: userId
        }
      );

      if (error) throw error;

      await loadMembers();
      setError('Mitglied wurde erfolgreich entfernt');
      setTimeout(() => setError(null), 3000);
    } catch (err: any) {
      console.error('Error removing member:', err);
      setError(err.message || 'Fehler beim Entfernen des Mitglieds');
    } finally {
      setIsProcessing(false);
    }
  };

  const makeAdmin = async (userId: string) => {
    try {
      setIsProcessing(true);
      setError(null);

      const { error } = await supabase.rpc(
        'make_group_admin',
        { 
          p_conversation_id: conversationId,
          p_user_id: userId
        }
      );

      if (error) throw error;

      await loadMembers();
      setError('Administrator wurde erfolgreich ernannt');
      setTimeout(() => setError(null), 3000);
    } catch (err: any) {
      console.error('Error making admin:', err);
      setError(err.message || 'Fehler beim Ernennen des Administrators');
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredUsers = users.filter(user => {
    // Exclude users who are already members
    if (members.some(member => member.id === user.id)) return false;

    const searchLower = searchTerm.toLowerCase();
    return (
      user.full_name?.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    );
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full"
      >
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">
            Gruppenmitglieder
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className={`p-4 rounded-lg ${
              error.includes('erfolgreich')
                ? 'bg-green-50 text-green-800'
                : 'bg-red-50 text-red-800'
            }`}>
              {error}
            </div>
          )}

          {/* Current Members */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4">
              Aktuelle Mitglieder ({members.length})
            </h4>
            <div className="space-y-3">
              {members.map(member => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {member.avatar_url ? (
                        <img
                          src={member.avatar_url}
                          alt={member.full_name || member.email}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {member.full_name || member.email}
                      </p>
                      {member.full_name && (
                        <p className="text-xs text-gray-500">{member.email}</p>
                      )}
                    </div>
                    {member.is_admin && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        <Shield className="h-3 w-3 mr-1" />
                        Admin
                      </span>
                    )}
                  </div>
                  {isAdmin && !member.is_admin && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => makeAdmin(member.id)}
                        disabled={isProcessing}
                        className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Zum Admin machen"
                      >
                        <Shield className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => removeMember(member.id)}
                        disabled={isProcessing}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Entfernen"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Add Members Section */}
          {isAdmin && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-4">
                Mitglieder hinzufügen
              </h4>
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Nach Benutzern suchen..."
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

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {filteredUsers.map(user => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {user.avatar_url ? (
                            <img
                              src={user.avatar_url}
                              alt={user.full_name || user.email}
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <User className="h-5 w-5 text-gray-500" />
                            </div>
                          )}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {user.full_name || user.email}
                          </p>
                          {user.full_name && (
                            <p className="text-xs text-gray-500">{user.email}</p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => addMember(user.id)}
                        disabled={isProcessing}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        {isProcessing ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
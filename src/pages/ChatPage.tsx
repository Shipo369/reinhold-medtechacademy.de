import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Chat from '../components/Chat';

export function ChatPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with back button */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Zurück zum Dashboard"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="ml-4 text-lg font-semibold text-gray-900">Chat</h1>
          </div>
        </div>
      </div>

      {/* Chat component */}
      <div className="h-[calc(100vh-64px)]">
        <Chat />
      </div>
    </div>
  );
}
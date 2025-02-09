import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LogOut,
  BookOpen,
  Calendar,
  Settings,
  Users,
  GraduationCap,
  FileText,
  Presentation,
  ShieldCheck,
  Laptop,
  Award,
  Key
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { checkAdminStatus, checkModuleAccess } from '../lib/auth';

export default function Dashboard() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasTrainingAccess, setHasTrainingAccess] = useState(false);
  const [hasEventsAccess, setHasEventsAccess] = useState(false);

  useEffect(() => {
    const init = async () => {
      const adminStatus = await checkAdminStatus();
      setIsAdmin(adminStatus);

      // Check module access if not admin
      if (!adminStatus) {
        const trainingAccess = await checkModuleAccess('training');
        const eventsAccess = await checkModuleAccess('events');
        setHasTrainingAccess(trainingAccess);
        setHasEventsAccess(eventsAccess);
      } else {
        // Admins have access to everything
        setHasTrainingAccess(true);
        setHasEventsAccess(true);
      }
    };
    init();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Mein Dashboard
              {isAdmin && (
                <span className="ml-2 text-sm font-normal text-white bg-blue-600 px-2 py-1 rounded-full">
                  Administrator
                </span>
              )}
            </h1>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Abmelden
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Admin Modules */}
            {isAdmin && (
              <>
                {/* User Management */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="bg-white overflow-hidden shadow-lg rounded-lg"
                >
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="bg-green-500 rounded-lg p-3">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <h2 className="text-lg font-medium text-gray-900">Benutzerverwaltung</h2>
                        <p className="mt-1 text-sm text-gray-500">Benutzer verwalten und Zugriffsrechte</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-6 py-4">
                    <div className="text-sm">
                      <Link to="/users" className="font-medium text-blue-600 hover:text-blue-500">
                        Benutzer verwalten
                      </Link>
                    </div>
                  </div>
                </motion.div>

                {/* Device Management */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="bg-white overflow-hidden shadow-lg rounded-lg"
                >
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="bg-purple-500 rounded-lg p-3">
                        <Laptop className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <h2 className="text-lg font-medium text-gray-900">Geräteverwaltung</h2>
                        <p className="mt-1 text-sm text-gray-500">Gerätetypen und Modelle verwalten</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-6 py-4">
                    <div className="text-sm">
                      <Link to="/geraete" className="font-medium text-blue-600 hover:text-blue-500">
                        Geräte verwalten
                      </Link>
                    </div>
                  </div>
                </motion.div>

                {/* Exam Management */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="bg-white overflow-hidden shadow-lg rounded-lg"
                >
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="bg-yellow-500 rounded-lg p-3">
                        <GraduationCap className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <h2 className="text-lg font-medium text-gray-900">Prüfungsverwaltung</h2>
                        <p className="mt-1 text-sm text-gray-500">Prüfungen erstellen und verwalten</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-6 py-4">
                    <div className="text-sm">
                      <Link to="/pruefungen" className="font-medium text-blue-600 hover:text-blue-500">
                        Prüfungen verwalten
                      </Link>
                    </div>
                  </div>
                </motion.div>

                {/* Certificate Management */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="bg-white overflow-hidden shadow-lg rounded-lg"
                >
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="bg-red-500 rounded-lg p-3">
                        <Award className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <h2 className="text-lg font-medium text-gray-900">Zertifikatsverwaltung</h2>
                        <p className="mt-1 text-sm text-gray-500">Zertifikate ausstellen und verwalten</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-6 py-4">
                    <div className="text-sm">
                      <Link to="/zertifikate/verwaltung" className="font-medium text-blue-600 hover:text-blue-500">
                        Zertifikate verwalten
                      </Link>
                    </div>
                  </div>
                </motion.div>

                {/* Access Management */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  className="bg-white overflow-hidden shadow-lg rounded-lg"
                >
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="bg-blue-500 rounded-lg p-3">
                        <Key className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <h2 className="text-lg font-medium text-gray-900">Zugriffsverwaltung</h2>
                        <p className="mt-1 text-sm text-gray-500">Modul- und Gerätezugriffe verwalten</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-6 py-4">
                    <div className="text-sm">
                      <Link to="/access" className="font-medium text-blue-600 hover:text-blue-500">
                        Zugriffe verwalten
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </>
            )}

            {/* Regular User Modules */}
            {/* Training Area */}
            {(isAdmin || hasTrainingAccess) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                className="bg-white overflow-hidden shadow-lg rounded-lg"
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="bg-teal-500 rounded-lg p-3">
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <h2 className="text-lg font-medium text-gray-900">Schulungen</h2>
                      <p className="mt-1 text-sm text-gray-500">Lernmodule und Prüfungen</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-4">
                  <div className="text-sm">
                    <Link to="/schulungen" className="font-medium text-blue-600 hover:text-blue-500">
                      Zu den Schulungen
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Events */}
            {(isAdmin || hasEventsAccess) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.7 }}
                className="bg-white overflow-hidden shadow-lg rounded-lg"
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="bg-orange-500 rounded-lg p-3">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <h2 className="text-lg font-medium text-gray-900">Veranstaltungen</h2>
                      <p className="mt-1 text-sm text-gray-500">Termine und Events</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-4">
                  <div className="text-sm">
                    <Link to="/events" className="font-medium text-blue-600 hover:text-blue-500">
                      Zu den Veranstaltungen
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Documents - Only show for admins */}
            {isAdmin && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.8 }}
                className="bg-white overflow-hidden shadow-lg rounded-lg"
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="bg-pink-500 rounded-lg p-3">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <h2 className="text-lg font-medium text-gray-900">Dokumente</h2>
                      <p className="mt-1 text-sm text-gray-500">Dokumentation und Anleitungen</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-4">
                  <div className="text-sm">
                    <Link to="/dokumente" className="font-medium text-blue-600 hover:text-blue-500">
                      Zu den Dokumenten
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Presentations - Only show for admins */}
            {isAdmin && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.9 }}
                className="bg-white overflow-hidden shadow-lg rounded-lg"
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="bg-cyan-500 rounded-lg p-3">
                      <Presentation className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <h2 className="text-lg font-medium text-gray-900">Präsentationen</h2>
                      <p className="mt-1 text-sm text-gray-500">Schulungspräsentationen</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-4">
                  <div className="text-sm">
                    <Link to="/praesentation" className="font-medium text-blue-600 hover:text-blue-500">
                      Zu den Präsentationen
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export { Dashboard }
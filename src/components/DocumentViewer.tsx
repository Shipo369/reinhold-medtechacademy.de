import React, { useState, useEffect } from 'react';
import { FileText, AlertCircle } from 'lucide-react';

interface DocumentViewerProps {
  url: string;
  title: string;
  type?: 'pdf' | 'text';
}

export function DocumentViewer({ url, title, type = 'pdf' }: DocumentViewerProps) {
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (type === 'text') {
      fetchTextContent();
    }
    setLoading(false);
  }, [url, type]);

  const fetchTextContent = async () => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Dokument konnte nicht geladen werden');
      }
      const text = await response.text();
      setContent(text);
    } catch (err) {
      console.error('Error loading document:', err);
      setError('Das Dokument konnte nicht geladen werden');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[600px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] text-red-600">
        <AlertCircle className="h-12 w-12 mb-4" />
        <p>{error}</p>
      </div>
    );
  }

  if (type === 'pdf') {
    return (
      <iframe 
        src={url}
        className="w-full h-[800px] border-0"
        title={title}
      />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center mb-4">
        <FileText className="h-5 w-5 text-blue-600 mr-2" />
        <h2 className="text-lg font-medium text-gray-900">{title}</h2>
      </div>
      <div className="prose max-w-none">
        <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
          {content}
        </pre>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Brain, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import emailService from '../services/emailService';

const AIEmailSummary = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await emailService.getGlobalSummary();
      setSummary(res.summary || 'Aucun résumé disponible.');
    } catch (err) {
      setError('Erreur lors de la récupération du résumé IA.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  return (
    <Card className="bg-white dark:bg-[#1F2937] border-gray-200 dark:border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-[#111827] dark:text-[#F9FAFB] text-lg flex items-center">
          <Brain className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
          Résumé IA de la journée
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center p-6 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
            Chargement du résumé IA...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center p-6 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
            <Button onClick={loadSummary} variant="outline" size="sm" className="ml-4">Réessayer</Button>
          </div>
        ) : summary ? (
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-[#4B006E] dark:text-[#E9D5FF] whitespace-pre-line">
            {summary}
          </div>
        ) : (
          <div className="text-gray-500 dark:text-gray-400">Aucun résumé disponible.</div>
        )}
      </CardContent>
    </Card>
  );


};

export default AIEmailSummary;
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Brain, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import emailService from '../services/emailService';

const AIEmailSummary = () => {
  // Composant temporairement désactivé - workflow n8n à implémenter
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadSummary = async () => {
    // TODO: Implémenter le workflow n8n pour le résumé IA
    // Endpoint: /webhook/get-summary avec intégration Groq
    setError('Fonctionnalité en développement');
  };

  // Désactivé temporairement
  // useEffect(() => {
  //   loadSummary();
  // }, []);

  // Affichage temporaire en attendant l'implémentation du workflow n8n
  return (
    <Card className="bg-white dark:bg-[#1F2937] border-gray-200 dark:border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-[#111827] dark:text-[#F9FAFB] text-lg flex items-center">
          <Brain className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
          Résumé IA de la journée
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center p-6 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
          <AlertCircle className="h-5 w-5 mr-2" />
          <div className="text-center">
            <p className="font-medium mb-1">Fonctionnalité à venir</p>
            <p className="text-sm opacity-80">
              Résumé IA avec intégration Groq en développement
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );


};

export default AIEmailSummary;
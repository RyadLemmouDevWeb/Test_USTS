import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Send, Bot, User, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import emailService from '../services/emailService';

const EmailReplyForm = ({ selectedEmail, onClose, onReplySent }) => {
  const [replyText, setReplyText] = useState('');
  const [replyMode, setReplyMode] = useState('manual');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [generatingAI, setGeneratingAI] = useState(false);

  useEffect(() => {
    console.log('Selected email:', selectedEmail);
    setReplyText(selectedEmail.generatedReply || selectedEmail.body || '');
  }, [selectedEmail]);

  const handleManualReply = async () => {
    if (!replyText.trim()) return;

    try {
      setLoading(true);
      setError(null);
      console.log('Envoi manuel:', { replyText, selectedEmail });

      const res = await emailService.sendManualReply(
        selectedEmail.id,
        selectedEmail.sender,
        selectedEmail.subject,
        replyText,
        selectedEmail.messageId || selectedEmail.id
      );

      console.log('Réponse envoyée:', res);
      setSuccess(true);
      setTimeout(() => {
        onReplySent?.();
        onClose();
      }, 1500);

    } catch (err) {
      setError('Erreur lors de l\'envoi de la réponse');
      console.error('Erreur envoi réponse manuelle:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoReply = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Envoi auto:', { replyText, selectedEmail });

      const res = await emailService.sendAutoReply(
        selectedEmail.id,
        selectedEmail.sender,
        selectedEmail.subject,
        selectedEmail.summary || selectedEmail.content,
        selectedEmail.messageId || selectedEmail.id,
        replyText
      );

      console.log('Réponse auto envoyée:', res);
      setSuccess(true);
      setTimeout(() => {
        onReplySent?.();
        onClose();
      }, 1500);

    } catch (err) {
      setError('Erreur lors de l\'envoi automatique');
      console.error('Erreur envoi auto:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateAIResponse = async () => {
    try {
      setGeneratingAI(true);
      setError(null);
      console.log('Génération IA avec:', { selectedEmail, replyText });

      const data = await emailService.generateAIReply(
        selectedEmail.id,
        selectedEmail.sender,
        selectedEmail.subject,
        selectedEmail.summary || selectedEmail.content,
        selectedEmail.messageId || selectedEmail.id,
        replyText
      );

      console.log('Réponse IA reçue:', data);

      if (data && typeof data.generatedReply === 'string') {
        setReplyText(data.generatedReply);
        setReplyMode('manual');
        if (!data.generatedReply.trim()) {
          setError("La génération IA a échoué. Réessayez ou rédigez manuellement.");
        } else {
          setError(null);
        }
      } else {
        setError("La génération IA a échoué. Réessayez ou rédigez manuellement.");
        console.warn('Data IA invalide:', data);
      }

    } catch (err) {
      setError('Erreur lors de la génération IA');
      console.error('Erreur génération IA:', err);
    } finally {
      setGeneratingAI(false);
    }
  };

  if (success) {
    return (
      <Card className="bg-white dark:bg-[#1F2937] border-gray-200 dark:border-gray-700">
        <CardContent className="p-6 text-center">
          <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[#111827] dark:text-[#F9FAFB] mb-2">
            Réponse envoyée avec succès !
          </h3>
          <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm">
            Votre réponse à {selectedEmail.sender} a été envoyée.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-[#1F2937] border-gray-200 dark:border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-[#111827] dark:text-[#F9FAFB] text-lg">
          Répondre à {selectedEmail.sender}
        </CardTitle>
        <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
          Sujet : Re: {selectedEmail.subject}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex space-x-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <button
            onClick={() => setReplyMode('manual')}
            className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              replyMode === 'manual'
                ? 'bg-white dark:bg-[#1F2937] text-[#3B82F6] dark:text-[#60A5FA] shadow-sm'
                : 'text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-[#F9FAFB]'
            }`}
          >
            <User className="h-4 w-4" />
            <span>Manuel</span>
          </button>
          <button
            onClick={() => setReplyMode('auto')}
            className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              replyMode === 'auto'
                ? 'bg-white dark:bg-[#1F2937] text-[#3B82F6] dark:text-[#60A5FA] shadow-sm'
                : 'text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-[#F9FAFB]'
            }`}
          >
            <Bot className="h-4 w-4" />
            <span>IA Auto</span>
          </button>
        </div>

        <div className="space-y-2">
          {replyMode === 'manual' && (
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-[#111827] dark:text-[#F9FAFB]">
                Votre réponse
              </label>
              <Button
                onClick={generateAIResponse}
                disabled={generatingAI}
                variant="outline"
                size="sm"
                className="text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20"
              >
                {generatingAI ? (
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                ) : (
                  <Bot className="h-3 w-3 mr-1" />
                )}
                Générer avec IA
              </Button>
            </div>
          )}
          <Textarea
            placeholder={
              replyMode === 'manual' 
                ? "Tapez votre réponse ici..."
                : "Contexte optionnel pour l'IA (ex: 'Réponse polie de refus', 'Demander plus d'informations')..."
            }
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="min-h-32 bg-white dark:bg-[#111827] border-gray-300 dark:border-gray-600 text-[#111827] dark:text-[#F9FAFB] focus:border-[#3B82F6] dark:focus:border-[#60A5FA]"
            disabled={loading || generatingAI}
          />
          <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mb-1">Email original :</p>
          <p className="text-sm text-[#111827] dark:text-[#F9FAFB]">
            {selectedEmail.summary || selectedEmail.content || 'Pas de contenu'}
          </p>
        </div>

        {error && (
          <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="flex space-x-2 pt-2">
          <Button
            onClick={replyMode === 'manual' ? handleManualReply : handleAutoReply}
            disabled={loading || generatingAI || (replyMode === 'manual' && !replyText.trim())}
            className="bg-[#3B82F6] hover:bg-[#2563EB] dark:bg-[#60A5FA] dark:hover:bg-[#3B82F6] text-white"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            {replyMode === 'manual' ? 'Envoyer' : 'Envoyer (IA Auto)'}
          </Button>

          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading || generatingAI}
            className="border-gray-300 dark:border-gray-600 text-[#6B7280] dark:text-[#9CA3AF] hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Annuler
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailReplyForm;

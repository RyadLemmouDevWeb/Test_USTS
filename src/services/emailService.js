const N8N_BASE_URL = import.meta.env.VITE_N8N_URL || 'http://localhost:5678';

class EmailService {
  async getTodaysEmails() {
    try {
      const response = await fetch(`${N8N_BASE_URL}/webhook/get-mails`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      if (!text || text.trim() === '') {
        return { emails: [] };
      }
      try {
        const parsed = JSON.parse(text);
        return parsed;
      } catch (parseError) {
        return { emails: [] };
      }
    } catch (error) {
      throw error;
    }
  }

  async getGlobalSummary() {
    try {
      const response = await fetch(`${N8N_BASE_URL}/webhook/ai-summary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      if (!text || text.trim() === '') {
        return { summary: 'Aucun résumé disponible' };
      }
      try {
        return JSON.parse(text);
      } catch (parseError) {
        return { summary: 'Erreur lors du parsing du résumé' };
      }
    } catch (error) {
      throw error;
    }
  }

  async sendManualReply(emailId, recipientEmail, subject, body, messageId) {
    try {
      const response = await fetch(`${N8N_BASE_URL}/webhook/send-reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'manual',
          emailId,
          to: recipientEmail,
          subject: `Re: ${subject}`,
          body,
          messageId
        })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      if (!text || text.trim() === '') {
        return { success: false, message: 'Réponse vide du serveur' };
      }
      try {
        return JSON.parse(text);
      } catch (parseError) {
        return { success: false, message: 'Erreur de parsing de la réponse' };
      }
    } catch (error) {
      throw error;
    }
  }

  async sendAutoReply(emailId, recipientEmail, subject, originalContent, messageId, context = '') {
    try {
      const response = await fetch(`${N8N_BASE_URL}/webhook/send-auto-reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'auto',
          emailId,
          to: recipientEmail,
          subject: `Re: ${subject}`,
          originalContent,
          messageId,
          context
        })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      if (!text || text.trim() === '') {
        return { success: false, message: 'Réponse vide du serveur' };
      }
      try {
        return JSON.parse(text);
      } catch (parseError) {
        return { success: false, message: 'Erreur de parsing de la réponse' };
      }
    } catch (error) {
      throw error;
    }
  }

  async generateAIReply(emailId, recipientEmail, subject, originalContent, messageId, context = '') {
    return this.sendAutoReply(emailId, recipientEmail, subject, originalContent, messageId, context);
  }
}

export default new EmailService();
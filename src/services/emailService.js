const N8N_BASE_URL = import.meta.env.VITE_N8N_URL || 'http://localhost:5678';

class EmailService {
  async getTodaysEmails() {
    try {
      const response = await fetch(`${N8N_BASE_URL}/webhook/get-mails`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des emails:', error);
      throw error;
    }
  }

  async getGlobalSummary() {
    try {
      const response = await fetch(`${N8N_BASE_URL}/webhook/get-summary`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération du résumé:', error);
      throw error;
    }
  }

  async sendManualReply(emailId, recipientEmail, subject, body) {
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
          body
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la réponse:', error);
      throw error;
    }
  }

  async sendAutoReply(emailId, recipientEmail, subject, originalContent, context = '') {
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
          context
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la réponse automatique:', error);
      throw error;
    }
  }
}

export default new EmailService();
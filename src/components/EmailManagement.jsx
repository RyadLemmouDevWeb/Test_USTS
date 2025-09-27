import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Mail, Search, Filter, Reply, Clock, User, Archive, Moon, Sun, RefreshCw, AlertCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import AIEmailSummary from './AIEmailSummary';
import EmailReplyForm from './EmailReplyForm';
import emailService from '../services/emailService';

const EmailManagement = () => {
  const { isDark, toggleTheme } = useTheme();
  const [emails, setEmails] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterBy, setFilterBy] = useState('all');
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadEmails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const emailData = await emailService.getTodaysEmails();
      setEmails(emailData.emails || []);
    } catch (err) {
      setError('Impossible de charger les emails');
      console.error('Erreur chargement emails:', err);
      setEmails([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmails();
  }, []);

  const filteredAndSortedEmails = useMemo(() => {
    let filtered = emails;

    if (searchTerm) {
      filtered = filtered.filter(email => 
        email.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.summary.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterBy !== 'all') {
      filtered = filtered.filter(email => {
        switch (filterBy) {
          case 'unread': return !email.read;
          case 'high': return email.priority === 'high';
          case 'medium': return email.priority === 'medium';
          case 'low': return email.priority === 'low';
          default: return true;
        }
      });
    }

    return filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'sender':
          aValue = a.sender.toLowerCase();
          bValue = b.sender.toLowerCase();
          break;
        case 'subject':
          aValue = a.subject.toLowerCase();
          bValue = b.subject.toLowerCase();
          break;
        case 'date':
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, [emails, searchTerm, sortBy, sortOrder, filterBy]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityColor = (priority) => {
    if (isDark) {
      switch (priority) {
        case 'high': return 'bg-red-900/30 text-red-300 border-red-700/50';
        case 'medium': return 'bg-yellow-900/30 text-yellow-300 border-yellow-700/50';
        case 'low': return 'bg-green-900/30 text-green-300 border-green-700/50';
        default: return 'bg-gray-800 text-gray-300 border-gray-600';
      }
    } else {
      switch (priority) {
        case 'high': return 'bg-red-50 text-red-700 border-red-200';
        case 'medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
        case 'low': return 'bg-green-50 text-green-700 border-green-200';
        default: return 'bg-gray-100 text-gray-700 border-gray-200';
      }
    }
  };

  const handleEmailClick = (email) => {
    setSelectedEmail(email);
    setEmails(prev => prev.map(e => 
      e.id === email.id ? { ...e, read: true } : e
    ));
  };

  const handleReplySent = () => {
    setShowReplyForm(false);
    setSelectedEmail(null);
    // Optionnel : recharger les emails pour voir les mises à jour
    // loadEmails();
  };

  const handleArchive = (emailId) => {
    setEmails(prev => prev.filter(e => e.id !== emailId));
    if (selectedEmail && selectedEmail.id === emailId) {
      setSelectedEmail(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#111827] transition-colors duration-200">
      <header className="bg-white dark:bg-[#1F2937] border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mail className="h-8 w-8 text-[#3B82F6] dark:text-[#60A5FA]" />
              <h1 className="text-2xl font-bold text-[#111827] dark:text-[#F9FAFB]">Email Management</h1>
              {loading && <RefreshCw className="h-5 w-5 animate-spin text-[#3B82F6] dark:text-[#60A5FA]" />}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={loadEmails}
                variant="outline"
                size="sm"
                className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button
                onClick={toggleTheme}
                variant="outline"
                size="sm"
                className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {error && (
          <div className="mb-6 flex items-center space-x-2 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
            <Button
              onClick={loadEmails}
              variant="outline"
              size="sm"
              className="ml-auto border-red-200 dark:border-red-800"
            >
              Réessayer
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white dark:bg-[#1F2937] border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-[#111827] dark:text-[#F9FAFB] text-lg">Aperçu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#F9FAFB] dark:bg-[#111827]">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-5 w-5 text-[#3B82F6] dark:text-[#60A5FA]" />
                    <span className="text-[#6B7280] dark:text-[#9CA3AF] text-sm">Total</span>
                  </div>
                  <span className="text-2xl font-bold text-[#111827] dark:text-[#F9FAFB]">
                    {emails.length}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#F9FAFB] dark:bg-[#111827]">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    <span className="text-[#6B7280] dark:text-[#9CA3AF] text-sm">Non lus</span>
                  </div>
                  <span className="text-2xl font-bold text-[#111827] dark:text-[#F9FAFB]">
                    {emails.filter(e => !e.read).length}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#F9FAFB] dark:bg-[#111827]">
                  <div className="flex items-center space-x-2">
                    <Filter className="h-5 w-5 text-[#EF4444] dark:text-[#F87171]" />
                    <span className="text-[#6B7280] dark:text-[#9CA3AF] text-sm">Priorité haute</span>
                  </div>
                  <span className="text-2xl font-bold text-[#111827] dark:text-[#F9FAFB]">
                    {emails.filter(e => e.priority === 'high').length}
                  </span>
                </div>
              </CardContent>
            </Card>
            <AIEmailSummary />
            {selectedEmail && showReplyForm && (
              <EmailReplyForm
                selectedEmail={selectedEmail}
                onClose={() => setShowReplyForm(false)}
                onReplySent={handleReplySent}
              />
            )}
          </div>

          <div className="lg:col-span-3 space-y-6">
            <Card className="bg-white dark:bg-[#1F2937] border-gray-200 dark:border-gray-700">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-[#6B7280] dark:text-[#9CA3AF]" />
                    <Input
                      placeholder="Search emails by sender, subject, or content..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white dark:bg-[#111827] border-gray-300 dark:border-gray-600 text-[#111827] dark:text-[#F9FAFB] focus:border-[#3B82F6] dark:focus:border-[#60A5FA]"
                    />
                  </div>
                  
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full md:w-40 bg-white dark:bg-[#111827] border-gray-300 dark:border-gray-600 text-[#111827] dark:text-[#F9FAFB]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-[#1F2937] border-gray-300 dark:border-gray-600">
                      <SelectItem value="date" className="text-[#111827] dark:text-[#F9FAFB]">Date</SelectItem>
                      <SelectItem value="sender" className="text-[#111827] dark:text-[#F9FAFB]">Sender</SelectItem>
                      <SelectItem value="subject" className="text-[#111827] dark:text-[#F9FAFB]">Subject</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={sortOrder} onValueChange={setSortOrder}>
                    <SelectTrigger className="w-full md:w-32 bg-white dark:bg-[#111827] border-gray-300 dark:border-gray-600 text-[#111827] dark:text-[#F9FAFB]">
                      <SelectValue placeholder="Order" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-[#1F2937] border-gray-300 dark:border-gray-600">
                      <SelectItem value="desc" className="text-[#111827] dark:text-[#F9FAFB]">Newest</SelectItem>
                      <SelectItem value="asc" className="text-[#111827] dark:text-[#F9FAFB]">Oldest</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={filterBy} onValueChange={setFilterBy}>
                    <SelectTrigger className="w-full md:w-32 bg-white dark:bg-[#111827] border-gray-300 dark:border-gray-600 text-[#111827] dark:text-[#F9FAFB]">
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-[#1F2937] border-gray-300 dark:border-gray-600">
                      <SelectItem value="all" className="text-[#111827] dark:text-[#F9FAFB]">All</SelectItem>
                      <SelectItem value="unread" className="text-[#111827] dark:text-[#F9FAFB]">Unread</SelectItem>
                      <SelectItem value="high" className="text-[#111827] dark:text-[#F9FAFB]">High Priority</SelectItem>
                      <SelectItem value="medium" className="text-[#111827] dark:text-[#F9FAFB]">Medium Priority</SelectItem>
                      <SelectItem value="low" className="text-[#111827] dark:text-[#F9FAFB]">Low Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-[#1F2937] border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-[#111827] dark:text-[#F9FAFB]">Email List ({filteredAndSortedEmails.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-200 dark:border-gray-700 hover:bg-transparent">
                        <TableHead className="text-[#6B7280] dark:text-[#9CA3AF] font-semibold">Sender</TableHead>
                        <TableHead className="text-[#6B7280] dark:text-[#9CA3AF] font-semibold">Subject</TableHead>
                        <TableHead className="text-[#6B7280] dark:text-[#9CA3AF] font-semibold">Date</TableHead>
                        <TableHead className="text-[#6B7280] dark:text-[#9CA3AF] font-semibold">Priority</TableHead>
                        <TableHead className="text-[#6B7280] dark:text-[#9CA3AF] font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAndSortedEmails.map((email) => (
                        <TableRow 
                          key={email.id} 
                          className={`cursor-pointer hover:bg-gray-50 dark:hover:bg-[#111827]/50 transition-colors border-gray-200 dark:border-gray-700 ${
                            !email.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                          } ${selectedEmail?.id === email.id ? 'bg-blue-100 dark:bg-blue-900/30' : ''}`}
                          onClick={() => handleEmailClick(email)}
                        >
                          <TableCell className="text-[#111827] dark:text-[#F9FAFB]">
                            <div className="flex items-center space-x-2">
                              {!email.read && <div className="w-2 h-2 bg-[#3B82F6] dark:bg-[#60A5FA] rounded-full"></div>}
                              <span className="truncate max-w-32">{email.sender}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-[#111827] dark:text-[#F9FAFB] truncate max-w-48">{email.subject}</TableCell>
                          <TableCell className="text-[#6B7280] dark:text-[#9CA3AF]">{formatDate(email.date)}</TableCell>
                          <TableCell>
                            <Badge className={`${getPriorityColor(email.priority)} text-xs font-medium`}>
                              {email.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleArchive(email.id);
                              }}
                              className="text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#EF4444] dark:hover:text-[#F87171] hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Archive className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {selectedEmail && (
              <Card className="bg-white dark:bg-[#1F2937] border-gray-200 dark:border-gray-700">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-[#111827] dark:text-[#F9FAFB] mb-2">{selectedEmail.subject}</CardTitle>
                      <div className="text-sm text-[#6B7280] dark:text-[#9CA3AF] space-y-1">
                        <p><span className="font-medium">From:</span> {selectedEmail.sender}</p>
                        <p><span className="font-medium">Date:</span> {formatDate(selectedEmail.date)}</p>
                      </div>
                    </div>
                    <Badge className={getPriorityColor(selectedEmail.priority)}>
                      {selectedEmail.priority}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="prose max-w-none">
                    <p className="text-[#111827] dark:text-[#F9FAFB] leading-relaxed">{selectedEmail.summary}</p>
                  </div>
                  <div className="flex space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button 
                      onClick={() => setShowReplyForm(!showReplyForm)}
                      className="bg-[#3B82F6] hover:bg-[#2563EB] dark:bg-[#60A5FA] dark:hover:bg-[#3B82F6] text-white"
                    >
                      <Reply className="w-4 h-4 mr-2" />
                      {showReplyForm ? 'Hide Reply' : 'Reply'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailManagement;
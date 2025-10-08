const userEmail = import.meta.env.VITE_USER_EMAIL?.replace(/^"|"$/g, '') || "";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Mail, Search, Filter, Reply, Clock, Archive, Moon, Sun, RefreshCw, AlertCircle } from 'lucide-react';
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(false);

  useEffect(() => {
    loadEmails();
  }, []);

  const loadEmails = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await emailService.getTodaysEmails();
      setEmails(data.emails || []);
    } catch (err) {
      setError('Erreur lors du chargement des emails.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailClick = (email) => {
    setSelectedEmail(email);
    setShowReplyForm(false);
  };

  const handleReplySent = () => {
    setShowReplyForm(false);
    loadEmails();
  };

  const handleArchive = (id) => {
  };

  const formatDate = (date) => {
    if (!date) return '';
    if (typeof date === 'number' || /^\d{13}$/.test(date)) {
      return new Date(Number(date)).toLocaleString();
    }
    const d = new Date(date);
    if (isNaN(d.getTime())) return date; 
    return d.toLocaleString();
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-400 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-300 text-gray-800';
    }
  };

  console.log('userEmail (VITE_USER_EMAIL):', userEmail);
  console.log('emails (avant filtrage):', emails);

  const filteredAndSortedEmails = emails
    .filter(email => {
      if (email.to) {
        const toField = Array.isArray(email.to) ? email.to : [email.to];
        return toField.some(addr =>
          addr && addr.toLowerCase().replace(/\s+/g, '') === userEmail.toLowerCase().replace(/\s+/g, '')
        );
      }
      return true;
    })
    .filter(email => {
      if (filterBy === 'unread') return !email.read;
      if (filterBy === 'high') return email.priority === 'high';
      if (filterBy === 'medium') return email.priority === 'medium';
      if (filterBy === 'low') return email.priority === 'low';
      return true;
    })
    .filter(email => {
      const term = searchTerm.toLowerCase();
      return (
        email.sender?.toLowerCase().includes(term) ||
        email.subject?.toLowerCase().includes(term) ||
        email.summary?.toLowerCase().includes(term)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'desc'
          ? new Date(b.date) - new Date(a.date)
          : new Date(a.date) - new Date(b.date);
      }
      if (sortBy === 'sender') {
        return sortOrder === 'desc'
          ? b.sender.localeCompare(a.sender)
          : a.sender.localeCompare(b.sender);
      }
      if (sortBy === 'subject') {
        return sortOrder === 'desc'
          ? b.subject.localeCompare(a.subject)
          : a.subject.localeCompare(b.subject);
      }
      return 0;
    });

  return (
    <div className="min-h-screen w-full transition-colors duration-200 bg-gradient-to-br from-[#f3f4f6] to-[#e0e7ef] dark:from-[#111827] dark:to-[#23263a] flex flex-col">
      <header className="bg-white/90 dark:bg-[#1F2937]/90 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20 w-full px-20 py-4 flex items-center justify-between shadow-md backdrop-blur">
        <div className="flex items-center space-x-3">
          <Mail className="h-8 w-8 text-[#3B82F6] dark:text-[#60A5FA]" />
          <h1 className="text-3xl font-bold text-[#111827] dark:text-[#F9FAFB]">Email Management</h1>
          {loading && <RefreshCw className="h-6 w-6 animate-spin text-[#3B82F6] dark:text-[#60A5FA]" />}
        </div>
        <div className="flex items-center space-x-3">
          <Button onClick={loadEmails} variant="outline" size="sm" className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"><RefreshCw className="h-4 w-4"/></Button>
          <Button onClick={toggleTheme} variant="outline" size="sm" className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800">{isDark?<Sun className="h-4 w-4"/>:<Moon className="h-4 w-4"/>}</Button>
        </div>
      </header>
      <main className="flex-1 flex flex-col w-full py-10">
        {error && (
          <div className="mb-6 mx-6 flex items-center space-x-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
            <Button onClick={loadEmails} variant="outline" size="sm" className="ml-auto border-red-200 dark:border-red-800">Réessayer</Button>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-12 w-full px-2 sm:px-4 md:px-8 lg:px-12">
          <div className="flex flex-col gap-8">
            <Card className="bg-white dark:bg-[#1F2937] border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-3"><CardTitle className="text-[#111827] dark:text-[#F9FAFB] text-lg">Aperçu</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-[#F9FAFB] dark:bg-[#111827]">
                  <div className="flex items-center space-x-2"><Mail className="h-5 w-5 text-[#3B82F6] dark:text-[#60A5FA]" /><span className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Total</span></div>
                  <span className="text-2xl font-bold text-[#111827] dark:text-[#F9FAFB]">{emails.length}</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-[#F9FAFB] dark:bg-[#111827]">
                  <div className="flex items-center space-x-2"><Clock className="h-5 w-5 text-orange-600 dark:text-orange-400"/><span className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Non lus</span></div>
                  <span className="text-2xl font-bold text-[#111827] dark:text-[#F9FAFB]">{emails.filter(e=>!e.read).length}</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-[#F9FAFB] dark:bg-[#111827]">
                  <div className="flex items-center space-x-2"><Filter className="h-5 w-5 text-[#EF4444] dark:text-[#F87171]" /><span className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Priorité haute</span></div>
                  <span className="text-2xl font-bold text-[#111827] dark:text-[#F9FAFB]">{emails.filter(e=>e.priority==='high').length}</span>
                </div>
              </CardContent>
            </Card>
            <AIEmailSummary />
          </div>
          <div className="flex flex-col gap-8">
            <Card className="bg-white dark:bg-[#1F2937] border-gray-200 dark:border-gray-700">
              <CardContent className="p-6 flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-[300px] lg:min-w-[400px] relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-[#6B7280] dark:text-[#9CA3AF]"/>
                  <Input placeholder="Search emails by sender, subject, or content..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} className="pl-10 bg-white dark:bg-[#111827] border-gray-300 dark:border-gray-600 text-[#111827] dark:text-[#F9FAFB] focus:border-[#3B82F6] dark:focus:border-[#60A5FA]"/>
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 bg-white dark:bg-[#111827] border-gray-300 dark:border-gray-600 text-[#111827] dark:text-[#F9FAFB]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-[#1F2937] border-gray-300 dark:border-gray-600">
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="sender">Sender</SelectItem>
                    <SelectItem value="subject">Subject</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger className="w-36 bg-white dark:bg-[#111827] border-gray-300 dark:border-gray-600 text-[#111827] dark:text-[#F9FAFB]">
                    <SelectValue placeholder="Order" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-[#1F2937] border-gray-300 dark:border-gray-600">
                    <SelectItem value="desc">Newest</SelectItem>
                    <SelectItem value="asc">Oldest</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger className="w-36 bg-white dark:bg-[#111827] border-gray-300 dark:border-gray-600 text-[#111827] dark:text-[#F9FAFB]">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-[#1F2937] border-gray-300 dark:border-gray-600">
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="unread">Unread</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="low">Low Priority</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-[#1F2937] border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-3"><CardTitle className="text-[#111827] dark:text-[#F9FAFB]">Email List ({filteredAndSortedEmails.length})</CardTitle></CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-200 dark:border-gray-700 hover:bg-transparent">
                      <TableHead>Sender</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedEmails.map(email => (
                      <TableRow key={email.id} className={`cursor-pointer hover:bg-gray-50 dark:hover:bg-[#111827]/50 transition-colors border-gray-200 dark:border-gray-700 ${!email.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''} ${selectedEmail?.id===email.id?'bg-blue-100 dark:bg-blue-900/30':''}`} onClick={()=>handleEmailClick(email)}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {!email.read && <div className="w-2 h-2 bg-[#3B82F6] dark:bg-[#60A5FA] rounded-full"></div>}
                            <span className="truncate max-w-[150px]">{email.sender}</span>
                          </div>
                        </TableCell>
                        <TableCell className="truncate max-w-[300px]">{email.subject}</TableCell>
                        <TableCell>{formatDate(email.date)}</TableCell>
                        <TableCell><Badge className={`${getPriorityColor(email.priority)} text-xs font-medium`}>{email.priority}</Badge></TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={e=>{e.stopPropagation(); handleArchive(email.id)}} className="hover:text-[#EF4444] dark:hover:text-[#F87171] hover:bg-red-50 dark:hover:bg-red-900/20"><Archive className="h-4 w-4"/></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            {selectedEmail && (
              <>
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
                      <Badge className={getPriorityColor(selectedEmail.priority)}>{selectedEmail.priority}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-[#111827] dark:text-[#F9FAFB]">{selectedEmail.summary}</p>
                    <div className="flex space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <Button onClick={()=>setShowReplyForm(!showReplyForm)} className="bg-[#3B82F6] hover:bg-[#2563EB] dark:bg-[#60A5FA] dark:hover:bg-[#3B82F6] text-white">
                        <Reply className="w-4 h-4 mr-2"/>{showReplyForm?'Hide Reply':'Reply'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                {showReplyForm && <EmailReplyForm selectedEmail={selectedEmail} onClose={()=>setShowReplyForm(false)} onReplySent={handleReplySent}/>}  
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
export default EmailManagement;

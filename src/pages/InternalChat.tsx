import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Search, Phone, Video, MoreVertical, Smile, Paperclip, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

// Demo chat data
const demoContacts = [
  { id: '1', name: 'রহিম আহমেদ', avatar: '', status: 'online', lastMessage: 'প্রজেক্ট রিপোর্ট পাঠিয়েছি', time: '২ মিনিট আগে', unread: 2 },
  { id: '2', name: 'করিম সাহেব', avatar: '', status: 'offline', lastMessage: 'ধন্যবাদ!', time: '১ ঘন্টা আগে', unread: 0 },
  { id: '3', name: 'সালমা বেগম', avatar: '', status: 'online', lastMessage: 'মিটিং কখন?', time: '৩ ঘন্টা আগে', unread: 1 },
  { id: '4', name: 'জাহিদ হাসান', avatar: '', status: 'away', lastMessage: 'ওকে, বুঝলাম।', time: 'গতকাল', unread: 0 },
  { id: '5', name: 'নাসরিন আক্তার', avatar: '', status: 'online', lastMessage: 'ফাইল পেয়েছি', time: 'গতকাল', unread: 0 },
];

const demoMessages = [
  { id: '1', sender: 'other', name: 'রহিম আহমেদ', message: 'আসসালামু আলাইকুম, কেমন আছেন?', time: '১০:৩০ AM' },
  { id: '2', sender: 'me', name: 'আমি', message: 'ওয়ালাইকুম আসসালাম, আলহামদুলিল্লাহ, আপনি?', time: '১০:৩১ AM' },
  { id: '3', sender: 'other', name: 'রহিম আহমেদ', message: 'ভালো আছি। প্রজেক্টের আপডেট কী?', time: '১০:৩২ AM' },
  { id: '4', sender: 'me', name: 'আমি', message: 'প্রজেক্ট ৮০% সম্পন্ন। আগামীকাল ফাইনাল রিভিউ।', time: '১০:৩৩ AM' },
  { id: '5', sender: 'other', name: 'রহিম আহমেদ', message: 'চমৎকার! রিপোর্ট পাঠাতে পারবেন?', time: '১০:৩৪ AM' },
  { id: '6', sender: 'me', name: 'আমি', message: 'অবশ্যই, এখনই পাঠাচ্ছি।', time: '১০:৩৫ AM' },
  { id: '7', sender: 'other', name: 'রহিম আহমেদ', message: 'প্রজেক্ট রিপোর্ট পাঠিয়েছি', time: '১০:৪০ AM' },
];

const statusColors = {
  online: 'bg-success',
  offline: 'bg-muted-foreground',
  away: 'bg-warning',
};

export default function InternalChat() {
  const [selectedContact, setSelectedContact] = useState(demoContacts[0]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(demoMessages);
  const [searchQuery, setSearchQuery] = useState('');

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleSend = () => {
    if (!message.trim()) return;
    const newMessage = {
      id: Date.now().toString(),
      sender: 'me',
      name: 'আমি',
      message: message.trim(),
      time: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([...messages, newMessage]);
    setMessage('');
  };

  const filteredContacts = demoContacts.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-120px)] flex gap-4">
      {/* Contacts List */}
      <Card className="w-80 flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            চ্যাট
          </CardTitle>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-full">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={cn(
                  'flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/50 transition-colors',
                  selectedContact.id === contact.id && 'bg-muted'
                )}
              >
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={contact.avatar} />
                    <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
                  </Avatar>
                  <span className={cn(
                    'absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background',
                    statusColors[contact.status as keyof typeof statusColors]
                  )} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium truncate">{contact.name}</p>
                    <span className="text-xs text-muted-foreground">{contact.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{contact.lastMessage}</p>
                </div>
                {contact.unread > 0 && (
                  <span className="bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {contact.unread}
                  </span>
                )}
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="flex-1 flex flex-col">
        {/* Chat Header */}
        <CardHeader className="border-b pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar>
                  <AvatarImage src={selectedContact.avatar} />
                  <AvatarFallback>{getInitials(selectedContact.name)}</AvatarFallback>
                </Avatar>
                <span className={cn(
                  'absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background',
                  statusColors[selectedContact.status as keyof typeof statusColors]
                )} />
              </div>
              <div>
                <p className="font-medium">{selectedContact.name}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedContact.status === 'online' ? 'অনলাইন' : 
                   selectedContact.status === 'away' ? 'দূরে' : 'অফলাইন'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Messages */}
        <CardContent className="flex-1 p-4 overflow-hidden">
          <ScrollArea className="h-full pr-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'flex',
                    msg.sender === 'me' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div className={cn(
                    'max-w-[70%] rounded-2xl px-4 py-2',
                    msg.sender === 'me' 
                      ? 'bg-primary text-primary-foreground rounded-br-sm' 
                      : 'bg-muted rounded-bl-sm'
                  )}>
                    <p>{msg.message}</p>
                    <p className={cn(
                      'text-xs mt-1',
                      msg.sender === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    )}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>

        {/* Message Input */}
        <div className="border-t p-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Smile className="h-4 w-4" />
            </Button>
            <Input
              placeholder="মেসেজ লিখুন..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1"
            />
            <Button onClick={handleSend} disabled={!message.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

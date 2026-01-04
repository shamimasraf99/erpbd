import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, User, Sparkles, Lightbulb, BarChart3, FileText } from "lucide-react";

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
}

const suggestions = [
  { icon: BarChart3, text: "এই মাসের বিক্রয় রিপোর্ট দেখাও" },
  { icon: Lightbulb, text: "কিভাবে ক্লায়েন্ট সন্তুষ্টি বাড়ানো যায়?" },
  { icon: FileText, text: "বকেয়া ইনভয়েসের তালিকা দাও" },
  { icon: Sparkles, text: "পরবর্তী সপ্তাহের টাস্ক প্ল্যান করো" },
];

const initialMessages: Message[] = [
  {
    id: 1,
    role: 'assistant',
    content: 'আসসালামু আলাইকুম! আমি আপনার AI সহায়ক। ব্যবসা সংক্রান্ত যেকোনো প্রশ্ন করুন - বিক্রয়, আর্থিক বিশ্লেষণ, কর্মচারী ব্যবস্থাপনা, বা প্রজেক্ট পরিকল্পনা সম্পর্কে। আমি সাহায্য করতে প্রস্তুত!'
  }
];

const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        'বিক্রয়': 'এই মাসে আপনার মোট বিক্রয় ৳৫,০০,০০০ হয়েছে। গত মাসের তুলনায় ১৫% বেশি। সবচেয়ে বেশি বিক্রি হয়েছে ওয়েবসাইট ডেভেলপমেন্ট সার্ভিস।',
        'ইনভয়েস': 'বর্তমানে ৩টি বকেয়া ইনভয়েস আছে মোট ৳২,৫০,০০০ টাকার। সবচেয়ে পুরনোটি ১৫ দিন আগের।',
        'কর্মচারী': 'আপনার কোম্পানিতে বর্তমানে ৫ জন সক্রিয় কর্মচারী আছেন। এই মাসে উপস্থিতির হার ৯২%।',
        'প্রজেক্ট': 'বর্তমানে ৩টি সক্রিয় প্রজেক্ট চলছে। ২টি সময়সীমার মধ্যে আছে এবং ১টিতে সামান্য বিলম্ব হচ্ছে।',
      };

      let response = 'আপনার প্রশ্নের উত্তর খুঁজছি। আপনি নির্দিষ্ট বিষয়ে জানতে চাইলে আরও বিস্তারিত বলুন। যেমন: বিক্রয়, ইনভয়েস, কর্মচারী, বা প্রজেক্ট সম্পর্কে।';

      for (const [key, value] of Object.entries(responses)) {
        if (input.includes(key)) {
          response = value;
          break;
        }
      }

      const assistantMessage: Message = {
        id: messages.length + 2,
        role: 'assistant',
        content: response
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (text: string) => {
    setInput(text);
  };

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            AI সহায়তা
          </h1>
          <p className="text-muted-foreground">আপনার ব্যবসার জন্য বুদ্ধিমান সহায়ক</p>
        </div>
      </div>

      <Card className="flex-1 flex flex-col">
        <CardHeader className="border-b">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            চ্যাট সহায়ক
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {messages.length === 1 && (
            <div className="p-4 border-t bg-muted/30">
              <p className="text-sm text-muted-foreground mb-3">সাজেশন:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="justify-start h-auto py-2 px-3"
                    onClick={() => handleSuggestionClick(suggestion.text)}
                  >
                    <suggestion.icon className="h-4 w-4 mr-2 shrink-0" />
                    <span className="text-left text-xs">{suggestion.text}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="আপনার প্রশ্ন লিখুন..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1"
              />
              <Button onClick={handleSend} disabled={!input.trim() || isTyping}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAssistant;

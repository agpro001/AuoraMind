import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Mic, MicOff, Sparkles, BookOpen, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  type: 'user' | 'tutor';
  content: string;
  timestamp: Date;
}

interface TutorChatProps {
  onClose: () => void;
  currentUser: any;
}

export const TutorChat: React.FC<TutorChatProps> = ({ onClose, currentUser }) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'tutor',
      content: `Hello${currentUser ? ` ${currentUser.name}` : ''}! 👋 I'm your AI tutor powered by advanced AI. I can help you understand any topic, solve problems step-by-step, and provide real-world examples. What would you like to learn today?`,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const conversationHistory = [...messages, userMessage].map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

      const { data, error } = await supabase.functions.invoke('ai-tutor', {
        body: { 
          messages: conversationHistory,
          includeWebSearch: true 
        }
      });

      if (error) throw error;

      if (data.error) {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const tutorResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'tutor',
        content: data.content,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, tutorResponse]);
    } catch (error) {
      console.error('Error calling AI tutor:', error);
      toast({
        title: "Error",
        description: "Failed to get response from AI tutor. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    toast({
      title: "Voice Input",
      description: isListening ? "Voice input stopped" : "Voice input started (feature coming soon)",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="glass-card w-full max-w-5xl h-[85vh] flex flex-col animate-scale-in shadow-2xl">
        {/* Enhanced Header with gradient */}
        <div className="relative flex items-center justify-between p-6 border-b border-border/30 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10">
          <div className="flex items-center space-x-4">
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 bg-gradient-primary rounded-2xl animate-pulse-3d opacity-20"></div>
              <div className="relative w-full h-full bg-gradient-primary rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                🤖
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">AI Tutor</h3>
              <div className="flex items-center space-x-2 mt-1">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <p className="text-sm text-muted-foreground">Powered by Advanced AI • Real-time Learning</p>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-muted/30 transition-all duration-300 hover:rotate-90"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Feature Pills */}
        <div className="px-6 py-4 border-b border-border/20 bg-card/30">
          <div className="flex flex-wrap gap-2">
            <div className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 flex items-center space-x-2 text-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Step-by-Step Solutions</span>
            </div>
            <div className="px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 flex items-center space-x-2 text-sm">
              <BookOpen className="w-4 h-4 text-secondary" />
              <span>Real Study Materials</span>
            </div>
            <div className="px-4 py-2 rounded-full bg-success/10 border border-success/20 flex items-center space-x-2 text-sm">
              <Zap className="w-4 h-4 text-success" />
              <span>Instant Answers</span>
            </div>
          </div>
        </div>

        {/* Messages with enhanced styling */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={`max-w-[85%] p-5 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
                  message.type === 'user'
                    ? 'bg-gradient-primary text-primary-foreground ml-4 shadow-lg'
                    : 'glass border bg-card/60 mr-4 shadow-md'
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
                
                <div className="text-xs opacity-70 mt-3 flex items-center space-x-2">
                  <span>{message.timestamp.toLocaleTimeString()}</span>
                  {message.type === 'tutor' && (
                    <span className="flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>AI Generated</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start animate-slide-up">
              <div className="glass border bg-card/60 p-5 rounded-2xl mr-4 shadow-md">
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-3 h-3 bg-success rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-muted-foreground">AI is thinking deeply...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Enhanced Input */}
        <div className="p-6 border-t border-border/30 bg-gradient-to-t from-card/50 to-transparent">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything... I'm here to help you learn! 🚀"
                className="w-full p-4 border-2 border-border/50 rounded-2xl resize-none bg-background/80 backdrop-blur-sm focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all duration-300 shadow-inner"
                rows={2}
                disabled={isLoading}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <button
                onClick={toggleListening}
                className={`p-4 rounded-xl transition-all duration-300 hover:scale-110 ${
                  isListening ? 'bg-error text-error-foreground shadow-lg shadow-error/30' : 'bg-muted/30 hover:bg-muted/50'
                }`}
                title={isListening ? 'Stop listening' : 'Voice input'}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="p-4 bg-gradient-primary text-primary-foreground rounded-xl hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-primary/30"
                title="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="mt-3 text-xs text-muted-foreground text-center flex items-center justify-center space-x-4">
            <span className="flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>Powered by AI</span>
            </span>
            <span>•</span>
            <span>Press Enter to send</span>
            <span>•</span>
            <span>Shift+Enter for new line</span>
          </div>
        </div>
      </div>
    </div>
  );
};
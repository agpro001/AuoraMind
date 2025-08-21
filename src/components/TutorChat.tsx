
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Mic, MicOff, Volume2, VolumeX, RotateCcw, Lightbulb } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'tutor';
  content: string;
  timestamp: Date;
  confidence?: number;
  steps?: string[];
}

interface TutorChatProps {
  onClose: () => void;
  currentUser: any;
}

export const TutorChat: React.FC<TutorChatProps> = ({ onClose, currentUser }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'tutor',
      content: `Hello${currentUser ? ` ${currentUser.name}` : ''}! I'm your AI tutor. I can help you with explanations, hints, step-by-step solutions, and practice questions. What would you like to learn about today?`,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'explain' | 'hint' | 'solve' | 'check' | 'practice'>('explain');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const modes = [
    { key: 'explain', label: 'Explain', icon: '💡' },
    { key: 'hint', label: 'Hint', icon: '🔍' },
    { key: 'solve', label: 'Solve Step-by-Step', icon: '📝' },
    { key: 'check', label: 'Check Answer', icon: '✓' },
    { key: 'practice', label: 'Practice Question', icon: '🎯' }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateTutorResponse = (userMessage: string, selectedMode: string): Message => {
    // Simulate AI tutor responses based on mode
    let response = '';
    let steps: string[] = [];
    let confidence = 0.85 + Math.random() * 0.14; // Random confidence between 0.85-0.99

    switch (selectedMode) {
      case 'explain':
        response = `Great question! Let me explain this concept step by step. ${userMessage.toLowerCase().includes('math') ? 'In mathematics, we often break down problems into smaller, manageable parts.' : 'This is an important topic that builds on fundamental concepts.'} 

The key principle here is understanding the underlying logic. Would you like me to provide a specific example or go deeper into any particular aspect?`;
        break;
      
      case 'hint':
        response = `Here's a helpful hint: Think about what you already know about this topic. Often the answer lies in applying basic principles you've already learned. 

Try asking yourself: What information do I have? What am I trying to find? What steps might connect these two points?

Would you like another hint, or are you ready to try solving it yourself?`;
        break;
      
      case 'solve':
        response = `Let me solve this step-by-step for you:`;
        steps = [
          'First, identify what we know and what we need to find',
          'Apply the relevant formula or principle',
          'Substitute the known values',
          'Perform the calculations carefully',
          'Check our answer to make sure it makes sense'
        ];
        break;
      
      case 'check':
        response = `Let me check your answer! Based on what you've shown me, your approach looks ${Math.random() > 0.3 ? 'correct' : 'mostly correct with a small adjustment needed'}. 

${Math.random() > 0.5 ? 'Great job following the proper steps!' : 'Consider double-checking your calculation in step 3.'} 

Would you like me to explain any part in more detail?`;
        break;
      
      case 'practice':
        response = `Here's a practice question for you:

If you're working on math: "A rectangle has a length of 12 units and a width of 8 units. What is its area and perimeter?"

If you're studying science: "Explain why ice floats on water using what you know about density."

Take your time and try to work through it. I'm here if you need hints!`;
        break;
      
      default:
        response = `I understand you'd like help with "${userMessage}". I'm working entirely offline using my local knowledge base. While I strive to be accurate, please let me know if something doesn't seem right!

How can I best assist you with this topic?`;
    }

    return {
      id: Date.now().toString(),
      type: 'tutor',
      content: response,
      timestamp: new Date(),
      confidence,
      steps: steps.length > 0 ? steps : undefined
    };
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI processing time
    setTimeout(() => {
      const tutorResponse = generateTutorResponse(inputValue, mode);
      setMessages(prev => [...prev, tutorResponse]);
      setIsLoading(false);
    }, 1000 + Math.random() * 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // In a real implementation, this would integrate with Web Speech API
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-4xl h-[80vh] flex flex-col animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-2xl">
              🤖
            </div>
            <div>
              <h3 className="text-xl font-bold">AI Tutor</h3>
              <p className="text-sm text-muted-foreground">Always here to help • Offline</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="p-4 border-b border-border/20">
          <div className="flex flex-wrap gap-2">
            {modes.map((modeOption) => (
              <button
                key={modeOption.key}
                onClick={() => setMode(modeOption.key as any)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === modeOption.key
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/20 hover:bg-muted/30'
                }`}
              >
                <span className="mr-1">{modeOption.icon}</span>
                {modeOption.label}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-primary text-primary-foreground ml-4'
                    : 'glass border bg-card/50 mr-4'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                
                {message.steps && (
                  <div className="mt-3 space-y-2">
                    {message.steps.map((step, index) => (
                      <div key={index} className="flex items-start space-x-2 text-sm">
                        <span className="bg-primary/20 text-primary rounded px-2 py-1 text-xs font-medium min-w-[24px] text-center">
                          {index + 1}
                        </span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {message.confidence && (
                  <div className="mt-2 pt-2 border-t border-border/20 text-xs text-muted-foreground">
                    Confidence: {Math.round(message.confidence * 100)}%
                  </div>
                )}
                
                <div className="text-xs opacity-60 mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="glass border bg-card/50 p-4 rounded-2xl mr-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  <span className="text-sm text-muted-foreground ml-2">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-6 border-t border-border/20">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Ask me anything in ${modes.find(m => m.key === mode)?.label} mode...`}
                className="w-full p-3 border border-border rounded-lg resize-none bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                rows={2}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <button
                onClick={toggleListening}
                className={`p-3 rounded-lg transition-colors ${
                  isListening ? 'bg-error text-error-foreground' : 'bg-muted/20 hover:bg-muted/30'
                }`}
                title={isListening ? 'Stop listening' : 'Voice input'}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="p-3 bg-primary text-primary-foreground rounded-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                title="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="mt-2 text-xs text-muted-foreground text-center">
            Running offline • Press Enter to send • Shift+Enter for new line
          </div>
        </div>
      </div>
    </div>
  );
};

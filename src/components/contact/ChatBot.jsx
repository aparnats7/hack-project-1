import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { MessageSquare, X, Send, Calendar, DollarSign } from 'lucide-react';

const ChatBot = ({ onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: 'Hello! I\'m here to help you with pricing and scheduling a demo. How can I assist you today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, {
      type: 'user',
      content: input,
      timestamp: new Date(),
    }]);

    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: 'bot',
        content: 'I can help you schedule a demo or provide pricing information. Would you like to:',
        timestamp: new Date(),
      }]);
    }, 1000);

    setInput('');
  };

  const handleQuickAction = (action) => {
    setMessages(prev => [...prev, {
      type: 'user',
      content: action,
      timestamp: new Date(),
    }]);

    // Simulate bot response based on action
    setTimeout(() => {
      let response = '';
      if (action === 'Schedule Demo') {
        response = 'Great! I can help you schedule a demo. Our next available slots are:';
      } else if (action === 'View Pricing') {
        response = 'Our pricing plans start from $99/month. Would you like to see the detailed pricing structure?';
      }
      setMessages(prev => [...prev, {
        type: 'bot',
        content: response,
        timestamp: new Date(),
      }]);
    }, 1000);
  };

  return (
    <div className="relative">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      ) : (
        <div className="absolute bottom-0 right-0 w-80 bg-card rounded-lg shadow-xl border border-border animate-fade-in-up">
          {/* Chat Header */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Sales Assistant</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsOpen(false);
                onClose();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2 mb-4">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => handleQuickAction('Schedule Demo')}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Demo
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => handleQuickAction('View Pricing')}
              >
                <DollarSign className="h-4 w-4 mr-2" />
                View Pricing
              </Button>
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot; 
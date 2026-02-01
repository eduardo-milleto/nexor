import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Minimize2, Settings } from 'lucide-react';

// Ícone customizado do Planeta Júpiter com anel
const JupiterPlanet = ({ size = 32, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
    <defs>
      <linearGradient id="planetGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.7" />
      </linearGradient>
      <radialGradient id="glowGradient" cx="30%" cy="30%">
        <stop offset="0%" stopColor="white" stopOpacity="0.4" />
        <stop offset="70%" stopColor="white" stopOpacity="0" />
      </radialGradient>
    </defs>
    
    {/* Anel completo - PRETO */}
    <ellipse 
      cx="16" 
      cy="16" 
      rx="20" 
      ry="6" 
      fill="none" 
      stroke="#000000" 
      strokeWidth="2.5"
      opacity="0.9"
      transform="rotate(-20 16 16)"
    />
    
    {/* Planeta principal com gradiente */}
    <circle cx="16" cy="16" r="9" fill="url(#planetGradient)"/>
    
    {/* Brilho/reflexo no planeta */}
    <ellipse 
      cx="13" 
      cy="13" 
      rx="4" 
      ry="5" 
      fill="url(#glowGradient)"
    />
  </svg>
);

interface AIMessage {
  id: string;
  text: string;
  time: string;
  isUser: boolean;
}

interface JupiterAIProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  hideButton?: boolean;
}

export function JupiterAI({ isOpen, setIsOpen, hideButton = false }: JupiterAIProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '1',
      text: 'Olá! Sou Jupiter, sua assistente inteligente. Como posso ajudar você hoje?',
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      isUser: false,
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async () => {
    if (message.trim()) {
      const userMessage: AIMessage = {
        id: Date.now().toString(),
        text: message,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        isUser: true,
      };
      
      setMessages([...messages, userMessage]);
      setMessage('');
      setIsTyping(true);

      // Simulate AI response
      setTimeout(() => {
        const aiResponse: AIMessage = {
          id: (Date.now() + 1).toString(),
          text: 'Entendi sua solicitação! Deixe-me ajudá-lo com isso. Analisei os dados e encontrei as melhores opções para você.',
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          isUser: false,
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsTyping(false);
      }, 2000);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && !hideButton && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-28 z-50 w-16 h-16 bg-gradient-to-br from-[#1fff94] to-[#00d976] rounded-full shadow-2xl shadow-[#1fff94]/50 flex items-center justify-center group overflow-hidden"
          >
            {/* Animated rings */}
            <motion.div
              className="absolute inset-0"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <div className="absolute inset-2 border-2 border-black/30 rounded-full" />
              <div className="absolute inset-4 border-2 border-black/20 rounded-full" />
            </motion.div>
            
            {/* Pulse animation */}
            <motion.div
              className="absolute inset-0 bg-[#1fff94] rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            
            {/* Ícone do Planeta Júpiter */}
            <JupiterPlanet size={32} className="text-black relative z-10" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* AI Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ 
              scale: isMinimized ? 0.95 : 1, 
              opacity: 1, 
              y: 0,
              height: isMinimized ? 'auto' : '600px'
            }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-28 z-50 w-96 bg-black/95 backdrop-blur-xl border border-[#1fff94]/30 rounded-2xl shadow-2xl shadow-[#1fff94]/20 overflow-hidden"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-[#1fff94]/20 via-[#00d976]/10 to-transparent border-b border-[#1fff94]/30 p-4">
              {/* Animated background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1fff94]/10 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <motion.div
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-10 h-10 bg-gradient-to-br from-[#1fff94] to-[#00d976] rounded-full flex items-center justify-center"
                    >
                      <JupiterPlanet size={20} className="text-black" />
                    </motion.div>
                  </div>
                  <div>
                    <h3 className="text-white font-bold">Jupiter AI</h3>
                    <p className="text-xs text-gray-400">Assistente Inteligente</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Settings size={16} className="text-gray-400" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Minimize2 size={16} className="text-gray-400" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(false)}
                    className="p-2 bg-white/5 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <X size={16} className="text-gray-400 hover:text-red-400" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Messages */}
            {!isMinimized && (
              <>
                <div className="h-[420px] overflow-y-auto p-4 space-y-4 custom-scrollbar-ai">
                  {/* Quick suggestions */}
                  {messages.length === 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="grid grid-cols-2 gap-2 mb-4"
                    >
                      {[
                        'Resumir vendas',
                        'Análise de dados',
                        'Criar relatório',
                        'Sugestões CRM'
                      ].map((suggestion, i) => (
                        <motion.button
                          key={i}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setMessage(suggestion)}
                          className="px-3 py-2 bg-gradient-to-br from-[#1fff94]/20 to-[#00d976]/20 border border-[#1fff94]/30 rounded-lg text-xs text-gray-200 hover:border-[#1fff94]/50 transition-all"
                        >
                          {suggestion}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}

                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${msg.isUser ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        {msg.isUser ? (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1fff94] to-[#00d976] flex items-center justify-center text-black font-bold text-sm">
                            U
                          </div>
                        ) : (
                          <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1fff94] to-[#00d976] flex items-center justify-center"
                          >
                            <JupiterPlanet size={16} className="text-black" />
                          </motion.div>
                        )}
                      </div>
                      
                      {/* Message bubble */}
                      <div className={`flex flex-col max-w-[75%] ${msg.isUser ? 'items-end' : 'items-start'}`}>
                        <div className={`relative px-4 py-2.5 rounded-2xl ${
                          msg.isUser
                            ? 'bg-gradient-to-br from-[#1fff94] to-[#00d976] text-black'
                            : 'bg-gradient-to-br from-[#1fff94]/30 to-[#00d976]/20 border border-[#1fff94]/30 text-white'
                        }`}>
                          {!msg.isUser && (
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1fff94]/10 to-transparent rounded-2xl"
                              animate={{ x: ['-100%', '200%'] }}
                              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            />
                          )}
                          <p className="text-sm relative z-10">{msg.text}</p>
                        </div>
                        <span className="text-xs text-gray-400 mt-1 px-1">{msg.time}</span>
                      </div>
                    </motion.div>
                  ))}

                  {/* Typing indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3"
                    >
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1fff94] to-[#00d976] flex items-center justify-center flex-shrink-0"
                      >
                        <JupiterPlanet size={16} className="text-black" />
                      </motion.div>
                      <div className="bg-gradient-to-br from-[#1fff94]/30 to-[#00d976]/20 border border-[#1fff94]/30 rounded-2xl px-4 py-3">
                        <div className="flex gap-1.5">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-2 h-2 bg-[#1fff94] rounded-full"
                              animate={{
                                y: [0, -8, 0],
                                opacity: [0.5, 1, 0.5],
                              }}
                              transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                delay: i * 0.15,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Input */}
                <div className="border-t border-[#1fff94]/30 p-4 bg-black/50">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Pergunte ao Jupiter..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#1fff94]/50 focus:bg-white/10 transition-all"
                      />
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSendMessage}
                      className="px-4 py-2.5 bg-gradient-to-r from-[#1fff94] to-[#00d976] rounded-xl hover:shadow-lg hover:shadow-[#1fff94]/50 transition-all"
                    >
                      <Send size={18} className="text-black" />
                    </motion.button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar-ai::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar-ai::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar-ai::-webkit-scrollbar-thumb {
          background: rgba(31, 255, 148, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar-ai::-webkit-scrollbar-thumb:hover {
          background: rgba(31, 255, 148, 0.5);
        }
      `}</style>
    </>
  );
}

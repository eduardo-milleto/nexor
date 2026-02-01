import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Minimize2, User, Paperclip, Smile, Search, ArrowLeft } from 'lucide-react';
import { Chat as ChatIcon } from '@mui/icons-material';

interface Message {
  id: string;
  sender: string;
  text: string;
  time: string;
  isCurrentUser: boolean;
}

interface Contact {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  online: boolean;
  unread?: number;
}

interface FloatingChatProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  hideButton?: boolean;
}

export function FloatingChat({ isOpen, setIsOpen, hideButton = false }: FloatingChatProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  
  const [contacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'Carlos Silva',
      lastMessage: 'O relatório de vendas do mês passado',
      lastMessageTime: '14:34',
      online: true,
      unread: 3,
    },
    {
      id: '2',
      name: 'Ana Costa',
      lastMessage: 'Perfeito! Vou revisar agora',
      lastMessageTime: '13:20',
      online: true,
    },
    {
      id: '3',
      name: 'Roberto Mendes',
      lastMessage: 'Reunião confirmada para amanhã',
      lastMessageTime: '12:15',
      online: false,
      unread: 1,
    },
    {
      id: '4',
      name: 'Juliana Santos',
      lastMessage: 'Obrigada pela ajuda!',
      lastMessageTime: '11:45',
      online: true,
    },
    {
      id: '5',
      name: 'Pedro Oliveira',
      lastMessage: 'Vamos discutir isso na próxima sprint',
      lastMessageTime: 'Ontem',
      online: false,
    },
    {
      id: '6',
      name: 'Mariana Rodrigues',
      lastMessage: 'Ótimo trabalho no projeto!',
      lastMessageTime: 'Ontem',
      online: true,
    },
  ]);

  const [messages, setMessages] = useState<Record<string, Message[]>>({
    '1': [
      {
        id: '1',
        sender: 'Carlos Silva',
        text: 'Oi, alguém pode me ajudar com o relatório?',
        time: '14:32',
        isCurrentUser: false,
      },
      {
        id: '2',
        sender: 'Você',
        text: 'Claro! Qual relatório você precisa?',
        time: '14:33',
        isCurrentUser: true,
      },
      {
        id: '3',
        sender: 'Carlos Silva',
        text: 'O relatório de vendas do mês passado',
        time: '14:34',
        isCurrentUser: false,
      },
    ],
    '2': [
      {
        id: '1',
        sender: 'Ana Costa',
        text: 'Enviei os documentos por email',
        time: '13:15',
        isCurrentUser: false,
      },
      {
        id: '2',
        sender: 'Você',
        text: 'Recebi! Muito obrigado',
        time: '13:18',
        isCurrentUser: true,
      },
      {
        id: '3',
        sender: 'Ana Costa',
        text: 'Perfeito! Vou revisar agora',
        time: '13:20',
        isCurrentUser: false,
      },
    ],
  });

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (message.trim() && selectedContact) {
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: 'Você',
        text: message,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        isCurrentUser: true,
      };
      
      setMessages(prev => ({
        ...prev,
        [selectedContact.id]: [...(prev[selectedContact.id] || []), newMessage],
      }));
      setMessage('');
    }
  };

  const handleContactClick = (contact: Contact) => {
    setSelectedContact(contact);
    setSearchQuery('');
  };

  const handleBack = () => {
    setSelectedContact(null);
  };

  const currentMessages = selectedContact ? messages[selectedContact.id] || [] : [];

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
            className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-[#1fff94] to-[#00d976] rounded-full shadow-2xl shadow-[#1fff94]/50 flex items-center justify-center group overflow-hidden"
          >
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
            
            {/* Icon */}
            <ChatIcon className="text-black relative z-10" style={{ fontSize: 32 }} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
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
            className="fixed bottom-6 right-6 z-50 w-96 bg-black/95 backdrop-blur-xl border border-[#1fff94]/30 rounded-2xl shadow-2xl shadow-[#1fff94]/20 overflow-hidden"
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
                  {selectedContact && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleBack}
                      className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <ArrowLeft size={20} className="text-gray-400" />
                    </motion.button>
                  )}
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#1fff94] to-[#00d976] rounded-full flex items-center justify-center">
                      {selectedContact ? (
                        <User size={20} className="text-black" />
                      ) : (
                        <ChatIcon style={{ fontSize: 20 }} className="text-black" />
                      )}
                    </div>
                    {selectedContact?.online && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-black" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-white font-bold">
                      {selectedContact ? selectedContact.name : 'Chat da Equipe'}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {selectedContact 
                        ? (selectedContact.online ? 'Online' : 'Offline')
                        : `${contacts.filter(c => c.online).length} membros online`
                      }
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
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
                    onClick={() => {
                      setIsOpen(false);
                      setSelectedContact(null);
                    }}
                    className="p-2 bg-white/5 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <X size={16} className="text-gray-400 hover:text-red-400" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Content */}
            {!isMinimized && (
              <>
                {!selectedContact ? (
                  // Contacts List View
                  <>
                    {/* Search Bar */}
                    <div className="p-4 border-b border-[#1fff94]/20">
                      <div className="relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Buscar pessoas..."
                          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#1fff94]/50 focus:bg-white/10 transition-all"
                        />
                      </div>
                    </div>

                    {/* Contacts List */}
                    <div className="h-[464px] overflow-y-auto custom-scrollbar">
                      {filteredContacts.map((contact) => (
                        <motion.div
                          key={contact.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                          onClick={() => handleContactClick(contact)}
                          className="p-4 border-b border-white/5 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {/* Avatar */}
                            <div className="relative flex-shrink-0">
                              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                                <User size={20} className="text-white" />
                              </div>
                              {contact.online && (
                                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-black" />
                              )}
                            </div>

                            {/* Contact Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="text-white font-medium text-sm truncate">
                                  {contact.name}
                                </h4>
                                <span className="text-xs text-gray-500 flex-shrink-0">
                                  {contact.lastMessageTime}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <p className="text-xs text-gray-400 truncate flex-1">
                                  {contact.lastMessage}
                                </p>
                                {contact.unread && contact.unread > 0 && (
                                  <div className="ml-2 min-w-[20px] h-5 bg-[#1fff94] rounded-full flex items-center justify-center px-1.5">
                                    <span className="text-xs text-black font-bold">
                                      {contact.unread}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </>
                ) : (
                  // Chat Conversation View
                  <>
                    <div className="h-[420px] overflow-y-auto p-4 space-y-4 custom-scrollbar">
                      {currentMessages.map((msg) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex gap-3 ${msg.isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                          {/* Avatar */}
                          <div className="flex-shrink-0">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              msg.isCurrentUser 
                                ? 'bg-gradient-to-br from-[#1fff94] to-[#00d976]' 
                                : 'bg-gradient-to-br from-purple-500 to-blue-500'
                            }`}>
                              <User size={16} className="text-white" />
                            </div>
                          </div>
                          
                          {/* Message bubble */}
                          <div className={`flex flex-col max-w-[70%] ${msg.isCurrentUser ? 'items-end' : 'items-start'}`}>
                            {!msg.isCurrentUser && (
                              <span className="text-xs text-gray-400 mb-1 px-1">{msg.sender}</span>
                            )}
                            <div className={`relative px-4 py-2 rounded-2xl ${
                              msg.isCurrentUser
                                ? 'bg-gradient-to-br from-[#1fff94] to-[#00d976] text-black'
                                : 'bg-white/10 border border-white/10 text-white'
                            }`}>
                              <p className="text-sm">{msg.text}</p>
                            </div>
                            <span className="text-xs text-gray-500 mt-1 px-1">{msg.time}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Input */}
                    <div className="border-t border-[#1fff94]/30 p-4 bg-black/50">
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <Paperclip size={18} className="text-gray-400" />
                        </motion.button>
                        
                        <div className="relative flex-1">
                          <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Digite sua mensagem..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#1fff94]/50 focus:bg-white/10 transition-all"
                          />
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <Smile size={18} className="text-gray-400" />
                        </motion.button>
                        
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
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(31, 255, 148, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(31, 255, 148, 0.5);
        }
      `}</style>
    </>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Send,
  Sparkles,
  Plus,
  MessageSquare,
  Trash2,
  Edit3,
  MoreVertical,
  Mic,
  Paperclip,
  StopCircle,
  Copy,
  RefreshCw,
  User,
  Bot
} from 'lucide-react';
import { AppHeader } from '@/app/components/shared/AppHeader';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Chat {
  id: number;
  title: string;
  messages: Message[];
  createdAt: Date;
}

interface GPTAppProps {
  onBack: () => void;
  language: string;
}

export function GPTApp({ onBack, language }: GPTAppProps) {
  const [chats, setChats] = useState<Chat[]>([
    {
      id: 1,
      title: 'Nova Conversa',
      messages: [],
      createdAt: new Date()
    }
  ]);
  const [currentChatId, setCurrentChatId] = useState(1);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const translations = {
    pt: {
      title: 'Jupiter AI',
      subtitle: 'Assistente inteligente',
      newChat: 'Nova Conversa',
      placeholder: 'Digite sua mensagem...',
      typing: 'Jupiter está digitando...',
      welcome: 'Como posso ajudar você hoje?',
      deleteChat: 'Excluir conversa',
      renameChat: 'Renomear',
      copy: 'Copiar',
      regenerate: 'Regenerar resposta',
      stop: 'Parar geração',
      attach: 'Anexar arquivo',
      voice: 'Mensagem de voz'
    },
    en: {
      title: 'Jupiter AI',
      subtitle: 'Intelligent assistant',
      newChat: 'New Chat',
      placeholder: 'Type your message...',
      typing: 'Jupiter is typing...',
      welcome: 'How can I help you today?',
      deleteChat: 'Delete chat',
      renameChat: 'Rename',
      copy: 'Copy',
      regenerate: 'Regenerate response',
      stop: 'Stop generating',
      attach: 'Attach file',
      voice: 'Voice message'
    },
    es: {
      title: 'Jupiter AI',
      subtitle: 'Asistente inteligente',
      newChat: 'Nueva Conversación',
      placeholder: 'Escribe tu mensaje...',
      typing: 'Jupiter está escribiendo...',
      welcome: '¿Cómo puedo ayudarte hoy?',
      deleteChat: 'Eliminar conversación',
      renameChat: 'Renombrar',
      copy: 'Copiar',
      regenerate: 'Regenerar respuesta',
      stop: 'Detener generación',
      attach: 'Adjuntar archivo',
      voice: 'Mensaje de voz'
    },
    fr: {
      title: 'Jupiter AI',
      subtitle: 'Assistant intelligent',
      newChat: 'Nouvelle Conversation',
      placeholder: 'Tapez votre message...',
      typing: 'Jupiter est en train d\'écrire...',
      welcome: 'Comment puis-je vous aider aujourd\'hui?',
      deleteChat: 'Supprimer la conversation',
      renameChat: 'Renommer',
      copy: 'Copier',
      regenerate: 'Régénérer la réponse',
      stop: 'Arrêter la génération',
      attach: 'Joindre un fichier',
      voice: 'Message vocal'
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  const currentChat = chats.find(chat => chat.id === currentChatId);

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNewChat = () => {
    const newChat: Chat = {
      id: chats.length + 1,
      title: t.newChat,
      messages: [],
      createdAt: new Date()
    };
    setChats([newChat, ...chats]);
    setCurrentChatId(newChat.id);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !currentChat) return;

    const userMessage: Message = {
      id: currentChat.messages.length + 1,
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    const updatedChats = chats.map(chat =>
      chat.id === currentChatId
        ? {
            ...chat,
            messages: [...chat.messages, userMessage],
            title: chat.messages.length === 0 ? inputMessage.slice(0, 30) + '...' : chat.title
          }
        : chat
    );

    setChats(updatedChats);
    setInputMessage('');
    setIsTyping(true);

    // Simular resposta da IA
    setTimeout(() => {
      const aiResponses = [
        'Entendo sua pergunta. Deixe-me ajudá-lo com isso. Como assistente da Nexor, estou aqui para fornecer informações precisas e úteis sobre todos os módulos do sistema.',
        'Ótima pergunta! Posso ajudá-lo de várias maneiras. O sistema Nexor possui módulos integrados de CRM, Financeiro, Estoque e muito mais. Como posso ser mais específico?',
        'Claro! Estou aqui para ajudar. O sistema Nexor é uma plataforma completa de gestão empresarial com IA integrada. Posso explicar qualquer funcionalidade em detalhes.',
        'Interessante! Vou te ajudar com isso. Como Jupiter AI, tenho acesso a todo o conhecimento sobre a plataforma Nexor e posso guiá-lo em qualquer processo.',
        'Perfeito! Deixe-me explicar. A Nexor oferece uma solução completa e integrada para gestão empresarial, com foco em automação e inteligência artificial.'
      ];

      const aiMessage: Message = {
        id: currentChat.messages.length + 2,
        role: 'assistant',
        content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        timestamp: new Date()
      };

      setChats(prevChats =>
        prevChats.map(chat =>
          chat.id === currentChatId
            ? { ...chat, messages: [...chat.messages, aiMessage] }
            : chat
        )
      );
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleDeleteChat = (chatId: number) => {
    const filtered = chats.filter(chat => chat.id !== chatId);
    setChats(filtered);
    if (currentChatId === chatId && filtered.length > 0) {
      setCurrentChatId(filtered[0].id);
    } else if (filtered.length === 0) {
      handleNewChat();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-screen bg-black text-white flex overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence>
        {showSidebar && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-[280px] bg-gradient-to-b from-[#0a0a0a] to-black border-r border-white/10 flex flex-col"
          >
            {/* Sidebar Header */}
            <div className="p-4 border-b border-white/10">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNewChat}
                className="w-full px-4 py-3 bg-gradient-to-r from-[#1fff94] to-[#00d978] hover:from-[#00d978] hover:to-[#1fff94] rounded-xl flex items-center justify-center gap-2 text-black font-semibold transition-all"
              >
                <Plus size={20} />
                <span>{t.newChat}</span>
              </motion.button>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {chats.map((chat, index) => (
                <motion.div
                  key={chat.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setCurrentChatId(chat.id)}
                  className={`group relative px-3 py-3 rounded-xl cursor-pointer transition-all ${
                    currentChatId === chat.id
                      ? 'bg-white/10 border border-[#1fff94]/30'
                      : 'bg-white/5 hover:bg-white/10 border border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <MessageSquare size={18} className="text-[#1fff94] mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate font-medium">{chat.title}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {chat.messages.length} mensagens
                      </p>
                    </div>
                  </div>
                  {currentChatId === chat.id && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteChat(chat.id);
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-all"
                    >
                      <Trash2 size={14} className="text-red-400" />
                    </motion.button>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded-xl">
                <div className="w-8 h-8 bg-gradient-to-br from-[#1fff94] to-[#00d978] rounded-full flex items-center justify-center">
                  <Sparkles size={16} className="text-black" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">Jupiter AI</p>
                  <p className="text-xs text-gray-400">Versão V1</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-h-0">
        <AppHeader
          title={t.title}
          subtitle={t.subtitle}
          icon={Sparkles}
          onBack={onBack}
          actions={
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all"
            >
              <MessageSquare size={20} className="text-[#1fff94]" />
            </motion.button>
          }
        />

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 min-h-0">
          <div className="max-w-4xl mx-auto space-y-6">
            {currentChat?.messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="relative inline-block mb-6"
                >
                  <div className="absolute inset-0 bg-[#1fff94]/30 blur-3xl rounded-full" />
                  <div className="relative w-20 h-20 bg-gradient-to-br from-[#1fff94] to-[#00d978] rounded-3xl flex items-center justify-center">
                    <Sparkles size={40} className="text-black" strokeWidth={2} />
                  </div>
                </motion.div>
                <h2 className="text-2xl font-bold text-white mb-3">{t.welcome}</h2>
                <p className="text-gray-400 text-base">
                  Sou Jupiter, sua assistente de IA da Nexor. Como posso ajudar?
                </p>
              </motion.div>
            ) : (
              <>
                {currentChat?.messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-10 h-10 bg-gradient-to-br from-[#1fff94] to-[#00d978] rounded-xl flex items-center justify-center flex-shrink-0">
                        <Sparkles size={20} className="text-black" />
                      </div>
                    )}
                    <div className={`max-w-[70%] ${message.role === 'user' ? 'order-1' : ''}`}>
                      <div
                        className={`p-4 rounded-2xl ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-[#1fff94] to-[#00d978] text-black'
                            : 'bg-white/5 border border-white/10 text-white'
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {message.content}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-2 px-2">
                        <span className="text-xs text-gray-500">
                          {message.timestamp.toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        {message.role === 'assistant' && (
                          <div className="flex items-center gap-1">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-1.5 hover:bg-white/10 rounded-lg transition-all"
                              title={t.copy}
                            >
                              <Copy size={14} className="text-gray-500" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-1.5 hover:bg-white/10 rounded-lg transition-all"
                              title={t.regenerate}
                            >
                              <RefreshCw size={14} className="text-gray-500" />
                            </motion.button>
                          </div>
                        )}
                      </div>
                    </div>
                    {message.role === 'user' && (
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <User size={20} className="text-[#1fff94]" />
                      </div>
                    )}
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-[#1fff94] to-[#00d978] rounded-xl flex items-center justify-center">
                      <Sparkles size={20} className="text-black" />
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 1 }}
                          className="w-2 h-2 bg-[#1fff94] rounded-full"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                          className="w-2 h-2 bg-[#1fff94] rounded-full"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                          className="w-2 h-2 bg-[#1fff94] rounded-full"
                        />
                        <span className="text-sm text-gray-400 ml-2">{t.typing}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-white/10 bg-black/50 backdrop-blur-xl p-4 flex-shrink-0">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="flex items-end gap-3 bg-white/5 border border-white/10 rounded-2xl p-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 hover:bg-white/10 rounded-xl transition-all"
                  title={t.attach}
                >
                  <Paperclip size={20} className="text-gray-400" />
                </motion.button>
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t.placeholder}
                  rows={1}
                  className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 resize-none max-h-32"
                  style={{ minHeight: '24px' }}
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 hover:bg-white/10 rounded-xl transition-all"
                  title={t.voice}
                >
                  <Mic size={20} className="text-gray-400" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="p-3 bg-gradient-to-r from-[#1fff94] to-[#00d978] rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send size={20} className="text-black" />
                </motion.button>
              </div>
            </div>
            <p className="text-xs text-gray-500 text-center mt-3">
              Jupiter pode cometer erros. Considere verificar informações importantes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

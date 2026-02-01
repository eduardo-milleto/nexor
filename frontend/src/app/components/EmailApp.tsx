import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Star, 
  Archive, 
  Trash2, 
  Mail, 
  Send, 
  FileText, 
  Inbox, 
  MailOpen,
  Edit3,
  Paperclip,
  Image as ImageIcon,
  Smile,
  MoreHorizontal,
  Flag,
  Clock,
  User,
  Users,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Filter,
  SortAsc,
  Settings,
  X,
  AtSign,
  Type,
  Bold,
  Italic,
  Underline,
  Link,
  AlignLeft
} from 'lucide-react';
import { AppHeader } from '@/app/components/shared/AppHeader';

interface Email {
  id: string;
  from: string;
  fromEmail: string;
  subject: string;
  preview: string;
  body: string;
  time: string;
  date: string;
  isRead: boolean;
  isStarred: boolean;
  isFlagged: boolean;
  hasAttachment: boolean;
  folder: 'inbox' | 'sent' | 'drafts' | 'archive' | 'trash';
  avatar?: string;
}

interface EmailAppProps {
  onBack: () => void;
}

interface SystemUser {
  id: string;
  name: string;
  email: string;
  department: string;
  isOnline: boolean;
}

export function EmailApp({ onBack }: EmailAppProps) {
  const [selectedFolder, setSelectedFolder] = useState<'inbox' | 'sent' | 'drafts' | 'archive' | 'trash'>('inbox');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Compose email states
  const [composeTo, setComposeTo] = useState<SystemUser | null>(null);
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [showUserSelect, setShowUserSelect] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');

  // Lista de usuários do sistema
  const [systemUsers] = useState<SystemUser[]>([
    { id: '1', name: 'Carlos Silva', email: 'carlos.silva@empresa.com', department: 'Vendas', isOnline: true },
    { id: '2', name: 'Ana Costa', email: 'ana.costa@empresa.com', department: 'Marketing', isOnline: true },
    { id: '3', name: 'Roberto Mendes', email: 'roberto.mendes@empresa.com', department: 'TI', isOnline: false },
    { id: '4', name: 'Juliana Santos', email: 'juliana.santos@empresa.com', department: 'Comercial', isOnline: true },
    { id: '5', name: 'Pedro Oliveira', email: 'pedro.oliveira@empresa.com', department: 'Desenvolvimento', isOnline: true },
    { id: '6', name: 'Mariana Lima', email: 'mariana.lima@empresa.com', department: 'RH', isOnline: false },
    { id: '7', name: 'Fernando Costa', email: 'fernando.costa@empresa.com', department: 'Financeiro', isOnline: true },
    { id: '8', name: 'Camila Rodrigues', email: 'camila.rodrigues@empresa.com', department: 'Suporte', isOnline: true },
  ]);

  const filteredUsers = systemUsers.filter(user =>
    user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    user.department.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  const [emails] = useState<Email[]>([
    {
      id: '1',
      from: 'Carlos Silva',
      fromEmail: 'carlos.silva@empresa.com',
      subject: 'Relatório de Vendas Q1 2026',
      preview: 'Olá, segue anexo o relatório completo de vendas do primeiro trimestre...',
      body: 'Olá,\n\nSegue anexo o relatório completo de vendas do primeiro trimestre de 2026. Os números estão muito positivos, com crescimento de 35% em relação ao trimestre anterior.\n\nDestaques:\n- Vendas online: +45%\n- Novos clientes: 1.234\n- Ticket médio: R$ 2.850\n\nPodemos agendar uma reunião para discutir os próximos passos?\n\nAbraços,\nCarlos Silva',
      time: '14:32',
      date: '01 Fev 2026',
      isRead: false,
      isStarred: true,
      isFlagged: true,
      hasAttachment: true,
      folder: 'inbox',
    },
    {
      id: '2',
      from: 'Ana Costa',
      fromEmail: 'ana.costa@empresa.com',
      subject: 'Reunião de planejamento - Segunda-feira',
      preview: 'Boa tarde! Vamos marcar a reunião de planejamento para segunda às 10h?',
      body: 'Boa tarde!\n\nVamos marcar a reunião de planejamento para segunda-feira às 10h? Precisamos definir as metas do próximo mês e revisar os projetos em andamento.\n\nPor favor, confirme sua presença.\n\nObrigada!',
      time: '13:15',
      date: '01 Fev 2026',
      isRead: false,
      isStarred: false,
      isFlagged: false,
      hasAttachment: false,
      folder: 'inbox',
    },
    {
      id: '3',
      from: 'Roberto Mendes',
      fromEmail: 'roberto.mendes@empresa.com',
      subject: 'Atualização do Sistema ERP',
      preview: 'O sistema será atualizado no próximo sábado às 22h...',
      body: 'Prezados,\n\nInformamos que o sistema ERP será atualizado no próximo sábado, dia 03/02, às 22h.\n\nTempo estimado: 2 horas\nImpacto: Sistema ficará offline durante a atualização\n\nNovas funcionalidades:\n- Dashboard renovado\n- Integração com novos módulos\n- Performance melhorada\n\nQualquer dúvida, estou à disposição.',
      time: '11:48',
      date: '01 Fev 2026',
      isRead: true,
      isStarred: false,
      isFlagged: false,
      hasAttachment: false,
      folder: 'inbox',
    },
    {
      id: '4',
      from: 'Juliana Santos',
      fromEmail: 'juliana.santos@empresa.com',
      subject: 'Proposta de Parceria Comercial',
      preview: 'Gostaria de apresentar uma proposta de parceria que pode ser muito interessante...',
      body: 'Olá!\n\nGostaria de apresentar uma proposta de parceria comercial que pode ser muito interessante para ambas as empresas.\n\nPodemos agendar uma call para discutir os detalhes?\n\nAguardo retorno.\n\nAtenciosamente,\nJuliana Santos',
      time: '10:22',
      date: '01 Fev 2026',
      isRead: true,
      isStarred: false,
      isFlagged: false,
      hasAttachment: false,
      folder: 'inbox',
    },
    {
      id: '5',
      from: 'Pedro Oliveira',
      fromEmail: 'pedro.oliveira@empresa.com',
      subject: 'Documentação do Projeto Phoenix',
      preview: 'Segue a documentação completa do projeto conforme solicitado...',
      body: 'Oi,\n\nSegue anexa a documentação completa do Projeto Phoenix conforme você solicitou na última reunião.\n\nTodos os diagramas e especificações técnicas estão incluídos.\n\nQualquer dúvida, me avise!\n\nAbraços,\nPedro',
      time: 'Ontem',
      date: '31 Jan 2026',
      isRead: true,
      isStarred: true,
      isFlagged: false,
      hasAttachment: true,
      folder: 'inbox',
    },
  ]);

  const folders = [
    { id: 'inbox', label: 'Caixa de Entrada', icon: Inbox, count: emails.filter(e => e.folder === 'inbox' && !e.isRead).length },
    { id: 'sent', label: 'Enviados', icon: Send, count: 0 },
    { id: 'drafts', label: 'Rascunhos', icon: FileText, count: 2 },
    { id: 'archive', label: 'Arquivados', icon: Archive, count: 0 },
    { id: 'trash', label: 'Lixeira', icon: Trash2, count: 0 },
  ];

  const filteredEmails = emails
    .filter(email => email.folder === selectedFolder)
    .filter(email => 
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.preview.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email);
    if (!email.isRead) {
      email.isRead = true;
    }
  };

  const handleSendEmail = () => {
    if (!composeTo || !composeSubject || !composeBody) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    // Aqui você enviaria o email para o backend
    console.log('Enviando email:', { to: composeTo.email, subject: composeSubject, body: composeBody });
    
    // Limpar formulário e fechar modal
    setComposeTo(null);
    setComposeSubject('');
    setComposeBody('');
    setUserSearchQuery('');
    setIsComposing(false);
    
    // Feedback visual
    alert('Email enviado com sucesso!');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <AppHeader
        title="Email"
        subtitle="Gerenciamento de mensagens"
        icon={Mail}
        onBack={onBack}
        actions={
          <>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all backdrop-blur-sm border border-white/10"
            >
              <RefreshCw size={18} className="text-gray-400" />
              </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all backdrop-blur-sm border border-white/10"
            >
              <Settings size={18} className="text-gray-400" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsComposing(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-[#1fff94] to-[#00d976] rounded-xl font-medium text-black hover:shadow-lg hover:shadow-[#1fff94]/50 transition-all flex items-center gap-2"
            >
              <Edit3 size={18} />
              Novo Email
            </motion.button>
          </>
        }
      />

      {/* Main Content */}
      <div className="p-6">
        <div className="flex gap-6 h-[calc(100vh-140px)]">
          {/* Sidebar - Folders */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-64 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-4 flex-shrink-0"
          >
            <h3 className="text-sm font-semibold text-gray-400 mb-3 px-2">PASTAS</h3>
            <div className="space-y-1">
              {folders.map((folder) => (
                <motion.button
                  key={folder.id}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedFolder(folder.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                    selectedFolder === folder.id
                      ? 'bg-gradient-to-r from-[#1fff94]/20 to-[#00d976]/10 border border-[#1fff94]/30 text-[#1fff94]'
                      : 'hover:bg-white/5 text-gray-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <folder.icon size={18} />
                    <span className="text-sm font-medium">{folder.label}</span>
                  </div>
                  {folder.count > 0 && (
                    <div className="w-6 h-6 bg-[#1fff94] rounded-full flex items-center justify-center">
                      <span className="text-xs text-black font-bold">{folder.count}</span>
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Email List */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-96 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 flex flex-col flex-shrink-0"
          >
            {/* Search and Filters */}
            <div className="p-4 border-b border-white/10">
              <div className="relative mb-3">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar emails..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#1fff94]/50 focus:bg-white/10 transition-all"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex-1 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <Filter size={14} />
                  Filtros
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <SortAsc size={14} />
                  Ordenar
                </motion.button>
              </div>
            </div>

            {/* Email List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <AnimatePresence>
                {filteredEmails.map((email, index) => (
                  <motion.div
                    key={email.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleEmailClick(email)}
                    className={`p-4 border-b border-white/5 cursor-pointer transition-all ${
                      selectedEmail?.id === email.id
                        ? 'bg-[#1fff94]/10 border-l-4 border-l-[#1fff94]'
                        : 'hover:bg-white/5'
                    } ${!email.isRead ? 'bg-white/5' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        !email.isRead 
                          ? 'bg-gradient-to-br from-[#1fff94] to-[#00d976]'
                          : 'bg-gradient-to-br from-purple-500 to-blue-500'
                      }`}>
                        <User size={20} className="text-white" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className={`text-sm truncate ${!email.isRead ? 'font-bold text-white' : 'font-medium text-gray-300'}`}>
                            {email.from}
                          </h4>
                          <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{email.time}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-1">
                          <p className={`text-sm truncate flex-1 ${!email.isRead ? 'font-semibold text-white' : 'text-gray-400'}`}>
                            {email.subject}
                          </p>
                          {email.hasAttachment && <Paperclip size={14} className="text-gray-500 flex-shrink-0" />}
                        </div>
                        
                        <p className="text-xs text-gray-500 truncate">{email.preview}</p>
                        
                        <div className="flex items-center gap-2 mt-2">
                          {email.isStarred && (
                            <Star size={14} className="text-yellow-500 fill-yellow-500" />
                          )}
                          {email.isFlagged && (
                            <Flag size={14} className="text-red-500 fill-red-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            <div className="p-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-gray-500">1-{filteredEmails.length} de {filteredEmails.length}</span>
              <div className="flex items-center gap-1">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <ChevronLeft size={16} className="text-gray-400" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <ChevronRight size={16} className="text-gray-400" />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Email Content */}
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex-1 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 flex flex-col"
          >
            {selectedEmail ? (
              <>
                {/* Email Header */}
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">{selectedEmail.subject}</h2>
                      <div className="flex items-center gap-2">
                        {selectedEmail.isStarred && (
                          <Star size={16} className="text-yellow-500 fill-yellow-500" />
                        )}
                        {selectedEmail.isFlagged && (
                          <Flag size={16} className="text-red-500 fill-red-500" />
                        )}
                        {selectedEmail.hasAttachment && (
                          <Paperclip size={16} className="text-gray-400" />
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <Archive size={18} className="text-gray-400" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} className="text-gray-400" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <MoreHorizontal size={18} className="text-gray-400" />
                      </motion.button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <User size={24} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{selectedEmail.from}</h3>
                      <p className="text-sm text-gray-400">{selectedEmail.fromEmail}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">{selectedEmail.date}</p>
                      <p className="text-sm text-gray-500">{selectedEmail.time}</p>
                    </div>
                  </div>
                </div>

                {/* Email Body */}
                <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                  <div className="prose prose-invert max-w-none">
                    <div className="whitespace-pre-wrap text-gray-300 leading-relaxed">
                      {selectedEmail.body}
                    </div>
                  </div>

                  {selectedEmail.hasAttachment && (
                    <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-xl">
                      <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <Paperclip size={16} />
                        Anexos (2)
                      </h4>
                      <div className="space-y-2">
                        <motion.div
                          whileHover={{ x: 5 }}
                          className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer transition-all"
                        >
                          <div className="w-10 h-10 bg-[#1fff94]/20 rounded-lg flex items-center justify-center">
                            <FileText size={20} className="text-[#1fff94]" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Relatorio_Vendas_Q1.pdf</p>
                            <p className="text-xs text-gray-500">2.4 MB</p>
                          </div>
                        </motion.div>
                        <motion.div
                          whileHover={{ x: 5 }}
                          className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer transition-all"
                        >
                          <div className="w-10 h-10 bg-[#1fff94]/20 rounded-lg flex items-center justify-center">
                            <FileText size={20} className="text-[#1fff94]" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Graficos_Analise.xlsx</p>
                            <p className="text-xs text-gray-500">1.8 MB</p>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Reply Section */}
                <div className="p-6 border-t border-white/10">
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-[#1fff94] to-[#00d976] rounded-xl font-medium text-black hover:shadow-lg hover:shadow-[#1fff94]/50 transition-all flex items-center justify-center gap-2"
                    >
                      <MailOpen size={18} />
                      Responder
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-medium transition-all flex items-center gap-2"
                    >
                      <Send size={18} />
                      Encaminhar
                    </motion.button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#1fff94]/20 to-[#00d976]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail size={40} className="text-[#1fff94]" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Nenhum email selecionado</h3>
                  <p className="text-gray-500">Selecione um email da lista para visualizar</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Compose Email Modal */}
      <AnimatePresence>
        {isComposing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setIsComposing(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-gray-900 to-black border border-[#1fff94]/20 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl shadow-[#1fff94]/20"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#1fff94] to-[#00d976] rounded-xl flex items-center justify-center">
                    <Edit3 size={20} className="text-black" />
                  </div>
                  <h2 className="text-xl font-bold">Novo Email</h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsComposing(false)}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <X size={20} className="text-gray-400" />
                </motion.button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4 max-h-[calc(90vh-200px)] overflow-y-auto custom-scrollbar">
                {/* Para */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                    <AtSign size={16} />
                    Para
                  </label>
                  
                  {composeTo ? (
                    <div className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#1fff94] to-[#00d976] rounded-full flex items-center justify-center">
                          <User size={20} className="text-black" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{composeTo.name}</p>
                          <p className="text-xs text-gray-400">{composeTo.email}</p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setComposeTo(null)}
                        className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <X size={16} className="text-gray-400" />
                      </motion.button>
                    </div>
                  ) : (
                    <>
                      <div className="relative">
                        <input
                          type="text"
                          value={userSearchQuery}
                          onChange={(e) => {
                            setUserSearchQuery(e.target.value);
                            setShowUserSelect(true);
                          }}
                          onFocus={() => setShowUserSelect(true)}
                          placeholder="Buscar usuário..."
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-[#1fff94]/50 focus:bg-white/10 transition-all"
                        />
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setShowUserSelect(!showUserSelect)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <Users size={16} className="text-[#1fff94]" />
                        </motion.button>
                      </div>

                      {/* User Select Dropdown */}
                      <AnimatePresence>
                        {showUserSelect && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute z-10 w-full mt-2 bg-gray-900 border border-[#1fff94]/20 rounded-xl shadow-2xl shadow-[#1fff94]/10 max-h-80 overflow-y-auto custom-scrollbar"
                          >
                            <div className="p-2">
                              <p className="text-xs font-semibold text-gray-400 px-3 py-2">USUÁRIOS DO SISTEMA ({filteredUsers.length})</p>
                              {filteredUsers.length > 0 ? (
                                <div className="space-y-1">
                                  {filteredUsers.map((user) => (
                                    <motion.button
                                      key={user.id}
                                      whileHover={{ x: 5 }}
                                      onClick={() => {
                                        setComposeTo(user);
                                        setShowUserSelect(false);
                                        setUserSearchQuery('');
                                      }}
                                      className="w-full flex items-center gap-3 p-3 hover:bg-white/10 rounded-lg transition-all text-left"
                                    >
                                      <div className="relative">
                                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                                          <User size={20} className="text-white" />
                                        </div>
                                        {user.isOnline && (
                                          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#1fff94] border-2 border-gray-900 rounded-full" />
                                        )}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                          <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                                          {user.isOnline && (
                                            <span className="text-xs text-[#1fff94] font-medium">Online</span>
                                          )}
                                        </div>
                                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                                        <p className="text-xs text-gray-500">{user.department}</p>
                                      </div>
                                    </motion.button>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-8">
                                  <User size={32} className="text-gray-600 mx-auto mb-2" />
                                  <p className="text-sm text-gray-500">Nenhum usuário encontrado</p>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}
                </div>

                {/* Assunto */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                    <Type size={16} />
                    Assunto
                  </label>
                  <input
                    type="text"
                    value={composeSubject}
                    onChange={(e) => setComposeSubject(e.target.value)}
                    placeholder="Assunto do email"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#1fff94]/50 focus:bg-white/10 transition-all"
                  />
                </div>

                {/* Toolbar */}
                <div className="flex items-center gap-2 p-2 bg-white/5 rounded-xl border border-white/10">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title="Negrito"
                  >
                    <Bold size={16} className="text-gray-400" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title="Itálico"
                  >
                    <Italic size={16} className="text-gray-400" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title="Sublinhado"
                  >
                    <Underline size={16} className="text-gray-400" />
                  </motion.button>
                  <div className="w-px h-6 bg-white/10 mx-1" />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title="Link"
                  >
                    <Link size={16} className="text-gray-400" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title="Anexo"
                  >
                    <Paperclip size={16} className="text-gray-400" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title="Imagem"
                  >
                    <ImageIcon size={16} className="text-gray-400" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title="Emoji"
                  >
                    <Smile size={16} className="text-gray-400" />
                  </motion.button>
                </div>

                {/* Mensagem */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                    <AlignLeft size={16} />
                    Mensagem
                  </label>
                  <textarea
                    value={composeBody}
                    onChange={(e) => setComposeBody(e.target.value)}
                    placeholder="Digite sua mensagem aqui..."
                    rows={12}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#1fff94]/50 focus:bg-white/10 transition-all resize-none custom-scrollbar"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <Clock size={16} />
                    Agendar
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <FileText size={16} />
                    Rascunho
                  </motion.button>
                </div>

                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsComposing(false)}
                    className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-medium transition-colors"
                  >
                    Cancelar
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSendEmail}
                    className="px-6 py-3 bg-gradient-to-r from-[#1fff94] to-[#00d976] rounded-xl font-medium text-black hover:shadow-lg hover:shadow-[#1fff94]/50 transition-all flex items-center gap-2"
                  >
                    <Send size={18} />
                    Enviar
                  </motion.button>
                </div>
              </div>
            </motion.div>
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
    </div>
  );
}

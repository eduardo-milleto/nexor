import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  UserPlus,
  Users as UsersIcon,
  Mail,
  Briefcase,
  Edit3,
  Trash2,
  X,
  AtSign,
  User,
  Lock,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  RefreshCw,
  Settings
} from 'lucide-react';
import { AppHeader } from '@/app/components/shared/AppHeader';

interface User {
  id: string;
  name: string;
  email: string;
  department: 'Vendas' | 'Logística' | 'Financeiro' | 'RH' | 'Infraestrutura';
  isOnline: boolean;
  createdAt: string;
  avatar?: string;
}

interface UsersAppProps {
  onBack: () => void;
}

export function UsersApp({ onBack }: UsersAppProps) {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Carlos Silva',
      email: 'carlos.silva@empresa.com',
      department: 'Vendas',
      isOnline: true,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Ana Costa',
      email: 'ana.costa@empresa.com',
      department: 'RH',
      isOnline: true,
      createdAt: '2024-01-20'
    },
    {
      id: '3',
      name: 'Roberto Mendes',
      email: 'roberto.mendes@empresa.com',
      department: 'Infraestrutura',
      isOnline: false,
      createdAt: '2024-02-01'
    },
    {
      id: '4',
      name: 'Juliana Santos',
      email: 'juliana.santos@empresa.com',
      department: 'Vendas',
      isOnline: true,
      createdAt: '2024-02-05'
    },
    {
      id: '5',
      name: 'Pedro Oliveira',
      email: 'pedro.oliveira@empresa.com',
      department: 'Logística',
      isOnline: true,
      createdAt: '2024-02-10'
    },
    {
      id: '6',
      name: 'Mariana Lima',
      email: 'mariana.lima@empresa.com',
      department: 'Financeiro',
      isOnline: false,
      createdAt: '2024-02-12'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [isCreating, setIsCreating] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formDepartment, setFormDepartment] = useState<User['department']>('Vendas');
  const [formPassword, setFormPassword] = useState('');

  const departments: User['department'][] = ['Vendas', 'Logística', 'Financeiro', 'RH', 'Infraestrutura'];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || user.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const handleCreateUser = () => {
    if (!formName || !formEmail || !formPassword) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const newUser: User = {
      id: Date.now().toString(),
      name: formName,
      email: formEmail,
      department: formDepartment,
      isOnline: false,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setUsers([...users, newUser]);
    resetForm();
    setIsCreating(false);
    alert('Usuário criado com sucesso!');
  };

  const handleEditUser = () => {
    if (!editingUser || !formName || !formEmail) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setUsers(users.map(user =>
      user.id === editingUser.id
        ? { ...user, name: formName, email: formEmail, department: formDepartment }
        : user
    ));

    resetForm();
    setEditingUser(null);
    alert('Usuário atualizado com sucesso!');
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      setUsers(users.filter(user => user.id !== userId));
      alert('Usuário excluído com sucesso!');
    }
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormName(user.name);
    setFormEmail(user.email);
    setFormDepartment(user.department);
    setFormPassword('');
  };

  const resetForm = () => {
    setFormName('');
    setFormEmail('');
    setFormDepartment('Vendas');
    setFormPassword('');
    setShowPassword(false);
  };

  const closeModal = () => {
    setIsCreating(false);
    setEditingUser(null);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <AppHeader
        title="Usuários"
        subtitle="Gestão de usuários"
        icon={UsersIcon}
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
              onClick={() => setIsCreating(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-[#1fff94] to-[#00d976] rounded-xl font-medium text-black hover:shadow-lg hover:shadow-[#1fff94]/50 transition-all flex items-center gap-2"
            >
              <UserPlus size={18} />
              Novo Usuário
            </motion.button>
          </>
        }
      />

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#1fff94] to-[#00d976] rounded-lg flex items-center justify-center">
                  <UsersIcon size={20} className="text-black" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{users.length}</p>
                  <p className="text-xs text-gray-400">Total de Usuários</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#1fff94] to-[#00d976] rounded-lg flex items-center justify-center">
                  <Check size={20} className="text-black" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{users.filter(u => u.isOnline).length}</p>
                  <p className="text-xs text-gray-400">Online Agora</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#1fff94] to-[#00d976] rounded-lg flex items-center justify-center">
                  <Briefcase size={20} className="text-black" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{users.filter(u => u.department === 'Vendas').length}</p>
                  <p className="text-xs text-gray-400">Vendas</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#1fff94] to-[#00d976] rounded-lg flex items-center justify-center">
                  <Briefcase size={20} className="text-black" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{users.filter(u => u.department === 'Logística').length}</p>
                  <p className="text-xs text-gray-400">Logística</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar usuários..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#1fff94]/50 focus:bg-white/10 transition-all"
              />
            </div>

            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#1fff94]/50 transition-all"
            >
              <option value="all">Todos os Cargos</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Users Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.03 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:border-[#1fff94]/30 hover:bg-white/[0.07] transition-all group"
                >
                  {/* User Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#1fff94] to-[#00d976] rounded-lg flex items-center justify-center">
                          <User size={24} className="text-black" />
                        </div>
                        {user.isOnline && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#1fff94] border-2 border-black rounded-full" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{user.name}</h3>
                        <p className="text-xs text-gray-400">{user.isOnline ? 'Online' : 'Offline'}</p>
                      </div>
                    </div>

                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => openEditModal(user)}
                        className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <Edit3 size={14} className="text-[#1fff94]" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-1.5 bg-white/5 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} className="text-red-400" />
                      </motion.button>
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail size={14} className="text-gray-400" />
                      <span className="text-gray-300 text-xs truncate">{user.email}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase size={14} className="text-gray-400" />
                      <span className="px-2.5 py-1 bg-[#1fff94]/10 border border-[#1fff94]/20 rounded-lg text-[#1fff94] text-xs font-medium">
                        {user.department}
                      </span>
                    </div>

                    <div className="pt-2.5 border-t border-white/5">
                      <p className="text-xs text-gray-500">Criado em {new Date(user.createdAt).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredUsers.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <UsersIcon size={64} className="text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nenhum usuário encontrado</h3>
              <p className="text-gray-500">Tente ajustar os filtros ou crie um novo usuário</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Create/Edit User Modal */}
      <AnimatePresence>
        {(isCreating || editingUser) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-gray-900 to-black border border-[#1fff94]/20 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl shadow-[#1fff94]/20"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#1fff94] to-[#00d976] rounded-xl flex items-center justify-center">
                    {editingUser ? <Edit3 size={20} className="text-black" /> : <UserPlus size={20} className="text-black" />}
                  </div>
                  <h2 className="text-xl font-bold">
                    {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
                  </h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={closeModal}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <X size={20} className="text-gray-400" />
                </motion.button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4 max-h-[calc(90vh-200px)] overflow-y-auto custom-scrollbar">
                {/* Nome */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                    <User size={16} />
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ex: João da Silva"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#1fff94]/50 focus:bg-white/10 transition-all"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                    <AtSign size={16} />
                    Email Corporativo *
                  </label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="joao.silva@empresa.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#1fff94]/50 focus:bg-white/10 transition-all"
                  />
                </div>

                {/* Cargo/Departamento */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                    <Briefcase size={16} />
                    Cargo *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {departments.map((dept) => (
                      <motion.button
                        key={dept}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setFormDepartment(dept)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          formDepartment === dept
                            ? 'border-[#1fff94] bg-[#1fff94]/10'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className="w-8 h-8 mx-auto mb-2 bg-gradient-to-br from-[#1fff94] to-[#00d976] rounded-lg" />
                        <p className="text-sm font-medium text-center">{dept}</p>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Senha */}
                {!editingUser && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                      <Lock size={16} />
                      Senha *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formPassword}
                        onChange={(e) => setFormPassword(e.target.value)}
                        placeholder="Mínimo 8 caracteres"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-[#1fff94]/50 focus:bg-white/10 transition-all"
                      />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff size={16} className="text-gray-400" />
                        ) : (
                          <Eye size={16} className="text-gray-400" />
                        )}
                      </motion.button>
                    </div>
                  </div>
                )}

                {/* Info Box */}
                <div className="bg-[#1fff94]/10 border border-[#1fff94]/20 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle size={20} className="text-[#1fff94] mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-gray-300">
                    <p className="font-medium mb-1">Informações importantes:</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-400">
                      <li>O email será usado para login no sistema</li>
                      <li>O usuário receberá as credenciais de acesso por email</li>
                      <li>As permissões serão definidas de acordo com o cargo</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-white/10 flex items-center justify-end gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={closeModal}
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-medium transition-colors"
                >
                  Cancelar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={editingUser ? handleEditUser : handleCreateUser}
                  className="px-6 py-3 bg-gradient-to-r from-[#1fff94] to-[#00d976] rounded-xl font-medium text-black hover:shadow-lg hover:shadow-[#1fff94]/50 transition-all flex items-center gap-2"
                >
                  <Check size={18} />
                  {editingUser ? 'Salvar Alterações' : 'Criar Usuário'}
                </motion.button>
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

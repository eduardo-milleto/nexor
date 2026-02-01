import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Building2,
  Users,
  Activity,
  Plus,
  Trash2,
  LogOut,
  Mail,
  Lock,
  Check,
  X
} from 'lucide-react';

interface AdminPanelProps {
  onLogout: () => void;
}

interface Company {
  id: string;
  email: string;
  password: string;
  createdAt: Date;
  users: number;
  status: 'active' | 'inactive';
}

export function AdminPanel({ onLogout }: AdminPanelProps) {
  const [companies, setCompanies] = useState<Company[]>([
    {
      id: '1',
      email: 'empresa1@example.com',
      password: '********',
      createdAt: new Date('2024-01-15'),
      users: 25,
      status: 'active'
    },
    {
      id: '2',
      email: 'empresa2@example.com',
      password: '********',
      createdAt: new Date('2024-02-20'),
      users: 18,
      status: 'active'
    },
    {
      id: '3',
      email: 'empresa3@example.com',
      password: '********',
      createdAt: new Date('2024-03-10'),
      users: 42,
      status: 'inactive'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const totalUsers = companies.reduce((sum, company) => sum + company.users, 0);
  const activeCompanies = companies.filter(c => c.status === 'active').length;

  const handleAddCompany = (e: React.FormEvent) => {
    e.preventDefault();
    const newCompany: Company = {
      id: Date.now().toString(),
      email: newEmail,
      password: newPassword,
      createdAt: new Date(),
      users: 0,
      status: 'active'
    };
    setCompanies([...companies, newCompany]);
    setNewEmail('');
    setNewPassword('');
    setShowAddForm(false);
  };

  const handleDeleteCompany = (id: string) => {
    setCompanies(companies.filter(c => c.id !== id));
  };

  const toggleCompanyStatus = (id: string) => {
    setCompanies(companies.map(c => 
      c.id === id 
        ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' as 'active' | 'inactive' }
        : c
    ));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-black via-gray-900 to-black border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#1fff94] to-[#00d978] rounded-2xl flex items-center justify-center">
              <Building2 size={20} className="text-black" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Painel Administrativo</h1>
              <p className="text-xs text-gray-400">Gerenciamento de Empresas</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
          >
            <LogOut size={18} />
            <span className="text-sm">Sair</span>
          </motion.button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-xl"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#1fff94]/10 rounded-xl flex items-center justify-center">
                <Building2 size={24} className="text-[#1fff94]" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total de Empresas</p>
                <p className="text-3xl font-bold text-white">{companies.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-xl"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#1fff94]/10 rounded-xl flex items-center justify-center">
                <Users size={24} className="text-[#1fff94]" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total de Usuários</p>
                <p className="text-3xl font-bold text-white">{totalUsers}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-xl"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#1fff94]/10 rounded-xl flex items-center justify-center">
                <Activity size={24} className="text-[#1fff94]" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Empresas Ativas</p>
                <p className="text-3xl font-bold text-white">{activeCompanies}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Add Company Button */}
        <div className="mb-6 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#1fff94] to-[#00d978] text-black font-semibold rounded-xl shadow-lg shadow-[#1fff94]/30"
          >
            <Plus size={20} />
            <span>Adicionar Empresa</span>
          </motion.button>
        </div>

        {/* Add Company Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                <h3 className="text-lg font-semibold mb-4">Nova Empresa</h3>
                <form onSubmit={handleAddCompany} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Email</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="empresa@example.com"
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#1fff94] focus:ring-2 focus:ring-[#1fff94]/20 transition-all"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Senha</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="********"
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#1fff94] focus:ring-2 focus:ring-[#1fff94]/20 transition-all"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 py-3 bg-gradient-to-r from-[#1fff94] to-[#00d978] text-black font-semibold rounded-xl"
                    >
                      Criar Empresa
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowAddForm(false)}
                      className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
                    >
                      Cancelar
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Companies Table */}
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Data de Criação</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Usuários</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Ações</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {companies.map((company, index) => (
                    <motion.tr
                      key={company.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#1fff94]/10 rounded-lg flex items-center justify-center">
                            <Mail size={16} className="text-[#1fff94]" />
                          </div>
                          <span className="text-white">{company.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {company.createdAt.toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white font-semibold">{company.users}</span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleCompanyStatus(company.id)}
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                            company.status === 'active'
                              ? 'bg-[#1fff94]/10 text-[#1fff94] hover:bg-[#1fff94]/20'
                              : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                          }`}
                        >
                          {company.status === 'active' ? (
                            <>
                              <Check size={14} />
                              Ativa
                            </>
                          ) : (
                            <>
                              <X size={14} />
                              Inativa
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteCompany(company.id)}
                          className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

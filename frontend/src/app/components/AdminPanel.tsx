import { useState, useEffect } from 'react';
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
  X,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { companyService, Company } from '@/services/company.service';

interface AdminPanelProps {
  onLogout: () => void;
}

export function AdminPanel({ onLogout }: AdminPanelProps) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Load companies on mount
  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await companyService.getAll();
      setCompanies(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar empresas');
      console.error('Error loading companies:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalUsers = companies.reduce((sum, company) => sum + (company.user_count || 0), 0);
  const activeCompanies = companies.filter(c => c.status === 'active').length;

  const handleAddCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      await companyService.create({ email: newEmail, password: newPassword });
      await loadCompanies();
      setNewEmail('');
      setNewPassword('');
      setShowAddForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar empresa');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCompany = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta empresa?')) return;
    try {
      setError(null);
      await companyService.delete(id);
      setCompanies(companies.filter(c => c.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir empresa');
    }
  };

  const toggleCompanyStatus = async (id: string) => {
    try {
      setError(null);
      const updated = await companyService.toggleStatus(id);
      setCompanies(companies.map(c => c.id === id ? updated : c));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao alterar status');
    }
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
        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400"
          >
            <AlertCircle size={20} />
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-auto">
              <X size={18} />
            </button>
          </motion.div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={40} className="text-[#1fff94] animate-spin" />
          </div>
        ) : (
          <>
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
                          disabled={submitting}
                          whileHover={{ scale: submitting ? 1 : 1.02 }}
                          whileTap={{ scale: submitting ? 1 : 0.98 }}
                          className="flex-1 py-3 bg-gradient-to-r from-[#1fff94] to-[#00d978] text-black font-semibold rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {submitting ? (
                            <>
                              <Loader2 size={18} className="animate-spin" />
                              Criando...
                            </>
                          ) : (
                            'Criar Empresa'
                          )}
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
                            {new Date(company.created_at).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-white font-semibold">{company.user_count || 0}</span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => toggleCompanyStatus(company.id)}
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-all ${company.status === 'active'
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
          </>
        )}
      </div>
    </div >
  );
}

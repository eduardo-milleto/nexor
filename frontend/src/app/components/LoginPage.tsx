import { useState } from 'react';
import { motion } from 'motion/react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import nexorLogo from 'figma:asset/e8761369f8a34f22127c9d370ecc809e022cf919.png';

interface LoginPageProps {
  onLogin: () => void;
  onAdminLogin?: () => void;
}

export function LoginPage({ onLogin, onAdminLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAdminMode && onAdminLogin) {
      onAdminLogin();
    } else {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 overflow-hidden relative">
      {/* Background static gradient - removendo animações pesadas */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        <div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ background: '#1fff94', top: '10%', left: '10%' }}
        />
        <div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ background: '#1fff94', bottom: '10%', right: '10%' }}
        />
      </div>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md"
      >
        <div className="backdrop-blur-xl bg-white/5 rounded-3xl shadow-2xl border border-white/10 p-8 md:p-10">
          {/* Logo space */}
          <div className="flex justify-center mb-8">
            <img 
              src={nexorLogo} 
              alt="Nexor Logo" 
              className="w-32 h-32 object-contain"
            />
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-white mb-2">
              {isAdminMode ? 'Administrador' : 'Bem-vindo'}
            </h1>
            <p className="text-gray-400 text-sm">
              {isAdminMode ? 'Acesso exclusivo para administradores' : 'Entre com sua conta para continuar'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-[#1fff94] focus:ring-2 focus:ring-[#1fff94]/20 transition-all duration-200"
                required
              />
            </div>

            <div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Senha"
                  className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-[#1fff94] focus:ring-2 focus:ring-[#1fff94]/20 transition-all duration-200 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1fff94] transition-colors"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-400 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-white/10 bg-white/5 checked:bg-[#1fff94] checked:border-[#1fff94] transition-colors accent-[#1fff94]"
                />
                <span className="group-hover:text-white transition-colors">Lembrar-me</span>
              </label>
              <a href="#" className="text-[#1fff94] hover:underline transition-all">
                Esqueceu a senha?
              </a>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-[#1fff94] to-[#0dcc6f] text-black font-semibold rounded-2xl shadow-lg shadow-[#1fff94]/30 hover:shadow-[#1fff94]/50 transition-all duration-300"
            >
              Entrar
            </motion.button>

            {/* Admin/User Toggle */}
            {!isAdminMode ? (
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => setIsAdminMode(true)}
                  className="text-sm text-gray-400 hover:text-[#1fff94] transition-colors underline"
                >
                  Acessar como Administrador
                </button>
              </div>
            ) : (
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => setIsAdminMode(false)}
                  className="text-sm text-gray-400 hover:text-[#1fff94] transition-colors underline"
                >
                  Voltar para login de usuário
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Bottom decoration */}
        <div className="mt-6 text-center text-xs text-gray-600">
          © 2026 Todos os direitos reservados
        </div>
      </motion.div>
    </div>
  );
}

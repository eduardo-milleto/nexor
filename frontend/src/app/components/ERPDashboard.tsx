import { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ShoppingCart,
  DollarSign,
  Users,
  Package,
  Mail,
  Search,
  Settings,
  User
} from 'lucide-react';
import nexorLogo from '@/assets/e8761369f8a34f22127c9d370ecc809e022cf919.png';
import { CRMApp } from '@/app/components/CRMApp';
import { EmailApp } from '@/app/components/EmailApp';
import { UsersApp } from '@/app/components/UsersApp';
import { FinanceApp } from '@/app/components/FinanceApp';
import { InventoryApp } from '@/app/components/InventoryApp';

interface ERPDashboardProps {
  onBack: () => void;
}

interface AppModule {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  badge?: string;
}

const appModules: AppModule[] = [
  {
    id: 'crm',
    name: 'CRM',
    icon: ShoppingCart,
    color: '#1fff94',
  },
  {
    id: 'financeiro',
    name: 'Financeiro',
    icon: DollarSign,
    color: '#1fff94',
  },
  {
    id: 'usuarios',
    name: 'Usuários',
    icon: Users,
    color: '#1fff94',
  },
  {
    id: 'estoque',
    name: 'Estoque',
    icon: Package,
    color: '#1fff94',
  },
  {
    id: 'email',
    name: 'Email',
    icon: Mail,
    color: '#1fff94',
  },
];

export function ERPDashboard({ onBack }: ERPDashboardProps) {
  const [searchApp, setSearchApp] = useState('');
  const [activeModule, setActiveModule] = useState<string | null>(null);

  const filteredApps = appModules.filter(app =>
    app.name.toLowerCase().includes(searchApp.toLowerCase()) ||
    app.id.toLowerCase().includes(searchApp.toLowerCase())
  );

  const handleModuleClick = (moduleId: string) => {
    setActiveModule(moduleId);
  };

  // Render active module
  if (activeModule === 'crm') {
    return <CRMApp onBack={() => setActiveModule(null)} />;
  }

  if (activeModule === 'financeiro') {
    return <FinanceApp onBack={() => setActiveModule(null)} />;
  }

  if (activeModule === 'email') {
    return <EmailApp onBack={() => setActiveModule(null)} />;
  }

  if (activeModule === 'usuarios') {
    return <UsersApp onBack={() => setActiveModule(null)} />;
  }

  if (activeModule === 'estoque') {
    return <InventoryApp onBack={() => setActiveModule(null)} language="pt" />;
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        <motion.div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ background: '#1fff94', top: '20%', right: '10%' }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ background: '#1fff94', bottom: '10%', left: '15%' }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.15, 0.1, 0.15],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      {/* Header - SAP BTP Style */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-30 bg-gradient-to-r from-[#1fff94]/15 via-white/5 to-[#1fff94]/15 backdrop-blur-md border-b border-[#1fff94]/30"
      >
        <div className="max-w-screen-2xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Left Section - Logo and Title */}
          <div className="flex items-center gap-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="p-2 bg-white/5 border border-white/10 rounded-lg hover:border-[#1fff94]/50 hover:bg-[#1fff94]/5 transition-all"
            >
              <ArrowLeft size={20} className="text-gray-400" />
            </motion.button>

            <img src={nexorLogo} alt="Nexor" className="h-20" />

            <div className="h-16 w-px bg-[#1fff94]/30" />

            <h1 className="text-xl font-bold text-[#1fff94]">ERP Nexor</h1>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                value={searchApp}
                onChange={(e) => setSearchApp(e.target.value)}
                placeholder="Pesquisar aplicativos..."
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 pl-10 text-white placeholder-gray-500 focus:outline-none focus:border-[#1fff94]/50 focus:bg-white/10 transition-all w-64 text-sm"
              />
              <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
            </div>

            {/* Settings */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-white/5 border border-white/10 rounded-lg hover:border-[#1fff94]/50 hover:bg-[#1fff94]/5 transition-all"
            >
              <Settings size={20} className="text-gray-400" />
            </motion.button>

            {/* User */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-white/5 border border-white/10 rounded-lg hover:border-[#1fff94]/50 hover:bg-[#1fff94]/5 transition-all"
            >
              <User size={20} className="text-gray-400" />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Main Content - Launchpad Style */}
      <main className="relative z-10 max-w-screen-2xl mx-auto px-6 py-12">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-white to-[#1fff94] bg-clip-text text-transparent">
              Aplicações
            </span>
          </h2>
          <p className="text-gray-400">Selecione um aplicativo para começar</p>
        </motion.div>

        {/* App Tiles Grid - SAP BTP Launchpad Style */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 max-w-6xl">
          {filteredApps.length > 0 ? filteredApps.map((module, index) => {
            const IconComponent = module.icon;
            return (
              <motion.button
                key={module.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.05, type: 'spring' }}
                whileHover={{ scale: 1.05, y: -8 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleModuleClick(module.id)}
                className="group relative aspect-square bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-[#1fff94]/50 hover:from-[#1fff94]/10 hover:to-[#1fff94]/5 transition-all duration-300 overflow-hidden flex flex-col items-center justify-center p-6"
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#1fff94]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Subtle grid pattern */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500">
                  <svg width="100%" height="100%">
                    <pattern id={`grid-${module.id}`} width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1fff94" strokeWidth="0.5" />
                    </pattern>
                    <rect width="100%" height="100%" fill={`url(#grid-${module.id})`} />
                  </svg>
                </div>

                <div className="relative z-10 flex flex-col items-center justify-center gap-4 w-full h-full">
                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                    className="flex-shrink-0"
                  >
                    <IconComponent
                      size={48}
                      className="text-gray-300 group-hover:text-[#1fff94] transition-colors duration-300"
                      strokeWidth={1.5}
                      style={{
                        filter: 'drop-shadow(0 0 10px rgba(31, 255, 148, 0))',
                      }}
                    />
                  </motion.div>

                  {/* Title */}
                  <p className="text-base font-semibold text-gray-200 group-hover:text-white transition-colors text-center leading-tight">
                    {module.name}
                  </p>
                </div>

                {/* Badge (for Email) */}
                {module.badge && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.05, type: 'spring' }}
                    className="absolute top-3 right-3 min-w-[24px] h-6 px-2 bg-[#1fff94] text-black text-xs font-bold rounded-full flex items-center justify-center"
                  >
                    {module.badge}
                  </motion.span>
                )}

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#1fff94] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.button>
            );
          }) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full flex flex-col items-center justify-center gap-4 py-12"
            >
              <Search size={64} className="text-gray-600" />
              <p className="text-gray-400 text-lg">Nenhum aplicativo encontrado</p>
              <p className="text-gray-500 text-sm">Tente pesquisar com outros termos</p>
            </motion.div>
          )}
        </div>
      </main>


    </div>
  );
}

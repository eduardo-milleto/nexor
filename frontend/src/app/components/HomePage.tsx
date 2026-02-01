import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Language, 
  Logout
} from '@mui/icons-material';
import { 
  Database,
  Bot,
  Sparkles
} from 'lucide-react';
import nexorLogo from 'figma:asset/e8761369f8a34f22127c9d370ecc809e022cf919.png';

interface HomePageProps {
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

interface MenuOption {
  id: string;
  title: {
    pt: string;
    en: string;
    es: string;
    fr: string;
  };
  description: {
    pt: string;
    en: string;
    es: string;
    fr: string;
  };
  icon: React.ComponentType<any>;
}

const menuOptions: MenuOption[] = [
  {
    id: 'erp',
    title: {
      pt: 'ERP',
      en: 'ERP',
      es: 'ERP',
      fr: 'ERP',
    },
    description: {
      pt: 'Sistema integrado de gestão empresarial completo',
      en: 'Complete integrated business management system',
      es: 'Sistema integrado completo de gestión empresarial',
      fr: 'Système complet de gestion intégré',
    },
    icon: Database,
  },
  {
    id: 'ai-agents',
    title: {
      pt: 'AGENTES DE IA',
      en: 'AI AGENTS',
      es: 'AGENTES DE IA',
      fr: 'AGENTS IA',
    },
    description: {
      pt: 'Assistentes inteligentes automatizados para seu negócio',
      en: 'Automated intelligent assistants for your business',
      es: 'Asistentes inteligentes automatizados para su negocio',
      fr: 'Assistants intelligents automatisés pour votre entreprise',
    },
    icon: Bot,
  },
  {
    id: 'gpt',
    title: {
      pt: 'GPT',
      en: 'GPT',
      es: 'GPT',
      fr: 'GPT',
    },
    description: {
      pt: 'Inteligência artificial conversacional avançada',
      en: 'Advanced conversational artificial intelligence',
      es: 'Inteligencia artificial conversacional avanzada',
      fr: 'Intelligence artificielle conversationnelle avancée',
    },
    icon: Sparkles,
  },
];

const languages = [
  { code: 'pt', name: 'PT', fullName: 'Português' },
  { code: 'en', name: 'EN', fullName: 'English' },
  { code: 'es', name: 'ES', fullName: 'Español' },
  { code: 'fr', name: 'FR', fullName: 'Français' },
];

type LanguageCode = 'pt' | 'en' | 'es' | 'fr';

export function HomePage({ onLogout, onNavigate }: HomePageProps) {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('pt');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const translations = {
    pt: {
      welcome: 'Escolha sua área de trabalho',
      poweredBy: 'Desenvolvido por',
    },
    en: {
      welcome: 'Choose your workspace',
      poweredBy: 'Powered by',
    },
    es: {
      welcome: 'Elige tu área de trabajo',
      poweredBy: 'Desarrollado por',
    },
    fr: {
      welcome: 'Choisissez votre espace de travail',
      poweredBy: 'Développé par',
    },
  };

  const handleModuleClick = (moduleId: string) => {
    onNavigate(moduleId);
  };

  const handleLanguageChange = (code: LanguageCode) => {
    setCurrentLanguage(code);
    setShowLanguageMenu(false);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Background - Static gradients only */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        <div
          className="absolute w-[600px] h-[600px] rounded-full blur-3xl opacity-5"
          style={{ background: '#1fff94', top: '20%', right: '10%' }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full blur-3xl opacity-5"
          style={{ background: '#1fff94', bottom: '20%', left: '10%' }}
        />
      </div>

      {/* Header with controls */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-20 px-8 py-6"
      >
        <div className="max-w-[1600px] mx-auto flex items-center justify-end gap-4">
          {/* Language Selector */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full hover:border-[#1fff94]/50 hover:bg-[#1fff94]/5 transition-all backdrop-blur-sm"
            >
              <Language className="text-[#1fff94] text-xl" />
              <span className="text-sm font-medium tracking-wider">{languages.find((l) => l.code === currentLanguage)?.name}</span>
            </motion.button>

            <AnimatePresence>
              {showLanguageMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-3 w-44 bg-black/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code as LanguageCode)}
                      className={`w-full px-5 py-3 flex items-center justify-between hover:bg-[#1fff94]/10 transition-colors ${
                        currentLanguage === lang.code ? 'bg-[#1fff94]/20 text-[#1fff94]' : 'text-gray-300'
                      }`}
                    >
                      <span className="text-sm">{lang.fullName}</span>
                      <span className="text-xs font-mono">{lang.name}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Logout Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLogout}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full hover:border-red-500/50 hover:bg-red-500/5 hover:text-red-400 transition-all backdrop-blur-sm"
          >
            <Logout className="text-lg" />
          </motion.button>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 max-w-[1600px] mx-auto px-8 pt-12 pb-16">
        {/* Logo and Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-center mb-16"
        >
          {/* Logo Central */}
          <div className="flex justify-center mb-6">
            <img 
              src={nexorLogo} 
              alt="Nexor Logo" 
              className="w-24 h-24 object-contain" 
              style={{
                filter: 'drop-shadow(0 0 20px rgba(31, 255, 148, 0.3))'
              }}
            />
          </div>

          <h1 className="text-4xl font-bold mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-white via-[#1fff94] to-white bg-clip-text text-transparent">
              NEXOR
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            {translations[currentLanguage].welcome}
          </p>
        </motion.div>

        {/* Module Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-20">
          {menuOptions.map((option, index) => {
            const IconComponent = option.icon;
            return (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                whileHover={{ y: -8 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleModuleClick(option.id)}
                className="group relative p-8 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#1fff94]/50 hover:bg-[#1fff94]/5 transition-all duration-300 overflow-hidden text-left"
              >
                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#1fff94]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Grid pattern */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300">
                  <svg width="100%" height="100%">
                    <pattern id={`grid-${option.id}`} width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1fff94" strokeWidth="0.5"/>
                    </pattern>
                    <rect width="100%" height="100%" fill={`url(#grid-${option.id})`} />
                  </svg>
                </div>

                <div className="relative z-10">
                  {/* Icon */}
                  <div className="mb-6">
                    <IconComponent 
                      className="text-[#1fff94] group-hover:text-white transition-colors duration-300" 
                      size={64}
                      strokeWidth={1.5}
                      style={{
                        filter: 'drop-shadow(0 0 15px rgba(31, 255, 148, 0.4))',
                      }}
                    />
                  </div>

                  {/* Title */}
                  <h3 className="text-[#1fff94] group-hover:text-white text-xl font-bold mb-3 transition-colors duration-300 tracking-wider">
                    {option.title[currentLanguage]}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 text-sm leading-relaxed">
                    {option.description[currentLanguage]}
                  </p>
                </div>

                {/* Corner accents */}
                <div className="absolute top-0 right-0 w-24 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-radial from-[#1fff94]/20 to-transparent" />
                <div className="absolute bottom-0 left-0 w-24 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-radial from-[#1fff94]/20 to-transparent" />
              </motion.button>
            );
          })}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-gray-600 text-sm tracking-wider"
        >
          {translations[currentLanguage].poweredBy}{' '}
          <span className="text-[#1fff94] font-semibold">Nexor</span> © 2026
        </motion.div>
      </main>
    </div>
  );
}

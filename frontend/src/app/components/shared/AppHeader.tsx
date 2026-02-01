import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, type LucideIcon } from 'lucide-react';

interface AppHeaderProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  onBack: () => void;
  actions?: React.ReactNode;
}

export function AppHeader({ title, subtitle, icon: Icon, onBack, actions }: AppHeaderProps) {
  return (
    <div className="bg-black/40 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Back button + Title */}
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1, x: -3 }}
              whileTap={{ scale: 0.9 }}
              onClick={onBack}
              className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all backdrop-blur-sm border border-white/10"
            >
              <ArrowLeft size={20} className="text-[#1fff94]" />
            </motion.button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#1fff94] to-[#00d976] rounded-xl flex items-center justify-center">
                <Icon size={20} className="text-black" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{title}</h1>
                <p className="text-sm text-gray-400">{subtitle}</p>
              </div>
            </div>
          </div>

          {/* Right side - Actions */}
          {actions && (
            <div className="flex items-center gap-3">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

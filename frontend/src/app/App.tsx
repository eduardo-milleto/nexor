// Feature: Improved app structure - v1.1.0
import { useState } from 'react';
import { LoginPage } from '@/app/components/LoginPage';
import { HomePage } from '@/app/components/HomePage';
import { ERPDashboard } from '@/app/components/ERPDashboard';
import { FloatingChat } from '@/app/components/FloatingChat';
import { JupiterAI } from '@/app/components/JupiterAI';
import { GPTApp } from '@/app/components/GPTApp';
import { AdminPanel } from '@/app/components/AdminPanel';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isJupiterOpen, setIsJupiterOpen] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentPage('home');
  };

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('home');
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
  };

  const handleNavigate = (page: string) => {
    console.log('Navigating to:', page);
    setCurrentPage(page);
  };

  const handleBack = () => {
    setCurrentPage('home');
  };

  if (isAdminLoggedIn) {
    return <AdminPanel onLogout={handleAdminLogout} />;
  }

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} onAdminLogin={handleAdminLogin} />;
  }

  return (
    <>
      {currentPage === 'erp' ? (
        <ERPDashboard onBack={handleBack} />
      ) : currentPage === 'gpt' ? (
        <GPTApp onBack={handleBack} language="pt" />
      ) : (
        <HomePage onLogout={handleLogout} onNavigate={handleNavigate} />
      )}

      {/* Floating widgets available on all pages */}
      {currentPage !== 'gpt' && (
        <>
          <FloatingChat
            isOpen={isChatOpen}
            setIsOpen={setIsChatOpen}
            hideButton={isJupiterOpen}
          />
          <JupiterAI
            isOpen={isJupiterOpen}
            setIsOpen={setIsJupiterOpen}
            hideButton={isChatOpen}
          />
        </>
      )}
    </>
  );
}


import React, { useState } from 'react';
import { Globe, Settings, User, LogOut, Menu, X } from 'lucide-react';

interface HeaderProps {
  currentUser: any;
  onLogin: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentUser, onLogin, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('English');

  const languages = ['English', 'Spanish', 'French', 'Portuguese', 'Arabic'];

  return (
    <header className="glass-card border-b sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 primary-gradient rounded-lg flex items-center justify-center text-white font-bold text-xl">
              E
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Education Anywhere</h1>
              <p className="text-xs text-muted-foreground">Learn without limits</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="nav-link">Home</a>
            <a href="#" className="nav-link">Lessons</a>
            <a href="#" className="nav-link">Progress</a>
            {currentUser?.role === 'teacher' && (
              <a href="#" className="nav-link">Dashboard</a>
            )}
          </nav>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative">
              <button className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-muted/20 transition-colors">
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">{currentLanguage}</span>
              </button>
            </div>

            {/* User Menu */}
            {currentUser ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {currentUser.name.charAt(0)}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium">{currentUser.name}</span>
                </div>
                <button 
                  onClick={onLogout}
                  className="p-2 rounded-lg hover:bg-muted/20 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={onLogin}
                className="px-4 py-2 primary-gradient text-white rounded-lg font-medium hover:scale-105 transition-transform"
              >
                Sign In
              </button>
            )}

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-muted/20 transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t animate-slide-up">
            <nav className="flex flex-col space-y-2">
              <a href="#" className="nav-link py-2">Home</a>
              <a href="#" className="nav-link py-2">Lessons</a>
              <a href="#" className="nav-link py-2">Progress</a>
              {currentUser?.role === 'teacher' && (
                <a href="#" className="nav-link py-2">Dashboard</a>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

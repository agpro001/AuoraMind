
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { StatusIndicator } from '../components/StatusIndicator';
import { ProfileGrid } from '../components/ProfileGrid';
import { QuickActions } from '../components/QuickActions';
import { TutorChat } from '../components/TutorChat';
import { LoadingScreen } from '../components/LoadingScreen';
import { LoginModal } from '../components/LoginModal';
import { ScrollReveal } from '../components/ScrollReveal';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Check for existing user session
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData: any) => {
    setCurrentUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    setShowLogin(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        currentUser={currentUser} 
        onLogin={() => setShowLogin(true)} 
        onLogout={handleLogout}
      />
      
      <main className="relative">
        {/* Hero Section */}
        <ScrollReveal>
          <Hero onGetStarted={() => setShowLogin(true)} />
        </ScrollReveal>

        {/* Status Section */}
        <ScrollReveal delay={200}>
          <section className="py-8 px-4">
            <div className="container mx-auto max-w-4xl">
              <StatusIndicator />
            </div>
          </section>
        </ScrollReveal>

        {/* Profile Grid */}
        {currentUser && (
          <ScrollReveal delay={400}>
            <section className="py-12 px-4">
              <div className="container mx-auto max-w-6xl">
                <h2 className="text-3xl font-bold text-center mb-8">
                  Welcome back, {currentUser.name}!
                </h2>
                <ProfileGrid currentUser={currentUser} />
              </div>
            </section>
          </ScrollReveal>
        )}

        {/* Quick Actions */}
        <ScrollReveal delay={600}>
          <section className="py-12 px-4">
            <div className="container mx-auto max-w-6xl">
              <QuickActions 
                onOpenChat={() => setIsChatOpen(true)} 
                currentUser={currentUser}
              />
            </div>
          </section>
        </ScrollReveal>

        {/* Features Preview */}
        <ScrollReveal delay={800}>
          <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/20">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">
                  Everything you need to learn and teach
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Our comprehensive platform works completely offline, bringing quality education to every corner of the world.
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    icon: "🤖",
                    title: "AI Tutor",
                    description: "Get personalized help and explanations that work entirely offline"
                  },
                  {
                    icon: "📚",
                    title: "Interactive Lessons",
                    description: "Engaging content with videos, quizzes, and hands-on activities"
                  },
                  {
                    icon: "👨‍🏫",
                    title: "Teacher Dashboard", 
                    description: "Comprehensive tools for managing classes and tracking progress"
                  }
                ].map((feature, index) => (
                  <div key={index} className="lesson-card stagger-item">
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>
      </main>

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsChatOpen(true)}
        className="fab animate-glow"
        title="Ask AI Tutor"
      >
        🤖
      </button>

      {/* Modals */}
      {showLogin && (
        <LoginModal 
          onClose={() => setShowLogin(false)} 
          onLogin={handleLogin}
        />
      )}

      {isChatOpen && (
        <TutorChat 
          onClose={() => setIsChatOpen(false)}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default Index;


import React from 'react';
import { PlayCircle, BookOpen, Users, Zap } from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      {/* Background Elements */}
      <div className="absolute inset-0 hero-gradient opacity-10"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-hero mb-6 animate-slide-up">
            Learn Anywhere,
            <br />
            <span className="text-secondary">Even Offline</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-subtitle mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Bringing world-class education to every corner of the globe with AI-powered tutoring that works completely offline. No internet? No problem.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <button 
              onClick={onGetStarted}
              className="px-8 py-4 primary-gradient text-white rounded-xl font-semibold text-lg 
                       hover:scale-105 transition-all duration-300 shadow-large hover:shadow-glow
                       flex items-center justify-center space-x-2"
            >
              <PlayCircle className="w-5 h-5" />
              <span>Start Learning</span>
            </button>
            
            <button className="px-8 py-4 glass-card text-foreground rounded-xl font-semibold text-lg
                             hover:scale-105 transition-all duration-300 border-2 border-primary/20
                             flex items-center justify-center space-x-2">
              <BookOpen className="w-5 h-5" />
              <span>Explore Lessons</span>
            </button>
          </div>

          {/* Feature Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            {[
              { icon: BookOpen, label: '1000+ Lessons', description: 'Comprehensive curriculum' },
              { icon: Users, label: '50K+ Students', description: 'Learning worldwide' },
              { icon: Zap, label: '100% Offline', description: 'Works everywhere' }
            ].map((stat, index) => (
              <div key={index} className="glass-card p-6 interactive-hover">
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-2xl font-bold mb-1">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};

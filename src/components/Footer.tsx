import React from 'react';
import { Instagram, Twitter, Mail, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="relative mt-20 bg-gradient-to-t from-card/80 to-background border-t border-border/50">
      {/* 3D Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 primary-gradient rounded-full opacity-20 animate-float blur-xl"></div>
        <div className="absolute top-20 right-20 w-16 h-16 bg-secondary/30 rounded-full animate-pulse-3d blur-lg"></div>
        <div className="absolute bottom-10 left-1/3 w-12 h-12 bg-success/20 rounded-full animate-rotate-3d blur-md"></div>
      </div>

      <div className="relative container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-12 items-center">
          {/* Brand Section */}
          <div className="text-center lg:text-left animate-slide-in-left">
            <div className="flex items-center justify-center lg:justify-start space-x-3 mb-6">
              <div className="w-12 h-12 primary-gradient rounded-xl flex items-center justify-center text-white font-bold text-2xl interactive-hover">
                A
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">AuroraMind</h3>
                <p className="text-sm text-muted-foreground">Knowledge that shines in every corner</p>
              </div>
            </div>
            <p className="text-muted-foreground max-w-md">
              Transforming education through AI-powered learning experiences. 
              Join thousands of students on their journey to knowledge.
            </p>
          </div>

          {/* Contact Information */}
          <div className="text-center animate-flip-in">
            <h4 className="text-xl font-semibold mb-6 text-foreground">Get In Touch</h4>
            <div className="space-y-4">
              <a 
                href="https://instagram.com/agpro001" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-3 glass-card p-4 interactive-hover group"
              >
                <Instagram className="w-5 h-5 text-pink-500 group-hover:scale-110 transition-transform" />
                <span className="text-foreground">@agpro001</span>
              </a>
              
              <a 
                href="https://x.com/agpro001" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-3 glass-card p-4 interactive-hover group"
              >
                <Twitter className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                <span className="text-foreground">@agpro001</span>
              </a>
              
              <a 
                href="mailto:adityagupta1234.in@gmail.com"
                className="flex items-center justify-center space-x-3 glass-card p-4 interactive-hover group"
              >
                <Mail className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform" />
                <span className="text-foreground">adityagupta1234.in@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Mission Statement */}
          <div className="text-center lg:text-right animate-slide-in-right">
            <h4 className="text-xl font-semibold mb-6 text-foreground">Our Mission</h4>
            <div className="glass-card p-6">
              <p className="text-muted-foreground leading-relaxed">
                "Education is the most powerful weapon which you can use to change the world."
              </p>
              <p className="text-sm text-muted-foreground/80 mt-3 font-medium">
                - Nelson Mandela
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border/30 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 animate-pulse" />
              <span>for education</span>
            </div>
            
            <div className="text-center md:text-right text-muted-foreground">
              <p className="text-sm">
                © 2024 AuroraMind. Empowering minds, one lesson at a time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent pointer-events-none"></div>
    </footer>
  );
};
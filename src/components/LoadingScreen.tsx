
import React, { useState, useEffect } from 'react';

export const LoadingScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState('Initializing...');

  const tasks = [
    'Initializing...',
    'Loading AI models...',
    'Checking offline content...',
    'Preparing user interface...',
    'Almost ready...'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15 + 5;
        const taskIndex = Math.min(Math.floor(newProgress / 20), tasks.length - 1);
        setCurrentTask(tasks[taskIndex]);
        return Math.min(newProgress, 100);
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        {/* Logo Animation */}
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-4 primary-gradient rounded-2xl flex items-center justify-center text-white text-3xl font-bold animate-pulse">
            E
          </div>
          <h1 className="text-2xl font-bold mb-2">Education Anywhere</h1>
          <p className="text-muted-foreground">Preparing your learning experience</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-muted/30 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full primary-gradient transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            >
              <div className="h-full bg-white/20 animate-pulse"></div>
            </div>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-muted-foreground">{currentTask}</span>
            <span className="text-primary font-medium">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Loading Animation */}
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-primary rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>

        {/* Offline Indicator */}
        <div className="mt-8 p-4 glass-card">
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-warning rounded-full animate-pulse"></div>
            <span>Preparing offline mode</span>
          </div>
        </div>
      </div>
    </div>
  );
};

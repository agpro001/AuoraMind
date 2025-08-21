
import React from 'react';
import { MessageCircle, BookOpen, BarChart3, Award, Settings, Play } from 'lucide-react';

interface QuickActionsProps {
  onOpenChat: () => void;
  currentUser: any;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onOpenChat, currentUser }) => {
  const actions = [
    {
      icon: Play,
      title: 'Continue Lesson',
      description: 'Pick up where you left off',
      color: 'primary',
      onClick: () => console.log('Continue lesson')
    },
    {
      icon: MessageCircle,
      title: 'Ask AI Tutor',
      description: 'Get help with any question',
      color: 'secondary',
      onClick: onOpenChat
    },
    {
      icon: BookOpen,
      title: 'Browse Lessons',
      description: 'Explore all available content',
      color: 'success',
      onClick: () => console.log('Browse lessons')
    },
    {
      icon: BarChart3,
      title: 'View Progress',
      description: 'Track your learning journey',
      color: 'primary',
      onClick: () => console.log('View progress')
    },
    {
      icon: Award,
      title: 'Achievements',
      description: 'See your badges and rewards',
      color: 'warning',
      onClick: () => console.log('View achievements')
    },
    {
      icon: Settings,
      title: currentUser?.role === 'teacher' ? 'Teacher Tools' : 'Settings',
      description: currentUser?.role === 'teacher' ? 'Manage classes and content' : 'Customize your experience',
      color: 'secondary',
      onClick: () => console.log('Open settings')
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'primary':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'secondary':
        return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'success':
        return 'bg-success/10 text-success border-success/20';
      case 'warning':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-muted/10 text-foreground border-muted/20';
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h3 className="text-3xl font-bold mb-2">Quick Actions</h3>
        <p className="text-muted-foreground text-lg">What would you like to do today?</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {actions.map((action, index) => (
          <div
            key={index}
            onClick={action.onClick}
            className="lesson-card cursor-pointer group stagger-item"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-xl ${getColorClasses(action.color)} border transition-all duration-300 group-hover:scale-110`}>
                <action.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                  {action.title}
                </h4>
                <p className="text-muted-foreground text-sm">
                  {action.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Daily Challenge Section */}
      <div className="mt-12">
        <div className="glass-card p-8 text-center bg-gradient-to-r from-primary/5 to-secondary/5 border-2 border-primary/10">
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="text-2xl font-bold mb-2">Daily Challenge</h3>
          <p className="text-muted-foreground mb-6">
            Complete today's 5-minute quiz to maintain your learning streak!
          </p>
          <button className="px-6 py-3 primary-gradient text-white rounded-lg font-semibold hover:scale-105 transition-transform">
            Start Challenge
          </button>
        </div>
      </div>
    </div>
  );
};

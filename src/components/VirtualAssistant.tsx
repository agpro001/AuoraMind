import React, { useState, useEffect } from 'react';
import { Brain, Sparkles, TrendingUp, Target, Award } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';

interface VirtualAssistantProps {
  onClose: () => void;
  currentUser: any;
}

export const VirtualAssistant: React.FC<VirtualAssistantProps> = ({ onClose, currentUser }) => {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  // Mock data - in production this would come from API
  const stats = {
    todayStudyTime: 2.5,
    weeklyGoal: 20,
    weeklyProgress: 12.5,
    streak: 7,
    testsCompleted: 15,
    averageScore: 85,
  };

  const suggestions = [
    { icon: '📚', title: 'Complete Chapter 5', subject: 'Mathematics', priority: 'high' },
    { icon: '📝', title: 'Practice MCQs', subject: 'Science', priority: 'medium' },
    { icon: '🎯', title: 'Review Weak Topics', subject: 'English', priority: 'high' },
    { icon: '🔬', title: 'Virtual Lab Experiment', subject: 'Chemistry', priority: 'low' },
  ];

  const recentActivity = [
    { action: 'Completed Test', subject: 'Physics', score: 90, time: '2 hours ago' },
    { action: 'Studied Chapter', subject: 'Mathematics', duration: '45 min', time: '5 hours ago' },
    { action: 'Practice MCQs', subject: 'Biology', score: 85, time: '1 day ago' },
  ];

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col animate-fade-in">
      {/* Header */}
      <div className="relative flex items-center justify-between p-6 border-b border-border/30 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 shrink-0">
        <div className="flex items-center space-x-4">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 bg-gradient-primary rounded-2xl animate-pulse-3d opacity-20"></div>
            <div className="relative w-full h-full bg-gradient-primary rounded-2xl flex items-center justify-center shadow-lg">
              <Brain className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">Virtual Assistant</h3>
            <p className="text-sm text-muted-foreground">{greeting}, {currentUser?.name || 'Student'}!</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 rounded-xl hover:bg-muted/30 transition-all duration-300"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6 glass-card animate-slide-up">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Today</span>
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <p className="text-3xl font-bold">{stats.todayStudyTime}h</p>
              <p className="text-sm text-muted-foreground">Study Time</p>
            </Card>

            <Card className="p-6 glass-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Streak</span>
                <Target className="w-5 h-5 text-success" />
              </div>
              <p className="text-3xl font-bold">{stats.streak} days</p>
              <p className="text-sm text-muted-foreground">Keep it up!</p>
            </Card>

            <Card className="p-6 glass-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Tests</span>
                <Award className="w-5 h-5 text-secondary" />
              </div>
              <p className="text-3xl font-bold">{stats.testsCompleted}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </Card>

            <Card className="p-6 glass-card animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Average</span>
                <TrendingUp className="w-5 h-5 text-warning" />
              </div>
              <p className="text-3xl font-bold">{stats.averageScore}%</p>
              <p className="text-sm text-muted-foreground">Score</p>
            </Card>
          </div>

          {/* Weekly Progress */}
          <Card className="p-6 glass-card animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <h4 className="text-lg font-semibold mb-4">Weekly Goal Progress</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{stats.weeklyProgress} hours studied</span>
                <span>{stats.weeklyGoal} hours goal</span>
              </div>
              <Progress value={(stats.weeklyProgress / stats.weeklyGoal) * 100} className="h-3" />
              <p className="text-xs text-muted-foreground">
                {(stats.weeklyGoal - stats.weeklyProgress).toFixed(1)} hours remaining
              </p>
            </div>
          </Card>

          {/* AI Suggestions */}
          <Card className="p-6 glass-card animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center space-x-2 mb-4">
              <Brain className="w-5 h-5 text-primary" />
              <h4 className="text-lg font-semibold">AI Suggestions</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  className="p-4 rounded-xl glass-card hover:scale-102 transition-all duration-300 text-left group"
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{suggestion.icon}</span>
                    <div className="flex-1">
                      <p className="font-semibold group-hover:text-primary transition-colors">
                        {suggestion.title}
                      </p>
                      <p className="text-sm text-muted-foreground">{suggestion.subject}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      suggestion.priority === 'high' ? 'bg-error/20 text-error' :
                      suggestion.priority === 'medium' ? 'bg-warning/20 text-warning' :
                      'bg-success/20 text-success'
                    }`}>
                      {suggestion.priority}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6 glass-card animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <h4 className="text-lg font-semibold mb-4">Recent Activity</h4>
            <div className="space-y-3">
              {recentActivity.map((activity, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-muted/30 flex items-center justify-between hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.subject}</p>
                  </div>
                  <div className="text-right">
                    {'score' in activity && (
                      <p className="font-semibold text-primary">{activity.score}%</p>
                    )}
                    {'duration' in activity && (
                      <p className="font-semibold text-secondary">{activity.duration}</p>
                    )}
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

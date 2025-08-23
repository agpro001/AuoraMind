
import React from 'react';
import { TrendingUp, Award, Target, Calendar, BookOpen, Clock } from 'lucide-react';
import { useLessonStore } from '../store/lessonStore';

export const ProgressDashboard: React.FC = () => {
  const { lessons, progress } = useLessonStore();
  
  const completedLessons = lessons.filter(l => l.completed).length;
  const totalLessons = lessons.length;
  const completionRate = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  
  const totalTimeSpent = completedLessons * 15; // Average lesson time
  const streak = 7; // Mock streak data
  const achievements = 5; // Mock achievements

  const stats = [
    {
      icon: BookOpen,
      label: 'Lessons Completed',
      value: completedLessons,
      total: totalLessons,
      color: 'primary',
      suffix: `/${totalLessons}`
    },
    {
      icon: TrendingUp,
      label: 'Completion Rate',
      value: Math.round(completionRate),
      color: 'success',
      suffix: '%'
    },
    {
      icon: Clock,
      label: 'Time Spent',
      value: totalTimeSpent,
      color: 'warning',
      suffix: ' min'
    },
    {
      icon: Target,
      label: 'Learning Streak',
      value: streak,
      color: 'secondary',
      suffix: ' days'
    }
  ];

  const recentActivity = [
    { action: 'Completed', lesson: 'Introduction to Fractions', time: '2 hours ago', points: 50 },
    { action: 'Started', lesson: 'How Plants Grow', time: '1 day ago', points: 25 },
    { action: 'Completed', lesson: 'Reading Comprehension', time: '2 days ago', points: 45 }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4">Your Progress</h2>
        <p className="text-muted-foreground text-lg">
          Track your learning journey and celebrate your achievements
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="lesson-card stagger-item text-center"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={`w-16 h-16 mx-auto mb-4 bg-${stat.color}/10 rounded-xl flex items-center justify-center`}>
              <stat.icon className={`w-8 h-8 text-${stat.color}`} />
            </div>
            <div className="text-3xl font-bold mb-1">
              {stat.value}<span className="text-lg text-muted-foreground">{stat.suffix}</span>
            </div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
            {stat.total && (
              <div className="mt-3">
                <div className="w-full bg-muted/30 rounded-full h-2">
                  <div 
                    className={`bg-${stat.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${(stat.value / stat.total) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Progress Chart */}
        <div className="lesson-card">
          <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            <span>Learning Progress</span>
          </h3>
          <div className="space-y-4">
            {lessons.slice(0, 5).map((lesson, index) => (
              <div key={lesson.id} className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center text-white text-sm font-bold">
                  {lesson.subject.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{lesson.title}</span>
                    <span className="text-sm text-muted-foreground">
                      {lesson.completed ? '100%' : '0%'}
                    </span>
                  </div>
                  <div className="w-full bg-muted/30 rounded-full h-2">
                    <div 
                      className="primary-gradient h-2 rounded-full transition-all duration-500"
                      style={{ width: lesson.completed ? '100%' : '0%' }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lesson-card">
          <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
            <Calendar className="w-6 h-6 text-primary" />
            <span>Recent Activity</span>
          </h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 bg-muted/10 rounded-lg">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activity.action === 'Completed' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
                }`}>
                  {activity.action === 'Completed' ? '✓' : '▶'}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{activity.action} {activity.lesson}</div>
                  <div className="text-sm text-muted-foreground">{activity.time}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-primary">+{activity.points}</div>
                  <div className="text-xs text-muted-foreground">XP</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="mt-8 lesson-card">
        <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
          <Award className="w-6 h-6 text-warning" />
          <span>Achievements</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'First Lesson', description: 'Complete your first lesson', earned: true, icon: '🎯' },
            { title: 'Math Master', description: 'Complete 5 math lessons', earned: true, icon: '🧮' },
            { title: 'Science Explorer', description: 'Complete 3 science lessons', earned: false, icon: '🔬' },
            { title: 'Reading Champion', description: 'Complete 10 reading lessons', earned: false, icon: '📚' }
          ].map((achievement, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl border-2 text-center transition-all ${
                achievement.earned
                  ? 'border-warning/50 bg-warning/10'
                  : 'border-muted/30 bg-muted/5 opacity-60'
              }`}
            >
              <div className="text-3xl mb-2">{achievement.icon}</div>
              <div className="font-semibold mb-1">{achievement.title}</div>
              <div className="text-xs text-muted-foreground">{achievement.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

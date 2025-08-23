
import React from 'react';
import { X, Brain, TrendingUp, Target, Lightbulb, BarChart3 } from 'lucide-react';
import { useLessonStore, Lesson } from '../store/lessonStore';

interface AIAnalysisPanelProps {
  lesson: Lesson;
  currentStep: number;
  userEngagement: number;
  timeSpent: number;
  onClose: () => void;
}

export const AIAnalysisPanel: React.FC<AIAnalysisPanelProps> = ({
  lesson,
  currentStep,
  userEngagement,
  timeSpent,
  onClose
}) => {
  const { aiAnalysisHistory, userPerformance } = useLessonStore();
  const analysisData = aiAnalysisHistory[lesson.id] || [];
  const performance = userPerformance[lesson.id] || {};

  const generateAIInsights = () => {
    const insights = [];
    
    if (userEngagement > 85) {
      insights.push({
        type: 'positive',
        icon: TrendingUp,
        title: 'Excellent Engagement',
        message: 'Your attention and interaction levels are outstanding! Keep up this momentum.'
      });
    } else if (userEngagement < 70) {
      insights.push({
        type: 'suggestion',
        icon: Lightbulb,
        title: 'Engagement Boost',
        message: 'Try taking a short break or switching to a different learning activity to refresh your focus.'
      });
    }

    if (timeSpent > lesson.content[currentStep]?.duration * 60 * 1.5) {
      insights.push({
        type: 'suggestion',
        icon: Target,
        title: 'Pacing Suggestion',
        message: 'You\'re taking time to deeply understand the material. Consider reviewing key concepts and moving forward.'
      });
    }

    const currentContent = lesson.content[currentStep];
    if (currentContent?.difficulty === 'advanced') {
      insights.push({
        type: 'tip',
        icon: Brain,
        title: 'Advanced Content',
        message: 'This section challenges higher-order thinking. Break complex ideas into smaller parts for better comprehension.'
      });
    }

    return insights;
  };

  const insights = generateAIInsights();

  return (
    <div className="w-80 h-full bg-gradient-to-b from-background/95 to-background/90 backdrop-blur-xl border-l border-border/30 flex flex-col animate-slide-in-right">
      {/* Header */}
      <div className="p-6 border-b border-border/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold">AI Analysis</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        
        {/* Real-time Metrics */}
        <div className="space-y-4">
          <h4 className="font-semibold text-lg">Real-time Metrics</h4>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-primary/10 rounded-xl border border-primary/20">
              <div className="text-2xl font-bold text-primary">{Math.round(userEngagement)}%</div>
              <div className="text-xs text-muted-foreground">Engagement</div>
            </div>
            <div className="p-4 bg-success/10 rounded-xl border border-success/20">
              <div className="text-2xl font-bold text-success">{Math.floor(timeSpent / 60)}'</div>
              <div className="text-xs text-muted-foreground">Time Spent</div>
            </div>
          </div>

          <div className="p-4 bg-warning/10 rounded-xl border border-warning/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Learning Pace</span>
              <BarChart3 className="w-4 h-4 text-warning" />
            </div>
            <div className="w-full bg-muted/30 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-warning to-success h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (currentStep + 1) / lesson.content.length * 100)}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Step {currentStep + 1} of {lesson.content.length}
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="space-y-4">
          <h4 className="font-semibold text-lg">AI Insights</h4>
          
          {insights.map((insight, index) => {
            const IconComponent = insight.icon;
            return (
              <div
                key={index}
                className={`p-4 rounded-xl border animate-fade-in ${
                  insight.type === 'positive' 
                    ? 'bg-success/10 border-success/20' 
                    : insight.type === 'suggestion'
                    ? 'bg-warning/10 border-warning/20'
                    : 'bg-info/10 border-info/20'
                }`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex items-start space-x-3">
                  <IconComponent className={`w-5 h-5 mt-0.5 ${
                    insight.type === 'positive' 
                      ? 'text-success' 
                      : insight.type === 'suggestion'
                      ? 'text-warning'
                      : 'text-info'
                  }`} />
                  <div>
                    <h5 className="font-semibold text-sm">{insight.title}</h5>
                    <p className="text-xs text-muted-foreground mt-1">{insight.message}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Learning Path Recommendations */}
        <div className="space-y-4">
          <h4 className="font-semibold text-lg">Next Steps</h4>
          
          <div className="space-y-3">
            {lesson.learningObjectives.slice(0, 3).map((objective, index) => (
              <div
                key={index}
                className="p-3 bg-muted/10 rounded-lg border border-muted/20 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    index <= currentStep ? 'bg-success animate-pulse' : 'bg-muted/50'
                  }`} />
                  <p className="text-sm">{objective}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance History */}
        {analysisData.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Session History</h4>
            
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {analysisData.slice(-5).map((analysis, index) => (
                <div
                  key={index}
                  className="p-3 bg-background/50 rounded-lg border border-border/10 text-xs"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Step {analysis.step + 1}</span>
                    <span className="text-muted-foreground">
                      {Math.round(analysis.engagement)}% engagement
                    </span>
                  </div>
                  {analysis.concepts && analysis.concepts.length > 0 && (
                    <div className="mt-2 text-muted-foreground">
                      {analysis.concepts[0]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Personalized Tips */}
        <div className="p-4 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-primary/20">
          <h5 className="font-semibold mb-3 flex items-center space-x-2">
            <Lightbulb className="w-4 h-4 text-warning" />
            <span>Personalized Tip</span>
          </h5>
          <p className="text-sm text-muted-foreground">
            Based on your learning pattern, try explaining concepts out loud to improve retention by up to 35%.
          </p>
        </div>
      </div>
    </div>
  );
};

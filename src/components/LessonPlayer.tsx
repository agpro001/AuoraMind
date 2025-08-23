
import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, SkipBack, SkipForward, CheckCircle, Award, Brain, Zap, Target, RotateCcw } from 'lucide-react';
import { useLessonStore, Lesson } from '../store/lessonStore';
import { AIAnalysisPanel } from './AIAnalysisPanel';
import { ThreeDVisualization } from './ThreeDVisualization';
import { LabExperiment } from './LabExperiment';

interface LessonPlayerProps {
  lesson: Lesson;
  onClose: () => void;
}

export const LessonPlayer: React.FC<LessonPlayerProps> = ({ lesson, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const [userEngagement, setUserEngagement] = useState(100);
  const startTimeRef = useRef(Date.now());
  const { completeLesson, updateProgress, addAIAnalysis, updateUserPerformance } = useLessonStore();

  useEffect(() => {
    const progressPercent = ((currentStep + 1) / lesson.content.length) * 100;
    setProgress(progressPercent);
    updateProgress(lesson.id, progressPercent);

    // Simulate AI analysis based on user interaction
    if (lesson.aiAnalysisEnabled && currentStep > 0) {
      const analysis = {
        step: currentStep,
        timeSpent: Date.now() - startTimeRef.current,
        engagement: userEngagement,
        concepts: lesson.content[currentStep].aiInsights || []
      };
      addAIAnalysis(lesson.id, analysis);
    }
  }, [currentStep, lesson.id, lesson.content.length, updateProgress, addAIAnalysis, userEngagement]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
      // Simulate engagement tracking
      setUserEngagement(prev => Math.max(70, prev + (Math.random() - 0.5) * 10));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    if (currentStep < lesson.content.length - 1) {
      setCurrentStep(currentStep + 1);
      // Add 3D transition animation
      const element = document.querySelector('.lesson-content');
      element?.classList.add('animate-slide-out-left');
      setTimeout(() => {
        element?.classList.remove('animate-slide-out-left');
        element?.classList.add('animate-slide-in-right');
      }, 200);
    } else {
      completeLesson(lesson.id);
      updateUserPerformance(lesson.id, {
        timeSpent,
        comprehensionScore: userEngagement,
        completed: true
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      // Add 3D transition animation
      const element = document.querySelector('.lesson-content');
      element?.classList.add('animate-slide-out-right');
      setTimeout(() => {
        element?.classList.remove('animate-slide-out-right');
        element?.classList.add('animate-slide-in-left');
      }, 200);
    }
  };

  const currentContent = lesson.content[currentStep];
  const isLastStep = currentStep === lesson.content.length - 1;
  const estimatedTimeRemaining = lesson.content.slice(currentStep).reduce((sum, content) => sum + content.duration, 0);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-7xl h-[95vh] flex flex-col animate-scale-in overflow-hidden relative">
        
        {/* Floating AI Analysis Button */}
        {lesson.aiAnalysisEnabled && (
          <button
            onClick={() => setShowAIAnalysis(!showAIAnalysis)}
            className="absolute top-4 right-20 z-10 p-3 bg-gradient-to-r from-purple-500 to-pink-500 
                     rounded-full text-white hover:scale-110 transition-all duration-300 shadow-glow animate-pulse-slow"
          >
            <Brain className="w-6 h-6" />
          </button>
        )}

        {/* Enhanced Header with AI Insights */}
        <div className="flex items-center justify-between p-6 border-b border-border/20 bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center text-white text-2xl font-bold animate-float">
                {lesson.subject.charAt(0)}
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-success rounded-full flex items-center justify-center animate-bounce">
                <Zap className="w-4 h-4 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {lesson.title}
              </h2>
              <div className="flex items-center space-x-4 mt-2">
                <p className="text-muted-foreground">{lesson.subject} • Level {lesson.level}</p>
                <div className="flex items-center space-x-2 text-sm">
                  <Target className="w-4 h-4 text-warning" />
                  <span>Engagement: {Math.round(userEngagement)}%</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <RotateCcw className="w-4 h-4 text-info" />
                  <span>Time: {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}</span>
                </div>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-4 rounded-2xl hover:bg-muted/20 transition-all duration-300 hover:scale-110"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Enhanced Progress Bar with Time Estimation */}
        <div className="px-6 py-4 border-b border-border/20 bg-background/30">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-4">
              <span className="text-lg font-semibold">Progress</span>
              <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                {currentContent.difficulty}
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>{Math.round(progress)}% Complete</span>
              <span>Est. {formatTime(estimatedTimeRemaining)} remaining</span>
            </div>
          </div>
          <div className="relative w-full bg-muted/30 rounded-full h-3 overflow-hidden">
            <div 
              className="primary-gradient h-3 transition-all duration-700 ease-out relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent 
                            animate-pulse opacity-50"></div>
            </div>
            {/* Step indicators */}
            <div className="absolute inset-0 flex justify-between items-center px-1">
              {lesson.content.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index <= currentStep ? 'bg-white shadow-glow' : 'bg-muted/50'
                  } ${index === currentStep ? 'scale-150 animate-pulse' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Content Area with 3D Animations */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main Content */}
          <div className={`flex-1 p-6 overflow-y-auto transition-all duration-500 ${
            showAIAnalysis ? 'mr-80' : ''
          }`}>
            <div className="max-w-4xl mx-auto lesson-content">
              
              {/* AI Analysis Content Type */}
              {currentContent.type === 'ai-analysis' && (
                <div className="lesson-card animate-fade-in bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                      <Brain className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold">{currentContent.data.title}</h3>
                  </div>
                  <div className="space-y-6">
                    <p className="text-lg leading-relaxed">{currentContent.data.content}</p>
                    {currentContent.data.analysis && (
                      <div className="p-6 bg-primary/5 rounded-xl border border-primary/20">
                        <h4 className="font-semibold mb-3 flex items-center space-x-2">
                          <Zap className="w-5 h-5 text-warning" />
                          <span>AI Analysis</span>
                        </h4>
                        <p className="text-muted-foreground">{currentContent.data.analysis}</p>
                      </div>
                    )}
                    {currentContent.data.personalizedTips && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {currentContent.data.personalizedTips.map((tip: string, index: number) => (
                          <div key={index} className="p-4 bg-success/10 rounded-xl border border-success/20 animate-fade-in"
                               style={{animationDelay: `${index * 0.2}s`}}>
                            <div className="text-4xl mb-2">💡</div>
                            <p className="text-sm">{tip}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 3D Visualization Content Type */}
              {currentContent.type === '3d-visualization' && (
                <div className="lesson-card animate-scale-in">
                  <h3 className="text-3xl font-bold mb-6 text-center">{currentContent.data.title}</h3>
                  <ThreeDVisualization 
                    models={currentContent.data.models}
                    interactions={currentContent.data.interactions}
                    onInteraction={(type, data) => {
                      setUserEngagement(prev => Math.min(100, prev + 5));
                      addAIAnalysis(lesson.id, {
                        type: '3d-interaction',
                        interaction: type,
                        data,
                        timestamp: Date.now()
                      });
                    }}
                  />
                </div>
              )}

              {/* Lab Experiment Content Type */}
              {currentContent.type === 'lab-experiment' && (
                <div className="lesson-card animate-fade-in">
                  <h3 className="text-3xl font-bold mb-6 text-center">{currentContent.data.title}</h3>
                  <LabExperiment 
                    experiments={currentContent.data.experiments}
                    aiAnalysis={currentContent.data.aiAnalysis}
                    onExperimentComplete={(results) => {
                      setUserEngagement(prev => Math.min(100, prev + 10));
                      addAIAnalysis(lesson.id, {
                        type: 'lab-experiment',
                        results,
                        timestamp: Date.now()
                      });
                    }}
                  />
                </div>
              )}

              {/* Enhanced Text Content */}
              {currentContent.type === 'text' && (
                <div className="lesson-card animate-fade-in">
                  <h3 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {currentContent.data.title}
                  </h3>
                  <div className="prose prose-lg max-w-none">
                    <div className="text-lg leading-relaxed text-muted-foreground whitespace-pre-line">
                      {currentContent.data.content}
                    </div>
                  </div>
                  
                  {/* AI Insights Display */}
                  {currentContent.aiInsights && (
                    <div className="mt-8 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl border border-blue-500/20">
                      <h4 className="font-semibold mb-4 flex items-center space-x-2">
                        <Brain className="w-5 h-5 text-blue-400" />
                        <span>AI Learning Insights</span>
                      </h4>
                      <div className="space-y-2">
                        {currentContent.aiInsights.map((insight, index) => (
                          <div key={index} className="flex items-start space-x-3 animate-slide-up"
                               style={{animationDelay: `${index * 0.3}s`}}>
                            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 animate-pulse"></div>
                            <p className="text-sm text-muted-foreground">{insight}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Interactive Elements with Enhanced 3D Effects */}
                  <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="interactive-hover p-8 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl border border-primary/20">
                      <div className="text-8xl mb-6 text-center animate-float">📚</div>
                      <h4 className="font-bold text-xl mb-3">Deep Dive</h4>
                      <p className="text-sm text-muted-foreground">
                        This concept connects to advanced topics in mathematics, science, and real-world applications.
                      </p>
                    </div>
                    <div className="interactive-hover p-8 bg-gradient-to-br from-success/10 to-warning/10 rounded-2xl border border-success/20">
                      <div className="text-8xl mb-6 text-center animate-float" style={{animationDelay: '1s'}}>💡</div>
                      <h4 className="font-bold text-xl mb-3">Pro Tips</h4>
                      <p className="text-sm text-muted-foreground">
                        Master this by connecting it to things you already know and practicing regularly.
                      </p>
                    </div>
                    <div className="interactive-hover p-8 bg-gradient-to-br from-warning/10 to-error/10 rounded-2xl border border-warning/20">
                      <div className="text-8xl mb-6 text-center animate-float" style={{animationDelay: '2s'}}>🎯</div>
                      <h4 className="font-bold text-xl mb-3">Real World</h4>
                      <p className="text-sm text-muted-foreground">
                        See how this applies to careers in technology, science, art, and everyday problem-solving.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Enhanced Interactive Content */}
              {currentContent.type === 'interactive' && (
                <div className="lesson-card animate-scale-in">
                  <h3 className="text-3xl font-bold mb-8 text-center">
                    {currentContent.data.title}
                  </h3>
                  
                  {currentContent.data.activities && (
                    <div className="space-y-8">
                      {currentContent.data.activities.map((activity: any, index: number) => (
                        <div key={index} className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl border-2 border-dashed border-primary/30 hover:border-primary/60 transition-all duration-500 interactive-hover">
                          <div className="flex items-center space-x-4 mb-6">
                            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-white font-bold text-xl">
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="text-xl font-bold">{activity.name}</h4>
                              <p className="text-muted-foreground">{formatTime(activity.duration)} • {activity.difficulty}</p>
                            </div>
                          </div>
                          <p className="text-lg mb-6">{activity.description}</p>
                          <button className="px-8 py-4 primary-gradient text-white rounded-xl font-semibold hover:scale-105 transition-transform">
                            Start Activity
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Fallback for older interactive content */}
                  {currentContent.data.question && (
                    <div className="bg-gradient-to-br from-primary/5 to-secondary/5 p-8 rounded-2xl border">
                      <p className="text-xl mb-8">{currentContent.data.question}</p>
                      <div className="grid grid-cols-2 gap-6">
                        {currentContent.data.options?.map((option: string, index: number) => (
                          <button
                            key={index}
                            className="p-6 bg-background/50 border-2 border-dashed border-primary/30 
                                     rounded-2xl hover:border-primary/60 hover:bg-primary/10 
                                     transition-all duration-300 text-lg font-medium interactive-hover"
                            onClick={() => setUserEngagement(prev => Math.min(100, prev + 5))}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* AI Analysis Side Panel */}
          {showAIAnalysis && (
            <AIAnalysisPanel 
              lesson={lesson}
              currentStep={currentStep}
              userEngagement={userEngagement}
              timeSpent={timeSpent}
              onClose={() => setShowAIAnalysis(false)}
            />
          )}
        </div>

        {/* Enhanced Controls with Time Display */}
        <div className="p-6 border-t border-border/20 bg-gradient-to-r from-background/80 to-background/60 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center space-x-3 px-8 py-4 rounded-2xl bg-muted/20 
                       hover:bg-muted/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                       hover:scale-105 interactive-hover"
            >
              <SkipBack className="w-6 h-6" />
              <span className="font-semibold">Previous</span>
            </button>

            <div className="flex items-center space-x-8">
              <div className="text-center">
                <div className="text-2xl font-bold">{currentStep + 1}</div>
                <div className="text-sm text-muted-foreground">of {lesson.content.length}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{formatTime(currentContent.duration)}</div>
                <div className="text-sm text-muted-foreground">section time</div>
              </div>
            </div>

            <button
              onClick={handleNext}
              className="flex items-center space-x-3 px-8 py-4 primary-gradient text-white 
                       rounded-2xl hover:scale-105 transition-all duration-300 font-bold text-lg shadow-glow"
            >
              {isLastStep ? (
                <>
                  <CheckCircle className="w-6 h-6" />
                  <span>Complete Lesson</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <SkipForward className="w-6 h-6" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Enhanced Completion Celebration */}
        {progress === 100 && (
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 to-black/60 backdrop-blur-lg flex items-center justify-center animate-fade-in z-50">
            <div className="glass-card p-12 text-center animate-scale-in max-w-lg">
              <div className="text-8xl mb-6 animate-bounce">🎉</div>
              <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Lesson Mastered!
              </h3>
              <p className="text-xl text-muted-foreground mb-8">
                Outstanding work! You've completed this comprehensive lesson.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="p-4 bg-success/10 rounded-xl border border-success/20">
                  <Award className="w-8 h-8 text-warning mx-auto mb-2" />
                  <div className="font-bold text-2xl">+150 XP</div>
                  <div className="text-sm text-muted-foreground">Experience Points</div>
                </div>
                <div className="p-4 bg-primary/10 rounded-xl border border-primary/20">
                  <Brain className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="font-bold text-2xl">{Math.round(userEngagement)}%</div>
                  <div className="text-sm text-muted-foreground">Engagement Score</div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="px-8 py-4 primary-gradient text-white rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-glow"
              >
                Continue Learning Journey
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


import React, { useState, useEffect } from 'react';
import { X, Play, Pause, SkipBack, SkipForward, CheckCircle, Award } from 'lucide-react';
import { useLessonStore, Lesson } from '../store/lessonStore';

interface LessonPlayerProps {
  lesson: Lesson;
  onClose: () => void;
}

export const LessonPlayer: React.FC<LessonPlayerProps> = ({ lesson, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const { completeLesson, updateProgress } = useLessonStore();

  useEffect(() => {
    const progressPercent = ((currentStep + 1) / lesson.content.length) * 100;
    setProgress(progressPercent);
    updateProgress(lesson.id, progressPercent);
  }, [currentStep, lesson.id, lesson.content.length, updateProgress]);

  const handleNext = () => {
    if (currentStep < lesson.content.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeLesson(lesson.id);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentContent = lesson.content[currentStep];
  const isLastStep = currentStep === lesson.content.length - 1;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-4xl h-[85vh] flex flex-col animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/20">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-white text-xl font-bold">
              {lesson.subject.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{lesson.title}</h2>
              <p className="text-muted-foreground">{lesson.subject} • Level {lesson.level}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 rounded-xl hover:bg-muted/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 border-b border-border/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-muted/30 rounded-full h-2">
            <div 
              className="primary-gradient h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            {currentContent.type === 'text' && (
              <div className="lesson-card animate-fade-in">
                <h3 className="text-3xl font-bold mb-6 text-center">
                  {currentContent.data.title}
                </h3>
                <div className="prose prose-lg max-w-none">
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    {currentContent.data.content}
                  </p>
                </div>
                {/* Interactive Elements */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-primary/10 rounded-xl border border-primary/20">
                    <div className="text-6xl mb-4 text-center">📚</div>
                    <h4 className="font-semibold mb-2">Did you know?</h4>
                    <p className="text-sm text-muted-foreground">
                      This concept is used in everyday life, from cooking to construction!
                    </p>
                  </div>
                  <div className="p-6 bg-success/10 rounded-xl border border-success/20">
                    <div className="text-6xl mb-4 text-center">💡</div>
                    <h4 className="font-semibold mb-2">Quick Tip</h4>
                    <p className="text-sm text-muted-foreground">
                      Try to relate this to something you already know!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {currentContent.type === 'interactive' && (
              <div className="lesson-card animate-fade-in">
                <h3 className="text-2xl font-bold mb-6 text-center">
                  Interactive Practice
                </h3>
                <div className="bg-gradient-to-br from-primary/5 to-secondary/5 p-8 rounded-xl border">
                  <p className="text-lg mb-6">{currentContent.data.question}</p>
                  <div className="grid grid-cols-2 gap-4">
                    {currentContent.data.options.map((option: string, index: number) => (
                      <button
                        key={index}
                        className="p-4 bg-background/50 border-2 border-dashed border-primary/30 
                                 rounded-xl hover:border-primary/60 hover:bg-primary/10 
                                 transition-all duration-300 text-lg font-medium"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 border-t border-border/20 bg-background/50">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-muted/20 
                       hover:bg-muted/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <SkipBack className="w-5 h-5" />
              <span>Previous</span>
            </button>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                {currentStep + 1} of {lesson.content.length}
              </span>
            </div>

            <button
              onClick={handleNext}
              className="flex items-center space-x-2 px-6 py-3 primary-gradient text-white 
                       rounded-xl hover:scale-105 transition-transform font-semibold"
            >
              {isLastStep ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Complete</span>
                </>
              ) : (
                <>
                  <span>Next</span>
                  <SkipForward className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Completion Celebration */}
        {progress === 100 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center animate-fade-in">
            <div className="glass-card p-8 text-center animate-scale-in">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold mb-2">Lesson Completed!</h3>
              <p className="text-muted-foreground mb-6">
                Great job! You've successfully completed this lesson.
              </p>
              <div className="flex items-center justify-center space-x-2 mb-6">
                <Award className="w-6 h-6 text-warning" />
                <span className="font-semibold">+50 XP Earned!</span>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-3 primary-gradient text-white rounded-xl font-semibold hover:scale-105 transition-transform"
              >
                Continue Learning
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

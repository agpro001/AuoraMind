import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Clock, Trophy, ArrowRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface MCQTestProps {
  onClose: () => void;
  subject: string;
  chapter: string;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

// Sample questions - in production, these would come from an API
const sampleQuestions: Question[] = [
  {
    id: 1,
    question: "What is the square root of 144?",
    options: ["10", "11", "12", "13"],
    correctAnswer: 2,
    explanation: "The square root of 144 is 12 because 12 × 12 = 144"
  },
  {
    id: 2,
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
    explanation: "Paris is the capital and most populous city of France"
  },
  {
    id: 3,
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1,
    explanation: "Mars appears red because of iron oxide (rust) on its surface"
  },
  {
    id: 4,
    question: "What is 15% of 200?",
    options: ["25", "30", "35", "40"],
    correctAnswer: 1,
    explanation: "15% of 200 = (15/100) × 200 = 30"
  },
  {
    id: 5,
    question: "Who wrote 'Romeo and Juliet'?",
    options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
    correctAnswer: 1,
    explanation: "William Shakespeare wrote Romeo and Juliet in the 1590s"
  },
];

export const MCQTest: React.FC<MCQTestProps> = ({ onClose, subject, chapter }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(sampleQuestions.length).fill(null));
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [testCompleted, setTestCompleted] = useState(false);

  useEffect(() => {
    if (testCompleted) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleFinishTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [testCompleted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (optionIndex: number) => {
    setSelectedAnswer(optionIndex);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(answers[currentQuestion + 1]);
      setShowResult(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1]);
      setShowResult(false);
    }
  };

  const handleFinishTest = () => {
    let finalScore = 0;
    answers.forEach((answer, idx) => {
      if (answer === sampleQuestions[idx].correctAnswer) {
        finalScore++;
      }
    });
    setScore(finalScore);
    setTestCompleted(true);
  };

  const progress = ((currentQuestion + 1) / sampleQuestions.length) * 100;
  const question = sampleQuestions[currentQuestion];

  if (testCompleted) {
    const percentage = (score / sampleQuestions.length) * 100;
    return (
      <div className="fixed inset-0 bg-background z-50 flex items-center justify-center p-4 animate-fade-in">
        <div className="glass-card w-full max-w-2xl p-8 animate-scale-in text-center space-y-6">
          <div className="relative w-32 h-32 mx-auto">
            <div className="absolute inset-0 bg-gradient-primary rounded-full animate-pulse-3d opacity-20"></div>
            <div className="relative w-full h-full bg-gradient-primary rounded-full flex items-center justify-center text-5xl shadow-lg">
              <Trophy className="w-16 h-16 text-primary-foreground" />
            </div>
          </div>
          
          <h2 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Test Completed!
          </h2>
          
          <div className="space-y-4">
            <div className="text-6xl font-bold text-primary">{percentage.toFixed(0)}%</div>
            <p className="text-xl text-muted-foreground">
              You scored {score} out of {sampleQuestions.length}
            </p>
            
            <div className="glass-card p-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span>Correct Answers:</span>
                <span className="font-semibold text-success">{score}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Wrong Answers:</span>
                <span className="font-semibold text-error">{sampleQuestions.length - score}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Time Taken:</span>
                <span className="font-semibold">{formatTime(600 - timeLeft)}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Close
            </Button>
            <Button onClick={() => window.location.reload()} className="flex-1 bg-gradient-primary">
              Retry Test
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col animate-fade-in">
      {/* Header */}
      <div className="relative flex items-center justify-between p-6 border-b border-border/30 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 shrink-0">
        <div className="flex items-center space-x-4">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 bg-gradient-primary rounded-2xl animate-pulse-3d opacity-20"></div>
            <div className="relative w-full h-full bg-gradient-primary rounded-2xl flex items-center justify-center text-3xl shadow-lg">
              📝
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">MCQ Test</h3>
            <p className="text-sm text-muted-foreground">{subject} - {chapter}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-4 py-2 rounded-xl glass-card">
            <Clock className="w-5 h-5 text-primary" />
            <span className="font-mono text-lg font-semibold">{formatTime(timeLeft)}</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-muted/30 transition-all duration-300"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="px-6 py-4 border-b border-border/20 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Question {currentQuestion + 1} of {sampleQuestions.length}</span>
          <span className="text-sm text-muted-foreground">{progress.toFixed(0)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto space-y-6 animate-slide-up">
          <div className="glass-card p-8">
            <h4 className="text-2xl font-semibold mb-6">{question.question}</h4>
            
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 rounded-xl text-left transition-all duration-300 ${
                    selectedAnswer === index
                      ? 'bg-gradient-primary text-primary-foreground shadow-lg scale-102'
                      : 'glass-card hover:scale-102 hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                      selectedAnswer === index ? 'bg-white/20' : 'bg-muted'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </button>
              ))}
            </div>

            {showResult && selectedAnswer !== null && (
              <div className={`mt-6 p-4 rounded-xl ${
                selectedAnswer === question.correctAnswer
                  ? 'bg-success/10 border border-success/30'
                  : 'bg-error/10 border border-error/30'
              } animate-slide-up`}>
                <div className="flex items-start space-x-3">
                  {selectedAnswer === question.correctAnswer ? (
                    <CheckCircle2 className="w-6 h-6 text-success shrink-0 mt-1" />
                  ) : (
                    <XCircle className="w-6 h-6 text-error shrink-0 mt-1" />
                  )}
                  <div>
                    <p className="font-semibold mb-1">
                      {selectedAnswer === question.correctAnswer ? 'Correct!' : 'Incorrect'}
                    </p>
                    <p className="text-sm opacity-90">{question.explanation}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            <Button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              variant="outline"
              className="flex-1"
            >
              Previous
            </Button>
            
            {!showResult && selectedAnswer !== null && (
              <Button
                onClick={() => setShowResult(true)}
                className="flex-1 bg-primary"
              >
                Check Answer
              </Button>
            )}

            {currentQuestion === sampleQuestions.length - 1 ? (
              <Button
                onClick={handleFinishTest}
                className="flex-1 bg-gradient-primary"
              >
                Finish Test
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="flex-1 bg-gradient-primary"
              >
                Next <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

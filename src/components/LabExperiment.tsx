
import React, { useState, useEffect } from 'react';
import { Beaker, PlayCircle, PauseCircle, RotateCcw, TrendingUp, CheckCircle } from 'lucide-react';

interface Experiment {
  name: string;
  description: string;
  materials?: string[];
  procedure?: string[];
  duration: number;
}

interface LabExperimentProps {
  experiments: Experiment[];
  aiAnalysis?: any;
  onExperimentComplete: (results: any) => void;
}

export const LabExperiment: React.FC<LabExperimentProps> = ({
  experiments,
  aiAnalysis,
  onExperimentComplete
}) => {
  const [currentExperiment, setCurrentExperiment] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any[]>([]);
  const [observations, setObservations] = useState('');

  const experiment = experiments[currentExperiment];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 / (experiment.duration * 10)); // 10 steps per minute
          if (newProgress >= 100) {
            setIsRunning(false);
            completeExperiment();
            return 100;
          }
          return newProgress;
        });
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, experiment.duration]);

  const startExperiment = () => {
    setIsRunning(true);
    setProgress(0);
  };

  const pauseExperiment = () => {
    setIsRunning(false);
  };

  const resetExperiment = () => {
    setIsRunning(false);
    setProgress(0);
    setResults([]);
    setObservations('');
  };

  const completeExperiment = () => {
    const experimentResults = {
      experimentName: experiment.name,
      timeCompleted: Date.now(),
      observations,
      dataPoints: generateExperimentData(),
      accuracy: Math.random() * 30 + 70, // Simulate 70-100% accuracy
      insights: generateInsights()
    };
    
    setResults(prev => [...prev, experimentResults]);
    onExperimentComplete(experimentResults);
  };

  const generateExperimentData = () => {
    // Generate realistic-looking experimental data
    const dataPoints = [];
    for (let i = 0; i <= 10; i++) {
      dataPoints.push({
        time: i,
        value: Math.sin(i * 0.5) * 50 + 50 + (Math.random() - 0.5) * 10,
        measurement: `Measurement ${i + 1}`
      });
    }
    return dataPoints;
  };

  const generateInsights = () => {
    const insights = [
      'The relationship between variables follows an expected pattern',
      'Small variations indicate normal experimental uncertainty',
      'Results support the theoretical prediction',
      'The data shows clear evidence of the underlying principle'
    ];
    
    return insights[Math.floor(Math.random() * insights.length)];
  };

  return (
    <div className="w-full space-y-6">
      {/* Experiment Selection */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
          <Beaker className="w-8 h-8 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold">Virtual Laboratory</h3>
          <p className="text-muted-foreground">Conduct interactive experiments with real-time data</p>
        </div>
      </div>

      {/* Experiment Tabs */}
      <div className="flex space-x-2 bg-muted/10 p-2 rounded-xl">
        {experiments.map((exp, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentExperiment(index);
              resetExperiment();
            }}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
              currentExperiment === index
                ? 'bg-primary text-primary-foreground shadow-lg'
                : 'hover:bg-muted/20'
            }`}
          >
            {exp.name}
          </button>
        ))}
      </div>

      {/* Current Experiment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Experiment Setup */}
        <div className="space-y-6">
          <div className="lesson-card">
            <h4 className="text-xl font-bold mb-4">{experiment.name}</h4>
            <p className="text-muted-foreground mb-6">{experiment.description}</p>
            
            {experiment.materials && (
              <div className="mb-6">
                <h5 className="font-semibold mb-3">Materials:</h5>
                <div className="grid grid-cols-2 gap-2">
                  {experiment.materials.map((material, index) => (
                    <div
                      key={index}
                      className="p-3 bg-muted/10 rounded-lg border border-muted/20 text-sm animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {material}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {experiment.procedure && (
              <div className="mb-6">
                <h5 className="font-semibold mb-3">Procedure:</h5>
                <ol className="space-y-2">
                  {experiment.procedure.map((step, index) => (
                    <li
                      key={index}
                      className="flex items-start space-x-3 animate-slide-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-sm flex-1">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          {/* Observations */}
          <div className="lesson-card">
            <h5 className="font-semibold mb-3">Observations & Notes:</h5>
            <textarea
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Record your observations as the experiment progresses..."
              className="w-full h-32 p-3 bg-background/50 border border-border/30 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        {/* Experiment Simulation */}
        <div className="space-y-6">
          
          {/* Controls */}
          <div className="lesson-card">
            <div className="flex items-center justify-between mb-4">
              <h5 className="font-semibold">Experiment Controls</h5>
              <div className="text-sm text-muted-foreground">
                Duration: {experiment.duration} min
              </div>
            </div>
            
            <div className="flex items-center space-x-4 mb-6">
              <button
                onClick={startExperiment}
                disabled={isRunning || progress === 100}
                className="flex items-center space-x-2 px-6 py-3 bg-success text-success-foreground rounded-xl font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PlayCircle className="w-5 h-5" />
                <span>Start</span>
              </button>
              
              <button
                onClick={pauseExperiment}
                disabled={!isRunning}
                className="flex items-center space-x-2 px-6 py-3 bg-warning text-warning-foreground rounded-xl font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PauseCircle className="w-5 h-5" />
                <span>Pause</span>
              </button>
              
              <button
                onClick={resetExperiment}
                className="flex items-center space-x-2 px-6 py-3 bg-muted/20 hover:bg-muted/30 rounded-xl font-semibold transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Reset</span>
              </button>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-muted/30 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-success to-primary h-3 rounded-full transition-all duration-300 relative overflow-hidden"
                  style={{ width: `${progress}%` }}
                >
                  {isRunning && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Data Visualization */}
          <div className="lesson-card">
            <h5 className="font-semibold mb-4 flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Real-time Data</span>
            </h5>
            
            <div className="h-48 bg-background/30 rounded-lg border border-border/20 relative overflow-hidden">
              {/* Simulated graph */}
              <div className="absolute inset-4">
                <svg className="w-full h-full">
                  {/* Grid lines */}
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="hsl(var(--muted))" strokeWidth="0.5" opacity="0.3"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  
                  {/* Animated data line */}
                  {progress > 0 && (
                    <polyline
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="3"
                      strokeLinecap="round"
                      points={generateDataPoints(progress)}
                      className="animate-pulse"
                    />
                  )}
                </svg>
                
                {/* Data labels */}
                <div className="absolute bottom-0 left-0 text-xs text-muted-foreground">
                  Time
                </div>
                <div className="absolute top-0 left-0 text-xs text-muted-foreground transform -rotate-90 origin-left">
                  Value
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="lesson-card">
              <h5 className="font-semibold mb-4 flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <span>Experiment Results</span>
              </h5>
              
              {results.map((result, index) => (
                <div key={index} className="p-4 bg-success/10 rounded-xl border border-success/20 mb-4 animate-fade-in">
                  <div className="flex justify-between items-start mb-3">
                    <h6 className="font-semibold">{result.experimentName}</h6>
                    <div className="text-sm text-success font-medium">
                      {Math.round(result.accuracy)}% Accuracy
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">{result.insights}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="font-medium">Data Points:</span> {result.dataPoints.length}
                    </div>
                    <div>
                      <span className="font-medium">Completed:</span> {new Date(result.timeCompleted).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  function generateDataPoints(progress: number): string {
    const points = [];
    const maxPoints = Math.floor(progress / 10);
    
    for (let i = 0; i <= maxPoints; i++) {
      const x = (i / 10) * 100;
      const y = 50 + Math.sin(i * 0.5) * 30 + (Math.random() - 0.5) * 10;
      points.push(`${x},${100 - y}`);
    }
    
    return points.join(' ');
  }
};

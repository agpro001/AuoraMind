
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LessonContent {
  type: 'video' | 'text' | 'interactive' | 'quiz' | 'ai-analysis' | '3d-visualization' | 'lab-experiment';
  data: any;
  duration: number; // in minutes
  aiInsights?: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface Lesson {
  id: string;
  title: string;
  subject: string;
  level: number;
  duration: number; // total duration in minutes
  description: string;
  content: LessonContent[];
  completed: boolean;
  aiAnalysisEnabled: boolean;
  prerequisites?: string[];
  learningObjectives: string[];
  assessmentCriteria: string[];
}

interface LessonState {
  lessons: Lesson[];
  currentLesson: Lesson | null;
  progress: Record<string, number>;
  aiAnalysisHistory: Record<string, any[]>;
  userPerformance: Record<string, {
    timeSpent: number;
    correctAnswers: number;
    totalQuestions: number;
    comprehensionScore: number;
  }>;
  setCurrentLesson: (lesson: Lesson) => void;
  completeLesson: (lessonId: string) => void;
  updateProgress: (lessonId: string, progress: number) => void;
  addAIAnalysis: (lessonId: string, analysis: any) => void;
  updateUserPerformance: (lessonId: string, performance: any) => void;
}

const createExtendedContent = (): LessonContent[] => [
  {
    type: 'ai-analysis',
    duration: 5,
    difficulty: 'beginner',
    data: {
      title: 'AI-Powered Learning Assessment',
      content: 'Our AI will analyze your learning style and adapt the content accordingly.',
      analysis: 'Based on your interaction patterns, we recommend focusing on visual learning methods.',
      personalizedTips: [
        'Visual learners benefit from diagrams and charts',
        'Break complex concepts into smaller visual chunks',
        'Use mind maps to connect related ideas'
      ]
    },
    aiInsights: [
      'This student shows strong visual processing abilities',
      'Recommended to increase interactive visual content by 30%',
      'Optimal learning session length: 25-30 minutes'
    ]
  },
  {
    type: '3d-visualization',
    duration: 15,
    difficulty: 'beginner',
    data: {
      title: 'Interactive 3D Models',
      content: 'Explore concepts through immersive 3D visualizations.',
      models: ['fraction-pie', 'geometric-shapes', 'molecular-structure'],
      interactions: ['rotate', 'zoom', 'disassemble', 'annotate']
    }
  },
  {
    type: 'text',
    duration: 10,
    difficulty: 'beginner',
    data: {
      title: 'Deep Dive: Understanding Fractions',
      content: `Fractions are fundamental mathematical concepts that represent parts of a whole. Let's explore this concept through multiple perspectives:

      **Historical Context:**
      Fractions have been used by civilizations for over 4,000 years. Ancient Egyptians used unit fractions, while Babylonians developed sophisticated fraction systems for astronomy and commerce.

      **Mathematical Foundation:**
      A fraction consists of two parts:
      - Numerator (top number): represents the number of parts we have
      - Denominator (bottom number): represents the total number of equal parts

      **Real-World Applications:**
      - Cooking and recipes (1/2 cup of flour)
      - Time management (1/4 of an hour = 15 minutes)
      - Finance (1/3 of your income for housing)
      - Architecture and construction
      - Art and design proportions

      **Cognitive Science Insights:**
      Research shows that understanding fractions requires multiple cognitive skills including spatial reasoning, number sense, and proportional thinking. Students who master fractions early show better performance in advanced mathematics.`
    },
    aiInsights: [
      'This content integrates historical, mathematical, and practical perspectives',
      'Multidisciplinary approach enhances long-term retention by 45%',
      'Real-world connections improve student engagement scores'
    ]
  },
  {
    type: 'interactive',
    duration: 20,
    difficulty: 'intermediate',
    data: {
      type: 'advanced-simulation',
      title: 'Fraction Workshop: Build Your Understanding',
      description: 'Interactive workshop with multiple activities and real-time AI feedback.',
      activities: [
        {
          name: 'Visual Fraction Builder',
          description: 'Create fractions using interactive pie charts and bar models',
          duration: 5,
          difficulty: 'beginner'
        },
        {
          name: 'Equivalent Fractions Detective',
          description: 'Solve puzzles to find equivalent fractions using multiple methods',
          duration: 7,
          difficulty: 'intermediate'
        },
        {
          name: 'Real-World Problem Solver',
          description: 'Apply fraction knowledge to cooking, construction, and art projects',
          duration: 8,
          difficulty: 'advanced'
        }
      ],
      aiFeatures: {
        adaptiveDifficulty: true,
        personalizedHints: true,
        progressTracking: true,
        performanceAnalysis: true
      }
    }
  },
  {
    type: 'lab-experiment',
    duration: 25,
    difficulty: 'intermediate',
    data: {
      title: 'Virtual Math Laboratory',
      description: 'Conduct experiments to discover mathematical principles',
      experiments: [
        {
          name: 'Fraction Pizza Party',
          description: 'Divide pizzas among friends using different fraction strategies',
          materials: ['Virtual pizzas', 'Cutting tools', 'Measurement devices'],
          procedure: [
            'Select number of pizzas and friends',
            'Experiment with different cutting strategies',
            'Compare efficiency and fairness of different approaches',
            'Record observations and mathematical insights'
          ],
          duration: 12
        },
        {
          name: 'Architecture Challenge',
          description: 'Design a building using fractional measurements',
          materials: ['3D building blocks', 'Measurement tools', 'Blueprint creator'],
          procedure: [
            'Create building specifications using fractions',
            'Build 3D model following fractional blueprints',
            'Test structural integrity',
            'Calculate material costs using fractional pricing'
          ],
          duration: 13
        }
      ],
      aiAnalysis: {
        experimentTracking: true,
        hypothesisGeneration: true,
        resultAnalysis: true,
        conceptualConnections: true
      }
    }
  },
  {
    type: 'quiz',
    duration: 15,
    difficulty: 'intermediate',
    data: {
      title: 'Comprehensive Fraction Mastery Assessment',
      description: 'Multi-modal assessment with adaptive questioning',
      questionTypes: [
        'multiple-choice',
        'drag-and-drop',
        'drawing-response',
        'explanation-required',
        'real-world-application'
      ],
      adaptiveFeatures: {
        difficultyAdjustment: true,
        conceptualRemediation: true,
        strengthIdentification: true,
        personalizedFeedback: true
      },
      questions: [
        {
          type: 'interactive-visual',
          question: 'Drag the fraction pieces to show 3/4 in three different ways',
          feedback: 'AI analyzes visual reasoning and provides personalized tips',
          aiInsights: 'Tracks spatial reasoning development'
        },
        {
          type: 'real-world-scenario',
          question: 'You\'re a chef making a recipe for 8 people, but only have 6 guests. How would you adjust the ingredients?',
          feedback: 'AI evaluates practical application and mathematical reasoning',
          aiInsights: 'Assesses transfer of learning to real contexts'
        }
      ]
    }
  },
  {
    type: 'ai-analysis',
    duration: 10,
    difficulty: 'advanced',
    data: {
      title: 'Personalized Learning Insights',
      content: 'AI-powered analysis of your learning journey and recommendations for optimization.',
      analysisTypes: [
        'Learning Pattern Recognition',
        'Strength and Weakness Identification',
        'Optimal Learning Path Suggestion',
        'Cognitive Load Assessment',
        'Retention Prediction Modeling'
      ],
      personalizedRecommendations: {
        nextTopics: ['Decimal equivalents', 'Fraction operations', 'Mixed numbers'],
        studySchedule: 'Optimal review intervals based on forgetting curve analysis',
        learningStrategies: 'Personalized based on cognitive profile',
        practiceProblems: 'Adaptive difficulty and content selection'
      }
    },
    aiInsights: [
      'Student demonstrates strong conceptual understanding',
      'Recommended focus: procedural fluency development',
      'Optimal next session: 72 hours for maximum retention'
    ]
  }
];

const defaultLessons: Lesson[] = [
  {
    id: 'math-fractions-advanced',
    title: 'Master Fractions: From Basics to Real-World Applications',
    subject: 'Mathematics',
    level: 3,
    duration: 120, // 2 hours
    description: 'Comprehensive exploration of fractions with AI-powered personalization, 3D visualizations, and hands-on experiments',
    content: createExtendedContent(),
    completed: false,
    aiAnalysisEnabled: true,
    prerequisites: ['Basic arithmetic', 'Number recognition'],
    learningObjectives: [
      'Understand fraction concepts through multiple representations',
      'Apply fractions to real-world problem solving',
      'Develop spatial reasoning through 3D visualizations',
      'Build confidence through personalized AI guidance'
    ],
    assessmentCriteria: [
      'Conceptual understanding (40%)',
      'Procedural fluency (30%)',
      'Problem-solving application (20%)',
      'Communication and reasoning (10%)'
    ]
  },
  {
    id: 'science-ecosystem-deep',
    title: 'Ecosystem Dynamics: AI-Enhanced Environmental Science',
    subject: 'Science',
    level: 4,
    duration: 90, // 1.5 hours
    description: 'Immersive ecosystem exploration with 3D environmental simulations and AI-powered ecological analysis',
    content: [
      {
        type: 'ai-analysis',
        duration: 8,
        difficulty: 'beginner',
        data: {
          title: 'Environmental Intelligence Assessment',
          content: 'AI analyzes your environmental awareness and suggests personalized learning paths.',
          analysis: 'Your profile shows strong interest in conservation and systems thinking.'
        }
      },
      {
        type: '3d-visualization',
        duration: 25,
        difficulty: 'intermediate',
        data: {
          title: 'Virtual Ecosystem Explorer',
          content: 'Navigate through photorealistic 3D ecosystems and observe species interactions.',
          models: ['rainforest-canopy', 'coral-reef', 'arctic-tundra', 'grassland-savanna'],
          interactions: ['species-tracking', 'food-web-building', 'climate-simulation']
        }
      },
      {
        type: 'lab-experiment',
        duration: 35,
        difficulty: 'advanced',
        data: {
          title: 'Digital Ecology Laboratory',
          description: 'Conduct virtual field research with real-time data analysis',
          experiments: [
            {
              name: 'Population Dynamics Simulation',
              description: 'Model predator-prey relationships over time',
              duration: 18
            },
            {
              name: 'Climate Change Impact Study',
              description: 'Analyze how environmental changes affect ecosystem balance',
              duration: 17
            }
          ]
        }
      },
      {
        type: 'interactive',
        duration: 22,
        difficulty: 'intermediate',
        data: {
          type: 'ecosystem-builder',
          title: 'Build Your Own Ecosystem',
          description: 'Create balanced ecosystems and observe the consequences of your choices'
        }
      }
    ],
    completed: false,
    aiAnalysisEnabled: true,
    prerequisites: ['Basic biology', 'Scientific method'],
    learningObjectives: [
      'Understand ecosystem interdependencies',
      'Analyze environmental data using AI tools',
      'Develop systems thinking skills',
      'Apply conservation principles to real scenarios'
    ],
    assessmentCriteria: [
      'Systems understanding (35%)',
      'Data analysis skills (25%)',
      'Scientific reasoning (25%)',
      'Environmental stewardship (15%)'
    ]
  },
  {
    id: 'english-literature-immersive',
    title: 'Literary Analysis: AI-Powered Deep Reading Experience',
    subject: 'English Literature',
    level: 5,
    duration: 150, // 2.5 hours
    description: 'Immersive literature exploration with AI analysis, 3D story environments, and creative writing workshops',
    content: [
      {
        type: 'ai-analysis',
        duration: 10,
        difficulty: 'intermediate',
        data: {
          title: 'Literary Intelligence Profiling',
          content: 'AI analyzes your reading preferences and literary comprehension style.',
          analysis: 'Your profile indicates strong narrative intuition and character empathy.'
        }
      },
      {
        type: '3d-visualization',
        duration: 30,
        difficulty: 'intermediate',
        data: {
          title: 'Immersive Story Worlds',
          content: 'Walk through 3D recreations of literary settings and experience stories firsthand.',
          models: ['shakespearean-theater', 'victorian-london', 'dystopian-cityscape'],
          interactions: ['character-dialogue', 'scene-exploration', 'narrative-choices']
        }
      },
      {
        type: 'text',
        duration: 40,
        difficulty: 'advanced',
        data: {
          title: 'Deep Literary Analysis: Themes, Symbols, and Human Nature',
          content: `Literature serves as humanity's mirror, reflecting our deepest truths and contradictions...

          **The Power of Narrative:**
          Stories shape our understanding of reality. Through literature, we explore:
          - Universal human experiences across cultures and time periods
          - Complex moral and ethical dilemmas
          - The evolution of language and expression
          - Social commentary and cultural criticism

          **Advanced Analytical Techniques:**
          - Psychoanalytic interpretation of character motivations
          - Historical contextualization of literary movements
          - Feminist, post-colonial, and critical theory perspectives
          - Intertextual connections and literary influences

          **Creative Expression Workshop:**
          Develop your own voice through guided writing exercises, peer collaboration, and AI-powered feedback on style, structure, and creativity.`
        }
      },
      {
        type: 'interactive',
        duration: 45,
        difficulty: 'advanced',
        data: {
          type: 'creative-writing-studio',
          title: 'AI-Enhanced Creative Writing Workshop',
          description: 'Collaborative storytelling with AI mentorship and peer feedback'
        }
      },
      {
        type: 'lab-experiment',
        duration: 25,
        difficulty: 'advanced',
        data: {
          title: 'Literary Research Laboratory',
          description: 'Conduct original literary research using AI-powered analysis tools',
          experiments: [
            {
              name: 'Thematic Pattern Recognition',
              description: 'Use AI to identify recurring themes across literary works',
              duration: 12
            },
            {
              name: 'Stylometric Analysis',
              description: 'Analyze authorial style using computational linguistics',
              duration: 13
            }
          ]
        }
      }
    ],
    completed: false,
    aiAnalysisEnabled: true,
    prerequisites: ['Reading comprehension', 'Basic literary terms'],
    learningObjectives: [
      'Develop sophisticated analytical thinking',
      'Master literary interpretation techniques',
      'Create original literary works',
      'Understand literature\'s social and historical contexts'
    ],
    assessmentCriteria: [
      'Analytical depth (40%)',
      'Creative expression (30%)',
      'Critical thinking (20%)',
      'Research and citation (10%)'
    ]
  }
];

export const useLessonStore = create<LessonState>()(
  persist(
    (set, get) => ({
      lessons: defaultLessons,
      currentLesson: null,
      progress: {},
      aiAnalysisHistory: {},
      userPerformance: {},
      setCurrentLesson: (lesson) => set({ currentLesson: lesson }),
      completeLesson: (lessonId) => set((state) => ({
        lessons: state.lessons.map(l => 
          l.id === lessonId ? { ...l, completed: true } : l
        ),
        progress: { ...state.progress, [lessonId]: 100 }
      })),
      updateProgress: (lessonId, progress) => set((state) => ({
        progress: { ...state.progress, [lessonId]: progress }
      })),
      addAIAnalysis: (lessonId, analysis) => set((state) => ({
        aiAnalysisHistory: {
          ...state.aiAnalysisHistory,
          [lessonId]: [...(state.aiAnalysisHistory[lessonId] || []), analysis]
        }
      })),
      updateUserPerformance: (lessonId, performance) => set((state) => ({
        userPerformance: {
          ...state.userPerformance,
          [lessonId]: { ...state.userPerformance[lessonId], ...performance }
        }
      }))
    }),
    {
      name: 'lesson-store'
    }
  )
);

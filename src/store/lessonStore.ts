
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Lesson {
  id: string;
  title: string;
  subject: string;
  level: number;
  duration: number;
  description: string;
  content: {
    type: 'video' | 'text' | 'interactive' | 'quiz';
    data: any;
  }[];
  completed: boolean;
}

interface LessonState {
  lessons: Lesson[];
  currentLesson: Lesson | null;
  progress: Record<string, number>;
  setCurrentLesson: (lesson: Lesson) => void;
  completeLesson: (lessonId: string) => void;
  updateProgress: (lessonId: string, progress: number) => void;
}

const defaultLessons: Lesson[] = [
  {
    id: 'math-fractions-1',
    title: 'Introduction to Fractions',
    subject: 'Mathematics',
    level: 3,
    duration: 15,
    description: 'Learn the basics of fractions with visual examples',
    content: [
      {
        type: 'text',
        data: {
          title: 'What are Fractions?',
          content: 'A fraction represents a part of a whole. It has two parts: the numerator (top number) and denominator (bottom number).'
        }
      },
      {
        type: 'interactive',
        data: {
          type: 'drag-drop',
          question: 'Drag the correct fraction to match the shaded area',
          options: ['1/2', '1/3', '1/4', '2/3']
        }
      }
    ],
    completed: false
  },
  {
    id: 'science-plants-1',
    title: 'How Plants Grow',
    subject: 'Science',
    level: 2,
    duration: 20,
    description: 'Discover how plants grow from seeds to full plants',
    content: [
      {
        type: 'text',
        data: {
          title: 'Plant Life Cycle',
          content: 'Plants start as seeds, then grow roots, stems, and leaves. They need water, sunlight, and nutrients to grow.'
        }
      }
    ],
    completed: false
  },
  {
    id: 'english-reading-1',
    title: 'Reading Comprehension',
    subject: 'English',
    level: 4,
    duration: 12,
    description: 'Improve your reading skills with fun stories',
    content: [
      {
        type: 'text',
        data: {
          title: 'The Adventure Begins',
          content: 'Once upon a time, in a magical forest, there lived a curious rabbit named Luna...'
        }
      }
    ],
    completed: false
  }
];

export const useLessonStore = create<LessonState>()(
  persist(
    (set, get) => ({
      lessons: defaultLessons,
      currentLesson: null,
      progress: {},
      setCurrentLesson: (lesson) => set({ currentLesson: lesson }),
      completeLesson: (lessonId) => set((state) => ({
        lessons: state.lessons.map(l => 
          l.id === lessonId ? { ...l, completed: true } : l
        ),
        progress: { ...state.progress, [lessonId]: 100 }
      })),
      updateProgress: (lessonId, progress) => set((state) => ({
        progress: { ...state.progress, [lessonId]: progress }
      }))
    }),
    {
      name: 'lesson-store'
    }
  )
);

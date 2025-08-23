
import React, { useState } from 'react';
import { Search, Filter, BookOpen, Clock, Star, Play } from 'lucide-react';
import { useLessonStore } from '../store/lessonStore';
import { LessonPlayer } from './LessonPlayer';

export const LessonBrowser: React.FC = () => {
  const { lessons, setCurrentLesson } = useLessonStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedLesson, setSelectedLesson] = useState(null);

  const subjects = ['all', ...new Set(lessons.map(l => l.subject))];
  
  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || lesson.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const handleStartLesson = (lesson: any) => {
    setCurrentLesson(lesson);
    setSelectedLesson(lesson);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4">Browse Lessons</h2>
        <p className="text-muted-foreground text-lg">
          Explore our comprehensive library of interactive lessons
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search lessons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-background/50 border border-border rounded-xl 
                     focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {subjects.map(subject => (
            <button
              key={subject}
              onClick={() => setSelectedSubject(subject)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedSubject === subject
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/20 hover:bg-muted/30'
              }`}
            >
              {subject === 'all' ? 'All Subjects' : subject}
            </button>
          ))}
        </div>
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLessons.map((lesson, index) => (
          <div
            key={lesson.id}
            className="lesson-card stagger-item hover:scale-[1.02] transform transition-all duration-300"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Subject Badge */}
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full font-medium">
                {lesson.subject}
              </span>
              <div className="flex items-center space-x-1 text-warning">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-medium">4.8</span>
              </div>
            </div>

            {/* Lesson Content */}
            <div className="mb-4">
              <h3 className="text-xl font-bold mb-2 line-clamp-2">{lesson.title}</h3>
              <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                {lesson.description}
              </p>
            </div>

            {/* Lesson Stats */}
            <div className="flex items-center justify-between mb-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{lesson.duration} min</span>
              </div>
              <div className="flex items-center space-x-1">
                <BookOpen className="w-4 h-4" />
                <span>Level {lesson.level}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span>Progress</span>
                <span>{lesson.completed ? '100%' : '0%'}</span>
              </div>
              <div className="w-full bg-muted/30 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    lesson.completed ? 'primary-gradient' : 'bg-muted'
                  }`}
                  style={{ width: lesson.completed ? '100%' : '0%' }}
                />
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => handleStartLesson(lesson)}
              className="w-full py-3 bg-gradient-to-r from-primary/10 to-secondary/10 
                       border border-primary/20 rounded-xl font-semibold 
                       hover:from-primary/20 hover:to-secondary/20 hover:scale-105 
                       transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Play className="w-5 h-5" />
              <span>{lesson.completed ? 'Review' : 'Start Learning'}</span>
            </button>
          </div>
        ))}
      </div>

      {filteredLessons.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold mb-2">No lessons found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search terms or filters
          </p>
        </div>
      )}

      {/* Lesson Player Modal */}
      {selectedLesson && (
        <LessonPlayer
          lesson={selectedLesson}
          onClose={() => setSelectedLesson(null)}
        />
      )}
    </div>
  );
};

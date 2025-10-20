import React, { useState } from 'react';
import { BookOpen, ChevronRight, Download, Play, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface StudyMaterialBrowserProps {
  onClose: () => void;
}

const boards = ['CBSE', 'ICSE', 'State Board', 'IB', 'Cambridge'];
const classes = Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`);

const subjects: Record<string, string[]> = {
  'Class 1': ['English', 'Mathematics', 'EVS', 'Hindi'],
  'Class 2': ['English', 'Mathematics', 'EVS', 'Hindi'],
  'Class 3': ['English', 'Mathematics', 'EVS', 'Hindi', 'Science'],
  'Class 4': ['English', 'Mathematics', 'Science', 'Social Science', 'Hindi'],
  'Class 5': ['English', 'Mathematics', 'Science', 'Social Science', 'Hindi'],
  'Class 6': ['English', 'Mathematics', 'Science', 'Social Science', 'Hindi', 'Sanskrit'],
  'Class 7': ['English', 'Mathematics', 'Science', 'Social Science', 'Hindi', 'Sanskrit'],
  'Class 8': ['English', 'Mathematics', 'Science', 'Social Science', 'Hindi', 'Sanskrit'],
  'Class 9': ['English', 'Mathematics', 'Science', 'Social Science', 'Hindi', 'Sanskrit', 'Computer Science'],
  'Class 10': ['English', 'Mathematics', 'Science', 'Social Science', 'Hindi', 'Sanskrit', 'Computer Science'],
  'Class 11': ['English', 'Physics', 'Chemistry', 'Mathematics', 'Biology', 'Computer Science', 'Accountancy', 'Business Studies', 'Economics'],
  'Class 12': ['English', 'Physics', 'Chemistry', 'Mathematics', 'Biology', 'Computer Science', 'Accountancy', 'Business Studies', 'Economics'],
};

const chapters: Record<string, string[]> = {
  'Mathematics': ['Number Systems', 'Algebra', 'Coordinate Geometry', 'Geometry', 'Trigonometry', 'Mensuration', 'Statistics', 'Probability'],
  'Science': ['Matter', 'Periodic Classification', 'Chemical Reactions', 'Motion', 'Force and Laws of Motion', 'Gravitation', 'Work and Energy', 'Living Organisms'],
  'Physics': ['Physical World', 'Units and Measurement', 'Motion in Straight Line', 'Motion in Plane', 'Laws of Motion', 'Work, Energy and Power', 'System of Particles'],
  'Chemistry': ['Some Basic Concepts', 'Structure of Atom', 'Classification of Elements', 'Chemical Bonding', 'States of Matter', 'Thermodynamics', 'Equilibrium'],
  'Biology': ['The Living World', 'Biological Classification', 'Plant Kingdom', 'Animal Kingdom', 'Morphology', 'Anatomy', 'Cell Structure'],
  'English': ['Reading Comprehension', 'Writing Skills', 'Grammar', 'Literature', 'Poetry', 'Prose', 'Drama'],
};

export const StudyMaterialBrowser: React.FC<StudyMaterialBrowserProps> = ({ onClose }) => {
  const [selectedBoard, setSelectedBoard] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');

  const availableSubjects = selectedClass ? subjects[selectedClass] || [] : [];
  const availableChapters = selectedSubject ? chapters[selectedSubject] || [] : [];

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col animate-fade-in">
      {/* Header */}
      <div className="relative flex items-center justify-between p-6 border-b border-border/30 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 shrink-0">
        <div className="flex items-center space-x-4">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 bg-gradient-primary rounded-2xl animate-pulse-3d opacity-20"></div>
            <div className="relative w-full h-full bg-gradient-primary rounded-2xl flex items-center justify-center text-3xl shadow-lg">
              📚
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">Study Materials</h3>
            <p className="text-sm text-muted-foreground">Access comprehensive study resources</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 rounded-xl hover:bg-muted/30 transition-all duration-300"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-1 md:grid-cols-4 gap-4 p-6">
          {/* Board Selection */}
          <ScrollArea className="h-full">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-muted-foreground mb-4">Select Board</h4>
              {boards.map((board) => (
                <button
                  key={board}
                  onClick={() => {
                    setSelectedBoard(board);
                    setSelectedClass('');
                    setSelectedSubject('');
                    setSelectedChapter('');
                  }}
                  className={`w-full p-4 rounded-xl text-left transition-all duration-300 ${
                    selectedBoard === board
                      ? 'bg-gradient-primary text-primary-foreground shadow-lg scale-105'
                      : 'glass-card hover:scale-102'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{board}</span>
                    {selectedBoard === board && <ChevronRight className="w-4 h-4" />}
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>

          {/* Class Selection */}
          {selectedBoard && (
            <ScrollArea className="h-full animate-slide-in-right">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-muted-foreground mb-4">Select Class</h4>
                {classes.map((cls) => (
                  <button
                    key={cls}
                    onClick={() => {
                      setSelectedClass(cls);
                      setSelectedSubject('');
                      setSelectedChapter('');
                    }}
                    className={`w-full p-4 rounded-xl text-left transition-all duration-300 ${
                      selectedClass === cls
                        ? 'bg-gradient-primary text-primary-foreground shadow-lg scale-105'
                        : 'glass-card hover:scale-102'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{cls}</span>
                      {selectedClass === cls && <ChevronRight className="w-4 h-4" />}
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          )}

          {/* Subject Selection */}
          {selectedClass && (
            <ScrollArea className="h-full animate-slide-in-right" style={{ animationDelay: '0.1s' }}>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-muted-foreground mb-4">Select Subject</h4>
                {availableSubjects.map((subject) => (
                  <button
                    key={subject}
                    onClick={() => {
                      setSelectedSubject(subject);
                      setSelectedChapter('');
                    }}
                    className={`w-full p-4 rounded-xl text-left transition-all duration-300 ${
                      selectedSubject === subject
                        ? 'bg-gradient-primary text-primary-foreground shadow-lg scale-105'
                        : 'glass-card hover:scale-102'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{subject}</span>
                      {selectedSubject === subject && <ChevronRight className="w-4 h-4" />}
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          )}

          {/* Chapter & Materials */}
          {selectedSubject && (
            <ScrollArea className="h-full animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-muted-foreground mb-4">Chapters & Materials</h4>
                {availableChapters.map((chapter, idx) => (
                  <div key={chapter} className="glass-card p-4 space-y-3 animate-slide-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                    <h5 className="font-semibold flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-primary" />
                      <span>{chapter}</span>
                    </h5>
                    <div className="space-y-2">
                      <button className="w-full p-3 rounded-lg bg-primary/10 hover:bg-primary/20 transition-all duration-300 flex items-center space-x-3 group">
                        <Play className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                        <span className="text-sm">Video Lesson</span>
                        <Badge variant="secondary" className="ml-auto">12 min</Badge>
                      </button>
                      <button className="w-full p-3 rounded-lg bg-secondary/10 hover:bg-secondary/20 transition-all duration-300 flex items-center space-x-3 group">
                        <FileText className="w-4 h-4 text-secondary group-hover:scale-110 transition-transform" />
                        <span className="text-sm">Notes PDF</span>
                        <Download className="w-4 h-4 ml-auto group-hover:translate-y-1 transition-transform" />
                      </button>
                      <button className="w-full p-3 rounded-lg bg-success/10 hover:bg-success/20 transition-all duration-300 flex items-center space-x-3 group">
                        <span className="text-sm">✓ Practice MCQs</span>
                        <Badge variant="outline" className="ml-auto">20 questions</Badge>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </div>
  );
};

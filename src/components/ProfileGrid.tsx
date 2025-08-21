
import React, { useState, useEffect } from 'react';
import { Plus, Star, BookOpen, Clock } from 'lucide-react';

interface Profile {
  id: string;
  name: string;
  avatar: string;
  level: number;
  progress: number;
  streak: number;
  lastActive: string;
  subjects: string[];
}

interface ProfileGridProps {
  currentUser: any;
}

export const ProfileGrid: React.FC<ProfileGridProps> = ({ currentUser }) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    // Load profiles from localStorage or create default ones
    const savedProfiles = localStorage.getItem('studentProfiles');
    if (savedProfiles) {
      setProfiles(JSON.parse(savedProfiles));
    } else {
      const defaultProfiles: Profile[] = [
        {
          id: '1',
          name: 'Alex Johnson',
          avatar: '👦',
          level: 5,
          progress: 78,
          streak: 12,
          lastActive: '2 hours ago',
          subjects: ['Math', 'Science']
        },
        {
          id: '2',
          name: 'Maria Garcia',
          avatar: '👧',
          level: 7,
          progress: 92,
          streak: 25,
          lastActive: '30 minutes ago',
          subjects: ['English', 'History']
        },
        {
          id: '3',
          name: 'David Chen',
          avatar: '🧒',
          level: 3,
          progress: 45,
          streak: 5,
          lastActive: '1 day ago',
          subjects: ['Math', 'Art']
        }
      ];
      setProfiles(defaultProfiles);
      localStorage.setItem('studentProfiles', JSON.stringify(defaultProfiles));
    }
  }, []);

  const addNewProfile = () => {
    const name = prompt('Enter student name:');
    if (name) {
      const newProfile: Profile = {
        id: Date.now().toString(),
        name,
        avatar: '🎓',
        level: 1,
        progress: 0,
        streak: 0,
        lastActive: 'Just created',
        subjects: []
      };
      const updatedProfiles = [...profiles, newProfile];
      setProfiles(updatedProfiles);
      localStorage.setItem('studentProfiles', JSON.stringify(updatedProfiles));
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-2">Student Profiles</h3>
        <p className="text-muted-foreground">Select a profile to continue learning</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {profiles.map((profile, index) => (
          <div 
            key={profile.id} 
            className="lesson-card cursor-pointer stagger-item"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Avatar and Name */}
            <div className="text-center mb-4">
              <div className="w-16 h-16 mx-auto mb-3 text-4xl flex items-center justify-center bg-gradient-primary rounded-full">
                {profile.avatar}
              </div>
              <h4 className="font-semibold text-lg">{profile.name}</h4>
              <p className="text-sm text-muted-foreground">Level {profile.level}</p>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{profile.progress}%</span>
              </div>
              <div className="w-full bg-muted/30 rounded-full h-2">
                <div 
                  className="primary-gradient h-2 rounded-full transition-all duration-500"
                  style={{ width: `${profile.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 text-warning">
                  <Star className="w-4 h-4" />
                  <span className="font-semibold">{profile.streak}</span>
                </div>
                <div className="text-xs text-muted-foreground">Day streak</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 text-primary">
                  <BookOpen className="w-4 h-4" />
                  <span className="font-semibold">{profile.subjects.length}</span>
                </div>
                <div className="text-xs text-muted-foreground">Subjects</div>
              </div>
            </div>

            {/* Subjects */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {profile.subjects.map((subject) => (
                  <span 
                    key={subject}
                    className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>

            {/* Last Active */}
            <div className="flex items-center justify-center text-xs text-muted-foreground">
              <Clock className="w-3 h-3 mr-1" />
              <span>{profile.lastActive}</span>
            </div>
          </div>
        ))}

        {/* Add New Profile */}
        <div 
          onClick={addNewProfile}
          className="lesson-card cursor-pointer border-2 border-dashed border-primary/30 hover:border-primary/60 stagger-item"
          style={{ animationDelay: `${profiles.length * 0.1}s` }}
        >
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
              <Plus className="w-8 h-8 text-primary" />
            </div>
            <h4 className="font-semibold text-lg mb-2">Add Student</h4>
            <p className="text-sm text-muted-foreground">Create new profile</p>
          </div>
        </div>
      </div>
    </div>
  );
};

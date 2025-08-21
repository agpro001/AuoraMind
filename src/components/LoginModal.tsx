
import React, { useState } from 'react';
import { X, User, GraduationCap, Users, Eye, EyeOff } from 'lucide-react';

interface LoginModalProps {
  onClose: () => void;
  onLogin: (userData: any) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<'student' | 'teacher' | 'admin'>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    grade: '',
    school: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.name || !formData.email) {
      alert('Please fill in required fields');
      return;
    }

    // Create user data
    const userData = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      role: userType,
      age: formData.age,
      grade: formData.grade,
      school: formData.school,
      avatar: userType === 'student' ? '🎓' : userType === 'teacher' ? '👨‍🏫' : '👨‍💼',
      createdAt: new Date().toISOString()
    };

    onLogin(userData);
  };

  const userTypes = [
    { key: 'student', label: 'Student', icon: User, description: 'Learn with AI tutoring' },
    { key: 'teacher', label: 'Teacher', icon: GraduationCap, description: 'Manage classes and content' },
    { key: 'admin', label: 'Administrator', icon: Users, description: 'System management' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/20">
          <h2 className="text-2xl font-bold">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* User Type Selection */}
          <div>
            <label className="block text-sm font-medium mb-3">I am a:</label>
            <div className="space-y-2">
              {userTypes.map((type) => (
                <div
                  key={type.key}
                  onClick={() => setUserType(type.key as any)}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    userType === type.key
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <type.icon className={`w-5 h-5 ${userType === type.key ? 'text-primary' : 'text-muted-foreground'}`} />
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-sm text-muted-foreground">{type.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Full Name *
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-3 border border-border rounded-lg bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email *
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full p-3 border border-border rounded-lg bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password Field */}
          {isLogin && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full p-3 border border-border rounded-lg bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Additional Fields for Students */}
          {userType === 'student' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="age" className="block text-sm font-medium mb-2">
                  Age
                </label>
                <input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                  className="w-full p-3 border border-border rounded-lg bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Age"
                  min="1"
                  max="100"
                />
              </div>
              <div>
                <label htmlFor="grade" className="block text-sm font-medium mb-2">
                  Grade
                </label>
                <input
                  id="grade"
                  type="text"
                  value={formData.grade}
                  onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
                  className="w-full p-3 border border-border rounded-lg bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Grade"
                />
              </div>
            </div>
          )}

          {/* School Field */}
          {(userType === 'student' || userType === 'teacher') && (
            <div>
              <label htmlFor="school" className="block text-sm font-medium mb-2">
                School/Institution
              </label>
              <input
                id="school"
                type="text"
                value={formData.school}
                onChange={(e) => setFormData(prev => ({ ...prev, school: e.target.value }))}
                className="w-full p-3 border border-border rounded-lg bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Enter your school name"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 primary-gradient text-white rounded-lg font-semibold hover:scale-105 transition-transform"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>

          {/* Toggle Mode */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline text-sm"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>

          {/* Offline Note */}
          <div className="text-center p-3 bg-muted/10 rounded-lg">
            <p className="text-xs text-muted-foreground">
              🔒 All data is stored locally on your device for privacy and offline access
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

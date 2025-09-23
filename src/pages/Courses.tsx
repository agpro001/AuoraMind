import React from 'react';
import { ArrowLeft, BookOpen, Clock, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Courses = () => {
  const navigate = useNavigate();

  const courses = [
    {
      id: 1,
      title: "Introduction to Mathematics",
      description: "Master the fundamentals of mathematics with interactive lessons and practice problems.",
      duration: "6 weeks",
      level: "Beginner",
      rating: 4.8,
      lessons: 24,
      image: "📊"
    },
    {
      id: 2,
      title: "Science Fundamentals",
      description: "Explore the wonders of science through hands-on experiments and real-world applications.",
      duration: "8 weeks",
      level: "Intermediate",
      rating: 4.7,
      lessons: 32,
      image: "🔬"
    },
    {
      id: 3,
      title: "Language Arts",
      description: "Develop your reading, writing, and communication skills with engaging activities.",
      duration: "10 weeks",
      level: "All Levels",
      rating: 4.9,
      lessons: 40,
      image: "📚"
    },
    {
      id: 4,
      title: "Computer Programming",
      description: "Learn the basics of coding and software development with practical projects.",
      duration: "12 weeks",
      level: "Beginner",
      rating: 4.6,
      lessons: 48,
      image: "💻"
    },
    {
      id: 5,
      title: "History & Culture",
      description: "Journey through time and explore different cultures and civilizations.",
      duration: "8 weeks",
      level: "All Levels",
      rating: 4.5,
      lessons: 28,
      image: "🏛️"
    },
    {
      id: 6,
      title: "Creative Arts",
      description: "Express yourself through various art forms and creative mediums.",
      duration: "6 weeks",
      level: "All Levels",
      rating: 4.8,
      lessons: 20,
      image: "🎨"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Back Button */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
            <div className="border-l h-6 border-border"></div>
            <h1 className="text-2xl font-bold">Available Courses</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Choose Your Learning Path</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our comprehensive catalog of courses designed to help you learn and grow, all available offline.
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className="glass-card p-6 rounded-xl hover:scale-105 transition-all duration-300 cursor-pointer group"
            >
              {/* Course Icon */}
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {course.image}
              </div>

              {/* Course Info */}
              <div className="space-y-3">
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                  {course.title}
                </h3>
                
                <p className="text-muted-foreground text-sm line-clamp-3">
                  {course.description}
                </p>

                {/* Course Stats */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {course.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {course.lessons} lessons
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{course.rating}</span>
                  </div>
                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                    {course.level}
                  </span>
                </div>

                {/* Start Course Button */}
                <Button className="w-full mt-4 group-hover:scale-105 transition-transform">
                  Start Course
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-16 glass-card p-8 rounded-xl">
          <h3 className="text-2xl font-bold mb-4">Need Help Choosing?</h3>
          <p className="text-muted-foreground mb-6">
            Our AI tutor can help you find the perfect course based on your interests and learning goals.
          </p>
          <Button variant="outline" size="lg">
            Get Personalized Recommendations
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Courses;
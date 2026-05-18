import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Search, Filter, Play, Clock, BarChart3, ChevronRight, Star, Users, CheckCircle, Lock, Loader, AlertCircle } from 'lucide-react';
import { request } from '../lib/api';

export default function LearningPage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [message, setMessage] = useState({ type: '', text: '' });

  const categories = [
    'all',
    'Data Structures',
    'Algorithms',
    'System Design',
    'Web Development',
    'Database Design',
    'Behavioral',
    'Projects',
  ];

  const difficulties = ['all', 'Beginner', 'Intermediate', 'Advanced'];

  // Mock courses data
  const mockCourses = [
    {
      id: 1,
      title: 'Arrays & Strings Fundamentals',
      category: 'Data Structures',
      difficulty: 'Beginner',
      description: 'Master array manipulation and string problems commonly asked in interviews',
      duration: '4 hours',
      lessons: 12,
      progress: 65,
      rating: 4.8,
      students: 2450,
      instructor: 'Sarah Chen',
      image: '📚',
      topics: ['Array Operations', 'String Manipulation', 'Two Pointers'],
      locked: false,
    },
    {
      id: 2,
      title: 'Linked Lists & Trees Deep Dive',
      category: 'Data Structures',
      difficulty: 'Intermediate',
      description: 'Complete guide to linked lists, binary trees, and tree traversal algorithms',
      duration: '6 hours',
      lessons: 18,
      progress: 45,
      rating: 4.9,
      students: 3120,
      instructor: 'James Wilson',
      image: '🌳',
      topics: ['Linked Lists', 'Binary Trees', 'Tree Traversal', 'BST'],
      locked: false,
    },
    {
      id: 3,
      title: 'Graph Algorithms Masterclass',
      category: 'Algorithms',
      difficulty: 'Intermediate',
      description: 'Learn BFS, DFS, Dijkstra, and topological sorting with real-world applications',
      duration: '8 hours',
      lessons: 22,
      progress: 30,
      rating: 4.7,
      students: 1890,
      instructor: 'Alex Kumar',
      image: '🔗',
      topics: ['BFS/DFS', 'Dijkstra', 'Graph Coloring', 'Network Flow'],
      locked: false,
    },
    {
      id: 4,
      title: 'System Design Essentials',
      category: 'System Design',
      difficulty: 'Advanced',
      description: 'Design scalable systems like Netflix, Uber, and Instagram from scratch',
      duration: '12 hours',
      lessons: 30,
      progress: 0,
      rating: 4.9,
      students: 4560,
      instructor: 'Mike Zhang',
      image: '🏗️',
      topics: ['Scalability', 'Load Balancing', 'Databases', 'Caching'],
      locked: false,
    },
    {
      id: 5,
      title: 'Dynamic Programming Patterns',
      category: 'Algorithms',
      difficulty: 'Advanced',
      description: 'Master DP with 40+ practice problems and optimization techniques',
      duration: '10 hours',
      lessons: 28,
      progress: 15,
      rating: 4.6,
      students: 2340,
      instructor: 'Emma Rodriguez',
      image: '♻️',
      topics: ['Memoization', 'Tabulation', 'Optimization', 'State Machines'],
      locked: false,
    },
    {
      id: 6,
      title: 'SQL & Database Design',
      category: 'Database Design',
      difficulty: 'Intermediate',
      description: 'Write complex queries, design schemas, and optimize databases for interviews',
      duration: '5 hours',
      lessons: 15,
      progress: 50,
      rating: 4.8,
      students: 2100,
      instructor: 'Lisa Park',
      image: '🗄️',
      topics: ['SQL Queries', 'Schema Design', 'Indexing', 'Normalization'],
      locked: false,
    },
    {
      id: 7,
      title: 'Web Development Interview Prep',
      category: 'Web Development',
      difficulty: 'Intermediate',
      description: 'Frontend, Backend, and Full Stack interview questions with solutions',
      duration: '7 hours',
      lessons: 20,
      progress: 80,
      rating: 4.7,
      students: 3450,
      instructor: 'David Kim',
      image: '🌐',
      topics: ['React', 'Node.js', 'REST APIs', 'Authentication'],
      locked: false,
    },
    {
      id: 8,
      title: 'Behavioral Interview Mastery',
      category: 'Behavioral',
      difficulty: 'Beginner',
      description: 'Learn STAR method, tell compelling stories, and ace behavioral rounds',
      duration: '3 hours',
      lessons: 8,
      progress: 0,
      rating: 4.9,
      students: 5670,
      instructor: 'Rachel Green',
      image: '💬',
      topics: ['STAR Method', 'Storytelling', 'Conflict Resolution', 'Leadership'],
      locked: false,
    },
    {
      id: 9,
      title: 'Build a URL Shortener Project',
      category: 'Projects',
      difficulty: 'Advanced',
      description: 'End-to-end system design and implementation project for portfolio',
      duration: '6 hours',
      lessons: 12,
      progress: 0,
      rating: 5.0,
      students: 890,
      instructor: 'Tom Anderson',
      image: '🎯',
      topics: ['API Design', 'Database', 'Caching', 'Analytics'],
      locked: true,
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCourses(mockCourses);
      setLoading(false);
    }, 600);
  }, []);

  useEffect(() => {
    filterCourses();
  }, [courses, searchTerm, categoryFilter, difficultyFilter]);

  const filterCourses = () => {
    let filtered = courses;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (c) =>
          c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.topics?.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((c) => c.category === categoryFilter);
    }

    // Difficulty filter
    if (difficultyFilter !== 'all') {
      filtered = filtered.filter((c) => c.difficulty === difficultyFilter);
    }

    setFilteredCourses(filtered);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return '#22c55e';
      case 'Intermediate':
        return '#f59e0b';
      case 'Advanced':
        return '#ef4444';
      default:
        return '#94a3b8';
    }
  };

  const getDifficultyBG = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return '#064e3b';
      case 'Intermediate':
        return '#78350f';
      case 'Advanced':
        return '#7f1d1d';
      default:
        return '#1e293b';
    }
  };

  const handleStartCourse = (courseId) => {
    navigate(`/learning/course/${courseId}`);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
        <div style={{ textAlign: 'center', color: '#94a3b8' }}>
          <Loader style={{ width: '48px', height: '48px', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p>Loading learning materials...</p>
        </div>
      </div>
    );
  }

  const completedCourses = courses.filter((c) => c.progress === 100).length;
  const inProgressCourses = courses.filter((c) => c.progress > 0 && c.progress < 100).length;
  const totalProgress = courses.reduce((acc, c) => acc + c.progress, 0) / (courses.length || 1);

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <BookOpen style={{ width: '32px', height: '32px' }} />
          📚 Learning Center
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '16px' }}>Master interview skills with curated courses and resources</p>
      </div>

      {/* Progress Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <div style={{ background: '#1e293b', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>Overall Progress</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#06b6d4', marginBottom: '12px' }}>
            {Math.round(totalProgress)}%
          </div>
          <div style={{ height: '6px', background: '#0f172a', borderRadius: '3px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #8b5cf6, #06b6d4)',
                width: `${Math.round(totalProgress)}%`,
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        <div style={{ background: '#1e293b', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>Completed Courses</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#22c55e' }}>{completedCourses}</div>
          <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '8px' }}>Out of {courses.length} courses</div>
        </div>

        <div style={{ background: '#1e293b', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>In Progress</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>{inProgressCourses}</div>
          <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '8px' }}>Keep going! 💪</div>
        </div>

        <div style={{ background: '#1e293b', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>Total Hours</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>58</div>
          <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '8px' }}>Learning content</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div style={{ marginBottom: '24px', display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px', alignItems: 'start' }}>
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <Search style={{ position: 'absolute', left: '12px', top: '12px', width: '20px', height: '20px', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search courses, topics, or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 12px 12px 40px',
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#f1f5f9',
              fontSize: '14px',
              outline: 'none',
            }}
          />
        </div>

        {/* Filter Button */}
        <button
          style={{
            padding: '12px 16px',
            background: '#8b5cf6',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: '500',
          }}
        >
          <Filter style={{ width: '18px', height: '18px' }} />
          Filters
        </button>
      </div>

      {/* Category & Difficulty Filters */}
      <div style={{ marginBottom: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#cbd5e1' }}>
            Category
          </label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '6px',
              color: '#f1f5f9',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat} style={{ background: '#1e293b', color: '#f1f5f9' }}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#cbd5e1' }}>
            Difficulty
          </label>
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '6px',
              color: '#f1f5f9',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            {difficulties.map((diff) => (
              <option key={diff} value={diff} style={{ background: '#1e293b', color: '#f1f5f9' }}>
                {diff === 'all' ? 'All Levels' : diff}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: '#1e293b',
            borderRadius: '12px',
            color: '#94a3b8',
            border: '1px solid #334155',
          }}
        >
          <BookOpen style={{ width: '48px', height: '48px', margin: '0 auto 16px', opacity: '0.5' }} />
          <p style={{ fontSize: '16px', marginBottom: '8px' }}>No courses found</p>
          <p style={{ fontSize: '14px' }}>Try adjusting your filters</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              style={{
                background: '#1e293b',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid #334155',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#8b5cf6';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(139, 92, 246, 0.2)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#334155';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Locked Badge */}
              {course.locked && (
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    padding: '6px 12px',
                    background: '#ef4444',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    zIndex: 10,
                  }}
                >
                  <Lock style={{ width: '12px', height: '12px' }} />
                  Premium
                </div>
              )}

              {/* Header */}
              <div
                style={{
                  padding: '20px',
                  background: '#0f172a',
                  borderBottom: '1px solid #334155',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  opacity: course.locked ? 0.7 : 1,
                }}
              >
                <div style={{ fontSize: '40px' }}>{course.image}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>{course.category}</div>
                  <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#f1f5f9' }}>{course.title}</h3>
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '16px 20px', flex: 1, opacity: course.locked ? 0.7 : 1 }}>
                <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5', marginBottom: '16px' }}>
                  {course.description}
                </p>

                {/* Topics */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {course.topics.slice(0, 2).map((topic, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: '11px',
                          padding: '4px 8px',
                          background: '#334155',
                          borderRadius: '4px',
                          color: '#cbd5e1',
                        }}
                      >
                        {topic}
                      </span>
                    ))}
                    {course.topics.length > 2 && (
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>+{course.topics.length - 2}</span>
                    )}
                  </div>
                </div>

                {/* Difficulty Badge */}
                <div style={{ marginBottom: '16px' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '6px 12px',
                      background: getDifficultyBG(course.difficulty),
                      color: getDifficultyColor(course.difficulty),
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                    }}
                  >
                    {course.difficulty}
                  </span>
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1' }}>
                    <Clock style={{ width: '14px', height: '14px' }} />
                    <span>{course.duration}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1' }}>
                    <Play style={{ width: '14px', height: '14px' }} />
                    <span>{course.lessons} lessons</span>
                  </div>
                </div>

                {/* Rating & Students */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #334155' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Star style={{ width: '14px', height: '14px', color: '#f59e0b', fill: '#f59e0b' }} />
                    <span style={{ color: '#cbd5e1' }}>{course.rating}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#94a3b8' }}>
                    <Users style={{ width: '14px', height: '14px' }} />
                    <span>{course.students.toLocaleString()}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                {course.progress > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}>Progress</span>
                      <span style={{ fontSize: '12px', color: '#06b6d4', fontWeight: '600' }}>{course.progress}%</span>
                    </div>
                    <div style={{ height: '6px', background: '#0f172a', borderRadius: '3px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          background: course.progress === 100 ? '#22c55e' : 'linear-gradient(90deg, #8b5cf6, #06b6d4)',
                          width: `${course.progress}%`,
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div
                style={{
                  padding: '16px 20px',
                  background: '#0f172a',
                  borderTop: '1px solid #334155',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>By {course.instructor}</div>
                <button
                  onClick={() => handleStartCourse(course.id)}
                  disabled={course.locked}
                  style={{
                    padding: '10px 16px',
                    background: course.locked ? '#334155' : 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                    border: 'none',
                    borderRadius: '6px',
                    color: course.locked ? '#94a3b8' : '#fff',
                    cursor: course.locked ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  {course.progress === 100 ? (
                    <>
                      <CheckCircle style={{ width: '14px', height: '14px' }} />
                      Complete
                    </>
                  ) : course.progress > 0 ? (
                    <>
                      <Play style={{ width: '14px', height: '14px' }} />
                      Resume
                    </>
                  ) : (
                    <>
                      <Play style={{ width: '14px', height: '14px' }} />
                      Start
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Featured Section */}
      <div style={{ marginTop: '48px', paddingTop: '48px', borderTop: '1px solid #334155' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>✨ Featured Resources</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {[
            {
              title: '🎯 Interview Cheat Sheet',
              description: 'Quick reference guide for common data structures and algorithms',
              color: '#8b5cf6',
            },
            {
              title: '📊 Algorithm Complexity Guide',
              description: 'Time and space complexity analysis for every algorithm',
              color: '#06b6d4',
            },
            {
              title: '💡 Problem-Solving Strategy',
              description: 'Framework for approaching unknown coding problems',
              color: '#f59e0b',
            },
          ].map((resource, i) => (
            <div
              key={i}
              style={{
                padding: '20px',
                background: '#1e293b',
                borderRadius: '12px',
                border: `2px solid ${resource.color}40`,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = resource.color;
                e.currentTarget.style.background = '#1e293b';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = `${resource.color}40`;
              }}
            >
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px', color: resource.color }}>
                {resource.title}
              </h3>
              <p style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '12px' }}>{resource.description}</p>
              <button
                style={{
                  padding: '8px 16px',
                  background: 'transparent',
                  border: `1px solid ${resource.color}`,
                  borderRadius: '6px',
                  color: resource.color,
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                Download
                <ChevronRight style={{ width: '14px', height: '14px' }} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

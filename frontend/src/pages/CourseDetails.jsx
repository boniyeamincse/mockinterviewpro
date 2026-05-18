import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Play, CheckCircle2, Lock, BookOpen, Clock, BarChart3, Award, Download, Share2 } from 'lucide-react';

export default function CourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [activeLesson, setActiveLesson] = useState(0);
  const [courseProgress, setCourseProgress] = useState(65);

  const courseData = {
    1: {
      title: 'Arrays & Strings Fundamentals',
      instructor: 'Sarah Chen',
      rating: 4.8,
      students: 2450,
      duration: '4 hours',
      lessons: 12,
      progress: 65,
      description: 'Master array manipulation and string problems commonly asked in interviews',
      image: '📚',
      category: 'Data Structures',
      difficulty: 'Beginner',
      lessons_detail: [
        {
          id: 1,
          title: 'Introduction to Arrays',
          duration: '12 min',
          completed: true,
          type: 'video',
          content: 'Learn the basics of arrays, how they work in memory, and why they are fundamental in programming.',
        },
        {
          id: 2,
          title: 'Array Indexing & Traversal',
          duration: '18 min',
          completed: true,
          type: 'video',
          content: 'Understand how to access array elements and traverse through them efficiently.',
        },
        {
          id: 3,
          title: 'Common Array Operations',
          duration: '22 min',
          completed: true,
          type: 'video',
          content: 'Insert, delete, search, and update operations on arrays.',
        },
        {
          id: 4,
          title: 'Two Pointer Technique',
          duration: '25 min',
          completed: true,
          type: 'video',
          content: 'Master the powerful two pointer technique to solve array problems efficiently.',
        },
        {
          id: 5,
          title: 'String Manipulation Basics',
          duration: '20 min',
          completed: true,
          type: 'video',
          content: 'Learn how strings work and basic manipulation techniques.',
        },
        {
          id: 6,
          title: 'Practice: Array Problems #1-5',
          duration: '45 min',
          completed: false,
          type: 'coding',
          content: 'Solve 5 practice problems focusing on array traversal and manipulation.',
        },
        {
          id: 7,
          title: 'Quiz: Arrays Basics',
          duration: '15 min',
          completed: false,
          type: 'quiz',
          content: 'Test your knowledge with this 10-question quiz.',
        },
        {
          id: 8,
          title: 'Project: Build a Dynamic Array',
          duration: '60 min',
          completed: false,
          type: 'project',
          content: 'Implement your own dynamic array data structure from scratch.',
        },
        {
          id: 9,
          title: 'String Matching - KMP Algorithm',
          duration: '35 min',
          completed: false,
          type: 'video',
          content: 'Learn the Knuth-Morris-Pratt algorithm for efficient string matching.',
        },
        {
          id: 10,
          title: 'Practice: String Problems #1-5',
          duration: '50 min',
          completed: false,
          type: 'coding',
          content: 'Solve advanced string manipulation problems.',
        },
        {
          id: 11,
          title: 'Quiz: Strings Advanced',
          duration: '15 min',
          completed: false,
          type: 'quiz',
          content: 'Final assessment on string algorithms.',
        },
        {
          id: 12,
          title: 'Interview Simulation',
          duration: '90 min',
          completed: false,
          type: 'interview',
          content: 'Full mock interview with array and string problems.',
        },
      ],
    },
  };

  const course = courseData[courseId] || courseData[1];
  const currentLesson = course.lessons_detail[activeLesson];

  const handleCompleteLesson = () => {
    if (!currentLesson.completed) {
      const updatedLessons = course.lessons_detail.map((lesson) =>
        lesson.id === currentLesson.id ? { ...lesson, completed: true } : lesson
      );
      course.lessons_detail = updatedLessons;

      const completedCount = updatedLessons.filter((l) => l.completed).length;
      const newProgress = Math.round((completedCount / course.lessons_detail.length) * 100);
      setCourseProgress(newProgress);
    }

    if (activeLesson < course.lessons_detail.length - 1) {
      setActiveLesson(activeLesson + 1);
    }
  };

  const completedLessons = course.lessons_detail.filter((l) => l.completed).length;

  const getLessonIcon = (type) => {
    switch (type) {
      case 'video':
        return '🎥';
      case 'coding':
        return '💻';
      case 'quiz':
        return '❓';
      case 'project':
        return '🎯';
      case 'interview':
        return '🎤';
      default:
        return '📝';
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', display: 'grid', gridTemplateColumns: '300px 1fr' }}>
      {/* Sidebar - Lessons List */}
      <div style={{ background: '#1e293b', borderRight: '1px solid #334155', overflowY: 'auto', maxHeight: '100vh' }}>
        {/* Header */}
        <div style={{ padding: '20px', borderBottom: '1px solid #334155' }}>
          <button
            onClick={() => navigate('/learning')}
            style={{
              padding: '8px 12px',
              background: 'transparent',
              border: '1px solid #334155',
              borderRadius: '6px',
              color: '#cbd5e1',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              marginBottom: '16px',
              width: '100%',
            }}
          >
            <ChevronLeft style={{ width: '16px', height: '16px' }} />
            Back
          </button>

          <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#f1f5f9' }}>{course.title}</h3>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>
            {completedLessons} of {course.lessons_detail.length} lessons
          </div>

          {/* Progress Bar */}
          <div style={{ marginTop: '12px', height: '6px', background: '#0f172a', borderRadius: '3px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #8b5cf6, #06b6d4)',
                width: `${courseProgress}%`,
                transition: 'width 0.3s ease',
              }}
            />
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px' }}>{courseProgress}% complete</div>
        </div>

        {/* Lessons List */}
        <div style={{ padding: '16px 12px' }}>
          {course.lessons_detail.map((lesson, idx) => (
            <div
              key={lesson.id}
              onClick={() => setActiveLesson(idx)}
              style={{
                padding: '12px',
                marginBottom: '8px',
                background: activeLesson === idx ? '#334155' : 'transparent',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                borderLeft: activeLesson === idx ? '3px solid #8b5cf6' : '3px solid transparent',
              }}
              onMouseEnter={(e) => {
                if (activeLesson !== idx) e.currentTarget.style.background = '#0f172a';
              }}
              onMouseLeave={(e) => {
                if (activeLesson !== idx) e.currentTarget.style.background = 'transparent';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '16px' }}>{getLessonIcon(lesson.type)}</span>
                <span style={{ fontSize: '12px', fontWeight: lesson.completed ? '400' : '500', opacity: lesson.completed ? 0.7 : 1 }}>
                  {lesson.title}
                </span>
                {lesson.completed && <CheckCircle2 style={{ width: '14px', height: '14px', color: '#22c55e', marginLeft: 'auto' }} />}
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8', paddingLeft: '24px' }}>{lesson.duration}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ overflowY: 'auto', maxHeight: '100vh' }}>
        {/* Header Bar */}
        <div
          style={{
            background: '#1e293b',
            borderBottom: '1px solid #334155',
            padding: '16px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px' }}>{currentLesson.title}</h2>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>
              Lesson {activeLesson + 1} of {course.lessons_detail.length}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              style={{
                padding: '10px 16px',
                background: 'transparent',
                border: '1px solid #334155',
                borderRadius: '6px',
                color: '#cbd5e1',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Share2 style={{ width: '16px', height: '16px' }} />
              Share
            </button>
            <button
              style={{
                padding: '10px 16px',
                background: 'transparent',
                border: '1px solid #334155',
                borderRadius: '6px',
                color: '#cbd5e1',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Download style={{ width: '16px', height: '16px' }} />
              Download
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div style={{ padding: '40px', maxWidth: '1000px' }}>
          {/* Lesson Video/Content Area */}
          <div
            style={{
              background: '#0f172a',
              borderRadius: '12px',
              border: '1px solid #334155',
              padding: '60px 40px',
              textAlign: 'center',
              marginBottom: '32px',
            }}
          >
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>{getLessonIcon(currentLesson.type)}</div>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '12px' }}>{currentLesson.title}</h3>

            {currentLesson.type === 'video' && (
              <button
                style={{
                  marginTop: '24px',
                  padding: '16px 32px',
                  background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <Play style={{ width: '20px', height: '20px' }} />
                Play Video
              </button>
            )}

            {currentLesson.type === 'coding' && (
              <button
                style={{
                  marginTop: '24px',
                  padding: '16px 32px',
                  background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                Open Code Editor
              </button>
            )}

            {currentLesson.type === 'quiz' && (
              <button
                style={{
                  marginTop: '24px',
                  padding: '16px 32px',
                  background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                Start Quiz
              </button>
            )}

            {currentLesson.type === 'interview' && (
              <button
                style={{
                  marginTop: '24px',
                  padding: '16px 32px',
                  background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                Start Mock Interview
              </button>
            )}
          </div>

          {/* Lesson Description */}
          <div style={{ marginBottom: '32px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>About This Lesson</h4>
            <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '16px' }}>{currentLesson.content}</p>

            {/* Lesson Info */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div style={{ background: '#1e293b', padding: '16px', borderRadius: '8px', border: '1px solid #334155' }}>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>Duration</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#06b6d4' }}>{currentLesson.duration}</div>
              </div>
              <div style={{ background: '#1e293b', padding: '16px', borderRadius: '8px', border: '1px solid #334155' }}>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>Difficulty</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#f59e0b' }}>{course.difficulty}</div>
              </div>
              <div style={{ background: '#1e293b', padding: '16px', borderRadius: '8px', border: '1px solid #334155' }}>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>Status</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: currentLesson.completed ? '#22c55e' : '#f59e0b' }}>
                  {currentLesson.completed ? '✓ Completed' : 'In Progress'}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between' }}>
            <button
              onClick={() => activeLesson > 0 && setActiveLesson(activeLesson - 1)}
              disabled={activeLesson === 0}
              style={{
                padding: '12px 24px',
                background: activeLesson === 0 ? '#334155' : 'transparent',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: activeLesson === 0 ? '#94a3b8' : '#cbd5e1',
                cursor: activeLesson === 0 ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              ← Previous Lesson
            </button>

            <button
              onClick={handleCompleteLesson}
              style={{
                padding: '12px 32px',
                background: currentLesson.completed ? '#334155' : 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {currentLesson.completed ? (
                <>
                  <CheckCircle2 style={{ width: '16px', height: '16px' }} />
                  Completed
                </>
              ) : (
                'Mark as Complete'
              )}
            </button>

            <button
              onClick={() => activeLesson < course.lessons_detail.length - 1 && setActiveLesson(activeLesson + 1)}
              disabled={activeLesson === course.lessons_detail.length - 1}
              style={{
                padding: '12px 24px',
                background: activeLesson === course.lessons_detail.length - 1 ? '#334155' : 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                cursor: activeLesson === course.lessons_detail.length - 1 ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              Next Lesson →
            </button>
          </div>

          {courseProgress === 100 && (
            <div
              style={{
                marginTop: '32px',
                padding: '24px',
                background: '#064e3b',
                borderRadius: '12px',
                border: '1px solid #10b981',
                textAlign: 'center',
              }}
            >
              <Award style={{ width: '48px', height: '48px', color: '#10b981', margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981', marginBottom: '8px' }}>Course Completed! 🎉</h3>
              <p style={{ color: '#6ee7b7', marginBottom: '16px' }}>
                You've successfully completed this course. Download your certificate now!
              </p>
              <button
                style={{
                  padding: '12px 24px',
                  background: '#10b981',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                Download Certificate
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

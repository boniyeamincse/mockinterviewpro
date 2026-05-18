import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Star, Users, Clock, Calendar, ChevronRight, Loader, AlertCircle } from 'lucide-react';
import { request } from '../lib/api';

export default function MultiDayEventsList() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [filters, setFilters] = useState({});

  useEffect(() => {
    fetchEvents();
  }, [searchTerm, categoryFilter, difficultyFilter]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await request('GET', '/multi-day-events', null, {
        search: searchTerm,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        difficulty: difficultyFilter !== 'all' ? difficultyFilter : undefined,
      });

      setEvents(response.data);
      setFilters(response.filters);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
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
        return '#54260c';
      case 'Advanced':
        return '#7f1d1d';
      default:
        return '#1e293b';
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
        <div style={{ textAlign: 'center', color: '#94a3b8' }}>
          <Loader style={{ width: '48px', height: '48px', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p>Loading multi-day events...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', padding: '40px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '12px' }}>Multi-Day Interview Programs</h1>
          <p style={{ fontSize: '16px', color: '#cbd5e1', marginBottom: '24px' }}>
            Book comprehensive 1-on-1 training programs with expert tutors. Learn at your own pace over multiple days.
          </p>

          {/* Search & Filters */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: '12px', marginBottom: '24px' }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <Search style={{ position: 'absolute', left: '12px', top: '12px', width: '20px', height: '20px', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search programs..."
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

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{
                padding: '12px 16px',
                background: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#f1f5f9',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              <option value="all">All Categories</option>
              {filters.categories?.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Difficulty Filter */}
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              style={{
                padding: '12px 16px',
                background: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#f1f5f9',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              <option value="all">All Levels</option>
              {filters.difficulties?.map((diff) => (
                <option key={diff} value={diff}>{diff}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Events Grid */}
        {events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#1e293b', borderRadius: '12px', border: '1px solid #334155' }}>
            <AlertCircle style={{ width: '48px', height: '48px', color: '#94a3b8', margin: '0 auto 16px' }} />
            <p style={{ fontSize: '16px', color: '#cbd5e1' }}>No programs found matching your criteria</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {events.map((event) => (
              <div
                key={event.id}
                onClick={() => navigate(`/multi-day-events/${event.id}`)}
                style={{
                  background: '#1e293b',
                  borderRadius: '12px',
                  border: '1px solid #334155',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#8b5cf6';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(139, 92, 246, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#334155';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Header */}
                <div style={{ padding: '20px', background: '#0f172a', borderBottom: '1px solid #334155' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>{event.category}</div>
                      <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#f1f5f9' }}>{event.title}</h3>
                    </div>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '6px 12px',
                        background: getDifficultyBG(event.difficulty_level),
                        color: getDifficultyColor(event.difficulty_level),
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '600',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {event.difficulty_level}
                    </span>
                  </div>

                  {/* Tutor */}
                  <div style={{ fontSize: '13px', color: '#cbd5e1' }}>
                    By <strong>{event.tutor.name}</strong>
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '20px' }}>
                  <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5', marginBottom: '16px' }}>
                    {event.description.substring(0, 100)}...
                  </p>

                  {/* Topics */}
                  {event.topics && event.topics.length > 0 && (
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {event.topics.slice(0, 2).map((topic, i) => (
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
                        {event.topics.length > 2 && (
                          <span style={{ fontSize: '11px', color: '#94a3b8' }}>+{event.topics.length - 2}</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #334155' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1' }}>
                      <Calendar style={{ width: '16px', height: '16px' }} />
                      <span>{event.total_days} days</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1' }}>
                      <Clock style={{ width: '16px', height: '16px' }} />
                      <span>{event.duration_minutes_per_day}m/day</span>
                    </div>
                  </div>

                  {/* Price & Rating */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Price</div>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#8b5cf6' }}>৳{event.price_bdt.toLocaleString()}</div>
                    </div>
                    <button
                      style={{
                        padding: '10px 16px',
                        background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                        border: 'none',
                        borderRadius: '6px',
                        color: '#fff',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/multi-day-events/${event.id}`);
                      }}
                    >
                      View <ChevronRight style={{ width: '14px', height: '14px' }} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

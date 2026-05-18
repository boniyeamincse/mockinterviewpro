import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Star, Users, Clock, Calendar, DollarSign, ChevronRight, Loader } from 'lucide-react';
import { request } from '../lib/api';

export default function BrowseEvents() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [message, setMessage] = useState({ type: '', text: '' });

  const categories = [
    'all',
    'Software Engineering',
    'Data Science',
    'Product Management',
    'UX/UI Design',
    'DevOps',
    'Cloud Architecture',
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, categoryFilter, priceFilter]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await request('GET', '/api/events');
      if (res.success) {
        setEvents(res.data?.data || []);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load events' });
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = events;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (e) =>
          e.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((e) => e.category === categoryFilter);
    }

    // Price filter
    if (priceFilter !== 'all') {
      if (priceFilter === 'under-1500') filtered = filtered.filter((e) => e.price_bdt < 1500);
      if (priceFilter === '1500-5000') filtered = filtered.filter((e) => e.price_bdt >= 1500 && e.price_bdt <= 5000);
      if (priceFilter === 'above-5000') filtered = filtered.filter((e) => e.price_bdt > 5000);
    }

    // Only show published events
    filtered = filtered.filter((e) => e.status === 'published');

    setFilteredEvents(filtered);
  };

  const handleBookClick = (eventId) => {
    navigate(`/student/book-session/${eventId}`);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
        <div style={{ textAlign: 'center', color: '#94a3b8' }}>
          <Loader style={{ width: '48px', height: '48px', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p>Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>🎓 Mock Interview Events</h1>
        <p style={{ color: '#94a3b8', fontSize: '16px' }}>Book sessions with experienced trainers</p>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div
          style={{
            padding: '16px',
            marginBottom: '24px',
            borderRadius: '8px',
            background: message.type === 'error' ? '#7f1d1d' : '#166534',
            border: `1px solid ${message.type === 'error' ? '#991b1b' : '#22c55e'}`,
            color: message.type === 'error' ? '#fecaca' : '#86efac',
          }}
        >
          {message.text}
        </div>
      )}

      {/* Search and Filters */}
      <div style={{ marginBottom: '32px', display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px', alignItems: 'start' }}>
        {/* Search Bar */}
        <div style={{ position: 'relative' }}>
          <Search style={{ position: 'absolute', left: '12px', top: '12px', width: '20px', height: '20px', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search events, trainers, or skills..."
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

        {/* Filter Toggle Button */}
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

      {/* Category and Price Filters */}
      <div style={{ marginBottom: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Category Filter */}
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

        {/* Price Filter */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#cbd5e1' }}>
            Price Range
          </label>
          <select
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
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
            <option value="all">All Prices</option>
            <option value="under-1500">&lt; 1500 BDT</option>
            <option value="1500-5000">1500 - 5000 BDT</option>
            <option value="above-5000">&gt; 5000 BDT</option>
          </select>
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: '#1e293b',
            borderRadius: '12px',
            color: '#94a3b8',
          }}
        >
          <p style={{ fontSize: '16px', marginBottom: '8px' }}>No events found</p>
          <p style={{ fontSize: '14px' }}>Try adjusting your filters or search terms</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              style={{
                background: '#1e293b',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid #334155',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
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
              {/* Header */}
              <div style={{ padding: '20px', borderBottom: '1px solid #334155', flex: 1 }}>
                <div
                  style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    background: '#8b5cf6',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    marginBottom: '12px',
                  }}
                >
                  {event.category}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: '#f1f5f9' }}>{event.title}</h3>
                <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.5' }}>
                  {event.description?.substring(0, 100)}...
                </p>
              </div>

              {/* Details */}
              <div style={{ padding: '0 20px 16px' }}>
                {/* Trainer */}
                <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontSize: '14px' }}>
                  <Users style={{ width: '16px', height: '16px' }} />
                  <span>By {event.trainer?.name || 'Trainer'}</span>
                </div>

                {/* Duration */}
                <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontSize: '14px' }}>
                  <Clock style={{ width: '16px', height: '16px' }} />
                  <span>{event.duration_minutes} min • {event.total_sessions} sessions</span>
                </div>

                {/* Topics */}
                {event.topics_covered?.length > 0 && (
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>Topics:</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {event.topics_covered.slice(0, 2).map((topic, i) => (
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
                      {event.topics_covered.length > 2 && (
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>+{event.topics_covered.length - 2} more</span>
                      )}
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
                <div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Price</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#06b6d4' }}>{event.price_bdt} BDT</div>
                </div>
                <button
                  onClick={() => handleBookClick(event.id)}
                  style={{
                    padding: '10px 16px',
                    background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#fff',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  Book
                  <ChevronRight style={{ width: '16px', height: '16px' }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

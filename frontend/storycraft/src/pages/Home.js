import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

function Home() {
  const [stories, setStories] = useState([]);
  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchStories = async (query = '') => {
  setLoading(true);
  try {
    const res = query
      ? await API.get(`/search?q=${query}`)
      : await API.get('/stories');
    setStories(res.data);
    setSearching(!!query);
  } catch (err) {
    console.error('Error fetching stories:', err);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchStories();
  }, []);

  const handleButtonClick = () => {
    if (searching) {
      setSearch('');
      fetchStories(); // Go back to all
    } else if (search.trim()) {
      fetchStories(search); // Perform search
    }
  };

  return (
    <div>
      <h1>📖 Public Stories</h1>

      <input
        type="text"
        placeholder="Search stories..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleButtonClick()}
        style={{ padding: '8px', width: '60%', marginRight: '10px' }}
      />

      <button onClick={handleButtonClick}>
        {searching ? '🔙 Back to All' : '🔍 Search'}
      </button>

      {searching && search && (
        <p style={{ marginTop: '10px', fontStyle: 'italic', color: '#555' }}>
          Showing results for: <strong>"{search}"</strong>
        </p>
      )}

      {loading && <p>Loading stories....</p>}
      {!loading && stories.length === 0 && <p>No stories found.</p>}


      {stories.map((story) => (
        <div
          key={story._id}
          onClick={() => navigate(`/story/${story._id}`)}
          style={{
            border: '1px solid #ccc',
            margin: '10px 0',
            padding: '10px',
            cursor: 'pointer',
            background: '#f9f9f9',
            borderRadius: '8px',
          }}
        >
          <h3>{story.title}</h3>
          <p>{story.content.slice(0, 200)}...</p>

          <p>By {story.user_id.usernickname}</p>

          {story.tags?.length > 0 && (
            <p style={{ fontSize: '0.9em', color: '#777', marginTop: '5px' }}>
              🏷️{' '}
              {story.tags.map((tag) => (
                <span key={tag} style={{ marginRight: 5 }}>#{tag}</span>
              ))}
            </p>
          )}
          <p style={{ fontSize: '0.9em', color: '#888' }}>
            ❤️ {typeof story.likes === 'number' ? story.likes : story.likes?.length || 0} Likes
          </p>
        </div>
      ))}
    </div>
  );
}

export default Home;

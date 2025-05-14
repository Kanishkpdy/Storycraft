// pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { getToken } from '../auth';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [stories, setStories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserStories = async () => {
      try {
        const res = await API.get('/mystories', {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        setStories(res.data);
      } catch (err) {
        console.error('Error loading dashboard stories:', err);
      }
    };
    fetchUserStories();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this story?')) return;
    try {
      await API.delete(`/stories/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setStories(stories.filter((s) => s.id !== id));
    } catch (err) {
      alert('Failed to delete story');
    }
  };

  const handlePublish = async (id) => {
    try {
      await API.put(`/stories/${id}/publish`, null, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const updated = stories.map((s) =>
        s.id === id ? { ...s, status: 'published' } : s
      );
      setStories(updated);
    } catch (err) {
      alert('Failed to publish');
    }
  };

  return (
    <div>
      <h2>📂 Your Stories</h2>
      <button onClick={() => navigate('/write')}>➕ Write New Story</button>
      {stories.length === 0 && <p>No stories yet.</p>}
      {stories.map((story) => (
        <div key={story.id} style={{ border: '1px solid #ddd', margin: '10px 0', padding: '10px' }}>
          <h3>{story.title}</h3>
          <p>{story.content.slice(0, 150)}...</p>
          <p>Status: {story.status === 'published' ? 'Published' : 'Draft'}</p>
          <button onClick={() => navigate(`/write/${story.id}`)}>✏️ Edit</button>
          <button onClick={() => handleDelete(story.id)}>🗑️ Delete</button>
          {story.status !== 'published' && <button onClick={() => handlePublish(story.id)}>🚀 Publish</button>}
        </div>
      ))}
    </div>
  );
}

export default Dashboard;

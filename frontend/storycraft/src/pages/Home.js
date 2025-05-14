// pages/Home.js
import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';

function Home() {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await API.get('/stories');
        setStories(res.data);
      } catch (err) {
        console.error('Error fetching stories:', err);
      }
    };
    fetchStories();
  }, []);

  return (
    <div>
      <h1>📖 Public Stories</h1>
      {stories.length === 0 && <p>No stories found.</p>}
      {stories.map((story) => (
        <div key={story.id} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px' }}>
          <h3>{story.title}</h3>
          <p>{story.content.slice(0, 200)}...</p>
          <Link to={`/story/${story.id}`}>Read More</Link>
        </div>
      ))}
    </div>
  );
}

export default Home;

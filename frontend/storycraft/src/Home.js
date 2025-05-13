import React, { useEffect, useState } from 'react';
import API from './services/api';
import { Link } from 'react-router-dom';

function Home() {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await API.get('/stories');
        setStories(response.data);
      } catch (error) {
        console.error('Failed to fetch stories:', error);
      }
    };

    fetchStories();
  }, []);

  const truncateContent = (content, length = 200) => {
    if (content.length > length) {
      return content.slice(0, length) + '...';
    }
    return content;
  };

  return (
    <div className="home-container">
      <h1>📖 StoryCraft</h1>
      <Link to="/upload">➕ Upload a Story</Link>
      <ul className="stories-list">
        {stories.map((story) => (
          <li key={story.id} className="story-item">
            <Link to={`/story/${story.id}`} className="story-title">{story.title}</Link>
            <p className="story-description">{truncateContent(story.content)}</p>
            <Link to={`/story/${story.id}`} className="read-more">Read More</Link> 
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;

// pages/ReadStory.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';

function ReadStory() {
  const { id } = useParams();
  const [story, setStory] = useState(null);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const res = await API.get(`/stories/${id}`);
        setStory(res.data);
      } catch (err) {
        console.error('Error loading story:', err);
      }
    };
    fetchStory();
  }, [id]);

  if (!story) return <p>Loading...</p>;

  return (
    <div>
      <h1>{story.title}</h1>
      <pre>{story.content}</pre>
      <small>
           ✍️ By <strong>{story.usernickname || 'Anonymous'}</strong> on{' '}
          {new Date(story.created_at).toLocaleDateString()}
      </small>
    </div>
  );
}

export default ReadStory;

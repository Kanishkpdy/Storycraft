import React, { useState } from 'react';
import API from './services/api';
import { useNavigate } from 'react-router-dom';

function Upload() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/stories', { title, content });
      navigate('/'); // Go back to home after upload
    } catch (error) {
      console.error('Error uploading story:', error);
    }
  };

  return (
    <div>
      <h2>📝 Upload a Story</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          required
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <textarea
          placeholder="Your story here..."
          value={content}
          required
          onChange={(e) => setContent(e.target.value)}
          rows="10"
          cols="50"
        />
        <br />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default Upload;

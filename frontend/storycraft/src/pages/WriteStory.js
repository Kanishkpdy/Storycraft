// pages/WriteStory.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../services/api';
import { getToken } from '../auth';

function WriteStory() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      API.get(`/stories/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
        .then((res) => {
          setTitle(res.data.title);
          setContent(res.data.content);
          setTags(res.data.tags?.join(', ')); // prefill tags
        })
        .catch((err) => {
          console.error('Error loading story:', err);
          alert('Failed to load story.');
        });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);

    try {
      const config = {
        headers: { Authorization: `Bearer ${getToken()}` },
      };

      if (id) {
        await API.put(`/stories/${id}`, { title, content, tags: tagList, status: 'draft' }, config);
      } else {
        await API.post('/stories', { title, content, tags: tagList }, config);
      }

      navigate('/dashboard');
    } catch (err) {
      console.error('Save failed:', err.response?.data || err.message);
      alert('Failed to save story');
    }
  };

  return (
    <div>
      <h2>{id ? '✏️ Edit Story' : '📝 Write New Story'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Story title"
          value={title}
          required
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <textarea
          placeholder="Write your story here..."
          value={content}
          required
          onChange={(e) => setContent(e.target.value)}
          rows="10"
          cols="60"
        />
        <br />
        <input
          type="text"
          placeholder="Comma-separated tags (e.g. fantasy, love, war)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <br />
        <button type="submit">💾 Save</button>
      </form>
    </div>
  );
}

export default WriteStory;

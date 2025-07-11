import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { getUser, getToken } from '../auth';

function ReadStory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const user = getUser();

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const res = await API.get(`/stories/${id}`);
        // Ensure likes is always an array
        const fixedStory = {
          ...res.data,
          likes: Array.isArray(res.data.likes) ? res.data.likes : [],
        };
        setStory(fixedStory);
      } catch (err) {
        console.error('Error loading story:', err);
        alert('Story not found or unavailable');
        navigate('/');
      }
    };

    fetchStory();
  }, [id, navigate]);

  const handleLike = async () => {
    try {
      const res = await API.post(`/stories/${id}/like`, null, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setStory((prev) => ({
        ...prev,
        likes: Array.isArray(res.data.likes) ? res.data.likes : [],
      }));
    } catch (err) {
      alert('Failed to like/unlike story');
    }
  };

  if (!story) return <p>Loading story...</p>;

  const hasLiked =
    user && Array.isArray(story.likes) && story.likes.includes(user.id);
  const isAdmin = story.user_id?.isAdmin;

  return (
    <div className="readstory-container">
      <h2 className="readstory-title">{story.title}</h2>

      <p
        onClick={() => navigate(`/profile/${story.user_id._id}`)}
        className={`readstory-author ${isAdmin ? 'admin' : ''}`}
      >
        By {story.user_id.usernickname}
      </p>

      <div className="readstory-content">{story.content}</div>

      <div className="readstory-meta">
        {story.tags.length > 0 && (
          <p className="readstory-tags">
            🏷️{' '}
            {story.tags.map((tag) => (
              <span key={tag} className="readstory-tag">
                #{tag}
              </span>
            ))}
          </p>
        )}

        <p className="readstory-likes">
          ❤️ {story.likes.length}
          {user && (
            <button onClick={handleLike} className="like-button">
              {hasLiked ? '💔 Unlike' : '❤️ Like'}
            </button>
          )}
        </p>
      </div>
    </div>
  );
}

export default ReadStory;

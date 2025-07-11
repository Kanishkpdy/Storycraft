import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { getToken, getUser } from '../auth';

function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const loggedInUser = getUser();

  const [author, setAuthor] = useState(null);
  const [stories, setStories] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followed, setFollowed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  const isOwner = loggedInUser?.id === id;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get(`/users/${id}`);
        const data = res.data;
        setAuthor(data.author);
        setStories(data.stories);
        setFollowers(data.author.followers || []);
        setFollowing(data.author.following || []);
        if (getUser()) {
          setFollowed(data.author.followers?.some(f => f._id === getUser().id));
        }
        setLoading(false);
      } catch (err) {
        console.error('Error loading profile:', err);
      }
    };

    fetchProfile();
  }, [id]);

  const toggleFollow = async () => {
    try {
      await API.post(`/users/follow/${id}`, null, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setFollowed(!followed);
      const res = await API.get(`/users/${id}`);
      setFollowers(res.data.author.followers || []);
    } catch (err) {
      alert('Follow/unfollow failed');
    }
  };

  const handleDelete = async (_id) => {
    if (!window.confirm('Delete this story?')) return;
    try {
      await API.delete(`/stories/${_id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setStories(stories.filter((s) => s._id !== _id));
    } catch (err) {
      alert('Failed to delete story');
    }
  };

  const handlePublish = async (_id) => {
    try {
      await API.put(`/stories/${_id}/publish`, null, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const updated = stories.map((s) =>
        s._id === _id ? { ...s, status: 'published' } : s
      );
      setStories(updated);
    } catch (err) {
      alert('Failed to publish');
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '20px',
        }}
      >
        <div>
          <h2>{isOwner ? '👋 Your Profile' : `👤 ${author.usernickname}'s Profile`}</h2>

          <p>
            <span
              style={{ cursor: 'pointer', textDecoration: 'underline', marginRight: '10px' }}
              onClick={() => setShowFollowers(!showFollowers)}
            >
              Followers: {followers.length}
            </span>

            {isOwner && (
              <span
                style={{ cursor: 'pointer', textDecoration: 'underline' }}
                onClick={() => setShowFollowing(!showFollowing)}
              >
                Following: {following.length}
              </span>
            )}
          </p>

          {showFollowers && (
            <div style={{ marginBottom: '10px' }}>
              {followers.length === 0 ? (
                <p>No followers yet.</p>
              ) : isOwner ? (
                <ul style={{ paddingLeft: '20px' }}>
                  {followers.map((user) => (
                    <li
                      key={user._id}
                      onClick={() => navigate(`/profile/${user._id}`)}
                      style={{ cursor: 'pointer', color: 'blue' }}
                    >
                      {user.usernickname}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>You can only view follower names on your own profile.</p>
              )}
            </div>
          )}

          {isOwner && showFollowing && (
            <div style={{ marginBottom: '10px' }}>
              {following.length === 0 ? (
                <p>Not following anyone.</p>
              ) : (
                <ul style={{ paddingLeft: '20px' }}>
                  {following.map((user) => (
                    <li
                      key={user._id}
                      onClick={() => navigate(`/profile/${user._id}`)}
                      style={{ cursor: 'pointer', color: 'blue' }}
                    >
                      {user.usernickname}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {!isOwner && (
            getToken() ? (
              <button onClick={toggleFollow}>
                {followed ? 'Unfollow' : 'Follow'}
              </button>
            ) : (
              <p style={{ color: 'gray', fontStyle: 'italic' }}>
                🔒 Login to follow this user
              </p>
            )
          )}
        </div>

        {isOwner && (
          <button onClick={() => navigate('/write')}>➕ Write New Story</button>
        )}
      </div>

      <h3>📚 {isOwner ? 'Your Stories' : 'Published Stories'}</h3>

      {stories.length === 0 ? (
        <p>No stories yet.</p>
      ) : (
        stories
          .filter((s) => isOwner || s.status === 'published')
          .map((story) => (
            <div
              key={story._id}
              style={{
                border: '1px solid #ccc',
                margin: '10px 0',
                padding: '10px',
                cursor: !isOwner ? 'pointer' : 'default',
              }}
              onClick={
                !isOwner
                  ? () => navigate(`/story/${story._id}`)
                  : undefined
              }
            >
              <h4>{story.title}</h4>
              <p>{story.content.slice(0, 150)}...</p>
              <p>Status: {story.status}</p>

              {isOwner && (
                <>
                  <button onClick={() => navigate(`/write/${story._id}`)}>✏️ Edit</button>
                  <button onClick={() => handleDelete(story._id)}>🗑️ Delete</button>
                  {story.status !== 'published' && (
                    <button onClick={() => handlePublish(story._id)}>🚀 Publish</button>
                  )}
                </>
              )}
            </div>
          ))
      )}
    </div>
  );
}

export default Profile;

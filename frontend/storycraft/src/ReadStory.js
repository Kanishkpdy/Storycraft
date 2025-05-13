import React, { useEffect, useState } from 'react';
import API from './services/api';
import { useParams } from 'react-router-dom';

function ReadStory() {
  const { id } = useParams();  // Get the 'id' parameter from the URL
  const [story, setStory] = useState(null);

  useEffect(() => {
    const fetchStory = async () => {
      if (!id) {
        console.error('Story ID is missing!');
        return;
      }

      try {
        const response = await API.get(`/stories/${id}`);
        if (response.data) {
          console.log('Fetched Story:', response.data);
          setStory(response.data);  // Set the story data to the state
        } else {
          console.log('Story not found');
        }
      } catch (error) {
        console.error('Error fetching story:', error);
      }
    };

    fetchStory();
  }, [id]);

  if (!story) return <div>Loading...</div>;

  return (
    <div>
      <h1>{story.title}</h1>
      <p>{story.content}</p>
    </div>
  );
}

export default ReadStory;

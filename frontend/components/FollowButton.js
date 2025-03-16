import axios from 'axios';
import { useState } from 'react';

const FollowButton = ({ username }) => {
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollow = async () => {
    try {
      const response = await axios.post(`http://localhost:8000/api/follow/${username}/`, {}, {
        withCredentials: true,
      });

      if (response.data.message === 'Followed') {
        setIsFollowing(true);
      } else {
        setIsFollowing(false);
      }
    } catch (error) {
      console.error('Error al seguir al usuario:', error);
    }
  };

  return (
    <button onClick={handleFollow}>
      {isFollowing ? 'Siguiendo' : 'Seguir'}
    </button>
  );
};

export default FollowButton;

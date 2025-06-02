import axios from 'axios';
import { useState } from 'react';

const AddFriendButton = ({ username }) => {
  const [isFriend, setIsFriend] = useState(false);

  const handleFriendRequest = async () => {
    try {
      const response = await axios.post(`http://192.168.101.7:8000/api/add-friend/${username}/`, {}, {
        withCredentials: true,
      });

      if (response.data.message === 'Solicitud de amistad enviada y aceptada') {
        setIsFriend(true);
      }
    } catch (error) {
      console.error('Error al agregar amigo:', error);
    }
  };

  return (
    <button onClick={handleFriendRequest}>
      {isFriend ? 'Amigos' : 'Agregar Amigo'}
    </button>
  );
};

export default AddFriendButton;

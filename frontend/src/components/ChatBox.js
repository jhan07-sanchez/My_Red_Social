import { useState, useEffect } from 'react';

const ChatBox = ({ roomName, username }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  
  const socket = new WebSocket(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ws/chat/${roomName}/`);

  useEffect(() => {
    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setMessages(prev => [...prev, data]);
    };
  }, []);

  const sendMessage = () => {
    socket.send(JSON.stringify({
      'message': newMessage,
      'sender': username,
    }));
    setNewMessage('');
  };

  return (
    <div>
      <h2>Chat en Tiempo Real</h2>
      <div>
        {messages.map((msg, index) => (
          <p key={index}><strong>{msg.sender}:</strong> {msg.message}</p>
        ))}
      </div>
      <input 
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Enviar</button>
    </div>
  );
};

export default ChatBox;

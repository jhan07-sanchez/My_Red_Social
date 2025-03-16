import { useState, useEffect } from 'react';

const ChatComponent = ({ roomName, username }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  let socket = null;

  useEffect(() => {
    const wsUrl = `ws://localhost:8000/ws/chat/${roomName}/`;
    socket = new WebSocket(wsUrl);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, data]);
    };

    return () => {
      socket.close();
    };
  }, [roomName]);

  const sendMessage = () => {
    if (socket && message.trim() !== '') {
      socket.send(JSON.stringify({
        'message': message,
        'username': username
      }));
      setMessage('');
    }
  };

  return (
    <div>
      <h2>Chat: {roomName}</h2>
      <div>
        {messages.map((msg, index) => (
          <p key={index}><strong>{msg.username}:</strong> {msg.message}</p>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Escribe tu mensaje..."
      />
      <button onClick={sendMessage}>Enviar</button>
    </div>
  );
};

export default ChatComponent;

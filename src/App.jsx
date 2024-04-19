import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';

const App = () => {
  const [notification, setNotification] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = new WebSocket('ws://localhost:4000');
    setSocket(newSocket);

    newSocket.onmessage = handleWebSocketMessage;

    window.addEventListener('beforeunload', handleCloseWebSocket);

    return () => {
      handleCloseWebSocket();
      window.removeEventListener('beforeunload', handleCloseWebSocket);
    };
  }, []);

  const handleWebSocketMessage = (event) => {
    const data = JSON.parse(event.data);
    setNotification(data);

    setTimeout(() => {
      setNotification(null);
    }, 10000);
  };

  const handleEnviarPagos = async () => {
    try {
      const response = await axios.post('http://localhost:3000/payment', {
        nombre: 'Jose',
        apellido: 'Perez Lopez',
        total: '100'
      });
      console.log('Pago enviado correctamente:', response.data);
    } catch (error) {
      console.error('Error al enviar el pago:', error);
    }
  };

  const handleCloseWebSocket = () => {
    if (socket) {
      socket.close();
    }
  };

  return (
    <div className="app-container">
      <h1>Pagos</h1>
      {notification && (
        <div className="notification">
          {notification.message}
        </div>
      )}
      <div className="pagos-form">
        <button onClick={handleEnviarPagos}>Enviar Pagos</button>
      </div>
    </div>
  );
};

export default App;

// src/components/JoinRoom.js
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { WebSocketContext } from '../WebsocketContext';
import HomeButton from './HomeButton';

function JoinRoom() {
  const [roomName, setRoomName] = useState('');
  const [roomJoiningErrorMessage, setRoomJoiningErrorMessage] = useState('');
  const navigate = useNavigate();
  const ws = useContext(WebSocketContext);

  const location = useLocation();
  const errorMessage = location.state?.errorMessage || '';
  const host = process.env.REACT_APP_NGINX_HOST || 'localhost';
  const port = process.env.REACT_APP_NGINX_PORT || '3001';
  const isLocalEnv = process.env.REACT_APP_NGINX_ENV === 'local';

  const endpoint = isLocalEnv ? `ws://${host}:${port}` : `wss://${host}`;


  useEffect(() => {
    const token = localStorage.getItem('go-chat-token');

    if (token && (!ws.current || ws.current.readyState !== WebSocket.OPEN)) {
        console.log("Token available. Attempting to reconnect...")
        ws.current = new WebSocket(`${endpoint}/ws/chat?token=${token}`);

        ws.current.onopen = () => console.log("WebSocket reconnected");

        ws.current.onerror = (error) => {
          console.error("WebSocket error:", error);
          navigate('/login'); // Chuyển hướng đến đăng nhập do lỗi
        };
    }

    const handleMessage = (message) => {
        console.log('Message received from server: ', message.data)
        const data = JSON.parse(message.data);
        if (data.type === 'join_room' && data.success) {
          navigate('/chat', { state: { roomName } });
        }
    };

    if (ws.current) {
        ws.current.addEventListener('message', handleMessage);
    }

    return () => {};
  }, [ws, roomName, navigate])

  

  const handleJoin = (e) => {
    e.preventDefault();
    if (roomName === '') {
      setRoomJoiningErrorMessage('Why the hurry? Enter a room name first!');
      return;
    }
    const currentWebSocket = ws.current;
    
    if (currentWebSocket && currentWebSocket.readyState === WebSocket.OPEN) {
        currentWebSocket.send(JSON.stringify({ type: 'join_room', room: roomName }));
    } else {
        console.error("WebSocket is not open. Attempting to reconnect...");
        const token = localStorage.getItem('token');
        if (token) {
            ws.current = new WebSocket(`${endpoint}/ws/chat?token=${token}`);
        } else {
            navigate('/login');
        }
    }
  };

  let errorMessageToDisplay = null; //Khởi tạo một biến để chứa nội dung lỗi. Mặc định là null (không hiển thị gì)
  if (roomJoiningErrorMessage) { //Kiểm tra xem có lỗi phát sinh khi vào phòng (Join Room) hay không (ví dụ: phòng đã đầy, sai mật khẩu)
    errorMessageToDisplay =  <span className="error-message">*{roomJoiningErrorMessage}</span>
  } else if (errorMessage) {
    errorMessageToDisplay = <span className="error-message">*{errorMessage}</span>
  }

  return (
    <div className="bg-container">
        <div className="chat-window">
        <HomeButton />
            <form onSubmit={handleJoin} className="join-room-form">
              <div className='headings'>Join a Room</div>
              <span>Where will your words take you today? 🤔</span>
              {errorMessageToDisplay}
              <br />
              <br />
              <div className='form-input-box'>
                <input
                type="text"
                value={roomName}
                onChange={e => setRoomName(e.target.value)}
                placeholder="Enter Chat Room Name"
                className="form-input"
                />
              </div>
              <button className="form-button">Join Room 🚀</button>
            </form>
        </div>
    </div>
  );
}

export default JoinRoom;

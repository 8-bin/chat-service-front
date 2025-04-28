import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

function ChattingPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [roomName, setRoomName] = useState('');
  const stompClientRef = useRef(null);

  const token = localStorage.getItem('token');
  const nickname = localStorage.getItem('nickname') || '익명';

  useEffect(() => {
    if (!token) {
      console.error('토큰 없음. 로그인 필요');
      navigate('/login');
      return;
    }
    connectWebSocket();
    fetchRoomName();
    return () => {
      disconnectWebSocket();
    };
  }, []);

  const connectWebSocket = () => {
    const socket = new SockJS(`http://52.78.250.173:30081/chat?token=${token}`);

    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: { Authorization: `Bearer ${token}` },
      debug: (str) => console.log('[STOMP DEBUG]', str),
      onConnect: () => {
        console.log('WebSocket 연결 성공');

        client.subscribe(`/topic/chat/room/${roomId}`, (message) => {
          try {
            const body = JSON.parse(message.body);
            setMessages((prev) => [...prev, body]);
          } catch (error) {
            console.error('메시지 파싱 실패:', error);
          }
        });

        client.publish({
          destination: '/app/chat/enter',
          body: JSON.stringify({
            roomId,
            sender: nickname,
            content: `${nickname} 님이 입장했습니다.`,
          }),
        });
      },
      onStompError: (frame) => {
        console.error('Broker error:', frame.headers['message']);
      },
      onDisconnect: (frame) => {
        console.log('STOMP 정상 disconnect:', frame);
      },
    });

    client.onWebSocketClose = (event) => {
      console.error('WebSocket 끊김 이벤트 발생:', event);
    };

    client.activate();
    stompClientRef.current = client;
  };

  const fetchRoomName = async () => {
    try {
      const response = await fetch(`http://52.78.250.173:30081/api/chatrooms/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error(`방 정보 불러오기 실패: HTTP ${response.status}`);
      const data = await response.json();
      setRoomName(data?.name || `방 번호: ${roomId}`);
    } catch (error) {
      console.error('❌ 채팅방 이름 불러오기 실패:', error);
      setRoomName(`방 번호: ${roomId}`);
    }
  };

  const disconnectWebSocket = () => {
    if (stompClientRef.current) {
      stompClientRef.current.deactivate();
      console.log('WebSocket 연결 종료');
    }
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;
    if (stompClientRef.current && stompClientRef.current.connected) {
      stompClientRef.current.publish({
        destination: '/app/chat/message',
        body: JSON.stringify({
          roomId,
          sender: nickname,
          content: input,
        }),
      });
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  const handleLeaveRoom = () => {
    if (stompClientRef.current && stompClientRef.current.connected) {
      stompClientRef.current.publish({
        destination: '/app/chat/leave',
        body: JSON.stringify({
          roomId,
          sender: nickname,
          content: `${nickname} 님이 퇴장했습니다.`,
        }),
      });
    }
    disconnectWebSocket();
    navigate('/chatrooms');
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.roomName}>{roomName}</h2> {/* ✅ 방 이름 */}

      <div style={styles.chatBox}>
        {messages.map((msg, idx) => {
          const isMine = msg.sender === nickname;
          return (
            <div
              key={idx}
              style={{
                ...styles.messageContainer,
                justifyContent: isMine ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                style={{
                  ...styles.messageBubble,
                  backgroundColor: isMine ? '#dcf8c6' : '#f1f0f0',
                  alignSelf: isMine ? 'flex-end' : 'flex-start',
                }}
              >
                <div style={styles.senderName}>{msg.sender}</div>
                <div>{msg.content}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={styles.inputArea}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          style={styles.input}
        />
        <button onClick={handleSendMessage} style={styles.sendButton}>
          Send
        </button>
      </div>

      <div style={{ marginTop: '10px' }}>
        <button onClick={handleLeaveRoom} style={styles.leaveButton}>
          Leave Room
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: '600px',
    margin: '30px auto',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  roomName: {
    fontSize: '20px',
    marginBottom: '20px',
    color: '#555',
  },
  chatBox: {
    border: '1px solid #ccc',
    borderRadius: '10px',
    backgroundColor: '#f9f9f9',
    height: '400px',
    overflowY: 'scroll',
    padding: '15px',
    marginBottom: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  messageContainer: {
    display: 'flex',
  },
  messageBubble: {
    maxWidth: '70%',
    padding: '10px',
    borderRadius: '20px',
    backgroundColor: '#f1f0f0',
    wordBreak: 'break-word',
    textAlign: 'left',
  },
  senderName: {
    fontSize: '12px',
    color: '#555',
    marginBottom: '5px',
  },
  inputArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  input: {
    flex: 1,
    padding: '10px',
    fontSize: '16px',
    borderRadius: '20px',
    border: '1px solid #ccc',
  },
  sendButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
  },
  leaveButton: {
    padding: '10px 20px',
    fontSize: '14px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
  },
};

export default ChattingPage;

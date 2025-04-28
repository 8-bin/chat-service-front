import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ChatRoomsPage() {
  const navigate = useNavigate();
  const [chatRooms, setChatRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState('');

  const token = localStorage.getItem('token');

  const fetchChatRooms = async () => {
    try {
      const response = await axios.get('http://52.78.250.173:30081/api/chatrooms', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChatRooms(response.data);
    } catch (error) {
      console.error('채팅방 목록 불러오기 실패', error);
    }
  };

  useEffect(() => {
    fetchChatRooms();
  }, []);

  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) {
      alert('방 이름을 입력하세요.');
      return;
    }

    try {
      await axios.post('http://52.78.250.173:30081/api/chatrooms', 
        { name: newRoomName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('채팅방 생성 성공!');
      setNewRoomName('');
      fetchChatRooms();
    } catch (error) {
      console.error('채팅방 생성 실패', error);
      alert('채팅방 생성 실패');
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('정말 이 채팅방을 삭제할까요?')) return;

    try {
      await axios.delete(`http://52.78.250.173:30081/api/chatrooms/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('채팅방 삭제 성공!');
      fetchChatRooms();
    } catch (error) {
      console.error('채팅방 삭제 실패', error);
      alert('본인이 생성한 채팅방만 삭제할 수 있습니다.');
    }
  };

  const handleEnterRoom = async (roomId) => {
    try {
      await axios.post(`http://52.78.250.173:30081/api/chatrooms/${roomId}/enter`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate(`/chatroom/${roomId}`);
    } catch (error) {
      console.error('채팅방 입장 실패', error);
      alert('채팅방 입장 실패');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>채팅방 목록</h1>

      {/* 채팅방 생성 */}
      <div style={styles.createRoom}>
        <input
          type="text"
          placeholder="새 채팅방 이름"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleCreateRoom} style={styles.createButton}>
          방 만들기
        </button>
      </div>

      {/* 채팅방 리스트 */}
      <div style={styles.roomList}>
        {chatRooms.map((room) => (
          <div key={room.id} style={styles.roomItem}>
            <div 
              style={styles.roomName}
              onClick={() => handleEnterRoom(room.id)}
            >
              {room.name}
            </div>
            <button 
              onClick={() => handleDeleteRoom(room.id)} 
              style={styles.deleteButton}
            >
              삭제
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '500px',
    margin: '50px auto',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    backgroundColor: '#ffffff',
  },
  title: {
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '28px',
    color: '#333',
  },
  createRoom: {
    display: 'flex',
    marginBottom: '20px',
  },
  input: {
    flex: 1,
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '8px',
  },
  createButton: {
    marginLeft: '10px',
    padding: '10px 16px',
    fontSize: '16px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  roomList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  roomItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    cursor: 'pointer',
  },
  roomName: {
    fontSize: '18px',
    fontWeight: '500',
    color: '#007bff',
  },
  deleteButton: {
    padding: '6px 10px',
    fontSize: '14px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};

export default ChatRoomsPage;

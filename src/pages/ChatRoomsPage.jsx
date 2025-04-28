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
      alert('채팅방 입장 성공!');
      navigate(`/chatroom/${roomId}`);
    } catch (error) {
      console.error('채팅방 입장 실패', error);
      alert('채팅방 입장 실패');
    }
  };

  return (
    <div style={styles.container}>
      <h2>채팅방 목록</h2>

      {/* 채팅방 생성 */}
      <div style={styles.createRoom}>
        <input
          type="text"
          placeholder="새 채팅방 이름"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleCreateRoom} style={styles.button}>
          방 생성
        </button>
      </div>

      {/* 채팅방 리스트 */}
      <ul style={styles.list}>
        {chatRooms.map((room) => (
          <li key={room.id} style={styles.listItem}>
            <span 
              style={{ cursor: 'pointer' }} 
              onClick={() => handleEnterRoom(room.id)}  // 입장 로직 연결
            >
              {room.name}
            </span>
            <button 
              onClick={() => handleDeleteRoom(room.id)} 
              style={styles.deleteButton}
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    width: '400px',
    margin: '50px auto',
    textAlign: 'center',
  },
  createRoom: {
    marginBottom: '20px',
  },
  input: {
    padding: '8px',
    marginRight: '10px',
    width: '200px',
  },
  button: {
    padding: '8px 12px',
  },
  list: {
    listStyle: 'none',
    padding: 0,
  },
  listItem: {
    marginBottom: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deleteButton: {
    padding: '5px 10px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  },
};

export default ChatRoomsPage;

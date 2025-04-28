// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://52.78.250.173:31897/api/users/signup', {
        email,
        password,
        nickname
      });

      alert('회원가입 성공!');
      navigate('/');
    } catch (error) {
      console.error('회원가입 실패', error);
      alert('회원가입 실패했습니다.');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>회원가입</h1>
      <form onSubmit={handleRegister}>
      <div>
          <input
            type="text"
            placeholder="이름"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            style={{ padding: '8px', marginBottom: '10px' }}
            required
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '8px', marginBottom: '10px' }}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '8px', marginBottom: '10px' }}
            required
          />
        </div>
        
        <button type="submit" style={{ padding: '10px 20px' }}>
          회원가입
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;

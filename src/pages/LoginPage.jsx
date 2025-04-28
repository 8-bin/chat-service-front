import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://52.78.250.173:31897/api/users/login', {
        email,
        password,
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

      const token = response.data;
      const nickname = email.split('@')[0];
      if (token) {
        localStorage.setItem('token', token);  // ✅ 토큰 저장
        localStorage.setItem('nickname', nickname);
        alert('로그인 성공!');
        navigate('/chatrooms');
      } else {
        alert('로그인 실패: 토큰이 없습니다.');
      }
    } catch (error) {
      console.error('로그인 실패', error);
      alert('로그인 실패했습니다.');
    }
  };

  return (
    <div style={styles.container}>
      <h2>로그인</h2>
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          style={styles.input}
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          style={styles.input}
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" style={styles.button}>로그인</button>
      </form>

      <p style={styles.signupText}>
        계정이 없나요?{' '}
        <span style={styles.link} onClick={() => navigate('/signup')}>
          회원가입
        </span>
      </p>
    </div>
  );
}

const styles = {
  container: {
    width: '300px',
    margin: '100px auto',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
  },
  button: {
    padding: '10px',
    backgroundColor: '#28a745',
    color: '#fff',
    fontSize: '16px',
    border: 'none',
    cursor: 'pointer',
  },
  signupText: {
    marginTop: '20px',
  },
  link: {
    color: '#007bff',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};

export default LoginPage;

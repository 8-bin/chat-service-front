import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChatRoomsPage from './pages/ChatRoomsPage';
import ChattingPage from './pages/ChattingPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<RegisterPage />} />
        <Route path="/chatrooms" element={<ChatRoomsPage />} />
        <Route path="/chatroom/:roomId" element={<ChattingPage />} />
      </Routes>
    </Router>
  );
}

export default App;

import './App.css'
import HomePage from './pages/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MatchesPage from './pages/Matche';
import GamePage from './pages/Game';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import ProfilePage from './pages/Profile';
import ProfileDashboard from './pages/Profile';
function App() {
  return (
     <BrowserRouter>
      <Routes>
         <Route path="/" element={<HomePage/>} />
         <Route path="/games" element={<GamePage/>} />
         <Route path="/matches" element={<MatchesPage/>} />
         <Route path="/login" element={<LoginPage/>} />
         <Route path="/register" element={<RegisterPage/>} />
         <Route path="/profile" element={<ProfileDashboard/>} />
      </Routes>
     </BrowserRouter>
  );
}

export default App

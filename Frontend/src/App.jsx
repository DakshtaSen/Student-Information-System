import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, useNavigate, Route, Routes } from 'react-router-dom';
import AppRoutes from "./routes/AppRoutes";
import Auth from './components/Auth';
import Header from './components/commons/Header';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      navigate('/login'); // Điều hướng đến trang login nếu chưa đăng nhập
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login'); // Điều hướng sau khi đăng xuất
  };

  return (
    <div className="App">
      {isAuthenticated ? (
        <>
          {/* <Header setIsAuthenticated={setIsAuthenticated} onLogout={handleLogout} />  */}
          <AppRoutes />
        </>
      ) : (
        <Routes>
          <Route path="/login" element={<Auth setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="*" element={<Auth setIsAuthenticated={setIsAuthenticated} />} />
        </Routes>
      )}
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;

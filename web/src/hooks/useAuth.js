import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const useAuth = () => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
      setLoading(false);
    } else {
      setLoading(false);
      navigate("/login");
    }
  }, [navigate]);

  const login = async (userId, password) => {
    try {
      const res = await axios.post("http://localhost:8081/auth", {
        username: userId,
        password: password,
      });
      if (res.data.access === "granted") {
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        setIsAuthenticated(true);
        navigate("/", { replace: true });  // Chuyển về "/"
      } else {
        setError("Invalid credentials");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setIsAuthenticated(false);
    navigate("/login", { replace: true });
  };

  return { token, login, logout, loading, error, isAuthenticated };
};

export default useAuth;

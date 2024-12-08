import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Particle from "./Particle";
import Logo from "../assets/Logo.png";
import { API } from '../constant/constant';

function Auth({ setIsAuthenticated }) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isName, setIsName] = useState(true);
  const [isPassword, setIsPassword] = useState(true);
  const [nameError, setNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = `${API}/identity`;

  const authorize = async () => {
    try {
      setIsLoading(true);
      setLoginError("");
      const res = await axios.post(
        `${API_URL}/global/auth/token`,
        new URLSearchParams({
          username: userId,
          password: password,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (res.status === 200) {
        localStorage.setItem("token", res.data.token);
        setIsAuthenticated(true);
        toast.success("Login successful");
        navigate("/");
      }
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            setLoginError("Invalid username or password");
            toast.error("Invalid username or password");
            break;
          case 404:
            setLoginError("Account not found");
            toast.error("Account not found");
            break;
          default:
            setLoginError("Login failed. Please try again later");
            toast.error("Login failed. Please try again later");
        }
      } else {
        setLoginError("Server connection error");
        toast.error("Server connection error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPasswordHandler = async () => {
    try {
      setIsLoading(true);
      const res = await axios.put(`${API_URL}/global/reset_password`, {
        email: forgotEmail,
      });

      if (res.status === 200) {
        toast.success("Password reset instructions sent to your email");
        setIsForgotPassword(false);
      }
    } catch (error) {
      if (error.response) {
        toast.error("Failed to send password reset email");
      } else {
        toast.error("Server connection error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    let isValid = true;

    if (userId.length < 3) {
      setIsName(false);
      setNameError("Username must be at least 3 characters");
      isValid = false;
    } else {
      setIsName(true);
      setNameError("");
    }

    if (password.length < 6) {
      setIsPassword(false);
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    } else {
      setIsPassword(true);
      setPasswordError("");
    }

    return isValid;
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!isLoading && validateForm()) {
      authorize();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gray-100">
      <Particle />
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg border border-blue-500 z-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-600 mt-6">AMS</h1>
          <img src={Logo} alt="AMS Icon" className="w-16 h-16 mx-auto mt-4" />
          <h2 className="text-3xl font-bold mt-6">Login</h2>
        </div>

        {isForgotPassword ? (
          <div className="mt-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Enter your email
              </label>
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                disabled={isLoading}
              />
            </div>
            <button
              type="button"
              onClick={forgotPasswordHandler}
              className={`w-full py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-200 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
            <button
              type="button"
              onClick={() => setIsForgotPassword(false)}
              className="w-full mt-4 text-blue-500 hover:text-blue-600 transition-colors duration-200"
              disabled={isLoading}
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={submitHandler} className="mt-6">
            {loginError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded relative">
                <span className="block sm:inline">{loginError}</span>
              </div>
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter username"
                className={`w-full px-4 py-2 mt-1 border ${
                  isName ? "border-gray-300" : "border-red-500"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-200`}
                required
                disabled={isLoading}
              />
              {!isName && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
            </div>
            <div className="mb-4 relative">
              <label className="block text-sm font-medium text-gray-700">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className={`w-full px-4 py-2 mt-1 border ${
                  isPassword ? "border-gray-300" : "border-red-500"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-200`}
                required
                disabled={isLoading}
              />
              <span
                className="absolute right-3 top-8 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? "🙈" : "👁"}
              </span>
              {!isPassword && (
                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
              )}
            </div>
            <button
              type="submit"
              className={`w-full py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "LOGIN"}
            </button>
            <button
              type="button"
              onClick={() => setIsForgotPassword(true)}
              className="w-full mt-4 text-blue-500 hover:text-blue-600 transition-colors duration-200"
              disabled={isLoading}
            >
              Forgot Password?
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Auth;
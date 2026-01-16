import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const WorkerLogin  = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    try {
      const API_BASE = import.meta.env.VITE_API_BASE || 'https://societysync-890y.onrender.com/';
      const res = await axios.post(`${API_BASE}/api/auth/login/worker`, form, {
        withCredentials: true,
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('worker', JSON.stringify(res.data.user));
      setUser(res.data.user);
      window.location.href = "/dashboard/worker";
      
    } catch (err) {
      localStorage.removeItem('token');
      setErrorMessage(err.response?.data?.message || 'Something went wrong');
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(false);
        return;
      }
      try {
        const res = await axios.get(`${API_BASE}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        if (res.data) {
          setUser(res.data);
          navigate('/dashboard/worker');
        } else {
          setUser(false);
          localStorage.removeItem('token');
        }
      } catch {
        setUser(false);
        localStorage.removeItem('token');
      }
    };

    checkAuth();
  }, [navigate]);

  if (user === null) {
    return (
      <div className="flex items-center justify-center min-h-screen w-screen bg-neutral-950">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen w-screen bg-neutral-950 overfow-hidden">
      <div className="border-2 border-transparent p-1 rounded-xl animate-slideIn">
        <div className="bg-gray-200 p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent mb-6 text-center animate-pulseText">
            Login As A Worker
          </h2>
          {errorMessage && (
            <div className="bg-red-500 text-white p-2 mb-4 rounded-lg text-center">
              {errorMessage}
            </div>
          )}
          <form onSubmit={handleSubmit} className="min-h-[30vh] w-96 space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                required
                id="email"
                name="email"
                onChange={handleChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                required
                name="password"
                onChange={handleChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-3 rounded-lg hover:scale-105 hover:ring-2 hover:ring-cyan-300 transition-all duration-200"
            >
              Login
            </button>
            <p className="text-center text-blue-500 hover:underline cursor-pointer mt-4">
              "Admin roles are fixed!"
            </p>
          </form>
          <div className="flex gap-4 justify-center items-center mt-4">
            <h1
              onClick={() => navigate("/login")}
              className="text-blue-600 cursor-pointer hover:text-blue-700 underline"
            >
              Are you a User?
            </h1>
            <h1 onClick={() => navigate("/login/admin")}  className="text-blue-600 cursor-pointer hover:text-blue-700 underline">
              Are you an Admin?
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerLogin;

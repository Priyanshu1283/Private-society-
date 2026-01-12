import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserLogin = () => {
  const [form, setForm] = useState({ name: '', houseNo: '', email: '', password: '' });
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLogin) {
      // Registration flow: submit and show pending notice
      try {
        const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';
        const res = await axios.post(`${API_BASE}/api/auth/register`, form, { withCredentials: true });
        alert(res.data?.message || 'Registered — awaiting admin approval');
        setIsLogin(true);
      } catch (err) {
        alert(err.response?.data?.message || 'Something went wrong');
      }
      return;
    }

    // Login flow
    try {
      const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';
      const res = await axios.post(`${API_BASE}/api/auth/login`, form, { withCredentials: true });
      const user = res.data.user;
      const token = res.data.token;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      window.location.href = "/dashboard";
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-center h-screen w-screen bg-neutral-950 overfow-hidden">
        <div className="border-2 border-transparent p-1 rounded-xl animate-slideIn">
          <div className="bg-gray-200 p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent mb-6 text-center animate-pulseText">
              {isLogin ? 'Login to SocietySync' : 'Register for SocietySync'}
            </h2>
            <form onSubmit={handleSubmit} className="min-h-[30vh] w-96 space-y-4">
              {!isLogin && (
                <>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      onChange={handleChange}
                      className="mt-1 block w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="houseNo" className="block text-sm font-medium text-gray-700">
                      House Number
                    </label>
                    <input
                      type="text"
                      id="houseNo"
                      name="houseNo"
                      onChange={handleChange}
                      className="mt-1 block w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                      placeholder="e.g., A-101"
                    />
                  </div>
                </>
              )}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
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
                {isLogin ? 'Login' : 'Register'}
              </button>
              <p
                onClick={() => setIsLogin(prev => !prev)}
                className="text-center text-blue-500 hover:underline cursor-pointer mt-4"
              >
                {isLogin ? 'Need to register?' : 'Already have an account?'}
              </p>
            </form>
            <div className='flex gap-4 justify-center items-center mt-4'>
              <h1 onClick={() => navigate("/login/admin")} className='text-blue-600 cursor-pointer hover:text-blue-700 underline'>Are you an Admin?</h1>
              <h1 onClick={() => navigate("/login/worker")} className='text-blue-600 hover:text-blue-700 underline'>Are you a Worker?</h1>
            </div>
          </div>
        </div>
      </div>
      <div className='absolute bottom-[7%] left-[50%] translate-x-[-50%] text-center'>
        <h1 className='text-xl text-white mb-2 text-gray-100'>First time here?</h1>
        <button onClick={() => navigate('/discover')} className='bg-gray-100 whitespace-nowrap hover:bg-gray-200 transition-colors rounded-xl px-4 py-2 text-[22px] md:text-[18px] font-semibold shadow-md hover:bg-gray-300 shadow-lg shadow-black'>
          Discover SocietySync
        </button>
      </div>

    </div>
  );
};

export default UserLogin;

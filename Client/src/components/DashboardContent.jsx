import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Siren, Users, Briefcase, Shield, Check, X, RefreshCw, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import axios from 'axios';

const DashboardContent = () => {
  const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:3000';
  const [dashboardData, setDashboardData] = useState(null);
  const navigate = useNavigate();
  const [role, setRole] = useState("user");
  const [pending, setPending] = useState({ users: [], workers: [], securities: [] });
  const [activeTab, setActiveTab] = useState('user');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`${API_BASE}/api/admin/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPending(res.data || { users: [], workers: [], securities: [] });
    } catch (err) {
      console.error('Refresh failed', err);
      alert('Failed to refresh pending registrations');
    } finally {
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

  const getTabList = () => {
    if (activeTab === 'user') return pending.users || [];
    if (activeTab === 'worker') return pending.workers || [];
    if (activeTab === 'security') return pending.securities || [];
    return [];
  };

  const activeList = getTabList();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const adminData = localStorage.getItem('admin');
    const token = localStorage.getItem('token');
  
    if ((!userData && !adminData) || !token) {
      navigate('/login');
    } else {
      try {
        const data = userData || adminData;
        setDashboardData(JSON.parse(data));
      } catch (e) {
        console.error("Error parsing dashboard data:", e);
        navigate('/login');
      }
    }
    if (adminData) setRole("admin");
    // If admin, fetch pending registrations
    if (adminData) {
      const token = localStorage.getItem('token');
      axios.get(`${API_BASE}/api/admin/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        setPending(res.data || { users: [], workers: [], securities: [] });
      }).catch(err => console.error('Failed to load pending:', err));
    }
  }, []);

  const handleApprove = async (role, id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.patch(`${API_BASE}/api/admin/approve/${role}/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(res.data);
      setPending(prev => ({ 
        users: prev.users.filter(u => !(role === 'user' && u._id === id)),
        workers: prev.workers.filter(w => !(role === 'worker' && w._id === id)),
        securities: prev.securities.filter(s => !(role === 'security' && s._id === id))
      }));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Approve failed');
    }
  };

  const handleReject = async (role, id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_BASE}/api/admin/reject/${role}/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPending(prev => ({
        users: prev.users.filter(u => !(role === 'user' && u._id === id)),
        workers: prev.workers.filter(w => !(role === 'worker' && w._id === id)),
        securities: prev.securities.filter(s => !(role === 'security' && s._id === id))
      }));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Reject failed');
    }
  };
  

  const today = new Date();
  const parts = today.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).split(" ");
  const formattedDate = `${parts[0]}, ${parts.slice(1).join(' ')}`;  

  const cards = [
    {
      title: 'Events',
      description: 'View upcoming events',
      bg: 'bg-gradient-to-br from-blue-500 to-cyan-600',
      href: '/events',
      image: 'https://cdn.pixabay.com/photo/2016/11/23/15/48/audience-1853662_1280.jpg',
      icon: (
        <svg className="w-8 h-8 " fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: 'Complaints',
      description: 'Submit or track complaints',
      bg: 'bg-gradient-to-br from-pink-500 to-purple-600',
      href: '/complaints',
      image: 'https://cdn.pixabay.com/photo/2019/08/13/08/15/adult-4402808_1280.jpg',
      icon: (
        <svg className="w-8 h-8 " fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Ordering',
      description: 'Online grocery ordering',
      bg: 'bg-gradient-to-br from-amber-500 to-red-600',
      href: '/ordering',
      image: 'https://cdn.pixabay.com/photo/2022/01/28/12/17/delivery-6974508_1280.jpg',
      icon: (
        <svg className="w-8 h-8 " fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      title: 'Services',
      description: 'Request maintenance',
      bg: 'bg-gradient-to-br from-emerald-500 to-green-600',
      href: '/services',
      image: 'https://cdn.pixabay.com/photo/2021/02/02/12/41/iron-5973861_1280.jpg',
      icon: (
        <svg className="w-8 h-8 " fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.79m0 0L21 21" />
        </svg>
      )
    },
    {
      title: 'Rent & Maintenance',
      description: 'Manage rent and maintenance',
    
      bg: 'bg-gradient-to-br from-emerald-500 to-green-600',
      href: '/rent-maintenance',
      image: 'https://images.unsplash.com/photo-1615404420216-cc423164563f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      icon: (
        <svg className="w-8 h-8 " fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.79m0 0L21 21" />
        </svg>
      )
    },
    {
      title: 'Security Cams',
      description: 'View Live Security Cams',
    
      bg: 'bg-gradient-to-br from-emerald-500 to-green-600',
      href: '/security-cams',
      image: 'https://images.unsplash.com/photo-1590613607026-15c463e30ca5?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      icon: (
        <svg className="w-8 h-8 " fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.79m0 0L21 21" />
        </svg>
      )
    },
    {
      title: 'Visitor & Delivery',
      description: 'Validate Visitors & Delivery Boys',
    
      bg: 'bg-gradient-to-br from-emerald-500 to-green-600',
      href: '/visitor-delivery',
      image: 'https://images.unsplash.com/photo-1609143739217-01b60dad1c67?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      icon: (
        <svg className="w-8 h-8 " fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.79m0 0L21 21" />
        </svg>
      )
    },

  ];


  return (
    <>
    { dashboardData ? 
    <div className="w-full p-6 md:p-8 relative animate-gradientFade bg-neutral-950">
    <style>
      {`
        @keyframes slideIn {
          from { transform: translateY(-50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes gradientFade {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pulseText {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        .animate-slideIn {
          animation: slideIn 0.5s ease-out;
        }
        .animate-gradientFade {
          background: linear-gradient(135deg, #e2e8f0, #f1f5f9, #e2e8f0);
          background-size: 200% 200%;
          animation: gradientFade 15s ease infinite;
        }
        .animate-pulseText:hover {
          animation: pulseText 1s infinite;
        }
      `}
    </style>
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
      <div>
        <div className='flex items-center gap-4'>
          <h2 className="text-3xl md:text-3xl font-bold bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent animate-pulseText">
          {`Hi ${
            (() => {
              const firstName = dashboardData.name.trim().split(' ')[0];
              const formatted = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
              return formatted.length > 12 ? formatted.slice(0, 9) + '...' : formatted;
            })()
          }${dashboardData.houseNo ? `, House: ${dashboardData.houseNo}` : ''}`}
          </h2>
          <div 
            onClick={() => navigate("/emergency")}
            className='bg-red-500 hover:bg-red-700 rounded-[50%] p-3 text-white transition-all duration-200 hover:scale-105 shadow-md shadow-red-500/30 cursor-pointer'>
              <Siren />
          </div>
        </div>
        { role === "admin" && (
          <div className="mt-1">
            <span className='bg-red-100 border border-red-200 text-red-700 text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider'>
              [ Admin Portal ]
            </span>
          </div>
        )}
        <p className="text-sm text-gray-500 mt-2 font-medium">
          Today is {`${formattedDate}`}
        </p>
      </div>
    </div>

    {role === 'admin' && (
      <>
        {/* Admin Quick Metrics Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 animate-slideIn">
          <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending Approvals</p>
                <h3 className="text-3xl font-extrabold text-cyan-600 mt-1">
                  {(pending.users?.length || 0) + (pending.workers?.length || 0) + (pending.securities?.length || 0)}
                </h3>
              </div>
              <div className="p-3 bg-cyan-50 text-cyan-600 rounded-xl">
                <Clock size={20} />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">Accounts waiting for verification</p>
          </div>

          <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Modules</p>
                <h3 className="text-3xl font-extrabold text-purple-600 mt-1">7</h3>
              </div>
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                <Briefcase size={20} />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">System features operational</p>
          </div>

          <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">System Security</p>
                <h3 className="text-3xl font-extrabold text-emerald-600 mt-1">Active</h3>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <Shield size={20} />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">Role-based access is enforced</p>
          </div>
        </div>

        {/* Pending Approval Requests Container */}
        <div className="mb-10 bg-white/70 backdrop-blur-md border border-gray-200/85 rounded-3xl p-6 md:p-8 shadow-md animate-slideIn">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="border-l-4 border-cyan-500 pl-3">
              <h3 className="text-xl font-bold text-gray-800">Registration Approvals</h3>
              <p className="text-xs text-gray-400 mt-0.5">Approve or reject new registration requests</p>
            </div>
            <button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-cyan-500/20 active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={14} className={`${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh List'}</span>
            </button>
          </div>

          {/* Tab Buttons */}
          <div className="flex flex-wrap gap-2 p-1.5 bg-gray-100 rounded-2xl mb-6 max-w-lg">
            <button
              onClick={() => setActiveTab('user')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeTab === 'user'
                  ? 'bg-white text-cyan-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-white/40'
              }`}
            >
              <Users size={14} />
              <span>Residents</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                pending.users?.length > 0 
                  ? 'bg-cyan-500 text-white animate-pulse' 
                  : 'bg-gray-300 text-gray-600'
              }`}>
                {pending.users?.length || 0}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('worker')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeTab === 'worker'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-white/40'
              }`}
            >
              <Briefcase size={14} />
              <span>Workers</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                pending.workers?.length > 0 
                  ? 'bg-purple-500 text-white animate-pulse' 
                  : 'bg-gray-300 text-gray-600'
              }`}>
                {pending.workers?.length || 0}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeTab === 'security'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-white/40'
              }`}
            >
              <Shield size={14} />
              <span>Security</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                pending.securities?.length > 0 
                  ? 'bg-indigo-500 text-white animate-pulse' 
                  : 'bg-gray-300 text-gray-600'
              }`}>
                {pending.securities?.length || 0}
              </span>
            </button>
          </div>

          {/* Tab Content */}
          {activeList.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 bg-gray-50 border border-dashed border-gray-200 rounded-3xl text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-3">
                <CheckCircle size={28} />
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-0.5">All Caught Up!</h4>
              <p className="text-gray-400 max-w-sm text-xs">
                No pending approval requests in this category. All registrations are processed.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeList.map(item => (
                <div 
                  key={item._id} 
                  className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:scale-[1.01] hover:border-cyan-500/20 transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
                        {item.name ? item.name.charAt(0).toUpperCase() : '?'}
                      </div>
                      <div className="ml-3 overflow-hidden">
                        <h4 className="font-bold text-gray-800 text-sm truncate" title={item.name}>{item.name}</h4>
                        <p className="text-[10px] text-gray-400 truncate" title={item.email}>{item.email}</p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-3 mb-4 border border-gray-200/50">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-400">Role:</span>
                        <span className="font-semibold text-gray-700 capitalize bg-white px-2 py-0.5 rounded-full border border-gray-200 text-[10px]">
                          {item.role || activeTab}
                        </span>
                      </div>
                      {item.houseNo && (
                        <div className="flex justify-between items-center text-xs mt-2 pt-2 border-t border-gray-200/30">
                          <span className="text-gray-400">House No:</span>
                          <span className="font-bold text-cyan-600 bg-cyan-50 px-2.5 py-0.5 rounded-full">
                            {item.houseNo}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2.5 border-t border-gray-100 pt-3.5">
                    <button 
                      onClick={() => handleReject(activeTab, item._id)}
                      className="flex-1 flex items-center justify-center gap-1 py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer border border-rose-100"
                    >
                      <X size={12} />
                      <span>Reject</span>
                    </button>
                    <button 
                      onClick={() => handleApprove(activeTab, item._id)}
                      className="flex-1 flex items-center justify-center gap-1 py-2 px-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer shadow-sm shadow-emerald-500/10"
                    >
                      <Check size={12} />
                      <span>Approve</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </>
    )}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <Link
          key={card.title}
          to={card.href}
          className={`${card.bg}/50 h-60 text-white p-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 hover:ring-2 hover:ring-cyan-300 transition-all duration-300 cursor-pointer bg-cover bg-center relative overflow-hidden animate-slideIn`}
          onClick={card.onClick}
          style={{ backgroundImage: `url(${card.image})`, animationDelay: `${index * 0.1}s` }}
        >
          <div className="absolute inset-0 bg-black/30 hover:bg-black/50 hover:backdrop-blur-md transition-all duration-300"></div>
          <div className="absolute inset-0  duration-300"></div>
          <div className="absolute top-4 left-4 ">{card.icon}</div>
          <div className="relative z-10 mt-8">
            <h3
              className="text-3xl font-semibold hover:text-3xl hover:shadow-glow transition-all duration-300"
            >
              {card.title}
            </h3>
            <p
              className="text-lg mt-1"
              style={{ textShadow: '1px 1px 3px rgba(0, 0, 0, 0.7)' }}
            >
              {card.description}
            </p>
          </div>
        </Link>
      ))}
    </div>
  </div> : "Loading..."}
    </>
  );
};

export default DashboardContent;
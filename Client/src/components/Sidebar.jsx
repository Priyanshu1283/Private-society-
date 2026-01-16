import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const [user, setUser] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [isWorker, setisWorker] = useState(false);
  const navigate = useNavigate();
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { path: '/events', label: 'Events', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { path: '/complaints', label: 'Complaints', icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { path: '/ordering', label: 'Ordering', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' },
    { path: '/emergency', label: 'Emergency', icon: 'M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z' },
    { path: '/services', label: 'Services', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { path: '/rent-maintenance', label: 'Rent & Maintenance', icon: 'M12 8c-1.657 0-3 1.343-3 3v2c0 1.657 1.343 3 3 3s3-1.343 3-3v-2c0-1.657-1.343-3-3-3zm0 0v2m-9-2h18M3 12h18' },
    { path: '/security-cams', label: 'Security Cams', icon: 'M21 10.8c0 4.4-3.6 7.8-8 7.8-4.4 0-8-3.6-8-7.8 0-4.4 3.6-7.8 8-7.8 4.4 0 8 3.6 8 7.8zm-8-6.4a6.4 6.4 0 1 1 0 12.8 6.4 6.4 0 0 1 0-12.8zm0 2.4a4 4 0 1 0 0 8 4 4 0 0 0 0-8z' },
    { path: '/visitor-delivery', label: 'Visitor & Delivery', icon: 'M12 18c-2 0-3 1-3 3v2h6v-2c0-2-1-3-3-3zM3 14h18V8H3v6zm3-4h12v2H6v-2z' },
  ];
  useEffect(() => {
    const fn = async () => {
      try {
        const token = localStorage.getItem('token');
        const adminData = localStorage.getItem('admin');
        const storedUser = localStorage.getItem('user');
        const workerData = localStorage.getItem('worker');
        if (workerData) setisWorker(true);
        
        if (token && (storedUser || adminData || workerData)) {
          const userObj = storedUser ? JSON.parse(storedUser) : adminData ? JSON.parse(adminData): JSON.parse(workerData);
          setUser(userObj);
          if (userObj.id) {
            const response = await fetch(`https://societysync-890y.onrender.com/api/me/profile-picture/${userObj.id}`, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`,
              }
            });            
            if (response.ok) {
              const blob = await response.blob();
              setProfilePicture(URL.createObjectURL(blob));
            } else {
              console.error('Error fetching profile picture');
            }
          } else {
            console.error('User does not have an _id');
          }
        } else {
          console.log('No token or user found');
        }
      } catch (error) {
        console.error('Error fetching service requests:', error);
      }
    };
    fn();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('admin');
    localStorage.removeItem('worker');
    navigate("/login");
  };

  return (
    <div className={`fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-gray-50 to-gray-100 shadow-xl p-4 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 md:relative md:w-1/5 md:p-6 md:translate-x-0 z-20 animate-gradientFade`}>
      <style>
        {`
          @keyframes gradientFade {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradientFade {
            background: linear-gradient(135deg, #f9fafb, #e5e7eb, #f9fafb);
            background-size: 200% 200%;
            animation: gradientFade 15s ease infinite;
          }
        `}
      </style>
      <div className="flex items-center justify-between mb-6">
        <span className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">SocietySync</span>
        <button onClick={toggleSidebar} className="md:hidden">
          <svg className="w-6 h-6 text-gray-600 hover:text-cyan-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      <div onClick={() => {
        toggleSidebar();
        navigate("/me");
      }}>
      { user && (
        <div className="mb-6 flex items-center bg-gray-300 hover:bg-gray-500 rounded-lg">
        <div>
          {profilePicture ? (
            <img
              src={profilePicture}
              alt="Profile"
              className="border-2 border-black rounded-full w-12 h-12 hover:ring-2 hover:ring-cyan-300 transition-all duration-200"
            />
          ) : (
            <img
              src="https://placehold.co/600x400"
              alt="Placeholder"
              className="rounded-full w-12 h-12 hover:ring-2 hover:ring-cyan-300 transition-all duration-200"
            />
          )}
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900">{ user.name } , { user.houseNo }</p>
          <p className="text-xs bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">{ user.email }</p>
        </div>
      </div>
      )}
      </div>
      <nav>
        <ul className="flex flex-col space-y-1">
          {!isWorker && navItems.map((item) => (
            <li key={item.label}>
              <Link
                to={item.path}
                onClick={toggleSidebar}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-cyan-100 hover:to-blue-100 rounded-md hover:scale-105 transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-2 text-gray-500 hover:text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path>
                </svg>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <button className='ml-4 px-3 py-1 mt-2 bg-red-500 rounded-xl shodow-xl' onClick={handleLogout}>← logout</button>
    </div>
  );
};

export default Sidebar;
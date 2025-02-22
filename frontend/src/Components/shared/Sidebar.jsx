import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar_Links, Sidebar_Logout } from '../lib/const/Navigation';
import { FaBars } from 'react-icons/fa';

const SideLink = ({ item }) => {
  const { pathname } = useLocation();
  const isActive = pathname === item.path;
  
  return (
    <Link
      to={item.path}
      className={`
        relative flex items-center
        px-4 py-2.5 my-1
        transition-all duration-200 ease-out
        rounded-md group
        ${isActive ? 
          'bg-blue-50 text-blue-600' : 
          'text-gray-600 hover:bg-gray-50'
        }
      `}
    >
      {/* Active indicator */}
      <div
        className={`
          absolute left-0 top-1/2 -translate-y-1/2
          w-1 h-6 rounded-full
          transition-all duration-200
          ${isActive ? 'bg-blue-500' : 'opacity-0'}
        `}
      />
      
      {/* Icon container */}
      <div className={`
        flex items-center justify-center
        w-8 h-8 mr-3
        transition-colors duration-200
        ${isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-500'}
      `}>
        {item.icon}
      </div>

      {/* Label */}
      <span className={`
        text-sm font-medium
        transition-colors duration-200
        ${isActive ? 'text-blue-600' : 'text-gray-700 group-hover:text-blue-600'}
      `}>
        {item.label}
      </span>
    </Link>
  );
};

const LogoutButton = ({ item, onLogout }) => (
  <button
    onClick={onLogout}
    className="
      flex items-center w-full
      px-4 py-2.5
      rounded-md
      transition-all duration-200
      text-gray-600 hover:text-red-600
      hover:bg-red-50
      group
    "
  >
    <div className="flex items-center justify-center w-8 h-8 mr-3 text-gray-500 group-hover:text-red-500">
      {item.icon}
    </div>
    <span className="text-sm font-medium">
      {item.label}
    </span>
  </button>
);

const Sidebar = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      {/* Mobile Header */}
      {isMobile && (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
          <div className="flex items-center h-16 px-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="
                p-2 rounded-lg
                text-gray-600 hover:text-gray-900
                hover:bg-gray-100
                transition-colors duration-200
              "
            >
              <FaBars className="text-xl" />
            </button>
            <span className="ml-4 text-lg font-semibold text-gray-900">
              My Hostel
            </span>
          </div>
        </header>
      )}

      {/* Sidebar Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50
          h-full w-64
          bg-white
          border-r border-gray-200
          transition-transform duration-300 ease-out
          ${isMobile ? 
            (isSidebarOpen ? 'translate-x-0' : '-translate-x-full') : 
            'translate-x-0'
          }
        `}
      >
        {/* Header */}
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          <span className="text-lg font-semibold text-gray-900">
            My Hostel
          </span>
          {isMobile && (
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="
                ml-auto p-2 rounded-lg
                text-gray-500 hover:text-gray-700
                hover:bg-gray-100
                transition-colors duration-200
              "
            >
              ×
            </button>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 h-[42.3rem] overflow-y-auto px-3 py-6">
          <nav>
            {Sidebar_Links.map((item) => (
              <SideLink key={item.key} item={item} />
            ))}
          </nav>
        </div>

        {/* Logout Section */}
        <div className="p-3 border-t border-gray-200">
          {Sidebar_Logout.map((item) => (
            <LogoutButton key={item.key} item={item} onLogout={handleLogout} />
          ))}
        </div>
      </aside>

      {/* Main Content */}
      
    </>
  );
};

export default Sidebar;
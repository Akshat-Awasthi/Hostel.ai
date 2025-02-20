import classNames from 'classnames';
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar_Links, Sidebar_Logout } from '../lib/const/Navigation';
import { FaBars } from 'react-icons/fa';

const ClassLinks = 'flex items-center gap-2 p-3 font-light px-3 rounded-sm text-base hover:no-underline';

function SideLink({ item }) {
  const { pathname } = useLocation();
  return (
    <Link
      to={item.path}
      className={classNames(
        pathname === item.path
          ? 'text-white relative z-10 border-l-[5px] bg-gradient-to-r from-white/10 to-transparent border-l-[5px] border-white rounded-l-md'
          : 'text-slate-300',
        ClassLinks
      )}
      style={{
        backgroundColor: pathname === item.path ? 'transparent' : 'inherit',
        transition: 'background 0.5s cubic-bezier(0.685, 0.0473, 0.346, 1)',
      }}
    >
      <span className="text-xl">{item.icon}</span>
      {item.label}
    </Link>
  );
}

function SideBottom({ item, onClick }) {
  const { pathname } = useLocation();
  return (
    <Link
      to={item.path}
      className={classNames(
        pathname === item.path
          ? 'text-white relative z-10 bg-gradient-to-r from-white/10 to-transparent border-l-[5px] border-white rounded-l-md'
          : 'text-slate-300 hover:bg-gradient-to-r hover:from-white/10 hover:to-transparent hover:border-l-[5px] hover:border-transparent hover:rounded-l-md',
        ClassLinks,
        'font-bold pl-14 text-red-500'
      )}
      style={{
        backgroundColor: pathname === item.path ? 'transparent' : 'inherit',
        transition: 'background 0.5s cubic-bezier(0.685, 0.0473, 0.346, 1)',
      }}
      onClick={item.key === 'logout' ? onClick : undefined}
    >
      <span className="text-2xl">{item.icon}</span>
      {item.label}
    </Link>
  );
}

const Sidebar = () => {
  const navigate = useNavigate();
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
    if (window.innerWidth < 700) {
      setIsSidebarVisible(false);
    } else {
      setIsSidebarVisible(true);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      // Optionally, make a request to the logout endpoint (commented out if not needed)
      // await axios.post('http://localhost:8080/api/v1/auth/logout');

      // Clear the JWT token from localStorage
      localStorage.removeItem('token');

      // Redirect to the login page
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
      // Handle logout failure (e.g., show an error message)
    }
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className=" h-full">
      {/* Top bar for smaller screens */}
      {windowWidth < 900 && (
        <div className="flex flex-row text-black absolute w-[21vw] absolute z-[1000]">
          <button onClick={toggleSidebar} className="text-xl mr-2 ml-2 mt-1">
            <FaBars />
          </button>
          <div className="text-l mt-1">My Hostel</div>
        </div>
      )}

      {/* Sidebar */}
      {windowWidth > 900 && (
        <div
          className={classNames(
            'relative top-0 left-0 h-full bg-blue-950 text-white overflow-hidden transition-transform duration-300 ease-in-out flex flex-col',
            {
              'transform -translate-x-full': !isSidebarVisible && windowWidth < 700,
              'transform translate-x-0': isSidebarVisible || windowWidth >= 700,
            }
          )}
          style={{ minWidth: '16rem' }}
        >
          <div className="flex flex-row m-1 ml-4">
            <span className="text-xl ml-14 mt-2">My-Hostel</span>
          </div>
          
          <div className="flex-1 flex flex-col py-5 gap-0.5 ml-4">
            {Sidebar_Links.map((item) => (
              <SideLink key={item.key} item={item} />
            ))}
          </div>
          <div className="flex flex-col py-3 pt-2 border-t border-gray-500 sticky bottom-0">
            {Sidebar_Logout.map((item) => (
              <SideBottom onClick={handleLogout} key={item.key} item={item} />
            ))}
          </div>
        </div>
      )}

      {windowWidth > 900 ||
        (isSidebarVisible && (
          <div
            className={classNames(
              'absolute top-0 left-0 h-full bg-blue-950 text-white overflow-hidden transition-transform duration-300 ease-in-out flex flex-col',
              {
                'transform -translate-x-full': !isSidebarVisible && windowWidth < 900,
                'transform translate-x-0': isSidebarVisible || windowWidth >= 900,
              }
            )}
            style={{ minWidth: '16rem' }}
          >
            <div className="flex flex-row justify-between m-1 ml-4">
              <span className="text-xl ml-14 mt-2">My-Hostel</span>
              <button
                onClick={() => {
                  setIsSidebarVisible(false);
                }}
                className="text-white-900 p-3 focus:outline-none"
                aria-label="Close sidebar"
              >
                &#x2715; {/* Cross button */}
              </button>
            </div>
           
            <div className="flex-1 flex flex-col py-5 gap-0.5 ml-4">
              {Sidebar_Links.map((item) => (
                <SideLink key={item.key} item={item} />
              ))}
            </div>
            <div className="flex flex-col py-3 pt-2 border-t border-gray-500 sticky bottom-0">
              {Sidebar_Logout.map((item) => (
                <SideBottom onClick={handleLogout} key={item.key} item={item} />
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default Sidebar;

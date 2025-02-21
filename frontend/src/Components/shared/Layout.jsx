import React, { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import { CgProfile } from 'react-icons/cg';
import { MdNotificationsActive } from 'react-icons/md';
import { IoAlertCircle } from 'react-icons/io5';
import ReactMarkdown from 'react-markdown';
import { FaRobot, FaTimes } from 'react-icons/fa';
import { BiSend } from 'react-icons/bi';
import { BsFillChatSquareTextFill } from 'react-icons/bs';

import StudentProfile from '../lib/const/StudentProfile.json';

const { name, hostel: hostelName } = StudentProfile[0];

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [selectedFood, setSelectedFood] = useState('');

  // Fetch food items when component mounts
  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/analytics');
        const data = await response.json();
        // Extract unique food items from analytics data
        const foods = Object.keys(data);
        setFoodItems(foods);
      } catch (error) {
        console.error('Error fetching food items:', error);
      }
    };

    fetchFoodItems();
  }, []);

  const handleAskAI = async () => {
    if (!question.trim()) {
      alert('Please enter a question');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        question,
        food: selectedFood || ''
      };

      const response = await fetch('http://127.0.0.1:5000/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `Server error: ${response.status}`);
      }

      setResponse(data.suggestions);
      setShowDialog(false);
      console.log('AI Response:', data.suggestions);

    } catch (error) {
      console.error('Error details:', error);
      alert('Failed to get response from AI. Please check the console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row bg-white h-screen w-screen fixed overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed lg:relative lg:flex ${
          sidebarOpen ? 'flex' : 'hidden'
        } z-50 bg-white w-64 h-full shadow-lg transition-all duration-300`}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-grow">
        {/* Top Bar */}
        <div className="h-20 pb-[0.7rem] w-full bg-white border-y-[1px] border-gray-200 flex items-center px-2">
          {/* Toggle Sidebar Button (Mobile Only) */}
          <button
            className="text-gray-600 hover:text-gray-400 text-xl lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          <div>
            <button 
              onClick={() => setShowDialog(true)} 
              className='flex items-center gap-2 ml-1 mt-2 text-base rounded-full bg-blue-700 hover:bg-blue-800 text-white cursor-pointer px-3 py-[0.4rem] transition-colors duration-200'
            >
              <FaRobot className="text-lg" />
              <span className='text-sm'>Ask AI</span>
            </button>

            {showDialog && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-xl shadow-2xl w-[500px] max-w-[95vw] transform transition-all duration-300 scale-100">
                  {/* Dialog Header */}
                  <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-t-xl">
                    <div className="flex items-center gap-3">
                      <FaRobot className="text-2xl" />
                      <h2 className="text-xl font-bold">AI Assistant</h2>
                    </div>
                    <button 
                      onClick={() => {
                        setShowDialog(false);
                        setSelectedFood('');
                      }}
                      className="text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-blue-700/50"
                    >
                      <FaTimes />
                    </button>
                  </div>

                  {/* Dialog Content */}
                  <div className="p-6 bg-white">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Select Food Item (Optional)
                        </label>
                        <select
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 
                                     focus:border-blue-500 transition-all bg-white shadow-sm hover:border-blue-400"
                          value={selectedFood}
                          onChange={(e) => setSelectedFood(e.target.value)}
                          disabled={loading}
                        >
                          <option value="">All Food Items</option>
                          {foodItems.map((food) => (
                            <option key={food} value={food}>
                              {food.charAt(0).toUpperCase() + food.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Your Question
                        </label>
                        <textarea 
                          className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 
                                     focus:ring-blue-500 focus:border-blue-500 transition-all resize-none 
                                     bg-white shadow-sm hover:border-blue-400"
                          placeholder="Ask about food quality, nutrition, suggestions for improvement..."
                          value={question}
                          onChange={(e) => setQuestion(e.target.value)}
                          disabled={loading}
                        />
                      </div>

                      <div className="flex justify-end gap-3 pt-4">
                        <button 
                          onClick={() => {
                            setShowDialog(false);
                            setSelectedFood('');
                          }}
                          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 
                                     transition-colors font-medium shadow-sm hover:shadow"
                          disabled={loading}
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={handleAskAI}
                          className={`flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 
                                     text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all 
                                     font-medium shadow-sm hover:shadow-md ${
                            loading ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                              <span>Processing...</span>
                            </>
                          ) : (
                            <>
                              <BiSend className="text-lg" />
                              <span>Ask AI</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Side Icons and Info */}
          <div className="ml-auto flex items-center gap-5 mb-2 mt-2">
            {/* Notifications */}
            <Link
              className="text-gray-600 hover:text-gray-400 text-xl"
              to="/notifications"
            >
              <MdNotificationsActive />
            </Link>

            {/* Alerts */}
            <Link
              className="text-gray-600 hover:text-gray-400 text-xl"
              to="/alerts"
            >
              <IoAlertCircle />
            </Link>

            {/* User Info */}
            <div className="flex items-center gap-2">
              <div className="flex flex-col text-right leading-tight">
                <span className="block text-xs font-semibold">{name}</span>
                <span className="block text-[12px] text-gray-600">
                  {hostelName}
                </span>
              </div>
              <Link
                className="text-gray-600 hover:text-gray-400 text-[35px]"
                to="/profile"
              >
                <CgProfile />
              </Link>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-grow overflow-auto p-4 bg-white">
          <Outlet />
        </div>
      </div>

      {/* Enhanced AI Response Box */}
      {response && (
        <div className="fixed bottom-4 right-4 max-w-xl w-full bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 ease-in-out hover:shadow-3xl">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <BsFillChatSquareTextFill className="text-xl" />
              <h3 className="font-semibold text-lg">
                AI Response {selectedFood && (
                  <span className="text-blue-200">for {selectedFood}</span>
                )}
              </h3>
            </div>
            <button 
              onClick={() => setResponse(null)}
              className="text-white hover:text-blue-200 transition-colors p-2 rounded-full hover:bg-blue-700/50"
            >
              <FaTimes />
            </button>
          </div>
          <div className="p-6 bg-gradient-to-b from-blue-50 to-white">
            <div className="prose prose-sm max-h-[60vh] overflow-y-auto custom-markdown 
                            scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-50 
                            hover:scrollbar-thumb-blue-300 pr-4">
              <ReactMarkdown 
                className="space-y-4 text-gray-700"
              >
                {response}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Update styles for markdown content
const styles = `
.custom-markdown {
  @apply space-y-6;
  
  h2 {
    @apply text-xl font-bold text-blue-700 border-b border-blue-100 pb-2 mb-4;
  }
  
  ul {
    @apply space-y-2 pl-4;
  }
  
  li {
    @apply relative pl-6;
  }
  
  li:before {
    @apply absolute left-0 text-blue-500 font-bold;
    content: "•";
  }
  
  strong {
    @apply text-blue-700 font-semibold;
  }
  
  p {
    @apply leading-relaxed text-gray-700;
  }

  .emoji {
    @apply text-xl inline-block align-middle mr-2;
  }

  section {
    @apply my-6 p-4 bg-blue-50/50 rounded-lg;
  }
}

.scrollbar-thin {
  scrollbar-width: thin;
}
`;

export default Layout;

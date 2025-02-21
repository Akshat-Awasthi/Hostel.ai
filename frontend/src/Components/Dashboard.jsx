import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, defaults } from 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMessageSquare, FiAlertCircle } from 'react-icons/fi';
import { IoTimeOutline } from 'react-icons/io5';
import { MdOutlineFoodBank, MdOutlineRateReview } from 'react-icons/md';
import WeekFeedback from './lib/const/WeekFeedback.json';
import TodayMenu from './lib/const/TodayMenu.json';

defaults.maintainAspectRatio = false;
defaults.responsive = true;

function Dashboard() {
  const [name, setName] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedMeal, setSelectedMeal] = useState('');
  const navigate = useNavigate();

  // Updated meal time determination
  useEffect(() => {
    const hour = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const time = hour + minutes/60;

    if (time >= 7 && time < 9) {
      setSelectedMeal('Breakfast');
    } else if (time >= 12.5 && time < 13) {
      setSelectedMeal('Lunch');
    } else if (time >= 17 && time < 18) {
      setSelectedMeal('Snacks');
    } else if (time >= 20 && time < 21.5) {
      setSelectedMeal('Dinner');
    } else {
      // Set to next upcoming meal
      if (time < 7) setSelectedMeal('Breakfast');
      else if (time < 12.5) setSelectedMeal('Lunch');
      else if (time < 17) setSelectedMeal('Snacks');
      else if (time < 20) setSelectedMeal('Dinner');
      else setSelectedMeal('Breakfast');
    }
  }, [currentTime]);

  useEffect(() => {
    // Fetch name from backend API using token
    const fetchName = async () => {
      const token = localStorage.getItem('token'); // Retrieve token from local storage

      if (!token) {
        console.error('Auth token is missing');
        return;
      }

      try {
        const response = await fetch('http://localhost:8080/api/v1/users/getUser', {
          headers: {
            'Authorization': `Bearer ${token}`, // Include token in Authorization header
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data)
        setName(data.username);
      } catch (error) {
        console.error('Error fetching name:', error);
      }
    };

    fetchName();
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Updated meal status function
  const getMealStatus = (mealTime) => {
    const hour = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const time = hour + minutes/60;

    switch (mealTime) {
      case 'Breakfast':
        return time >= 7 && time < 9 ? 'Active Now' : time < 7 ? 'Coming Up' : 'Ended';
      case 'Lunch':
        return time >= 12.5 && time < 13 ? 'Active Now' : time < 12.5 ? 'Coming Up' : 'Ended';
      case 'Snacks':
        return time >= 17 && time < 18 ? 'Active Now' : time < 17 ? 'Coming Up' : 'Ended';
      case 'Dinner':
        return time >= 20 && time < 21.5 ? 'Active Now' : time < 20 ? 'Coming Up' : 'Ended';
      default:
        return 'Coming Up';
    }
  };

  // Helper function to format time range
  const getMealTimeRange = (meal) => {
    switch (meal) {
      case 'Breakfast':
        return '7:00 AM - 9:00 AM';
      case 'Lunch':
        return '12:30 PM - 1:00 PM';
      case 'Snacks':
        return '5:00 PM - 6:00 PM';
      case 'Dinner':
        return '8:00 PM - 9:30 PM';
      default:
        return '';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active Now':
        return 'bg-green-100 text-green-700';
      case 'Coming Up':
        return 'bg-blue-100 text-blue-700';
      case 'Ended':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Main Grid Layout */}
      <div className="grid grid-cols-12 gap-4 p-4">
        {/* Header Section - Spans full width */}
        <div className="col-span-12 bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center">
                <FiUser className="text-2xl text-white" />
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-0.5">{getGreeting()}</div>
                <h1 className="text-lg font-bold text-gray-900">{"Akshat Awasthi"|| 'Loading...'}</h1>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="px-3 py-1.5 bg-purple-50 rounded-lg flex items-center gap-1.5">
                <IoTimeOutline className="text-purple-600 text-sm" />
                <span className="text-purple-600 text-xs font-medium">
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <button 
                onClick={() => navigate('/profile')}
                className="px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg hover:bg-gray-800 transition-colors"
              >
                View Profile
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats - 3 Cards */}
        <div className="col-span-12 grid grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-2xl text-white">
            <MdOutlineFoodBank className="text-2xl mb-2" />
            <div className="text-xs opacity-90 mb-1">Today's Meals Served</div>
            <div className="text-2xl font-bold">1,234</div>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-2xl text-white">
            <MdOutlineRateReview className="text-2xl mb-2" />
            <div className="text-xs opacity-90 mb-1">Feedback Received</div>
            <div className="text-2xl font-bold">89%</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-violet-600 p-4 rounded-2xl text-white">
            <IoTimeOutline className="text-2xl mb-2" />
            <div className="text-xs opacity-90 mb-1">Menu Items Today</div>
            <div className="text-2xl font-bold">24</div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="col-span-8 space-y-4">
          {/* Current Menu Card */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-bold text-gray-900">Today's Menu</h2>
              <div className="flex gap-2">
                {['Breakfast', 'Lunch', 'Snacks', 'Dinner'].map((meal) => (
                  <button 
                    key={meal}
                    onClick={() => setSelectedMeal(meal)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                      ${meal === selectedMeal 
                        ? 'bg-violet-100 text-violet-700' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    {meal}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Current Meal Display */}
            <div className="bg-gray-50 rounded-xl p-5 mb-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">{selectedMeal}</h3>
                  <p className="text-xs text-gray-600">
                    {getMealTimeRange(selectedMeal)}
                  </p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(getMealStatus(selectedMeal))}`}>
                  {getMealStatus(selectedMeal)}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {TodayMenu
                  .filter(item => item.time === selectedMeal)
                  .map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="text-xs font-medium text-gray-900">Main Course</div>
                      <ul className="space-y-1.5 text-xs text-gray-600">
                        <li>{item.item1}</li>
                        <li>{item.item2}</li>
                        <li>{item.item3}</li>
                      </ul>
                    </div>
                  ))}
              </div>
            </div>

            {/* Next Meals Preview */}
            <div className="grid grid-cols-3 gap-3">
              {['Breakfast', 'Lunch', 'Dinner']
                .filter(meal => meal !== selectedMeal)
                .map((meal, index) => (
                  <div key={meal} 
                    className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => setSelectedMeal(meal)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-medium text-gray-900">{meal}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(getMealStatus(meal))}`}>
                        {getMealStatus(meal)}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-600">
                      {getMealTimeRange(meal)}
                    </p>
                  </div>
                ))}
            </div>
          </div>

          {/* Feedback Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-bold text-gray-900">Feedback Trends</h2>
              <select className="px-3 py-1.5 bg-gray-100 rounded-lg text-xs font-medium">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
              </select>
            </div>
            <div className="h-[250px]">
              <Line
                data={{
                  labels: WeekFeedback.map((data) => data.label),
                  datasets: [
                    {
                      label: 'Positive',
                      data: WeekFeedback.map((data) => data.Positive),
                      borderColor: '#8b5cf6',
                      backgroundColor: 'rgba(139, 92, 246, 0.1)',
                      fill: true,
                      tension: 0.4,
                    },
                    {
                      label: 'Negative',
                      data: WeekFeedback.map((data) => data.Negative),
                      borderColor: '#ef4444',
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      fill: true,
                      tension: 0.4,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        font: {
                          size: 11
                        }
                      }
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        font: {
                          size: 10
                        }
                      }
                    },
                    x: {
                      ticks: {
                        font: {
                          size: 10
                        }
                      }
                    }
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="col-span-4 space-y-4">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h2 className="text-sm font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full p-3 bg-violet-600 text-white text-xs rounded-lg hover:bg-violet-700 transition-colors flex items-center justify-center gap-2">
                <FiMessageSquare className="text-sm" />
                Submit Feedback
              </button>
              <button className="w-full p-3 bg-gray-100 text-gray-700 text-xs rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                <FiAlertCircle className="text-sm" />
                Report Issue
              </button>
            </div>
          </div>

          {/* Updated Meal Schedule */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h2 className="text-sm font-bold text-gray-900 mb-4">Meal Schedule</h2>
            <div className="space-y-3">
              {['Breakfast', 'Lunch', 'Snacks', 'Dinner'].map((meal) => (
                <div key={meal} 
                  className="flex justify-between items-center text-xs hover:bg-gray-50 p-2 rounded-lg cursor-pointer"
                  onClick={() => setSelectedMeal(meal)}
                >
                  <span className="text-gray-600">{meal}</span>
                  <span className="font-medium text-gray-900">
                    {getMealTimeRange(meal)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

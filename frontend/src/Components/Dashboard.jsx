import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, defaults } from 'chart.js/auto';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { PiHandWavingFill } from 'react-icons/pi';
import { Link, useNavigate } from 'react-router-dom';
import Rightbar from './Rightbar';
import WeekFeedback from './lib/const/WeekFeedback.json';
import TodayMenu from './lib/const/TodayMenu.json';
import P5Sketch from './Animation/P5Sketch';

defaults.maintainAspectRatio = false;
defaults.responsive = true;
defaults.plugins.title.display = true;
defaults.plugins.title.align = 'start';
defaults.plugins.title.font.size = 16;
defaults.plugins.title.color = 'black';

function Dashboard() {
  const [name, setName] = useState(''); // State to store the fetched name
  const [LoadingTime, setLoadingTime] = useState(false);
  const navigate = useNavigate();

  const handleButton = () => {
    setLoadingTime(true);
    navigate('/FoodCards');
  };

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

  const colors = ['bg-purple-200', 'bg-blue-200', 'bg-blue-100', 'bg-green-200'];

  return (
    <div className="flex flex-col lg:flex-row lg:justify-between p-3 min-h-screen gap-4">
      <div className="flex flex-col gap-6 w-full lg:w-3/4 bg-gradient-to-r from-blue-100 to-purple-100 px-6 py-4 rounded-lg shadow-lg">
        <div className="flex flex-row items-center text-lg font-semibold text-gray-700">
          <div className="text-2xl pr-2">
            <PiHandWavingFill />
          </div>
          <h1>Welcome {name}!</h1>
        </div>

        {/* Today's Menu */}
        <div className="p-6 rounded-lg bg-white shadow-md">
          <div className="flex flex-row justify-between items-center border-b pb-2 mb-2">
            <h2 className="text-lg font-bold text-gray-700">Today's Menu</h2>
            <Link to="/Menu" className="text-blue-600 hover:underline">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TodayMenu.map((item, index) => (
              <div key={item.time} className={`p-4 rounded-md ${colors[index % colors.length]} shadow-md`}>
                <ul className="space-y-2">
                  <li className="font-bold text-lg">{item.time}</li>
                  <li>{item.item1}</li>
                  <li>{item.item2}</li>
                  <li>{item.item3}</li>
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Sentiment Analysis */}
        <div className="p-6 rounded-lg bg-white shadow-md flex justify-between">
          <div className=''>
          <h2 className="text-lg font-bold mb-4 text-gray-700 w-full">Sentiment Analysis</h2>
            <button
              onClick={handleButton}
              className={`px-4 py-2 ml-2 bg-blue-500 text-white font-medium rounded-lg shadow-md hover:bg-blue-600 focus:ring-2 ${
                LoadingTime ? 'cursor-progress' : 'cursor-pointer'
              } transition duration-300`}
            >
              Press to Analyse <span className="ml-2">→</span>
            </button>
          </div>
          <div className="flex flex-col items-center justify-between gap-1">
            <button className="text-xs w-full sm:w-28 h-6 font-semibold text-white bg-green-500 px-2 rounded-2xl hover:bg-white hover:text-green-500 hover:border-green-500 transition duration-300">
              Positive
            </button>
            <P5Sketch />
            <button className="text-xs w-full sm:w-28 h-6 font-semibold text-white bg-red-500 px-2 rounded-2xl hover:bg-white hover:text-red-500 hover:border-red-500 transition duration-300">
              Negative
            </button>
          </div>
          
          <div className='w-56 flex bg-slate-200 p-3 rounded-lg'><p className='text-xs text-gray-600 '>Click here to view the sentiment analysis of mess food. Get a detailed report with overall feedback, individual comments, key insights, and trends over time.</p></div>
          
        </div>
        <div className='flex gap-4'>
        <div className="p-6 w-1/2 flex flex-col justify-center items-center rounded-lg bg-white shadow-md">
          <div className="flex gap-28">
            <h2 className="text-lg font-bold text-gray-700">Weekly Feedback</h2>
            <Link to="/chart" className="text-blue-600 hover:underline text-xs mt-[6px]">
              Click Here
            </Link>
          </div>
          <div className="w-[20rem] h-56">
            <Line
              data={{
                labels: WeekFeedback.map((data) => data.label),
                datasets: [
                  {
                    label: 'Positive',
                    data: WeekFeedback.map((data) => data.Positive),
                    borderColor: '#64b5f6',
                    tension: 0.7,
                  },
                  {
                    label: 'Negative',
                    data: WeekFeedback.map((data) => data.Negative),
                    borderColor: '#ef5350',
                    tension: 0.7,
                  },
                ],
              }}
            />
          </div>
        </div>
        <div className="flex flex-col gap-4 overflow-y-scroll w-1/2">
        <div className="p-6 rounded-lg bg-white shadow-md flex-1">
            <h1 className="text-lg font-semibold mb-4 text-gray-700">Give your Feedback</h1>
            <button className="flex items-center px-4 py-2 bg-blue-500 text-white font-medium rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-green-300">
              Click here to proceed
              <span className="ml-2">→</span>
            </button>
          </div>
          <div className="p-6 rounded-lg bg-white shadow-md flex-1">
            <h1 className="text-lg font-semibold mb-4 text-gray-700">Write a Complaint</h1>
            <button className="flex items-center px-4 py-2 bg-blue-500 text-white font-medium rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300">
              Click here to proceed
              <span className="ml-2">→</span>
            </button>
          </div>
          
        </div>
        </div>
        {/* Weekly Feedback Chart */}
        
      </div>
      

      {/* Right Sidebar */}
      <div className="lg:w-1/4 ">
        <Rightbar />
      </div>
    </div>
  );
}

export default Dashboard;

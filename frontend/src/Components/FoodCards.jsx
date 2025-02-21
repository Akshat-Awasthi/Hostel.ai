import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FoodCards = () => {
  const [analytics, setAnalytics] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:5000/analytics', {
          headers: {
            "Content-Type": "application/json",
          }
        });
        setAnalytics(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const sortedAnalytics = Object.entries(analytics)
    .map(([food, { positive_percentage, negative_percentage }]) => ({
      food,
      positive_percentage,
      negative_percentage,
    }))
    .sort((a, b) => b.negative_percentage - a.negative_percentage);

  const filteredFoods = sortedAnalytics.filter(item =>
    item.food.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (negative_percentage) => {
    if (negative_percentage > 60) return 'red';
    if (negative_percentage > 30) return 'yellow';
    return 'green';
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Food Analytics Dashboard</h1>
        <p className="text-sm text-gray-600">Monitor and analyze food quality feedback</p>
      </div>
      
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-xl">
          <input
            type="text"
            placeholder="Search food items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 text-sm border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200"
          />
          <svg
            className="absolute left-3 top-3 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredFoods.map(({ food, positive_percentage, negative_percentage }) => (
            <div
              key={food}
              className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-medium capitalize text-gray-800">{food}</h2>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${getStatusColor(negative_percentage) === 'red' ? 'bg-red-100 text-red-800' : 
                    getStatusColor(negative_percentage) === 'yellow' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-green-100 text-green-800'}`}>
                    {negative_percentage > 60 ? 'Critical' : 
                     negative_percentage > 30 ? 'Warning' : 'Good'}
                  </span>
                </div>
                
                <div className="space-y-3">
                  {/* Positive Reviews Bar */}
                  <div className="relative">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium text-gray-600">Positive Reviews</span>
                      <span className="font-semibold text-green-600">{positive_percentage.toFixed(1)}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-gray-100">
                      <div
                        style={{ width: `${positive_percentage}%` }}
                        className="h-1.5 rounded-full bg-green-500 transition-all duration-500"
                      ></div>
                    </div>
                  </div>

                  {/* Negative Reviews Bar */}
                  <div className="relative">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium text-gray-600">Negative Reviews</span>
                      <span className="font-semibold text-red-600">{negative_percentage.toFixed(1)}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-gray-100">
                      <div
                        style={{ width: `${negative_percentage}%` }}
                        className="h-1.5 rounded-full bg-red-500 transition-all duration-500"
                      ></div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/analytics/${food}`)}
                  className="mt-4 w-full bg-white text-sm font-medium text-blue-600 py-2 px-4 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                >
                  View Analysis
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredFoods.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No food items found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search terms</p>
        </div>
      )}
    </div>
  );
};

export default FoodCards;

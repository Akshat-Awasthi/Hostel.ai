import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FoodCards = () => {
  const [analytics, setAnalytics] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:5000/analytics',{
          headers: {
            "Content-Type": "application/json",
          }
        });
        setAnalytics(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAnalytics();
  }, []);

  // Convert analytics object to an array and sort by negative_percentage descending
  const sortedAnalytics = Object.entries(analytics)
    .map(([food, { positive_percentage, negative_percentage }]) => ({
      food,
      positive_percentage,
      negative_percentage,
    }))
    .sort((a, b) => b.negative_percentage - a.negative_percentage);

  // Filter by search term
  const filteredFoods = sortedAnalytics.filter(item =>
    item.food.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search Food..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full"
        />
      </div>

      {/* Food Cards */}
      <div className="grid grid-cols-3 gap-4 ">
        {filteredFoods.map(({ food, positive_percentage, negative_percentage }) => (
          <div key={food} className="border rounded shadow p-4 bg-gradient-to-r from-[#E1D2FF] to-[#BAE5F5]">
            <h2 className="text-xl font-bold mb-2 capitalize">{food}</h2>
            <p>Positive Reviews: {positive_percentage.toFixed(2)}%</p>
            <p>Negative Reviews: {negative_percentage.toFixed(2)}%</p>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => navigate(`/analytics/${food}`)}
            >
              View Negative Reviews
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodCards;

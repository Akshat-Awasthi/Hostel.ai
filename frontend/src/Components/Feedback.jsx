import React, { useState, useEffect } from 'react';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import axios from 'axios';
import MessMenu from './lib/const/MessMenu.json';

const Feedback = () => {
  const [mealDay, setMealDay] = useState('');
  const [mealTime, setMealTime] = useState('');
  const [mealItem, setMealItem] = useState('');
  const [review, setReview] = useState('');
  const [mealData, setMealData] = useState([]);
  const [mealTimes, setMealTimes] = useState([]);
  const [mealItems, setMealItems] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Fetch unique meal days from MessMenu.json on component mount
  useEffect(() => {
    const days = MessMenu.map((day) => day.day);
    setMealData(days);
  }, []);

  // Fetch meal times based on selected day
  useEffect(() => {
    if (mealDay) {
      const dayData = MessMenu.find((day) => day.day === mealDay);
      if (dayData && dayData.meals) {
        const times = dayData.meals.map((meal) => meal.time);
        setMealTimes(times);
      } else {
        setMealTimes([]);
      }
      setMealTime('');
      setMealItem('');
      setMealItems([]);
    } else {
      setMealTimes([]);
      setMealTime('');
      setMealItem('');
      setMealItems([]);
    }
  }, [mealDay]);

  // Fetch meal items based on selected day and time
  useEffect(() => {
    if (mealDay && mealTime) {
      const dayData = MessMenu.find((day) => day.day === mealDay);
      if (dayData && dayData.meals) {
        const mealData = dayData.meals.find((meal) => meal.time === mealTime);
        if (mealData && mealData.items) {
          setMealItems(mealData.items);
        } else {
          setMealItems([]);
        }
      } else {
        setMealItems([]);
      }
      setMealItem('');
    } else {
      setMealItems([]);
      setMealItem('');
    }
  }, [mealDay, mealTime]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mealDay || !mealTime || !mealItem || !review) {
      alert('Please fill in all fields.');
      return;
    }
    try {
      const res = await axios.post('http://127.0.0.1:5000/reviews', {
        day: mealDay,
        time: mealTime,
        food: mealItem,
        review: review,
      });
      console.log(res.data);
      alert('Review submitted successfully!');
      handleReset();
    } catch (error) {
      console.error(error);
      alert('Error submitting review');
    }
  };

  const handleReset = () => {
    setMealDay('');
    setMealTime('');
    setMealItem('');
    setReview('');
    setShowModal(false);
  };

  const SelectField = ({ label, value, onChange, options, disabled = false }) => (
    <div className="space-y-3">
      <label className="text-xs uppercase tracking-wider font-medium text-gray-600 block pl-1">
        {label}
      </label>
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm 
                 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent
                 disabled:bg-gray-50 disabled:cursor-not-allowed transition duration-200
                 hover:border-blue-200"
      >
        <option value="">{`Select ${label}`}</option>
        {options.map((option, idx) => (
          <option key={idx} value={typeof option === 'string' ? option : option.value}>
            {typeof option === 'string' ? option : option.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-12 space-y-12">
          {/* Header with more spacing */}
          <div className="text-center space-y-4 mb-8">
            <h2 className="text-4xl font-light text-gray-800">
              Food <span className="font-bold text-blue-600">Feedback</span>
            </h2>
            <p className="text-sm text-gray-500 tracking-wide">
              Help us enhance your dining experience with your valuable feedback
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Increased gap between grid items */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <SelectField
                label="Meal Day"
                value={mealDay}
                onChange={(e) => setMealDay(e.target.value)}
                options={mealData}
              />
              
              <SelectField
                label="Meal Time"
                value={mealTime}
                onChange={(e) => setMealTime(e.target.value)}
                options={mealTimes}
                disabled={!mealDay}
              />
              
              <SelectField
                label="Meal Item"
                value={mealItem}
                onChange={(e) => setMealItem(e.target.value)}
                options={mealItems}
                disabled={!mealTime}
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs uppercase tracking-wider font-medium text-gray-600 block pl-1">
                Your Review
              </label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share your dining experience..."
                className="w-full px-6 py-4 bg-white border border-gray-200 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent
                         transition duration-200 min-h-[160px] hover:border-blue-200
                         placeholder:text-gray-400 placeholder:text-sm"
              />
            </div>

            <div className="flex justify-end items-center space-x-6 pt-6">
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="px-8 py-3 text-sm font-medium text-gray-600 border border-gray-300 
                         rounded-lg hover:bg-gray-50 transition-colors duration-200 
                         focus:outline-none focus:ring-2 focus:ring-gray-200
                         flex items-center gap-3"
              >
                <AiOutlineClose className="w-4 h-4" />
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3 text-sm font-medium text-white bg-blue-600 
                         rounded-lg hover:bg-blue-700 transition-colors duration-200
                         focus:outline-none focus:ring-2 focus:ring-blue-600
                         flex items-center gap-3"
              >
                <AiOutlineCheck className="w-4 h-4" />
                Submit Feedback
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal with more padding */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-8 space-y-6">
            <h3 className="text-xl font-medium text-gray-800">
              Reset Form?
            </h3>
            <p className="text-sm text-gray-500">
              Are you sure you want to clear all entered information?
            </p>
            <div className="flex justify-end space-x-4 pt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2.5 text-sm font-medium text-gray-600 border border-gray-300 
                         rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-2.5 text-sm font-medium text-white bg-red-500 
                         rounded-lg hover:bg-red-600 transition-colors duration-200"
              >
                Reset Form
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feedback;
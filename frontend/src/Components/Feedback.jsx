import React, { useState, useEffect } from 'react';
import MessMenu from './lib/const/MessMenu.json';
import axios from 'axios';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa'; // Import like and dislike icons

const Feedback = () => {
  // State variables for form inputs
  const [mealDay, setMealDay] = useState('');
  const [mealTime, setMealTime] = useState('');
  const [mealItem, setMealItem] = useState('');
  const [review, setReview] = useState('');

  // State variables for dropdown options
  const [mealData, setMealData] = useState([]); // List of days
  const [mealTimes, setMealTimes] = useState([]); // List of times based on selected day
  const [mealItems, setMealItems] = useState([]); // List of items based on selected day and time

  // State variables for like/dislike (optional enhancement)
  const [like, setLike] = useState(false);
  const [dislike, setDislike] = useState(false);

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
      // Reset dependent fields
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
      // Reset dependent field
      setMealItem('');
    } else {
      setMealItems([]);
      setMealItem('');
    }
  }, [mealDay, mealTime]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
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
        like: like,
        dislike: dislike
      });
      console.log(res.data);
      alert('Review submitted successfully!');
      // Reset form
      setMealDay('');
      setMealTime('');
      setMealItem('');
      setReview('');
      setLike(false);
      setDislike(false);
    } catch (error) {
      console.error(error);
      alert('Error submitting review');
    }
  };

  // Handle form reset
  const handleReset = () => {
    setMealDay('');
    setMealTime('');
    setMealItem('');
    setReview('');
    setLike(false);
    setDislike(false);
  };

  // Handle like button click
  const handleLike = () => {
    setLike(!like);
    if (dislike && like) {
      setDislike(false);
    }
  };

  // Handle dislike button click
  const handleDislike = () => {
    setDislike(!dislike);
    if (like && dislike) {
      setLike(false);
    }
  };

  return (
    <div className="flex justify-between">
      {/* Feedback Form */}
      <div className="relative w-full md:w-2/3 mx-auto top-6 p-8 md:p-12 bg-gradient-to-r from-[#E1D2FF] to-[#BAE5F5] rounded-lg shadow-lg">
        <div>
          <h3 className="text-2xl text-center text-black font-bold mb-2">
            Food Feedback Form
          </h3>
          <h3 className="text-base text-center text-[#0C1E33A0] mb-4">
            Your Feedback Matters A Lot!
          </h3>
        </div>
        <div className="max-w-[28rem] mx-auto p-6 md:p-12 bg-white rounded-lg shadow-lg">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Meal Day */}
            <div className="flex flex-col">
              <label className="text-[#000000B3] mb-2 font-bold">Meal Day</label>
              <select
                value={mealDay}
                onChange={(e) => setMealDay(e.target.value)}
                className="p-2 rounded-md border border-[#0000001A] shadow-md"
              >
                <option value="">Select Meal Day</option>
                {mealData.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            {/* Meal Time */}
            <div className="flex flex-col">
              <label className="text-[#000000B3] mb-2 font-bold">Meal Time</label>
              <select
                value={mealTime}
                onChange={(e) => setMealTime(e.target.value)}
                className="p-2 rounded-md border border-[#0000001A] shadow-md"
                disabled={!mealDay}
              >
                <option value="">Select Meal Time</option>
                {mealTimes.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            {/* Meal Item */}
            <div className="flex flex-col">
              <label className="text-[#000000B3] mb-2 font-bold">Meal Item</label>
              <select
                value={mealItem}
                onChange={(e) => setMealItem(e.target.value)}
                className="p-2 rounded-md border border-[#0000001A] shadow-md"
                disabled={!mealTime}
              >
                <option value="">Select Meal Item</option>
                {mealItems.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Review */}
            <div className="flex flex-col">
              <label className="text-[#000000B3] mb-2 font-bold">Share Your Review</label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Add your review..."
                className="p-2 rounded-md border border-[#0000001A] shadow-md min-h-[100px]"
              />
            </div>

            {/* Like/Dislike */}
            
            {/* Buttons */}
            <div className="flex justify-end mt-6 gap-4">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 text-[#3b82f6] font-bold border border-[#3b82f6] rounded-md hover:bg-[#3b82f6] hover:text-white transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-white bg-[#3b82f6] rounded-md hover:bg-[#2563eb] transition-colors duration-200"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Feedback;

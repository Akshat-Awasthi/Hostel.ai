import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const FoodDetails = () => {
  const { foodItem } = useParams();
  const [negativeReviews, setNegativeReviews] = useState([]);

  useEffect(() => {
    const fetchNegativeReviews = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:5000/analytics/${foodItem}`);
        setNegativeReviews(res.data.negative_reviews || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchNegativeReviews();
  }, [foodItem]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 capitalize">Negative Reviews for {foodItem}</h2>
      {negativeReviews.length === 0 ? (
        <p>No negative reviews available.</p>
      ) : (
        <ul className="list-disc list-inside">
          {negativeReviews.map((review, index) => (
            <li key={index} className="mb-2">{review}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FoodDetails;

import React, { useState } from 'react';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import axios from 'axios';

const LeaveForm = () => {
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveDate, setLeaveDate] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !rollNumber || !leaveReason || !leaveDate) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const res = await axios.post('http://127.0.0.1:5000/leave', {
        name,
        roll_number: rollNumber,
        reason: leaveReason,
        date: leaveDate,
      });
      console.log(res.data);
      alert('Leave request submitted successfully!');
      handleReset();
    } catch (error) {
      console.error(error);
      alert('Error submitting leave request');
    }
  };

  const handleReset = () => {
    setName('');
    setRollNumber('');
    setLeaveReason('');
    setLeaveDate('');
    setShowModal(false);
  };

  const InputField = ({ label, value, onChange, type = 'text', placeholder }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
      />
    </div>
  );

  const TextAreaField = ({ label, value, onChange, placeholder }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 min-h-[120px]"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-12 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-light text-gray-800">
              File a <span className="font-bold text-blue-600">Leave Form</span>
            </h2>
            <p className="text-sm text-gray-500 tracking-wide">
              Please fill out the form below to request leave.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-wider font-medium text-gray-600 block pl-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm 
                           focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent
                           transition duration-200 placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs uppercase tracking-wider font-medium text-gray-600 block pl-1">
                Roll Number
              </label>
              <input
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="Enter your roll number"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm 
                           focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent
                           transition duration-200 placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs uppercase tracking-wider font-medium text-gray-600 block pl-1">
                Reason for Leave
              </label>
              <textarea
                value={leaveReason}
                onChange={(e) => setLeaveReason(e.target.value)}
                placeholder="Enter the reason for your leave"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm 
                           focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent
                           transition duration-200 placeholder:text-gray-400 min-h-[120px]"
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs uppercase tracking-wider font-medium text-gray-600 block pl-1">
                Leave Date
              </label>
              <input
                type="date"
                value={leaveDate}
                onChange={(e) => setLeaveDate(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm 
                           focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent
                           transition duration-200 placeholder:text-gray-400"
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
                Submit Leave
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-8 space-y-6">
            <h3 className="text-xl font-medium text-gray-800">Reset Form?</h3>
            <p className="text-sm text-gray-500">
              Are you sure you want to clear all entered information?
            </p>
            <div className="flex justify-end space-x-4 pt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2.5 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-2.5 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors duration-200"
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

export default LeaveForm;
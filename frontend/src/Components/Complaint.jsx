import React, { useState } from 'react';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import axios from 'axios';

const Complaint = () => {
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !topic || !subject || !description) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const res = await axios.post('http://127.0.0.1:5000/complaint', {
        email,
        topic,
        subject,
        description,
      });
      console.log(res.data);
      alert('Complaint submitted successfully!');
      handleReset();
    } catch (error) {
      console.error(error);
      alert('Error submitting complaint');
    }
  };

  const handleReset = () => {
    setEmail('');
    setTopic('');
    setSubject('');
    setDescription('');
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

  const SelectField = ({ label, value, onChange, options }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
      >
        <option value="">{`Select ${label}`}</option>
        {options.map((option, idx) => (
          <option key={idx} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-12 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-light text-gray-800">
              Lodge a <span className="font-bold text-blue-600">Complaint</span>
            </h2>
            <p className="text-sm text-gray-500 tracking-wide">
              Please fill out the form below to lodge your complaint.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-wider font-medium text-gray-600 block pl-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm 
                           focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent
                           transition duration-200 placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs uppercase tracking-wider font-medium text-gray-600 block pl-1">
                Topic
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter the topic of your complaint"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm 
                           focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent
                           transition duration-200 placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs uppercase tracking-wider font-medium text-gray-600 block pl-1">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter the subject of your complaint"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm 
                           focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent
                           transition duration-200 placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs uppercase tracking-wider font-medium text-gray-600 block pl-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your complaint in detail"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm 
                           focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent
                           transition duration-200 placeholder:text-gray-400 min-h-[120px]"
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
                Submit Complaint
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

export default Complaint;
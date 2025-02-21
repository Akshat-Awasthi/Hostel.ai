import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Complaint from './Components/Complaint';
import Dashboard from './Components/Dashboard';
import Feedback from './Components/Feedback';
import Login from './Components/Login';
import Menu from './Components/Menu';
import Profile from './Components/Profile';
import Layout from './Components/shared/Layout';
import Attendence from "./Components/MachineLearning/Attendence"
import LeaveForm from './Components/LeaveForm';
import FoodCards from './Components/FoodCards';
import FoodDetails from './Components/FoodDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/FoodCards" element={<FoodCards />} />
          <Route path="/analytics/:foodItem" element={<FoodDetails />} />
          <Route path="/leaveform" element={<LeaveForm />} />
          <Route path="/complaint" element={<Complaint />} />
          <Route path="/attendence" element={<Attendence/>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

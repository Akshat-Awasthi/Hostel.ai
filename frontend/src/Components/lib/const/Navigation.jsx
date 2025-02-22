import React from 'react';
import { LuLayoutDashboard } from "react-icons/lu";
import { IoRestaurantOutline } from "react-icons/io5";
import { TbStarsFilled } from "react-icons/tb";
import { LuFileSpreadsheet } from "react-icons/lu";
import { IoWarningOutline } from "react-icons/io5";
import { LuCalendarCheck2 } from "react-icons/lu";
import { TbBrain } from "react-icons/tb";
import { LuLogOut } from "react-icons/lu";

export const Sidebar_Links = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    path: '/',
    icon: <LuLayoutDashboard className="text-xl" />  // Modern, clean dashboard icon
  },
  {
    key: 'mess-time-table',
    label: 'Mess Time Table',
    path: '/menu',
    icon: <IoRestaurantOutline className="text-xl" />  // Restaurant/dining icon
  },
  {
    key: 'feedback',
    label: 'Feedback',
    path: '/feedback',
    icon: <TbStarsFilled className="text-xl" />  // Stars icon for feedback
  },
  {
    key: 'leave',
    label: 'Leave Form',
    path: '/leaveform',
    icon: <LuFileSpreadsheet className="text-xl" />  // Form/document icon
  },
  {
    key: 'complaint',
    label: 'Raise Complaint',
    path: '/complaint',
    icon: <IoWarningOutline className="text-xl" />  // Warning/alert icon for complaints
  },
  // {
  //   key: 'attendance',
  //   label: 'Attendance',
  //   path: '/attendance',
  //   icon: <LuCalendarCheck2 className="text-xl" />  // Calendar with checkmark
  // },
  {
    key: 'sentiment-analysis',
    label: 'Sentiment Analysis',
    path: '/foodcards',
    icon: <TbBrain className="text-xl" />  // Brain icon for analysis/AI
  }
];

export const Sidebar_Logout = [
  {
    key: 'logout',
    label: 'Logout',
    path: '/login',
    icon: <LuLogOut className="text-xl" />  // Modern logout icon
  }
];
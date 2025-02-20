import React from 'react'
import { MdSpaceDashboard } from "react-icons/md";
import { BiSolidFoodMenu } from "react-icons/bi";
import { RiFeedbackFill } from "react-icons/ri";
import { FaWpforms } from "react-icons/fa6";
import { BiLogOut } from "react-icons/bi";
import { FaBookOpen } from "react-icons/fa6";
import { FaCalendarDays } from "react-icons/fa6";



export const Sidebar_Links  = [
    {
        key:'dashboard',
        label:'Dashboard',
        path:'/',
        icon:<MdSpaceDashboard/>
    },
    {
        key:'mess-time-table',
        label:'Mess Time Table',
        path:'/menu',
        icon:<BiSolidFoodMenu/>
    },
    {
        key:'feedback',
        label:'Feedback',
        path:'/feedback',
        icon:<RiFeedbackFill/>
    },
    {
        key:'leave',
        label:'Leave Form',
        path:'/leaveform',
        icon:<FaWpforms/>
    },
    {
        key:'complaint',
        label:'Raise Complaint',
        path:'/complaint',
        icon:<FaBookOpen/>
    },
    {
        key:'attendence',
        label:'Attendence',
        path:'/attendence',
        icon:<FaCalendarDays/>
    },

    {
        key:'Sentimental analysis',
        label:'Sentimental analysis',
        path:'/foodcards',
        icon:<FaCalendarDays/>
    }
]
export const Sidebar_Logout  = [
    {
        key:'logout',
        label:'Logout',
        path:'/login',
        icon:<BiLogOut/>
    }
]
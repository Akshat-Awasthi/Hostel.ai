import React, { useEffect, useState } from 'react';
import StudentProfile from './lib/const/StudentProfile.json';
import { PiNotepadFill } from 'react-icons/pi';
import { GrSemantics } from 'react-icons/gr';
import Announcement from './lib/const/Announcement.json';
import { Link } from 'react-router-dom';
import DateTime from './DateAndTime/DateTime';

const Rightbar = () => {
    const sem = parseInt(StudentProfile[0].semester);
    const semesterWidth = (sem / 8) * 100;

    const [currentDay, setCurrentDay] = useState('');
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        const intervalId = setInterval(() => {
            const date = new Date();
            setCurrentDay(date.toLocaleString('en-US', { weekday: 'long' }));
            setCurrentDate(
                date.toLocaleString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                })
            );
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const announceCol = ['bg-[#F2994A]', 'bg-state-100'];

    return (
        <div
            className="bg-white shadow-lg border-l border-gray-300 w-[300px] right-0"
            style={{ zIndex: 1000 }}
        >
            <div className="h-12">
                <div className="flex flex-row m-1 p-2 ml-2 bg-[#F2994A] h-10 rounded-md border border-solid">
                    <div className="flex-1">{currentDate}</div>
                    <div className="pr-4">{currentDay}</div>
                </div>
            </div>
            <div className="pb-3">
                <div className="flex flex-row pl-3 pb-2 border-b border-gray-300">
                    <GrSemantics size={15} style={{ marginTop: '2px' }} />
                    <h2 className="font-medium flex-1 pl-1">Semester</h2>
                </div>
                <div className="ml-2 mb-5">
                    <h3 className="pt-2 pb-1">Semester {sem} of 8</h3>
                    <div className="h-3 bg-slate-400 rounded-md">
                        <div
                            style={{ width: `${semesterWidth}%` }}
                            className="h-full bg-green-600 rounded-md"
                        ></div>
                    </div>
                </div>
                <div>
                    <div className="flex flex-row pl-2 pb-2 border-b border-gray-300">
                        <PiNotepadFill size={20} />
                        <h2 className="font-medium flex-1 pl-1">Announcements</h2>
                        <Link className="text-sm mr-1">View all</Link>
                    </div>
                </div>
                <div className="flex flex-col ml-2 mt-2">
                    {Announcement.map((item, index) => (
                        // Include index to ensure key uniqueness
                        <div
                            key={`${item.name}-${index}`}
                            className={`rounded-md border ${
                                index === 0 ? 'border-none' : 'border-blue-500'
                            } p-2 mb-2 ${
                                index === 0 ? announceCol[0] : announceCol[1]
                            }`}
                        >
                            <ul>
                                <li className="flex flex-row border-b border-slate-300">
                                    <div className="flex-1 font-medium mb-2 pb-1">
                                        {item.name}
                                    </div>
                                    <div className="mr-3 mb-1 pb-1 pl-2 pt-1 pr-2 h-6 w-22 rounded-md bg-[#D9DADB]">
                                        <DateTime />
                                    </div>
                                </li>
                                <li className="pt-2 text-sm">{item.message}</li>
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Rightbar;
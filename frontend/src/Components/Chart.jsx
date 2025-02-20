import React from 'react'
import { Bar, Line } from 'react-chartjs-2'
import Feedback from "./lib/const/FeedbackData.json"
import WeekFeedback from "./lib/const/WeekFeedback.json"
import Rightbar from './Rightbar'

// defaults.maintainAspectRatio = false;
// defaults.responsive = true;
// defaults.plugins.title.display = true;
// defaults.plugins.title.align = "start";
// defaults.plugins.title.font.size = 16;
// defaults.plugins.title.color = "black";
const Chart = () => {
    
  return (
    
    <div className='flex flex-row h-[100vh] w-[1180px] overflow-y-auto bg-slate-100'>
        <div className='w-full'>
            <div className='h-[45vh] m-5'>
                        <Line
                            data={{
                                labels: WeekFeedback.map((data) => data.label),
                                datasets: [
                                    {
                                        label: "Positive",
                                        data: WeekFeedback.map((data) => data.Positive),
                                        backgroundColor: "#064FF0",
                                        borderColor: "#064FF0",
                                    },
                                    {
                                        label: "Negative",
                                        data: WeekFeedback.map((data) => data.Negative),
                                        backgroundColor: "#FF3030",
                                        borderColor: "#FF3030",
                                    },
                                ]
                            }}
                            options={{
                                elements: {
                                    line: {
                                        tension: 0.4
                                    },
                                },
                                plugins: {
                                    title: {
                                        text: "Weekly Feedback",
                                    },
                                },
                            }} />
            </div>
            <div className='flex flex-row'>
                <div className='h-[50vh] w-1/2'>
                    <Bar    
                        data={{
                            labels:Feedback.map((data)=>data.label),
                        datasets: [
                            {
                                label:"No. of Students",
                                data: Feedback.map((data)=>data.Value),
                                backgroundColor:[
                                    "rgb(0,128,0)",
                                    "rgb(220,20,60)",
                                ],
                                borderRadius:1,
                            },
                        ]}} />
                </div> 
                <div>
                    pie
                </div>
            </div>
            
        </div>
        <div className='h-[100vh] ml-2 mr-4'>
                <Rightbar />
            </div>
        
    </div>
  )
}

export default Chart
import React, { useState } from 'react'
import { MdEmail } from 'react-icons/md';
import { GrSelect } from "react-icons/gr";
import { MdSubject } from "react-icons/md";
import { useNavigate } from 'react-router-dom';


const Complaint = () => {
  const [fileCompliant,setfileCompliant] = useState({
    email:"",
    topic:"",
    subject:"",
    text:""
  })
  const handleInput = (e)=>{
    let name = e.target.name
    let value = e.target.value

    setfileCompliant({
      ...fileCompliant,
      [name] : value
    })
  }
  
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(fileCompliant);
    navigate('/');

} 
  return (
    <div className='h-[100vh] w-[1180px] overflow-auto flex justify-center'>
      <div className='flex justify-center border mt-7 border-gray-500 w-[600px] h-[700px] shadow-lg shadow-gray-500'>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="w-full flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold mt-5 mb-7">Complaint Registration</h2>
          <div className='flex flex-col'>
          <div>
              <label className="font-medium text-sm" htmlFor="email">College Email</label>
              <input type="email" name="email" required autoComplete='off' placeholder="Email" value={fileCompliant.email} onChange={handleInput} className="pl-7 mt-1 py-2 w-full border border-gray-300 placeholder:text-sm rounded focus:outline-none focus:border-blue-500 hover:shadow-md" />
              <MdEmail className='absolute top-[207px]  ml-2' />
              
            </div>
            <div className="mt-3 relative mr-40">
            <label className="font-medium text-sm" htmlFor="topic">Select topic</label>
            <select name="topic" id="topic" value={fileCompliant.topic} onChange={handleInput} required className='w-full pl-7 h-8 mt-1 border border-gray-300 rounded font-medium text-sm text-gray-400 hover:shadow-md focus:outline-none focus:border-blue-500'>
                <option value="select">Select</option>
                <option value="Mess Food Problem">Mess Food Problem</option>
                <option value="Cleanliness Problem">Cleanliness Problem</option>
                <option value="Electricity Problem">Electricity Problem</option>
                <option value="Wifi Problem">Wifi Problem</option>
                <option value="others">Others</option>
              </select>
              <GrSelect  className='absolute top-9 ml-2'/>
              
            </div>
            <div className='mt-3'>
              <label className="font-medium text-sm" htmlFor="subject">Enter Subject</label>
              <input type="text" name="subject" required onChange={handleInput} value={fileCompliant.subject} autoComplete='off' placeholder="Subject" className="pl-7 mt-1 py-2 w-full hover:shadow-md placeholder:text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500" />
              <MdSubject className='absolute top-[353px] ml-2'/>
            </div>
            <div className='flex flex-col mt-3'>
              <label htmlFor="complaint-text">Complaint</label>
              <textarea name="text" required onChange={handleInput}  cols="6" rows="6" type="hidden" value={fileCompliant.text} placeholder='Express your problem in details....' className='mt-1 pl-2 py-2 hover:shadow-md placeholder:text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500'></textarea>
            </div>
            <div>
            <button type='submit' className="text-base w-52 font-medium text-white bg-blue-500 border border-transparent px-6 py-2 mt-5 rounded hover:bg-white hover:text-blue-500 hover:border-blue-500 transition duration-300 ease-in-out">File Complain</button>
            </div>

          </div>
          
        </div>
      </form>
      </div>
    </div>
  )
}

export default Complaint
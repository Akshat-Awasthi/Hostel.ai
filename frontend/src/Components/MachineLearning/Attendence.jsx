import React, { useEffect, useRef, useState } from 'react';
import * as ml5 from 'ml5';

const Attendence = () => {
  const videoRef = useRef(null);
  const [model, setModel] = useState(null);
  const [name, setName] = useState("");
  const [students, setStudents] = useState([
    { label: 'Akshat' },{ label: 'Abha' },{ label: 'Abhinav' },{ label: 'Kesh' },{ label: 'Abhishek' },{ label: 'Govind' },{ label: 'Prateek' },{ label: 'John' },
    { label: 'Jane' },{ label: 'Ayush' },
  ]);
  const [checkedItems, setCheckedItems] = useState({});

  const handleCheckboxChange = (index) => {
    setCheckedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  useEffect(() => {
    const loadModel = async () => {
      const classifier = await ml5.imageClassifier('https://teachablemachine.withgoogle.com/models/_HwM05XJT/model.json');
      setModel(classifier);
    };

    loadModel();

    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
          };
        }
      } catch (err) {
        console.error('Error accessing webcam:', err);
      }
    };

    startVideo();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    };

  }, []);

  const classifyImage = () => {
    if (model && videoRef.current) {
      model.classify(videoRef.current)
        .then(results => {
          if (results[0].confidence >= 0.8) {
            console.log(results);
            const recognizedName = results[0].label;
            setName(recognizedName);
            
            // Find the index of the recognized name and update checkedItems
            const studentIndex = students.findIndex(student => student.label === recognizedName);
            if (studentIndex !== -1) {
              setCheckedItems(prev => ({
                ...prev,
                [studentIndex]: true
              }));
            }
          } else {
            console.log(results);
            alert("Error reading face");
          }
        })
        .catch(err => console.error(err));
    }
  };

  return (
    <div className="flex flex-row min-h-screen w-[74rem] bg-gray-100 ml-5">
      <div>
        <h1 className="text-3xl font-bold m-5 mb-3">Facial Attendance System</h1>
        <video
          ref={videoRef}
          className="border-4 border-blue-500 mb-5 m-5"
          width="400"
          height="300"
        ></video>
        <div className='flex flex-row gap-3 m-4 ml-16'>
          <button 
            onClick={classifyImage}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Recognize Face
          </button>
          <button 
            onClick={() => setName("")}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Next
          </button>
        </div>
        {name && (
          <div className="mt-5 text-xl text-green-600 font-bold ml-24">
            {name} : Present
          </div>
        )}
      </div>
      <div className='flex flex-col w-full mt-40 items-center'>
        <div>
          {students.map((student, index) => (
            <div key={index} className='flex items-center'>
              <input
                type="checkbox"
                id={`student-${index}`}
                checked={!!checkedItems[index]}
                onChange={() => handleCheckboxChange(index)}
                className='mr-2'
                disabled
              />
              <label htmlFor={`student-${index}`}>{student.label}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Attendence;

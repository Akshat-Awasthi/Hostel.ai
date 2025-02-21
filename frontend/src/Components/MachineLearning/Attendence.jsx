import React, { useEffect, useRef, useState } from "react";

/**
 * ATTENDENCE COMPONENT
 * 
 * Make sure your Flask server is running on http://127.0.0.1:5000
 * and has the relevant endpoints:
 *  - /register-faces (POST) 
 *  - /recognize-face (POST)
 *  - /mark-attendance (POST)
 *  - /attendance-status (GET)
 * 
 * Also ensure Flask has CORS(app) to allow cross-origin from localhost:3000
 */
const Attendence = () => {
  const [view, setView] = useState("home");

  // Camera references
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);

  // ----- Registration state -----
  const [capturedImages, setCapturedImages] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [studentRoll, setStudentRoll] = useState("");

  // ----- Recognition state -----
  const [recognizeImage, setRecognizeImage] = useState("");
  const [recognizeResult, setRecognizeResult] = useState("");
  const [recognizedName, setRecognizedName] = useState("");
  const [recognizedRoll, setRecognizedRoll] = useState("");

  // ----- Attendance state -----
  const [attendedToday, setAttendedToday] = useState([]);
  const [notAttendedToday, setNotAttendedToday] = useState([]);

  // ----------------------------------------------------------------
  // On component mount, fetch attendance
  // ----------------------------------------------------------------
  useEffect(() => {
    fetchAttendanceStatus();
  }, []);

  // ----------------------------------------------------------------
  // Camera control
  // ----------------------------------------------------------------
  const startCamera = async () => {
    try {
      const userStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(userStream);
      if (videoRef.current) {
        videoRef.current.srcObject = userStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Check permissions!");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setStream(null);
  };

  const captureFrame = () => {
    if (!videoRef.current) return null;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg"); // returns base64
  };

  // ----------------------------------------------------------------
  // Registration Flow
  // ----------------------------------------------------------------
  const handleStartRegister = () => {
    setView("register");
    setCapturedImages([]);
    setStudentName("");
    setStudentRoll("");
    setRecognizeImage("");
    startCamera();
  };

  const handleCaptureRegisterPhoto = () => {
    const frame = captureFrame();
    if (frame) {
      setCapturedImages(prev => [...prev, frame]);
    }
  };

  const handleClearCaptured = () => {
    setCapturedImages([]);
  };

  const handleStopRegisterCamera = () => {
    stopCamera();
  };

  const handleRegisterFaces = async () => {
    if (!studentName || !studentRoll) {
      alert("Please enter name and roll!");
      return;
    }
    if (capturedImages.length === 0) {
      alert("No captured images to register!");
      return;
    }
    try {
      const response = await fetch("http://127.0.0.1:5000/register-faces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: studentName,
          roll: studentRoll,
          images: capturedImages,
        })
      });
      const data = await response.json();
      if (data.status === "ok") {
        alert(data.message);
        // reset
        stopCamera();
        setCapturedImages([]);
        setStudentName("");
        setStudentRoll("");
        setView("home");
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to register faces.");
    }
  };

  // ----------------------------------------------------------------
  // Recognition Flow
  // ----------------------------------------------------------------
  const handleStartRecognize = () => {
    setView("recognize");
    setRecognizeImage("");
    setRecognizeResult("");
    setRecognizedName("");
    setRecognizedRoll("");
    startCamera();
  };

  const handleCaptureRecognizePhoto = () => {
    const frame = captureFrame();
    if (frame) {
      setRecognizeImage(frame);
    }
  };

  const handleStopRecognizeCamera = () => {
    stopCamera();
  };

  const handleRecognizeFace = async () => {
    if (!recognizeImage) {
      alert("No captured image for recognition!");
      return;
    }
    setRecognizeResult("Recognizing...");

    try {
      const res = await fetch("http://127.0.0.1:5000/recognize-face", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: recognizeImage }),
      });
      const data = await res.json();
      if (data.status === "ok") {
        if (!data.recognized) {
          setRecognizeResult("No face detected or Unknown face.");
          setRecognizedName("");
          setRecognizedRoll("");
        } else {
          setRecognizeResult(`Recognized: ${data.name} (Roll: ${data.roll})`);
          setRecognizedName(data.name);
          setRecognizedRoll(data.roll);
        }
      } else {
        setRecognizeResult("Error: " + data.message);
      }
    } catch (err) {
      console.error(err);
      setRecognizeResult("Error recognizing face.");
    }
  };

  const handleMarkAttendance = async () => {
    if (!recognizedName || !recognizedRoll) {
      alert("No recognized student info.");
      return;
    }
    try {
      const res = await fetch("http://127.0.0.1:5000/mark-attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: recognizedName, roll: recognizedRoll })
      });
      const data = await res.json();
      if (data.status === "ok") {
        alert(data.message);
        fetchAttendanceStatus();
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error marking attendance.");
    }
  };

  // ----------------------------------------------------------------
  // Attendance Status
  // ----------------------------------------------------------------
  const fetchAttendanceStatus = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/attendance-status");
      const data = await res.json();
      if (data.status === "ok") {
        setAttendedToday(data.attended_today);
        setNotAttendedToday(data.not_attended_today);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ----------------------------------------------------------------
  // Render
  // ----------------------------------------------------------------
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Face Attendance System</h1>

      {/* Navigation */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => {
            setView("home");
            stopCamera();
          }}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          Home
        </button>
        <button
          onClick={handleStartRegister}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Register Student
        </button>
        <button
          onClick={handleStartRecognize}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Recognize & Mark
        </button>
      </div>

      {/* Home View */}
      {view === "home" && (
        <div>
          <p className="text-gray-600">Choose an option above.</p>
          <div className="mt-8">
            <h3 className="text-lg font-semibold">Today's Attendance</h3>
            <button
              onClick={fetchAttendanceStatus}
              className="bg-green-500 text-white px-4 py-2 rounded mt-2"
            >
              Refresh
            </button>
            <div className="mt-4">
              <h4 className="font-medium">Attended Today</h4>
              <ul className="list-disc list-inside ml-4">
                {attendedToday.map((s, idx) => (
                  <li key={idx}>
                    {s.name} (Roll: {s.roll})
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4">
              <h4 className="font-medium">Not Attended Yet</h4>
              <ul className="list-disc list-inside ml-4">
                {notAttendedToday.map((s, idx) => (
                  <li key={idx}>
                    {s.name} (Roll: {s.roll})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Video Preview when in register or recognize */}
      {(view === "register" || view === "recognize") && (
        <div className="mb-4 max-w-md">
          <video
            ref={videoRef}
            className="border border-gray-300 w-full"
            autoPlay
            playsInline
          />
        </div>
      )}

      {/* Register View */}
      {view === "register" && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Register a New Student</h2>
          <div className="space-x-2 mb-4">
            <button
              onClick={handleCaptureRegisterPhoto}
              className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded"
            >
              Capture Photo
            </button>
            <button
              onClick={handleClearCaptured}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
            >
              Clear Photos
            </button>
            <button
              onClick={handleStopRegisterCamera}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Stop Camera
            </button>
          </div>
          {/* Thumbnails */}
          <div className="flex flex-wrap gap-2 mb-4">
            {capturedImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Captured ${idx}`}
                className="w-24 h-24 object-cover border border-gray-200"
              />
            ))}
          </div>
          {/* Name & Roll */}
          <div className="max-w-sm mb-4">
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              className="border border-gray-300 rounded px-2 py-1 w-full mb-2"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
            />
            <label className="block mb-1 font-medium">Roll No</label>
            <input
              type="text"
              className="border border-gray-300 rounded px-2 py-1 w-full mb-2"
              value={studentRoll}
              onChange={(e) => setStudentRoll(e.target.value)}
            />
            <button
              onClick={handleRegisterFaces}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Register
            </button>
          </div>
        </div>
      )}

      {/* Recognize View */}
      {view === "recognize" && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Recognize & Mark Attendance</h2>
          <div className="space-x-2 mb-2">
            <button
              onClick={handleCaptureRecognizePhoto}
              className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded"
            >
              Capture Photo
            </button>
            <button
              onClick={handleStopRecognizeCamera}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Stop Camera
            </button>
          </div>
          {/* Recognize Photo Preview */}
          {recognizeImage && (
            <div className="mb-2">
              <img
                src={recognizeImage}
                alt="Recognize capture"
                className="w-32 h-32 object-cover border border-gray-300"
              />
            </div>
          )}
          {/* Recognize Button */}
          <button
            onClick={handleRecognizeFace}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-2"
          >
            Recognize
          </button>
          {/* Result */}
          {recognizeResult && <p className="text-gray-700">{recognizeResult}</p>}
          {/* If recognized, Mark Attendance */}
          {recognizedName && recognizedRoll && (
            <div className="mt-4">
              <button
                onClick={handleMarkAttendance}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                Mark Attendance
              </button>
            </div>
          )}
          {/* Show attendance again */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold">Today's Attendance</h3>
            <button
              onClick={fetchAttendanceStatus}
              className="bg-green-500 text-white px-4 py-2 rounded mt-2"
            >
              Refresh
            </button>
            <div className="mt-4">
              <h4 className="font-medium">Attended Today</h4>
              <ul className="list-disc list-inside ml-4">
                {attendedToday.map((s, idx) => (
                  <li key={idx}>
                    {s.name} (Roll: {s.roll})
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4">
              <h4 className="font-medium">Not Attended Yet</h4>
              <ul className="list-disc list-inside ml-4">
                {notAttendedToday.map((s, idx) => (
                  <li key={idx}>
                    {s.name} (Roll: {s.roll})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendence;

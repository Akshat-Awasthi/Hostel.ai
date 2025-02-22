// File: attendance.jsx
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

function Attendance() {
  // Toggle between "register" and "recognize"
  const [mode, setMode] = useState("register");

  // Camera refs & state
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);

  // Register states
  const [regName, setRegName] = useState("");
  const [regMessage, setRegMessage] = useState("");

  // Recognize states
  const [recMessage, setRecMessage] = useState("");
  const [recognizedName, setRecognizedName] = useState("");
  const [confidence, setConfidence] = useState(null);

  // ----------------------------
  // 1. CAMERA FUNCTIONS
  // ----------------------------
  useEffect(() => {
    // Start camera automatically on mount (optional)
    startCamera();
    // Cleanup on unmount
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const userStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(userStream);
      if (videoRef.current) {
        videoRef.current.srcObject = userStream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Could not access camera. Check permissions or use HTTPS!");
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
    // Returns base64-encoded image (JPEG)
    return canvas.toDataURL("image/jpeg");
  };

  // ----------------------------
  // 2. REGISTER FLOW
  // ----------------------------
  const handleCaptureRegisterPhoto = () => {
    const frame = captureFrame();
    if (frame) {
      setCapturedImage(frame);
      setRegMessage("");
    }
  };

  const handleRegisterSubmit = async () => {
    if (!regName) {
      setRegMessage("Please provide a name.");
      return;
    }
    if (!capturedImage) {
      setRegMessage("Please capture an image first.");
      return;
    }
    try {
      // Convert base64 to Blob and append to FormData
      const formData = base64ToFormData(capturedImage, regName);
      // POST to /api/register
      const response = await axios.post("http://localhost:5000/api/register", formData);
      setRegMessage(response.data.message || "Registration successful.");
    } catch (error) {
      console.error(error);
      setRegMessage(error.response?.data?.error || "Server error during registration.");
    }
  };

  // ----------------------------
  // 3. RECOGNITION FLOW
  // ----------------------------
  const handleCaptureRecognizePhoto = () => {
    const frame = captureFrame();
    if (frame) {
      setCapturedImage(frame);
      setRecMessage("");
      setRecognizedName("");
      setConfidence(null);
    }
  };

  const handleRecognizeSubmit = async () => {
    if (!capturedImage) {
      setRecMessage("Please capture an image first.");
      return;
    }
    try {
      const formData = base64ToFormData(capturedImage);
      // POST to /api/recognize
      const response = await axios.post("http://localhost:5000/api/recognize", formData);
      setRecMessage(response.data.message || "Recognition complete.");
      setRecognizedName(response.data.name || "");
      setConfidence(response.data.confidence || null);
    } catch (error) {
      console.error(error);
      setRecMessage(error.response?.data?.error || "Server error during recognition.");
    }
  };

  // ----------------------------
  // 4. HELPER: Convert Base64 to FormData
  // ----------------------------
  // For "register", we need { name, image }; for "recognize", just { image }.
  const base64ToFormData = (base64, name = "") => {
    // Convert base64 -> Blob
    const blob = base64ToBlob(base64);
    const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
    const formData = new FormData();
    // If name is provided, we're registering
    if (name) {
      formData.append("name", name);
    }
    formData.append("image", file);
    return formData;
  };

  // Convert base64 data URL to a raw Blob
  const base64ToBlob = (dataURL) => {
    const [header, base64] = dataURL.split(",");
    // Example: header => "data:image/jpeg;base64"
    const mimeMatch = header.match(/:(.*?);/);
    const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";

    const binary = atob(base64);
    const len = binary.length;
    const buffer = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      buffer[i] = binary.charCodeAt(i);
    }
    return new Blob([buffer], { type: mimeType });
  };

  // ----------------------------
  // RENDER
  // ----------------------------
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-xl mx-auto bg-white p-4 rounded shadow">
        <h1 className="text-2xl font-bold mb-4 text-center">Face Attendance System</h1>
        
        {/* Mode Selector */}
        <div className="flex justify-center space-x-2 mb-4">
          <button
            className={`px-4 py-2 rounded ${mode === "register" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => {
              setMode("register");
              setCapturedImage(null);
              setRegMessage("");
              setRegName("");
            }}
          >
            Register
          </button>
          <button
            className={`px-4 py-2 rounded ${mode === "recognize" ? "bg-green-500 text-white" : "bg-gray-200"}`}
            onClick={() => {
              setMode("recognize");
              setCapturedImage(null);
              setRecMessage("");
              setRecognizedName("");
              setConfidence(null);
            }}
          >
            Recognize
          </button>
        </div>

        {/* VIDEO PREVIEW */}
        <video
          ref={videoRef}
          className="border mb-4 w-full"
          autoPlay
          playsInline
        />

        {/* CAPTURE BUTTONS */}
        {mode === "register" && (
          <div className="mb-4">
            <button
              onClick={handleCaptureRegisterPhoto}
              className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
            >
              Capture Photo
            </button>
            <span className="text-sm text-gray-600">
              Capture at least one clear photo to register.
            </span>
          </div>
        )}
        {mode === "recognize" && (
          <div className="mb-4">
            <button
              onClick={handleCaptureRecognizePhoto}
              className="bg-green-600 text-white px-4 py-2 rounded mr-2"
            >
              Capture Photo
            </button>
            <span className="text-sm text-gray-600">
              Capture a clear photo to recognize.
            </span>
          </div>
        )}

        {/* CAPTURED IMAGE PREVIEW */}
        {capturedImage && (
          <div className="mb-4 text-center">
            <p className="font-semibold mb-1">Captured Image</p>
            <img src={capturedImage} alt="Captured" className="mx-auto border max-h-48" />
          </div>
        )}

        {/* REGISTER SECTION */}
        {mode === "register" && (
          <div>
            {/* Name Input */}
            <div className="mb-2">
              <label className="block mb-1 font-medium">Name:</label>
              <input
                type="text"
                className="border rounded px-2 py-1 w-full"
                placeholder="Enter Name"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
              />
            </div>

            <button
              onClick={handleRegisterSubmit}
              className="bg-purple-600 text-white px-4 py-2 rounded w-full"
            >
              Register Face
            </button>

            {regMessage && <p className="mt-2 text-blue-600 text-center">{regMessage}</p>}
          </div>
        )}

        {/* RECOGNIZE SECTION */}
        {mode === "recognize" && (
          <div>
            <button
              onClick={handleRecognizeSubmit}
              className="bg-purple-600 text-white px-4 py-2 rounded w-full"
            >
              Recognize Face
            </button>
            {recMessage && <p className="mt-2 text-blue-600 text-center">{recMessage}</p>}
            {/* If recognized, show name & confidence */}
            {recognizedName && recognizedName !== "Unknown" && (
              <p className="mt-2 text-green-600 text-center">
                Attendance Marked for {recognizedName}!
                {confidence && (
                  <span className="block text-sm text-gray-600">
                    (Confidence: {confidence.toFixed(2)})
                  </span>
                )}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Attendance;

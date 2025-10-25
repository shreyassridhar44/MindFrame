import React, { useState, useRef, useEffect } from 'react';
import { Video, VideoOff } from 'lucide-react';

// Import all your components
import StressOMeter from '../components/StressOMeter';
import EmotionChart from '../components/EmotionChart';
import SessionTimer from '../components/SessionTimer';
import InsightsPanel from '../components/InsightsPanel';

// --- Helper Functions to transform Backend Data ---

// Must match the order in your backend's EMOTIONS tuple
const EMOTIONS_LIST = ['angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral'];
const EMOTION_COLORS = {
  angry: '#EF4444',   // Red
  disgust: '#8B5CF6', // Purple
  fear: '#F59E0B',    // Yellow
  happy: '#10B981',   // Green
  sad: '#3B82F6',    // Blue
  surprise: '#F97316', // Orange
  neutral: '#6B7280',  // Gray
};

/**
 * Formats the raw prediction array from the API for the EmotionChart.
 * @param {number[]} data - Array of 7 probabilities (e.g., [0.1, 0.0, ...])
 * @returns {object[]} - Array for Recharts (e.g., [{ name: 'angry', probability: 0.1, color: '...' }])
 */
const formatDataForChart = (data) => {
  if (!data || data.length === 0) {
    return EMOTIONS_LIST.map(name => ({
      name,
      probability: 0,
      color: EMOTION_COLORS[name]
    }));
  }
  return data.map((value, index) => ({
    name: EMOTIONS_LIST[index],
    probability: value, // The chart component will multiply by 100
    color: EMOTION_COLORS[EMOTIONS_LIST[index]]
  }));
};

/**
 * Calculates a 0-100 stress level based on emotions.
 * @param {number[]} data - Array of 7 probabilities
 * @returns {number} - Stress level (0-100)
 */
const calculateStressLevel = (data) => {
  if (!data || data.length === 0) return 0;

  const stressScore = 
    (data[EMOTIONS_LIST.indexOf('angry')] + 
     data[EMOTIONS_LIST.indexOf('fear')] + 
     data[EMOTIONS_LIST.indexOf('sad')]);
     
  // We'll cap this at 1.0 (100%) and scale it.
  // This logic is simple: stress is the sum of angry, fear, and sad.
  return Math.round(Math.min(stressScore, 1.0) * 100);
};

/**
 * Generates a simple insight based on the current emotion.
 * @param {string} topEmotion - e.g., "happy", "no_face_detected"
 * @param {number} stressLevel - 0-100
 * @returns {object} - Insight object for the InsightsPanel
 */
const generateInsight = (topEmotion, stressLevel) => {
  if (stressLevel > 70) {
    return { type: 'warning', message: 'High stress detected! Remember to take deep, calming breaths. A short break might help.' };
  }
  if (topEmotion === 'happy') {
    return { type: 'success', message: 'Great to see you happy! Keep up the positive energy.' };
  }
  if (topEmotion === 'sad' || topEmotion === 'angry') {
    return { type: 'info', message: 'It looks like you\'re feeling down. Acknowledge the feeling. Maybe take a short walk?' };
  }
  if (topEmotion === 'no_face_detected') {
    return { type: 'info', message: 'No face detected. Please position yourself clearly in front of the camera for analysis.' };
  }
  return { type: 'info', message: 'You seem calm and focused. This is a great state for productivity!' };
};

// --- The Main Page Component ---

const DetectorPage = () => {
  // --- State ---
  const [isActive, setIsActive] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [stressLevel, setStressLevel] = useState(0);
  const [emotionChartData, setEmotionChartData] = useState(formatDataForChart([]));
  const [currentInsight, setCurrentInsight] = useState(null);
  const [error, setError] = useState(null);

  // --- Refs ---
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null); // To store the interval ID

  // --- Core Functions ---

  /** 1. Starts the webcam and the detection loop */
  const startDetection = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 },
        audio: false 
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setIsActive(true);
          setSessionTime(0);
          
          // Start the prediction loop (1 frame per second)
          intervalRef.current = setInterval(captureAndPredict, 1000);
        };
      }
    } catch (err) {
      console.error("Error accessing webcam:", err);
      setError("Could not access webcam. Please check browser permissions.");
      setIsActive(false);
    }
  };

  /** 2. Stops the webcam and the detection loop */
  const stopDetection = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
    
    // --- UPDATED ---
    // The following lines were removed to preserve the last state:
    // setStressLevel(0);
    // setEmotionChartData(formatDataForChart([]));
    // setCurrentInsight(null);
  };

  /** 3. Captures a single frame and sends to the API */
  const captureAndPredict = async () => {
    if (!videoRef.current || !canvasRef.current || !videoRef.current.srcObject) return;

    const context = canvasRef.current.getContext('2d');
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    
    // Flip the image horizontally (like a mirror)
    context.translate(videoRef.current.videoWidth, 0);
    context.scale(-1, 1);
    context.drawImage(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight);
    
    // Get the image data
    const base64Image = canvasRef.current.toDataURL('image/jpeg');

    try {
      // Send to backend API (running on port 8000)
      const response = await fetch('http://localhost:8000/api/predict-emotion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData.detail || 'API request failed');
        // Don't throw, but maybe set an error state
        return; 
      }

      const data = await response.json(); // { emotion: "happy", all_predictions: [...] }

      // --- Update all states with new data ---
      const newStressLevel = calculateStressLevel(data.all_predictions);
      
      setStressLevel(newStressLevel);
      setEmotionChartData(formatDataForChart(data.all_predictions));
      setCurrentInsight(generateInsight(data.emotion, newStressLevel));

    } catch (err) {
      console.error("Prediction error:", err);
      // Don't stop the loop, just log the error
    }
  };

  // --- Cleanup Effect ---
  // This stops the webcam if the user navigates away from the page
  useEffect(() => {
    return () => {
      stopDetection();
    };
  }, []);

  // --- JSX Layout ---
  return (
    <div className="pt-24 pb-12 bg-gray-50 min-h-screen"> {/* Add padding for fixed navbar */}
      <div className="max-w-7xl mx-auto px-6">
        {/* Header and Error Message */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Emotion Detector</h1>
          <p className="text-lg text-gray-600">
            {isActive ? "Your real-time emotion analysis is live." : "Start the camera to begin your session."}
          </p>
          {error && (
            <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
              <span className="font-bold">Error: </span>
              <span className="block sm:inline">{error}</span>
            </div>
          )}
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Video + Controls) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-black rounded-2xl shadow-lg overflow-hidden border border-gray-200">
              {/* This is where the video feed appears */}
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-auto transform scale-x-[-1]" // Flip horizontally
              />
              {/* This canvas is hidden, used only for capturing frames */}
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>

            <button
              onClick={isActive ? stopDetection : startDetection}
              className={`w-full flex items-center justify-center space-x-3 text-lg font-bold py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg
                ${isActive
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-teal-600 text-white hover:bg-teal-700'
                }`}
            >
              {isActive ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
              <span>{isActive ? 'Stop Session' : 'Start Detection'}</span>
            </button>
          </div>

          {/* Right Column (Data Widgets) */}
          <div className="lg:col-span-1 space-y-8">
            <SessionTimer 
              isActive={isActive} 
              sessionTime={sessionTime} 
              setSessionTime={setSessionTime} 
            />
            <StressOMeter 
              stressLevel={stressLevel} 
              isActive={isActive} 
            />
            {/* UPDATED: Changed prop to 'isLive' to match EmotionChart component */}
            <EmotionChart 
              emotions={emotionChartData} 
              isLive={isActive} 
            />
            <InsightsPanel 
              insight={currentInsight}
              isActive={isActive} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetectorPage;


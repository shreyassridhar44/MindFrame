import React, { useEffect, useState, useRef } from 'react';
import { Lightbulb, Sparkles } from 'lucide-react';

// --- PUT YOUR GEMINI API KEY HERE ---
const API_KEY = "AIzaSyDwOY7fkpmVntB2_kPLM67hQ8YX6fbfgK8"; 
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=";

const InsightsPanel = ({ dominantEmotion, isActive }) => {
  const [insight, setInsight] = useState('Start a detection session to receive personalized insights.');
  const [isLoading, setIsLoading] = useState(false);
  const lastEmotionRef = useRef(null); // To prevent duplicate API calls

  const fetchGeminiInsight = async (emotion) => {
    if (API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
      setInsight("Please add your Gemini API key to InsightsPanel.jsx to enable this feature.");
      return;
    }
    
    setIsLoading(true);
    
    // Simple prompt for the chatbot
    const prompt = `You are an empathetic AI assistant. A user's dominant emotion is currently "${emotion}". 
    Provide a short, constructive, and actionable insight (1-2 sentences) based on this. 
    Do not use markdown. Be very concise.`;

    try {
      const response = await fetch(`${GEMINI_API_URL}${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 100,
          }
        })
      });

      if (!response.ok) {
        throw new Error('Gemini API request failed');
      }

      const data = await response.json();
      const newInsight = data.candidates[0].content.parts[0].text;
      setInsight(newInsight.trim());

    } catch (error) {
      console.error("Gemini API error:", error);
      setInsight("Could not fetch an insight at this time.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check conditions to make an API call:
    // 1. Detection must be active.
    // 2. The emotion must be valid (not an error).
    // 3. The new emotion must be different from the last one we processed.
    if (isActive && 
        dominantEmotion && 
        dominantEmotion !== 'no_face_detected' && 
        dominantEmotion.indexOf('error') === -1 &&
        dominantEmotion !== lastEmotionRef.current) 
    {
      lastEmotionRef.current = dominantEmotion; // Store this emotion
      fetchGeminiInsight(dominantEmotion);
    }
    
    // Reset insight if session stops
    if (!isActive) {
      setInsight('Start a detection session to receive personalized insights.');
      lastEmotionRef.current = null; // Clear last emotion
    }
  }, [dominantEmotion, isActive]); // Re-run when emotion or active status changes

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-teal-100">
      <div className="flex items-center space-x-2 mb-4">
        <Sparkles className="w-5 h-5 text-teal-600" />
        <h2 className="text-xl font-bold text-gray-900">Key Insights</h2>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 min-h-[100px] flex items-center justify-center">
        {isLoading ? (
          <div className="flex items-center space-x-2 text-gray-500">
            <Lightbulb className="w-5 h-5 animate-pulse" />
            <span>Generating insight...</span>
          </div>
        ) : (
          <p className="text-gray-800 text-sm leading-relaxed text-center">
            {insight}
          </p>
        )}
      </div>
      
      {/* Quick Tips Section */}
      <div className="mt-6 space-y-3">
        <h3 className="text-sm font-semibold text-gray-700">Quick Tips:</h3>
        <div className="space-y-2">
          <div className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-gray-600">Take deep breaths when stress levels rise</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-gray-600">Regular breaks improve emotional balance</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsPanel;
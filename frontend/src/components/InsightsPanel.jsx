import React, { useEffect, useState } from 'react';
import { Lightbulb, Sparkles, MessageSquare } from 'lucide-react';

// --- PUT YOUR *NEW* GEMINI API KEY HERE ---
const API_KEY = 'AIzaSyADBg14Y5Ey_wXv0t25HBghdAgZK8UIDyU';
// --- THIS URL IS NOW FIXED ---
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

const InsightsPanel = ({ dominantEmotion, averageStress, isActive, setIsChatModalOpen }) => {
  const [insight, setInsight] = useState('Start a detection session to receive personalized insights.');
  const [isLoading, setIsLoading] = useState(false);

  // This effect now fetches a SUMMARY when the session stops
  useEffect(() => {
    // Check if the session just stopped (isActive is false, but averageStress just got a number)
    if (!isActive && averageStress !== null) {
      const getSessionSummary = async () => {
        if (API_KEY === "PASTE_YOUR_NEW_API_KEY_HERE") {
          setInsight("Please add your new Gemini API key to InsightsPanel.jsx to enable summaries.");
          return;
        }

        setIsLoading(true);
        const prompt = `A user just finished an emotion detection session. Their dominant emotion was "${dominantEmotion}" and their average stress level was ${averageStress}%. 
        Provide a short, one-paragraph summary (2-3 sentences) of this session. Be empathetic and constructive. Do not use markdown.`;

        try {
          const response = await fetch(`${GEMINI_API_URL}${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 150,
              }
            })
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error("Gemini API Error Response:", errorData);
            throw new Error(`API request failed with status ${response.status}`);
          }

          const data = await response.json();
          const newInsight = data.candidates[0].content.parts[0].text;
          setInsight(newInsight.trim());

        } catch (error) {
          console.error("Gemini API Error:", error);
          setInsight("Could not fetch a session summary. Please check the console for details.");
        } finally {
          setIsLoading(false);
        }
      };

      getSessionSummary();
    }
    
    // Reset insight if session is active
    if (isActive) {
      setInsight('Your session is live. A summary will be generated when you pause.');
      setIsLoading(false);
    }

    // Reset insight if session is reset (averageStress goes back to null)
    if (averageStress === null) {
        setInsight('Start a detection session to receive personalized insights.');
        setIsLoading(false);
    }

  }, [averageStress, dominantEmotion, isActive]); // Re-run when these change

  const sessionHasEnded = !isActive && averageStress !== null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-teal-100">
      <div className="flex items-center space-x-2 mb-4">
        <Sparkles className="w-5 h-5 text-teal-600" />
        <h2 className="text-xl font-bold text-gray-900">
          {sessionHasEnded ? 'Session Summary' : 'Key Insights'}
        </h2>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 min-h-[100px] flex items-center justify-center">
        {isLoading ? (
          <div className="flex items-center space-x-2 text-gray-500">
            <Lightbulb className="w-5 h-5 animate-pulse" />
            <span>Generating summary...</span>
          </div>
        ) : (
          <p className="text-gray-800 text-sm leading-relaxed text-center">
            {insight}
          </p>
        )}
      </div>
      
      {/* Quick Tips & Chat Button --- */}
      <div className="mt-6 flex items-start gap-4">
        <div className="flex-1 space-y-3">
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

        {/* --- Chat with AI Button --- */}
        {sessionHasEnded && (
          <button 
            onClick={() => setIsChatModalOpen(true)}
            className="flex-shrink-0 flex items-center space-x-2 bg-teal-600 text-white px-4 py-2 rounded-lg shadow hover:bg-teal-700 transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm font-medium">Chat with AI</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default InsightsPanel;
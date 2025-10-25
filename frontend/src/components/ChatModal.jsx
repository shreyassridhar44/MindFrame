import React, { useState, useEffect, useRef } from 'react';
import { X, Mic, Send, Volume2, Loader2 } from 'lucide-react';

// --- PUT YOUR *NEW* GEMINI API KEY HERE ---
const API_KEY = 'AIzaSyADBg14Y5Ey_wXv0t25HBghdAgZK8UIDyU';
// --- THIS URL IS NOW FIXED ---
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

// --- Speech Recognition Setup ---
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;
if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.lang = 'en-US';
  recognition.interimResults = false;
}

const ChatModal = ({ isOpen, onClose, averageStress, dominantEmotion }) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isTtsEnabled, setIsTtsEnabled] = useState(true);
  const messagesEndRef = useRef(null);

  // --- Helper: Scroll to bottom of chat ---
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [chatHistory]);

  // --- Helper: Text-to-Speech ---
  const speakText = (text) => {
    if (!isTtsEnabled) return;
    try {
      window.speechSynthesis.cancel(); // Stop any previous speech
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error("Text-to-Speech error:", error);
    }
  };

  // --- Helper: Format chat history for Gemini API ---
  const formatHistoryForAPI = () => {
    return chatHistory.map(msg => ({
      role: msg.sender === 'ai' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }));
  };

  
const fetchGeminiResponse = async (prompt, history = []) => {
  try {
    // Format chat history properly
    const contents = [
      ...history.map(msg => ({ parts: [{ text: msg.text }] })),
      { parts: [{ text: prompt }] }
    ];

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        systemInstruction: {
          parts: [{
            text: "You are MindFrame, an empathetic AI. Be concise, supportive, and ask follow-up questions."
          }]
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API Error Response:", errorData);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting right now. Please try again later.";
  }
};


  // --- Effect: Get initial question when modal opens ---
  useEffect(() => {
    if (isOpen) {
      const getInitialQuestion = async () => {
        setIsLoading(true);
        const initialPrompt = `A user just finished a session with an average stress of ${averageStress}% and their dominant emotion was "${dominantEmotion}". Ask them one suitable, open-ended question to start a conversation about their session.`;
        
        const firstQuestion = await fetchGeminiResponse(initialPrompt, []); 
        
        const aiMessage = { sender: 'ai', text: firstQuestion };
        setChatHistory([aiMessage]);
        setIsLoading(false);
        speakText(firstQuestion);
      };
      getInitialQuestion();
    } else {
      setChatHistory([]);
      setUserInput('');
      window.speechSynthesis.cancel();
    }
  }, [isOpen, averageStress, dominantEmotion]);

  // --- Handler: Send Message ---
  const handleSendMessage = async (e) => {
    e.preventDefault();
    const messageText = userInput.trim();
    if (!messageText || isLoading) return;

    const userMessage = { sender: 'user', text: messageText };
    setChatHistory(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    const formattedHistory = formatHistoryForAPI();
    const aiResponseText = await fetchGeminiResponse(messageText, formattedHistory);
    
    const aiMessage = { sender: 'ai', text: aiResponseText };
    setChatHistory(prev => [...prev, aiMessage]);
    setIsLoading(false);
    speakText(aiResponseText);
  };

  // --- Handler: Speech-to-Text ---
  const handleListen = () => {
    if (!recognition) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      return;
    }

    recognition.start();
    setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setUserInput(transcript);
      setIsListening(false);
      setTimeout(() => {
        document.getElementById('chat-form')?.requestSubmit();
      }, 0);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };
  
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg h-[70vh] flex flex-col m-4 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* --- Modal Header --- */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Chat with MindFrame AI</h3>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setIsTtsEnabled(!isTtsEnabled)}
              className={`p-2 rounded-full ${isTtsEnabled ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-500'}`}
              title={isTtsEnabled ? "Disable Text-to-Speech" : "Enable Text-to-Speech"}
            >
              <Volume2 className="w-5 h-5" />
            </button>
            <button 
              onClick={onClose} 
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* --- Chat Messages --- */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {chatHistory.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[75%] py-2 px-4 rounded-2xl ${
                  msg.sender === 'user' 
                  ? 'bg-teal-600 text-white' 
                  : 'bg-gray-100 text-gray-800'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 py-2 px-4 rounded-2xl inline-flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Typing...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* --- Message Input --- */}
        <form id="chat-form" onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              type="button"
              onClick={handleListen}
              className={`p-3 rounded-full flex-shrink-0 transition-colors ${
                isListening 
                ? 'bg-red-500 text-white animate-pulse' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Mic className="w-5 h-5" />
            </button>
            <button
              type="submit"
              className="p-3 rounded-full flex-shrink-0 bg-teal-600 text-white hover:bg-teal-700 disabled:bg-teal-300"
              disabled={!userInput.trim() || isLoading}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatModal;
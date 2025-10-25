import React, { useState, useEffect, useRef } from 'react';
import { X, Mic, Send, Volume2, Loader2 } from 'lucide-react';

// --- PUT YOUR NEW OPENAI API KEY HERE ---
const OPENAI_API_KEY = "sk-abcdqrstefghuvwxabcdqrstefghuvwxabcdqrst"; 

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [chatHistory]);

  const speakText = (text) => {
    if (!isTtsEnabled) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error("Text-to-Speech error:", error);
    }
  };

  const formatHistoryForOpenAI = () => {
    return chatHistory.map(msg => ({
      role: msg.sender === 'ai' ? 'assistant' : 'user',
      content: msg.text
    }));
  };

  // ✅ NEW OpenAI API CALL (correct endpoint + parser)
  const fetchOpenAIResponse = async (prompt, history = []) => {
    const systemMessage = {
      role: 'system',
      content: "You are MindFrame, an empathetic and supportive AI assistant. Keep responses short and warm."
    };

    const userMessage = { role: 'user', content: prompt };
    const messages = [systemMessage, ...history, userMessage];

    try {
      const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: messages
        })
      });

      const data = await response.json();
      return data.output_text; // ✅ correct output field

    } catch (error) {
      console.error("OpenAI API Error:", error);
      return "I'm having trouble connecting right now. Please try again later.";
    }
  };

  useEffect(() => {
    if (isOpen) {
      const getInitialQuestion = async () => {
        setIsLoading(true);
        const prompt = `A user finished a session with stress ${averageStress}% and emotion "${dominantEmotion}". Ask a warm, open question.`;
        const firstQuestion = await fetchOpenAIResponse(prompt, []);
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

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const text = userInput.trim();
    if (!text || isLoading) return;

    const userMessage = { sender: 'user', text };
    setChatHistory(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    const formattedHistory = formatHistoryForOpenAI();
    const aiText = await fetchOpenAIResponse(text, formattedHistory);

    const aiMessage = { sender: 'ai', text: aiText };
    setChatHistory(prev => [...prev, aiMessage]);
    setIsLoading(false);
    speakText(aiText);
  };

  const handleListen = () => {
    if (!recognition) return alert("Speech recognition not supported.");

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      return;
    }

    recognition.start();
    setIsListening(true);

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setUserInput(transcript);
      setIsListening(false);
      setTimeout(() => document.getElementById('chat-form')?.requestSubmit(), 0);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg h-[70vh] flex flex-col m-4 overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Chat with MindFrame AI</h3>
          <div className="flex items-center space-x-2">
            <button onClick={() => setIsTtsEnabled(!isTtsEnabled)} className={`p-2 rounded-full ${isTtsEnabled ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-500'}`}>
              <Volume2 className="w-5 h-5" />
            </button>
            <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {chatHistory.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] py-2 px-4 rounded-2xl ${msg.sender === 'user' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 py-2 px-4 rounded-2xl inline-flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Typing...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form id="chat-form" onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border rounded-full focus:ring-teal-500"
            />
            <button type="button" onClick={handleListen} className={`p-3 rounded-full ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-gray-700'}`}>
              <Mic className="w-5 h-5" />
            </button>
            <button type="submit" disabled={!userInput.trim() || isLoading} className="p-3 rounded-full bg-teal-600 text-white hover:bg-teal-700">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatModal;

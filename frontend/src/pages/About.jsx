import React from 'react';
import { Cpu, Database, BrainCircuit } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="pt-24 pb-12 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-3">About MindFrame</h1>
          <p className="text-lg text-gray-600">
            Understanding emotions through the power of artificial intelligence.
          </p>
        </div>

        {/* Project Mission */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed">
            MindFrame is a real-time emotion and stress detection application designed to provide instant feedback on your emotional state using your webcam. By leveraging a deep learning model, the app analyzes facial expressions to identify key emotions. Our goal is to create a tool that helps users become more aware of their emotional well-being, providing insights that can lead to better stress management and a healthier mental state.
          </p>
        </div>

        {/* Technology Stack */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Technology Behind MindFrame</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TechCard
              icon={<BrainCircuit className="w-8 h-8 text-teal-600" />}
              title="Machine Learning"
              description="A Convolutional Neural Network (CNN) trained on the FER2013 dataset to classify facial expressions into seven core emotions."
            />
            <TechCard
              icon={<Cpu className="w-8 h-8 text-teal-600" />}
              title="Backend"
              description="A robust backend powered by FastAPI (Python) serves the AI model and handles API requests efficiently."
            />
            <TechCard
              icon={<Database className="w-8 h-8 text-teal-600" />}
              title="Frontend"
              description="A dynamic and responsive user interface built with React and styled with Tailwind CSS for a modern user experience."
            />
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-center bg-yellow-50 border border-yellow-300 text-yellow-800 px-6 py-4 rounded-lg">
          <p className="font-semibold">Disclaimer</p>
          <p className="text-sm">
            MindFrame is an educational project and not a medical tool. The analysis provided should be considered for informational purposes only.
          </p>
        </div>

      </div>
    </div>
  );
};

// Helper component for the technology cards
const TechCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center">
    <div className="flex justify-center mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

export default AboutPage;
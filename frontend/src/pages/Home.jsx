import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Camera, TrendingUp, Clock, ArrowRight, Sparkles } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: Camera,
      title: 'Real-Time Detection',
      description: 'Advanced facial recognition technology analyzes your emotions in real-time through your webcam.',
      //image: 'https://images.unsplash.com/photo-1663124178716-2078c384c24a'
    },
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Machine learning algorithms detect 7 different emotions with high accuracy and precision.',
      //image: 'https://images.unsplash.com/photo-1760037034572-24141225b295'
    },
    {
      icon: TrendingUp,
      title: 'Stress Monitoring',
      description: 'Track your stress levels with our intelligent Stress-o-Meter and get personalized insights.',
      //image: 'https://images.unsplash.com/photo-1760037034697-eee0b07ae072'
    },
    {
      icon: Clock,
      title: 'Session History',
      description: 'Review your emotional patterns and stress trends over time with detailed session logs.',
      //image: 'https://images.unsplash.com/photo-1568909555342-230fc97f371a'
    }
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/3693051/pexels-photo-3693051.jpeg)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-teal-900/90 via-cyan-900/85 to-teal-800/90"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative h-full max-w-7xl mx-auto px-6 flex items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
              <Sparkles className="w-4 h-4 text-teal-300" />
              <span className="text-teal-100 text-sm font-medium">AI-Powered Emotion Detection</span>
            </div>
            
            <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
              Understand Your
              <span className="block bg-gradient-to-r from-teal-300 to-cyan-300 bg-clip-text text-transparent">
                Emotions & Stress
              </span>
            </h1>
            
            <p className="text-xl text-teal-50 mb-8 leading-relaxed">
              Our advanced AI technology analyzes your facial expressions in real-time, 
              detecting emotions and stress levels to help you maintain mental wellness and productivity.
            </p>
            
            <Link
              to="/detector"
              className="inline-flex items-center space-x-2 bg-white text-teal-700 px-8 py-4 rounded-xl font-semibold hover:bg-teal-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 group"
            >
              <span>Start Detection</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-white to-teal-50/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Key Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover how our technology helps you understand and manage your emotional wellbeing
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                {/* Feature Image */}
                <div className="h-48 overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-teal-600/20 to-transparent"></div>
                </div>
                
                {/* Feature Content */}
                <div className="p-8">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                
                {/* Decorative Border */}
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-teal-100 mb-8">
            Begin tracking your emotions and stress levels today for a healthier, more balanced life.
          </p>
          <Link
            to="/detector"
            className="inline-flex items-center space-x-2 bg-white text-teal-700 px-8 py-4 rounded-xl font-semibold hover:bg-teal-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 group"
          >
            <span>Try Detector Now</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
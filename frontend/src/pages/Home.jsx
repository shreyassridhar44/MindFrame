import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Camera, TrendingUp, Clock, ArrowRight, Sparkles } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: Camera,
      title: 'Real-Time Detection',
      description: 'Advanced facial recognition technology analyzes your emotions in real-time through your webcam.',
    },
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Machine learning algorithms detect 7 different emotions with high accuracy and precision.',
    },
    {
      icon: TrendingUp,
      title: 'Stress Monitoring',
      description: 'Track your stress levels with our intelligent Stress-o-Meter and get personalized insights.',
    },
    {
      icon: Clock,
      title: 'Session History',
      description: 'Review your emotional patterns and stress trends over time with detailed session logs.',
    }
  ];

  return (
    // Added overflow-x-hidden to prevent horizontal scrollbars from animations
    <div className="min-h-screen pt-20 bg-gradient-to-b from-white via-teal-50/30 to-white overflow-x-hidden">

      {/* Hero Section */}
      <section className="relative h-[650px] overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center animate-zoom-in-out" // Added subtle zoom animation
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/3693051/pexels-photo-3693051.jpeg)',
          }}
        />
        {/* Enhanced Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/95 via-cyan-800/80 to-teal-800/90 mix-blend-multiply"></div>

        {/* Hero Content */}
        {/* UPDATED: Added 'justify-center' to center the content block horizontally */}
        <div className="relative h-full max-w-7xl mx-auto px-6 flex items-center justify-center">
          {/* UPDATED: Added 'text-center' to center all the text and buttons inside */}
          <div className="max-w-2xl animate-fade-in-up text-center">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20 shadow-md">
              <Sparkles className="w-4 h-4 text-teal-300 animate-pulse" /> {/* Added pulse animation */}
              <span className="text-teal-100 text-sm font-medium">AI-Powered Emotion Detection</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight"> {/* Used font-extrabold & tracking-tight */}
              Understand Your
              <span className="block bg-gradient-to-r from-teal-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent mt-2"> {/* Enhanced gradient */}
                Emotions & Stress
              </span>
            </h1>

            <p className="text-lg md:text-xl text-teal-100 mb-10 leading-relaxed opacity-90"> {/* Increased bottom margin */}
              Our advanced AI technology analyzes your facial expressions in real-time,
              detecting emotions and stress levels to help you maintain mental wellness and productivity.
            </p>

            {/* Enhanced Button Style */}
            <Link
              to="/detector"
              className="inline-flex items-center space-x-3 bg-white text-teal-700 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-teal-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 group ring-2 ring-white/50 hover:ring-white" // Added ring effect
            >
              <span>Start Detection</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>

        {/* Removed the SVG curve - simplified for modern look */}
      </section>

      {/* Features Section */}
      {/* Adjusted padding and background */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight"> {/* Adjusted size & tracking */}
              Key Features
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"> {/* Increased max-width */}
              Discover how our technology helps you understand and manage your emotional wellbeing.
            </p>
          </div>

          {/* Adjusted gap and grid columns for better spacing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12">
            {features.map((feature, index) => (
              // Enhanced Card Design
              <div
                key={index}
                // Added subtle border, refined shadow, and hover effect
                className="group bg-gradient-to-br from-white to-teal-50/40 rounded-2xl p-8 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col items-start"
                // Added stagger animation style (requires CSS)
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'backwards' }}
                data-animate="fade-in-up-stagger" // Attribute for potential JS animation hook or just CSS
              >
                {/* Icon and Title - Adjusted layout */}
                <div className="flex items-center space-x-4 mb-5">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-900 tracking-tight"> {/* Adjusted size & tracking */}
                    {feature.title}
                  </h3>
                </div>

                <p className="text-gray-600 leading-relaxed flex-grow"> {/* Added flex-grow */}
                  {feature.description}
                </p>

                {/* Optional: Add a subtle decorative element */}
                 <div className="mt-6 h-1 w-12 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* Enhanced background and padding */}
      <section className="py-20 md:py-28 bg-gradient-to-r from-teal-600 via-cyan-600 to-emerald-600">
        <div className="max-w-4xl mx-auto px-6 text-center animate-fade-in-up"> {/* Added animation */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight"> {/* Adjusted size & tracking */}
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg md:text-xl text-teal-100 mb-10 leading-relaxed opacity-90"> {/* Increased bottom margin */}
            Begin tracking your emotions and stress levels today for a healthier, more balanced life.
          </p>
          {/* Reused enhanced button style */}
          <Link
            to="/detector"
            className="inline-flex items-center space-x-3 bg-white text-teal-700 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-teal-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 group ring-2 ring-white/50 hover:ring-white"
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


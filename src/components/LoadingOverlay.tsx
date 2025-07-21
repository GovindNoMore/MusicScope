import React, { useState, useEffect } from 'react';
import { Music, Search, Sparkles, TrendingUp } from 'lucide-react';

const LoadingOverlay: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { icon: Search, text: 'Analyzing your artists...', color: 'text-blue-400' },
    { icon: Music, text: 'Identifying genres...', color: 'text-green-400' },
    { icon: Sparkles, text: 'Finding patterns...', color: 'text-yellow-400' },
    { icon: TrendingUp, text: 'Generating recommendations...', color: 'text-pink-400' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 750);

    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50">
      <div className="text-center max-w-md mx-auto px-6">
        {/* Animated Vinyl Record */}
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto relative">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full animate-spin-slow">
              <div className="absolute inset-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full">
                <div className="absolute inset-6 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full flex items-center justify-center">
                  <Music className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Sound Waves */}
          <div className="absolute inset-0 flex items-center justify-center">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute border-2 border-pink-400/30 rounded-full animate-ping"
                style={{
                  width: `${160 + i * 40}px`,
                  height: `${160 + i * 40}px`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: '2s'
                }}
              />
            ))}
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-8">
          Decoding Your Musical DNA
        </h2>

        {/* Loading Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            
            return (
              <div
                key={index}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                  isActive 
                    ? 'bg-white/10 border border-white/20' 
                    : isCompleted 
                    ? 'bg-green-500/10 border border-green-500/20' 
                    : 'bg-white/5'
                }`}
              >
                <div className={`p-2 rounded-full ${
                  isActive 
                    ? 'bg-gradient-to-r from-pink-500 to-violet-500' 
                    : isCompleted 
                    ? 'bg-green-500' 
                    : 'bg-white/10'
                }`}>
                  <Icon className={`w-4 h-4 ${
                    isActive || isCompleted ? 'text-white' : 'text-white/50'
                  }`} />
                </div>
                <span className={`font-medium ${
                  isActive 
                    ? 'text-white' 
                    : isCompleted 
                    ? 'text-green-400' 
                    : 'text-white/50'
                }`}>
                  {step.text}
                </span>
                {isActive && (
                  <div className="ml-auto">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  </div>
                )}
                {isCompleted && (
                  <div className="ml-auto">
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-white/60 mt-6">
          This usually takes a few seconds...
        </p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
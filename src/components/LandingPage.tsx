import React from 'react';
import LandingBike from '../assets/LandingBike.jpg';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex overflow-hidden">
      <div className="w-1/2 flex items-center justify-center p-8">
        <div className="bg-dark-orange p-10 rounded-lg shadow-lg">
          <h1 className="text-white text-4xl font-bold mb-4">Find Your Perfect Ride</h1>
          <p className="text-white text-xl mb-4">
            Having trouble choosing a motorcycle? Take our quick 2-minute survey to discover options tailored just for you!
          </p>
          <p className="text-white mb-6">
            Our cutting-edge AI technology combs through countless bikes to bring you the best match for your style and needs.
          </p>
          <button className="bg-black text-white">
            Start Survey
          </button>
        </div>
      </div>

      <div className="w-1/2">
        <img
          src={LandingBike}
          alt="Landing Bike"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default LandingPage;

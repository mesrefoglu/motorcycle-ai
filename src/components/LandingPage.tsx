import React from 'react';
import LandingBike from '../assets/LandingBike.jpg';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();

  return (
    <div className="min-h-screen flex">
      <div className="w-2/3 flex items-center justify-center p-8">
        <div className="bg-dark-orange rounded-lg shadow-lg p-10">
          <h1 className="text-white text-4xl font-bold mb-4">Find Your Perfect Ride</h1>
          <p className="text-white text-xl mb-4">
            Having trouble choosing a motorcycle? Take our quick 3-minute survey to discover great options!
          </p>
          <p className="text-white mb-6">
            Our cutting-edge AI technology combs through countless bikes to bring you the best match for your style and needs.
          </p>
          <button className="bg-black text-white" onClick={() => navigate('/quiz')}>
            Start Survey
          </button>
        </div>
      </div>

      <div className="w-1/3">
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

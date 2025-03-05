import React from "react";
import LandingBike from "../assets/LandingBike.jpg";
import { useNavigate } from "react-router-dom";

const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="relative h-screen overflow-hidden">
            <img src={LandingBike} alt="Landing Bike" className="w-full h-screen md:w-screen object-cover" />
            <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="bg-dark-orange rounded-3xl shadow-lg p-8">
                    <p className="text-white text-4xl font-bold mb-4">Find Your Perfect Ride</p>
                    <p className="text-white text-xl">Having trouble choosing a motorcycle?</p>
                    <p className="text-white text-xl mb-4">Take our quick 3-minute survey to discover great options!</p>
                    <p className="text-white mb-6">
                        Our cutting-edge AI technology combs through countless bikes to bring you the best match for
                        your style and needs.
                    </p>
                    <button className="bg-black text-white" onClick={() => navigate("/quiz")}>
                        Start Survey
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;

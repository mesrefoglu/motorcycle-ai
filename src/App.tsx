// App.tsx
import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import QuizPage from "./components/Quiz";
import BikeResults from "./components/BikeResults";

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/quiz" element={<QuizPage />} />
                <Route path="/results" element={<BikeResults />} />
            </Routes>
        </Router>
    );
};

export default App;

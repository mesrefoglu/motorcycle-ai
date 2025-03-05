// App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import QuizPage from "./components/Quiz";
import BikeResults from "./components/BikeResults";

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/motorcycle-ai" element={<LandingPage />} />
                <Route path="/motorcycle-ai/quiz" element={<QuizPage />} />
                <Route path="/motorcycle-ai/results" element={<BikeResults />} />
            </Routes>
        </Router>
    );
};

export default App;

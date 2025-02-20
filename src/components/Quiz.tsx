import React, { useState, useEffect } from 'react';

interface Question {
  question: string;
  type: 'radio' | 'range' | 'number' | 'dropdown';
  options?: string[];
}

const quizQuestions: Question[] = [
  { question: "What is your riding experience level?", type: "radio", options: ["Beginner", "Intermediate", "Advanced"] },
  { question: "Enter your desired engine displacement range (CC):", type: "range" },
  { question: "What type of motorcycle are you interested in?", type: "radio", options: ["Sport", "Adventure", "Dirt", "General Use"] },
  { question: "Enter your budget range ($):", type: "range" },
  { question: "Would you consider used motorcycles?", type: "radio", options: ["Yes", "No"] },
  { question: "What is your weight? (lbs)", type: "number" },
  { question: "What is your height?", type: "dropdown", options: [
      "<5'0\"",
      "5'0\"",
      "5'1\"",
      "5'2\"",
      "5'3\"",
      "5'4\"",
      "5'5\"",
      "5'6\"",
      "5'7\"",
      "5'8\"",
      "5'9\"",
      "5'10\"",
      "5'11\"",
      "6'0\"",
      "6'1\"",
      "6'2\"",
      "6'3\"",
      "6'4\"",
      "6'5\"+"
    ] },
  { question: "What's your primary riding purpose?", type: "radio", options: ["Daily commuting", "Weekend rides", "Racing", "Touring"] }
];

type Answer = string | { min: string; max: string };

const Quiz: React.FC = () => {
  const initialAnswers = quizQuestions.map(q => q.type === 'range' ? { min: "", max: "" } : "");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>(initialAnswers);

  const handleRadioChange = (option: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = option;
    setAnswers(newAnswers);
  };

  const handleTextChange = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };

  const handleRangeChange = (field: "min" | "max", value: string) => {
    const newAnswers = [...answers];
    const currentAnswer = newAnswers[currentQuestion] as { min: string; max: string };
    newAnswers[currentQuestion] = { ...currentAnswer, [field]: value };
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) setCurrentQuestion(currentQuestion + 1);
    else console.log("Quiz completed", answers);
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") nextQuestion();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentQuestion, answers]);

  const current = quizQuestions[currentQuestion];

  return (
    <div className="min-w-screen min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-dark-orange rounded-lg shadow p-6 min-h-[350px] flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-4">{current.question}</h2>
          <div className="mb-4">
            {current.type === "radio" && current.options && current.options.map(option => (
              <label key={option} className="flex items-center mb-3">
                <input
                  type="radio"
                  name={`question-${currentQuestion}`}
                  value={option}
                  checked={answers[currentQuestion] === option}
                  onChange={() => handleRadioChange(option)}
                  className="form-radio h-5 w-5 color-black"
                />
                <span className="ml-2 text-white">{option}</span>
              </label>
            ))}
            {current.type === "number" && (
              <input
                type="number"
                value={answers[currentQuestion] as string}
                onChange={(e) => handleTextChange(e.target.value)}
                className="w-full p-2 border rounded bg-black text-white"
              />
            )}
            {current.type === "range" && (
              <div className="flex space-x-4">
                <input
                  type="number"
                  value={(answers[currentQuestion] as { min: string; max: string }).min}
                  onChange={(e) => handleRangeChange("min", e.target.value)}
                  placeholder="Min"
                  className="w-1/2 p-2 border rounded bg-black text-white"
                />
                <input
                  type="number"
                  value={(answers[currentQuestion] as { min: string; max: string }).max}
                  onChange={(e) => handleRangeChange("max", e.target.value)}
                  placeholder="Max"
                  className="w-1/2 p-2 border rounded bg-black text-white"
                />
              </div>
            )}
            {current.type === "dropdown" && current.options && (
              <select
                value={answers[currentQuestion] as string}
                onChange={(e) => handleTextChange(e.target.value)}
                className="w-full p-2 border rounded bg-black text-white"
              >
                <option value="" disabled>Select your height</option>
                {current.options.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            )}
          </div>
          <p className="text-xs text-gray-300">You may leave some questions blank.</p>
        </div>
        <div className="flex justify-between mt-4">
          {currentQuestion > 0 ? (
            <button onClick={prevQuestion} className="px-4 py-2 bg-white text-black">Back</button>
          ) : (
            <div className="w-20"></div>
          )}
          <button onClick={nextQuestion} className="px-4 py-2 bg-black text-white">
            {currentQuestion === quizQuestions.length - 1 ? "Submit" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;

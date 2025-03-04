import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

interface Question {
    question: string;
    type: "radio" | "range" | "number" | "dropdown" | "checkbox";
    options?: string[];
}

const quizQuestions: Question[] = [
    {
        question: "What is your riding experience level?",
        type: "radio",
        options: ["Beginner", "Intermediate", "Advanced"],
    },
    {
        question: "Enter your desired engine displacement range (CC):",
        type: "range",
    },
    {
        question: "What type of motorcycle are you interested in?",
        type: "checkbox",
        options: [
            "All-rounder",
            "Cruiser",
            "Sport",
            "Adventure / Offroad",
            "Classic",
            "Touring",
        ],
    },
    { question: "Enter your budget range ($):", type: "range" },
    {
        question: "Would you consider used motorcycles?",
        type: "radio",
        options: ["Yes", "No"],
    },
    {
        question: "How old would you like your bike to be? (years)",
        type: "range",
    },
    {
        question: "Which region are you in?",
        type: "radio",
        options: [
            "Asia",
            "Europe",
            "North America",
            "South America",
            "Africa",
            "Australia",
        ],
    },
    {
        question: "Which motorcycle brands are you interested in?",
        type: "checkbox",
        options: [
            "Aprilia",
            "Bajaj",
            "Benelli",
            "BMW",
            "Ducati",
            "Harley-Davidson",
            "Hero",
            "Honda",
            "Husqvarna",
            "Indian",
            "Italika",
            "Kawasaki",
            "KTM",
            "Kymco",
            "Lifan",
            "Motomel",
            "Moto Guzzi",
            "MV Agusta",
            "Royal Enfield",
            "Shineray",
            "Suzuki",
            "Triumph",
            "TVS",
            "Yamaha",
            "Zero",
        ],
    },
    { question: "What is your height? (cm)", type: "number" },
    { question: "What is your weight? (kg)", type: "number" },
];

type Answer = string | { min: string; max: string } | string[];

const Quiz: React.FC = () => {
    const initialAnswers = quizQuestions.map((q) =>
        q.type === "range"
            ? { min: "", max: "" }
            : q.type === "checkbox"
            ? []
            : ""
    );
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Answer[]>(initialAnswers);
    const navigate = useNavigate();

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
        const currentAnswer = newAnswers[currentQuestion] as {
            min: string;
            max: string;
        };
        newAnswers[currentQuestion] = { ...currentAnswer, [field]: value };
        setAnswers(newAnswers);
    };

    const handleCheckboxChange = (option: string) => {
        const newAnswers = [...answers];
        let currentAnswer = newAnswers[currentQuestion] as string[];
        if (currentAnswer.includes(option)) {
            currentAnswer = currentAnswer.filter((item) => item !== option);
        } else {
            currentAnswer = [...currentAnswer, option];
        }
        newAnswers[currentQuestion] = currentAnswer;
        setAnswers(newAnswers);
    };

    const nextQuestion = useCallback(() => {
        if (currentQuestion === 7 && answers[0] !== "Beginner") {
            navigate("/results", { state: { quizAnswers: answers } });
            return;
        }
        if (currentQuestion < quizQuestions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            navigate("/results", { state: { quizAnswers: answers } });
        }
    }, [currentQuestion, answers, navigate]);

    const prevQuestion = () => {
        if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Enter") nextQuestion();
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [nextQuestion]);

    const current = quizQuestions[currentQuestion];

    return (
        <div className="min-w-screen min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-dark-orange rounded-lg shadow p-6 h-[58vh] flex flex-col justify-between">
                <div>
                    <h2 className="text-xl font-semibold mb-4">
                        {current.question}
                    </h2>
                    <div>
                        {current.type === "radio" &&
                            current.options &&
                            current.options.map((option) => (
                                <label
                                    key={option}
                                    className="flex items-center mb-3"
                                >
                                    <input
                                        type="radio"
                                        name={`question-${currentQuestion}`}
                                        value={option}
                                        checked={
                                            answers[currentQuestion] === option
                                        }
                                        onChange={() =>
                                            handleRadioChange(option)
                                        }
                                        className="form-radio h-5 w-5 color-black"
                                    />
                                    <span className="ml-2 text-white">
                                        {option}
                                    </span>
                                </label>
                            ))}
                        {current.type === "checkbox" && current.options && (
                            <div className="max-h-54 overflow-y-auto">
                                {current.options.map((option) => (
                                    <label
                                        key={option}
                                        className="flex items-center mb-3"
                                    >
                                        <input
                                            type="checkbox"
                                            name={`question-${currentQuestion}`}
                                            value={option}
                                            checked={(
                                                answers[
                                                    currentQuestion
                                                ] as string[]
                                            ).includes(option)}
                                            onChange={() =>
                                                handleCheckboxChange(option)
                                            }
                                            className="form-checkbox h-5 w-5 color-black"
                                        />
                                        <span className="ml-2 text-white">
                                            {option}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        )}
                        {current.type === "number" && (
                            <input
                                type="number"
                                value={answers[currentQuestion] as string}
                                onChange={(e) =>
                                    handleTextChange(e.target.value)
                                }
                                className="w-full p-2 border rounded bg-black text-white"
                            />
                        )}
                        {current.type === "range" && (
                            <div className="mb-4 flex space-x-4">
                                <input
                                    type="number"
                                    value={
                                        (
                                            answers[currentQuestion] as {
                                                min: string;
                                                max: string;
                                            }
                                        ).min
                                    }
                                    onChange={(e) =>
                                        handleRangeChange("min", e.target.value)
                                    }
                                    placeholder="Min"
                                    className="w-1/2 p-2 border rounded bg-black text-white"
                                />
                                <input
                                    type="number"
                                    value={
                                        (
                                            answers[currentQuestion] as {
                                                min: string;
                                                max: string;
                                            }
                                        ).max
                                    }
                                    onChange={(e) =>
                                        handleRangeChange("max", e.target.value)
                                    }
                                    placeholder="Max"
                                    className="w-1/2 p-2 border rounded bg-black text-white"
                                />
                            </div>
                        )}
                        {current.type === "dropdown" && current.options && (
                            <select
                                value={answers[currentQuestion] as string}
                                onChange={(e) =>
                                    handleTextChange(e.target.value)
                                }
                                className="w-full p-2 border rounded bg-black text-white"
                            >
                                <option value="" disabled>
                                    Select your height
                                </option>
                                {current.options.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                    <p className="text-xs text-gray-300">
                        You can leave it blank if you don't want to answer.
                    </p>
                </div>
                <div className="flex justify-between mt-4">
                    {currentQuestion > 0 ? (
                        <button
                            onClick={prevQuestion}
                            className="px-4 py-2 bg-white text-black"
                        >
                            Back
                        </button>
                    ) : (
                        <div className="w-20"></div>
                    )}
                    <button
                        onClick={nextQuestion}
                        className="px-4 py-2 bg-black text-white"
                    >
                        {currentQuestion === quizQuestions.length - 1 ||
                        (answers[0] !== "Beginner" && currentQuestion === 7)
                            ? "Submit"
                            : "Next"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Quiz;

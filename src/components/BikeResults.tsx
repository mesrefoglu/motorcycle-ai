import React, { useState, useEffect, useMemo } from "react";
import Papa from "papaparse";
import { useLocation } from "react-router-dom";

// Brand arrays
const AllMotorcycleBrands = [
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
];
const CommonMotorcycleBrands = [
    "Aprilia",
    "BMW",
    "Ducati",
    "Harley-Davidson",
    "Honda",
    "Kawasaki",
    "KTM",
    "Kymco",
    "Moto Guzzi",
    "MV Agusta",
    "Royal Enfield",
    "Suzuki",
    "Triumph",
    "Yamaha",
    "Zero",
];
const AsianMotorcycleBrands = [
    "Bajaj",
    "Benelli",
    "Hero MotoCorp",
    "Husqvarna",
    "Indian",
    "Lifan",
    "Shineray",
    "TVS",
];
const EuropeanMotorcycleBrands = ["Benelli", "Indian", "Husqvarna", "Lifan"];
const NorthAmericanMotorcycleBrands = ["Husqvarna", "Indian"];
const SouthAmericanMotorcycleBrands = [
    "Bajaj",
    "Benelli",
    "Italika",
    "Lifan",
    "Motomel",
];
const AustralianMotorcycleBrands = ["Benelli", "Husqvarna", "Indian"];
const AfricanMotorcycleBrands = [
    "Bajaj",
    "Benelli",
    "Hero MotoCorp",
    "Lifan",
    "TVS",
    "Shineray",
];

interface QuizAnswers {
    [index: number]: string | { min: string; max: string } | string[];
}

interface FilterCriteria {
    minCC: number;
    maxCC: number;
    minPrice: number;
    maxPrice: number;
    maxSeatHeight: number;
    bannedCylinders: string[];
    interestedCategories: string[];
    allowedBrands: string[];
}

function computeFilterCriteria(quizAnswers: QuizAnswers): FilterCriteria {
    let minCC = 0;
    let maxCC = 5000;
    let minPrice = 0;
    let maxPrice = 100000;
    let maxSeatHeight = 5000;
    const bannedCylinders: string[] = [];
    const interestedCategories: string[] = [];
    let allowedBrands = [...CommonMotorcycleBrands];

    if (quizAnswers[0] === "Beginner") {
        maxCC = 610;
        bannedCylinders.push("4", "four", "6", "six", "8", "eight");
    } else if (quizAnswers[0] === "Intermediate") {
        minCC = 370;
        maxCC = 810;
        bannedCylinders.push("8", "eight");
    } else if (quizAnswers[0] === "Advanced") {
        minCC = 370;
    }

    const cCRange = quizAnswers[1] as { min: string; max: string };
    if (Number(cCRange.min)) {
        minCC = Math.max(minCC, parseInt(cCRange.min) - 10);
    }
    if (Number(cCRange.max)) {
        maxCC = Math.min(maxCC, parseInt(cCRange.max) + 10);
    }

    const types = Array.isArray(quizAnswers[2])
        ? (quizAnswers[2] as string[])
        : [];
    if (types.includes("All-rounder")) {
        interestedCategories.push("allround");
    }
    if (types.includes("Cruiser")) {
        interestedCategories.push("cruiser");
    }
    if (types.includes("Sport")) {
        interestedCategories.push("sport", "naked");
    }
    if (types.includes("Adventure / Offroad")) {
        interestedCategories.push(
            "motard",
            "enduro",
            "offroad",
            "cross",
            "motocross",
            "trial"
        );
    }
    if (types.includes("Classic")) {
        interestedCategories.push("classic");
    }
    if (types.includes("Touring")) {
        interestedCategories.push("touring");
    }

    const priceRange = quizAnswers[3] as { min: string; max: string };
    if (Number(priceRange.min)) {
        minPrice = parseInt(priceRange.min) * 0.9;
    }
    if (Number(priceRange.max)) {
        maxPrice = parseInt(priceRange.max) * 1.1;
    }

    const okWithUsed = quizAnswers[4] as string;
    if (okWithUsed === "Yes") {
        maxPrice *= 1.5;
    }

    const region = quizAnswers[5] as string;
    if (region === "Asia") {
        allowedBrands.push(...AsianMotorcycleBrands);
    } else if (region === "Europe") {
        allowedBrands.push(...EuropeanMotorcycleBrands);
    } else if (region === "North America") {
        allowedBrands.push(...NorthAmericanMotorcycleBrands);
    } else if (region === "South America") {
        allowedBrands.push(...SouthAmericanMotorcycleBrands);
    } else if (region === "Australia") {
        allowedBrands.push(...AustralianMotorcycleBrands);
    } else if (region === "Africa") {
        allowedBrands.push(...AfricanMotorcycleBrands);
    } else {
        allowedBrands = [...AllMotorcycleBrands];
    }
    const interestedBrands = Array.isArray(quizAnswers[6])
        ? (quizAnswers[6] as string[])
        : [];
    if (interestedBrands.length > 0) {
        allowedBrands = allowedBrands.filter((brand) =>
            interestedBrands.includes(brand)
        );
    }
    if ((quizAnswers[7] as string) !== "") {
        maxSeatHeight = parseInt(quizAnswers[7] as string) * 4.9;
    }
    if ((quizAnswers[8] as string) !== "") {
        const weight = parseInt(quizAnswers[8] as string);
        if (weight > 120) {
            minCC = Math.max(minCC, 490);
        } else if (weight > 100) {
            minCC = Math.max(minCC, 390);
        } else if (weight > 80) {
            minCC = Math.max(minCC, 290);
        } else if (weight > 70) {
            minCC = Math.max(minCC, 240);
        }
    }
    return {
        minCC,
        maxCC,
        minPrice,
        maxPrice,
        maxSeatHeight,
        bannedCylinders,
        interestedCategories,
        allowedBrands,
    };
}

function applyFilters(
    bike: { [key: string]: string },
    criteria: FilterCriteria
) {
    const bikeCC = parseInt(bike["Displacement (CC)"]);
    const bikePrice = parseInt(bike["Estimated MSRP (USD)"]);
    const bikeSeatHeight = parseInt(bike["Seat Height (mm)"]);

    if (bikeCC < criteria.minCC || bikeCC > criteria.maxCC) return false;
    if (bikePrice < criteria.minPrice || bikePrice > criteria.maxPrice)
        return false;

    for (const bannedCylinder of criteria.bannedCylinders) {
        if (bike["Engine Cylinder"].toLowerCase().includes(bannedCylinder))
            return false;
    }

    if (criteria.interestedCategories.length > 0) {
        let foundCategory = false;
        for (const category of criteria.interestedCategories) {
            if (bike["Category"].toLowerCase().includes(category)) {
                foundCategory = true;
                break;
            }
        }
        if (!foundCategory) return false;
    }

    if (!criteria.allowedBrands.some((brand) => bike["Brand"].includes(brand)))
        return false;
    if (bikeSeatHeight > criteria.maxSeatHeight) return false;

    return true;
}

type Bike = { [key: string]: string };

const BikeResults: React.FC = () => {
    const location = useLocation();
    const quizAnswers = location.state?.quizAnswers;
    const [bikes, setBikes] = useState<Bike[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const filterCriteria = useMemo(
        () => computeFilterCriteria(quizAnswers),
        [quizAnswers]
    );

    useEffect(() => {
        fetch("/src/assets/bikes.csv")
            .then((response) => response.text())
            .then((csvText) => {
                Papa.parse<Bike>(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        const filtered = results.data.filter((bike) =>
                            applyFilters(bike, filterCriteria)
                        );
                        setBikes(filtered);
                    },
                });
            });
    }, [filterCriteria]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft")
                setCurrentIndex((idx) => (idx > 0 ? idx - 1 : idx));
            if (e.key === "ArrowRight")
                setCurrentIndex((idx) =>
                    idx < bikes.length - 1 ? idx + 1 : idx
                );
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [bikes]);

    if (bikes.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold text-orange-500 mb-2">
                        No Bikes Found
                    </h1>
                    <p className="text-gray-400">
                        Please try again with different preferences.
                    </p>
                </div>
            </div>
        );
    }

    const bike = bikes[currentIndex];

    return (
        <div className="min-h-screen flex bg-black p-4 items-center">
            <div className="relative w-[30vw] h-[95vh] bg-gray-900 rounded-lg p-6">
                <div className="h-10 overflow-hidden text-center">
                    <h2 className="text-2xl font-bold text-orange-500 truncate">
                        {bike.Brand} {bike.Model}
                    </h2>
                </div>
                <div className="mt-4 overflow-y-auto h-[calc(95vh-10rem)]">
                    <div className="grid grid-cols-2 gap-4">
                        {Object.entries(bike).map(([key, value]) => {
                            if (key === "Brand" || key === "Model") return null;
                            return (
                                <div
                                    key={key}
                                    className="p-2 bg-gray-800 rounded border border-gray-700"
                                >
                                    <p className="text-sm font-semibold text-gray-400">
                                        {key}
                                    </p>
                                    <p className="text-gray-200">
                                        {key === "Estimated MSRP (USD)"
                                            ? "$" +
                                              Number(value).toLocaleString()
                                            : !value
                                            ? "No info."
                                            : value}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="absolute bottom-6 left-6">
                    <button
                        onClick={() =>
                            setCurrentIndex((idx) => (idx > 0 ? idx - 1 : idx))
                        }
                        className="bg-orange-500 text-black rounded transition"
                    >
                        <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </button>
                </div>
                <div className="absolute bottom-6 right-6">
                    <button
                        onClick={() =>
                            setCurrentIndex((idx) =>
                                idx < bikes.length - 1 ? idx + 1 : idx
                            )
                        }
                        className="bg-orange-500 text-black rounded transition"
                    >
                        <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </button>
                </div>
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-300 font-medium text-lg">
                    {currentIndex + 1} / {bikes.length}
                </div>
            </div>

            <div className="w-[25vw] h-[95vh] ml-8 bg-gray-800 rounded-lg shadow-xl p-6 flex flex-col">
                <button className="mb-4 px-4 py-2 bg-orange-500 text-black rounded transition">
                    Why this bike?
                </button>
                <textarea
                    className="flex-1 bg-gray-900 text-gray-200 p-4 rounded border border-gray-700 resize-none"
                    placeholder=""
                    readOnly
                />
            </div>
        </div>
    );
};

export default BikeResults;

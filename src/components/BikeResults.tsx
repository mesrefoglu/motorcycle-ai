import React, { useState, useEffect, useMemo } from "react";
import Papa from "papaparse";
import { useLocation } from "react-router-dom";

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
        minPrice = parseInt(priceRange.min) - 1000;
    }
    if (Number(priceRange.max)) {
        maxPrice = parseInt(priceRange.max) + 1000;
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
    const interestedBrands = Array.isArray(quizAnswers[7])
        ? (quizAnswers[6] as string[])
        : [];
    if (interestedBrands.length > 0) {
        allowedBrands = allowedBrands.filter((brand) =>
            interestedBrands.includes(brand)
        );
    }
    if ((quizAnswers[7] as string) !== "") {
        maxSeatHeight = parseInt(quizAnswers[8] as string) * 4.9;
    }
    if ((quizAnswers[8] as string) !== "") {
        const weight = parseInt(quizAnswers[9] as string);
        if (weight > 120) {
            minCC = Math.min(minCC, 490);
        } else if (weight > 100) {
            minCC = Math.min(minCC, 390);
        } else if (weight > 80) {
            minCC = Math.min(minCC, 290);
        } else if (weight > 70) {
            minCC = Math.min(minCC, 240);
        }
    }
    const filterCriteria = {
        minCC,
        maxCC,
        minPrice,
        maxPrice,
        maxSeatHeight,
        bannedCylinders,
        interestedCategories,
        allowedBrands,
    };

    console.log(filterCriteria);
    return filterCriteria;
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
            <div className="min-h-screen flex items-center justify-center text-white">
                No bikes found. Please try again with different preferences.
            </div>
        );
    }
    const bike = bikes[currentIndex];
    return (
        <div className="min-h-screen min-w-screen flex items-center justify-center p-4 relative">
            <div className="bg-dark-orange rounded-lg p-6 text-white w-[80vh]">
                <div className="mb-6 text-center">
                    <h2 className="text-2xl font-bold">
                        {bike.Brand} {bike.Model}
                    </h2>
                </div>
                <div className="overflow-auto h-[52vh]">
                    <table className="w-full text-sm">
                        <tbody>
                            {Object.entries(bike).map(([key, value]) => {
                                if (
                                    !value ||
                                    key === "Brand" ||
                                    key === "Model"
                                )
                                    return null;
                                return (
                                    <tr key={key}>
                                        <td className="border px-2 py-1 font-semibold w-1/3">
                                            {key}
                                        </td>
                                        <td className="border px-2 py-1">
                                            {key === "Estimated MSRP (USD)"
                                                ? "$" +
                                                  Number(
                                                      value
                                                  ).toLocaleString() +
                                                  " (likely inaccurate, used may be cheaper)"
                                                : value}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="mt-4 text-center text-lg">
                    {currentIndex + 1} / {bikes.length}
                </div>
            </div>
            <button
                onClick={() =>
                    setCurrentIndex((idx) => (idx > 0 ? idx - 1 : idx))
                }
                className="absolute left-40 flex items-center p-2 bg-orange-500 hover:bg-orange-600"
            >
                <svg
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={4}
                        d="M15 19l-7-7 7-7"
                    />
                </svg>
            </button>
            <button
                onClick={() =>
                    setCurrentIndex((idx) =>
                        idx < bikes.length - 1 ? idx + 1 : idx
                    )
                }
                className="absolute right-40 flex items-center p-2 bg-orange-500 hover:bg-orange-600"
            >
                <svg
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={4}
                        d="M9 5l7 7-7 7"
                    />
                </svg>
            </button>
        </div>
    );
};

export default BikeResults;

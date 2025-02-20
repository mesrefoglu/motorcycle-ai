import React, { useState, useEffect } from "react";
import Papa from "papaparse";

type Bike = { [key: string]: string };

const formatBrand = (brand: string) =>
    brand.charAt(0).toUpperCase() + brand.slice(1).toLowerCase();

const formatModel = (model: string) =>
    model
        .split(" ")
        .map((word) => {
            const letterCount = word.replace(/[^A-Za-z]/g, "").length;
            if (letterCount <= 2) {
                if (word.charAt(0).toLowerCase() === "i") {
                    return word.charAt(0) + word.slice(1).toUpperCase();
                } else if (word.charAt(1).toLowerCase() === "i") {
                    return word.charAt(0).toUpperCase() + word.slice(1);
                } else return word.toUpperCase();
            } else {
                if (word.charAt(0).toLowerCase() === "i") {
                    return word;
                } else
                    return (
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase()
                    );
            }
        })
        .join(" ");

const BikeResults: React.FC = () => {
    const [bikes, setBikes] = useState<Bike[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        fetch("/src/assets/bikes.csv")
            .then((response) => response.text())
            .then((csvText) => {
                Papa.parse<Bike>(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        const filtered = results.data.filter(
                            (bike) => parseInt(bike.Year) >= 1999
                        );
                        setBikes(filtered);
                    },
                });
            });
    }, []);

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
                Loading bikes...
            </div>
        );
    }

    const bike = bikes[currentIndex];

    return (
        <div className="min-h-screen min-w-screen flex items-center justify-center p-4 relative">
            <div className="bg-dark-orange rounded-lg p-6 text-white w-[90vh]">
                <div className="mb-4 text-center">
                    <h2 className="text-3xl font-bold">
                        {formatBrand(bike.Brand)} {formatModel(bike.Model)} (
                        {bike.Year})
                    </h2>
                </div>
                <div className="overflow-auto h-[40vh]">
                    <table className="w-full text-sm">
                        <tbody>
                            {Object.entries(bike).map(([key, value]) => {
                                if (!value || value.length >= 70) return null;
                                let displayValue = value;
                                if (key.toLowerCase() === "brand") {
                                    displayValue = formatBrand(value);
                                }
                                if (key.toLowerCase() === "model") {
                                    displayValue = formatModel(value);
                                }
                                return (
                                    <tr key={key}>
                                        <td className="border px-2 py-1 font-semibold w-1/3">
                                            {key}
                                        </td>
                                        <td className="border px-2 py-1">
                                            {displayValue}
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

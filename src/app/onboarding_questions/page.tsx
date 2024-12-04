// Add this line to mark the component as a client-side component
"use client"; 

import React, { useState } from "react";
import { useRouter } from "next/router";
import { FaMale, FaFemale, FaGlobe, FaUserGraduate, FaBrain, FaHandsHelping, FaBook, FaAward, FaRunning, FaFlagCheckered, FaMedal } from "react-icons/fa";

// Example of onboarding questions
const questions = [
  {
    id: "gender",
    question: "What is your gender?",
    options: ["Male", "Female"],
    icons: [<FaMale />, <FaFemale />]
  },
  // Add other questions here...
];

const Onboarding = () => {
  const router = useRouter(); // Ensure you use useRouter here

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const current = questions[currentQuestion];

  const handleOptionSelect = (option: string) => {
    const newAnswers = { ...answers, [current.id]: option };
    setAnswers(newAnswers);
    // Handle any further logic for each option selected...
  };

  const handleNext = () => {
    setCurrentQuestion((prev) => prev + 1);
  };

  const handleSubmit = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      const formattedData = { /* your formatted data here */ };
      console.log("Submitting data:", formattedData);

      const response = await fetch("https://your-api-endpoint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formattedData),
      });

      const data = await response.json();
      console.log("Profile creation response:", data);

      if (response.ok) {
        router.push("/dashboard"); // Navigate to dashboard on success
      } else {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Error during profile creation:", error);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-green-600 mb-8">Let's take some quick questions!</h1>
      
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl text-green-800 font-semibold mb-6">{current.question}</h2>
        
        <div className="grid grid-cols-2 gap-4">
          {current.options.map((option, index) => (
            <button
              key={option}
              className={`p-4 bg-green-100 border border-green-300 rounded-lg shadow transform transition duration-300 ${
                answers[current.id] === option ? "bg-green-300 scale-105" : "hover:scale-105"
              }`}
              onClick={() => handleOptionSelect(option)}
            >
              <div className="text-green-600 text-3xl mb-2">
                {current.icons[index]}
              </div>
              <span className="text-green-800 font-medium">{option}</span>
            </button>
          ))}
        </div>

        <div className="mt-8 flex justify-between">
          {currentQuestion > 0 && (
            <button
              className="px-6 py-2 bg-green-400 text-white font-bold rounded shadow hover:bg-green-500"
              onClick={() => setCurrentQuestion((prev) => prev - 1)}
            >
              Back
            </button>
          )}
          {currentQuestion < questions.length - 1 ? (
            <button
              className="px-6 py-2 bg-green-500 text-white font-bold rounded shadow hover:bg-green-600"
              onClick={handleNext}
              disabled={!answers[current.id]}
            >
              Next
            </button>
          ) : (
            <button
              className="px-6 py-2 bg-green-700 text-white font-bold rounded shadow hover:bg-green-800"
              onClick={handleSubmit}
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
 
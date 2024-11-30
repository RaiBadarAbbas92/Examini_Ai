"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/SiderBar/page';

const ExamTypeSelectionPage = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [numberOfQuestions, setNumberOfQuestions] = useState<number>(10);
  const [difficultyLevel, setDifficultyLevel] = useState<number>(3);
  const [isTimed, setIsTimed] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(60);
  const [marksPerQuestion, setMarksPerQuestion] = useState<number>(5);
  const [difficultyOptionsVisible, setDifficultyOptionsVisible] = useState<boolean>(false);
  const router = useRouter();

  const totalMarks = numberOfQuestions * marksPerQuestion;

  const getDifficultyString = (level: number) => {
    if (level === 1) return "easy";
    if (level === 3) return "medium";
    if (level === 5) return "hard";
    return "medium";
  };

  const getQuestionType = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'MCQs': 'MCQ',
      'Short Questions': 'Short',
      'Long Questions': 'Essay',
      'Coding Problems': 'CodingProblem',
      'Case Studies': 'CaseStudy',
      'True/False': 'TrueFalse'
    };
    return typeMap[type] || type;
  };
  
  const handleTypeSelect = (type: string) => {
    console.log('Selected exam type:', type);
    setSelectedType(type);
  };

  const handleNextClick = () => {
    try {
      const selectedContentIds = JSON.parse(localStorage.getItem('selected_content_ids') || '[]');

      // Store exam parameters in localStorage
      const examParams = {
        selectedContentIds,
        examType: selectedType ? getQuestionType(selectedType) : "MCQ",
        numberOfQuestions,
        difficulty: getDifficultyString(difficultyLevel),
        isTimed,
        duration: isTimed ? duration : 0,
        marksPerQuestion,
        totalMarks,
        language: "english"
      };
      localStorage.setItem('examParameters', JSON.stringify(examParams));

      // Redirect to ExamGeneration page
      router.push('/ExamGenration');

    } catch (error) {
      console.error("Error storing exam parameters:", error);
    }
  };

  const handleDifficultyChange = async (level: number) => {
    console.log('Selected difficulty level:', level);
    setDifficultyLevel(level);
    setDifficultyOptionsVisible(false);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.backgroundImage = "linear-gradient(to left, rgba(72, 187, 120, 0.7), rgba(255, 255, 255, 0.8))";
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.backgroundImage = "linear-gradient(to right, rgba(72, 187, 120, 0.5), rgba(255, 255, 255, 0.7))";
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-[240px]">
        <div className="flex flex-col items-center p-8 min-h-screen bg-gradient-to-r from-green-100 to-white">
          <header className="text-center mb-6">
            <div className="text-center mb-6">
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-green-800 to-green-600 text-transparent bg-clip-text mb-4 leading-tight">
                Set Exam Parameters Page
              </h1>
              <p className="text-gray-600 mt-2">
                Choose the exam type and set your preferences for the exam. You can customize the number of questions, difficulty, and more.
              </p>
              {/* Gradient Line */}
              <div className="w-full mt-4 h-1 bg-gradient-to-r from-green-400 via-teal-300 to-blue-300"></div>

              {/* Stylish decorative line below the description */}
              <div className="w-full mt-4 h-1 bg-gradient-to-r from-yellow-300 via-red-300 to-pink-300 opacity-50 border-t-4 border-dashed border-gray-300"></div>
            </div>
          </header>

          {!selectedType ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-6 justify-items-center">
              {/* Question Type Selection */}
              {['MCQs', 'Short Questions', 'Long Questions', 'Coding Problems', 'Case Studies', 'True/False'].map((type) => (
                <div
                  key={type}
                  className="p-4 w-72 h-48 max-w-full border-4 border-green-200 rounded-lg shadow-xl cursor-pointer flex flex-col justify-center items-center text-center transition-all duration-300 ease-in-out hover:shadow-2xl backdrop-blur-sm"
                  onClick={() => handleTypeSelect(type)}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  style={{ 
                    backgroundImage: "linear-gradient(to right, rgba(72, 187, 120, 0.5), rgba(255, 255, 255, 0.7))",
                    backdropFilter: "blur(8px)"
                  }}
                >
                  <h2 className="text-xl text-center font-semibold text-gray-700">{type}</h2>
                </div>
              ))}
            </div>
          ) : (
            <section className="space-y-4 w-full max-w-5xl mx-auto">
              <h3 className="text-2xl font-semibold text-green-600 mb-4">Additional Parameters</h3>

              {/* Number of Questions */}
              <div className="flex items-center justify-between">
                <label className="text-lg">Total Number of Questions</label>
                <input
                  type="number"
                  className="w-32 p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-green-400"
                  value={numberOfQuestions}
                  onChange={(e) => {
                    console.log('Number of questions changed:', +e.target.value);
                    setNumberOfQuestions(+e.target.value);
                  }}
                  min={1}
                  max={100}
                />
              </div>

              {/* Difficulty Level */}
              <div className="flex items-center justify-between">
                <label className="text-lg">Difficulty Level</label>

                {/* Difficulty options visible all the time */}
                <div className="flex space-x-4 mt-2">
                  {/* Easy Button */}
                  <button
                    onClick={() => handleDifficultyChange(1)}
                    className={`relative bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-green-600 transition-all ${difficultyLevel === 1 ? 'border-4 border-white' : ''}`}
                  >
                    {difficultyLevel === 1 && (
                      <span className="absolute left-2 top-2 text-white text-lg">✔</span>
                    )}
                    Easy
                  </button>

                  {/* Medium Button */}
                  <button
                    onClick={() => handleDifficultyChange(3)}
                    className={`relative bg-yellow-400 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-yellow-500 transition-all ${difficultyLevel === 3 ? 'border-4 border-white' : ''}`}
                  >
                    {difficultyLevel === 3 && (
                      <span className="absolute left-2 top-2 text-white text-lg">✔</span>
                    )}
                    Medium
                  </button>

                  {/* Hard Button */}
                  <button
                    onClick={() => handleDifficultyChange(5)}
                    className={`relative bg-red-400 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-500 transition-all ${difficultyLevel === 5 ? 'border-4 border-white' : ''}`}
                  >
                    {difficultyLevel === 5 && (
                      <span className="absolute left-2 top-2 text-white text-lg">✔</span>
                    )}
                    Hard
                  </button>
                </div>
              </div>

              {/* Time Limit */}
              <div className="flex items-center justify-between">
                <label className="text-lg">Time Limit</label>
                <input
                  type="checkbox"
                  checked={isTimed}
                  onChange={() => {
                    console.log('Time limit toggled:', !isTimed);
                    setIsTimed(!isTimed);
                  }}
                  className="form-checkbox h-5 w-5 text-green-500"
                />
                {isTimed && (
                  <input
                    type="number"
                    className="w-32 p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-green-400"
                    value={duration}
                    onChange={(e) => {
                      console.log('Duration changed:', +e.target.value);
                      setDuration(+e.target.value);
                    }}
                    min={1}
                    max={180}
                  />
                )}
              </div>

              {/* Marks Per Question */}
              <div className="flex items-center justify-between">
                <label className="text-lg">Marks per Question</label>
                <input
                  type="number"
                  className="w-32 p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-green-400"
                  value={marksPerQuestion}
                  onChange={(e) => {
                    console.log('Marks per question changed:', +e.target.value);
                    setMarksPerQuestion(+e.target.value);
                  }}
                  min={1}
                />
              </div>

              {/* Total Marks Display */}
              <div className="mt-6 flex justify-center items-center">
                <div className="bg-gradient-to-r from-green-500 to-teal-400 text-white text-3xl font-bold py-4 px-10 rounded-lg shadow-lg transform transition duration-300 hover:scale-105">
                  Total Marks: <span className="text-4xl">{totalMarks}</span>
                </div>
              </div>

              {/* Next Button */}
              <footer className="text-center mt-6">
                <button
                  onClick={handleNextClick}
                  className="bg-green-500 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-green-600 transition-all"
                >
                  Next
                </button>
              </footer>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamTypeSelectionPage;
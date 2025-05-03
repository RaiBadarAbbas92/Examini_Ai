"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/SiderBar/page';
import { FaCheckCircle, FaQuestionCircle, FaClipboardList, FaHourglassHalf, FaTrophy, FaArrowRight } from 'react-icons/fa';

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
    const examType = getQuestionType(type);
    localStorage.setItem('selectedExamType', examType)
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
        duration: isTimed ? duration : 60,
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

  // Function to get icon based on exam type
  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'MCQs': return <FaCheckCircle className="text-4xl mb-3 text-emerald-500" />;
      case 'Short Questions': return <FaQuestionCircle className="text-4xl mb-3 text-blue-500" />;
      case 'Long Questions': return <FaClipboardList className="text-4xl mb-3 text-purple-500" />;
      case 'Coding Problems': return <div className="text-4xl mb-3 text-amber-500">&#60;/&#62;</div>;
      case 'Case Studies': return <div className="text-4xl mb-3 text-pink-500">📊</div>;
      case 'True/False': return <div className="text-4xl mb-3 text-teal-500">✓/✗</div>;
      default: return <FaQuestionCircle className="text-4xl mb-3 text-gray-500" />;
    }
  };

  // Floating particles animation
  const renderParticles = () => {
    return Array.from({ length: 20 }).map((_, index) => (
      <div
        key={index}
        className="absolute rounded-full bg-gradient-to-r from-green-300 to-blue-300 opacity-30"
        style={{
          width: `${Math.random() * 20 + 5}px`,
          height: `${Math.random() * 20 + 5}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `float ${Math.random() * 10 + 10}s linear infinite`,
          animationDelay: `${Math.random() * 5}s`
        }}
      />
    ));
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-[240px]">
        <div className="relative flex flex-col items-center p-8 min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 overflow-hidden">
          {/* Animated background particles */}
          {renderParticles()}

          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-r from-green-300 to-blue-300 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-60 h-60 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full opacity-10 blur-3xl"></div>

          <header className="relative z-10 text-center mb-10 w-full max-w-4xl">
            <div className="text-center mb-8">
              <h1 className="text-5xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-500 text-transparent bg-clip-text mb-4 leading-tight tracking-tight">
                Design Your Perfect Exam
              </h1>
              <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
                Customize your assessment experience by selecting the question format and tailoring parameters to match your educational objectives.
              </p>

              {/* Animated gradient line */}
              <div className="w-full max-w-xl mx-auto mt-6 h-1 bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-300 rounded-full"></div>
            </div>
          </header>

          {!selectedType ? (
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10 justify-items-center">
              {/* Question Type Selection */}
              {['MCQs', 'Short Questions', 'Long Questions', 'Coding Problems', 'Case Studies', 'True/False'].map((type) => (
                <div
                  key={type}
                  className="p-6 w-80 h-56 max-w-full border border-gray-100 rounded-2xl shadow-xl cursor-pointer flex flex-col justify-center items-center text-center transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-105 backdrop-blur-md"
                  onClick={() => handleTypeSelect(type)}
                  style={{
                    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.6))",
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                >
                  {getTypeIcon(type)}
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">{type}</h2>
                  <div className="w-16 h-1 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full mx-auto mb-3"></div>
                  <p className="text-gray-600 text-sm">Select to customize your {type.toLowerCase()}</p>
                </div>
              ))}
            </div>
          ) : (
            <section className="relative z-10 w-full max-w-4xl mx-auto bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg">
                  {getTypeIcon(selectedType)}
                </div>
                <div className="ml-4">
                  <h3 className="text-2xl font-bold text-gray-800">Customize Your {selectedType}</h3>
                  <p className="text-gray-600">Fine-tune your exam parameters</p>
                </div>
              </div>

              <div className="space-y-8">
                {/* Number of Questions */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-xl shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FaClipboardList className="text-emerald-500 text-xl mr-3" />
                      <label className="text-lg font-medium text-gray-700">Total Number of Questions</label>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        className="w-32 p-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 text-center font-medium text-gray-700"
                        value={numberOfQuestions}
                        onChange={(e) => {
                          console.log('Number of questions changed:', +e.target.value);
                          setNumberOfQuestions(+e.target.value);
                        }}
                        min={1}
                        max={100}
                      />
                      <div className="absolute -bottom-5 right-0 text-xs text-gray-500">Max: 100</div>
                    </div>
                  </div>
                </div>

                {/* Difficulty Level */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-xl shadow-sm">
                  <div className="flex items-center mb-4">
                    <FaTrophy className="text-emerald-500 text-xl mr-3" />
                    <label className="text-lg font-medium text-gray-700">Difficulty Level</label>
                  </div>

                  {/* Difficulty options with improved styling */}
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    {/* Easy Button */}
                    <button
                      onClick={() => handleDifficultyChange(1)}
                      className={`relative p-4 rounded-xl shadow-md transition-all duration-300 ${
                        difficultyLevel === 1
                          ? 'bg-gradient-to-r from-green-500 to-green-400 text-white transform scale-105'
                          : 'bg-white text-gray-700 hover:bg-green-50'
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        {difficultyLevel === 1 && (
                          <FaCheckCircle className="absolute top-2 right-2 text-white text-sm" />
                        )}
                        <span className="text-2xl mb-1">🌱</span>
                        <span className="font-medium">Easy</span>
                      </div>
                    </button>

                    {/* Medium Button */}
                    <button
                      onClick={() => handleDifficultyChange(3)}
                      className={`relative p-4 rounded-xl shadow-md transition-all duration-300 ${
                        difficultyLevel === 3
                          ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-white transform scale-105'
                          : 'bg-white text-gray-700 hover:bg-yellow-50'
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        {difficultyLevel === 3 && (
                          <FaCheckCircle className="absolute top-2 right-2 text-white text-sm" />
                        )}
                        <span className="text-2xl mb-1">🌿</span>
                        <span className="font-medium">Medium</span>
                      </div>
                    </button>

                    {/* Hard Button */}
                    <button
                      onClick={() => handleDifficultyChange(5)}
                      className={`relative p-4 rounded-xl shadow-md transition-all duration-300 ${
                        difficultyLevel === 5
                          ? 'bg-gradient-to-r from-red-500 to-red-400 text-white transform scale-105'
                          : 'bg-white text-gray-700 hover:bg-red-50'
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        {difficultyLevel === 5 && (
                          <FaCheckCircle className="absolute top-2 right-2 text-white text-sm" />
                        )}
                        <span className="text-2xl mb-1">🌳</span>
                        <span className="font-medium">Hard</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Time Limit */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-xl shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FaHourglassHalf className="text-emerald-500 text-xl mr-3" />
                      <label className="text-lg font-medium text-gray-700">Time Limit</label>
                    </div>
                    <div className="flex items-center space-x-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isTimed}
                          onChange={() => {
                            console.log('Time limit toggled:', !isTimed);
                            setIsTimed(!isTimed);
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                        <span className="ml-3 text-sm font-medium text-gray-700">{isTimed ? 'Enabled' : 'Disabled'}</span>
                      </label>

                      {isTimed && (
                        <div className="relative">
                          <input
                            type="number"
                            className="w-32 p-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 text-center font-medium text-gray-700"
                            value={duration}
                            onChange={(e) => {
                              console.log('Duration changed:', +e.target.value);
                              setDuration(+e.target.value);
                            }}
                            min={1}
                            max={180}
                          />
                          <div className="absolute -bottom-5 right-0 text-xs text-gray-500">Minutes</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Marks Per Question */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-xl shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FaTrophy className="text-emerald-500 text-xl mr-3" />
                      <label className="text-lg font-medium text-gray-700">Marks per Question</label>
                    </div>
                    <input
                      type="number"
                      className="w-32 p-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 text-center font-medium text-gray-700"
                      value={marksPerQuestion}
                      onChange={(e) => {
                        console.log('Marks per question changed:', +e.target.value);
                        setMarksPerQuestion(+e.target.value);
                      }}
                      min={1}
                    />
                  </div>
                </div>

                {/* Total Marks Display */}
                <div className="flex justify-center items-center my-8">
                  <div className="relative bg-gradient-to-r from-emerald-500 to-teal-400 text-white text-3xl font-bold py-6 px-12 rounded-xl shadow-lg transform transition duration-300 hover:scale-105 overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-20">
                      <div className="absolute top-0 left-0 w-20 h-20 rounded-full bg-white opacity-20"></div>
                      <div className="absolute bottom-0 right-0 w-16 h-16 rounded-full bg-white opacity-20"></div>
                    </div>
                    <div className="relative z-10">
                      Total Marks: <span className="text-5xl ml-2">{totalMarks}</span>
                    </div>
                  </div>
                </div>

                {/* Next Button */}
                <div className="text-center mt-8">
                  <button
                    onClick={handleNextClick}
                    className="group relative bg-gradient-to-r from-emerald-500 to-teal-400 text-white px-10 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-medium text-lg"
                  >
                    <span className="flex items-center justify-center">
                      Continue to Exam Generation
                      <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamTypeSelectionPage;
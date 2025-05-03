"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/SiderBar/page";
import Loader from "../components/lodder";
import { API_BASE_URL } from '@/utils/apiConfig';
import {
  FaCheckCircle, FaTimesCircle, FaArrowLeft, FaRocket,
  FaClipboardList, FaHourglassHalf, FaTrophy, FaChartBar,
  FaLightbulb, FaGraduationCap, FaSpinner
} from 'react-icons/fa';

const ExamGenerationAndConfirmationPage = () => {
  const [loading, setLoading] = useState(false);
  const [examParams, setExamParams] = useState<any>(null);
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Get exam parameters from localStorage
    const params = localStorage.getItem('examParameters');
    if (params) {
      setExamParams(JSON.parse(params));
    }
  }, []);

  const handleGenerateExam = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const selectedContentIds = JSON.parse(localStorage.getItem('selected_content_ids') || '[]');
      const examType = localStorage.getItem('selectedExamType'); // Retrieve exam type

      if (!token || !examParams || !selectedContentIds.length || !examType) {
        throw new Error('Missing authentication token, exam parameters, content IDs, or exam type');
      }

      const requestBody = {
        selected_content_ids: selectedContentIds,
        title: "Generated Exam",
        questions_type: examParams.examType,
        difficulty: examParams.difficulty,
        num_questions: examParams.numberOfQuestions,
        marks_per_question: examParams.marksPerQuestion,
        time_limit: examParams.isTimed ? examParams.duration : 0,
        language: examParams.language || "en",
      };

      console.log('Request Body:', requestBody);

      const response = await fetch(
        `${API_BASE_URL}/exams/create_exam/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.message || 'Failed to generate exam');
      }

      const data = await response.json();
      console.log('Exam generated successfully:', data);

      localStorage.setItem('exam-id', data.id);

      setMessage({ text: 'Exam generated successfully!', type: 'success' });

      // Dynamic redirect based on exam type
      setTimeout(() => {
        const redirectUrl = `/exam/${examType.toLowerCase()}`; // Construct dynamic URL
        router.push(redirectUrl);
      }, 2000);
    } catch (error: unknown) {
      console.error('Error generating exam:', error);
      setMessage({
        text: (error as Error).message || 'Failed to generate exam. Please try again.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };


  const handleCancel = () => {
    setMessage(null);
  };

  if (!examParams) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-[240px]'}`}>
        <div className="min-h-screen w-full bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col items-center justify-center p-8 text-gray-800">
          {loading && <Loader />}

          {/* Top Navigation Bar */}
          <div className="w-full max-w-4xl mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-700 transition-colors shadow-sm mb-6"
            >
              <FaArrowLeft className="text-gray-500" />
              <span className="text-sm font-medium">Back</span>
            </button>
          </div>

          {/* Page Header */}
          <header className="text-center mb-10 w-full max-w-4xl">
            <div className="relative mb-6">
              <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent"></div>
              <h1 className="relative inline-block px-6 bg-gradient-to-br from-emerald-50 via-white to-teal-50 text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">
                Confirm Your Exam Setup
              </h1>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Review your settings and confirm to proceed. We'll generate your personalized exam based on these parameters.
            </p>
          </header>

          {/* Message Display */}
          {message && (
            <div className={`w-full max-w-3xl mb-6 p-4 rounded-xl shadow-sm ${
              message.type === 'success'
                ? 'bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700'
                : 'bg-red-50 border-l-4 border-red-500 text-red-700'
            }`}>
              <div className="flex items-center">
                {message.type === 'success' ? (
                  <FaCheckCircle className="w-5 h-5 mr-3 text-emerald-500" />
                ) : (
                  <FaTimesCircle className="w-5 h-5 mr-3 text-red-500" />
                )}
                <p className="font-medium">{message.text}</p>
              </div>
            </div>
          )}

          {/* Exam Summary Box */}
          <div className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center mb-6 pb-4 border-b border-gray-100">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mr-4">
                <FaClipboardList className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Review Your Exam Settings
                </h2>
                <p className="text-gray-500 text-sm">
                  Make sure everything is correct before proceeding
                </p>
              </div>
            </div>

            {/* Exam Settings Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex items-center mb-3">
                  <FaGraduationCap className="text-emerald-500 mr-2" />
                  <h3 className="font-medium text-gray-700">Exam Type</h3>
                </div>
                <p className="text-lg font-semibold text-gray-800 ml-6">{examParams.examType}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex items-center mb-3">
                  <FaClipboardList className="text-emerald-500 mr-2" />
                  <h3 className="font-medium text-gray-700">Number of Questions</h3>
                </div>
                <p className="text-lg font-semibold text-gray-800 ml-6">{examParams.numberOfQuestions}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex items-center mb-3">
                  <FaChartBar className="text-emerald-500 mr-2" />
                  <h3 className="font-medium text-gray-700">Difficulty</h3>
                </div>
                <p className="text-lg font-semibold text-gray-800 ml-6">{examParams.difficulty}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex items-center mb-3">
                  <FaHourglassHalf className="text-emerald-500 mr-2" />
                  <h3 className="font-medium text-gray-700">Time Limit</h3>
                </div>
                <p className="text-lg font-semibold text-gray-800 ml-6">
                  {examParams.isTimed ? `${examParams.duration} minutes` : 'No time limit'}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex items-center mb-3">
                  <FaTrophy className="text-emerald-500 mr-2" />
                  <h3 className="font-medium text-gray-700">Marks per Question</h3>
                </div>
                <p className="text-lg font-semibold text-gray-800 ml-6">{examParams.marksPerQuestion}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex items-center mb-3">
                  <FaTrophy className="text-emerald-500 mr-2" />
                  <h3 className="font-medium text-gray-700">Total Marks</h3>
                </div>
                <p className="text-lg font-semibold text-gray-800 ml-6">{examParams.totalMarks}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-6 mt-8">
              <button
                onClick={handleCancel}
                className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <FaTimesCircle className="w-4 h-4 text-gray-500" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleGenerateExam}
                className={`px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium rounded-xl transition-all duration-300 flex items-center space-x-2 ${
                  loading ? 'opacity-75 cursor-wait' : 'hover:shadow-md'
                }`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FaSpinner className="w-4 h-4 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <FaRocket className="w-4 h-4" />
                    <span>Generate Exam</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Helpful Tips */}
          <div className="w-full max-w-3xl mt-8 bg-blue-50 p-6 rounded-xl border border-blue-100">
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4 mt-1">
                <FaLightbulb className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-blue-800 mb-2">Helpful Tips</h3>
                <ul className="text-blue-700 text-sm space-y-2">
                  <li className="flex items-start">
                    <span className="inline-block w-4 h-4 bg-blue-200 rounded-full mr-2 mt-1"></span>
                    <span>The exam will be generated based on the content you've uploaded.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-4 h-4 bg-blue-200 rounded-full mr-2 mt-1"></span>
                    <span>You can retake the exam multiple times with different questions.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-4 h-4 bg-blue-200 rounded-full mr-2 mt-1"></span>
                    <span>Your results will be saved for future reference.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamGenerationAndConfirmationPage;

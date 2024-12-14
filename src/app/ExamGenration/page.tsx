"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/SiderBar/page";
import Loader from "../components/lodder";

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
        'https://examinieai.kindsky-c4c0142e.eastus.azurecontainerapps.io/exams/create_exam/',
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
        <div className="min-h-screen w-full bg-gradient-to-r from-blue-200 via-white to-green-200 flex flex-col items-center justify-center p-8 text-gray-800">
          {loading && <Loader />}
          
          {/* Page Header */}
          <header className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500 mb-2">
              Confirm Your Exam Setup
            </h1>
            <p className="text-gray-600">
              Review your settings and confirm to proceed. Your exam is just a click away!
            </p>
            {/* Gradient Line */}
            <div className="w-full mt-4 h-1 bg-gradient-to-r from-green-400 via-teal-500 to-blue-500"></div>
          </header>

          {/* Message Display */}
          {message && (
            <div className={`w-full max-w-3xl mb-4 p-4 rounded-lg ${
              message.type === 'success' ? 'bg-green-100 text-green-700 border-green-400' : 'bg-red-100 text-red-700 border-red-400'
            } border-2`}>
              {message.text}
            </div>
          )}

          {/* Exam Summary Box */}
          <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-xl border-4 border-green-400">
            <h2 className="text-2xl font-semibold text-green-700 mb-4">
              Review Your Exam Settings
            </h2>

            {/* Exam Settings Summary */}
            <ul className="text-lg space-y-4">
              <li>
                <span className="font-semibold">Exam Type:</span> {examParams.examType}
              </li>
              <li>
                <span className="font-semibold">Number of Questions:</span> {examParams.numberOfQuestions}
              </li>
              <li>
                <span className="font-semibold">Difficulty:</span> {examParams.difficulty}
              </li>
              <li>
                <span className="font-semibold">Timed:</span> {examParams.isTimed ? `Yes, ${examParams.duration} minutes` : 'No'}
              </li>
              <li>
                <span className="font-semibold">Marks per Question:</span> {examParams.marksPerQuestion}
              </li>
              <li>
                <span className="font-semibold">Total Marks:</span> {examParams.totalMarks}
              </li>
            </ul>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-6 mt-8">
              <button
                onClick={handleCancel}
                className="px-6 py-3 bg-gray-400 text-white font-semibold rounded-lg hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateExam}
                className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all duration-300"
                disabled={loading}
              >
                Generate Exam
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamGenerationAndConfirmationPage;

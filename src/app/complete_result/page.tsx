"use client";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaCheckCircle, FaRedo, FaArrowCircleRight } from "react-icons/fa";
import { Pie } from "react-chartjs-2";
import Loader from '../components/2loder'; // Importing the Loader component
import { motion } from "framer-motion";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { API_BASE_URL } from '@/utils/apiConfig';

ChartJS.register(ArcElement, Tooltip, Legend);

// Define types for the result data
interface OverallResult {
  result_id: string;
  exam_title: string;
  total_marks: number;
  obtained_marks: number;
  grade: string;
  percentage: number;
}

interface QuestionResult {
  question_id: string;
  statement: string;
  response: string | null;
  question_type: string;
  total_marks: number;
  obtained_marks: number;
  feedback: string;
}

interface StudentProgress {
  total_exams_taken: number;
  exams_passed: number;
  exams_failed: number;
  total_points: number;
  overall_percentage: number;
  overall_grade: string;
}

interface ResultData {
  overall_result: OverallResult;
  question_results: QuestionResult[];
  student_progress: StudentProgress;
}

export default function Result(): JSX.Element {
  const [result, setResult] = useState<ResultData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchAndCompleteExam = async (): Promise<void> => {
      const examId = localStorage.getItem("exam-id");
      const attemptId = localStorage.getItem("attemptID");
      const accessToken = localStorage.getItem("access_token");

      if (!examId || !attemptId || !accessToken) {
        setError("Missing required data (exam ID, attempt ID, or access token).");
        setLoading(false);
        return;
      }

      try {
        // Step 1: Complete the Exam Attempt
        const completeResponse = await fetch(
          `${API_BASE_URL}/exams/complete_exam_attempt/${examId}/${attemptId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!completeResponse.ok) {
          const completeError = await completeResponse.json();
          setError(`Failed to complete the exam: ${completeError.message}`);
          setLoading(false);
          return;
        }

        // Step 2: Fetch the Exam Result
        const resultResponse = await fetch(
          `${API_BASE_URL}/results/generate_and_update_result/${attemptId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!resultResponse.ok) {
          const resultError = await resultResponse.json();
          setError(`Failed to fetch result: ${resultError.message}`);
          setLoading(false);
          return;
        }

        const resultData: ResultData = await resultResponse.json();
        setResult(resultData);

        // Save result data in local storage for potential reuse
        localStorage.setItem("result", JSON.stringify(resultData));
        setLoading(false);
      } catch (error: unknown) {
        console.error("Error during exam completion or result fetching:", error);
        setError("An unexpected error occurred. Please try again.");
        setLoading(false);
      }
    };

    fetchAndCompleteExam();
  }, []);

  const retakeExam = (): void => {
    localStorage.removeItem("exam-id");
    localStorage.removeItem("attemptID");
    router.push("/exams"); // Redirect to the exam page or dashboard
  };

  if (loading) {
    return <Loader />; // Use the Loader component from 2loder.tsx
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-100">
        <div className="bg-red-500 text-white p-6 rounded shadow-lg">
          <h1 className="text-xl font-bold">Error</h1>
          <p className="mt-4">{error}</p>
          <button
            className="mt-6 bg-white text-red-500 px-4 py-2 rounded shadow hover:bg-gray-200"
            onClick={() => router.push("/DashBoard")}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-yellow-100">
        <div className="text-yellow-500 font-semibold">
          No result data found. Please try again.
        </div>
      </div>
    );
  }

  const { overall_result, question_results } = result;

  // Pie chart data
  const pieData = {
    labels: ["Correct Answers", "Incorrect Answers"],
    datasets: [
      {
        data: [
          overall_result.obtained_marks,
          overall_result.total_marks - overall_result.obtained_marks,
        ],
        backgroundColor: ["#38A169", "#D4E157"],
        hoverBackgroundColor: ["#2F855A", "#9E9E9E"],
      },
    ],
  };

  return (
    <>
      <Head>
        <title>Exam Result | ExaminieAI</title>
      </Head>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6">
        <motion.div
          className="bg-white shadow-xl rounded-2xl overflow-hidden w-full max-w-4xl border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <FaCheckCircle className="text-white text-3xl" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-center mb-2">
                Your Exam Results
              </h1>
              <p className="text-center text-white/80">
                {overall_result.exam_title}
              </p>
            </div>
          </div>

          {/* Score Summary */}
          <div className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
              {/* Pie Chart */}
              <motion.div
                className="w-56 h-56"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Pie
                  data={{
                    ...pieData,
                    datasets: [{
                      ...pieData.datasets[0],
                      backgroundColor: ["#10b981", "#e2e8f0"],
                      hoverBackgroundColor: ["#059669", "#cbd5e1"],
                      borderWidth: 0
                    }]
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          usePointStyle: true,
                          padding: 20,
                          font: {
                            size: 12
                          }
                        }
                      }
                    }
                  }}
                />
              </motion.div>

              {/* Score Cards */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  className="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <p className="text-sm text-emerald-600 font-medium mb-1">Total Marks</p>
                  <p className="text-3xl font-bold text-gray-800">{overall_result.total_marks}</p>
                </motion.div>

                <motion.div
                  className="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  <p className="text-sm text-emerald-600 font-medium mb-1">Obtained Marks</p>
                  <p className="text-3xl font-bold text-gray-800">{overall_result.obtained_marks}</p>
                </motion.div>

                <motion.div
                  className="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                >
                  <p className="text-sm text-emerald-600 font-medium mb-1">Percentage</p>
                  <p className="text-3xl font-bold text-gray-800">{overall_result.percentage}%</p>
                </motion.div>

                <motion.div
                  className="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                >
                  <p className="text-sm text-emerald-600 font-medium mb-1">Grade</p>
                  <p className="text-3xl font-bold text-gray-800">{overall_result.grade}</p>
                </motion.div>
              </div>
            </div>

            {/* Divider */}
            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-sm text-gray-500">Detailed Feedback</span>
              </div>
            </div>

            {/* Detailed Feedback */}
            <div className="space-y-6 mb-8">
              {question_results.map((question, index) => (
                <motion.div
                  key={question.question_id}
                  className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + (index * 0.1) }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-emerald-600 font-medium">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800 mb-3">
                        {question.statement}
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">Your Answer</p>
                          <p className="font-medium text-gray-700">{question.response || "Unattempted"}</p>
                        </div>

                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">Marks</p>
                          <p className="font-medium text-gray-700">
                            <span className={question.obtained_marks === question.total_marks ? "text-emerald-600" : "text-amber-600"}>
                              {question.obtained_marks}
                            </span>
                            /{question.total_marks}
                          </p>
                        </div>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                        <p className="text-xs text-blue-700 mb-1 font-medium">Feedback</p>
                        <p className="text-blue-800">{question.feedback}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
              <motion.button
                className="px-6 py-3 bg-white border border-emerald-200 text-emerald-600 rounded-xl hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
                onClick={retakeExam}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <FaRedo className="text-emerald-500" />
                <span>Retake Exam</span>
              </motion.button>
              <motion.button
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:shadow-md transition-all flex items-center justify-center gap-2"
                onClick={() => router.push("/DashBoard")}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <FaArrowCircleRight />
                <span>Back to Dashboard</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

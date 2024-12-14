"use client"
import React, { useEffect, useState } from "react";

interface ExamDetails {
  id: string;
  title: string;
  questions_type: string;
  difficulty: string;
  num_questions: number;
  marks_per_question: number;
  total_marks: number;
  time_limit: number; // Time in minutes
  questions: Question[];
}

interface Question {
  id: string;
  statement: string;
}

interface Answer {
  question_id: string;
  response: string;
}

const AttemptExamPage = () => {
  const [examDetails, setExamDetails] = useState<ExamDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [attemptStarted, setAttemptStarted] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(0); // Timer in seconds
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  const fetchExamDetails = async () => {
    const examId = localStorage.getItem("exam-id");
    const accessToken = localStorage.getItem("access_token");

    if (!examId || !accessToken) {
      setError("Missing exam ID or access token.");
      return;
    }

    try {
      const response = await fetch(
        `https://examinieai.kindsky-c4c0142e.eastus.azurecontainerapps.io/exams/get_full_exam/${examId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        console.log("Error fetching exam details:", errorResponse);
        setError(`Failed to fetch exam details: ${errorResponse.message}`);
        return;
      }

      const data = await response.json();
      console.log("Exam details response:", data);
      setExamDetails(data);

      // Initialize answers array
      const initialAnswers = data.questions.map((q: Question) => ({
        question_id: q.id,
        response: "",
      }));
      setAnswers(initialAnswers);
    } catch (err) {
      console.error("Error fetching exam details:", err);
      setError("An error occurred while fetching exam details.");
    } finally {
      setLoading(false);
    }
  };

  const startExamAttempt = async () => {
    const examId = localStorage.getItem("exam-id");
    const accessToken = localStorage.getItem("access_token");
  
    if (!examId || !accessToken) {
      setError("Missing exam ID or access token.");
      return;
    }
  
    try {
      const response = await fetch(
        `https://examinieai.kindsky-c4c0142e.eastus.azurecontainerapps.io/exams/start_exam_attempt/${examId}/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      const responseData = await response.json();
      console.log("Start exam attempt response:", responseData);
  
      if (!response.ok) {
        setError(`Failed to start the exam: ${responseData.message}`);
        return;
      }
  
      // Save attempt ID to local storage
      const attemptId = responseData.attempt?.id;
      if (attemptId) {
        localStorage.setItem("attemptID", attemptId);
        console.log("Attempt ID saved to local storage:", attemptId);
      } else {
        console.warn("Attempt ID is missing in the response.");
      }
  
      setAttemptStarted(true);
      setTimeLeft((examDetails?.time_limit || 0) * 60); // Convert minutes to seconds for timer
    } catch (err) {
      console.error("Error starting exam:", err);
      setError("An error occurred while starting the exam.");
    }
  };

  const handleOptionSelect = (questionId: string, selectedOption: string) => {
    console.log("Selected option for question", questionId, ":", selectedOption);
    setAnswers((prevAnswers) =>
      prevAnswers.map((answer) =>
        answer.question_id === questionId
          ? { ...answer, response: selectedOption }
          : answer
      )
    );
  };

  const submitAllAnswers = async () => {
    if (isSubmitting) return; // Prevent multiple submissions
    
    const examId = localStorage.getItem("exam-id");
    const accessToken = localStorage.getItem("access_token");

    if (!examId || !accessToken) {
      setError("Missing exam ID or access token.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `https://examinieai.kindsky-c4c0142e.eastus.azurecontainerapps.io/exams/submit_all_answers/${examId}/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ answers }),
        }
      );

      const responseData = await response.json();
      console.log("Submit answers response:", responseData);

      if (!response.ok) {
        if (response.status === 409) {
          console.log("Exam already submitted");
          setError("You have already submitted this exam.");
        } else {
          setError(`Failed to submit answers: ${responseData.message}`);
        }
        return;
      }

      console.log("Exam submitted successfully");
      setSubmitSuccess(true);
    } catch (err) {
      console.error("Error submitting answers:", err);
      setError("An error occurred while submitting answers.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchExamDetails();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timeLeft > 0 && attemptStarted) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && attemptStarted) {
      console.log("Time is up - auto submitting exam");
      submitAllAnswers();
    }
    return () => clearInterval(timer);
  }, [timeLeft, attemptStarted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return <p>Loading exam details...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (submitSuccess) {
    return (
      <div className="bg-green-50 min-h-screen flex flex-col items-center justify-center">
        <div className="bg-white shadow-lg rounded-lg p-8 text-center">
          <div className="text-green-600 text-5xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-green-800 mb-4">Exam Submitted Successfully!</h2>
          <p className="text-gray-600 mb-6">Thank you for completing the exam. Your responses have been recorded.</p>
          <button
            onClick={() => window.location.href = '/complete_result'}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            See Result
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-50 min-h-screen flex flex-col items-center justify-center text-green-900">
      {!attemptStarted ? (
        <>
          <h1 className="text-3xl font-bold mb-6">{examDetails?.title}</h1>
          <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl">
            <p>
              <strong>Type:</strong> {examDetails?.questions_type}
            </p>
            <p>
              <strong>Total Marks:</strong> {examDetails?.total_marks}
            </p>
            <p>
              <strong>Time Limit:</strong> {examDetails?.time_limit} minutes
            </p>
            <button
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              onClick={startExamAttempt}
            >
              Start Exam
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Question {currentQuestionIndex + 1} of {examDetails?. num_questions}
              </h2>
              <p className="text-red-600 font-semibold">
                Time Left: {formatTime(timeLeft)}
              </p>
            </div>
            <p className="text-lg mb-4">{examDetails?.questions[currentQuestionIndex].statement}</p>
            <div className="space-y-2">
              <div
                className={`p-2 rounded-lg cursor-pointer ${
                  answers[currentQuestionIndex]?.response === "True"
                    ? "bg-green-300"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                onClick={() =>
                  handleOptionSelect(
                    examDetails?.questions[currentQuestionIndex].id || "",
                    "True"
                  )
                }
              >
                True
              </div>
              <div
                className={`p-2 rounded-lg cursor-pointer ${
                  answers[currentQuestionIndex]?.response === "False"
                    ? "bg-green-300"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                onClick={() =>
                  handleOptionSelect(
                    examDetails?.questions[currentQuestionIndex].id || "",
                    "False"
                  )
                }
              >
                False
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </button>
              {currentQuestionIndex === (examDetails?.num_questions || 1) - 1 ? (
                <button
                  className={`bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={submitAllAnswers}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              ) : (
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  onClick={() =>
                    setCurrentQuestionIndex((prev) =>
                      Math.min(prev + 1, (examDetails?.num_questions || 1) - 1)
                    )
                  }
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AttemptExamPage;
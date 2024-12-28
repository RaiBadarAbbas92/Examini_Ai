"use client";
import React, { useEffect, useState } from "react";

interface ExamDetails {
  id: string;
  title: string;
  questions_type: string;
  difficulty: string;
  num_questions: number;
  marks_per_question: number;
  total_marks: number;
  time_limit: number; // Time in seconds
  questions: CaseStudyQuestion[];
}

interface CaseStudyQuestion {
  id: string;
  statement: string;
  question_data: {
    case_description: string;
    expected_response: string;
  };
}

interface Answer {
  question_id: string;
  response: string;
}

const CaseStudyPage = () => {
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
      const initialAnswers = data.questions.map((q: CaseStudyQuestion) => ({
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
      const attemptId = responseData.attempt?.id;
      if (attemptId) {
        localStorage.setItem("attemptID", attemptId);
        console.log("Attempt ID saved to local storage:", attemptId);
      } else {
        console.warn("Attempt ID is missing in the response.");
      }

      setAttemptStarted(true);
      setTimeLeft(examDetails?.time_limit || 0); // Use seconds for timer
    } catch (err) {
      console.error("Error starting exam:", err);
      setError("An error occurred while starting the exam.");
    }
  };

  const handleInputChange = (questionId: string, value: string) => {
    console.log("Typed answer for question", questionId, ":", value);
    setAnswers((prevAnswers) =>
      prevAnswers.map((answer) =>
        answer.question_id === questionId
          ? { ...answer, response: value }
          : answer
      )
    );
  };

  const submitAllAnswers = async () => {
    if (isSubmitting) return;

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
        setError(`Failed to submit answers: ${responseData.message}`);
        return;
      }

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
          <h2 className="text-2xl font-bold text-green-800 mb-4">Exam Submitted Successfully!</h2>
          <button
            onClick={() => (window.location.href = "/complete_result")}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Go to result
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-50 min-h-screen flex flex-col items-center justify-center">
      {!attemptStarted ? (
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6">{examDetails?.title}</h1>
          <button
            className="bg-green-600 text-white px-6 py-3 rounded-lg"
            onClick={startExamAttempt}
          >
            Start Exam
          </button>
        </div>
      ) : (
        <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Question {currentQuestionIndex + 1} of {examDetails?.num_questions}</h2>
            <p>Time Left: {formatTime(timeLeft)}</p>
          </div>
          <p className="text-lg">{examDetails?.questions[currentQuestionIndex]?.statement}</p>
          <p className="mt-2 text-gray-600">{examDetails?.questions[currentQuestionIndex]?.question_data.case_description}</p>
          <textarea
            value={
              answers[currentQuestionIndex]?.response || ""
            }
            onChange={(e) =>
              handleInputChange(
                examDetails?.questions[currentQuestionIndex]?.id || "",
                e.target.value
              )
            }
            className="mt-4 w-full h-32 p-2 border border-gray-300 rounded -lg"
          ></textarea>
          <div className="flex justify-between mt-4">
            <button
              disabled={currentQuestionIndex === 0}
              onClick={() =>
                setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))
              }
              className="bg-gray-300 px-4 py-2 rounded-lg"
            >
              Previous
            </button>
            {currentQuestionIndex === (examDetails?.num_questions || 1) - 1 ? (
              <button
                onClick={submitAllAnswers}
                className={`bg-red-600 text-white px-4 py-2 rounded-lg ${
                  isSubmitting ? "opacity-50" : ""
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            ) : (
              <button
                onClick={() =>
                  setCurrentQuestionIndex((prev) =>
                    Math.min(prev + 1, (examDetails?.num_questions || 1) - 1)
                  )
                }
                className="bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Next
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseStudyPage;
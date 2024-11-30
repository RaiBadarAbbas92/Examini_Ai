"use client"
import { useState } from "react";
import {
  FaMale,
  FaFemale,
  FaGlobe,
  FaUserGraduate,
  FaBrain,
  FaHandsHelping,
  FaBook,
  FaAward,
  FaRunning,
  FaFlagCheckered,
  FaMedal,
} from "react-icons/fa";

const questions = [
  {
    id: "age",
    question: "What is your age group?",
    options: ["Under 10", "10-15", "16-20", "21+"],
    icons: [<FaUserGraduate />, "🎉", "🎓", "🏆"],
  },
  {
    id: "gender",
    question: "What is your gender?",
    options: ["Male", "Female", "Other"],
    icons: [<FaMale />, <FaFemale />, "🌈"],
  },
  {
    id: "country",
    question: "Which country are you from?",
    options: ["United States", "India", "United Kingdom", "Other"],
    icons: [<FaGlobe />, "🇮🇳", "🇬🇧", "🌍"],
  },
  {
    id: "social_interaction_style",
    question: "What is your social interaction style?",
    options: ["Introvert", "Extrovert", "Ambivert"],
    icons: ["📖", "🎤", "⚖️"],
  },
  {
    id: "decision_making_approach",
    question: "How do you make decisions?",
    options: ["Thinker", "Feeler"],
    icons: [<FaBrain />, "❤️"],
  },
  {
    id: "current_level_of_education",
    question: "What is your current level of education?",
    options: ["Kindergarten", "Primary", "High School", "College"],
    icons: ["📚", "✏️", "🏫", "🎓"],
  },
  {
    id: "last_grade",
    question: "What was your last grade?",
    options: ["A+", "A", "B", "C or below"],
    icons: [<FaMedal />, "🌟", "📜", "📉"],
  },
  {
    id: "favorite_subject",
    question: "What is your favorite subject?",
    options: ["Mathematics", "Science", "History", "Other"],
    icons: ["📐", "🔬", "📜", "🌟"],
  },
  {
    id: "interested_career_paths",
    question: "What career path interests you the most?",
    options: ["Engineering", "Medicine", "Arts", "Sports"],
    icons: ["⚙️", "💉", "🎨", <FaRunning />],
  },
  {
    id: "free_time_activities",
    question: "What do you like to do in your free time?",
    options: ["Sports", "Reading", "Gaming", "Other"],
    icons: [<FaRunning />, "📚", "🎮", "🌟"],
  },
  {
    id: "motivation_to_study",
    question: "What motivates you to study?",
    options: ["Grades", "Learning", "Career", "Other"],
    icons: [<FaAward />, "📘", "🏆", "✨"],
  },
  {
    id: "short_term_academic_goals",
    question: "What is your short-term academic goal?",
    options: ["Improve Grades", "Learn a Skill", "Pass Exams", "Other"],
    icons: ["📊", "🛠️", "🎓", "🌟"],
  },
  {
    id: "long_term_academic_goals",
    question: "What is your long-term academic goal?",
    options: ["Graduate College", "Build Career", "Start a Business", "Other"],
    icons: [<FaFlagCheckered />, "📈", "💼", "🌟"],
  },
];

const Onboarding = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const current = questions[currentQuestion];

  const handleOptionSelect = (option: string) => {
    setAnswers((prev) => ({ ...prev, [current.id]: option }));
  };

  const handleNext = () => {
    setCurrentQuestion((prev) => prev + 1);
  };

  const handleSubmit = async () => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      alert("Access token not found!");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(
        "https://examinieai.kindsky-c4c0142e.eastus.azurecontainerapps.io/student/create_profile/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(answers),
        }
      );

      if (response.ok) {
        alert("Profile created successfully!");
      } else {
        alert("Failed to submit profile!");
      }
    } catch (error) {
      console.error("Error submitting profile:", error);
      alert("An error occurred!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center">
      {/* Heading */}
      <h1 className="text-4xl font-bold text-green-600 mb-8 animate-bounce">
        Let's take some quick questions!
      </h1>

      {/* Question */}
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl text-green-800 font-semibold mb-6">
          {current.question}
        </h2>

        {/* Options */}
        <div className="grid grid-cols-2 gap-4">
          {current.options.map((option, index) => (
            <button
              key={option}
              className={`flex flex-col items-center justify-center p-4 bg-green-100 border border-green-300 rounded-lg shadow transform transition duration-300 ${
                answers[current.id] === option
                  ? "bg-green-300 scale-105"
                  : "hover:scale-105"
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

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          {currentQuestion > 0 && (
            <button
              className="px-6 py-2 bg-green-400 text-white font-bold rounded shadow hover:bg-green-500 transition duration-300"
              onClick={() => setCurrentQuestion((prev) => prev - 1)}
            >
              Back
            </button>
          )}
          {currentQuestion < questions.length - 1 ? (
            <button
              className="px-6 py-2 bg-green-500 text-white font-bold rounded shadow hover:bg-green-600 transition duration-300"
              onClick={handleNext}
              disabled={!answers[current.id]}
            >
              Next
            </button>
          ) : (
            <button
              className={`px-6 py-2 bg-green-700 text-white font-bold rounded shadow hover:bg-green-800 transition duration-300 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleSubmit}
              disabled={isSubmitting || !answers[current.id]}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;

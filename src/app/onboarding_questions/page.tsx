"use client"
import { useState } from "react";
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation
import { API_BASE_URL } from '@/utils/apiConfig';
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
    options: ["Primary School", "High School", "Undergraduate", "Other"],
    icons: ["📚", "✏️", "🎓", "🌟"],
  },
  {
    id: "last_grade",
    question: "What was your last grade?",
    options: ["A+", "A", "B", "Other"],
    icons: [<FaMedal />, "📊", "📜", "🌟"],
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
    options: ["Engineering", "Medicine", "Law", "Other"],
    icons: ["⚙️", "💉", "⚖️", "🌟"],
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
    options: ["grades", "knowledge", "personal growth", "Other"],
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

const additionalOptions: Record<string, string[]> = {
  country : ["Canada","United Kingdom","Australia","Germany","France","Italy","Spain","Brazil","Mexico","Japan","China","India","Pakistan","Russia","South Africa","Nigeria","Egypt","Turkey","Saudi Arabia","Argentina","South Korea","New Zealand","Sweden","Norway","Denmark","Netherlands","Belgium","Switzerland","United Arab Emirates","Malaysia","Singapore","Indonesia","Philippines","Thailand"],
  current_level_of_education : ["Kindergarten","Primary School","Middle School","High School","Undergraduate","Postgraduate","Doctorate","Other"],
  last_grade : ["A+","A","A-","B+","B","B-","C+","C","C-","D+","D","D-","F","I","P","F","Other"],
  favorite_subject: ["English", "Geography", "Art", "Music" , "Computer Science" , "Physical Education" , "Language"],

  interested_career_paths: ["Business","Technology","Science","Education","Finance","Hospitality","Healthcare","Environmental Science","Media and Communications","Psychology","Social Work","Entrepreneurship","Sports","Government and Politics" ,"Other"],
  motivation_to_study: ["curiosity","peer competition"]
};

const Onboarding = () => {
  const router = useRouter(); // Initialize router
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showAdditionalOptions, setShowAdditionalOptions] = useState(false);
  const [selectedAdditionalOption, setSelectedAdditionalOption] = useState("");
  const [loading, setLoading] = useState(false); // State for loading
  const [successMessage, setSuccessMessage] = useState(""); // State for success message

  const current = questions[currentQuestion];

  const handleOptionSelect = (option: string) => {
    const newAnswers = { ...answers, [current.id]: option };
    setAnswers(newAnswers);

    if (option === "Other") {
      setShowAdditionalOptions(true);
    } else {
      setShowAdditionalOptions(false);
    }

    // Log the formatted data after each selection
    const formattedData = {
      "age": newAnswers.age === "Under 10" ? 0 :
             newAnswers.age === "10-15" ? 10 :
             newAnswers.age === "16-20" ? 16 : 21,
      "gender": newAnswers.gender?.toLowerCase() || "",
      "country": newAnswers.country || "",
      "social_interaction_style": newAnswers.social_interaction_style?.toLowerCase() || "",
      "decision_making_approach": newAnswers.decision_making_approach?.toLowerCase() || "",
      "current_level_of_education": newAnswers.current_level_of_education || "",
      "last_grade": newAnswers.last_grade || "",
      "favorite_subject": newAnswers.favorite_subject || selectedAdditionalOption,
      "interested_career_paths": newAnswers.interested_career_paths || selectedAdditionalOption,
      "free_time_activities": newAnswers.free_time_activities || "",
      "motivation_to_study": newAnswers.motivation_to_study?.toLowerCase() || "",
      "short_term_academic_goals": newAnswers.short_term_academic_goals || "",
      "long_term_academic_goals": newAnswers.long_term_academic_goals || ""
    };
    console.log('Current form data:', formattedData);
  };

  const handleAdditionalOptionSelect = (option: string) => {
    setSelectedAdditionalOption(option);
    setShowAdditionalOptions(false);
    handleOptionSelect(option);
  };

  const handleNext = () => {
    setCurrentQuestion((prev) => prev + 1);
  };

  const handleSubmit = async () => {
    setLoading(true); // Start loading
    try {
      const accessToken = localStorage.getItem('access_token');

      // Convert age to number and other values to match API format
      const formattedData = {
        "age": answers.age === "Under 10" ? 0 :
               answers.age === "10-15" ? 10 :
               answers.age === "16-20" ? 16 : 21,
        "gender": answers.gender.toLowerCase(),
        "country": answers.country,
        "social_interaction_style": answers.social_interaction_style.toLowerCase(),
        "decision_making_approach": answers.decision_making_approach.toLowerCase(),
        "current_level_of_education": answers.current_level_of_education,
        "last_grade": answers.last_grade,
        "favorite_subject": answers.favorite_subject || selectedAdditionalOption,
        "interested_career_paths": answers.interested_career_paths || selectedAdditionalOption,
        "free_time_activities": answers.free_time_activities,
        "motivation_to_study": answers.motivation_to_study.toLowerCase(),
        "short_term_academic_goals": answers.short_term_academic_goals,
        "long_term_academic_goals": answers.long_term_academic_goals
      };

      console.log('Submitting data:', formattedData);

      const response = await fetch(`${API_BASE_URL}/student/create_profile/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(formattedData)
      });

      const data = await response.json();
      console.log('Profile creation response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create profile');
      }

      // Set success message on successful profile creation
      setSuccessMessage("Profile created successfully!");

      // Redirect to Dashboard page on successful profile creation
      router.push('/DashBoard'); // Use router to navigate to the Dashboard

    } catch (error) {
      console.error('Error creating profile:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col items-center justify-center p-6">
      {/* Progress Bar */}
      <div className="w-full max-w-2xl mb-8">
        <div className="flex justify-between mb-2 text-sm text-gray-500">
          <span>Getting Started</span>
          <span>Question {currentQuestion + 1} of {questions.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-gradient-to-r from-emerald-400 to-teal-500 h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Heading */}
      <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent mb-6">
        Let's Personalize Your Experience
      </h1>

      {/* Subheading */}
      <p className="text-gray-600 text-center max-w-xl mb-8">
        Answer these questions to help us tailor your learning experience to your preferences and goals.
      </p>

      {/* Success Message */}
      {successMessage && (
        <div className="w-full max-w-2xl mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-lg">
          <div className="flex items-center">
            <svg className="w-6 h-6 text-emerald-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-emerald-700 font-medium">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Question Card */}
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {current.question}
        </h2>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {current.options.map((option, index) => (
            <button
              key={option}
              className={`group flex flex-col items-center justify-center p-6 rounded-xl transition-all duration-300 ${
                answers[current.id] === option
                  ? "bg-emerald-50 border-2 border-emerald-500 shadow-md"
                  : "bg-gray-50 border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50"
              }`}
              onClick={() => handleOptionSelect(option)}
            >
              <div className={`text-3xl mb-3 transition-transform group-hover:scale-110 ${
                answers[current.id] === option ? "text-emerald-500" : "text-gray-400"
              }`}>
                {current.icons[index]}
              </div>
              <span className={`font-medium ${
                answers[current.id] === option ? "text-emerald-700" : "text-gray-700"
              }`}>{option}</span>
            </button>
          ))}
        </div>

        {/* Show additional options if "Other" is selected */}
        {showAdditionalOptions && (
          <div className="mt-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Please specify:</h3>
            <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {additionalOptions[current.id as keyof typeof additionalOptions] && additionalOptions[current.id as keyof typeof additionalOptions].map((option: string) => (
                <button
                  key={option}
                  className={`flex items-center justify-center p-3 rounded-lg transition-all duration-200 ${
                    selectedAdditionalOption === option
                      ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                      : "bg-white text-gray-700 border border-gray-200 hover:border-emerald-200 hover:bg-emerald-50"
                  }`}
                  onClick={() => handleAdditionalOptionSelect(option)}
                >
                  <span className="font-medium text-sm">{option}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          {currentQuestion > 0 ? (
            <button
              className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors flex items-center space-x-2"
              onClick={() => setCurrentQuestion((prev) => prev - 1)}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Previous</span>
            </button>
          ) : (
            <div>{/* Empty div to maintain flex spacing */}</div>
          )}

          {currentQuestion < questions.length - 1 ? (
            <button
              className={`px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium rounded-xl transition-all duration-300 flex items-center space-x-2 ${
                !answers[current.id] ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'
              }`}
              onClick={handleNext}
              disabled={!answers[current.id]}
            >
              <span>Continue</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button
              className={`px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-medium rounded-xl transition-all duration-300 flex items-center space-x-2 ${
                loading ? 'opacity-75 cursor-wait' : 'hover:shadow-md'
              }`}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Complete Profile</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export default Onboarding;

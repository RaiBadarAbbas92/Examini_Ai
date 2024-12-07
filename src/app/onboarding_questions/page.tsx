
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

const additionalOptions = {
  country : ["Canada","United Kingdom","Australia","Germany","France","Italy","Spain","Brazil","Mexico","Japan","China","India","Pakistan","Russia","South Africa","Nigeria","Egypt","Turkey","Saudi Arabia","Argentina","South Korea","New Zealand","Sweden","Norway","Denmark","Netherlands","Belgium","Switzerland","United Arab Emirates","Malaysia","Singapore","Indonesia","Philippines","Thailand"],
  current_level_of_education : ["Kindergarten","Primary School","Middle School","High School","Undergraduate","Postgraduate","Doctorate","Other"],
  last_grade : ["A+","A","A-","B+","B","B-","C+","C","C-","D+","D","D-","F","I","P","F","Other"],
  favorite_subject: ["English", "Geography", "Art", "Music" , "Computer Science" , "Physical Education" , "Language"],
  
  interested_career_paths: ["Business","Technology","Science","Education","Finance","Hospitality","Healthcare","Environmental Science","Media and Communications","Psychology","Social Work","Entrepreneurship","Sports","Government and Politics" ,"Other"],
  motivation_to_study: ["curiosity","peer competition"]
};

const Onboarding = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showAdditionalOptions, setShowAdditionalOptions] = useState(false);
  const [selectedAdditionalOption, setSelectedAdditionalOption] = useState("");
  const [loading, setLoading] = useState(false); // State for loading

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

      const response = await fetch('https://examinieai.kindsky-c4c0142e.eastus.azurecontainerapps.io/student/create_profile/', {
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

    } catch (error) {
      console.error('Error creating profile:', error);
    } finally {
      setLoading(false); // Stop loading
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

        {/* Show additional options if "Other" is selected */}
        {showAdditionalOptions && (
          <div className="mt-4">
            <h3 className="text-lg text-green-800 font-semibold mb-2">Please specify:</h3>
            <div className="grid grid-cols-2 gap-4">
              {additionalOptions[current.id] && additionalOptions[current.id].map((option: string) => (
                <button
                  key={option}
                  className="flex flex-col items-center justify-center p-4 bg-green-100 border border-green-300 rounded-lg shadow transform transition duration-300 hover:scale-105"
                  onClick={() => handleAdditionalOptionSelect(option)}
                >
                  <span className="text-green-800 font-medium">{option}</span>
                </button>
              ))}
            </div>
          </div>
        )}

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
              className="px-6 py-2 bg-green-700 text-white font-bold rounded shadow hover:bg-green-800 transition duration-300"
              onClick={handleSubmit}
              disabled={loading} // Disable button while loading
            >
              {loading ? "Submitting..." : "Submit"} {/* Show loading text */}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;

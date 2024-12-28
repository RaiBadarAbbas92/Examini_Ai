"use client"
import { FC, useState } from "react";

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "What is ExaminAI?",
    answer: "ExaminAI is an innovative platform that uses artificial intelligence to create, grade, and provide feedback on academic examinations. It's designed to help educators save time while providing students with personalized learning experiences.",
  },
  {
    question: "How does the AI-powered exam creation work?",
    answer: "Our AI system analyzes your course content and learning objectives to automatically generate relevant questions across different difficulty levels. You can customize parameters like question types, topics, and complexity to match your specific needs.",
  },
  {
    question: "Is ExaminAI secure for conducting exams?",
    answer: "Yes, ExaminAI implements robust security measures including AI-powered proctoring, plagiarism detection, and encrypted data transmission to ensure exam integrity. We also use advanced authentication methods to verify student identities.",
  },
  {
    question: "How accurate is the AI grading system?",
    answer: "Our AI grading system has been trained on millions of exam responses and maintains a 99% accuracy rate compared to human graders. For subjective questions, it uses advanced natural language processing to provide fair and consistent evaluations.",
  },
  {
    question: "Can I integrate ExaminAI with my existing learning management system?",
    answer: "Yes, ExaminAI offers seamless integration with major LMS platforms including Canvas, Blackboard, and Moodle. Our API also allows for custom integrations with other educational software.",
  }
];

const FAQSection: FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 px-4 md:px-8 bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">Frequently Asked Questions</h2>
        <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
          Find answers to common questions about ExaminAI's features, capabilities, and how it can transform your examination process.
        </p>

        <div className="max-w-3xl mx-auto space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`relative border-2 border-green-100 rounded-xl shadow-sm p-6 transition-all duration-300 cursor-pointer hover:border-green-200 ${
                openIndex === index ? "bg-green-50" : "bg-white"
              }`}
              onClick={() => toggleFAQ(index)}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800 pr-8">{faq.question}</h3>
                <svg 
                  className={`h-6 w-6 text-green-600 transform transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              
              <div
                className={`mt-4 text-gray-600 transition-all duration-300 ease-in-out ${
                  openIndex === index 
                    ? "max-h-[500px] opacity-100" 
                    : "max-h-0 opacity-0 overflow-hidden"
                }`}
              >
                <p className="pb-2">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default FAQSection;

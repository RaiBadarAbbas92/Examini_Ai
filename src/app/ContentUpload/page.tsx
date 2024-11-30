"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import YouTubeLinkPad from "../components/content/youtube";
import ArticleSubmissionPage from "../components/content/article"; 
import TextPad from "../components/content/freetext";
import TopicSubmissionPage from "../components/content/topic";
import ContentUpload from "../components/content/sixcard";
import Sidebar from "../components/SiderBar/page";

const ExamContentUpload: React.FC = () => {
  const router = useRouter();
  const [selectedContentType, setSelectedContentType] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const contentTypes = [
    { name: "Free Text", description: "Upload free text content for question generation.", icon: "📝" },
    { name: "Topic", description: "Select specific topics to generate questions related to them.", icon: "📚" },
    { name: "Article", description: "Use articles to create questions based on the content.", icon: "📰" },
    { name: "Youtube Videos", description: "Include YouTube videos for interactive question creation.", icon: "🎥" },
  ];

  const handleSelectContentType = (type: string) => {
    setSelectedContentType(type);
    setIsLoading(true);
    setIsMinimized(true);
    setTimeout(() => setIsLoading(false), 1000); // Simulated loading state

    // Scroll the page to the top to ensure modal appears at the top
    window.scrollTo(0, 0); // This scrolls to the top
  };

  const handleCloseMinimizedPage = () => {
    setIsMinimized(false);
    setSelectedContentType(null);
  };

  const handleNext = () => {
    if (selectedContentType) {
      router.push('/examtype'); // Navigate to exam type page
    }
  };

  const renderSelectedPage = () => {
    const pageMapping: Record<string, JSX.Element | null> = {
      "Free Text": <TextPad />,
      "Topic": <TopicSubmissionPage />,
      "Article": <ArticleSubmissionPage />,
      "Youtube Videos": <YouTubeLinkPad />,
    };

    return pageMapping[selectedContentType || ""] || null;
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-[240px]'}`}>
        <div className="relative min-h-screen bg-gradient-to-r from-green-100 to-white">
          <div className={`flex flex-col items-center p-8 ${selectedContentType && !isMinimized ? "pointer-events-none" : ""}`}>
            <div className="text-center mb-10">
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-green-900 to-green-700 text-transparent bg-clip-text mb-4 leading-tight">
                Select the Content Type to Personalize Your Exam
              </h1>
              <p className="text-lg max-w-2xl mx-auto mb-6 text-green-800">
                Choose the type of content that best suits your exam requirements.
                Upload new files from your collection or reuse existing materials to create a custom, interactive exam experience.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                {contentTypes.map((contentType) => (
                  <div
                    key={contentType.name}
                    onClick={() => handleSelectContentType(contentType.name)}
                    className={`cursor-pointer flex flex-col items-center p-6 border rounded-lg transition-transform transform hover:scale-105 ${selectedContentType === contentType.name ? "border-green-900 shadow-lg" : "border-green-500 shadow-sm"} bg-gradient-to-r from-green-200 to-white hover:bg-gradient-to-l`}
                  >
                    <div className="text-4xl mb-4 text-green-900">{contentType.icon}</div>
                    <h3 className="font-semibold text-lg text-green-900">{contentType.name}</h3>
                    <p className="text-sm text-green-700 text-center mt-2">{contentType.description}</p>
                  </div>
                ))}
              </div>
              <ContentUpload />
              {selectedContentType && (
                <div className="flex justify-center gap-4 mt-6">
                  <button
                    onClick={handleNext}
                    className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300 shadow-lg"
                  >
                    Next
                  </button>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300 shadow-lg"
                  >
                    Back to Dashboard
                  </button>
                </div>
              )}
            </div>
          </div>

          {selectedContentType && isMinimized && (
            <div className="absolute inset-0 bg-white bg-opacity-80 flex justify-center items-start z-50 transition-all duration-300 ease-in-out">
              <div
                className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl transition-all duration-300 transform"
                style={{ width: "50%", maxWidth: "45vw", height: "40%", marginTop: "2%" }}
              >
                <button
                  id="modal-close-btn"
                  onClick={handleCloseMinimizedPage}
                  className="text-red-500 font-semibold hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                  aria-label="Close modal"
                >
                  ✖
                </button>
                {isLoading ? <div className="text-center">Loading...</div> : renderSelectedPage()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamContentUpload;

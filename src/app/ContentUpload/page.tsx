"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import YouTubeLinkPad from "../components/content/youtube";
import ArticleSubmissionPage from "../components/content/article";
import TextPad from "../components/content/freetext";
import TopicSubmissionPage from "../components/content/topic";
import ContentUpload from "../components/content/sixcard";
import Sidebar from "../components/SiderBar/page";
import { FaUpload, FaArrowRight, FaArrowLeft, FaTimes, FaSpinner } from "react-icons/fa";
import withAuth from "@/components/withAuth";

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
        <div className="relative min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
          {/* Top Navigation Bar */}
          <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 px-8 py-4 mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">Content Upload</h1>
                <p className="text-gray-500 text-sm">Select and manage your exam content</p>
              </div>
              <button
                onClick={() => router.push('/DashBoard')}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-300 text-sm font-medium"
              >
                <FaArrowLeft className="text-gray-500" />
                <span>Back to Dashboard</span>
              </button>
            </div>
          </div>

          <div className={`flex flex-col items-center px-8 py-4 ${selectedContentType && !isMinimized ? "pointer-events-none" : ""}`}>
            <div className="w-full max-w-6xl">
              {/* Main Header */}
              <div className="text-center mb-12 relative">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"></div>
                <h1 className="text-4xl font-extrabold bg-gradient-to-r from-emerald-700 to-teal-600 text-transparent bg-clip-text mb-4 leading-tight">
                  Select the Content Type to Personalize Your Exam
                </h1>
                <p className="text-lg max-w-3xl mx-auto mb-6 text-gray-600">
                  Choose the type of content that best suits your exam requirements.
                  Upload new files from your collection or reuse existing materials to create a custom, interactive exam experience.
                </p>
              </div>

              {/* Content Type Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                {contentTypes.map((contentType) => (
                  <div
                    key={contentType.name}
                    onClick={() => handleSelectContentType(contentType.name)}
                    className={`cursor-pointer group flex flex-col items-center p-6 border rounded-2xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden
                      ${selectedContentType === contentType.name
                        ? "border-emerald-300 shadow-lg bg-gradient-to-br from-emerald-50 to-white"
                        : "border-gray-200 shadow-sm hover:shadow-md bg-white hover:border-emerald-200"}`}
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors duration-300">
                      <div className="text-3xl text-emerald-600">{contentType.icon}</div>
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800 group-hover:text-emerald-700 transition-colors duration-300">{contentType.name}</h3>
                    <p className="text-sm text-gray-500 text-center mt-2 group-hover:text-gray-700 transition-colors duration-300">{contentType.description}</p>
                  </div>
                ))}
              </div>

              {/* Content Upload Component */}
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 mb-8">
                <ContentUpload />
              </div>

              {/* Action Buttons */}
              {selectedContentType && (
                <div className="flex justify-center gap-4 mt-8">
                  <button
                    onClick={handleNext}
                    className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center space-x-2 group"
                  >
                    <span>Continue to Next Step</span>
                    <FaArrowRight className="transform group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Modal for Content Type */}
          {selectedContentType && isMinimized && (
            <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex justify-center items-start z-50 transition-all duration-300 ease-in-out">
              <div
                className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-4xl transition-all duration-300 transform mt-20 border border-gray-100"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800">
                    {selectedContentType} Content
                  </h3>
                  <button
                    onClick={handleCloseMinimizedPage}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-red-100 flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors duration-300"
                    aria-label="Close modal"
                  >
                    <FaTimes size={14} />
                  </button>
                </div>

                <div className="min-h-[300px]">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-64">
                      <FaSpinner className="text-emerald-500 text-3xl animate-spin mb-4" />
                      <p className="text-gray-500">Loading content...</p>
                    </div>
                  ) : renderSelectedPage()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default withAuth(ExamContentUpload);
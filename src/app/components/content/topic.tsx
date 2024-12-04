"use client";

import { useState } from "react";

const TopicPad = () => {
  const [topic, setTopic] = useState(""); // State for the topic
  const [responseMessage, setResponseMessage] = useState(""); // API response message

  const handleSubmit = async () => {
    if (!topic.trim()) {
      setResponseMessage("Please enter a valid topic.");
      return;
    }

    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      setResponseMessage("Access token not found. Please log in.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", topic); // Static title
      formData.append("topic", topic); // User topic

      const response = await fetch(
        "https://examinieai.kindsky-c4c0142e.eastus.azurecontainerapps.io/content_upload/upload_topic/",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Store the content ID in localStorage
        if (data.contents && data.contents.id) {
          localStorage.setItem('selected_content_ids', data.contents.id);
        }
        
        setResponseMessage("Topic uploaded successfully!");
        setTopic(""); // Clear input after successful upload
      } else {
        setResponseMessage(data.message || "An error occurred.");
      }
    } catch (error) {
      setResponseMessage("Failed to connect to the server. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <header className="text-center mb-4">
        <h1 className="text-2xl font-extrabold text-gray-800 mb-2">
          Submit Your Topic
        </h1>
        <div className="w-full mt-2 h-1 bg-gray-300"></div>
      </header>

      <div className="w-full max-w-2xl p-4 rounded-lg shadow-md border border-gray-300">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          Add Your Topic Below
        </h2>
        <input
          type="text"
          className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 text-gray-700"
          placeholder="Enter your topic..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <div className="flex justify-end items-center mt-4">
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-all"
          >
            Submit
          </button>
        </div>
      </div>

      {responseMessage && (
        <div className="mt-4 text-center text-lg font-medium text-gray-800">
          {responseMessage}
        </div>
      )}
    </div>
  );
};

export default TopicPad;
"use client";

import { useState } from "react";

const YouTubeLinkPad = () => {
  const [link, setLink] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const BASE_URL =
    "https://examinieai.kindsky-c4c0142e.eastus.azurecontainerapps.io/content_upload/upload_youtube_video/";

  const handleSubmit = async () => {
    const authToken = localStorage.getItem("access_token");

    if (!authToken) {
      alert("Authentication token is missing. Please log in again.");
      return;
    }

    if (!link) {
      alert("Please provide a YouTube link.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", link);
      formData.append("url", link);

      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${authToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        alert(`YouTube link uploaded successfully: ${result.message}`);
        setLink("");
      } else {
        const errorData = await response.json();
        alert(`Failed to upload: ${errorData.message || response.statusText}`);
      }
    } catch (error: any) {
      alert(`An error occurred: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Page Header */}
      <header className="text-center mb-4">
        <h1 className="text-2xl font-extrabold text-gray-800 mb-2">
          Add Your YouTube Link
        </h1>
        {/* Gradient Line */}
        <div className="w-full mt-2 h-1 bg-gray-300"></div>
      </header>

      {/* Link Pad Container */}
      <div className="w-full max-w-2xl p-4 rounded-lg shadow-md border border-gray-300">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          Enter Your YouTube Link Below
        </h2>

        {/* Link Input */}
        <input
          type="text"
          className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 text-gray-700"
          placeholder="Paste your YouTube link here..."
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />

        {/* Submit Button */}
        <div className="flex justify-end items-center mt-4">
          <button
            onClick={handleSubmit}
            className={`px-5 py-2.5 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-all ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Submit"}
          </button>
        </div>
      </div>

      {/* Footer with Logo */}
      <footer className="w-full mt-6 flex items-center justify-center">
        {/* Placeholder for logo or additional footer content */}
      </footer>
    </div>
  );
};

export default YouTubeLinkPad;

"use client"
import React, { useState, useEffect } from 'react';

const ResultPage = () => {
    const [examData, setExamData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch results from the backend
    const fetchResults = async () => {
        const accessToken = localStorage.getItem("access_token");
        const attemptId = localStorage.getItem("attempt_id");

        if (!accessToken || !attemptId) {
            setError("Missing access token or attempt ID.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`https://examinieai.kindsky-c4c0142e.eastus.azurecontainerapps.io/results/generate_and_update_result/${attemptId}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ attemptId }), // Sending attemptId in the body
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(`Error loading results: ${errorData.message}`);
                setLoading(false);
                return;
            }

            const data = await response.json();
            setExamData(data);
        } catch (err) {
            setError("An error occurred while fetching results.");
        } finally {
            setLoading(false);
        }
    };

    // Call the fetchResults on component mount
    useEffect(() => {
        fetchResults();
    }, []);

    if (loading) return <div className="text-center">Loading results...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (
        <div className="result-page container flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center mb-6">
                <h1 className="text-4xl font-bold text-green-600">Exam Result</h1>
            </div>
            
            {examData && (
                <div className="w-full max-w-md">
                    <div className="card border border-green-600 shadow-lg rounded-lg overflow-hidden">
                        <div className="card-header bg-green-100 p-4">
                            <h2 className="card-title text-2xl font-semibold text-green-800">{examData.examTitle}</h2>
                        </div>
                        <div className="card-body p-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white p-4 rounded-lg shadow">
                                    <h3 className="text-lg font-semibold text-green-600">Total Marks</h3>
                                    <p className="text-xl text-green-800">{examData.totalMarks}</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow">
                                    <h3 className="text-lg font-semibold text-green-600">Obtained Marks</h3>
                                    <p className="text-xl text-green-800">{examData.obtainedMarks}</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow">
                                    <h3 className="text-lg font-semibold text-green-600">Percentage</h3>
                                    <p className="text-xl text-green-800">
                                        {((examData.obtainedMarks / examData.totalMarks) * 100).toFixed(2)}%
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResultPage;
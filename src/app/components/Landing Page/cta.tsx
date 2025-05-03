"use client"
import { FC } from "react";

const CTASection: FC = () => {
  return (
    <section className="relative bg-gray-900 text-white py-16 px-4 md:px-8">
      {/* Animated Background using Tailwind CSS (Green Gradient) */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-green-500 to-green-600 opacity-60 animate-gradient-x" />
      
      <div className="relative z-10 text-center">
        {/* Heading */}
        <h2 className="text-4xl font-bold mb-6">
          Ready to Join Us? Choose Your Path!
        </h2>
        <p className="text-lg mb-8 text-gray-300">
          Whether you're a student or teacher, we have a place for you to grow and contribute.
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-6">
          <button
            className="bg-green-600 text-white py-3 px-6 rounded-lg text-xl font-semibold hover:bg-green-700 transition duration-300 transform hover:scale-105 active:scale-95"
          >
            Sign Up as Student
          </button>
          <button
            className="bg-green-700 text-white py-3 px-6 rounded-lg text-xl font-semibold hover:bg-green-800 transition duration-300 transform hover:scale-105 active:scale-95"
          >
            Sign Up as Teacher
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

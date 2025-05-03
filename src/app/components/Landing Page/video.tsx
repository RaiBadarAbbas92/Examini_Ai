"use client";

import { FC, useEffect, useRef } from "react";
import gsap from "gsap";

const VideoDemoSection: FC = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const textRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    // Animate section elements
    gsap.fromTo(headingRef.current,
      {
        opacity: 0,
        y: -30
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8
      }
    );

    gsap.fromTo(textRef.current,
      {
        opacity: 0,
        y: -20
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 0.2
      }
    );

    gsap.fromTo(videoRef.current,
      {
        opacity: 0,
        scale: 0.9
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        delay: 0.4
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-green-900 text-white py-10 flex flex-col items-center overflow-hidden">
      {/* Heading */}
      <h2 ref={headingRef} className="text-3xl md:text-4xl font-bold mb-4">
        Discover How Our Solution Works
      </h2>
      <p ref={textRef} className="text-center text-green-200 mb-6">
        Watch the video to see our platform in action and understand how it can benefit you.
      </p>

      {/* YouTube Video */}
      <div ref={videoRef} className="relative w-full max-w-xl aspect-video rounded-lg overflow-hidden shadow-lg">
        <iframe
          className="w-full h-full"
          src="https://www.youtube.com/embed/LapU4-xJLJA"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>

      {/* Rotating Gears */}
      <div
        className="absolute top-1/4 left-10 w-20 h-20 bg-green-700 rounded-full opacity-30"
        style={{
          animation: "spin-slow 10s linear infinite",
        }}
      ></div>
      <div
        className="absolute bottom-1/4 right-10 w-24 h-24 bg-green-600 rounded-full opacity-30"
        style={{
          animation: "spin-reverse-slow 12s linear infinite",
        }}
      ></div>

      {/* Custom CSS directly in the component */}
      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-reverse-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(-360deg);
          }
        }
      `}</style>
    </section>
  );
};

export default VideoDemoSection;

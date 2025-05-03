"use client"
import { motion } from 'framer-motion';
import { FaBrain, FaLightbulb, FaGraduationCap, FaClipboardCheck, FaSpinner } from 'react-icons/fa';

const Loader = () => {
  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-md flex items-center justify-center z-50">
      <motion.div
        className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-md w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Top gradient bar */}
        <div className="h-2 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-400 bg-[length:200%_auto] animate-gradient-x"></div>

        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-center mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mr-4"
            >
              <FaSpinner className="w-8 h-8 text-emerald-500" />
            </motion.div>
            <div className="text-left">
              <h3 className="text-xl font-bold text-gray-800">Processing</h3>
              <p className="text-gray-500">Please wait a moment</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-gray-100 rounded-full mb-6 overflow-hidden">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-500"
            />
          </div>

          {/* Icons section */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { icon: FaBrain, label: "Analyzing", color: "emerald" },
              { icon: FaLightbulb, label: "Creating", color: "teal" },
              { icon: FaClipboardCheck, label: "Finalizing", color: "emerald" }
            ].map((item, index) => (
              <motion.div
                key={index}
                className={`flex flex-col items-center`}
                animate={{
                  opacity: [0.5, 1, 0.5],
                  y: [0, -5, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.3,
                  ease: "easeInOut"
                }}
              >
                <motion.div
                  className={`w-12 h-12 rounded-full bg-${item.color}-50 flex items-center justify-center mb-2`}
                  animate={{
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.3
                  }}
                >
                  <item.icon className={`w-6 h-6 text-${item.color}-500`} />
                </motion.div>
                <span className="text-xs font-medium text-gray-600">{item.label}</span>
              </motion.div>
            ))}
          </div>

          {/* Status message */}
          <motion.div
            className="text-center py-2 px-4 bg-emerald-50 rounded-lg"
            animate={{
              opacity: [0.7, 1, 0.7],
              scale: [0.98, 1, 0.98]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <p className="text-emerald-700 font-medium">Generating your exam...</p>
          </motion.div>

          {/* Steps */}
          <div className="mt-6 space-y-3">
            {[
              { label: "Analyzing curriculum", delay: 0 },
              { label: "Creating questions", delay: 0.5 },
              { label: "Finalizing exam", delay: 1 }
            ].map((step, index) => (
              <motion.div
                key={index}
                className="flex items-center"
                animate={{
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: step.delay,
                  ease: "easeInOut"
                }}
              >
                <motion.div
                  className="w-2 h-2 rounded-full bg-emerald-500 mr-3"
                  animate={{
                    scale: [1, 1.5, 1]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: step.delay
                  }}
                />
                <span className="text-sm text-gray-600">{step.label}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <FaGraduationCap className="text-emerald-500 mr-2" />
              <span className="text-xs text-gray-500">Powered by ExaminieAI</span>
            </div>
            <motion.div
              className="flex space-x-1"
              animate={{
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 1,
                repeat: Infinity
              }}
            >
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-emerald-500 rounded-full"
                  animate={{
                    y: [0, -4, 0]
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    delay: i * 0.1
                  }}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Custom animation for gradient */}
      <style jsx global>{`
        @keyframes gradient-x {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default Loader;






// "use client"
// import { motion } from 'framer-motion';
// import { FaRocket, FaCloudUploadAlt } from 'react-icons/fa';

// const Loader = () => {
//   return (
//     <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
//       <div className="text-center">
//         <motion.div
//           className="relative w-32 h-32 mx-auto mb-8"
//           initial={{ y: 0 }}
//           animate={{
//             y: [-20, 20, -20],
//             rotate: [0, 10, -10, 0]
//           }}
//           transition={{
//             duration: 4,
//             repeat: Infinity,
//             ease: "easeInOut"
//           }}
//         >
//           <FaRocket className="w-full h-full text-green-500" />
//           <motion.div
//             className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
//             initial={{ scale: 0.5, opacity: 0.5 }}
//             animate={{
//               scale: [0.5, 1.5, 0.5],
//               opacity: [0.5, 0.8, 0.5]
//             }}
//             transition={{
//               duration: 2,
//               repeat: Infinity,
//               ease: "easeOut"
//             }}
//           >
//             <div className="w-8 h-8 bg-orange-500 rounded-full blur-md" />
//           </motion.div>
//         </motion.div>

//         <div className="mt-4 space-y-4">
//           <motion.div
//             className="flex items-center justify-center space-x-2"
//             animate={{
//               scale: [1, 1.05, 1],
//               opacity: [0.8, 1, 0.8]
//             }}
//             transition={{
//               duration: 2,
//               repeat: Infinity,
//               ease: "easeInOut"
//             }}
//           >
//             <FaCloudUploadAlt className="w-8 h-8 text-green-500" />
//             <span className="text-xl font-semibold text-gray-700">Uploading Files</span>
//           </motion.div>

//           <div className="flex items-center justify-center space-x-3">
//             {[0, 1, 2].map((index) => (
//               <motion.div
//                 key={index}
//                 className="w-3 h-3 bg-green-500 rounded-full"
//                 animate={{
//                   scale: [1, 1.5, 1],
//                   opacity: [0.5, 1, 0.5]
//                 }}
//                 transition={{
//                   duration: 1,
//                   repeat: Infinity,
//                   delay: index * 0.2,
//                   ease: "easeInOut"
//                 }}
//               />
//             ))}
//           </div>

//           <motion.div
//             className="text-sm text-gray-500"
//             animate={{
//               opacity: [0.5, 1, 0.5]
//             }}
//             transition={{
//               duration: 2,
//               repeat: Infinity,
//               ease: "easeInOut"
//             }}
//           >
//             Please wait while we process your files...
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Loader;



// "use client"
// import { motion } from 'framer-motion';
// import React from 'react';
// import { FaClipboardCheck, FaSpinner, FaMicroscope, FaBrain, FaChartLine, FaCheckCircle } from 'react-icons/fa';

// const Loader = () => {
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <motion.div
//         className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full"
//         initial={{ scale: 0.8, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         transition={{ duration: 0.5 }}
//       >
//         <div className="flex flex-col items-center space-y-6">
//           <motion.div
//             className="flex items-center space-x-3"
//             animate={{
//               y: [0, -10, 0],
//               scale: [1, 1.05, 1]
//             }}
//             transition={{
//               duration: 2,
//               repeat: Infinity,
//               ease: "easeInOut"
//             }}
//           >
//             <motion.div
//               animate={{
//                 rotate: 360,
//                 scale: [1, 1.2, 1]
//               }}
//               transition={{
//                 duration: 2,
//                 repeat: Infinity,
//                 ease: "linear"
//               }}
//             >
//               <FaMicroscope className="w-10 h-10 text-blue-500" />
//             </motion.div>
//             <span className="text-2xl font-bold text-gray-800">Checking Exam</span>
//           </motion.div>

//           <div className="w-full bg-gray-200 rounded-full h-3">
//             <motion.div
//               className="h-3 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-full"
//               initial={{ width: "0%" }}
//               animate={{
//                 width: "100%",
//                 backgroundPosition: ["0%", "100%"]
//               }}
//               transition={{
//                 duration: 2,
//                 repeat: Infinity,
//                 ease: "easeInOut"
//               }}
//             />
//           </div>

//           <div className="flex justify-center space-x-6">
//             {[
//               { icon: FaBrain, color: "blue" },
//               { icon: FaChartLine, color: "purple" },
//               { icon: FaCheckCircle, color: "green" }
//             ].map((item, index) => (
//               <motion.div
//                 key={index}
//                 className={`flex items-center justify-center w-14 h-14 rounded-full bg-${item.color}-100`}
//                 animate={{
//                   scale: [1, 1.2, 1],
//                   rotate: [0, 360],
//                   opacity: [0.5, 1, 0.5]
//                 }}
//                 transition={{
//                   duration: 2,
//                   repeat: Infinity,
//                   delay: index * 0.3,
//                   ease: "easeInOut"
//                 }}
//               >
//                 {React.createElement(item.icon, {
//                   className: `w-7 h-7 text-${item.color}-500`
//                 })}
//               </motion.div>
//             ))}
//           </div>

//           <motion.div
//             className="text-gray-600 text-center"
//             animate={{
//               opacity: [0.5, 1, 0.5],
//               scale: [0.95, 1, 0.95]
//             }}
//             transition={{
//               duration: 2,
//               repeat: Infinity,
//               ease: "easeInOut"
//             }}
//           >
//             <motion.p
//               className="font-medium"
//               animate={{
//                 y: [0, -5, 0]
//               }}
//               transition={{
//                 duration: 1.5,
//                 repeat: Infinity
//               }}
//             >
//               Analyzing your responses...
//             </motion.p>
//             <motion.p
//               className="text-sm text-gray-500 mt-2"
//               animate={{
//                 x: [-2, 2, -2]
//               }}
//               transition={{
//                 duration: 2,
//                 repeat: Infinity
//               }}
//             >
//               Our AI is evaluating your performance
//             </motion.p>
//           </motion.div>

//           <motion.div
//             className="flex space-x-1"
//             animate={{
//               scale: [1, 1.05, 1]
//             }}
//             transition={{
//               duration: 1,
//               repeat: Infinity
//             }}
//           >
//             {[...Array(3)].map((_, i) => (
//               <motion.div
//                 key={i}
//                 className="w-2 h-2 bg-blue-500 rounded-full"
//                 animate={{
//                   y: [0, -8, 0]
//                 }}
//                 transition={{
//                   duration: 0.5,
//                   repeat: Infinity,
//                   delay: i * 0.1
//                 }}
//               />
//             ))}
//           </motion.div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default Loader;

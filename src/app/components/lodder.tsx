"use client"
import { FaPencilAlt, FaBook, FaCog, FaCheck } from 'react-icons/fa';

const Loader = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/70 to-green-900/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/90 p-10 rounded-2xl shadow-2xl text-center border-2 border-green-200">
        <div className="relative">
          <div className="flex justify-center mb-6 space-x-4 animate-bounce">
            <div className="transition-opacity duration-1000 animate-pulse">
              <FaBook className="w-16 h-16 text-blue-500 animate-spin" />
            </div>
            <div className="transition-opacity duration-1000 animate-pulse delay-300">
              <FaCog className="w-16 h-16 text-yellow-500 animate-spin" />
            </div>
            <div className="transition-opacity duration-1000 animate-pulse delay-500">
              <FaPencilAlt className="w-16 h-16 text-green-500 animate-spin" />
            </div>
          </div>
        </div>

        <div className="relative h-2 bg-gray-200 rounded-full mt-6 overflow-hidden">
          <div className="absolute top-0 left-0 h-full bg-green-500 animate-progress rounded-full w-full"></div>
        </div>

        <div className="mt-4 space-y-2">
          <p className="text-gray-600 text-lg animate-pulse">
            Generating your exam...
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <span className="animate-pulse">
              Analyzing curriculum
            </span>
            <span className="animate-pulse delay-150">
              Creating questions
            </span>
            <span className="animate-pulse delay-300">
              Finalizing exam
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;




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

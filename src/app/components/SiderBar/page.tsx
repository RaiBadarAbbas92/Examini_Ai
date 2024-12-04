"use client"
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaHome, FaBook, FaChartBar, FaSignOutAlt, FaBars, FaTimes, FaUpload, FaPlus, FaUser } from 'react-icons/fa';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { icon: <FaHome className="w-6 h-6" />, label: 'Dashboard', href: '/DashBoard' },
    { icon: <FaUpload className="w-6 h-6" />, label: 'Upload Content', href: '/ContentUpload' },
    { icon: <FaPlus className="w-6 h-6" />, label: 'Generate Exam', href: '/ContentUpload' },
    { icon: <FaUser className="w-6 h-6" />, label: 'Profile', href: '/Profile' },
  ];

  const sidebarVariants = {
    expanded: { width: '240px' },
    collapsed: { width: '80px' }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-green-500 text-white"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <motion.div
        className={`fixed left-0 top-0 h-screen bg-white shadow-xl z-40
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 transition-transform duration-300 ease-in-out`}
        variants={sidebarVariants}
        animate={isCollapsed ? 'collapsed' : 'expanded'}
        initial="expanded"
      >
        {/* Toggle Button */}
        <button
          className="hidden lg:block absolute -right-3 top-10 bg-green-500 rounded-full p-1 text-white"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <FaBars size={16} /> : <FaTimes size={16} />}
        </button>

        {/* Logo */}
        <div className="p-4 border-b">
          <h1 className={`font-bold text-xl text-green-600 ${isCollapsed ? 'hidden' : 'block'}`}>
            ExamGPT
          </h1>
        </div>

        {/* Menu Items */}
        <nav className="p-4">
          <ul className="space-y-4">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link href={item.href}>
                  <motion.div 
                    whileHover={{ x: 5 }}
                    className="flex items-center space-x-4 text-gray-600 hover:text-green-500 hover:bg-green-50 rounded-lg p-2 transition-colors duration-200"
                  >
                    {item.icon}
                    <span className={`${isCollapsed ? 'hidden' : 'block'}`}>
                      {item.label}
                    </span>
                  </motion.div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-4 left-0 right-0 p-4">
          <motion.button 
            whileHover={{ x: 5 }}
            className="flex items-center space-x-4 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg p-2 transition-colors duration-200 w-full"
          >
            <FaSignOutAlt className="w-6 h-6" />
            <span className={`${isCollapsed ? 'hidden' : 'block'}`}>
              Logout
            </span>
          </motion.button>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;

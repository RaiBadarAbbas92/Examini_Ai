"use client";
import { useState, useEffect, useRef } from 'react';
import { FaUser, FaUpload, FaPencilAlt, FaClipboardList, FaChartBar, FaSignOutAlt, FaBookOpen, FaCheck, FaTimes, FaPercentage, FaStar, FaBars, FaGraduationCap } from 'react-icons/fa';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area } from 'recharts';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const ExamList = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [hoveredPieIndex, setHoveredPieIndex] = useState<number | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [progressData, setProgressData] = useState({
    total_exams_taken: 0,
    exams_passed: 0,
    exams_failed: 0,
    overall_percentage: 0,
    overall_grade: ''
  });
  const [latestExamResult, setLatestExamResult] = useState({
    exam_title: "",
    total_marks: 0,
    obtained_marks: 0,
    grade: "",
    percentage: 0
  });
  const [allExamResults, setAllExamResults] = useState<any[]>([]);

  const router = useRouter();

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('https://examinieai.kindsky-c4c0142e.eastus.azurecontainerapps.io/student_progress/get_latest_progress', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        console.log('Progress data fetched successfully:', data);
        setProgressData({
          total_exams_taken: data.total_exams_taken,
          exams_passed: data.exams_passed,
          exams_failed: data.exams_failed,
          overall_percentage: data.overall_percentage,
          overall_grade: data.overall_grade
        });
      } catch (error) {
        console.error('Error fetching lastest progress data:', error);
      }
    };

    const fetchLatestExamResult = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('https://examinieai.kindsky-c4c0142e.eastus.azurecontainerapps.io/results/get_last_exam_result/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        console.log('Latest exam result fetched successfully:', data);
        setLatestExamResult({
          exam_title: data.exam_title,
          total_marks: data.total_marks,
          obtained_marks: data.obtained_marks,
          grade: data.grade,
          percentage: data.percentage
        });
      } catch (error) {
        console.error('Error fetching latest exam result:', error);
      }
    };

    const fetchAllExamResults = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('https://examinieai.kindsky-c4c0142e.eastus.azurecontainerapps.io/results/get_all_student_results/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        console.log('All exam results fetched successfully:', data);
        // Ensure data is an array before setting state
        setAllExamResults(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching all exam results:', error);
        setAllExamResults([]); // Set empty array on error
      }
    };

    fetchProgressData();
    fetchLatestExamResult();
    fetchAllExamResults();
  }, []);

  const menuItems = [
    { icon: <FaBookOpen className="w-6 h-6" />, label: 'Dashboard', href: '/' },
    { icon: <FaUpload className="w-6 h-6" />, label: 'Upload Content', href: '/ContentUpload' },
    { icon: <FaPencilAlt className="w-6 h-6" />, label: 'Generate Exam', href: '/ContentUpload' },
    { icon: <FaUser className="w-6 h-6" />, label: 'Profile', href: '/Profile' },
  ];

  // Process exam results for charts
  const lastTenExams = [...allExamResults]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10)
    .reverse()
    .map(exam => ({
      name: exam.exam_title,
      percentage: exam.percentage,
      grade: exam.grade
    }));

  const performanceData = allExamResults.map(exam => ({
    name: exam.exam_title,
    percentage: exam.percentage,
    grade: exam.grade
  }));

  const passFailData = [
    { name: 'Pass', value: progressData.exams_passed },
    { name: 'Fail', value: progressData.exams_failed }
  ];

  const COLORS = ['#4CAF50', '#FF5252'];

  const onPieEnter = (_: any, index: number) => {
    setHoveredPieIndex(index);
  };

  const onPieLeave = () => {
    setHoveredPieIndex(null);
  };

  const handleNavigation = (label: string) => {
    setActiveTab(label.toLowerCase());
    if (label.toLowerCase() === 'profile') {
      router.push('/components/Profile');
    }
  };

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    return (
      <g>
        <path
          d={`M ${cx},${cy} L ${cx + outerRadius * Math.cos(startAngle)},${
            cy + outerRadius * Math.sin(startAngle)
          } A ${outerRadius},${outerRadius} 0 0 1 ${
            cx + outerRadius * Math.cos(endAngle)
          },${cy + outerRadius * Math.sin(endAngle)} Z`}
          fill={fill}
          className="transition-all duration-300 ease-in-out"
          transform={hoveredPieIndex !== null ? `scale(1.1) translate(-${cx * 0.1},-${cy * 0.1})` : 'scale(1)'}
        />
      </g>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile Menu Button */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-green-500 text-white"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen bg-white shadow-xl z-40 transition-all duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 ${isCollapsed ? 'w-20' : 'w-60'}`}
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
                  <div 
                    className="flex items-center space-x-4 text-gray-600 hover:text-green-500 hover:bg-green-50 rounded-lg p-2 transition-all duration-200 hover:translate-x-1"
                  >
                    {item.icon}
                    <span className={`${isCollapsed ? 'hidden' : 'block'}`}>
                      {item.label}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-4 left-0 right-0 p-4">
          <button 
            className="flex items-center space-x-4 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg p-2 transition-all duration-200 w-full hover:translate-x-1"
          >
            <FaSignOutAlt className="w-6 h-6" />
            <span className={`${isCollapsed ? 'hidden' : 'block'}`}>
              Logout
            </span>
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div 
        className="flex-1 p-8 transition-all duration-300"
        style={{
          marginLeft: isCollapsed ? "80px" : "240px",
          width: "100%"
        }}
      >
        {/* Welcome Card */}
        <div
          className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg mb-8 transform transition-all duration-300 hover:scale-[1.02]"
        >
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold mb-2">Welcome back, Student!</h2>
              <p className="opacity-90">Track your progress and performance all in one place</p>
            </div>
            <Link href="/ContentUpload">
              <button
                className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-green-50 transition-colors flex items-center space-x-2"
              >
                <FaPencilAlt className="w-5 h-5" />
                <span>Generate New Exam</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Performance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          {[
            { icon: FaBookOpen, label: 'Total Exams', value: progressData.total_exams_taken, color: 'blue' },
            { icon: FaCheck, label: 'Total Pass', value: progressData.exams_passed, color: 'green' },
            { icon: FaTimes, label: 'Total Fail', value: progressData.exams_failed, color: 'red' },
            { icon: FaPercentage, label: 'Success Rate', value: `${parseFloat(progressData.overall_percentage.toFixed(2))}%`, color: 'purple' },
            { icon: FaGraduationCap, label: 'Total Grade', value: progressData.overall_grade, color: 'indigo' }
          ].map(({ icon: Icon, label, value, color }) => (
            <div
              key={label}
              className="bg-white p-6 rounded-lg shadow-md transform transition-all duration-300 hover:scale-105"
            >
              <Icon className={`w-8 h-8 text-${color}-500 mb-4`} />
              <h3 className="text-lg font-semibold text-gray-800">{label}</h3>
              <p className="text-2xl font-bold text-green-600">{value}</p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="space-y-8">
          {/* Pass/Fail Ratio and Latest Exam Result */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pass/Fail Ratio */}
            <div className="bg-white p-6 rounded-lg shadow-md transform transition-all duration-300 hover:shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Pass/Fail Ratio</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={passFailData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      onMouseEnter={onPieEnter}
                      onMouseLeave={onPieLeave}
                      activeShape={renderActiveShape}
                    >
                      {passFailData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]}
                          className="transition-transform duration-300"
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Latest Exam Result Card */}
            <div className="bg-white p-6 rounded-lg shadow-md transform transition-all duration-300 hover:shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Latest Exam Result</h3>
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-700">{latestExamResult.exam_title}</h4>
                <div className="space-y-2">
                  <p><span className="font-medium">Total Marks:</span> {latestExamResult.total_marks}</p>
                  <p><span className="font-medium">Obtained Marks:</span> {latestExamResult.obtained_marks}</p>
                  <p><span className="font-medium">Grade:</span> {latestExamResult.grade}</p>
                  <p><span className="font-medium">Percentage:</span> {latestExamResult.percentage}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* All Exams Performance Overview */}
          <div className="bg-white p-6 rounded-lg shadow-md transform transition-all duration-300 hover:shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">All Exams Performance Overview</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" domain={[0, 100]} />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line 
                    yAxisId="left" 
                    type="monotone" 
                    dataKey="percentage" 
                    stroke="#4CAF50" 
                    name="Percentage" 
                    dot={{ r: 4 }}
                    activeDot={{ r: 8 }}
                  />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="grade" 
                    stroke="#2196F3" 
                    name="Grade"
                    dot={{ r: 4 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default ExamList;

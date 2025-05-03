"use client"
import { useState, useEffect, useRef } from 'react';
import {
  FaUser, FaUpload, FaPencilAlt, FaClipboardList, FaChartBar, FaSignOutAlt,
  FaBookOpen, FaCheck, FaTimes, FaPercentage, FaStar, FaBars, FaGraduationCap,
  FaChartLine, FaAward, FaCalendarAlt, FaLightbulb, FaBell, FaCog, FaSearch
} from 'react-icons/fa';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { API_BASE_URL } from '@/utils/apiConfig';
import withAuth from '@/components/withAuth';

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
        const response = await fetch(`${API_BASE_URL}/student_progress/get_latest_progress`, {
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
        const response = await fetch(`${API_BASE_URL}/results/get_last_exam_result/`, {
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
        const response = await fetch(`${API_BASE_URL}/results/get_all_student_results/`, {
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
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen bg-white/90 backdrop-blur-md border-r border-gray-200 shadow-2xl z-40 transition-all duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 ${isCollapsed ? 'w-24' : 'w-72'}`}
      >
        {/* Toggle Button */}
        <button
          className="hidden lg:flex absolute -right-3 top-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full p-1.5 text-white shadow-lg justify-center items-center"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <FaBars size={14} /> : <FaTimes size={14} />}
        </button>

        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <div className={`flex items-center space-x-3 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-md">
              <FaGraduationCap className="text-white text-xl" />
            </div>
            <h1 className={`font-bold text-xl bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent ${isCollapsed ? 'hidden' : 'block'}`}>
              ExamGPT
            </h1>
          </div>
        </div>

        {/* Search Bar */}
        <div className={`px-4 pt-6 pb-2 ${isCollapsed ? 'hidden' : 'block'}`}>
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-4 mt-2">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link href={item.href}>
                  <div
                    className={`flex ${isCollapsed ? 'justify-center' : 'justify-start'} items-center space-x-4 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl p-3 transition-all duration-200 group`}
                  >
                    <div className="relative">
                      <div className="absolute -inset-2 rounded-full bg-emerald-100 transform scale-0 group-hover:scale-100 transition-transform duration-300 opacity-0 group-hover:opacity-30"></div>
                      {item.icon}
                    </div>
                    <span className={`font-medium ${isCollapsed ? 'hidden' : 'block'}`}>
                      {item.label}
                    </span>
                    {!isCollapsed && (
                      <div className="ml-auto transform translate-x-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                        <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1.5 1L6.5 6L1.5 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-8 left-0 right-0 px-4">
          <Link href="/logout">
            <button
              className={`flex ${isCollapsed ? 'justify-center' : 'justify-start'} items-center space-x-4 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-xl p-3 transition-all duration-200 w-full group`}
            >
              <div className="relative">
                <div className="absolute -inset-2 rounded-full bg-red-100 transform scale-0 group-hover:scale-100 transition-transform duration-300 opacity-0 group-hover:opacity-30"></div>
                <FaSignOutAlt className="w-6 h-6" />
              </div>
              <span className={`font-medium ${isCollapsed ? 'hidden' : 'block'}`}>
                Logout
              </span>
            </button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div
        className="flex-1 transition-all duration-300 pb-12"
        style={{
          marginLeft: isCollapsed ? "96px" : "288px",
          width: "calc(100% - " + (isCollapsed ? "96px" : "288px") + ")"
        }}
      >
        {/* Top Navigation Bar */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 px-8 py-4 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">Dashboard</h1>
              <p className="text-gray-500 text-sm">Welcome to your learning analytics</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors relative">
                <FaBell className="text-gray-500 w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <FaCog className="text-gray-500 w-5 h-5" />
              </button>
              <div className="flex items-center space-x-3 ml-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold">
                  S
                </div>
                <div className="hidden md:block">
                  <p className="font-medium text-gray-800">Student</p>
                  <p className="text-xs text-gray-500">student@example.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Card */}
        <div className="px-8">
          <div className="relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl shadow-xl mb-8">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/20 rounded-full"></div>
              <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full"></div>
            </div>
            <div className="relative p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="text-white">
                  <h2 className="text-3xl font-bold mb-2">Welcome back, Student!</h2>
                  <p className="text-emerald-50 text-lg">Track your progress and performance all in one place</p>
                  <div className="mt-4 flex items-center space-x-2">
                    <FaCalendarAlt className="text-emerald-100" />
                    <span className="text-emerald-100">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                </div>
                <Link href="/ContentUpload">
                  <button className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white px-8 py-4 rounded-xl font-semibold shadow-lg transition-all duration-300 flex items-center space-x-3 group">
                    <FaPencilAlt className="w-5 h-5" />
                    <span>Generate New Exam</span>
                    <div className="transform translate-x-0 group-hover:translate-x-1 transition-transform">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Cards */}
        <div className="px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {[
              { icon: FaBookOpen, label: 'Total Exams', value: progressData.total_exams_taken, color: 'emerald', bgColor: 'emerald-50', description: 'Exams taken so far' },
              { icon: FaCheck, label: 'Total Pass', value: progressData.exams_passed, color: 'emerald', bgColor: 'emerald-50', description: 'Successfully passed' },
              { icon: FaTimes, label: 'Total Fail', value: progressData.exams_failed, color: 'red', bgColor: 'red-50', description: 'Need improvement' },
              { icon: FaPercentage, label: 'Success Rate', value: `${parseFloat(progressData.overall_percentage?.toFixed(2))}%`, color: 'blue', bgColor: 'blue-50', description: 'Overall success' },
              { icon: FaAward, label: 'Overall Grade', value: progressData.overall_grade, color: 'purple', bgColor: 'purple-50', description: 'Current standing' }
            ].map(({ icon: Icon, label, value, color, bgColor, description }) => (
              <div
                key={label}
                className={`bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transform transition-all duration-300 hover:-translate-y-1 overflow-hidden relative group`}
              >
                <div className={`absolute top-0 left-0 w-2 h-full bg-${color}-500 transition-all duration-300 group-hover:w-full group-hover:opacity-10`}></div>
                <div className="relative">
                  <div className={`w-12 h-12 rounded-xl bg-${bgColor} flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 text-${color}-500`} />
                  </div>
                  <h3 className="text-sm font-medium text-gray-500">{label}</h3>
                  <p className={`text-3xl font-bold text-${color}-600 mt-1`}>{value}</p>
                  <p className="text-xs text-gray-400 mt-2">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts Section */}
        <div className="px-8 space-y-8">
          {/* Section Title */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Performance Analytics</h2>
              <p className="text-sm text-gray-500">Detailed insights into your exam performance</p>
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
                This Week
              </button>
              <button className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
                This Month
              </button>
              <button className="px-3 py-1.5 text-sm bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-600 font-medium">
                All Time
              </button>
            </div>
          </div>

          {/* Pass/Fail Ratio and Latest Exam Result */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pass/Fail Ratio */}
            <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Pass/Fail Ratio</h3>
                <div className="bg-emerald-50 text-emerald-600 text-xs font-medium px-2.5 py-1 rounded-full">
                  {progressData.exams_passed > progressData.exams_failed ? 'Good Standing' : 'Needs Improvement'}
                </div>
              </div>
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
                      stroke="none"
                    >
                      {passFailData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={index === 0 ? '#10b981' : '#ef4444'}
                          className="transition-transform duration-300"
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                        padding: '12px'
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                      formatter={(value, entry, index) => (
                        <span style={{ color: index === 0 ? '#10b981' : '#ef4444', fontWeight: 500 }}>
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                <div>Total Exams: {progressData.total_exams_taken}</div>
                <div>Pass Rate: {progressData.total_exams_taken > 0 ? ((progressData.exams_passed / progressData.total_exams_taken) * 100).toFixed(1) : 0}%</div>
              </div>
            </div>

            {/* Latest Exam Result Card */}
            <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Latest Exam Result</h3>
                <div className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  latestExamResult.percentage >= 80 ? 'bg-emerald-50 text-emerald-600' :
                  latestExamResult.percentage >= 60 ? 'bg-blue-50 text-blue-600' :
                  'bg-red-50 text-red-600'
                }`}>
                  {latestExamResult.grade}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-700 mb-4">{latestExamResult.exam_title || 'No exam taken yet'}</h4>

                {/* Progress Circle */}
                <div className="flex justify-center mb-6">
                  <div className="relative w-40 h-40">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      {/* Background Circle */}
                      <circle
                        cx="50" cy="50" r="45"
                        fill="none"
                        stroke="#f3f4f6"
                        strokeWidth="10"
                      />

                      {/* Progress Circle */}
                      <circle
                        cx="50" cy="50" r="45"
                        fill="none"
                        stroke={
                          latestExamResult.percentage >= 80 ? '#10b981' :
                          latestExamResult.percentage >= 60 ? '#3b82f6' :
                          '#ef4444'
                        }
                        strokeWidth="10"
                        strokeDasharray={`${2 * Math.PI * 45 * latestExamResult.percentage / 100} ${2 * Math.PI * 45 * (1 - latestExamResult.percentage / 100)}`}
                        strokeDashoffset={2 * Math.PI * 45 * 0.25}
                        strokeLinecap="round"
                      />

                      {/* Percentage Text */}
                      <text
                        x="50" y="50"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-3xl font-bold"
                        fill="#374151"
                      >
                        {latestExamResult.percentage}%
                      </text>
                    </svg>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-gray-500 text-xs mb-1">Total Marks</p>
                    <p className="text-gray-800 font-bold text-lg">{latestExamResult.total_marks}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-gray-500 text-xs mb-1">Obtained</p>
                    <p className="text-gray-800 font-bold text-lg">{latestExamResult.obtained_marks}</p>
                  </div>
                </div>
              </div>

              <Link href="/complete_result">
                <button className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors text-sm font-medium">
                  View Complete Results
                </button>
              </Link>
            </div>

            {/* Skills Radar Chart */}
            <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Skills Assessment</h3>
                <div className="bg-blue-50 text-blue-600 text-xs font-medium px-2.5 py-1 rounded-full">
                  Performance Insights
                </div>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius={90} data={[
                    { subject: 'Critical Thinking', A: Math.min(100, progressData.overall_percentage + 10), fullMark: 100 },
                    { subject: 'Problem Solving', A: Math.min(100, progressData.overall_percentage + 5), fullMark: 100 },
                    { subject: 'Knowledge', A: progressData.overall_percentage, fullMark: 100 },
                    { subject: 'Application', A: Math.max(0, progressData.overall_percentage - 5), fullMark: 100 },
                    { subject: 'Analysis', A: Math.min(100, progressData.overall_percentage + 15), fullMark: 100 },
                  ]}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#9ca3af' }} />
                    <Radar name="Skills" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.5} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                        padding: '12px'
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="text-center mt-2">
                <p className="text-sm text-gray-500">Based on your exam performance across different skill areas</p>
              </div>
            </div>
          </div>

          {/* All Exams Performance Overview */}
          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Performance Trends</h3>
                <p className="text-sm text-gray-500">Your exam performance over time</p>
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
                  Percentage
                </button>
                <button className="px-3 py-1.5 text-xs bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-600 font-medium">
                  All Metrics
                </button>
              </div>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPercentage" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickLine={{ stroke: '#e5e7eb' }}
                  />
                  <YAxis
                    yAxisId="left"
                    domain={[0, 100]}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickLine={{ stroke: '#e5e7eb' }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickLine={{ stroke: '#e5e7eb' }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                      padding: '12px'
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    iconType="circle"
                    formatter={(value, entry, index) => (
                      <span style={{ color: index === 0 ? '#10b981' : '#3b82f6', fontWeight: 500 }}>
                        {value}
                      </span>
                    )}
                  />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="percentage"
                    stroke="#10b981"
                    strokeWidth={3}
                    fill="url(#colorPercentage)"
                    name="Percentage"
                    activeDot={{ r: 8, strokeWidth: 0, fill: '#10b981' }}
                    dot={{ r: 4, strokeWidth: 0, fill: '#10b981' }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="grade"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    name="Grade"
                    dot={{ r: 4, strokeWidth: 0, fill: '#3b82f6' }}
                    activeDot={{ r: 8, strokeWidth: 0, fill: '#3b82f6' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(ExamList);

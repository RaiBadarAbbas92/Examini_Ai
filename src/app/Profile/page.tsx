'use client'
import {
  FaUser, FaGraduationCap, FaBriefcase, FaMapMarkerAlt, FaCalendarAlt,
  FaVenusMars, FaBook, FaLightbulb, FaChartLine, FaCog, FaEdit
} from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Sidebar from '../components/SiderBar/page';
import { API_BASE_URL } from '@/utils/apiConfig';
import withAuth from '@/components/withAuth';

const ProfilePage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [showDashboard, setShowDashboard] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState({
    age: 0,
    gender: "",
    country: "",
    social_interaction_style: "",
    decision_making_approach: "",
    current_level_of_education: "",
    last_grade: "",
    favorite_subject: "",
    interested_career_paths: "",
    free_time_activities: "",
    motivation_to_study: "",
    short_term_academic_goals: "",
    long_term_academic_goals: "",
    id: "",
    name: "",
    email: "",
    profile_summary: "",
    created_at: "",
    updated_at: ""
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`${API_BASE_URL}/student/get_student_profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            router.push('/login');
            return;
          }
          throw new Error('Failed to fetch profile data');
        }
        const data = await response.json();
        setProfileData(data);
        setError(null);
        console.log('Profile fetched successfully:', data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile data. Please try again later.');
      }
    };

    fetchProfile();
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="p-8 flex items-center justify-center">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-8 lg:ml-60 transform transition-all duration-500 ease-in-out translate-y-0 opacity-100">
        {/* Top Navigation Bar */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4 mb-8 rounded-xl shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">My Profile</h1>
              <p className="text-gray-500 text-sm">View and manage your personal information</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors shadow-sm">
                <FaCog className="text-gray-500" />
                <span className="text-sm font-medium">Settings</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg hover:from-emerald-600 hover:to-teal-700 text-white transition-colors shadow-sm">
                <FaEdit className="text-white" />
                <span className="text-sm font-medium">Edit Profile</span>
              </button>
            </div>
          </div>
        </div>

        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-8">
          <div className="h-32 bg-gradient-to-r from-emerald-500 to-teal-600 relative">
            <div className="absolute -bottom-16 left-8">
              <div className="h-32 w-32 rounded-full border-4 border-white bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-3xl font-bold text-white shadow-md">
                {profileData.name ? profileData.name.charAt(0).toUpperCase() : ''}
              </div>
            </div>
          </div>
          <div className="pt-20 pb-6 px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{profileData.name || 'Student Name'}</h2>
                <div className="flex items-center mt-1 text-gray-600">
                  <FaMapMarkerAlt className="text-gray-400 mr-1" />
                  <span>{profileData.country || 'Location'}</span>
                  <span className="mx-2">•</span>
                  <span>{profileData.email || 'email@example.com'}</span>
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex items-center">
                <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                  {profileData.current_level_of_education || 'Student'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <FaLightbulb className="text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Profile Summary</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            {profileData.profile_summary ||
            "This is your profile summary. It provides an overview of your academic background, learning preferences, and career goals. This information helps ExaminieAI personalize your learning experience."}
          </p>
        </div>

        {/* Details Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <DetailCard
            title="Personal Information"
            icon={<FaUser className="text-emerald-600" />}
            color="emerald"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem icon={<FaCalendarAlt />} label="Age" value={profileData.age} />
              <DetailItem icon={<FaVenusMars />} label="Gender" value={profileData.gender} />
              <DetailItem icon={<FaMapMarkerAlt />} label="Country" value={profileData.country} />
              <DetailItem icon={<FaLightbulb />} label="Free Time Activities" value={profileData.free_time_activities} />
              <DetailItem icon={<FaChartLine />} label="Motivation to Study" value={profileData.motivation_to_study} />
            </div>
          </DetailCard>

          <DetailCard
            title="Academic Profile"
            icon={<FaGraduationCap className="text-blue-600" />}
            color="blue"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem icon={<FaGraduationCap />} label="Education Level" value={profileData.current_level_of_education} />
              <DetailItem icon={<FaChartLine />} label="Last Grade" value={profileData.last_grade} />
              <DetailItem icon={<FaBook />} label="Favorite Subject" value={profileData.favorite_subject} />
              <DetailItem icon={<FaLightbulb />} label="Short Term Goals" value={profileData.short_term_academic_goals} />
              <DetailItem icon={<FaChartLine />} label="Long Term Goals" value={profileData.long_term_academic_goals} />
            </div>
          </DetailCard>
        </div>

        <div className="mb-8">
          <DetailCard
            title="Career & Interests"
            icon={<FaBriefcase className="text-purple-600" />}
            color="purple"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <DetailItem icon={<FaBriefcase />} label="Career Path" value={profileData.interested_career_paths} />
              <DetailItem icon={<FaUser />} label="Learning Style" value={profileData.social_interaction_style} />
              <DetailItem icon={<FaLightbulb />} label="Decision Making" value={profileData.decision_making_approach} />
            </div>
          </DetailCard>
        </div>

        {/* Account Information */}
        <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <FaCog className="text-gray-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Account Information</h2>
            </div>
            <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
              Change Password
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">Email Address</p>
              <p className="font-medium text-gray-800">{profileData.email || 'email@example.com'}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">Account Created</p>
              <p className="font-medium text-gray-800">
                {profileData.created_at ? new Date(profileData.created_at).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailCard = ({ title, icon, children, color = "emerald" }: { title: string, icon: React.ReactNode, children: React.ReactNode, color?: string }) => (
  <div className={`bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300`}>
    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
      <div className={`w-10 h-10 rounded-full bg-${color}-100 flex items-center justify-center`}>
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-800">{title}</h3>
    </div>
    <div>
      {children}
    </div>
  </div>
);

const DetailItem = ({ icon, label, value }: { icon?: React.ReactNode, label: string, value: string | number }) => (
  <div className="bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-colors duration-200">
    <div className="flex items-center gap-2 mb-1">
      {icon && <span className="text-gray-400 text-sm">{icon}</span>}
      <span className="text-gray-500 text-sm">{label}</span>
    </div>
    <span className="text-gray-800 font-medium block">{value || 'Not specified'}</span>
  </div>
);

export default withAuth(ProfilePage);

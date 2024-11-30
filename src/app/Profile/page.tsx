'use client'
import { FaUser, FaGraduationCap, FaBriefcase } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Sidebar from '../components/SiderBar/page';

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

        const response = await fetch('https://examinieai.kindsky-c4c0142e.eastus.azurecontainerapps.io/student/get_student_profile', {
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
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      {/* Main Content */}
      <div className="flex-1 p-8 lg:ml-60 transform transition-all duration-500 ease-in-out translate-y-0 opacity-100">
        {/* Profile Header */}
        <div className="flex items-center gap-6 bg-white rounded-lg shadow-md p-6">
          <div className="h-20 w-20 rounded-full bg-green-600 flex items-center justify-center text-2xl font-bold text-white">
            {profileData.name ? profileData.name.charAt(0).toUpperCase() : ''}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{profileData.name}</h2>
            <p className="text-sm text-gray-600">{profileData.email}</p>
          </div>
        </div>

        {/* Summary Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Profile Summary</h2>
          <p className="text-gray-600 leading-relaxed">{profileData.profile_summary}</p>
        </div>

        {/* Details Sections */}
        <div className="space-y-6 mt-8">
          <DetailCard title="Personal Information" icon={<FaUser className="text-green-600" />}>
            <DetailItem label="Age" value={profileData.age} />
            <DetailItem label="Gender" value={profileData.gender} />
            <DetailItem label="Country" value={profileData.country} />
            <DetailItem label="Free Time Activities" value={profileData.free_time_activities} />
            <DetailItem label="Motivation to Study" value={profileData.motivation_to_study} />
          </DetailCard>

          <DetailCard title="Academic Profile" icon={<FaGraduationCap className="text-green-600" />}>
            <DetailItem label="Education Level" value={profileData.current_level_of_education} />
            <DetailItem label="Last Grade" value={profileData.last_grade} />
            <DetailItem label="Favorite Subject" value={profileData.favorite_subject} />
            <DetailItem label="Short Term Goals" value={profileData.short_term_academic_goals} />
            <DetailItem label="Long Term Goals" value={profileData.long_term_academic_goals} />
          </DetailCard>

          <DetailCard title="Career & Interests" icon={<FaBriefcase className="text-green-600" />}>
            <DetailItem label="Career Path" value={profileData.interested_career_paths} />
            <DetailItem label="Learning Style" value={profileData.social_interaction_style} />
            <DetailItem label="Decision Making" value={profileData.decision_making_approach} />
          </DetailCard>
        </div>
      </div>
    </div>
  );
};

const DetailCard = ({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center gap-3 mb-4">
      {icon}
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    </div>
    <div className="space-y-3">
      {children}
    </div>
  </div>
);

const DetailItem = ({ label, value }: { label: string, value: string | number }) => (
  <div className="flex justify-between">
    <span className="text-gray-600">{label}:</span>
    <span className="text-gray-800 font-medium">{value}</span>
  </div>
);

export default ProfilePage;

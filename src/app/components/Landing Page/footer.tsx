'use client'
import Image from 'next/image'
import Link from 'next/link'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGithub, FaMoon, FaStar, FaCode, FaHeart, FaRobot, FaRocket, FaBrain } from 'react-icons/fa'

const Footer = () => {
  const logoUrl = "/logo.png"; // Use a local logo image instead
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800 pt-16 pb-8 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-100 rounded-full opacity-30 blur-lg"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-100 rounded-full opacity-30 blur-lg"></div>

      <div className="container mx-auto px-4 relative z-10">

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

          {/* Logo & Description */}
          <div className="col-span-1">
            <div className="flex items-center mb-5">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full"></div>
                <Image
                  src={logoUrl}
                  alt="ExaminAI Logo"
                  width={48}
                  height={48}
                  className="relative z-10"
                />
              </div>
              <h3 className="ml-3 text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
                ExaminAI
              </h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Revolutionizing education through AI-driven examination solutions. Create personalized assessments and receive instant feedback.
            </p>

            {/* Social Links */}
            <div className="mt-6 flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-emerald-600 hover:bg-emerald-50 transition-colors duration-300">
                <FaFacebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-emerald-600 hover:bg-emerald-50 transition-colors duration-300">
                <FaTwitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-emerald-600 hover:bg-emerald-50 transition-colors duration-300">
                <FaInstagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-emerald-600 hover:bg-emerald-50 transition-colors duration-300">
                <FaLinkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h4 className="text-lg font-bold mb-5 bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { name: 'Dashboard', href: '/dashboard' },
                { name: 'Generate Exam', href: '/generate-exam' },
                { name: 'Profile', href: '/profile' },
                { name: 'Upload Content', href: '/content-upload' },
                { name: 'Results', href: '/results' }
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-emerald-600 transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 transform scale-0 group-hover:scale-100 transition-transform duration-300"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="col-span-1">
            <h4 className="text-lg font-bold mb-5 bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
              Resources
            </h4>
            <ul className="space-y-3">
              {[
                { name: 'Help Center', href: '#' },
                { name: 'Documentation', href: '#' },
                { name: 'API Reference', href: '#' },
                { name: 'Privacy Policy', href: '#' },
                { name: 'Terms of Service', href: '#' }
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-emerald-600 transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 transform scale-0 group-hover:scale-100 transition-transform duration-300"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h4 className="text-lg font-bold mb-5 bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
              Contact Us
            </h4>
            <div className="space-y-4">
              <p className="text-gray-600 flex items-start">
                <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center mr-3 mt-1">
                  <span className="text-emerald-600 text-xs">✉</span>
                </span>
                <span>
                  <a href="mailto:raibadar37218@gmail.com" className="text-gray-600 hover:text-emerald-600 transition-colors duration-300">
                    raibadar37218@gmail.com
                  </a>
                </span>
              </p>
              <p className="text-gray-600 flex items-start">
                <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center mr-3 mt-1">
                  <span className="text-emerald-600 text-xs">☎</span>
                </span>
                <span>
                  <a href="tel:+923194821372" className="text-gray-600 hover:text-emerald-600 transition-colors duration-300">
                    +92 319 4821372
                  </a>
                </span>
              </p>
              <div className="pt-4">
                <h5 className="text-sm font-semibold text-gray-700 mb-3">Subscribe to our newsletter</h5>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="flex-1 px-4 py-2 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <button className="bg-gradient-to-r from-emerald-500 to-teal-400 text-white px-4 py-2 rounded-r-lg hover:from-emerald-600 hover:to-teal-500 transition-colors duration-300">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>



        {/* Lunar AI Studio Section */}
        <div className="border-t border-gray-200 pt-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-900 mr-3">
                <FaMoon className="text-white" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800">Lunar AI Studio</h4>
                <p className="text-sm text-gray-600">Agentic AI Solutions</p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">Powered by</span>
              <FaRocket className="text-blue-500 mx-1" />
              <span className="text-gray-600 mr-2">from</span>
              <span className="font-semibold text-gray-800">Lunar AI Studio</span>
            </div>
          </div>
        </div>

        {/* Copyright with Lunar AI Studio attribution */}
        <div className="text-center border-t border-gray-200 pt-8">
          <p className="text-gray-600 mb-2">
            © {currentYear} ExaminAI. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm flex items-center justify-center">
            <span>Built by</span>
            <span className="mx-1 font-medium text-gray-700 flex items-center">
              <FaMoon className="text-gray-700 mr-1" size={12} />
              Lunar AI Studio
            </span>
            <span>with</span>
            <FaRocket className="mx-1 text-blue-500" size={12} />
            <span>Agentic AI Technology</span>
          </p>
        </div>

      </div>
    </footer>
  )
}

export default Footer

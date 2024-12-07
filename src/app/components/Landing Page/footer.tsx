'use client'
import Image from 'next/image'
import Link from 'next/link'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa'

const Footer = () => {
  const logoUrl = "/logo.png"; // Use a local logo image instead

  return (
    <footer className="bg-white text-gray-800 pt-12 pb-8">
      <div className="container mx-auto px-4">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Logo & Description */}
          <div className="col-span-1">
            <div className="flex items-center mb-4">
              <Image 
                src={logoUrl} // Use the logoUrl variable
                alt="Examii AI Logo"
                width={40}
                height={40}
                className="mr-2"
              />
              <h3 className="text-xl font-bold">Examii AI</h3>
            </div>
            <p className="text-gray-600">
              Empowering education through AI-driven examination solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/dashboard" className="text-gray-600 hover:text-green-500">Dashboard</Link></li>
              <li><Link href="/generate-exam" className="text-gray-600 hover:text-green-500">Generate Exam</Link></li>
              <li><Link href="/profile" className="text-gray-600 hover:text-green-500">Profile</Link></li>
              <li><Link href="/content-upload" className="text-gray-600 hover:text-green-500">Upload Content</Link></li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="col-span-1">
            <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-green-500"><FaFacebook size={24} /></a>
              <a href="#" className="text-gray-600 hover:text-green-500"><FaTwitter size={24} /></a>
              <a href="#" className="text-gray-600 hover:text-green-500"><FaInstagram size={24} /></a>
              <a href="#" className="text-gray-600 hover:text-green-500"><FaLinkedin size={24} /></a>
              <a href="#" className="text-gray-600 hover:text-green-500"><FaGithub size={24} /></a>
            </div>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <p className="text-gray-600">Email: raibadar37218@gmail.com</p>
            <p className="text-gray-600">Phone: +92 319 4821372</p>
          </div>
        </div>

        {/* Team Section */}
        <div className="border-t border-gray-200 pt-8 mb-8">
          <h4 className="text-lg font-semibold mb-6 text-center">Our Team</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { name: 'Zain Attiq', role: 'Backend Developer', image: '/zain.png' },
              { name: 'Badar Abbas', role: 'Frontend Developer + Api Integration', image: '/badar.jpg' },
              { name: 'Dev Tahir ', role: 'Frontend Developer + Api Integration', image: '/tahir.jpg' },
              { name: 'Ali Haider', role: 'Frontend Developer', image: '/team4.jpg' }
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <h5 className="font-semibold">{member.name}</h5>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center border-t border-gray-200 pt-8">
          <p className="text-gray-600">
            © {new Date().getFullYear()} Examii AI. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  )
}

export default Footer

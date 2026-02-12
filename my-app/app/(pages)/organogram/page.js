"use client"
import Link from 'next/link'
import { FaUserTie, FaUsers, FaLeaf, FaArrowRight, FaArrowLeft, FaSitemap } from 'react-icons/fa'

export default function OrganogramPage() {
  const domains = [
    { title: "Health & Hygiene", color: "bg-blue-50 text-blue-700" },
    { title: "Agriculture", color: "bg-green-50 text-green-700" },
    { title: "Quality Education", color: "bg-yellow-50 text-yellow-700" },
    { title: "Village Infrastructure", color: "bg-gray-50 text-gray-700" },
    { title: "Water Conservation", color: "bg-blue-50 text-blue-700" },
    { title: "Material & Resources", color: "bg-purple-50 text-purple-700" },
    { title: "Social Actions", color: "bg-red-50 text-red-700" },
    { title: "Green Innovation", color: "bg-green-50 text-green-700" },
    { title: "Women Empowerment", color: "bg-pink-50 text-pink-700" }
  ];

  const mentors = ["Prof. Advisor A", "Prof. Advisor B", "Prof. Advisor C", "Prof. Advisor D"];

  return (
    <div className="w-full min-h-screen bg-white font-sans text-gray-800">

      {/* Hero Section */}
      <div className="bg-[#008000] text-white py-16 px-4 text-center shadow-lg relative overflow-hidden">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2 relative z-10">
          Organization Structure
        </h1>
        <p className="text-lg text-green-100 relative z-10 max-w-2xl mx-auto">
          The framework driving our vision into reality.
        </p>
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      </div>

      {/* Breadcrumb / Nav */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-[#008000] font-medium hover:underline gap-2 transition-colors">
          <FaArrowLeft /> Back to Home
        </Link>
      </div>


      {/* Tree Visualization */}
      <div className="max-w-7xl mx-auto px-4 pb-20 overflow-x-auto">
        <div className="flex flex-col items-center min-w-[800px]">

          {/* Level 1: Chancellor */}
          <div className="relative group z-30">
            <div className="bg-white border-2 border-[#008000] text-[#008000] px-10 py-5 rounded-2xl shadow-xl font-bold text-2xl flex items-center gap-4 hover:scale-105 transition-transform duration-300 relative z-20">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                <FaUserTie className="text-xl" />
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-400 uppercase tracking-wider">Leadership</span>
                Chancellor
              </div>
            </div>
            {/* Vertical Line Down */}
            <div className="absolute top-full left-1/2 w-0.5 h-12 bg-gray-300 -translate-x-1/2 z-10"></div>
          </div>

          {/* Level 2: CEO */} 
          <div className="relative group z-20 mt-12">
            <div className="bg-[#008000] text-white px-10 py-5 rounded-2xl shadow-xl font-bold text-2xl flex items-center gap-4 hover:scale-105 transition-transform duration-300 relative z-20">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <FaSitemap className="text-xl" />
              </div>
              <div>
                <span className="block text-sm font-medium text-green-100 uppercase tracking-wider">Executive</span>
                CEO - SVR
              </div>
            </div>
            {/* Vertical Line Down */}
            <div className="absolute top-full left-1/2 w-0.5 h-12 bg-gray-300 -translate-x-1/2 z-10 transition-colors group-hover:bg-[#008000]"></div>
          </div>

          {/* Level 3: Mentors */} 
          <div className="w-full mt-12 relative px-8">
            {/* Horizontal Connecting Bar */}
            <div className="absolute top-0 left-[12.5%] right-[12.5%] h-0.5 bg-gray-300"></div>

            {/* Vertical Connector from CEO */}
            <div className="absolute -top-12 left-1/2 w-0.5 h-12 bg-gray-300 -translate-x-1/2"></div>

            <div className="grid grid-cols-4 gap-8">
              {mentors.map((mentor, index) => (
                <div key={index} className="flex flex-col items-center relative group/mentor">
                  {/* Vertical Line Up to Bar */}
                  <div className="h-8 w-0.5 bg-gray-300 mb-0"></div>

                  <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 w-full text-center hover:border-[#008000] hover:shadow-lg transition-all">
                    <span className="text-gray-500 text-xs uppercase font-bold mb-1 block">Mentor</span>
                    <h4 className="font-bold text-gray-800">{mentor}</h4>
                  </div>

                  {/* Vertical Line Down (optional, maybe to domains) */}
                  {/* For simplicity in this view, we'll keep domains separate logically below */}
                </div>
              ))}
            </div>
          </div>

          {/* Connector to Domains */}
          <div className="h-16 w-0.5 bg-gray-300 mt-4"></div>

          {/* Level 4: Domains Grid */}
          <div className="w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100 relative z-10">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-4 text-gray-400 font-medium text-sm tracking-widest uppercase">
              Operational Pillars
            </div>

            <div className="grid grid-cols-3 gap-6 pt-4">
              {domains.map((domain, index) => (
                <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-transparent hover:border-[#008000] hover:bg-white hover:shadow-md transition-all group/domain">
                  <div className="w-10 h-10 rounded-full bg-[#008000]/10 flex items-center justify-center text-[#008000] group-hover/domain:bg-[#008000] group-hover/domain:text-white transition-colors">
                    <FaLeaf />
                  </div>
                  <span className="font-semibold text-gray-700 group-hover/domain:text-[#008000] transition-colors">
                    {domain.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-gray-50 py-12 border-t border-gray-100 flex justify-center">
        <Link href="/" className="px-8 py-3 bg-[#008000] text-white rounded-lg font-bold hover:bg-green-700 shadow-md transition-all flex items-center gap-2">
          <FaArrowLeft /> Return to Home
        </Link>
      </div>

    </div>
  )
}
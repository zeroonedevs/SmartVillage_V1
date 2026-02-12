"use client"
import Link from 'next/link'
import { FaEye, FaBullseye, FaArrowLeft, FaArrowRight } from 'react-icons/fa'

export default function MissionPage() {
  return (
    <div className="w-full min-h-screen bg-white font-sans text-gray-800">

      {/* Hero Section */}
      <div className="bg-[#008000] text-white py-16 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Vision & Mission
          </h1>
          <p className="text-lg md:text-xl text-green-100 max-w-2xl mx-auto font-light">
            Guiding principles that drive the Smart Village Revolution forward.
          </p>
        </div>

        {/* Abstract Pattern overlay */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      </div>

      {/* Breadcrumb / Nav */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link href="/" className="inline-flex items-center text-[#008000] font-medium hover:underline gap-2 transition-colors">
          <FaArrowLeft /> Back to Home
        </Link>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 pb-20 space-y-16">

        {/* Vision Block */}
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/3 flex justify-center">
            <div className="w-40 h-40 bg-green-50 rounded-full flex items-center justify-center shadow-inner">
              <FaEye className="text-6xl text-[#008000]" />
            </div>
          </div>
          <div className="w-full md:w-2/3">
            <h2 className="text-3xl font-bold text-[#008000] mb-6 border-l-4 border-[#008000] pl-4">
              Our Vision
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed font-light">
              "To develop model villages with progressive and dynamic features,
              while ensuring the holistic development of students through active community
              engagement and real-time projects."
            </p>
          </div>
        </div>

        <div className="w-full h-px bg-gray-100"></div>

        {/* Mission Block */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-12">
          <div className="w-full md:w-1/3 flex justify-center">
            <div className="w-40 h-40 bg-green-50 rounded-full flex items-center justify-center shadow-inner">
              <FaBullseye className="text-6xl text-[#008000]" />
            </div>
          </div>
          <div className="w-full md:w-2/3 text-right md:text-right">
            {/* Text alignment decision: usually left is better for reading long text, but visual balance might suggest right. Sticking to Left for readability, but re-ordering flex. */}
            <div className="flex flex-col items-end">
              <h2 className="text-3xl font-bold text-[#008000] mb-6 border-r-4 border-[#008000] pr-4">
                Our Mission
              </h2>
              <p className="text-xl text-gray-700 leading-relaxed font-light text-right">
                "To impart quality higher education and to undertake research and extension with
                emphasis on application and innovation that cater to the emerging societal needs
                through all-round development of the students of all sections enabling them to be
                globally competitive and socially responsible citizens with intrinsic values."
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Footer CTA */}
      <div className="bg-gray-50 py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div>
            <span className="text-gray-500 font-medium">Next Section</span>
            <h3 className="text-xl font-bold text-gray-800">Our Objectives</h3>
          </div>
          <Link href="/objectives" className="px-8 py-3 bg-[#008000] text-white rounded-lg font-bold hover:bg-green-700 shadow-md transition-all flex items-center gap-2">
            Continue <FaArrowRight />
          </Link>
        </div>
      </div>

    </div>
  )
}

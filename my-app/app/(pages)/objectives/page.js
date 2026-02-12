"use client"
import Link from 'next/link'
import { FaCheckCircle, FaArrowLeft } from 'react-icons/fa'

export default function ObjectivesPage() {
  const objectives = [
    {
      title: "Active Engagement in Problem Solving",
      description: "Empowering students and communities to identify, analyze, and solve real-world challenges in rural areas through hands-on participation and collaborative efforts."
    },
    {
      title: "Promotion of Technological Innovations",
      description: "Introducing and implementing cutting-edge technologies and sustainable solutions tailored to the unique needs of village development and modernization."
    },
    {
      title: "Inculcation of Social Responsibility",
      description: "Fostering a deep sense of civic duty and ethical commitment among students and citizens to contribute meaningfully to societal progress and welfare."
    },
    {
      title: "Empowerment as Catalyst for Change",
      description: "Building capacity and confidence in individuals and communities to become agents of socio-economic transformation and sustainable development."
    },
    {
      title: "Bridging Education and Action",
      description: "Creating seamless connections between theoretical knowledge and practical application through real-time projects, internships, and community engagement initiatives."
    },
    {
      title: "Development of Entrepreneurial Mindset",
      description: "Cultivating innovative thinking, self-reliance, and business acumen to enable individuals to create sustainable livelihoods and economic opportunities."
    },
    {
      title: "Transformation into Model Villages",
      description: "Systematically developing adopted villages into Adarsh Grams (Model Villages) that exemplify progress, sustainability, and holistic community development."
    }
  ];

  return (
    <div className="w-full min-h-screen bg-white font-sans text-gray-800">

      {/* Hero Section */}
      <div className="bg-[#008000] text-white py-20 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-6">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Our Strategic Objectives
            </h1>
            <div className="w-24 h-1 bg-white/30 mx-auto rounded-full mb-6"></div>
            <p className="text-xl md:text-2xl text-green-100 max-w-4xl mx-auto font-light leading-relaxed">
              Seven pillars guiding our mission to transform rural communities through education, innovation, and sustainable development.
            </p>
          </div>
        </div>

        {/* Abstract Pattern overlay */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      </div>

      {/* Breadcrumb / Nav */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-[#008000] font-medium hover:underline gap-2 transition-colors">
          <FaArrowLeft /> Back to Home
        </Link>
      </div>

      {/* Objectives Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-20">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {objectives.map((obj, index) => (
            <div key={index} className="group relative bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-2xl hover:border-[#008000]/20 transition-all duration-300">

              {/* Number Badge */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#008000] text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg group-hover:scale-110 transition-transform">
                {index + 1}
              </div>

              {/* Content */}
              <div className="ml-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-[#008000] group-hover:bg-[#008000] group-hover:text-white transition-colors">
                      <FaCheckCircle className="text-lg" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-[#008000] transition-colors leading-tight">
                    {obj.title}
                  </h3>
                </div>

                <p className="text-gray-600 text-lg leading-relaxed ml-12">
                  {obj.description}
                </p>
              </div>

              {/* Decorative corner */}
              <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-green-50 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          ))}
        </div>

      </div>

      {/* Footer CTA */}
      <div className="bg-gray-50 py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="mb-8">
            <span className="text-gray-500 font-medium uppercase tracking-wider text-sm">Explore Further</span>
            <h3 className="text-3xl font-bold text-gray-800 mt-2">Discover Our Organizational Structure</h3>
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
              Learn how our team is organized to achieve these objectives effectively.
            </p>
          </div>
          <div className="flex gap-4 justify-center">
            <Link href="/mission" className="px-8 py-3 bg-white border-2 border-[#008000] text-[#008000] rounded-lg font-bold hover:bg-green-50 shadow-sm transition-all">
              Vision & Mission
            </Link>
            <Link href="/organogram" className="px-8 py-3 bg-[#008000] text-white rounded-lg font-bold hover:bg-green-700 shadow-md transition-all">
              View Organogram
            </Link>
          </div>
        </div>
      </div>

    </div>
  )
}
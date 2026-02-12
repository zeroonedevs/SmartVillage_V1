"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import ImageSkeleton from '../../components/ImageSkeleton/ImageSkeleton';
import { FaCalendarAlt, FaSearch } from 'react-icons/fa';
import Footer from "../../components/SmallFooter/footer";

export default function AwardsPage() {
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadedImages, setLoadedImages] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchAwards = async () => {
      try {
        const response = await fetch('/api/awards');
        if (!response.ok) throw new Error('Failed to fetch awards');
        const data = await response.json();
        if (data.success) {
          const mappedAwards = data.data.map((award, index) => ({
            id: award._id || index + 1,
            title: award.title,
            year: award.year,
            image: award.image,
            description: award.description
          }));
          setAwards(mappedAwards);
        }
      } catch (err) {
        console.error('Error fetching awards:', err);
        setError('Failed to load awards. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchAwards();
  }, []);

  const handleImageLoad = (awardId) => {
    setLoadedImages(prev => ({ ...prev, [awardId]: true }));
  };

  const filteredAwards = awards.filter(award =>
    award.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    award.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-gray-200 selection:text-[#008000]">

      {/* Modern Hero Header - Matching News Page Style */}
      <div className="bg-[#008000] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        {/* Abstract shapes colored to match theme */}
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-4 text-white">
                Our Awards & <br /> <span className="text-orange-400">Recognition</span>
              </h1>
              <p className="text-lg text-white max-w-xl leading-relaxed">
                Celebrating the milestones and honors that define our commitment to the Smart Village Revolution.
              </p>
            </div>

            {/* Search Bar in Hero */}
            <div className="w-full md:w-auto min-w-[320px]">
              <div className="relative group">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-11 pr-4 py-4 bg-white/10 border border-white/20 rounded-lg leading-5 text-white placeholder-gray-300 focus:outline-none focus:bg-white/20 focus:ring-2 focus:ring-orange-400 focus:border-transparent sm:text-sm backdrop-blur-md transition-all"
                    placeholder="Search awards..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 pb-20">

        {/* Navigation / Breadcrumb Area */}
        <div className="flex justify-between items-center mb-10">
          <div className="bg-white p-1 rounded-xl shadow-lg border border-gray-100 inline-flex">
            <Link href="/" className="px-6 py-2.5 rounded-lg text-gray-600 font-medium hover:bg-gray-50 transition-colors text-sm no-underline">Home</Link>
            <span className="px-6 py-2.5 rounded-lg bg-green-50 text-[#008000] font-semibold shadow-sm text-sm">Awards</span>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-white rounded-2xl animate-pulse border border-gray-200 shadow-md"></div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl shadow-xl border border-red-100 text-center max-w-lg mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Unable to Load Awards</h3>
            <p className="text-gray-500">{error}</p>
          </div>
        ) : filteredAwards.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-md border border-gray-100">
            <p className="text-2xl text-gray-400 font-light">No awards found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAwards.map((award) => (
              <div
                key={award.id}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 flex flex-col h-full hover:-translate-y-1"
              >
                {/* Image Section - Adjusted for Awards (likely portrait images) */}
                <div className="relative h-80 overflow-hidden bg-gray-100">
                  <div className="absolute top-4 right-4 z-20">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/95 backdrop-blur-md text-gray-800 text-xs font-bold shadow-sm border-l-4 border-orange-500">
                      <FaCalendarAlt className="text-[#008000]" />
                      {award.year}
                    </span>
                  </div>

                  {!loadedImages[award.id] && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                      <ImageSkeleton variant="rectangular" />
                    </div>
                  )}

                  <Image
                    src={award.image}
                    alt={award.title}
                    width={500}
                    height={700}
                    className={`object-cover w-full h-full transition-transform duration-700 ease-in-out will-change-transform group-hover:scale-105 ${loadedImages[award.id] ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'}`}
                    onLoad={() => handleImageLoad(award.id)}
                  />

                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="mb-3">
                    <span className="text-xs font-bold tracking-wider text-[#008000] uppercase bg-gray-100 px-2 py-1 rounded-md border border-gray-200">Award</span>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 mb-3 leading-snug group-hover:text-[#008000] transition-colors">
                    {award.title}
                  </h2>

                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-4 group-hover:line-clamp-none transition-all duration-300 flex-1">
                    {award.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-auto border-t border-gray-200">
        <Footer />
      </div>
    </div>
  );
}
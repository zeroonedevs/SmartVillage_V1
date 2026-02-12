"use client";
import React, { useEffect, useState } from 'react';
import { FaArrowUp, FaSearch, FaCalendarAlt, FaArrowRight } from 'react-icons/fa';
import Footer from "../../components/SmallFooter/footer";

export default function NewsPage() {
  const [newsArticles, setNewsArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/news');
        if (!response.ok) throw new Error('Failed to fetch news');
        const data = await response.json();
        if (data.success && data.data) {
          const mappedArticles = data.data.map((article, index) => ({
            id: article._id || index + 1,
            title: article.title,
            date: article.date,
            imageUrl: article.imageUrl,
            excerpt: article.excerpt,
            link: article.link || '',
          }));
          setNewsArticles(mappedArticles);
        } else {
          setError('No news articles found.');
        }
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to load news. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowScrollToTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const filteredArticles = newsArticles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-gray-200 selection:text-green-800">
      {/* Floating Back to Top */}
      <div className={`fixed bottom-8 right-8 z-50 transition-all duration-500 transform ${showScrollToTop ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <button
          onClick={scrollToTop}
          className="bg-[#008000] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-[#008000] hover:shadow-green-900/30 transition-all duration-300 group"
        >
          <FaArrowUp className="group-hover:-translate-y-1 transition-transform" />
        </button>
      </div>

      {/* Modern Hero Header - Standard Green Theme */}
      <div className="bg-[#008000] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        {/* Abstract shapes colored to match theme */}
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-4 text-white">
                Our Stories & <br /> <span className="text-orange-400">Achievements</span>
              </h1>
              <p className="text-lg text-white max-w-xl leading-relaxed">
                Discover the latest updates, community milestones, and transformative initiatives driving the Smart Village Revolution.
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
                    placeholder="Search articles..."
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
            <a href="/" className="px-6 py-2.5 rounded-lg text-gray-600 font-medium hover:bg-gray-50 transition-colors text-sm">Home</a>
            <span className="px-6 py-2.5 rounded-lg bg-gray-100 text-[#008000] font-semibold shadow-sm text-sm">News</span>
          </div>
        </div>

        {loading ? (
          // Skeleton Loading Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm h-96 animate-pulse border border-gray-100/50">
                <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border border-red-100">
            <div className="bg-red-50 p-4 rounded-full mb-4">
              <FaNewspaper className="w-8 h-8 text-red-400" /> {/* Kept Icon here for error state context only */}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Oops! Something went wrong</h3>
            <p className="text-gray-500">{error}</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-lg">No matches found for "{searchQuery}". Try a different keyword.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article, idx) => (
              <article
                key={article.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-lg transition-all duration-300 border border-gray-100/50 flex flex-col h-full hover:-translate-y-1"
              >
                {/* Image Container */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>

                  {/* Date Badge */}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-2 text-xs font-bold text-gray-800 border-l-4 border-orange-500">
                    <FaCalendarAlt className="text-orange-500" />
                    {article.date}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="mb-3">
                    <span className="text-xs font-bold tracking-wider text-[#008000] uppercase bg-gray-100 px-2 py-1 rounded-md border border-gray-200">News</span>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-[#008000] transition-colors">
                    {article.title}
                  </h2>

                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-6 flex-grow">
                    {article.excerpt}
                  </p>

                  <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                    {article.link ? (
                      <a
                        href={article.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#008000] hover:text-orange-600 transition-colors group/btn"
                      >
                        Read Full Story
                        <FaArrowRight className="w-3 h-3 transform group-hover/btn:translate-x-1 transition-transform" />
                      </a>
                    ) : (
                      <span className="text-sm text-gray-400 italic">No link available</span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <div className="mt-auto border-t border-gray-100">
        <Footer />
      </div>
    </div>
  );
}

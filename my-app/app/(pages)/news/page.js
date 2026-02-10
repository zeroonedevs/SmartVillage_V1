'use client';
import React, { useEffect, useState } from 'react';
import './news.css';
import { FaArrowUp, FaSearch } from 'react-icons/fa';
import Footer from "../../components/SmallFooter/footer";
import newsArticlesStatic from './news_array';

export default function NewsPage() {
  const [newsArticles, setNewsArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [articlesToShow, setArticlesToShow] = useState(999);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [sortBy, setSortBy] = useState('DATE');
  const [sortOrder, setSortOrder] = useState('desc');

  // Fetch news articles from API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/news');
        if (!response.ok) {
          throw new Error('Failed to fetch news articles');
        }
        const data = await response.json();
        if (data.success && data.data && data.data.length > 0) {
          // Map API data to match component structure
          const mappedArticles = data.data.map((article, index) => ({
            id: article._id || index + 1,
            title: article.title,
            date: article.date,
            imageUrl: article.imageUrl,
            excerpt: article.excerpt,
            link: article.link || ''
          }));
          setNewsArticles(mappedArticles);
        } else {
          // Fallback to static data if database is empty
          console.log('No news in database, using static data');
          const staticArticles = newsArticlesStatic.map((article, index) => ({
            id: article.id || index + 1,
            title: article.title,
            date: article.date,
            imageUrl: article.imageUrl,
            excerpt: article.excerpt,
            link: article.link || ''
          }));
          setNewsArticles(staticArticles);
        }
      } catch (err) {
        console.error('Error fetching news:', err);
        // Fallback to static data on error
        console.log('API error, using static data');
        const staticArticles = newsArticlesStatic.map((article, index) => ({
          id: article.id || index + 1,
          title: article.title,
          date: article.date,
          imageUrl: article.imageUrl,
          excerpt: article.excerpt,
          link: article.link || ''
        }));
        setNewsArticles(staticArticles);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const convertToISO = (date) => {
    if (!date) return '0000-00-00';
    try {
      const [day, month, year] = date.split('-').map(Number);
      if (isNaN(day) || isNaN(month) || isNaN(year)) return '0000-00-00';
      return new Date(year, month - 1, day).toISOString().split('T')[0];
    } catch (e) {
      return '0000-00-00';
    }
  };

  // Sort and filter the news articles
  const sortedArticles = [...newsArticles].sort((a, b) => {
    const dateA = convertToISO(a.date);
    const dateB = convertToISO(b.date);
    return sortOrder === 'asc' ? dateA.localeCompare(dateB) : dateB.localeCompare(dateA);
  });

  const filteredArticles = sortedArticles.filter(article =>
    Object.values(article).some(value =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const currentArticles = filteredArticles.slice(0, articlesToShow);

  const loadMoreArticles = () => {
    setArticlesToShow(prev => prev + 6);
  };

  return (
    <>
      <div className="back-to-home">
        {showScrollToTop && (
          <button onClick={scrollToTop} className="back-to-top-button">
            <FaArrowUp />
          </button>
        )}
      </div>
      <div className='newsContainer'>
        <div className="newsContainer-in">
          <div className="newsContainer-in-header">
            <div className="newsContainer-in-header-in">
              <header className="header">
                <div className="header-in-one">
                  <div className="search-wrapper">
                    <FaSearch className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search articles..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="header-in-two">
                  <h1>Our Achievements in News Articles</h1>
                </div>
                <div className="header-in-three">
                  <a href="/">Back to Home</a>
                </div>
              </header>
            </div>
          </div>

          <div className="articles-container">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                Loading news articles...
              </div>
            ) : error ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#d32f2f' }}>
                {error}
              </div>
            ) : currentArticles.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                No news articles found.
              </div>
            ) : (
              <div className="articles-grid">
                {currentArticles.map(article => (
                  <div key={article.id} className="article-card">
                    <div className="article-image-wrapper">
                      <img src={article.imageUrl} alt={article.title} />
                    </div>
                    <div className="article-content">
                      <span className="article-date">{article.date}</span>
                      <h2>{article.title}</h2>
                      <p>{article.excerpt}</p>
                      {article.link && (
                        <a href={article.link} target="_blank" rel="noopener noreferrer" 
                           className="read-more-btn">Read Full Article</a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className='footer-news'>
            <Footer />
          </div>
      </div>
    </>
  );
}

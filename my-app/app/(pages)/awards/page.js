'use client'
import './awards.css'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import ImageSkeleton from '../../components/ImageSkeleton/ImageSkeleton'

export default function AwardsPage() {
  const [awards, setAwards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [loadedImages, setLoadedImages] = useState({})

  // Fetch awards from API
  useEffect(() => {
    const fetchAwards = async () => {
      try {
        const response = await fetch('/api/awards')
        if (!response.ok) {
          throw new Error('Failed to fetch awards')
        }
        const data = await response.json()
        if (data.success) {
          // Map API data to match component structure
          const mappedAwards = data.data.map((award, index) => ({
            id: award._id || index + 1,
            title: award.title,
            year: award.year,
            image: award.image,
            description: award.description
          }))
          setAwards(mappedAwards)
        }
      } catch (err) {
        console.error('Error fetching awards:', err)
        setError('Failed to load awards. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchAwards()
  }, [])

  const handleImageLoad = (awardId) => {
    setLoadedImages(prev => ({
      ...prev,
      [awardId]: true
    }))
  }

  return (
    <div className="awards-container">
      <div className="awards-content">
        <div className="top-nav">
          <Link href="/" className="back-button">
            ← Back to Home
          </Link>
        </div>

        <h1 className="awards-header">Our Achievements</h1>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            Loading awards...
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#d32f2f' }}>
            {error}
          </div>
        ) : awards.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            No awards found.
          </div>
        ) : (
          <div className="awards-grid">
            {awards.map((award) => (
              <div key={award.id} className="award-card">
                <div className="award-image-container">
                  {!loadedImages[award.id] && (
                    <ImageSkeleton variant="card" />
                  )}
                  <Image
                    src={award.image}
                    alt={award.title}
                    width={300}
                    height={400}
                    className="award-image"
                    onLoad={() => handleImageLoad(award.id)}
                    style={{ opacity: loadedImages[award.id] ? 1 : 0 }}
                  />
                </div>
                <div className="award-details">
                  <h2 className="award-title">{award.title}</h2>
                  <p className="award-year">{award.year}</p>
                  <p className="award-description">{award.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 
"use client";
import React, { useEffect, useState } from 'react';

const AreasOfWork = () => {
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAreas = async () => {
            try {
                const response = await fetch('/api/areas-of-work');
                const data = await response.json();
                if (data.success) {
                    setAreas(data.data.filter(a => a.isActive));
                }
            } catch (error) {
                console.error("Error fetching areas of work:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAreas();
    }, []);

    const handleDomainClick = (domain) => {
        window.location.href = `/gallery?domain=${encodeURIComponent(domain)}`;
    };

    if (loading) {
        return (
            <div className="home-seven">
                <div className="home-seven-in">
                    <div className="home-seven-in-header">
                        <div className="home-seven-in-header-in">
                            <h1>Areas of Work</h1>
                        </div>
                    </div>
                    <div className="home-seven-in-one-in-boxes">
                        <div className="home-seven-in-one-in-boxes-in">
                            {[...Array(10)].map((_, i) => (
                                <div key={i} className="home-seven-in-one-in-box" style={{ minHeight: '200px', opacity: 0.5 }}>
                                    <div className="home-seven-in-one-in-box-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                        <p>Loading...</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="home-seven">
            <div className="home-seven-in">
                <div className="home-seven-in-header">
                    <div className="home-seven-in-header-in">
                        <h1>Areas of Work</h1>
                    </div>
                </div>
                <div className="home-seven-in-one-in-boxes">
                    <div className="home-seven-in-one-in-boxes-in">
                        {areas.map((area) => (
                            <div
                                key={area._id}
                                className="home-seven-in-one-in-box"
                                onClick={() => handleDomainClick(area.title)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="home-seven-in-one-in-box-in">
                                    <div style={{ width: '100%', height: '180px', overflow: 'hidden' }}>
                                        <img
                                            src={area.image}
                                            alt={area.title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                    <p>{area.title}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AreasOfWork;

"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const FocusAreas = () => {
    const [areas, setAreas] = useState([]);
    const [activeTab, setActiveTab] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAreas = async () => {
            try {
                const response = await fetch('/api/focus-areas');
                const data = await response.json();
                if (data.success) {
                    setAreas(data.data.filter(a => a.isActive));
                }
            } catch (error) {
                console.error("Error fetching focus areas:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAreas();
    }, []);

    if (loading) return <div className="p-12 text-center">Loading 9-Way Principles...</div>;
    if (areas.length === 0) return null;

    return (
        <div className="home-five-two">
            <div className="home-five-two-in">
                {/* Tabs List */}
                <div className="home-five-box-one">
                    <div className="home-ft-box-in">
                        {areas.map((area) => (
                            <div
                                key={area._id}
                                className="home-se-one se-cm cursor-pointer"
                                onClick={() => setActiveTab(area.order)}
                                id={activeTab === area.order ? "se-active" : ""}
                            >
                                <div className="home-se-one-in se-cm-in">
                                    <p>{area.title}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="home-five-box-two">
                    <div className="home-ft-box-two-in">
                        {areas.map((area) => (
                            <div
                                key={area._id}
                                className={`home-bt-one cm-bx-hide ${activeTab === area.order ? "se-visible" : ""}`}
                                id={activeTab === area.order ? "se-visible" : ""}
                                style={{ display: activeTab === area.order ? 'block' : 'none' }}
                            >
                                <div className="home-bt-one-in">
                                    <div className="home-bt-one-in-header">
                                        <div className="home-bt-one-in-header-in">
                                            <h1>{area.title}</h1>
                                        </div>
                                    </div>
                                    <div className="home-bt-one-in-one">
                                        <div className="home-bt-one-in-one-in">
                                            <div className="home-bt-one-in-one-in-one">
                                                <div className="home-bt-one-in-one-in-one-in">
                                                    <p>{area.description}</p>
                                                </div>
                                            </div>
                                            <div className="home-bt-one-in-one-in-two">
                                                <div className="home-bt-one-in-one-in-two-in">
                                                    <img
                                                        className="home-bt-one-in-one-in-two-in-image w-full h-auto rounded-lg shadow-md"
                                                        src={area.image}
                                                        alt={area.title}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FocusAreas;


"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    Legend, ResponsiveContainer,
} from 'recharts';

const COLORS = ['#008000', '#16a34a', '#22c55e', '#4ade80', '#86efac', '#166534', '#15803d', '#bbf7d0', '#f97316', '#64748b'];
const ROLE_COLORS = { admin: '#166534', staff: '#16a34a', lead: '#86efac' };

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3">
                <p className="text-sm font-semibold text-gray-700 mb-1">{label}</p>
                {payload.map((entry, index) => (
                    <p key={index} className="text-sm" style={{ color: entry.color }}>
                        {entry.name}: <span className="font-bold">{entry.value?.toLocaleString()}</span>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    if (percent < 0.05) return null;
    return (
        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={600}>
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const statCardIcons = {
    users: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
    ),
    villages: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
    ),
    activities: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>
    ),
    awards: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
    ),
    news: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" />
            <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" />
        </svg>
    ),
    gallery: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
    ),
    registrations: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
        </svg>
    ),
    staff: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
        </svg>
    ),
    totalStudents: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.547l1.607.689a3 3 0 002.346.04l7.05-3.022A10.05 10.05 0 0118 9.07v.93a1 1 0 01-.553.894l-7 3.5a1 1 0 01-.894 0L9.3 14.18v2.393z" />
        </svg>
    ),
};

const AnalyticsTab = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await fetch('/api/dashboard/analytics');
                if (response.status === 401) {
                    router.push('/login');
                    return;
                }
                if (!response.ok) throw new Error('Failed to fetch analytics data');
                const result = await response.json();
                if (result.success) {
                    setData(result.data);
                } else {
                    throw new Error(result.error || 'Failed to fetch analytics');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, [router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
                <p className="font-semibold">Error loading analytics</p>
                <p className="text-sm mt-1">{error}</p>
            </div>
        );
    }

    if (!data) return null;

    const { counts } = data;

    const statCards = [
        { key: 'totalStudents', label: 'Total Students Participated', value: counts.totalStudents, color: 'bg-green-600' },
        { key: 'activities', label: 'Total Activities', value: counts.activities },
        { key: 'villages', label: 'Adapted Villages', value: counts.villages },
        { key: 'registrations', label: 'GOP Registrations', value: counts.registrations },
        { key: 'news', label: 'News Articles', value: counts.news },
        { key: 'awards', label: 'Awards & Honors', value: counts.awards },
        { key: 'gallery', label: 'Gallery Images', value: counts.gallery },
        { key: 'staff', label: 'Staff Members', value: counts.staff },
        { key: 'users', label: 'System Users', value: counts.users },
    ];

    return (
        <div className="space-y-8">
            {/* Section 1: Overview Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {statCards.map((card) => (
                    <div
                        key={card.key}
                        className={`rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4 ${
                            card.color ? 'bg-green-600 text-white' : 'bg-white'
                        }`}
                    >
                        <div className={`p-3 rounded-xl ${card.color ? 'bg-white/20 text-white' : 'bg-green-50 text-green-600'}`}>
                            {statCardIcons[card.key]}
                        </div>
                        <div>
                            <p className={`text-3xl font-bold ${card.color ? 'text-white' : 'text-gray-800'}`}>
                                {card.value?.toLocaleString()}
                            </p>
                            <p className={`text-sm font-medium ${card.color ? 'text-green-100' : 'text-gray-500'}`}>
                                {card.label}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Section 2: Student Participation Trends */}
            {data.studentParticipationByMonth.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-green-50 rounded-lg text-green-600">
                            {statCardIcons.totalStudents}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">Student Participation Trends</h3>
                            <p className="text-sm text-gray-500">Monthly student participation across all activities</p>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={320}>
                        <AreaChart data={data.studentParticipationByMonth}>
                            <defs>
                                <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#008000" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#008000" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                            <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="totalStudents"
                                name="Students"
                                stroke="#008000"
                                fill="url(#greenGradient)"
                                strokeWidth={2}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Section 3: Activities - Domain Pie + Year Bar */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {data.activitiesByDomain.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-green-50 rounded-lg text-green-600">
                                {statCardIcons.activities}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">Activities by Domain</h3>
                                <p className="text-sm text-gray-500">Distribution across domains</p>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={data.activitiesByDomain}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                    outerRadius={100}
                                    dataKey="value"
                                >
                                    {data.activitiesByDomain.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    wrapperStyle={{ fontSize: '12px' }}
                                    formatter={(value) => <span className="text-gray-600">{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {data.activitiesByYear.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-green-50 rounded-lg text-green-600">
                                {statCardIcons.activities}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">Activities by Year</h3>
                                <p className="text-sm text-gray-500">Activity count and student participation per year</p>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data.activitiesByYear}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="year" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    wrapperStyle={{ fontSize: '12px' }}
                                    formatter={(value) => <span className="text-gray-600">{value}</span>}
                                />
                                <Bar dataKey="count" name="Activities" fill="#008000" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="students" name="Students" fill="#4ade80" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>

            {/* Section 4: Village Distribution by District */}
            {data.villagesByDistrict.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-green-50 rounded-lg text-green-600">
                            {statCardIcons.villages}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">Village Distribution by District</h3>
                            <p className="text-sm text-gray-500">Number of adapted villages in each district</p>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={Math.max(200, data.villagesByDistrict.length * 40)}>
                        <BarChart data={data.villagesByDistrict} layout="vertical" margin={{ left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis type="number" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                            <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} stroke="#9ca3af" width={120} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="count" name="Villages" fill="#16a34a" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Section 5: Gallery by Domain + User Role Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {data.galleryByDomain.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-green-50 rounded-lg text-green-600">
                                {statCardIcons.gallery}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">Gallery Images by Domain</h3>
                                <p className="text-sm text-gray-500">Image distribution across domains</p>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={data.galleryByDomain}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                    dataKey="value"
                                >
                                    {data.galleryByDomain.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    wrapperStyle={{ fontSize: '12px' }}
                                    formatter={(value) => <span className="text-gray-600">{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {data.usersByRole.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-green-50 rounded-lg text-green-600">
                                {statCardIcons.users}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">User Role Distribution</h3>
                                <p className="text-sm text-gray-500">System users by role</p>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={data.usersByRole}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                    outerRadius={100}
                                    dataKey="value"
                                >
                                    {data.usersByRole.map((entry) => (
                                        <Cell key={entry.name} fill={ROLE_COLORS[entry.name] || '#64748b'} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    wrapperStyle={{ fontSize: '12px' }}
                                    formatter={(value) => (
                                        <span className="text-gray-600 capitalize">{value}</span>
                                    )}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>

            {/* Section 6: GOP Registration Trends */}
            {data.registrationsByMonth.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-green-50 rounded-lg text-green-600">
                            {statCardIcons.registrations}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">GOP Registration Trends</h3>
                            <p className="text-sm text-gray-500">Organization registrations over time</p>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={320}>
                        <LineChart data={data.registrationsByMonth}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                            <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" allowDecimals={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                                type="monotone"
                                dataKey="count"
                                name="Registrations"
                                stroke="#008000"
                                strokeWidth={2}
                                dot={{ fill: '#008000', strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6, fill: '#008000' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Section 7: GOP Interested Domains + Awards by Year */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {data.gopInterestedDomains.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-green-50 rounded-lg text-green-600">
                                {statCardIcons.registrations}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">Popular Domains of Interest</h3>
                                <p className="text-sm text-gray-500">Most requested domains by GOP organizations</p>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={Math.max(200, data.gopInterestedDomains.length * 36)}>
                            <BarChart data={data.gopInterestedDomains} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis type="number" tick={{ fontSize: 12 }} stroke="#9ca3af" allowDecimals={false} />
                                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} stroke="#9ca3af" width={140} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="count" name="Organizations" fill="#22c55e" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {data.awardsByYear.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-orange-50 rounded-lg text-orange-500">
                                {statCardIcons.awards}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">Awards by Year</h3>
                                <p className="text-sm text-gray-500">Recognition and awards received per year</p>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data.awardsByYear}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="year" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" allowDecimals={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="count" name="Awards" fill="#f97316" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnalyticsTab;

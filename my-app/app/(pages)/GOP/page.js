"use client";
import React, { useState, useRef, useEffect } from 'react';
import Navbar from "../../components/navbar/Navbar";
import ResNavbar from "../../components/navbar/ResNav";
import Footer from "../../components/footer/Footer";
import { countries } from '../../data/countries';

const GOPRegistration = () => {
    const [formData, setFormData] = useState({
        orgName: '',
        category: '',
        contactPerson: '',
        designation: '',
        contactEmail: '',
        contactPhone: '',
        countryCode: '+91',
        isoCode: 'IN',
        orgAddress: '',
        tenure: '',
        tenure: '',
        interestedDomains: [],
        otherCategory: ''
    });

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isReviewing, setIsReviewing] = useState(false);
    const dropdownRef = useRef(null);

    // Filter countries based on search term
    const filteredCountries = countries.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.dial_code.includes(searchTerm)
    );

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const [status, setStatus] = useState({ loading: false, success: null, error: null });

    const domains = [
        "Health & Hygiene",
        "Agriculture",
        "Quality Education",
        "Village Infrastructure",
        "Social Community Actions",
        "Women Empowerment",
        "Livelihood Enhancement",
        "Digital Literacy",
        "Green Innovation",
        "Cultural Exchange"
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDomainChange = (domain) => {
        setFormData(prev => {
            const currentDomains = prev.interestedDomains;
            if (currentDomains.includes(domain)) {
                return { ...prev, interestedDomains: currentDomains.filter(d => d !== domain) };
            } else {
                return { ...prev, interestedDomains: [...currentDomains, domain] };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.tenure) {
            setStatus({ loading: false, success: null, error: "Please select a preferred tenure duration." });
            window.scrollTo(0, 0);
            return;
        }

        if (formData.interestedDomains.length === 0) {
            setStatus({ loading: false, success: null, error: "Please select at least one interested domain." });
            window.scrollTo(0, 0);
            return;
        }

        if (!isReviewing) {
            setStatus({ loading: false, success: null, error: null });
            setIsReviewing(true);
            window.scrollTo(0, 0);
            return;
        }

        setStatus({ loading: true, success: null, error: null });

        try {
            const payload = { ...formData };
            if (payload.category === 'Other') {
                payload.category = payload.otherCategory;
            }
            // Combine phone number with country code
            payload.contactPhone = `${payload.countryCode} ${payload.contactPhone}`;

            const response = await fetch('/api/gop/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Registration failed');

            setStatus({ loading: false, success: "Registration successful! We will contact you soon.", error: null });
            setFormData({
                orgName: '', category: '', contactPerson: '', designation: '',
                contactEmail: '', contactPhone: '', countryCode: '+91', isoCode: 'IN', orgAddress: '', tenure: '', interestedDomains: [], otherCategory: ''
            });
            setIsReviewing(false);
        } catch (error) {
            setStatus({ loading: false, success: null, error: "Something went wrong. Please try again." });
        }
    };

    return (
        <div className="w-full min-h-screen bg-green-50">
            <div className="Navbar block"><Navbar /></div>
            <div className="Navbar-Res hidden"><ResNavbar /></div>

            <div className="max-w-4xl mx-auto px-4 py-12 pt-32">
                <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-green-600">
                    <h1 className="text-3xl font-bold text-center text-green-700 mb-2 font-[Poppins]">
                        Global Outreach Program (GOP)
                    </h1>
                    <p className="text-center text-gray-600 mb-8 font-[Poppins]">
                        Register your organization to collaborate with Smart Village Revolution
                    </p>

                    {status.success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 text-center">
                            {status.success}
                        </div>
                    )}

                    {status.error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-center">
                            {status.error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6 font-[Poppins]">
                        {!isReviewing ? (
                            <>
                                {/* Organization Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Organization Name <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            name="orgName"
                                            value={formData.orgName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                            placeholder="Enter Organization Name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Category <span className="text-red-500">*</span></label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                        >
                                            <option value="">Select Category</option>
                                            <option value="NGO">NGO / Non-Profit</option>
                                            <option value="Educational Institution">Educational Institution</option>
                                            <option value="University">University / College</option>
                                            <option value="Corporate">Corporate / CSR</option>
                                            <option value="Government">Government Body</option>
                                            <option value="Research Organization">Research Organization</option>
                                            <option value="Startup">Startup / Incubator</option>
                                            <option value="Healthcare">Healthcare Organization</option>
                                            <option value="Community Group">Community Group / SHG</option>
                                            <option value="Financial Institution">Financial Institution / Bank</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        {formData.category === 'Other' && (
                                            <input
                                                type="text"
                                                name="otherCategory"
                                                value={formData.otherCategory}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                                placeholder="Please specify category"
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* Contact Person */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Contact Person Name <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            name="contactPerson"
                                            value={formData.contactPerson}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                            placeholder="Full Name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Designation <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            name="designation"
                                            value={formData.designation}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                            placeholder="e.g. Director, Manager"
                                        />
                                    </div>
                                </div>

                                {/* Contact Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Email Address <span className="text-red-500">*</span></label>
                                        <input
                                            type="email"
                                            name="contactEmail"
                                            value={formData.contactEmail}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                            placeholder="email@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Phone Number <span className="text-red-500">*</span></label>
                                        <div className="flex w-full border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-green-500 focus-within:border-transparent transition-all duration-200">
                                            <div className="relative" ref={dropdownRef}>
                                                <button
                                                    type="button"
                                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                                    className="h-full px-3 py-2 border-r border-gray-300 rounded-l-lg focus:outline-none bg-gray-50 text-sm flex items-center justify-between whitespace-nowrap min-w-[90px]"
                                                >
                                                    <span>
                                                        {countries.find(c => c.code === formData.isoCode)
                                                            ? `${countries.find(c => c.code === formData.isoCode).flag} ${formData.countryCode}`
                                                            : formData.countryCode}
                                                    </span>
                                                    <span className="text-gray-400 text-xs ml-2">▼</span>
                                                </button>

                                                {dropdownOpen && (
                                                    <div className="absolute top-full left-0 w-[240px] bg-white border border-gray-300 shadow-lg rounded-lg z-50 max-h-64 overflow-y-auto mt-1">
                                                        <div className="p-2 sticky top-0 bg-white border-b">
                                                            <input
                                                                type="text"
                                                                placeholder="Search country..."
                                                                className="w-full p-2 border rounded text-sm focus:outline-none focus:border-green-500"
                                                                value={searchTerm}
                                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                                autoFocus
                                                            />
                                                        </div>
                                                        {filteredCountries.map(country => (
                                                            <div
                                                                key={country.code}
                                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm flex items-center space-x-2"
                                                                onClick={() => {
                                                                    setFormData(prev => ({ ...prev, countryCode: country.dial_code, isoCode: country.code }));
                                                                    setDropdownOpen(false);
                                                                    setSearchTerm("");
                                                                }}
                                                            >
                                                                <span className="text-lg">{country.flag}</span>
                                                                <span className="font-medium truncate">{country.name}</span>
                                                                <span className="text-gray-500 text-xs whitespace-nowrap">({country.dial_code})</span>
                                                            </div>
                                                        ))}
                                                        {filteredCountries.length === 0 && (
                                                            <div className="p-4 text-center text-gray-500 text-sm">No results found</div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <input
                                                type="tel"
                                                name="contactPhone"
                                                value={formData.contactPhone}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-2 border-none focus:outline-none rounded-r-lg"
                                                placeholder="9876543210"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Address */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Organization Address <span className="text-red-500">*</span></label>
                                    <textarea
                                        name="orgAddress"
                                        value={formData.orgAddress}
                                        onChange={handleInputChange}
                                        required
                                        rows="3"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="Full Address"
                                    ></textarea>
                                </div>

                                {/* Program Details */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Preferred Tenure <span className="text-red-500">*</span></label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {['3 Days', '5 Days', '7 Days', '10 Days'].map(days => (
                                            <label key={days} className={`border rounded-lg p-3 text-center cursor-pointer transition-colors ${formData.tenure === days ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 hover:bg-green-50'}`}>
                                                <input
                                                    type="radio"
                                                    name="tenure"
                                                    value={days}
                                                    checked={formData.tenure === days}
                                                    onChange={handleInputChange}
                                                    className="hidden"
                                                />
                                                {days}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Program Brochure Coming Soon */}
                                {formData.tenure && (
                                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center space-x-3">
                                        <span className="text-2xl">📄</span>
                                        <div>
                                            <h3 className="font-medium text-gray-800">Program Brochure</h3>
                                            <p className="text-sm text-gray-600">Coming Soon! We will add the program brochure here once it is ready.</p>
                                        </div>
                                        <span className="ml-auto bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded-full font-semibold">COMING SOON</span>
                                    </div>
                                )}

                                {/* Domains */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Interested Domains (Select all that apply) <span className="text-red-500">*</span></label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {domains.map(domain => (
                                            <label key={domain} className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-gray-50 rounded">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.interestedDomains.includes(domain)}
                                                    onChange={() => handleDomainChange(domain)}
                                                    className="w-5 h-5 text-green-600 rounded border-gray-300 focus:ring-green-500"
                                                />
                                                <span className="text-gray-700">{domain}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Review Registration Details</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base">
                                    <div>
                                        <p className="text-gray-500 text-sm">Organization Name</p>
                                        <p className="font-medium text-lg">{formData.orgName}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm">Category</p>
                                        <p className="font-medium text-lg">{formData.category === 'Other' ? formData.otherCategory : formData.category}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm">Contact Person</p>
                                        <p className="font-medium text-lg">{formData.contactPerson}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm">Designation</p>
                                        <p className="font-medium text-lg">{formData.designation}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm">Contact Email</p>
                                        <p className="font-medium text-lg">{formData.contactEmail}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm">Contact Phone</p>
                                        <p className="font-medium text-lg">{formData.countryCode} {formData.contactPhone}</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <p className="text-gray-500 text-sm">Organization Address</p>
                                        <p className="font-medium text-lg">{formData.orgAddress}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm">Preferred Tenure</p>
                                        <p className="font-medium text-lg">{formData.tenure}</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <p className="text-gray-500 text-sm">Interested Domains</p>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {formData.interestedDomains.length > 0 ? (
                                                formData.interestedDomains.map((d, i) => (
                                                    <span key={i} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                                        {d}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-gray-400 italic">None selected</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-base">
                                    <p>Please review all details carefully before submitting. You can go back to edit if needed.</p>
                                </div>
                            </div>
                        )}

                        {/* Submit Buttons */}
                        <div className="flex justify-center pt-6 space-x-4">
                            {isReviewing && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsReviewing(false);
                                        window.scrollTo(0, 0);
                                    }}
                                    className="px-8 py-3 rounded-full text-lg font-semibold text-gray-600 bg-gray-200 hover:bg-gray-300 transition-colors"
                                >
                                    Edit Details
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={status.loading}
                                className={`px-8 py-3 rounded-full text-lg font-semibold text-white shadow-lg transition-transform transform hover:scale-105 ${status.loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'}`}
                            >
                                {status.loading ? 'Processing...' : (isReviewing ? 'Confirm & Submit' : 'Review Registration')}
                            </button>
                        </div>
                    </form>

                    {/* Contact Details Footer */}
                    <div className="mt-12 border-t pt-8 text-center text-gray-600">
                        <h3 className="font-bold text-lg mb-2 text-green-800">For Queries, Contact:</h3>
                        <p className="font-semibold text-gray-800">P SAI VIJAY - DIRECTOR SAC & SVR</p>
                        <p className="mt-1">
                            Phone: <a href="tel:+917330747502" className="text-green-600 hover:underline">+91 73307 47502</a>
                        </p>
                        <p>
                            Email: <a href="mailto:saivijay.ceo@gmail.com" className="text-green-600 hover:underline">saivijay.ceo@gmail.com</a>
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default GOPRegistration;

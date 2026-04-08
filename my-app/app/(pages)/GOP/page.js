"use client";
import React, { useState, useRef, useEffect } from 'react';
import Link from "next/link";
import { countries } from '../../data/countries';
import {
    ChevronRight, ChevronLeft, Check, Building2, User, Globe2, FileText,
    Download, Calendar, ArrowRight, ShieldCheck, Users, Award
} from 'lucide-react';

// --- Components ---
const InputField = ({ label, name, value, onChange, type = "text", placeholder, required = true }) => (
    <div className="group">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 group-focus-within:text-[#008000] transition-colors">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            placeholder={placeholder}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#008000] focus:ring-4 focus:ring-green-500/10 transition-all outline-none font-medium text-gray-900 placeholder-gray-400"
        />
    </div>
);

const GOPRegistration = () => {
    // Form State
    const [formData, setFormData] = useState({
        orgName: '', category: '', contactPerson: '', designation: '',
        contactEmail: '', contactPhone: '', countryCode: '+91', isoCode: 'IN',
        orgAddress: '', tenure: '', interestedDomains: [], otherCategory: ''
    });

    // Wizard State
    const [currentStep, setCurrentStep] = useState(1);
    const [status, setStatus] = useState({ loading: false, success: null, error: null });

    // UI Helpers
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef(null);
    const scrollRef = useRef(null);

    // Derived State
    const filteredCountries = countries.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.dial_code.includes(searchTerm)
    );

    const steps = [
        { id: 1, title: "Organization", icon: Building2, desc: "Tell us about your entity" },
        { id: 2, title: "Representative", icon: User, desc: "Who will lead this?" },
        { id: 3, title: "Partnership", icon: Globe2, desc: "Scope of collaboration" },
        { id: 4, title: "Review", icon: FileText, desc: "Final verification" }
    ];

    const domains = [
        "Health & Hygiene", "Agriculture", "Quality Education", "Village Infrastructure",
        "Social Community Actions", "Women Empowerment", "Livelihood Enhancement",
        "Digital Literacy", "Green Innovation", "Cultural Exchange"
    ];

    // --- Effects ---
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Scroll to top of form on step change (mobile friendliness)
    useEffect(() => {
        if (window.innerWidth < 768 && scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [currentStep]);

    // --- Handlers ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDomainChange = (domain) => {
        setFormData(prev => {
            const current = prev.interestedDomains;
            return current.includes(domain)
                ? { ...prev, interestedDomains: current.filter(d => d !== domain) }
                : { ...prev, interestedDomains: [...current, domain] };
        });
    };

    const validateStep = (step) => {
        switch (step) {
            case 1:
                const isOther = formData.category === 'Other';
                if (isOther && !formData.otherCategory) return false;
                return formData.orgName && formData.category && formData.orgAddress;
            case 2: return formData.contactPerson && formData.designation && formData.contactEmail && formData.contactPhone;
            case 3: return formData.tenure && formData.interestedDomains.length > 0;
            default: return true;
        }
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 4));
        } else {
            alert("Please complete all required fields.");
        }
    };

    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, success: null, error: null });

        try {
            const payload = { ...formData };
            if (payload.category === 'Other') payload.category = payload.otherCategory;
            payload.contactPhone = `${payload.countryCode} ${payload.contactPhone}`;

            const response = await fetch('/api/gop/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Registration failed');
            setStatus({ loading: false, success: "Success! Check your email for next steps.", error: null });
        } catch (error) {
            setStatus({ loading: false, success: null, error: "Submission failed. Please try again." });
        }
    };

    if (status.success) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-[Poppins]">
                <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center animate-fade-in-up">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Registration Complete</h2>
                    <p className="text-gray-500 mb-8">Thank you for joining the Global Outreach Program. Our team will review your application and contact you shortly.</p>
                    <Link href="/" className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors w-full">
                        Return to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col md:flex-row font-[Poppins] bg-white">

            {/* Left Panel - Branding (Fixed on Desktop) */}
            <div className="relative w-full md:w-5/12 lg:w-4/12 flex-shrink-0 bg-[#001a00] text-white">
                <div className="absolute inset-0 z-0">
                    <img src="/hero/1president.jpg" alt="President" className="w-full h-full object-cover opacity-40 mix-blend-overlay" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-[#003300]/90 to-[#001a00]" />
                </div>

                <div className="relative z-10 flex flex-col h-full p-8 md:p-12 justify-between">
                    <div>
                        <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-12">
                            <ChevronLeft className="w-5 h-5" /> Back to Home
                        </Link>
                        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">Global Outreach Program</h1>
                        <p className="text-lg text-green-100/90 leading-relaxed font-light">
                            Join a network of visionary organizations transforming rural landscapes through sustainable innovation.
                        </p>
                    </div>

                    <div className="space-y-6 hidden md:block">
                        <div className="flex items-center gap-4 text-sm font-medium text-green-100/80">
                            <ShieldCheck className="w-5 h-5 text-green-400" />
                            <span>Official Partner Verification</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm font-medium text-green-100/80">
                            <Users className="w-5 h-5 text-green-400" />
                            <span>150+ Global Organizations</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm font-medium text-green-100/80">
                            <Award className="w-5 h-5 text-green-400" />
                            <span>Recognized Excellence</span>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/10 hidden md:block">
                        <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-2">Need Assistance?</p>
                        <a href="mailto:saivijay.ceo@gmail.com" className="text-white hover:text-green-400 transition-colors font-medium">saivijay.ceo@gmail.com</a>
                    </div>
                </div>
            </div>

            {/* Right Panel - Form (Scrollable) */}
            <div ref={scrollRef} className="flex-1 bg-white overflow-y-auto min-h-screen">
                <div className="max-w-3xl mx-auto px-4 py-8 md:py-16 md:px-12">

                    {/* Progress Steps */}
                    <div className="mb-10">
                        <div className="flex justify-between items-center relative">
                            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -z-10"></div>
                            {steps.map((step) => (
                                <div key={step.id} className="flex flex-col items-center bg-white px-2">
                                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${currentStep >= step.id
                                        ? 'bg-[#008000] border-[#008000] text-white'
                                        : 'bg-white border-gray-200 text-gray-400'
                                        }`}>
                                        {currentStep > step.id ? <Check className="w-4 h-4 md:w-5 md:h-5" /> : step.id}
                                    </div>
                                    <span className={`text-[10px] md:text-xs font-bold uppercase mt-2 tracking-wide ${currentStep >= step.id ? 'text-gray-900' : 'text-gray-400'
                                        }`}>{step.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form Container */}
                    <form onSubmit={handleSubmit} className="animate-fade-in-up space-y-8">

                        {/* Step 1: Organization */}
                        {currentStep === 1 && (
                            <div className="space-y-6">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">Organization Identity</h2>
                                    <p className="text-gray-500">Provide details about your registered entity.</p>
                                </div>
                                <InputField
                                    label="Organization Name"
                                    name="orgName"
                                    value={formData.orgName}
                                    onChange={handleInputChange}
                                    placeholder="E.g. Green Earth Foundation"
                                />

                                <div className="group">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Category <span className="text-red-500">*</span></label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#008000] focus:ring-4 focus:ring-green-500/10 transition-all outline-none font-medium text-gray-900"
                                    >
                                        <option value="">Select Category</option>
                                        {["NGO", "Educational Institution", "Corporate / CSR", "Government Body", "Research Organization", "Startup", "Other"].map(o => (
                                            <option key={o} value={o}>{o}</option>
                                        ))}
                                    </select>
                                </div>

                                {formData.category === 'Other' && (
                                    <InputField
                                        label="Specify Category"
                                        name="otherCategory"
                                        value={formData.otherCategory}
                                        onChange={handleInputChange}
                                        placeholder="E.g. Social Enterprise"
                                    />
                                )}

                                <div className="group">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Address <span className="text-red-500">*</span></label>
                                    <textarea
                                        name="orgAddress"
                                        value={formData.orgAddress}
                                        onChange={handleInputChange}
                                        rows="3"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#008000] focus:ring-4 focus:ring-green-500/10 transition-all outline-none font-medium text-gray-900 placeholder-gray-400"
                                        placeholder="Full registered address..."
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 2: Representative */}
                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">Key Representative</h2>
                                    <p className="text-gray-500">Who should we mitigate correspondence through?</p>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <InputField label="Full Name" name="contactPerson" value={formData.contactPerson} onChange={handleInputChange} placeholder="John Doe" />
                                    <InputField label="Designation" name="designation" value={formData.designation} onChange={handleInputChange} placeholder="Director / Manager" />
                                    <div className="md:col-span-2">
                                        <InputField label="Email Address" name="contactEmail" type="email" value={formData.contactEmail} onChange={handleInputChange} placeholder="john@company.com" />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Phone Number <span className="text-red-500">*</span></label>
                                        <div className="flex bg-gray-50 border border-gray-200 rounded-lg focus-within:ring-4 focus-within:ring-green-500/10 focus-within:border-[#008000] focus-within:bg-white transition-all">
                                            <div className="relative border-r border-gray-200" ref={dropdownRef}>
                                                <button type="button" onClick={() => setDropdownOpen(!dropdownOpen)} className="h-full px-3 flex items-center gap-2 hover:bg-gray-100 rounded-l-lg transition-colors">
                                                    <span>{countries.find(c => c.code === formData.isoCode)?.flag}</span>
                                                    <span className="text-sm font-medium text-gray-700">{formData.countryCode}</span>
                                                </button>
                                                {dropdownOpen && (
                                                    <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 shadow-xl rounded-lg z-50 max-h-60 overflow-y-auto">
                                                        <div className="p-2 sticky top-0 bg-white border-b z-10">
                                                            <input type="text" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full p-2 text-sm border rounded bg-gray-50 focus:outline-none focus:border-[#008000]" autoFocus />
                                                        </div>
                                                        {filteredCountries.map(c => (
                                                            <div key={c.code} onClick={() => { setFormData(p => ({ ...p, countryCode: c.dial_code, isoCode: c.code })); setDropdownOpen(false); }} className="px-4 py-2 hover:bg-green-50 cursor-pointer flex items-center gap-3 text-sm">
                                                                <span>{c.flag}</span> <span className="text-gray-700 font-medium">{c.name}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <input type="tel" name="contactPhone" value={formData.contactPhone} onChange={handleInputChange} className="flex-1 px-4 py-3 bg-transparent outline-none font-medium text-gray-900 placeholder-gray-400" placeholder="98765 43210" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Partnership */}
                        {currentStep === 3 && (
                            <div className="space-y-8">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">Partnership Scope</h2>
                                    <p className="text-gray-500">Define your engagement parameters.</p>
                                </div>

                                {/* Tenure */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Preferred Duration</label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {['3 Days', '5 Days', '7 Days', '10 Days'].map(days => (
                                            <div key={days} onClick={() => setFormData(p => ({ ...p, tenure: days }))} className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all ${formData.tenure === days ? 'bg-green-50 border-[#008000] ring-1 ring-[#008000] shadow-sm' : 'bg-white border-gray-200 hover:border-[#008000]/50 hover:bg-gray-50'}`}>
                                                <Calendar className={`w-5 h-5 ${formData.tenure === days ? 'text-[#008000]' : 'text-gray-400'}`} />
                                                <span className={`font-bold text-sm ${formData.tenure === days ? 'text-[#008000]' : 'text-gray-700'}`}>{days}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Domains */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Focus Areas</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {domains.map(domain => (
                                            <div key={domain} onClick={() => handleDomainChange(domain)} className={`cursor-pointer p-3.5 rounded-xl border flex items-center justify-between transition-all group ${formData.interestedDomains.includes(domain) ? 'bg-gray-900 border-gray-900 text-white shadow-md' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'}`}>
                                                <span className="font-medium text-sm">{domain}</span>
                                                {formData.interestedDomains.includes(domain) && <Check className="w-4 h-4 text-green-400" />}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Review */}
                        {currentStep === 4 && (
                            <div className="space-y-6">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">Final Verification</h2>
                                    <p className="text-gray-500">Please review your details carefully.</p>
                                </div>

                                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-6">
                                    <div className="flex justify-between items-start border-b border-gray-200 pb-4">
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Organization</h4>
                                            <p className="font-bold text-gray-900 text-lg">{formData.orgName}</p>
                                            <p className="text-gray-600 text-sm">{formData.category}</p>
                                        </div>
                                        <button type="button" onClick={() => setCurrentStep(1)} className="text-xs text-[#008000] font-bold hover:underline">EDIT</button>
                                    </div>
                                    <div className="flex justify-between items-start border-b border-gray-200 pb-4">
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Contact</h4>
                                            <p className="font-bold text-gray-900">{formData.contactPerson}</p>
                                            <p className="text-gray-600 text-sm">{formData.contactEmail}</p>
                                            <p className="text-gray-600 text-sm">{formData.contactPhone}</p>
                                        </div>
                                        <button type="button" onClick={() => setCurrentStep(2)} className="text-xs text-[#008000] font-bold hover:underline">EDIT</button>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Partnership</h4>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-bold">{formData.tenure}</span>
                                                {formData.interestedDomains.map(d => (
                                                    <span key={d} className="px-2 py-1 bg-white border border-gray-200 text-gray-600 rounded text-xs font-medium">{d}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <button type="button" onClick={() => setCurrentStep(3)} className="text-xs text-[#008000] font-bold hover:underline">EDIT</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="pt-8 flex items-center justify-between border-t border-gray-100 mt-8">
                            {currentStep > 1 ? (
                                <button type="button" onClick={prevStep} className="px-6 py-3 rounded-lg font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors flex items-center gap-2">
                                    <ChevronLeft className="w-5 h-5" /> Back
                                </button>
                            ) : (
                                <div />
                            )}

                            <button
                                type={currentStep === 4 ? "submit" : "button"}
                                onClick={currentStep < 4 ? nextStep : undefined}
                                disabled={status.loading}
                                className={`px-8 py-3.5 bg-[#008000] text-white rounded-xl font-bold hover:bg-[#006600] transition-all shadow-lg hover:shadow-xl flex items-center gap-2 ${status.loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {status.loading ? 'Processing...' : (currentStep === 4 ? 'Confirm & Submit' : 'Next Step')}
                                {currentStep < 4 && <ArrowRight className="w-5 h-5" />}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default GOPRegistration;



"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
    const router = useRouter();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        // Verify authentication via API (cookies are sent automatically)
        const verifyAuth = async () => {
            try {
                // Try to access a protected endpoint to verify auth
                const response = await fetch('/api/users', {
                    credentials: 'include'
                });

                if (response.status === 401) {
                    router.push('/login');
                    return;
                }

                // If we get here, user is authenticated - redirect to admin dashboard
                router.push('/admin');
            } catch (error) {
                console.error('Auth check failed:', error);
                router.push('/login');
            } finally {
                setChecking(false);
            }
        };

        verifyAuth();
    }, [router]);

    return (
        <div className="w-full min-h-screen bg-gray-50 font-[Poppins] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
        </div>
    );
};

export default Dashboard;

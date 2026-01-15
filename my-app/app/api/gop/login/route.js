
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { username, password } = await request.json();

        // Hardcoded credentials as requested by the user
        const VALID_USER = 'admin@svr.gop';
        const VALID_PASS = 'admin123';

        if (username === VALID_USER && password === VALID_PASS) {
            // Create a response with a success message
            const response = NextResponse.json({ success: true, message: 'Login successful' }, { status: 200 });

            // Set a cookie to indicate the user is logged in
            // HttpOnly: true prevents client-side JS from reading it (more secure)
            // Path: / ensures it's available for all gop routes
            // MaxAge: 1 day (86400 seconds)
            response.cookies.set('gop_admin_session', 'authenticated', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 86400,
                path: '/',
            });

            return response;
        } else {
            return NextResponse.json(
                { success: false, message: 'Invalid credentials' },
                { status: 401 }
            );
        }
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
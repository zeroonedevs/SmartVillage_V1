
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { username, password } = await request.json();

        const VALID_USER = process.env.ADMIN_EMAIL;
        const VALID_PASS = process.env.ADMIN_PASSWORD;

        if (username === VALID_USER && password === VALID_PASS) {
            // Create a response with a success message
            const response = NextResponse.json({ success: true, message: 'Login successful' }, { status: 200 });

            // Set a cookie to indicate the user is logged in
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
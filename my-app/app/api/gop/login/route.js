import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request) {
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json(
                { success: false, message: 'Username and password are required' },
                { status: 400 }
            );
        }

        const client = await pool.connect();

        try {
            // Fetch admin credentials from database
            const result = await client.query(
                'SELECT * FROM gop_admin WHERE username = $1 LIMIT 1',
                [username]
            );

            if (result.rows.length === 0) {
                return NextResponse.json(
                    { success: false, message: 'Invalid credentials' },
                    { status: 401 }
                );
            }

            const admin = result.rows[0];

            // Verify password using bcrypt
            const isPasswordValid = await bcrypt.compare(password, admin.password_hash);

            if (!isPasswordValid) {
                return NextResponse.json(
                    { success: false, message: 'Invalid credentials' },
                    { status: 401 }
                );
            }

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

        } finally {
            client.release();
        }

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';
import bcrypt from 'bcryptjs';

// Hardcoded admin credentials (since we can't access server env variables)
const HARDCODED_ADMIN = {
    username: 'admin@svr.kluniversity.in',
    password: 'Director-sac@123'
};

export async function POST(request) {
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json(
                { success: false, message: 'Username and password are required' },
                { status: 400 }
            );
        }

        // First, try to check hardcoded credentials (fallback)
        if (username === HARDCODED_ADMIN.username && password === HARDCODED_ADMIN.password) {
            const response = NextResponse.json({ success: true, message: 'Login successful' }, { status: 200 });

            response.cookies.set('gop_admin_session', 'authenticated', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 86400,
                path: '/',
            });

            return response;
        }

        // Try database authentication
        const client = await pool.connect();

        try {
            // Ensure admin table exists
            await client.query(`
                CREATE TABLE IF NOT EXISTS gop_admin (
                    id SERIAL PRIMARY KEY,
                    username VARCHAR(255) UNIQUE NOT NULL,
                    password_hash VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `);

            // Check if admin exists in database
            let result = await client.query(
                'SELECT * FROM gop_admin WHERE username = $1 LIMIT 1',
                [username]
            );

            // If no admin exists, initialize with hardcoded credentials
            if (result.rows.length === 0) {
                const hashedPassword = await bcrypt.hash(HARDCODED_ADMIN.password, 10);
                await client.query(
                    'INSERT INTO gop_admin (username, password_hash) VALUES ($1, $2)',
                    [HARDCODED_ADMIN.username, hashedPassword]
                );

                // Re-query to get the newly created admin
                result = await client.query(
                    'SELECT * FROM gop_admin WHERE username = $1 LIMIT 1',
                    [username]
                );
            }

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

        // If database fails, fall back to hardcoded credentials
        const { username, password } = await request.json();

        if (username === HARDCODED_ADMIN.username && password === HARDCODED_ADMIN.password) {
            const response = NextResponse.json({
                success: true,
                message: 'Login successful (fallback mode)'
            }, { status: 200 });

            response.cookies.set('gop_admin_session', 'authenticated', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 86400,
                path: '/',
            });

            return response;
        }

        return NextResponse.json(
            { success: false, message: 'Internal Server Error', error: error.message },
            { status: 500 }
        );
    }
}
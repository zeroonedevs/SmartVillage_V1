import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';
import bcrypt from 'bcryptjs';

/**
 * This endpoint initializes the GOP admin account
 * Call this once after deployment to set up the admin credentials
 * Protected by a secret key to prevent unauthorized access
 */
export async function POST(request) {
    try {
        const { secret, username, password } = await request.json();

        // Secret key to prevent unauthorized initialization
        // Set ADMIN_INIT_SECRET in your environment variables
        const INIT_SECRET = process.env.ADMIN_INIT_SECRET || 'svr-kluniversity-2026';

        if (secret !== INIT_SECRET) {
            return NextResponse.json(
                { success: false, message: 'Invalid secret key' },
                { status: 403 }
            );
        }

        if (!username || !password) {
            return NextResponse.json(
                { success: false, message: 'Username and password are required' },
                { status: 400 }
            );
        }

        const client = await pool.connect();

        try {
            // Create admin table if it doesn't exist
            await client.query(`
                CREATE TABLE IF NOT EXISTS gop_admin (
                    id SERIAL PRIMARY KEY,
                    username VARCHAR(255) UNIQUE NOT NULL,
                    password_hash VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `);

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert or update admin credentials
            await client.query(`
                INSERT INTO gop_admin (username, password_hash) 
                VALUES ($1, $2)
                ON CONFLICT (username) 
                DO UPDATE SET password_hash = $2, updated_at = CURRENT_TIMESTAMP
            `, [username, hashedPassword]);

            return NextResponse.json({
                success: true,
                message: 'Admin account initialized successfully',
                username: username
            });

        } finally {
            client.release();
        }

    } catch (error) {
        console.error('Admin initialization error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal Server Error', error: error.message },
            { status: 500 }
        );
    }
}

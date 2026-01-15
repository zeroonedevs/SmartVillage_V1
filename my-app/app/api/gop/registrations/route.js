
import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';

export async function GET(request) {
    try {
        // Check for authentication cookie
        const authCookie = request.cookies.get('gop_admin_session');
        if (!authCookie || authCookie.value !== 'authenticated') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const client = await pool.connect();
        try {
            const result = await client.query('SELECT * FROM gop_registrations ORDER BY created_at DESC');
            return NextResponse.json(result.rows, { status: 200 });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error fetching GOP registrations:', error);
        return NextResponse.json(
            { error: 'Failed to fetch registrations' },
            { status: 500 }
        );
    }
}

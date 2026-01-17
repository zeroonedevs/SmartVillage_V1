
import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';

// Helper function to check authentication
function checkAuth(request) {
    const authCookie = request.cookies.get('gop_admin_session');
    if (!authCookie || authCookie.value !== 'authenticated') {
        return false;
    }
    return true;
}

export async function GET(request) {
    try {
        // Check for authentication cookie
        if (!checkAuth(request)) {
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

export async function DELETE(request) {
    try {
        // Check for authentication cookie
        if (!checkAuth(request)) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get the ID from query parameters
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Registration ID is required' },
                { status: 400 }
            );
        }

        const client = await pool.connect();
        try {
            // Delete the registration
            const result = await client.query(
                'DELETE FROM gop_registrations WHERE id = $1 RETURNING id',
                [id]
            );

            if (result.rows.length === 0) {
                return NextResponse.json(
                    { error: 'Registration not found' },
                    { status: 404 }
                );
            }

            return NextResponse.json(
                { success: true, message: 'Registration deleted successfully' },
                { status: 200 }
            );
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error deleting GOP registration:', error);
        return NextResponse.json(
            { error: 'Failed to delete registration' },
            { status: 500 }
        );
    }
}

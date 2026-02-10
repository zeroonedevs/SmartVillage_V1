
import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import GopAdmin from '../../../../models/GopAdmin';
import bcrypt from 'bcryptjs';

/**
 * This endpoint initializes the GOP admin account in MongoDB
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

        await dbConnect();

        // Hash the password
        const passwordHash = await bcrypt.hash(password, 10);

        // Check if admin exists
        const existingAdmin = await GopAdmin.findOne({ username });

        if (existingAdmin) {
            existingAdmin.passwordHash = passwordHash;
            await existingAdmin.save();
        } else {
            await GopAdmin.create({
                username,
                passwordHash
            });
        }

        return NextResponse.json({
            success: true,
            message: 'Admin account initialized successfully',
            username: username
        });

    } catch (error) {
        console.error('Admin initialization error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal Server Error', error: error.message },
            { status: 500 }
        );
    }
}

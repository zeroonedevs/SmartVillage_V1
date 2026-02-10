import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/User';
import bcrypt from 'bcryptjs';

/**
 * Quick admin creation endpoint for development/testing
 * In production, use /api/users/init-admin with secret key
 */
export async function POST(request) {
    try {
        // Only allow in development or with secret
        if (process.env.NODE_ENV === 'production') {
            const { secret } = await request.json();
            const INIT_SECRET = process.env.ADMIN_INIT_SECRET || 'svr-kluniversity-2026';
            if (secret !== INIT_SECRET) {
                return NextResponse.json(
                    { success: false, message: 'Unauthorized' },
                    { status: 403 }
                );
            }
        }

        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json(
                { success: false, message: 'Username and password are required' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            // Update password and ensure admin role
            existingUser.passwordHash = await bcrypt.hash(password, 10);
            existingUser.role = 'admin';
            await existingUser.save();
            return NextResponse.json({
                success: true,
                message: 'Admin account updated successfully',
                username: username
            });
        }

        // Create new admin user
        const passwordHash = await bcrypt.hash(password, 10);
        await User.create({
            username,
            passwordHash,
            role: 'admin'
        });

        return NextResponse.json({
            success: true,
            message: 'Admin account created successfully',
            username: username
        });

    } catch (error) {
        console.error('Create admin error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal Server Error', error: error.message },
            { status: 500 }
        );
    }
}

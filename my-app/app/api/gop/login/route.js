
import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/User';
import GopAdmin from '../../../../models/GopAdmin';
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

        await dbConnect();

        // First try User model (new system)
        let user = await User.findOne({ username });
        let isPasswordValid = false;
        let role = null;

        if (user) {
            isPasswordValid = await bcrypt.compare(password, user.passwordHash);
            if (isPasswordValid) {
                role = user.role;
            }
        } else {
            // Fallback to GopAdmin (legacy) - migrate to User with admin role
            const admin = await GopAdmin.findOne({ username });
            if (admin) {
                isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
                if (isPasswordValid) {
                    // Migrate to User model with admin role
                    role = 'admin';
                    try {
                        // Check if user already exists (race condition protection)
                        const existingUser = await User.findOne({ username });
                        if (existingUser) {
                            user = existingUser;
                        } else {
                            user = await User.create({
                                username: admin.username,
                                passwordHash: admin.passwordHash,
                                role: 'admin'
                            });
                        }
                    } catch (migrationError) {
                        // If migration fails, try to find the user again
                        user = await User.findOne({ username });
                        if (!user) {
                            console.error('Migration error:', migrationError);
                            throw new Error('Failed to migrate admin account');
                        }
                    }
                }
            }
        }

        if (!isPasswordValid) {
            return NextResponse.json(
                { success: false, message: 'Invalid credentials' },
                { status: 401 }
            );
        }

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'User not found' },
                { status: 401 }
            );
        }

        // Create a response with user info including role
        const response = NextResponse.json({ 
            success: true, 
            message: 'Login successful',
            role: role || user.role,
            username: user.username
        }, { status: 200 });

        // Set cookies for authentication and role
        response.cookies.set('gop_admin_session', 'authenticated', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 86400,
            path: '/',
        });

        response.cookies.set('user_role', role || user.role, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 86400,
            path: '/',
        });

        response.cookies.set('username', user.username, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 86400,
            path: '/',
        });

        return response;

    } catch (error) {
        console.error('Login error:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        return NextResponse.json(
            { 
                success: false, 
                message: 'Internal Server Error', 
                error: error.message,
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            },
            { status: 500 }
        );
    }
}
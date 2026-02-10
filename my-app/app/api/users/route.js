import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

// Helper function to check admin authentication
function checkAdminAuth(request) {
    const authCookie = request.cookies.get('gop_admin_session');
    const roleCookie = request.cookies.get('user_role');
    if (!authCookie || authCookie.value !== 'authenticated' || roleCookie?.value !== 'admin') {
        return false;
    }
    return true;
}

// GET - List all users
export async function GET(request) {
    try {
        if (!checkAdminAuth(request)) {
            return NextResponse.json(
                { error: 'Unauthorized - Admin access required' },
                { status: 401 }
            );
        }

        await dbConnect();
        const users = await User.find({}).select('-passwordHash').sort({ createdAt: -1 });
        
        return NextResponse.json({ success: true, data: users }, { status: 200 });
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json(
            { error: 'Failed to fetch users' },
            { status: 500 }
        );
    }
}

// POST - Create new user
export async function POST(request) {
    try {
        if (!checkAdminAuth(request)) {
            return NextResponse.json(
                { error: 'Unauthorized - Admin access required' },
                { status: 401 }
            );
        }

        const { username, password, role } = await request.json();

        if (!username || !password || !role) {
            return NextResponse.json(
                { error: 'Username, password, and role are required' },
                { status: 400 }
            );
        }

        if (!['admin', 'faculty', 'student'].includes(role)) {
            return NextResponse.json(
                { error: 'Invalid role. Must be admin, faculty, or student' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return NextResponse.json(
                { error: 'Username already exists' },
                { status: 400 }
            );
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            username,
            passwordHash,
            role
        });

        // Return user without password hash
        const userResponse = user.toObject();
        delete userResponse.passwordHash;

        return NextResponse.json({
            success: true,
            message: 'User created successfully',
            data: userResponse
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json(
            { error: 'Failed to create user', details: error.message },
            { status: 500 }
        );
    }
}

import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';


function checkAdminAuth(request) {
    const authCookie = request.cookies.get('gop_admin_session');
    const roleCookie = request.cookies.get('user_role');
    if (!authCookie || authCookie.value !== 'authenticated' || roleCookie?.value !== 'admin') {
        return false;
    }
    return true;
}


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


export async function POST(request) {
    try {
        if (!checkAdminAuth(request)) {
            return NextResponse.json(
                { error: 'Unauthorized - Admin access required' },
                { status: 401 }
            );
        }

        const { userID, name, password, role, email } = await request.json();

        if (!userID || !name || !password || !role) {
            return NextResponse.json(
                { error: 'UserID, name, password, and role are required' },
                { status: 400 }
            );
        }

        if (!['admin', 'staff', 'lead'].includes(role)) {
            return NextResponse.json(
                { error: 'Invalid role. Must be admin, staff, or lead' },
                { status: 400 }
            );
        }

        await dbConnect();

        
        const existingUser = await User.findOne({
            $or: [{ userID }, { name }]
        });
        if (existingUser) {
            return NextResponse.json(
                { error: 'UserID or Name already exists' },
                { status: 400 }
            );
        }

        
        const passwordHash = await bcrypt.hash(password, 10);

        
        const user = await User.create({
            userID,
            name,
            email,
            passwordHash,
            role
        });

        
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

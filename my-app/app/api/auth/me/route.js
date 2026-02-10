import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/User';

// Helper function to check authentication (any role)
function checkAuth(request) {
    const authCookie = request.cookies.get('gop_admin_session');
    if (!authCookie || authCookie.value !== 'authenticated') {
        return false;
    }
    return true;
}

// GET - Get current user info
export async function GET(request) {
    try {
        if (!checkAuth(request)) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const usernameCookie = request.cookies.get('username');
        if (!usernameCookie) {
            return NextResponse.json(
                { error: 'Username not found' },
                { status: 401 }
            );
        }

        await dbConnect();
        const user = await User.findOne({ username: usernameCookie.value }).select('-passwordHash');
        
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ 
            success: true, 
            data: {
                username: user.username,
                role: user.role
            }
        }, { status: 200 });
    } catch (error) {
        console.error('Error fetching user info:', error);
        return NextResponse.json(
            { error: 'Failed to fetch user info' },
            { status: 500 }
        );
    }
}

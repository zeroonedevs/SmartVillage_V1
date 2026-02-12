import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/User';


function checkAuth(request) {
    const authCookie = request.cookies.get('gop_admin_session');
    if (!authCookie || authCookie.value !== 'authenticated') {
        return false;
    }
    return true;
}


export async function GET(request) {
    try {
        if (!checkAuth(request)) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const userIdCookie = request.cookies.get('user_id');
        if (!userIdCookie) {
            return NextResponse.json(
                { error: 'User ID not found' },
                { status: 401 }
            );
        }

        await dbConnect();
        const user = await User.findOne({ userID: Number(userIdCookie.value) }).select('-passwordHash');

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                name: user.name,
                userID: user.userID,
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

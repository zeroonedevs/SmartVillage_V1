import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/User';
import bcrypt from 'bcryptjs';

function getAuthenticatedUserId(request) {
    const authCookie = request.cookies.get('gop_admin_session');
    if (!authCookie || authCookie.value !== 'authenticated') {
        return null;
    }
    const userIdCookie = request.cookies.get('user_id');
    if (!userIdCookie?.value) return null;
    const uid = Number(userIdCookie.value);
    return Number.isNaN(uid) ? null : uid;
}

export async function POST(request) {
    try {
        const uid = getAuthenticatedUserId(request);
        if (uid === null) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { current, new: newPassword, confirm } = await request.json();

        if (!current || !newPassword || !confirm) {
            return NextResponse.json(
                { success: false, message: 'All fields are required' },
                { status: 400 }
            );
        }

        if (newPassword !== confirm) {
            return NextResponse.json(
                { success: false, message: 'New passwords do not match' },
                { status: 400 }
            );
        }

        if (newPassword.length < 6) {
            return NextResponse.json(
                { success: false, message: 'Password must be at least 6 characters' },
                { status: 400 }
            );
        }

        await dbConnect();

        const user = await User.findOne({ userID: uid });
        if (!user) {
            return NextResponse.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            );
        }

        const isMatch = await bcrypt.compare(current, user.passwordHash);
        if (!isMatch) {
            return NextResponse.json(
                { success: false, message: 'Current password is incorrect' },
                { status: 403 }
            );
        }

        user.passwordHash = await bcrypt.hash(newPassword, 10);
        await user.save();

        return NextResponse.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

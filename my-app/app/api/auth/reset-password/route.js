import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/User';
import bcrypt from 'bcryptjs';

export async function POST(request) {
    try {
        let { email, resetCode, newPassword } = await request.json();

        if (!email || !resetCode || !newPassword) {
            return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });
        }

        email = email.toLowerCase().trim();

        await dbConnect();

        const user = await User.findOne({
            email: email,
            resetToken: resetCode,
            resetTokenExpiry: { $gt: new Date() }
        });

        if (!user) {
            return NextResponse.json({ success: false, message: 'Invalid or expired reset code' }, { status: 400 });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(newPassword, salt);

        user.passwordHash = passwordHash;
        user.resetToken = null;
        user.resetTokenExpiry = null;
        await user.save();

        return NextResponse.json({ success: true, message: 'Password reset successfully' });

    } catch (error) {
        console.error('Reset Password Error:', error);
        return NextResponse.json({ success: false, message: 'An error occurred' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/User';
import { sendResetEmail } from '../../../../lib/mail';

export async function POST(request) {
    try {
        let { email } = await request.json();

        if (!email) {
            return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
        }

        email = email.toLowerCase().trim();

        await dbConnect();

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ success: true, message: 'If an account exists, a reset code has been sent.' });
        }

        if (!user.email) {
            return NextResponse.json({ success: false, message: 'No email associated with this account. Please contact admin.' }, { status: 400 });
        }

        const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
        const resetTokenExpiry = new Date(Date.now() + 3600000);

        user.resetToken = resetToken;
        user.resetTokenExpiry = resetTokenExpiry;
        await user.save();

        try {
            await sendResetEmail(user.email, resetToken);
            return NextResponse.json({ success: true, message: 'Reset code sent to your registered email.' });
        } catch (mailError) {
            console.error('Mail Error:', mailError);
            return NextResponse.json({ success: false, message: 'Failed to send email. Please try again later.' }, { status: 500 });
        }

    } catch (error) {
        console.error('Forgot Password Error:', error);
        return NextResponse.json({ success: false, message: 'An error occurred' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/User';

export const dynamic = 'force-dynamic';

function getSessionUserId(request) {
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
    const uid = getSessionUserId(request);
    if (uid === null) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid request body' }, { status: 400 });
    }

    const currentPassword = body.currentPassword ?? body.current;
    const newPassword = body.newPassword ?? body.new;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'Current password and new password are required' },
        { status: 400 }
      );
    }

    if (typeof newPassword !== 'string' || newPassword.length < 8) {
      return NextResponse.json(
        { success: false, message: 'New password must be at least 8 characters' },
        { status: 400 }
      );
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(
        { success: false, message: 'New password must be different from your current password' },
        { status: 400 }
      );
    }

    await dbConnect();
    const user = await User.findOne({ userID: uid });
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ success: false, message: 'Current password is incorrect' }, { status: 401 });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    return NextResponse.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json({ success: false, message: 'Something went wrong' }, { status: 500 });
  }
}

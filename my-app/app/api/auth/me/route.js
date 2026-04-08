import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/User';

export const dynamic = 'force-dynamic';

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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userIdCookie = request.cookies.get('user_id');
    if (!userIdCookie?.value) {
      return NextResponse.json({ error: 'User ID not found' }, { status: 401 });
    }

    const uid = Number(userIdCookie.value);
    if (Number.isNaN(uid)) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findOne({ userID: uid }).select('-passwordHash');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          name: user.name,
          userID: user.userID,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching user info:', error);
    return NextResponse.json({ error: 'Failed to fetch user info' }, { status: 500 });
  }
}

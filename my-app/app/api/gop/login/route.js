import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/User';
import GopAdmin from '../../../../models/GopAdmin';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { userId, password } = await request.json();

    if (userId === undefined || userId === null || !password) {
      return NextResponse.json(
        { success: false, message: 'User ID and password are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const numericUserId = Number(userId);

    let user = await User.findOne({
      $or: [{ userID: isNaN(numericUserId) ? -1 : numericUserId }, { name: userId }],
    });
    let isPasswordValid = false;
    let role = null;

    if (user) {
      isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (isPasswordValid) {
        role = user.role;
      }
    } else {
      user = await User.findOne({ name: userId });
      if (user) {
        isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (isPasswordValid) {
          role = user.role;
        }
      } else {
        const admin = await GopAdmin.findOne({ username: userId });
        if (admin) {
          isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
          if (isPasswordValid) {
            role = 'admin';

            user = await User.create({
              userID: isNaN(Number(admin.username)) ? 0 : Number(admin.username),
              name: admin.username,
              passwordHash: admin.passwordHash,
              role: 'admin',
            });
          }
        }
      }
    }

    if (!isPasswordValid) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    const response = NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        role: role || user.role,
        userID: user.userID,
        name: user.name,
      },
      { status: 200 }
    );

    const cookieBase = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      // 'lax' works reliably after login redirects; 'strict' can drop cookies in some browser flows
      sameSite: 'lax',
      maxAge: 86400,
      path: '/',
    };

    response.cookies.set('gop_admin_session', 'authenticated', cookieBase);

    response.cookies.set('user_role', role || user.role, cookieBase);

    response.cookies.set('user_id', String(user.userID), cookieBase);

    return response;
  } catch (error) {
    console.error('Login error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    return NextResponse.json(
      {
        success: false,
        message: 'Internal Server Error',
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

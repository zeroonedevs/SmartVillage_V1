import { NextResponse } from 'next/server';

const clearCookie = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  expires: new Date(0),
  path: '/',
};

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });

  response.cookies.set('gop_admin_session', '', clearCookie);
  response.cookies.set('user_role', '', clearCookie);
  response.cookies.set('user_id', '', clearCookie);
  response.cookies.set('username', '', clearCookie);

  return response;
}

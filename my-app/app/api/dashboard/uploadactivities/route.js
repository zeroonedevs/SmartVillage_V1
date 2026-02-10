
import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Activity from '../../../../models/Activity';

export async function POST(request) {
  await dbConnect();

  try {
    const body = await request.json();
    const activity = await Activity.create(body);
    return NextResponse.json({ success: true, data: activity }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Activity from '../../../../models/Activity';

export async function POST(request) {
  await dbConnect();

  try {
    const body = await request.json();
    const date = new Date(body.date);
    if (isNaN(date.getTime())) {
      return NextResponse.json({ success: false, error: 'Invalid date' }, { status: 400 });
    }
    body.date = date;
    body.studentsParticipated = Number(body.studentsParticipated);
    const activity = await Activity.create(body);
    return NextResponse.json({ success: true, data: activity }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

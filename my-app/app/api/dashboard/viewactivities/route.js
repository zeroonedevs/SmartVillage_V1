
import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Activity from '../../../../models/Activity';

export async function GET() {
  await dbConnect();

  try {
    const activities = await Activity.find({}).sort({ date: -1 });
    return NextResponse.json({ success: true, data: activities });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request) {
  await dbConnect();

  try {
    const { id } = await request.json();

    if (!id) {
        return NextResponse.json({ success: false, message: "Activity ID is required" }, { status: 400 });
    }

    const deletedActivity = await Activity.findByIdAndDelete(id);

    if (!deletedActivity) {
      return NextResponse.json({ success: false, message: 'Activity not found' }, { status: 404 });
    }
    
    
    
    

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

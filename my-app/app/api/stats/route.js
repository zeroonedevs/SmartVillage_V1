
import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Activity from '../../../models/Activity';

export async function GET() {
    await dbConnect();

    try {
        const totalStudents = await Activity.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$studentsParticipated" }
                }
            }
        ]);

        const count = totalStudents.length > 0 ? totalStudents[0].total : 0;

        return NextResponse.json({ success: true, count });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

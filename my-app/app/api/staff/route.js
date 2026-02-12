import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Staff from '../../../models/Staff';

export async function GET() {
    try {
        await dbConnect();
        const staff = await Staff.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: staff });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch staff' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await dbConnect();
        const body = await req.json();
        const staff = await Staff.create(body);
        return NextResponse.json({ success: true, data: staff });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
export async function DELETE(req) {
    try {
        await dbConnect();
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({ success: false, error: 'Staff ID is required' }, { status: 400 });
        }

        const deletedStaff = await Staff.findByIdAndDelete(id);

        if (!deletedStaff) {
            return NextResponse.json({ success: false, error: 'Staff member not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Staff member deleted successfully' });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

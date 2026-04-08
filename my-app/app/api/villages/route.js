import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Village from '../../../models/Village';

export async function GET() {
    try {
        await dbConnect();
        const villages = await Village.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: villages });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch villages' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await dbConnect();
        const body = await req.json();
        const village = await Village.create(body);
        return NextResponse.json({ success: true, data: village });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
export async function DELETE(req) {
    try {
        await dbConnect();
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({ success: false, error: 'Village ID is required' }, { status: 400 });
        }

        const deletedVillage = await Village.findByIdAndDelete(id);

        if (!deletedVillage) {
            return NextResponse.json({ success: false, error: 'Village not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Village deleted successfully' });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

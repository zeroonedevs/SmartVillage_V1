import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import FocusArea from '../../../models/FocusArea';

async function checkAuth(request) {
    const authCookie = request.cookies.get('gop_admin_session');
    if (!authCookie || authCookie.value !== 'authenticated') {
        return false;
    }
    return true;
}

export async function GET(request) {
    try {
        await dbConnect();
        const areas = await FocusArea.find({}).sort({ order: 1 });
        return NextResponse.json({ success: true, data: areas }, { status: 200 });
    } catch (error) {
        console.error('Error fetching focus areas:', error);
        return NextResponse.json(
            { error: 'Failed to fetch focus areas' },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        if (!await checkAuth(request)) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { title, image, description, order } = body;

        if (!title || !image || !description || order === undefined) {
            return NextResponse.json(
                { error: 'Title, description, image URL, and order are required' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Check if order already exists
        const existing = await FocusArea.findOne({ order });
        if (existing) {
            return NextResponse.json(
                { error: `Focus area with order ${order} already exists` },
                { status: 400 }
            );
        }

        const area = await FocusArea.create(body);

        return NextResponse.json({
            success: true,
            message: 'Focus area created successfully',
            data: area
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating focus area:', error);
        return NextResponse.json(
            { error: 'Failed to create focus area', details: error.message },
            { status: 500 }
        );
    }
}

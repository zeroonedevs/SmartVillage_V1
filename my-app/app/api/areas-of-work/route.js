import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import AreaOfWork from '../../../models/AreaOfWork';

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
        const areas = await AreaOfWork.find({}).sort({ order: 1, createdAt: -1 });
        return NextResponse.json({ success: true, data: areas }, { status: 200 });
    } catch (error) {
        console.error('Error fetching areas of work:', error);
        return NextResponse.json(
            { error: 'Failed to fetch areas of work' },
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
        const { title, image } = body;

        if (!title || !image) {
            return NextResponse.json(
                { error: 'Title and image URL are required' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Auto-increment order
        if (body.order === undefined) {
            const count = await AreaOfWork.countDocuments();
            body.order = count;
        }

        const area = await AreaOfWork.create(body);

        return NextResponse.json({
            success: true,
            message: 'Area of work created successfully',
            data: area
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating area of work:', error);
        return NextResponse.json(
            { error: 'Failed to create area of work', details: error.message },
            { status: 500 }
        );
    }
}

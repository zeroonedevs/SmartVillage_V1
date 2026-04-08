import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Hero from '../../../models/Hero';

async function checkAuth(request) {
    const authCookie = request.cookies.get('gop_admin_session');
    if (!authCookie || authCookie.value !== 'authenticated') {
        const token = request.headers.get('Authorization')?.split(' ')[1];
        if (!token) return false;
        // Add token validation logic here if needed
    }
    return true;
}

export async function GET(request) {
    try {
        await dbConnect();
        const slides = await Hero.find({}).sort({ order: 1, createdAt: -1 });
        return NextResponse.json({ success: true, data: slides }, { status: 200 });
    } catch (error) {
        console.error('Error fetching hero slides:', error);
        return NextResponse.json(
            { error: 'Failed to fetch hero slides' },
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

        // Auto-increment order if not provided
        if (body.order === undefined) {
            const count = await Hero.countDocuments();
            body.order = count;
        }

        const slide = await Hero.create(body);

        return NextResponse.json({
            success: true,
            message: 'Hero slide created successfully',
            data: slide
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating hero slide:', error);
        return NextResponse.json(
            { error: 'Failed to create hero slide', details: error.message },
            { status: 500 }
        );
    }
}

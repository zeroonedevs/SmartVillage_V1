import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Award from '../../../models/Award';


function checkAuth(request) {
    const authCookie = request.cookies.get('gop_admin_session');
    if (!authCookie || authCookie.value !== 'authenticated') {
        return false;
    }
    return true;
}


export async function GET(request) {
    try {
        await dbConnect();
        const awards = await Award.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: awards }, { status: 200 });
    } catch (error) {
        console.error('Error fetching awards:', error);
        return NextResponse.json(
            { error: 'Failed to fetch awards' },
            { status: 500 }
        );
    }
}


export async function POST(request) {
    try {
        if (!checkAuth(request)) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { title, year, image, description } = await request.json();

        if (!title || !year || !image || !description) {
            return NextResponse.json(
                { error: 'Title, year, image URL, and description are required' },
                { status: 400 }
            );
        }

        await dbConnect();

        const award = await Award.create({
            title,
            year,
            image,
            description
        });

        return NextResponse.json({
            success: true,
            message: 'Award created successfully',
            data: award
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating award:', error);
        return NextResponse.json(
            { error: 'Failed to create award', details: error.message },
            { status: 500 }
        );
    }
}

import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Hero from '../../../../models/Hero';

async function checkAuth(request) {
    const authCookie = request.cookies.get('gop_admin_session');
    if (!authCookie || authCookie.value !== 'authenticated') {
        return false;
    }
    return true;
}

export async function PUT(request, { params }) {
    try {
        if (!await checkAuth(request)) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id } = await params;
        const body = await request.json();

        await dbConnect();

        const slide = await Hero.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!slide) {
            return NextResponse.json(
                { error: 'Hero slide not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Hero slide updated successfully',
            data: slide
        }, { status: 200 });

    } catch (error) {
        console.error('Error updating hero slide:', error);
        return NextResponse.json(
            { error: 'Failed to update hero slide', details: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    try {
        if (!await checkAuth(request)) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id } = await params;

        await dbConnect();

        const slide = await Hero.findByIdAndDelete(id);

        if (!slide) {
            return NextResponse.json(
                { error: 'Hero slide not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Hero slide deleted successfully'
        }, { status: 200 });

    } catch (error) {
        console.error('Error deleting hero slide:', error);
        return NextResponse.json(
            { error: 'Failed to delete hero slide', details: error.message },
            { status: 500 }
        );
    }
}

import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import AreaOfWork from '../../../../models/AreaOfWork';

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

        const area = await AreaOfWork.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!area) {
            return NextResponse.json(
                { error: 'Area of work not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Area of work updated successfully',
            data: area
        }, { status: 200 });

    } catch (error) {
        console.error('Error updating area of work:', error);
        return NextResponse.json(
            { error: 'Failed to update area of work', details: error.message },
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

        const area = await AreaOfWork.findByIdAndDelete(id);

        if (!area) {
            return NextResponse.json(
                { error: 'Area of work not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Area of work deleted successfully'
        }, { status: 200 });

    } catch (error) {
        console.error('Error deleting area of work:', error);
        return NextResponse.json(
            { error: 'Failed to delete area of work', details: error.message },
            { status: 500 }
        );
    }
}

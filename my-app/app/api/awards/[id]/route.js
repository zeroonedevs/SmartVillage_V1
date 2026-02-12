import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Award from '../../../../models/Award';

// Helper function to check authentication
function checkAuth(request) {
    const authCookie = request.cookies.get('gop_admin_session');
    if (!authCookie || authCookie.value !== 'authenticated') {
        return false;
    }
    return true;
}

// PUT - Update award
export async function PUT(request, { params }) {
    try {
        if (!checkAuth(request)) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id } = await params;
        const { title, year, image, description } = await request.json();

        await dbConnect();

        const award = await Award.findById(id);
        if (!award) {
            return NextResponse.json(
                { error: 'Award not found' },
                { status: 404 }
            );
        }

        if (title) award.title = title;
        if (year) award.year = year;
        if (image) award.image = image;
        if (description) award.description = description;

        await award.save();

        return NextResponse.json({
            success: true,
            message: 'Award updated successfully',
            data: award
        }, { status: 200 });

    } catch (error) {
        console.error('Error updating award:', error);
        return NextResponse.json(
            { error: 'Failed to update award', details: error.message },
            { status: 500 }
        );
    }
}

// DELETE - Delete award
export async function DELETE(request, { params }) {
    try {
        if (!checkAuth(request)) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id } = await params;

        await dbConnect();

        const award = await Award.findById(id);
        if (!award) {
            return NextResponse.json(
                { error: 'Award not found' },
                { status: 404 }
            );
        }

        await Award.findByIdAndDelete(id);

        return NextResponse.json({
            success: true,
            message: 'Award deleted successfully'
        }, { status: 200 });

    } catch (error) {
        console.error('Error deleting award:', error);
        return NextResponse.json(
            { error: 'Failed to delete award', details: error.message },
            { status: 500 }
        );
    }
}

import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import News from '../../../../models/News';

// Helper function to check authentication
function checkAuth(request) {
    const authCookie = request.cookies.get('gop_admin_session');
    if (!authCookie || authCookie.value !== 'authenticated') {
        return false;
    }
    return true;
}

// PUT - Update news article
export async function PUT(request, { params }) {
    try {
        if (!checkAuth(request)) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id } = params;
        const { title, date, imageUrl, excerpt, link } = await request.json();

        await dbConnect();

        const news = await News.findById(id);
        if (!news) {
            return NextResponse.json(
                { error: 'News article not found' },
                { status: 404 }
            );
        }

        if (title) news.title = title;
        if (date) news.date = date;
        if (imageUrl) news.imageUrl = imageUrl;
        if (excerpt) news.excerpt = excerpt;
        if (link !== undefined) news.link = link;

        await news.save();

        return NextResponse.json({
            success: true,
            message: 'News article updated successfully',
            data: news
        }, { status: 200 });

    } catch (error) {
        console.error('Error updating news:', error);
        return NextResponse.json(
            { error: 'Failed to update news article', details: error.message },
            { status: 500 }
        );
    }
}

// DELETE - Delete news article
export async function DELETE(request, { params }) {
    try {
        if (!checkAuth(request)) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id } = params;

        await dbConnect();

        const news = await News.findById(id);
        if (!news) {
            return NextResponse.json(
                { error: 'News article not found' },
                { status: 404 }
            );
        }

        await News.findByIdAndDelete(id);

        return NextResponse.json({
            success: true,
            message: 'News article deleted successfully'
        }, { status: 200 });

    } catch (error) {
        console.error('Error deleting news:', error);
        return NextResponse.json(
            { error: 'Failed to delete news article', details: error.message },
            { status: 500 }
        );
    }
}

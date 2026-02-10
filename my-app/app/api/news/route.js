import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import News from '../../../models/News';

// Helper function to check authentication
function checkAuth(request) {
    const authCookie = request.cookies.get('gop_admin_session');
    if (!authCookie || authCookie.value !== 'authenticated') {
        return false;
    }
    return true;
}

// GET - List all news articles
export async function GET(request) {
    try {
        await dbConnect();
        const news = await News.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: news }, { status: 200 });
    } catch (error) {
        console.error('Error fetching news:', error);
        return NextResponse.json(
            { error: 'Failed to fetch news' },
            { status: 500 }
        );
    }
}

// POST - Create new news article
export async function POST(request) {
    try {
        if (!checkAuth(request)) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { title, date, imageUrl, excerpt, link } = await request.json();

        if (!title || !date || !imageUrl || !excerpt) {
            return NextResponse.json(
                { error: 'Title, date, image URL, and description are required' },
                { status: 400 }
            );
        }

        await dbConnect();

        const news = await News.create({
            title,
            date,
            imageUrl,
            excerpt,
            link: link || ''
        });

        return NextResponse.json({
            success: true,
            message: 'News article created successfully',
            data: news
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating news:', error);
        return NextResponse.json(
            { error: 'Failed to create news article', details: error.message },
            { status: 500 }
        );
    }
}

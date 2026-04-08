
import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import GopRegistration from '../../../../models/GopRegistration';


function checkAuth(request) {
    const authCookie = request.cookies.get('gop_admin_session');
    if (!authCookie || authCookie.value !== 'authenticated') {
        return false;
    }
    return true;
}

export async function GET(request) {
    try {
        
        if (!checkAuth(request)) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await dbConnect();
        const registrations = await GopRegistration.find({}).sort({ createdAt: -1 });
        return NextResponse.json(registrations, { status: 200 });

    } catch (error) {
        console.error('Error fetching GOP registrations:', error);
        return NextResponse.json(
            { error: 'Failed to fetch registrations' },
            { status: 500 }
        );
    }
}

export async function DELETE(request) {
    try {
        
        if (!checkAuth(request)) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Registration ID is required' },
                { status: 400 }
            );
        }

        await dbConnect();
        const deletedRegistration = await GopRegistration.findByIdAndDelete(id);

        if (!deletedRegistration) {
            return NextResponse.json(
                { error: 'Registration not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: 'Registration deleted successfully' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error deleting GOP registration:', error);
        return NextResponse.json(
            { error: 'Failed to delete registration' },
            { status: 500 }
        );
    }
}

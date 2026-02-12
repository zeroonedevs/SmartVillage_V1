
import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Gallery from '../../../../models/Gallery';

export async function GET() {
  await dbConnect();

  try {
    
    const images = await Gallery.find({}).sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ success: true, data: images });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request) {
  await dbConnect();

  try {
    const body = await request.json();
    const galleryItem = await Gallery.create(body);
    return NextResponse.json({ success: true, data: galleryItem }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(request) {
    await dbConnect();
    try {
        const { id, order } = await request.json();
        const updatedImage = await Gallery.findByIdAndUpdate(
            id,
            { order },
            { new: true, runValidators: true }
        );
        if (!updatedImage) {
            return NextResponse.json({ success: false, error: 'Image not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: updatedImage });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function DELETE(request) {
    await dbConnect();
    try {
        const { id } = await request.json();
        const deletedImage = await Gallery.findByIdAndDelete(id);
        if (!deletedImage) {
             return NextResponse.json({ success: false, error: 'Image not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

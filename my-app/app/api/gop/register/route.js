
import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import GopRegistration from '../../../../models/GopRegistration';

export async function POST(request) {
    try {
        const body = await request.json();
        const {
            orgName, category, contactPerson, designation,
            contactEmail, contactPhone, orgAddress, tenure, interestedDomains
        } = body;

        
        if (!orgName || !contactEmail || !contactPhone) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        await dbConnect();

        const registration = await GopRegistration.create({
            orgName,
            category,
            contactPerson,
            designation,
            contactEmail,
            contactPhone,
            orgAddress,
            tenure,
            interestedDomains
        });

        return NextResponse.json({
            success: true,
            id: registration._id,
            message: 'Registration successful'
        });

    } catch (error) {
        console.error('Registration Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    }
}

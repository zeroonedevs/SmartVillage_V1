
import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import GopAdmin from '../../../../models/GopAdmin';
import bcrypt from 'bcryptjs';


export async function POST(request) {
    try {
        const { secret, username, password } = await request.json();

        
        
        const INIT_SECRET = process.env.ADMIN_INIT_SECRET || 'svr-kluniversity-2026';

        if (secret !== INIT_SECRET) {
            return NextResponse.json(
                { success: false, message: 'Invalid secret key' },
                { status: 403 }
            );
        }

        if (!username || !password) {
            return NextResponse.json(
                { success: false, message: 'Username and password are required' },
                { status: 400 }
            );
        }

        await dbConnect();

        
        const passwordHash = await bcrypt.hash(password, 10);

        
        const existingAdmin = await GopAdmin.findOne({ username });

        if (existingAdmin) {
            existingAdmin.passwordHash = passwordHash;
            await existingAdmin.save();
        } else {
            await GopAdmin.create({
                username,
                passwordHash
            });
        }

        return NextResponse.json({
            success: true,
            message: 'Admin account initialized successfully',
            username: username
        });

    } catch (error) {
        console.error('Admin initialization error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal Server Error', error: error.message },
            { status: 500 }
        );
    }
}

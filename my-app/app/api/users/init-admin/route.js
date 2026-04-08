import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/User';
import bcrypt from 'bcryptjs';


export async function POST(request) {
    try {
        const { secret, userID, name, password } = await request.json();

        
        const INIT_SECRET = process.env.ADMIN_INIT_SECRET || 'svr-kluniversity-2026';

        if (secret !== INIT_SECRET) {
            return NextResponse.json(
                { success: false, message: 'Invalid secret key' },
                { status: 403 }
            );
        }

        if (!name || !password) {
            return NextResponse.json(
                { success: false, message: 'Name and password are required' },
                { status: 400 }
            );
        }

        await dbConnect();

        
        const passwordHash = await bcrypt.hash(password, 10);

        
        const existingUser = await User.findOne({ userID: userID || 1 });

        if (existingUser) {
            
            existingUser.name = name;
            existingUser.passwordHash = passwordHash;
            existingUser.role = 'admin';
            await existingUser.save();
        } else {
            
            await User.create({
                userID: userID || 1,
                name: name,
                passwordHash,
                role: 'admin'
            });
        }

        return NextResponse.json({
            success: true,
            message: 'Admin account initialized successfully',
            name: name
        });

    } catch (error) {
        console.error('Admin initialization error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal Server Error', error: error.message },
            { status: 500 }
        );
    }
}

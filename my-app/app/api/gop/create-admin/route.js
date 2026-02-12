import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/User';
import bcrypt from 'bcryptjs';


export async function POST(request) {
    try {
        
        if (process.env.NODE_ENV === 'production') {
            const { secret } = await request.json();
            const INIT_SECRET = process.env.ADMIN_INIT_SECRET || 'svr-kluniversity-2026';
            if (secret !== INIT_SECRET) {
                return NextResponse.json(
                    { success: false, message: 'Unauthorized' },
                    { status: 403 }
                );
            }
        }

        const { userID, name, password } = await request.json();

        if (!userID || !name || !password) {
            return NextResponse.json(
                { success: false, message: 'userID, name and password are required' },
                { status: 400 }
            );
        }

        await dbConnect();

        
        const existingUser = await User.findOne({ userID });
        if (existingUser) {
            
            existingUser.name = name;
            existingUser.passwordHash = await bcrypt.hash(password, 10);
            existingUser.role = 'admin';
            await existingUser.save();
            return NextResponse.json({
                success: true,
                message: 'Admin account updated successfully',
                name: name
            });
        }

        
        const passwordHash = await bcrypt.hash(password, 10);
        await User.create({
            userID,
            name,
            passwordHash,
            role: 'admin'
        });

        return NextResponse.json({
            success: true,
            message: 'Admin account created successfully',
            name: name
        });

    } catch (error) {
        console.error('Create admin error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal Server Error', error: error.message },
            { status: 500 }
        );
    }
}

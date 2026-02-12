import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/User';
import bcrypt from 'bcryptjs';


function checkAdminAuth(request) {
    const authCookie = request.cookies.get('gop_admin_session');
    const roleCookie = request.cookies.get('user_role');
    if (!authCookie || authCookie.value !== 'authenticated' || roleCookie?.value !== 'admin') {
        return false;
    }
    return true;
}


export async function PUT(request, { params }) {
    try {
        if (!checkAdminAuth(request)) {
            return NextResponse.json(
                { error: 'Unauthorized - Admin access required' },
                { status: 401 }
            );
        }

        const { id } = await params;
        const { userID, name, email, password, role } = await request.json();

        await dbConnect();

        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        
        if (userID && userID !== user.userID) {
            const existingUser = await User.findOne({ userID });
            if (existingUser) {
                return NextResponse.json({ error: 'UserID already exists' }, { status: 400 });
            }
            user.userID = userID;
        }

        if (name && name !== user.name) {
            
            const existingUser = await User.findOne({ name });
            if (existingUser) {
                return NextResponse.json(
                    { error: 'Name already exists' },
                    { status: 400 }
                );
            }
            user.name = name;
        }

        if (email !== undefined) {
            user.email = email;
        }

        if (role && ['admin', 'staff', 'lead'].includes(role)) {
            user.role = role;
        }

        if (password) {
            user.passwordHash = await bcrypt.hash(password, 10);
        }

        await user.save();

        
        const userResponse = user.toObject();
        delete userResponse.passwordHash;

        return NextResponse.json({
            success: true,
            message: 'User updated successfully',
            data: userResponse
        }, { status: 200 });

    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json(
            { error: 'Failed to update user', details: error.message },
            { status: 500 }
        );
    }
}


export async function DELETE(request, { params }) {
    try {
        if (!checkAdminAuth(request)) {
            return NextResponse.json(
                { error: 'Unauthorized - Admin access required' },
                { status: 401 }
            );
        }

        const { id } = await params;

        await dbConnect();

        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        
        const userIdCookie = request.cookies.get('user_id');
        if (userIdCookie && Number(userIdCookie.value) === user.userID) {
            return NextResponse.json(
                { error: 'Cannot delete your own account' },
                { status: 400 }
            );
        }

        await User.findByIdAndDelete(id);

        return NextResponse.json({
            success: true,
            message: 'User deleted successfully'
        }, { status: 200 });

    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json(
            { error: 'Failed to delete user', details: error.message },
            { status: 500 }
        );
    }
}

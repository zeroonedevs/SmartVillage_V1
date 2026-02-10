import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/User';
import bcrypt from 'bcryptjs';

// Helper function to check admin authentication
function checkAdminAuth(request) {
    const authCookie = request.cookies.get('gop_admin_session');
    const roleCookie = request.cookies.get('user_role');
    if (!authCookie || authCookie.value !== 'authenticated' || roleCookie?.value !== 'admin') {
        return false;
    }
    return true;
}

// PUT - Update user
export async function PUT(request, { params }) {
    try {
        if (!checkAdminAuth(request)) {
            return NextResponse.json(
                { error: 'Unauthorized - Admin access required' },
                { status: 401 }
            );
        }

        const { id } = params;
        const { username, password, role } = await request.json();

        await dbConnect();

        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Update fields
        if (username && username !== user.username) {
            // Check if new username already exists
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return NextResponse.json(
                    { error: 'Username already exists' },
                    { status: 400 }
                );
            }
            user.username = username;
        }

        if (role && ['admin', 'faculty', 'student'].includes(role)) {
            user.role = role;
        }

        if (password) {
            user.passwordHash = await bcrypt.hash(password, 10);
        }

        await user.save();

        // Return user without password hash
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

// DELETE - Delete user
export async function DELETE(request, { params }) {
    try {
        if (!checkAdminAuth(request)) {
            return NextResponse.json(
                { error: 'Unauthorized - Admin access required' },
                { status: 401 }
            );
        }

        const { id } = params;

        await dbConnect();

        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Prevent deleting yourself
        const usernameCookie = request.cookies.get('username');
        if (usernameCookie && usernameCookie.value === user.username) {
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

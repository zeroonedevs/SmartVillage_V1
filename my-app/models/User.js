import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  userID: {
    type: Number,
    required: [true, 'Please provide a User ID'],
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  email: {
    type: String,
    required: false,
    lowercase: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ['admin', 'staff', 'lead'],
    required: [true, 'Please provide a role'],
    default: 'lead',
  },
  passwordHash: {
    type: String,
    required: [true, 'Please provide a password hash'],
  },
  resetToken: {
    type: String,
    default: null,
  },
  resetTokenExpiry: {
    type: Date,
    default: null,
  },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);

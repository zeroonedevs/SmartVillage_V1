
import mongoose from 'mongoose';

const GopAdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: [true, 'Please provide a password hash'],
  },
}, { timestamps: true });

export default mongoose.models.GopAdmin || mongoose.model('GopAdmin', GopAdminSchema);

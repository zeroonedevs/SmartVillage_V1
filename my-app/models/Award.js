import mongoose from 'mongoose';

const AwardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
  },
  year: {
    type: String,
    required: [true, 'Please provide a year'],
    trim: true,
  },
  image: {
    type: String,
    required: [true, 'Please provide an image URL'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

export default mongoose.models.Award || mongoose.model('Award', AwardSchema);

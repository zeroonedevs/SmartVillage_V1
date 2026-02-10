import mongoose from 'mongoose';

const NewsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
  },
  date: {
    type: String,
    required: [true, 'Please provide a date'],
    trim: true,
  },
  imageUrl: {
    type: String,
    required: [true, 'Please provide an image URL'],
    trim: true,
  },
  excerpt: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true,
  },
  link: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

export default mongoose.models.News || mongoose.model('News', NewsSchema);

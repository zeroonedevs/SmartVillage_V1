
import mongoose from 'mongoose';

const GallerySchema = new mongoose.Schema({
  imageLink: {
    type: String,
    required: [true, 'Please provide an image link'],
  },
  domain: {
    type: String,
    required: [true, 'Please provide a domain'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  order: {
    type: Number,
    default: 0,
  },
});

export default mongoose.models.Gallery || mongoose.model('Gallery', GallerySchema);

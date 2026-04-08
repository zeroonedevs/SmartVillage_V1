import mongoose from 'mongoose';

const FocusAreaSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title'],
    },
    description: {
        type: String,
        required: [true, 'Please provide a description'],
    },
    image: {
        type: String,
        required: [true, 'Please provide an image URL'],
    },
    order: {
        type: Number,
        required: true,
        unique: true, // Should be unique ideally (1-9)
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

export default mongoose.models.FocusArea || mongoose.model('FocusArea', FocusAreaSchema);

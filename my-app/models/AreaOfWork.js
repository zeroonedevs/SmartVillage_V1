import mongoose from 'mongoose';

const AreaOfWorkSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title'],
    },
    image: {
        type: String,
        required: [true, 'Please provide an image URL'],
    },
    description: {
        type: String,
    },
    order: {
        type: Number,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

export default mongoose.models.AreaOfWork || mongoose.model('AreaOfWork', AreaOfWorkSchema);

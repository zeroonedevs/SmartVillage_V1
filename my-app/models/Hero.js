import mongoose from 'mongoose';

const HeroSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title'],
    },
    subtitle: {
        type: String,
    },
    image: {
        type: String,
        required: [true, 'Please provide an image URL'],
    },
    link: {
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

export default mongoose.models.Hero || mongoose.model('Hero', HeroSchema);

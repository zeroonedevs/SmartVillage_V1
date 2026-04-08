const mongoose = require('mongoose');
const { heroes, areas, focusAreas } = require('./initialData');
require('dotenv').config({ path: '.env.local' }); // Loaded from project root when running via 'node scripts/...'

// Define simple schemas for the script to avoid importing full Next.js models which might have issues in node script
const HeroSchema = new mongoose.Schema({
    title: String,
    subtitle: String,
    image: String,
    link: String,
    order: Number,
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
});

const AreaOfWorkSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: String,
    link: String,
    order: Number,
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
});

const FocusAreaSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: String,
    order: Number,
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
});

const Hero = mongoose.models.Hero || mongoose.model('Hero', HeroSchema);
const AreaOfWork = mongoose.models.AreaOfWork || mongoose.model('AreaOfWork', AreaOfWorkSchema);
const FocusArea = mongoose.models.FocusArea || mongoose.model('FocusArea', FocusAreaSchema);

const seedData = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing data (Optional: comment out if you want to append)
        // await Hero.deleteMany({});
        // await AreaOfWork.deleteMany({});
        // await FocusArea.deleteMany({});
        // console.log('Cleared existing data');

        // Insert Heroes
        for (const hero of heroes) {
            await Hero.findOneAndUpdate(
                { title: hero.title },
                hero,
                { upsert: true, new: true }
            );
            console.log(`Processed Hero: ${hero.title}`);
        }

        // Insert Areas of Work
        for (const area of areas) {
            await AreaOfWork.findOneAndUpdate(
                { title: area.title },
                area,
                { upsert: true, new: true }
            );
            console.log(`Processed Area: ${area.title}`);
        }

        // Insert Focus Areas
        for (const focus of focusAreas) {
            await FocusArea.findOneAndUpdate(
                { title: focus.title },
                focus,
                { upsert: true, new: true }
            );
            console.log(`Processed Focus Area: ${focus.title}`);
        }

        console.log('Seeding completed successfully');
    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
};

seedData();


require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
    name: String,
    date: Date
}, { timestamps: true });

const Activity = mongoose.models.Activity || mongoose.model('Activity', ActivitySchema);

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const count = await Activity.countDocuments();
        console.log(`Total activities in DB: ${count}`);
        const latest = await Activity.find().sort({ createdAt: -1 }).limit(2);
        console.log('Latest activities:', latest);
        await mongoose.disconnect();
    } catch (e) {
        console.error(e);
    }
}

check();

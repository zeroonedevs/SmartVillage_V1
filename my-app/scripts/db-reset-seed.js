/**
 * Comprehensive script to reset the database and seed it with fresh data.
 * Resets: Users, GopAdmins, News, Awards, Activities.
 * Seeds: Default Users (Admin, Staff, Lead) and News, Awards, Activities from static data.
 * 
 * Run with: node scripts/db-reset-seed.js
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// --- SCHEMAS ---

const UserSchema = new mongoose.Schema({
    userID: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: false },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'staff', 'lead'], required: true, default: 'lead' }
}, { timestamps: true });

const NewsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: String, required: true },
    imageUrl: { type: String, required: true },
    excerpt: { type: String, required: true },
    link: { type: String }
}, { timestamps: true });

const AwardSchema = new mongoose.Schema({
    title: { type: String, required: true },
    year: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true }
}, { timestamps: true });

const ActivitySchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: Date, required: true },
    domain: { type: String },
    year: { type: String },
    studentsParticipated: { type: Number, required: true },
    reportLink: { type: String, required: true }
}, { timestamps: true });

// Models
const User = mongoose.models.User || mongoose.model('User', UserSchema);
const GopAdmin = mongoose.models.GopAdmin || mongoose.model('GopAdmin', new mongoose.Schema({}, { strict: false })); // Legacy
const News = mongoose.models.News || mongoose.model('News', NewsSchema);
const Award = mongoose.models.Award || mongoose.model('Award', AwardSchema);
const Activity = mongoose.models.Activity || mongoose.model('Activity', ActivitySchema);

// --- SEED DATA ---

const defaultUsers = [
    { userID: 1, name: 'System Admin', password: 'admin123', role: 'admin', email: '2300030350@kluniversity.in' },
    { userID: 1002, name: 'Operations Staff', password: 'staff123', role: 'staff', email: 'staff@example.com' },
    { userID: 1003, name: 'Project Lead', password: 'lead123', role: 'lead', email: 'lead@example.com' }
];

const newsArticles = [
    { title: "Students painting on the walls of MPP school", date: "15-08-2023", imageUrl: "https://firebasestorage.googleapis.com/v0/b/svrwebsite-1e892.appspot.com/o/news%2Fstudents%20painting.jpg?alt=media&token=0f3d3b48-e310-4d3d-aaba-bbc21ffca393", excerpt: "A rural village in India has successfully transitioned to 100% renewable energy, setting a precedent for sustainable development in remote areas.", link: 'https://kluniversityin-my.sharepoint.com/:i:/g/personal/2300030350_kluniversity_in/Ec64JtI9j0lAt2ZEaIp1iMwBNfWdpSnBNFlYjPDqyGripw?e=YfAZRl' },
    { title: "Pharmacy students conducting blood group tests for villagers in Musi again village", date: "30-05-2024", imageUrl: "https://firebasestorage.googleapis.com/v0/b/svrwebsite-1e892.appspot.com/o/news%2FHealth%20Services.png?alt=media&token=fc7baf56-42eb-4948-bd7b-67d80d15cbec", excerpt: "A village in rural Africa is empowering women by reviving traditional crafts, providing them with sustainable livelihoods and preserving cultural heritage.", link: 'https://kluniversityin-my.sharepoint.com/:i:/g/personal/venkatasatyanarayana_kluniversity_in/Eca4jy_gndFKgbnHf8vtzlIBPMe93xfzdngGq1Y2ZBPmsA?e=1ykj8q' },
    { title: "Village walls turns canvass for youth", date: "10-08-2024", imageUrl: "https://firebasestorage.googleapis.com/v0/b/svrwebsite-1e892.appspot.com/o/news%2Fvillage%20walls.png?alt=media&token=d01cda0a-7c20-40b3-9f90-e364ac27f01a", excerpt: "Students paint a wall in Vellatur village in Krishna district as part of the Smart Village Revolution programme", link: "https://kluniversityin-my.sharepoint.com/:i:/g/personal/venkatasatyanarayana_kluniversity_in/EatYBIk6jERBhuH-sqYbA8MBvW97wICpXoZ-ZeMyiUxEVg?e=26MsBn" }
];

const awardsData = [
    { title: "Social Impact Excellence", year: "2022", image: "https://i.imghippo.com/files/QI7955AxM.png", description: "In 2022, KL University won the 'Outreach and Society' award for its Smart Village Revolution (SVR), recognizing efforts in rural development and societal well-being." },
    { title: "Best Village Development Project", year: "2023", image: "https://i.imghippo.com/files/jlUa1209myY.png", description: "In 2023, Mr. K. UdayKiran won the 'Best Project of the Year' award from the Police Department for his innovative security alarm system, enhancing safety in villages." }
];

// --- HELPERS ---

function parseDate(dateString) {
    if (!dateString) return null;
    let dateToParse = dateString;
    if (dateString.toLowerCase().includes('to')) {
        dateToParse = dateString.split(/to/i)[0].trim();
    }
    const normalized = dateToParse.replace(/\./g, '-').trim();
    const parts = normalized.split('-');
    if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        if (!isNaN(day) && !isNaN(month) && !isNaN(year)) return new Date(year, month, day);
    }
    return null;
}

// --- MAIN EXECUTION ---

async function resetAndSeed() {
    try {
        const MONGODB_URI = process.env.MONGODB_URI;
        if (!MONGODB_URI) throw new Error('Define MONGODB_URI in .env.local');

        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✓ Connected\n');

        // 1. Reset Collections
        console.log('Resetting collections...');
        await mongoose.connection.db.dropCollection('users').catch(() => console.log('  - users collection already empty or not found'));
        await mongoose.connection.db.dropCollection('gopadmins').catch(() => { });
        await mongoose.connection.db.dropCollection('news').catch(() => { });
        await mongoose.connection.db.dropCollection('awards').catch(() => { });
        await mongoose.connection.db.dropCollection('activities').catch(() => { });
        console.log('✓ All requested collections cleared (including old indexes)\n');

        // 2. Seed Users
        console.log('Seeding default users...');
        for (const u of defaultUsers) {
            const passwordHash = await bcrypt.hash(u.password, 10);
            await User.create({
                userID: u.userID,
                name: u.name,
                passwordHash,
                role: u.role,
                email: u.email
            });
            console.log(`  - Created ${u.role}: ${u.userID} / ${u.password}`);
        }
        console.log('✓ Users seeded\n');

        // 3. Seed News
        console.log('Seeding news articles...');
        for (const n of newsArticles) {
            await News.create(n);
        }
        console.log(`✓ ${newsArticles.length} News articles seeded\n`);

        // 4. Seed Awards
        console.log('Seeding awards...');
        for (const a of awardsData) {
            await Award.create(a);
        }
        console.log(`✓ ${awardsData.length} Awards seeded\n`);

        // 5. Seed Activities (from file)
        console.log('Seeding activities from Updates_Array.js...');
        const filePath = path.join(__dirname, '../app/(pages)/activities/Updates_Array.js');
        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const arrayMatch = fileContent.match(/const newData = \[([\s\S]*)\];/);
            if (arrayMatch) {
                const activitiesData = eval(`[${arrayMatch[1]}]`);
                let imported = 0;
                for (const item of activitiesData.slice(0, 50)) { // Importing first 50 for speed
                    const activityName = item['Name of the activity'] || item['Name of the activity \nDD-MM-YYYY'];
                    const dateString = item['Date of the activity \nDD-MM-YYYY'] || item['Date of the activity'];
                    const activityDate = parseDate(dateString);
                    if (activityName && activityDate) {
                        await Activity.create({
                            name: activityName,
                            date: activityDate,
                            year: item['Year'] || undefined,
                            studentsParticipated: parseInt(item['Number of students participated in such activities'] || '0', 10),
                            reportLink: item['Web Links'] || ''
                        });
                        imported++;
                    }
                }
                console.log(`✓ ${imported} Activities seeded from file\n`);
            }
        } else {
            console.log('⚠ Updates_Array.js not found, skipping activities\n');
        }

        console.log('-------------------------------------------');
        console.log('DATABASE RESET AND SEEDING COMPLETED!');
        console.log('-------------------------------------------');

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('✗ Script failed:', err);
        process.exit(1);
    }
}

resetAndSeed();

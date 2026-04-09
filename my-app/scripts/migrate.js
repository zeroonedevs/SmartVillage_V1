/**
 * Monolith: MongoDB data import, verify, and optional destructive reset.
 *
 * Usage:
 *   node scripts/migrate.js              # same as "all"
 *   node scripts/migrate.js all          # import news, awards, activities (upsert by natural keys)
 *   node scripts/migrate.js news|awards|activities
 *   node scripts/migrate.js verify       # counts + sample activities
 *   node scripts/migrate.js reset --confirm   # DROP users/news/awards/activities + reseed
 *
 * Requires: npm install, MONGODB_URI in .env.local
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// --- Schemas (aligned with app models) ---

const UserSchema = new mongoose.Schema(
  {
    userID: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: false },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'staff', 'lead'], required: true, default: 'lead' },
  },
  { timestamps: true }
);

const NewsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: true, trim: true },
    excerpt: { type: String, required: true, trim: true },
    link: { type: String, trim: true },
  },
  { timestamps: true }
);

const AwardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    year: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const ActivitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    date: { type: Date, required: true },
    domain: { type: String },
    year: { type: String },
    studentsParticipated: { type: Number, required: true },
    reportLink: { type: String, required: true },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const News = mongoose.models.News || mongoose.model('News', NewsSchema);
const Award = mongoose.models.Award || mongoose.model('Award', AwardSchema);
const Activity = mongoose.models.Activity || mongoose.model('Activity', ActivitySchema);

// --- Seed: default users (reset only) ---

const defaultUsers = [
  {
    userID: 1,
    name: 'System Admin',
    password: 'admin123',
    role: 'admin',
    email: '2300030350@kluniversity.in',
  },
  {
    userID: 1002,
    name: 'Operations Staff',
    password: 'staff123',
    role: 'staff',
    email: 'staff@example.com',
  },
  {
    userID: 1003,
    name: 'Project Lead',
    password: 'lead123',
    role: 'lead',
    email: 'lead@example.com',
  },
];

// --- Static news ---

const newsArticles = [
  {
    id: 1,
    title: 'Students painting on the walls of MPP school',
    date: '15-08-2023',
    imageUrl:
      'https://firebasestorage.googleapis.com/v0/b/svrwebsite-1e892.appspot.com/o/news%2Fstudents%20painting.jpg?alt=media&token=0f3d3b48-e310-4d3d-aaba-bbc21ffca393',
    excerpt:
      'A rural village in India has successfully transitioned to 100% renewable energy, setting a precedent for sustainable development in remote areas.',
    link: 'https://kluniversityin-my.sharepoint.com/:i:/g/personal/2300030350_kluniversity_in/Ec64JtI9j0lAt2ZEaIp1iMwBNfWdpSnBNFlYjPDqyGripw?e=YfAZRl',
  },
  {
    id: 2,
    title: 'Pharmacy students conducting blood group tests for villagers in Musi again village',
    date: '30-05-2024',
    imageUrl:
      'https://firebasestorage.googleapis.com/v0/b/svrwebsite-1e892.appspot.com/o/news%2FHealth%20Services.png?alt=media&token=fc7baf56-42eb-4948-bd7b-67d80d15cbec',
    excerpt:
      'A village in rural Africa is empowering women by reviving traditional crafts, providing them with sustainable livelihoods and preserving cultural heritage.',
    link: 'https://kluniversityin-my.sharepoint.com/:i:/g/personal/venkatasatyanarayana_kluniversity_in/Eca4jy_gndFKgbnHf8vtzlIBPMe93xfzdngGq1Y2ZBPmsA?e=1ykj8q',
  },
  {
    id: 3,
    title: 'Family Welfare Commissioner J Niwas talking about medical services',
    date: '22-07-2024',
    imageUrl:
      'https://firebasestorage.googleapis.com/v0/b/svrwebsite-1e892.appspot.com/o/news%2FHeath%20Minister%20speech.png?alt=media&token=119f26b4-6e8b-4a64-8e20-5d321147419f',
    excerpt:
      'Villages in drought-prone areas are adopting innovative water conservation techniques, ensuring water availability for future generations.',
    link: 'https://kluniversityin-my.sharepoint.com/:i:/g/personal/venkatasatyanarayana_kluniversity_in/EVS-kqO5NWJIpXvi3BcBDSwBl2mfFcYWG9bpAVLVQ0YJDQ?e=vg5RyU',
  },
  {
    id: 4,
    title: 'KLU students organizing Swachh Bharat in Tadepalli',
    date: '05-08-2024',
    imageUrl:
      'https://firebasestorage.googleapis.com/v0/b/svrwebsite-1e892.appspot.com/o/news%2FKl%20Students%20awareness.png?alt=media&token=7c76e7bb-384e-4991-87e1-e48a07bec467',
    excerpt:
      'A program introducing smart farming practices is revitalizing agriculture in remote villages, increasing crop yields and improving food security.',
    link: 'https://kluniversityin-my.sharepoint.com/:i:/g/personal/venkatasatyanarayana_kluniversity_in/ESYFLo14SjdNg8EA5Qxl4Y0BwIw0zPQj-79LB1YzZTKBQQ?e=wz0ztM',
  },
  {
    id: 5,
    title: 'Students conducting a ralley against plastic along with higher officials',
    date: '28-09-2019',
    imageUrl:
      'https://firebasestorage.googleapis.com/v0/b/svrwebsite-1e892.appspot.com/o/news%2Frevolution.png?alt=media&token=3b5e8f62-fa87-4819-abe5-182cbb5922c2',
    excerpt:
      'A ralley was conducted against use of plastic along with MLA Vasantha in the village Milavaram for a better society.',
    link: '',
  },
  {
    id: 6,
    title: 'Village walls turns canvass for youth',
    date: '10-08-2024',
    imageUrl:
      'https://firebasestorage.googleapis.com/v0/b/svrwebsite-1e892.appspot.com/o/news%2Fvillage%20walls.png?alt=media&token=d01cda0a-7c20-40b3-9f90-e364ac27f01a',
    excerpt:
      'Students paint a wall in Vellatur village in Krishna district as part of the Smart Village Revolution programme',
    link: 'https://kluniversityin-my.sharepoint.com/:i:/g/personal/venkatasatyanarayana_kluniversity_in/EatYBIk6jERBhuH-sqYbA8MBvW97wICpXoZ-ZeMyiUxEVg?e=26MsBn',
  },
  {
    id: 7,
    title: 'An initiative on a village developement committee in Vellaturu',
    date: '10-08-2024',
    imageUrl:
      'https://firebasestorage.googleapis.com/v0/b/svrwebsite-1e892.appspot.com/o/news%2Fvillage%20committee.png?alt=media&token=747767c2-cd80-4f26-ac46-ce03d4292e8e',
    excerpt:
      'Students of KL University took an initiative in a Village Developement Committee as a part of Smart Village Revolution',
    link: 'https://kluniversityin-my.sharepoint.com/:i:/g/personal/venkatasatyanarayana_kluniversity_in/ERcUdu6siX5Cqx-BjtNHcvMBhQUUtPVrU_Qe7Mavr-otWA?e=OymVsH',
  },
  {
    id: 8,
    title: 'Students demonstrating against plastic ban',
    date: '10-08-2024',
    imageUrl:
      'https://firebasestorage.googleapis.com/v0/b/svrwebsite-1e892.appspot.com/o/news%2FPlastic.png?alt=media&token=44f3231c-f4a3-4626-913b-14eb44619dab',
    excerpt:
      'Digital education initiatives are transforming schools in rural villages, bridging the educational gap and providing new opportunities for children.',
    link: 'https://kluniversityin-my.sharepoint.com/:i:/g/personal/venkatasatyanarayana_kluniversity_in/EXhrhxRvyjRHmJkHiGCljxkBriMXpk4QhbSU_2hBOfaPFQ?e=RpUnn5',
  },
  {
    id: 9,
    title: 'Awareness demonstration on right to vote',
    date: '10-08-2024',
    imageUrl:
      'https://firebasestorage.googleapis.com/v0/b/svrwebsite-1e892.appspot.com/o/news%2FVote.png?alt=media&token=ff4e0270-ca41-40f3-8384-948c08ec1718',
    excerpt:
      'Digital education initiatives are transforming schools in rural villages, bridging the educational gap and providing new opportunities for children.',
    link: 'https://kluniversityin-my.sharepoint.com/:i:/g/personal/2300030350_kluniversity_in/EY-Tgm9xm9RLputyXtFJdUgBZjznVYXlmZ0Y6P_ABXZIRQ?e=GYuW1f',
  },
  {
    id: 10,
    title: 'KLU students on a 10-day tour of Nallamalla tribal temple',
    date: '10-08-2024',
    imageUrl:
      'https://firebasestorage.googleapis.com/v0/b/svrwebsite-1e892.appspot.com/o/news%2Fnallamalla.png?alt=media&token=6efea935-445c-4c34-a84b-eef4e2007c91',
    excerpt:
      'Digital education initiatives are transforming schools in rural villages, bridging the educational gap and providing new opportunities for children.',
    link: 'https://kluniversityin-my.sharepoint.com/:i:/g/personal/2300030350_kluniversity_in/ETn6xFZWAeVGuQZ9XSLi2rIBq2xq5DCdgckBoPV8h7P2WA?e=3e7EP1',
  },
  {
    id: 11,
    title: 'KU students are conducting a survey to be aware of seasonal diseases',
    date: '10-08-2024',
    imageUrl:
      'https://firebasestorage.googleapis.com/v0/b/svrwebsite-1e892.appspot.com/o/news%2Fsesonal%20Diseases.png?alt=media&token=60a0df34-f8a7-4e96-8925-55c0e7b99645',
    excerpt:
      'Digital education initiatives are transforming schools in rural villages, bridging the educational gap and providing new opportunities for children.',
    link: 'https://kluniversityin-my.sharepoint.com/:i:/g/personal/2300030350_kluniversity_in/EQ2tE4q5on1Nium2lfbR__8BqdvCN2GZdMeAI0G7K_4laQ?e=y1R4Io',
  },
  {
    id: 12,
    title: 'KL University students participated in the Kavulur health survey',
    date: '10-08-2024',
    imageUrl:
      'https://firebasestorage.googleapis.com/v0/b/svrwebsite-1e892.appspot.com/o/news%2FHealth%20Camp.png?alt=media&token=bb343e1e-adeb-48fb-a76b-e5081fc84236',
    excerpt:
      'Digital education initiatives are transforming schools in rural villages, bridging the educational gap and providing new opportunities for children.',
    link: 'https://kluniversityin-my.sharepoint.com/:i:/g/personal/2300030350_kluniversity_in/Ea0gaZJqIGlGttRYZY3cxkUBo05n76pybfJgOZa0RGpHhw?e=4Z1XFK',
  },
];

// --- Static awards ---

const awards = [
  {
    id: 1,
    title: 'Social Impact Excellence',
    image: 'https://i.imghippo.com/files/QI7955AxM.png',
    description:
      "In 2022, KL University won the 'Outreach and Society' award for its Smart Village Revolution (SVR), recognizing efforts in rural development and societal well-being.",
    year: '2022',
  },
  {
    id: 2,
    title: 'Best Village Development Project',
    image: 'https://i.imghippo.com/files/jlUa1209myY.png',
    description:
      "In 2023, Mr. K. UdayKiran won the 'Best Project of the Year' award from the Police Department for his innovative security alarm system, enhancing safety in villages.",
    year: '2023',
  },
  {
    id: 3,
    title: 'Best Village Development Project',
    image: 'https://i.imghippo.com/files/zmXC3389OaI.png',
    description:
      'In 2024, Chaitanya and Kalyan received the award from the Election Commission of India for innovative public awareness initiatives.',
    year: '2024',
  },
  {
    id: 4,
    title: 'Best Village Development Project',
    image: 'https://i.imghippo.com/files/rc8332QE.png',
    description:
      'Mr. J. V. Kalyan received appreciation from HANDS for his outstanding contribution to Cardiopulmonary Resuscitation (CPR) training.',
    year: '2024',
  },
  {
    id: 5,
    title: 'Best Village Development Project',
    image: 'https://i.imghippo.com/files/qh5232gvs.png',
    description:
      'Received the Fellowship Award from APSACS Department for exceptional contributions to public health and awareness initiatives.',
    year: '2024',
  },
  {
    id: 6,
    title: 'Best Village Development Project',
    image: 'https://i.imghippo.com/files/FD9892Urk.png',
    description:
      'Received the 27TH NATIONAL YOUTH FESTIVAL Award from ministry of youth affairs and sports.',
    year: '2024',
  },
  {
    id: 7,
    title: 'Best Village Development Project',
    image: 'https://i.imghippo.com/files/Gd2054A.png',
    description:
      'Sk. Sameera has been appointed as the Zonal Incharge for AISU (All India Students Union), showcasing her leadership and dedication to student welfare in Community development.',
    year: '2024',
  },
  {
    id: 8,
    title: 'Best Village Development Project',
    image: 'https://i.imghippo.com/files/Fk7604VQ.png',
    description:
      'D. Amarnadh secured 1st prize in the National-level Agri-Drone competition, demonstrating exceptional innovation and expertise in agricultural technology.',
    year: '2023',
  },
];

// --- Helpers ---

function getMongoUri() {
  const u = process.env.MONGODB_URI;
  if (!u) throw new Error('Define MONGODB_URI in .env.local');
  return u;
}

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
    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      return new Date(year, month, day);
    }
  }
  return null;
}

function loadActivitiesData() {
  const filePath = path.join(__dirname, '../app/(pages)/activities/Updates_Array.js');
  if (!fs.existsSync(filePath)) {
    throw new Error(`Data file not found: ${filePath}`);
  }
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const arrayMatch = fileContent.match(/const newData = \[([\s\S]*)\];/);
  if (!arrayMatch) {
    throw new Error('Could not find newData array in Updates_Array.js');
  }
  return eval(`[${arrayMatch[1]}]`);
}

async function runImportNews() {
  let imported = 0;
  let skipped = 0;
  const errors = [];
  for (const newsItem of newsArticles) {
    try {
      const existing = await News.findOne({ title: newsItem.title, date: newsItem.date });
      if (!existing) {
        await News.create({
          title: newsItem.title,
          date: newsItem.date,
          imageUrl: newsItem.imageUrl,
          excerpt: newsItem.excerpt,
          link: newsItem.link || '',
        });
        imported++;
        console.log(`✓ Imported: ${newsItem.title}`);
      } else {
        skipped++;
        console.log(`⊘ Skipped (already exists): ${newsItem.title}`);
      }
    } catch (error) {
      errors.push(`Failed to import "${newsItem.title}": ${error.message}`);
      console.error(`✗ Error importing "${newsItem.title}":`, error.message);
    }
  }
  console.log('\n=== News import summary ===');
  console.log(`Total articles: ${newsArticles.length}`);
  console.log(`Imported: ${imported}`);
  console.log(`Skipped: ${skipped}`);
  if (errors.length) {
    console.log(`Errors: ${errors.length}`);
    errors.forEach(err => console.error(`  - ${err}`));
  }
}

async function runImportAwards() {
  let imported = 0;
  let skipped = 0;
  const errors = [];
  for (const awardItem of awards) {
    try {
      const existing = await Award.findOne({ title: awardItem.title, year: awardItem.year });
      if (!existing) {
        await Award.create({
          title: awardItem.title,
          year: awardItem.year,
          image: awardItem.image,
          description: awardItem.description,
        });
        imported++;
        console.log(`✓ Imported: ${awardItem.title} (${awardItem.year})`);
      } else {
        skipped++;
        console.log(`⊘ Skipped (already exists): ${awardItem.title} (${awardItem.year})`);
      }
    } catch (error) {
      errors.push(`Failed to import "${awardItem.title}": ${error.message}`);
      console.error(`✗ Error importing "${awardItem.title}":`, error.message);
    }
  }
  console.log('\n=== Awards import summary ===');
  console.log(`Total awards: ${awards.length}`);
  console.log(`Imported: ${imported}`);
  console.log(`Skipped: ${skipped}`);
  if (errors.length) {
    console.log(`Errors: ${errors.length}`);
    errors.forEach(err => console.error(`  - ${err}`));
  }
}

async function runImportActivities() {
  console.log('Reading Updates_Array.js...');
  const activitiesData = loadActivitiesData();
  console.log(`Found ${activitiesData.length} activities to process\n`);

  let imported = 0;
  let skipped = 0;
  let errCount = 0;
  const errorDetails = [];

  for (let i = 0; i < activitiesData.length; i++) {
    const item = activitiesData[i];
    try {
      const activityName =
        item['Name of the activity'] || item['Name of the activity \nDD-MM-YYYY'];
      const dateString = item['Date of the activity \nDD-MM-YYYY'] || item['Date of the activity'];
      const studentsCount = parseInt(
        item['Number of students participated in such activities'] || '0',
        10
      );
      const reportLink = item['Web Links'] || '';
      const year = item['Year'] || '';

      if (!activityName || !dateString || !reportLink) {
        errCount++;
        errorDetails.push(`Row ${i + 1}: Missing required fields`);
        continue;
      }

      const activityDate = parseDate(dateString);
      if (!activityDate || isNaN(activityDate.getTime())) {
        errCount++;
        errorDetails.push(`Row ${i + 1}: Invalid date: "${dateString}"`);
        continue;
      }

      const existing = await Activity.findOne({ name: activityName, date: activityDate });
      if (!existing) {
        await Activity.create({
          name: activityName,
          date: activityDate,
          year: year || undefined,
          studentsParticipated: studentsCount || 0,
          reportLink,
        });
        imported++;
        if ((imported + skipped) % 50 === 0) {
          console.log(`Progress: ${imported + skipped}/${activitiesData.length}...`);
        }
      } else {
        skipped++;
      }
    } catch (error) {
      errCount++;
      errorDetails.push(`Row ${i + 1}: ${error.message}`);
      if (errCount <= 10) console.error(`✗ Row ${i + 1}:`, error.message);
    }
  }

  console.log('\n=== Activities import summary ===');
  console.log(`Total rows: ${activitiesData.length}`);
  console.log(`Imported: ${imported}`);
  console.log(`Skipped (already exists): ${skipped}`);
  console.log(`Errors: ${errCount}`);
  if (errorDetails.length && errCount <= 20) {
    console.log('\nError details:');
    errorDetails.forEach(e => console.error(`  - ${e}`));
  } else if (errCount > 20) {
    console.log(`\n(First errors shown; total errors: ${errCount})`);
  }
}

async function runVerify() {
  const newsCount = await News.countDocuments();
  const awardCount = await Award.countDocuments();
  const activityCount = await Activity.countDocuments();
  console.log('--- Database counts ---');
  console.log(`News: ${newsCount}`);
  console.log(`Awards: ${awardCount}`);
  console.log(`Activities: ${activityCount}`);
  const latest = await Activity.find().sort({ createdAt: -1 }).limit(2).lean();
  console.log('\nLatest activities (sample):', latest);
}

async function runReset() {
  console.log('Resetting collections...');
  await mongoose.connection.db.dropCollection('users').catch(() => {});
  await mongoose.connection.db.dropCollection('gopadmins').catch(() => {});
  await mongoose.connection.db.dropCollection('news').catch(() => {});
  await mongoose.connection.db.dropCollection('awards').catch(() => {});
  await mongoose.connection.db.dropCollection('activities').catch(() => {});
  console.log('✓ Cleared users, gopadmins, news, awards, activities\n');

  console.log('Seeding default users...');
  for (const u of defaultUsers) {
    const passwordHash = await bcrypt.hash(u.password, 10);
    await User.create({
      userID: u.userID,
      name: u.name,
      passwordHash,
      role: u.role,
      email: u.email,
    });
    console.log(`  - Created ${u.role}: ${u.userID} / ${u.password}`);
  }
  console.log('✓ Users seeded\n');

  for (const n of newsArticles) {
    await News.create({
      title: n.title,
      date: n.date,
      imageUrl: n.imageUrl,
      excerpt: n.excerpt,
      link: n.link || '',
    });
  }
  console.log(`✓ Seeded ${newsArticles.length} news articles\n`);

  for (const a of awards) {
    await Award.create({
      title: a.title,
      year: a.year,
      image: a.image,
      description: a.description,
    });
  }
  console.log(`✓ Seeded ${awards.length} awards\n`);

  const activitiesData = loadActivitiesData();
  let seeded = 0;
  for (const item of activitiesData) {
    const activityName = item['Name of the activity'] || item['Name of the activity \nDD-MM-YYYY'];
    const dateString = item['Date of the activity \nDD-MM-YYYY'] || item['Date of the activity'];
    const reportLink = item['Web Links'] || '';
    const activityDate = parseDate(dateString);
    if (!activityName || !activityDate || !reportLink) continue;
    await Activity.create({
      name: activityName,
      date: activityDate,
      year: item['Year'] || undefined,
      studentsParticipated: parseInt(
        item['Number of students participated in such activities'] || '0',
        10
      ),
      reportLink,
    });
    seeded++;
  }
  console.log(`✓ Seeded ${seeded} activities from Updates_Array.js\n`);
  console.log('-------------------------------------------');
  console.log('DATABASE RESET AND SEED COMPLETED');
  console.log('-------------------------------------------');
}

function printHelp() {
  console.log(`
Smart Village — MongoDB migrate (monolith)

  node scripts/migrate.js [command] [options]

Commands:
  all (default)   Import news, awards, activities (idempotent)
  news            Import news only
  awards          Import awards only
  activities      Import activities from app/(pages)/activities/Updates_Array.js
  verify          Print collection counts and sample activities
  reset --confirm Drop users/news/awards/activities (+ gopadmins) and full reseed

Requires MONGODB_URI in .env.local and: npm install
`);
}

async function main() {
  const argv = process.argv.slice(2);
  const hasConfirm = argv.includes('--confirm');
  const cmd = argv.find(a => !a.startsWith('-')) || 'all';

  if (argv.includes('help') || argv.includes('-h') || argv.includes('--help')) {
    printHelp();
    process.exit(0);
  }

  if (cmd === 'reset') {
    if (!hasConfirm) {
      console.error('Refusing to reset without --confirm (destructive).');
      process.exit(1);
    }
  }

  try {
    const uri = getMongoUri();
    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('✓ Connected\n');

    if (cmd === 'reset') {
      await runReset();
    } else if (cmd === 'verify') {
      await runVerify();
    } else if (cmd === 'news') {
      await runImportNews();
    } else if (cmd === 'awards') {
      await runImportAwards();
    } else if (cmd === 'activities') {
      await runImportActivities();
    } else if (cmd === 'all') {
      await runImportNews();
      console.log('');
      await runImportAwards();
      console.log('');
      await runImportActivities();
    } else {
      console.error(`Unknown command: ${cmd}`);
      printHelp();
      process.exit(1);
    }

    await mongoose.disconnect();
    console.log('\n✓ Disconnected from MongoDB');
    process.exit(0);
  } catch (err) {
    console.error('✗ Failed:', err.message || err);
    try {
      await mongoose.disconnect();
    } catch (_) {}
    process.exit(1);
  }
}

main();

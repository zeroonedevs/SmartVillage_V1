/**
 * Script to import awards from static data into MongoDB
 * Run with: node scripts/awardsupdate.js
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// Import Award model
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

const Award = mongoose.models.Award || mongoose.model('Award', AwardSchema);

// Static awards data
const awards = [
  {
    id: 1,
    title: "Social Impact Excellence",
    image: "https://i.imghippo.com/files/QI7955AxM.png",
    description: "In 2022, KL University won the 'Outreach and Society' award for its Smart Village Revolution (SVR), recognizing efforts in rural development and societal well-being.",
    year: "2022"
  },
  {
    id: 2,
    title: "Best Village Development Project",
    image: "https://i.imghippo.com/files/jlUa1209myY.png",
    description: "In 2023, Mr. K. UdayKiran won the 'Best Project of the Year' award from the Police Department for his innovative security alarm system, enhancing safety in villages.",
    year: "2023"
  },
  {
    id: 3,
    title: "Best Village Development Project",
    image: "https://i.imghippo.com/files/zmXC3389OaI.png",
    description: "In 2024, Chaitanya and Kalyan received the award from the Election Commission of India for innovative public awareness initiatives.",
    year: "2024"
  },
  {
    id: 4,
    title: "Best Village Development Project",
    image: "https://i.imghippo.com/files/rc8332QE.png",
    description: "Mr. J. V. Kalyan received appreciation from HANDS for his outstanding contribution to Cardiopulmonary Resuscitation (CPR) training.",
    year: "2024"
  },
  {
    id: 5,
    title: "Best Village Development Project",
    image: "https://i.imghippo.com/files/qh5232gvs.png",
    description: "Received the Fellowship Award from APSACS Department for exceptional contributions to public health and awareness initiatives.",
    year: "2024"
  },
  {
    id: 6,
    title: "Best Village Development Project",
    image: "https://i.imghippo.com/files/FD9892Urk.png",
    description: "Received the 27TH NATIONAL YOUTH FESTIVAL Award from ministry of youth affairs and sports.",
    year: "2024"
  },
  {
    id: 7,
    title: "Best Village Development Project",
    image: "https://i.imghippo.com/files/Gd2054A.png",
    description: "Sk. Sameera has been appointed as the Zonal Incharge for AISU (All India Students Union), showcasing her leadership and dedication to student welfare in Community development.",
    year: "2024"
  },
  {
    id: 8,
    title: "Best Village Development Project",
    image: "https://i.imghippo.com/files/Fk7604VQ.png",
    description: "D. Amarnadh secured 1st prize in the National-level Agri-Drone competition, demonstrating exceptional innovation and expertise in agricultural technology.",
    year: "2023"
  },
];

async function importAwards() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error('Please define the MONGODB_URI environment variable in .env.local');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    let imported = 0;
    let skipped = 0;
    const errors = [];

    // Import each award
    for (const awardItem of awards) {
      try {
        // Check if award already exists (by title and year)
        const existing = await Award.findOne({
          title: awardItem.title,
          year: awardItem.year
        });

        if (!existing) {
          await Award.create({
            title: awardItem.title,
            year: awardItem.year,
            image: awardItem.image,
            description: awardItem.description
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

    console.log('\n=== Import Summary ===');
    console.log(`Total awards: ${awards.length}`);
    console.log(`Imported: ${imported}`);
    console.log(`Skipped (already exists): ${skipped}`);
    if (errors.length > 0) {
      console.log(`Errors: ${errors.length}`);
      errors.forEach(err => console.error(`  - ${err}`));
    }

    await mongoose.disconnect();
    console.log('\n✓ Disconnected from MongoDB');
    console.log('✓ Import completed successfully!');

  } catch (error) {
    console.error('✗ Import failed:', error);
    process.exit(1);
  }
}

// Run the import
importAwards();

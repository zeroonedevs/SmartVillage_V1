/**
 * Script to import activity reports from Updates_Array.js into MongoDB
 * Run with: node scripts/import-activities.js
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Import Activity model
const ActivitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide an activity name'],
  },
  date: {
    type: Date,
    required: [true, 'Please provide an activity date'],
  },
  domain: {
    type: String,
    required: false,
  },
  year: {
    type: String,
    required: false,
  },
  studentsParticipated: {
    type: Number,
    required: [true, 'Please provide the number of students who participated'],
  },
  reportLink: {
    type: String,
    required: [true, 'Please provide a link to the report'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

const Activity = mongoose.models.Activity || mongoose.model('Activity', ActivitySchema);

// Helper function to parse date string (DD-MM-YYYY or DD.MM.YYYY)
// Handles date ranges by using the start date
function parseDate(dateString) {
  if (!dateString) return null;
  
  // Handle date ranges (e.g., "14-08-2023 to 15-08-2023")
  let dateToParse = dateString;
  if (dateString.toLowerCase().includes('to')) {
    const parts = dateString.split(/to/i);
    dateToParse = parts[0].trim();
  }
  
  // Replace dots with dashes
  const normalized = dateToParse.replace(/\./g, '-').trim();
  
  // Try DD-MM-YYYY format
  const parts = normalized.split('-');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
    const year = parseInt(parts[2], 10);
    
    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      return new Date(year, month, day);
    }
  }
  
  return null;
}

async function importActivities() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error('Please define the MONGODB_URI environment variable in .env.local');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // Read the Updates_Array.js file
    const filePath = path.join(__dirname, '../app/(pages)/activities/Updates_Array.js');
    console.log(`Reading file: ${filePath}`);
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Extract the array data using regex (since it's a JS file)
    const arrayMatch = fileContent.match(/const newData = \[([\s\S]*)\];/);
    if (!arrayMatch) {
      throw new Error('Could not find newData array in Updates_Array.js');
    }

    // Evaluate the array (safe since it's our own file)
    const arrayString = arrayMatch[1];
    // Use eval to parse the array (safe in this context as it's our own file)
    const activitiesData = eval(`[${arrayString}]`);

    console.log(`Found ${activitiesData.length} activities to import\n`);

    let imported = 0;
    let skipped = 0;
    let errors = 0;
    const errorDetails = [];

    // Import each activity
    for (let i = 0; i < activitiesData.length; i++) {
      const item = activitiesData[i];
      try {
        const activityName = item['Name of the activity'] || item['Name of the activity \nDD-MM-YYYY'];
        const dateString = item['Date of the activity \nDD-MM-YYYY'] || item['Date of the activity'];
        const studentsCount = parseInt(item['Number of students participated in such activities'] || '0', 10);
        const reportLink = item['Web Links'] || '';
        const year = item['Year'] || '';

        if (!activityName || !dateString || !reportLink) {
          errors++;
          errorDetails.push(`Row ${i + 1}: Missing required fields (name: ${!!activityName}, date: ${!!dateString}, link: ${!!reportLink})`);
          continue;
        }

        // Parse date
        const activityDate = parseDate(dateString);
        if (!activityDate || isNaN(activityDate.getTime())) {
          errors++;
          errorDetails.push(`Row ${i + 1}: Invalid date format: "${dateString}"`);
          continue;
        }

        // Check if activity already exists (by name and date)
        const existing = await Activity.findOne({
          name: activityName,
          date: activityDate
        });

        if (!existing) {
          await Activity.create({
            name: activityName,
            date: activityDate,
            year: year || undefined,
            studentsParticipated: studentsCount || 0,
            reportLink: reportLink
          });
          imported++;
          if ((imported + skipped) % 50 === 0) {
            console.log(`Progress: ${imported + skipped}/${activitiesData.length}...`);
          }
        } else {
          skipped++;
        }
      } catch (error) {
        errors++;
        errorDetails.push(`Row ${i + 1}: ${error.message}`);
        if (errors <= 10) {
          console.error(`✗ Error importing row ${i + 1}:`, error.message);
        }
      }
    }

    console.log('\n=== Import Summary ===');
    console.log(`Total activities: ${activitiesData.length}`);
    console.log(`Imported: ${imported}`);
    console.log(`Skipped (already exists): ${skipped}`);
    console.log(`Errors: ${errors}`);
    
    if (errorDetails.length > 0 && errors <= 20) {
      console.log('\nError Details:');
      errorDetails.forEach(err => console.error(`  - ${err}`));
    } else if (errors > 20) {
      console.log(`\n(Showing first 10 errors, total: ${errors})`);
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
importActivities();

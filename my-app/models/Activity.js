
import mongoose from 'mongoose';

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

export default mongoose.models.Activity || mongoose.model('Activity', ActivitySchema);

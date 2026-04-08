
import mongoose from 'mongoose';

const GopRegistrationSchema = new mongoose.Schema({
  orgName: {
    type: String,
    required: [true, 'Please provide an organization name'],
    trim: true,
  },
  category: {
    type: String,
    trim: true,
  },
  contactPerson: {
    type: String,
    required: [true, 'Please provide a contact person name'],
    trim: true,
  },
  designation: {
    type: String,
    trim: true,
  },
  contactEmail: {
    type: String,
    required: [true, 'Please provide a contact email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email',
    ],
    trim: true,
  },
  contactPhone: {
    type: String,
    required: [true, 'Please provide a contact phone number'],
    trim: true,
  },
  orgAddress: {
    type: String,
    trim: true,
  },
  tenure: {
    type: String,
    trim: true,
  },
  interestedDomains: {
    type: [String], // Array of strings
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.GopRegistration || mongoose.model('GopRegistration', GopRegistrationSchema);

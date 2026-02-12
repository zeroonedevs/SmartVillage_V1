import mongoose from 'mongoose';

const StaffSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        maxlength: [60, 'Name cannot be more than 60 characters'],
    },
    designation: {
        type: String,
        required: [true, 'Please provide a designation'],
        maxlength: [60, 'Designation cannot be more than 60 characters'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

if (mongoose.models.Staff) {
    delete mongoose.models.Staff;
}

const Staff = mongoose.models.Staff || mongoose.model('Staff', StaffSchema);

export default Staff;

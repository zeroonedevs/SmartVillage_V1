import mongoose from 'mongoose';

const VillageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a village name'],
        maxlength: [60, 'Name cannot be more than 60 characters'],
    },
    mandal: {
        type: String,
        required: [true, 'Please provide a mandal'],
        maxlength: [60, 'Mandal cannot be more than 60 characters'],
    },
    district: {
        type: String,
        required: [true, 'Please provide a district'],
        maxlength: [60, 'District cannot be more than 60 characters'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

if (mongoose.models.Village) {
    delete mongoose.models.Village;
}

const Village = mongoose.models.Village || mongoose.model('Village', VillageSchema);

export default Village;

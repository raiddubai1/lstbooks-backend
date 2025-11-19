import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['pdf', 'video'], required: true },
  url: { type: String, required: true }
});

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  yearId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Year',
    required: false // Optional for backward compatibility with existing subjects
  },
  resources: [resourceSchema]
}, {
  timestamps: true
});

// Index for faster queries by year
subjectSchema.index({ yearId: 1 });

const Subject = mongoose.model('Subject', subjectSchema);

export default Subject;


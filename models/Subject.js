import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['pdf', 'video'], required: true },
  url: { type: String, required: true }
});

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  resources: [resourceSchema]
}, {
  timestamps: true
});

const Subject = mongoose.model('Subject', subjectSchema);

export default Subject;


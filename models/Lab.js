import mongoose from 'mongoose';

const labSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  description: { type: String, required: true },
  steps: [{ type: String }],
  completedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, {
  timestamps: true
});

export default mongoose.model('Lab', labSchema);


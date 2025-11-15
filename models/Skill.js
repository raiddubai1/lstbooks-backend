import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema({
  type: { type: String, enum: ['image', 'video'], required: true },
  url: { type: String, required: true }
});

const skillSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  description: { type: String, required: true },
  media: [mediaSchema]
}, {
  timestamps: true
});

const Skill = mongoose.model('Skill', skillSchema);

export default Skill;


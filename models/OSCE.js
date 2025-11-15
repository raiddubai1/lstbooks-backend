import mongoose from 'mongoose';

const osceStationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
  description: { type: String, required: true },
  steps: [{ type: String }]
}, {
  timestamps: true
});

const OSCEStation = mongoose.model('OSCEStation', osceStationSchema);

export default OSCEStation;


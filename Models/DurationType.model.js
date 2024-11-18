import mongoose from 'mongoose';

const { Schema } = mongoose;

const DurationSchema = new Schema({
  durationName: {
    type: String,
    required: true,
  },
  durationDescription: {
    type: String,
    default: null
  },
  durationImg: {
    type: String,
    default: null
  },
  status: {
    type: Number,
    default: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const DurationType = mongoose.model('duration_type', DurationSchema);
export default DurationType;

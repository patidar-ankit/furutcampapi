import mongoose from 'mongoose';

const { Schema } = mongoose;

const experienceTypeSchema = new Schema({
  experienceName: {
    type: String,
    required: true,
  },
  experienceDescription: {
    type: String,
    default: null
  },
  experienceImg: {
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


const ExperienceType = mongoose.model('experience_type', experienceTypeSchema);
export default ExperienceType;

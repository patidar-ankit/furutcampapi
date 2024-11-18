import mongoose from 'mongoose';

const { Schema } = mongoose;

const StayTypeSchema = new Schema({
  stayType: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: null
  },
  stayImg: {
    type: String,
    default: null
  },
  code: {
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


const StayType = mongoose.model('stay_type', StayTypeSchema);
export default StayType;

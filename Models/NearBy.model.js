import mongoose from 'mongoose';

const { Schema } = mongoose;

const nearBySchema = new Schema({
  placeName: {
    type: String,
    default: null
  },
  state: {
    type: String,
    default: null
  },
  district: {
    type: String,
    default: null
  },
  description: {
    type: String,
    default: null
  },
  media: {
    type: String,
    default: null
  },
  latitude: {
    type: String,
    default: null
  },
  longitude: {
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


const NearBy = mongoose.model('near_by', nearBySchema);
export default NearBy;

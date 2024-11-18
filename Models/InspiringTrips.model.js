import mongoose from 'mongoose';

const { Schema } = mongoose;

const inspiringTripSchema = new Schema({
  title: {
    type: String,
    default: null,
  },
  description: {
    type: String,
    default: null
  },
  by: {
    type: String,
    default: null
  },
  meadia:{
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


const InspiringTrips = mongoose.model('inspiring_trip', inspiringTripSchema);
export default InspiringTrips;

import mongoose from 'mongoose';

const { Schema } = mongoose;

const ratingSchema = new Schema({
  tripBookingId: {
    type: String,
    default: null
  },
  ratingBy: {
    type: String,
    default: null
  },
  rating: {
    type: Number,
    default: null
  },
  ratingDescription: {
    type: String,
    default: null
  },
  note: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const Rating = mongoose.model('rating', ratingSchema);
export default Rating;

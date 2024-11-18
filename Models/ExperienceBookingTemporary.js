import mongoose from 'mongoose';

const { Schema } = mongoose;

const experienceBookingTemporarySchema = new Schema({
  hostId: {
    type: String,
    default: null
  },
  userId: {
    type: String,
    default: null,
  },
  booking: {
    type: Object,
    default: null
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const ExperienceBookingTemporary = mongoose.model('exp_booking_temporary', experienceBookingTemporarySchema);
export default ExperienceBookingTemporary;

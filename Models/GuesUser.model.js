import mongoose from 'mongoose';

const { Schema } = mongoose;

const guestUserSchema = new Schema({
  name: {
    type: String,
    default: null
  },
  email: {
    type: String,
    default: null,
    lowercase: true,
    // unique: true,
  },
  mobileNo: {
    type: String,
    default: null,
  },
  guestType: {
    type: Number,   //0 - Adults, 1 - Children
    default: 0
  },
  primaryguestId: {
    type: String,
    default: null
  },
  tripBookingId: {
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


const GuestUser = mongoose.model('guest_user', guestUserSchema);
export default GuestUser;

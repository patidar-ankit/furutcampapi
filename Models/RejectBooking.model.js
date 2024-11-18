import mongoose from 'mongoose';

const { Schema } = mongoose;

const rejectBookingSchema = new Schema({
  bookingId: {
    type: String,
    required: true,
  },
  rejectReason: {
    type: String,
    default: null
  },
  rejectMsg: {
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


const RejectBooking = mongoose.model('reject_booking', rejectBookingSchema);
export default RejectBooking;

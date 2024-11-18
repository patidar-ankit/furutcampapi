import mongoose from 'mongoose';

const { Schema } = mongoose;

const eventBookingTemporarySchema = new Schema({
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


const EventBookingTemporary = mongoose.model('event_booking_temporary', eventBookingTemporarySchema);
export default EventBookingTemporary;

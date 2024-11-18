import mongoose from 'mongoose';

const { Schema } = mongoose;

const bookingCartSchema = new Schema({
  propertyId: {
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


const BookingCart = mongoose.model('booking_cart', bookingCartSchema);
export default BookingCart;

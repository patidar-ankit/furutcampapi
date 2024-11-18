import mongoose from 'mongoose';

const { Schema } = mongoose;

const conveyenceBookingSchema = new Schema({
  
  tripBookingId: {
    type: String,
    default: null
  },
  packageId: {
    type: String,
    required: true,
  },
  conveyanceId: {
    type: String,
    default: null
  },
  conveyenceCount: {
    type: String,
    default: null
  },
  vehicleNumber: {
    type: String,
    required: true,
  },
  dropLoc: {
    type: String,
    default: null
  },
  pickupLoc: {
    type: String,
    default: null
  },
  priceWeekend: {
    type: Number,
    default: null
  },
  regularDays: {
    type: Number,
    default: null
  },
  vehicleType:{
    type: String,
    default: null
  },
  isWeekendPrice:{
    type: Boolean,
    default: false
  },
  price: {
    type: Number,
    default: null
  },
  totalPrice: {
    type: String,
    default: null
  },

  pickupDropDate: {
    type: Date,
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


const ConveyenceBooking = mongoose.model('conveyence_booking', conveyenceBookingSchema);
export default ConveyenceBooking;

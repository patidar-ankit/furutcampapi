import mongoose from 'mongoose';

const { Schema } = mongoose;

const stayBookingSchema = new Schema({
  
  tripBookingId: {
    type: String,
    default: null
  },
  propertyId: {
    type: String,
    default: null
  },
  stayId: {
    type: String,
    default: null
  },
  stayTypeId: {
    type: String,
    default: null
  },
  stayType: {
    type: String,
    default: null
  },
  perPerson: {
    type: Boolean,
    default: null
  },
  stayCount: {
    type: Number,
    default: null
  },
  price: {
    type: Number,
    default: null
  },
  priceRegular: {
    type: Number,
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
  weekendDays: {
    type: Number,
    default: null
  },
  totalPrice: {
    type: Number,
    default: null
  },
  adults: {
    type: Number,
    default: null
  },
  children: {
    type: Number,
    default: null
  },
  pet: {
    type: Number,
    default: null
  },
  checkInDate: {
    type: Date,
    default: null
  },
  checkOutDate: {
    type: Date,
    default: null
  },
  countCapacity: {
    type: Number,
    default: null
  },
  stayDay: {
    type: Number,
    default: null
  },
  hostId:{
    type: String,
    default: null
  },
  status: {
    type: Number,
    default: 0,    //// status : 0 - pending, 1 - approved, 2 - reject,  3 - checkin, 4 - checkout
  },
  isAutoRejected: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const StayBooking = mongoose.model('stay_booking', stayBookingSchema);
export default StayBooking;

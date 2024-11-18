import mongoose from 'mongoose';

const { Schema } = mongoose;

const experienceBookingSchema = new Schema({
  
  tripBookingId: {
    type: String,
    default: null
  },
  hostId:{
    type: String,
    default: null
  },
  adults:{
    type: Number,
    default: 0
  },
  children:{
    type: Number,
    default: 0
  },
  experienceId: {
    type: String,
    required: true,
  },
  experienceName: {
    type: String,
    default: null
  },
  experienceType: {
    type: String,
    default: null
  },
  experienceCount: {
    type: Number,
    required: true,
  },
  isWeekendPrice:{
    type: Boolean,
    default: false
  },
  perPerson: {
    type: Boolean,
    default: 0    // 0 - fale, 1 - true
  },
  minPerosn: {
    type: Number,
    default: null
  },
  maxPerson: {
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
  totalPaidAmount: {
    type: Number,
    default:0
  },
  guest: {
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
city:{
    type: Number,
    default: null
  },
  status: {
    type: Number,
    default: 0,   //// status : 0 - pending, 1 - approved, 2 - reject,  3 - checkin, 4 - checkout
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


const ExperienceBooking = mongoose.model('experience_booking', experienceBookingSchema);
export default ExperienceBooking;

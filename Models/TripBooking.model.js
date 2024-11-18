import mongoose from 'mongoose';

const { Schema } = mongoose;

const tripBookingSchema = new Schema({
  hostId: {
    type: String,
    required: false,
  },
  userId: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    default: null
  },
  primaryguestName: {
    type: String,
    default: null
  },
  primaryguestEmail: {
    type: String,
    default: null
  },
  primaryguestPhone: {
    type: String,
    default: null
  },
  propertyId: {
    type: String,
    default: null
  },
  countAdults: {
    type: String,
    default: null
  },
  countChildren: {
    type: String,
    default: null
  },
  countPet: {
    type: String,
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
  status: {
    type: Number,
    default: 0,   /// 0 - pending, 1 - approved, 2 - approved all booking , 3 - reject all booking, 4 - checkIn ,  5 - CheckIn All, 6 - Checkout  
  },
  checkInCheckOuteStatus: {
    type: Number,
    default: 0,   /// 0 - pending, 1 - CheckIn, 2 - CheckOute 
  },
  totalPrice: {
    type: Number,
    default:0
  },
  totalPaidAmount: {
    type: Number,
    default:0
  },
  isCollectAmount: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const TripBooking = mongoose.model('trip_booking', tripBookingSchema);
export default TripBooking;

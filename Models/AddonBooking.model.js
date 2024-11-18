import mongoose from 'mongoose';

const { Schema } = mongoose;

const addonBookingTypeSchema = new Schema({
  tripBookingId: {
    type: String,
    default: null
  },
  addonId: {
    type: String,
    required: true,
  },
  propertyId:{
    type:String,
    default: null
  },
  addonTypeId: {
    type: String,
    required: true,
  },
  addonTypeName: {
    type: String,
    default: null
  },
  serviceDescription: {
    type: String,
    default: null
  },
  serviceName: {
    type: String,
    default: null
  },
  addonCount: {
    type: Number,
    default: 0
  },
  hostId: {
    type: String,
    default: null
  },
  userId: {
    type: String,
    default: null
  },
  perPersonDay: {
    type: Boolean,
    default: true     /// true - Per Person  Day,  false - Per Service Day,
  },
  price:{
    type : Number,
    default: null
  },
  status: {
    type: Number,
    default: 1,
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


const AddonBooking = mongoose.model('addon_booking', addonBookingTypeSchema);
export default AddonBooking;

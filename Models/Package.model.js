import mongoose from 'mongoose';

const { Schema } = mongoose;

const packageSchema = new Schema({
  conveyanceId: {
    type: String,
    default: null
  },
  packageId: {
    type: String,
    default: null
  },
  packageName: {
    type: String,
    default: null
  },
  serviceDescription: {
    type: String,
    default: null
  },
  pickupLoc: {
    type: String,
    default: null
  },
  dropLoc: {
    type: String,
    default: null
  },
  priceRegular: {
    type: String,
    default: null
  },
  priceWeekend: {
    type: String,
    default: null
  },
  perKmPerHr: {
    type: Number,     
    default: 0,  // 1-per Km, 2-Per Hr
  },
  status: {
    type: Number,     
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const Package = mongoose.model('package', packageSchema);
export default Package;

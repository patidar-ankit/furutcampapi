import mongoose from 'mongoose';

const { Schema } = mongoose;

const addonTypeSchema = new Schema({
  propertyId: {
    type: String,
    required: true,
  },
  addonTypeId: {
    type: String,
    required: true,
  },
  addonTypeName: {
    type: String,
    default: null
  },
  serviceName: {
    type: String,
    default: null
  },
  serviceDescription: {
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
    type: Number,   /// Change Status - (0-Draft/1-Published/2-Closed)
    default: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const Addons = mongoose.model('addon', addonTypeSchema);
export default Addons;

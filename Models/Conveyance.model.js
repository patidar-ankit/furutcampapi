import mongoose from 'mongoose';

const { Schema } = mongoose;

const conveyanceSchema = new Schema({
  userId: {
    type: String,
    default: null
  },
  propertyId: {
    type: String,
    default : null
 },
  conveyanceTypeId: {
    type: String,
    default: null
  },
  conveyanceTypeName: {
    type: String,
    default: null
  },
  vehicleNumber: {
    type: String,
    default: null
  },
  maxPerson: {
    type: Number,
    default: null
  },
  make: {
    type: String,
    default: null
  },
  model: {
    type: String,
    default: null
  },
  vehicleType:{
    type: String,
    default: null  
  },
  conveyanceStatus: {
    type: Number,     //// 0-unpublished,1-Published,2-Active
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const Conveyance = mongoose.model('conveyance', conveyanceSchema);
export default Conveyance;

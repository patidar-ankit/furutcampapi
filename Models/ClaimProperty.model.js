import mongoose from 'mongoose';

const { Schema } = mongoose;

const claimPropertySchema = new Schema({
  hostId: {
    type: String,
    default: null
  },
  propertyLocation: {
    type: String,
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


const ClaimProperty = mongoose.model('claim_property', claimPropertySchema);
export default ClaimProperty;

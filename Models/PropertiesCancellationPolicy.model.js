import mongoose from 'mongoose';

const { Schema } = mongoose;

const propertiesCancellationPolicySchema = new Schema({
  policy: {
    type: Array,
    required: true,
  },
  policyType: {
    type: Number,   /// 1-easy,2-Strict,3-Eco, 4 - custome
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


const PropertiesCancellationPolicy = mongoose.model('properties_cancellation_policy', propertiesCancellationPolicySchema);
export default PropertiesCancellationPolicy;

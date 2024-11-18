import mongoose from 'mongoose';

const { Schema } = mongoose;

const propCancellationPolicySchema = new Schema({
  policy: {
    type: String,
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


const PropCancellationPolicy = mongoose.model('pro_cancellation_policy', propCancellationPolicySchema);
export default PropCancellationPolicy;

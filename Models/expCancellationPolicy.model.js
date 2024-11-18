import mongoose from 'mongoose';

const { Schema } = mongoose;

const ExpCancelaationPolicySchema = new Schema({
  policy: {
    type: String,
    required: true,
  },
  policyType: {
    type: Number,   /// 1-Esay,2-Strict,3-Moderate, 4 - Custome
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


const ExpCancellationPolicy = mongoose.model('exp_cancellation_policy', ExpCancelaationPolicySchema);
export default ExpCancellationPolicy;

import mongoose from 'mongoose';

const { Schema } = mongoose;

const experienceCancellationPolicySchema = new Schema({
  policy: {
    type: Array,
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


const ExperienceCancellationPolicy = mongoose.model('experience_cancellation_policy', experienceCancellationPolicySchema);
export default ExperienceCancellationPolicy;

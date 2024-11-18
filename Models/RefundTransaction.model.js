import mongoose from 'mongoose';

const { Schema } = mongoose;

const refundTransactionSchema = new Schema({
  tripBookingId: {
    type: String,
    default: null
  },
  refund_id: {
    type: String,
    default: null
  },
  entity: {
    type: String,
    required: true,
  },
  receipt: {
    type: String,
    default: null
  },
  amount: {
    type: Number,
    default: null
  },
  payment_id: {
    type: String,
    default: null
  },
  currency: {
    type: String,
    default: null
  },

  speed_requested: {
    type: String,
    default: null
  },

  speed_processed: {
    type: String,
    default: null
  },
  status: {
    type: String,
    default: null
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const RefundTransaction = mongoose.model('refund_transaction', refundTransactionSchema);
export default RefundTransaction;

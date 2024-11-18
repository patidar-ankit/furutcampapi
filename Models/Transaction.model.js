import mongoose from 'mongoose';

const { Schema } = mongoose;

const transactionSchema = new Schema({
  tripBookingId: {
    type: String,
    default: null
  },
  razorpay_payment_id: {
    type: String,
    default: null
  },
  razorpay_order_id: {
    type: String,
    default: null,
  },
  razorpay_signature: {
    type: String,
    default: null
  },
  amount: {
    type: Number,
    default: null
  },
  paymentBy: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const Transaction = mongoose.model('transaction', transactionSchema);
export default Transaction;

import mongoose from 'mongoose';

const { Schema } = mongoose;

const ExpCarrySchema = new Schema({
  carryName: {
    type: String,
    required: true,
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


const ExpCarry = mongoose.model('exp_carry', ExpCarrySchema);
export default ExpCarry;

import mongoose from 'mongoose';

const { Schema } = mongoose;

const ExpIncludesSchema = new Schema({
  includesName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: null,
  },
  img: {
    type: String,
    default: null,
  },
  code: {
    type: String,
    default: null,
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


const ExpIncludes = mongoose.model('exp_includes', ExpIncludesSchema);
export default ExpIncludes;

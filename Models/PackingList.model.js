import mongoose from 'mongoose';

const { Schema } = mongoose;

const packingListSchema = new Schema({
  type: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    default: null
  },
  description: {
    type: String,
    default: null
  },
  linkTitle: {
    type: String,
    default: null
  },
  link: {
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


const PackingList = mongoose.model('packing_list', packingListSchema);
export default PackingList;

import mongoose from 'mongoose';

const { Schema } = mongoose;

const transportationModeSchema = new Schema({
  name: {
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
  status: {
    type: Number,
    default: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const TransportationMode = mongoose.model('transportation_mode', transportationModeSchema);
export default TransportationMode;

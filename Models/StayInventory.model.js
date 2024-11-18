import mongoose from 'mongoose';

const { Schema } = mongoose;

const stayInventorySchema = new Schema({
  stayId: {
    type: String,
    default: null,
  },
  booked: {
    type: Number,
    default: 0
  },
  capacity: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
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


const StayInventory = mongoose.model('stay_inventory', stayInventorySchema);
export default StayInventory;

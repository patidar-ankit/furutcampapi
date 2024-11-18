import mongoose from 'mongoose';

const { Schema } = mongoose;

const experienceInventorySchema = new Schema({
  experienceId: {
    type: String,
    default: null,
  },
  bookingDate: {
    type: Date,
    default: null
  },
  booked: {
    type: Number,
    default: 0
  },
  capacity: {
    type: Number,
    default: 0
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


const ExperienceInventory = mongoose.model('experience_inventory', experienceInventorySchema);
export default ExperienceInventory;

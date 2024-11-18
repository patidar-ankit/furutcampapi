import mongoose from 'mongoose';

const { Schema } = mongoose;

const eventInventroySchema = new Schema({
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


const EventInventory = mongoose.model('event_inventory', eventInventroySchema);
export default EventInventory;

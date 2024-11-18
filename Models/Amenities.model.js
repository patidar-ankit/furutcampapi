import mongoose from 'mongoose';

const { Schema } = mongoose;

const AmenitiesSchema = new Schema({
  amenitiesName: {
    type: String,
    required: true,
  },
  amenitiesImg: {
    type: String,
    default: null
  },
  isPaid: {
    type: Number,
    default: 0
  },
  code: {
    type: String,
    default: null
  },
  default: {
    type: Boolean,
    default: false
  },
  // parent:{
  //   type: String,
  //   default: null
  // },
  status: {
    type: Number,
    default: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const Amenities = mongoose.model('amenities', AmenitiesSchema);
export default Amenities;

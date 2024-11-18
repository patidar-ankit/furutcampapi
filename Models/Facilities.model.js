import mongoose from 'mongoose';

const { Schema } = mongoose;

const FacilitiesSchema = new Schema({
  facilitiesName: {
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


const Facilities = mongoose.model('facilities', FacilitiesSchema);
export default Facilities;

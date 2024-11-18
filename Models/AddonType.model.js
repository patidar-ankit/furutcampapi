import mongoose from 'mongoose';

const { Schema } = mongoose;

const addonTypeSchema = new Schema({
  addonName: {
    type: String,
    required: true,
  },
  addonDescription: {
    type: String,
    default: null
  },
  addonImg: {
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


const AddonsType = mongoose.model('addon_type', addonTypeSchema);
export default AddonsType;

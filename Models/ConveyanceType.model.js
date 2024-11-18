import mongoose from 'mongoose';

const { Schema } = mongoose;

const ConveyanceTypeSchema = new Schema({
  conveyanceTypeName: {
    type: String,
    required: true,
  },
  conveyanceTypeDescription: {
    type: String,
    required: true,
  },
  conveyanceTypeImg: {
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


const ConveyanceType = mongoose.model('conveyance_type', ConveyanceTypeSchema);
export default ConveyanceType;

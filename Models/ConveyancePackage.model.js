import mongoose from 'mongoose';

const { Schema } = mongoose;

const conveyancePackageSchema = new Schema({
  packageName: {
    type: String,
    required: true,
  },
  packageDescription: {
    type: String,
    required: true,
  },
  packageImg: {
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


const ConveyancePackage = mongoose.model('conveyance_package', conveyancePackageSchema);
export default ConveyancePackage;

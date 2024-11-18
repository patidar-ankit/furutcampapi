import mongoose from 'mongoose';

const { Schema } = mongoose;

const adventureTypeSchema = new Schema({
  experienceTypeId: {
    type: String,
    default: null
  },
  adventureName: {
    type: String,
    required: true,
  },
  adventureDescription: {
    type: String,
    default: null
  },
  adventureImg: {
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


const AdventureType = mongoose.model('adventure_type', adventureTypeSchema);
export default AdventureType;

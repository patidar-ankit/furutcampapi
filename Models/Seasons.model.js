import mongoose from 'mongoose';

const { Schema } = mongoose;

const SeasonsSchema = new Schema({
  seasonName: {
    type: String,
    required: true,
  },
  seasonImg: {
    type: String,
    default: null
  },
  display: {
    type: String,
    default: null
  },
  code: {
    type: String,
    default: null
  },
  color: {
    type: String,
    default: null
  },
  default: {
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


const Season = mongoose.model('seasons', SeasonsSchema);
export default Season;
